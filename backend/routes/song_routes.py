from flask import Blueprint, jsonify, request

try:
    from backend.database.db import db
    from backend.models.song import Song
except ImportError:
    from database.db import db
    from models.song import Song

song_bp = Blueprint("songs", __name__)

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
    song.youtube_url = data.get("youtube_url", song.youtube_url)

    db.session.commit()
    return jsonify(song.to_dict())

@song_bp.route("/api/songs/<int:song_id>", methods=["DELETE"])
def delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Música removida"})
