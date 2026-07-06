from flask import Blueprint, jsonify, request
import requests
from urllib.parse import quote

try:
    from backend.database.db import db
    from backend.models.song import Song
except ImportError:
    from database.db import db
    from models.song import Song

song_bp = Blueprint("songs", __name__)

# Busca em Cifra Club
def search_cifra_club(query):
    """Busca músicas no Cifra Club"""
    try:
        url = f"https://www.cifraclub.com.br/busca/?q={quote(query)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            # Retorna URL da busca (parsing completo seria mais complexo)
            return {
                "source": "cifra_club",
                "url": url,
                "query": query
            }
    except:
        pass
    return None

# Busca em YouTube
def search_youtube(query):
    """Retorna URL de busca YouTube"""
    try:
        search_url = f"https://www.youtube.com/results?search_query={quote(query)}"
        return {
            "source": "youtube",
            "url": search_url,
            "query": query
        }
    except:
        pass
    return None

# Busca em Spotify (requer API, mas retorna formato básico)
def search_spotify(query):
    """Retorna URL de busca Spotify"""
    try:
        search_url = f"https://open.spotify.com/search/{quote(query)}"
        return {
            "source": "spotify",
            "url": search_url,
            "query": query
        }
    except:
        pass
    return None

@song_bp.route("/api/songs", methods=["GET"])
def get_songs():
    songs = Song.query.order_by(Song.created_at.desc()).all()
    return jsonify([song.to_dict() for song in songs])

@song_bp.route("/api/songs", methods=["POST"])
def create_song():
    data = request.json or {}

    song = Song()
    song.title = data.get("title", "Sem título")
    song.artist = data.get("artist", "Desconhecido")
    song.leader = data.get("leader")
    song.key = data.get("key")
    song.bpm = data.get("bpm")
    song.spotify_url = data.get("spotify_url")
    song.cifra_url = data.get("cifra_url")
    song.audio_url = data.get("audio_url")
    song.youtube_url = data.get("youtube_url")

    db.session.add(song)
    db.session.commit()

    return jsonify(song.to_dict()), 201

@song_bp.route("/api/songs/<int:song_id>", methods=["PATCH"])
def update_song(song_id):
    song = Song.query.get_or_404(song_id)
    data = request.json or {}

    song.title = data.get("title", song.title)
    song.artist = data.get("artist", song.artist)
    song.leader = data.get("leader", song.leader)
    song.key = data.get("key", song.key)
    song.bpm = data.get("bpm", song.bpm)
    song.spotify_url = data.get("spotify_url", song.spotify_url)
    song.cifra_url = data.get("cifra_url", song.cifra_url)
    song.audio_url = data.get("audio_url", song.audio_url)
    song.youtube_url = data.get("youtube_url", song.youtube_url)

    db.session.commit()
    return jsonify(song.to_dict())

@song_bp.route("/api/songs/<int:song_id>", methods=["DELETE"])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Música removida"})

@song_bp.route("/api/songs/search/integrations", methods=["GET"])
def search_integrations():
    """Busca música em múltiplas plataformas integradas"""
    query = request.args.get("q", "").strip()
    
    if not query or len(query) < 2:
        return jsonify({"error": "Mínimo de 2 caracteres"}), 400
    
    results = {
        "query": query,
        "sources": []
    }
    
    # Buscar em cada plataforma
    cifra_result = search_cifra_club(query)
    if cifra_result:
        results["sources"].append(cifra_result)
    
    youtube_result = search_youtube(query)
    if youtube_result:
        results["sources"].append(youtube_result)
    
    spotify_result = search_spotify(query)
    if spotify_result:
        results["sources"].append(spotify_result)
    
    # Buscar localmente na base de dados
    local_songs = Song.query.filter(
        (Song.title.ilike(f"%{query}%")) | 
        (Song.artist.ilike(f"%{query}%"))
    ).all()
    
    if local_songs:
        results["local_songs"] = [song.to_dict() for song in local_songs]
    
    return jsonify(results)

@song_bp.route("/api/songs/add-with-urls", methods=["POST"])
def add_song_with_urls():
    """Adiciona canção com URLs de múltiplas fontes"""
    data = request.json or {}
    
    # Validar campos obrigatórios
    if not data.get("title"):
        return jsonify({"error": "Título é obrigatório"}), 400
    
    song = Song()
    song.title = data.get("title")
    song.artist = data.get("artist", "Desconhecido")
    song.leader = data.get("leader")
    song.key = data.get("key")
    song.bpm = data.get("bpm")
    song.spotify_url = data.get("spotify_url")
    song.youtube_url = data.get("youtube_url")
    song.cifra_url = data.get("cifra_url")
    song.audio_url = data.get("audio_url")
    
    db.session.add(song)
    db.session.commit()
    
    return jsonify({
        "message": "Canção adicionada com sucesso",
        "song": song.to_dict()
    }), 201

