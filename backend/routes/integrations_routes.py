from flask import Blueprint, jsonify, request
import os
import requests

integrations_bp = Blueprint('integrations', __name__)

def get_spotify_token():
    """Get Spotify API access token using Client Credentials flow."""
    client_id = os.environ.get('SPOTIFY_CLIENT_ID', '')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET', '')
    auth_url = 'https://accounts.spotify.com/api/token'
    auth_data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
    }
    try:
        response = requests.post(auth_url, data=auth_data, timeout=5)
        if response.status_code == 200:
            return response.json().get('access_token')
    except Exception as e:
        print(f"Spotify token error: {e}")
    return None


@integrations_bp.route('/api/search/spotify', methods=['GET'])
def search_spotify():
    """Search for a track on Spotify."""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query required'}), 400

    token = get_spotify_token()
    if not token:
        return jsonify({'error': 'Spotify credentials not configured'}), 500

    try:
        headers = {'Authorization': f'Bearer {token}'}
        params = {'q': query, 'type': 'track', 'limit': 5}
        response = requests.get('https://api.spotify.com/v1/search', headers=headers, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            tracks = []
            for track in data.get('tracks', {}).get('items', []):
                tracks.append({
                    'id': track.get('id'),
                    'name': track.get('name'),
                    'artist': ', '.join([a.get('name', '') for a in track.get('artists', [])]),
                    'url': track.get('external_urls', {}).get('spotify', ''),
                    'preview_url': track.get('preview_url'),
                    'image': track.get('album', {}).get('images', [{}])[0].get('url', ''),
                })
            return jsonify({'tracks': tracks})
        else:
            return jsonify({'error': 'Spotify API error'}), response.status_code
    except Exception as e:
        print(f"Spotify search error: {e}")
        return jsonify({'error': str(e)}), 500


@integrations_bp.route('/api/search/cifra', methods=['GET'])
def search_cifra():
    """Search for chord tabs on Cifra Club."""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query required'}), 400

    try:
        search_url = f'https://www.cifraclub.com.br/busca/?q={query.replace(" ", "+")}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # Simple approach: return the search URL
        # In production, you'd scrape or use an API if available
        return jsonify({
            'search_url': search_url,
            'query': query,
            'message': 'Pesquisar no Cifra Club'
        })
    except Exception as e:
        print(f"Cifra Club search error: {e}")
        return jsonify({'error': str(e)}), 500

@integrations_bp.route('/api/search/youtube', methods=['GET'])
def search_youtube():
    """Search for a video on YouTube (returns search URL)."""
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query required'}), 400

    try:
        search_url = f'https://www.youtube.com/results?search_query={query.replace(" ", "+")}'
        return jsonify({
            'search_url': search_url,
            'query': query,
            'message': 'Pesquisar no YouTube'
        })
    except Exception as e:
        print(f"YouTube search error: {e}")
        return jsonify({'error': str(e)}), 500


@integrations_bp.route('/api/spotify/track/<track_id>', methods=['GET'])
def get_spotify_track(track_id):
    """Get detailed info about a Spotify track."""
    token = get_spotify_token()
    if not token:
        return jsonify({'error': 'Spotify credentials not configured'}), 500

    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'https://api.spotify.com/v1/tracks/{track_id}', 
                              headers=headers, timeout=5)
        
        if response.status_code == 200:
            track = response.json()
            return jsonify({
                'id': track.get('id'),
                'name': track.get('name'),
                'artist': ', '.join([a.get('name', '') for a in track.get('artists', [])]),
                'url': track.get('external_urls', {}).get('spotify', ''),
                'preview_url': track.get('preview_url'),
                'image': track.get('album', {}).get('images', [{}])[0].get('url', ''),
                'duration_ms': track.get('duration_ms'),
            })
        else:
            return jsonify({'error': 'Track not found'}), 404
    except Exception as e:
        print(f"Spotify track error: {e}")
        return jsonify({'error': str(e)}), 500
