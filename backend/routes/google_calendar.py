from flask import Blueprint, jsonify, request, redirect
import os
import json

try:
    from backend.database.db import db
except ImportError:
    from database.db import db

# Google API imports
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

calendar_bp = Blueprint('google_calendar', __name__)

CLIENT_SECRETS_FILE = os.environ.get('GOOGLE_CLIENT_SECRETS', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/calendar.events']
TOKENS_FILE = os.environ.get('GOOGLE_TOKENS_FILE', 'google_tokens.json')


@calendar_bp.route('/api/google/oauth_url', methods=['GET'])
def get_oauth_url():
    # state can include ministration_id to create event after auth
    ministration_id = request.args.get('ministration_id')
    try:
        flow = Flow.from_client_secrets_file(CLIENT_SECRETS_FILE, scopes=SCOPES)
    except FileNotFoundError:
        return jsonify({'error': f'Google OAuth credentials file not found: {CLIENT_SECRETS_FILE}. Please configure integrations.'}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to load Google credentials: {str(e)}'}), 500

    flow.redirect_uri = request.host_url.rstrip('/') + '/api/google/oauth2callback'
    auth_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true', state=ministration_id)
    return jsonify({'auth_url': auth_url, 'state': state})


@calendar_bp.route('/api/google/oauth2callback', methods=['GET'])
def oauth2callback():
    state = request.args.get('state')
    flow = Flow.from_client_secrets_file(CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = request.host_url.rstrip('/') + '/api/google/oauth2callback'

    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)

    creds = flow.credentials
    token_data = {
        'token': creds.token,
        'refresh_token': creds.refresh_token,
        'token_uri': creds.token_uri,
        'client_id': creds.client_id,
        'client_secret': creds.client_secret,
        'scopes': creds.scopes,
    }

    with open(TOKENS_FILE, 'w', encoding='utf-8') as f:
        json.dump(token_data, f)

    # If state provided (ministration_id), redirect frontend to success page or simply return JSON
    if state:
        return jsonify({'message': 'Autorização concluída', 'ministration_id': state})

    return jsonify({'message': 'Autorização concluída'})


def load_credentials():
    if not os.path.exists(TOKENS_FILE):
        return None
    with open(TOKENS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    creds = Credentials(
        token=data.get('token'),
        refresh_token=data.get('refresh_token'),
        token_uri=data.get('token_uri'),
        client_id=data.get('client_id'),
        client_secret=data.get('client_secret'),
        scopes=data.get('scopes'),
    )
    return creds


@calendar_bp.route('/api/ministrations/<int:ministration_id>/create_event', methods=['POST'])
def create_event(ministration_id):
    try:
        from backend.models.ministration import Ministration
    except ImportError:
        from models.ministration import Ministration

    ministration = Ministration.query.get_or_404(ministration_id)

    creds = load_credentials()
    if not creds:
        # return oauth url so frontend can redirect user to authorize
        try:
            flow = Flow.from_client_secrets_file(CLIENT_SECRETS_FILE, scopes=SCOPES)
        except FileNotFoundError:
            return jsonify({'error': f'Google OAuth credentials file not found: {CLIENT_SECRETS_FILE}. Please configure integrations.'}), 404
        except Exception as e:
            return jsonify({'error': f'Failed to load Google credentials: {str(e)}'}), 500

        flow.redirect_uri = request.host_url.rstrip('/') + '/api/google/oauth2callback'
        auth_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true', state=str(ministration_id))
        return jsonify({'need_auth': True, 'auth_url': auth_url})

    service = build('calendar', 'v3', credentials=creds)

    event = {
        'summary': f"Ministração: {ministration.title}",
        'description': ministration.notes or '',
        'start': {
            'date': ministration.date if ministration.date and len(ministration.date) <= 10 else ministration.date,
        },
        'end': {
            'date': ministration.date if ministration.date and len(ministration.date) <= 10 else ministration.date,
        },
    }

    created = service.events().insert(calendarId='primary', body=event).execute()

    return jsonify({'created': True, 'eventId': created.get('id')})
