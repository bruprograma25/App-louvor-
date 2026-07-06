import os
import json
from urllib.parse import quote

import bcrypt
import requests
from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import create_access_token
from google_auth_oauthlib.flow import Flow

try:
    from backend.models.user import User
    from backend.database.db import db
except ImportError:
    from models.user import User
    from database.db import db

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_LOGIN_REDIRECT_URI = os.environ.get("GOOGLE_LOGIN_REDIRECT_URI", "http://localhost:5000/api/auth/google/callback")
GOOGLE_OAUTH_SCOPES = ["openid", "email", "profile"]
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5175")


def _create_google_flow(state=None):
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "redirect_uris": [GOOGLE_LOGIN_REDIRECT_URI],
        }
    }
    flow = Flow.from_client_config(client_config, scopes=GOOGLE_OAUTH_SCOPES, state=state)
    flow.redirect_uri = GOOGLE_LOGIN_REDIRECT_URI
    return flow


auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email")
    password_text = data.get("password")
    full_name = data.get("full_name")

    if not email or not password_text or not full_name:
        return jsonify({"error": "Nome, email e senha são obrigatórios"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Já existe usuário com este email"}), 400

    password = bcrypt.hashpw(password_text.encode(), bcrypt.gensalt())

    user = User(
        full_name=full_name,
        email=email,
        password=password.decode()
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Conta criada"}), 201

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password_text = data.get("password")

    if not email or not password_text:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    valid = bcrypt.checkpw(password_text.encode(), user.password.encode())
    if not valid:
        return jsonify({"error": "Senha incorreta"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()})


@auth_bp.route("/api/auth/google", methods=["GET"])
def google_login():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({"error": "Google OAuth não está configurado no backend."}), 500

    try:
        flow = _create_google_flow()
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",
        )
        return redirect(auth_url)
    except Exception as e:
        return jsonify({"error": f"Falha ao iniciar login Google: {str(e)}"}), 500


@auth_bp.route("/api/auth/google/callback", methods=["GET"])
def google_callback():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return jsonify({"error": "Google OAuth não está configurado no backend."}), 500

    flow = _create_google_flow(state=request.args.get("state"))
    try:
        flow.fetch_token(authorization_response=request.url)
    except Exception as e:
        return jsonify({"error": f"Falha ao obter token Google: {str(e)}"}), 500

    credentials = flow.credentials
    user_info_response = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {credentials.token}"},
        timeout=10,
    )

    if user_info_response.status_code != 200:
        return jsonify({"error": "Não foi possível obter informações do usuário Google."}), 500

    user_info = user_info_response.json()
    email = user_info.get("email")
    full_name = user_info.get("name") or user_info.get("given_name") or "Usuário"
    picture = user_info.get("picture")

    if not email:
        return jsonify({"error": "O Google não retornou um e-mail válido."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        random_password = bcrypt.hashpw(os.urandom(16), bcrypt.gensalt()).decode()
        user = User(
            full_name=full_name,
            email=email,
            password=random_password,
            image=picture,
        )
        db.session.add(user)
        db.session.commit()

    token = create_access_token(identity=user.id)
    user_data = user.to_dict()
    redirect_url = f"{FRONTEND_URL}/login?googleToken={quote(token)}&googleUser={quote(json.dumps(user_data))}"
    return redirect(redirect_url)


@auth_bp.route("/api/google/oauth2callback", methods=["GET"])
def google_calendar_oauth2callback():
    return jsonify({"message": "Use /api/auth/google/callback for Google login."}), 200
