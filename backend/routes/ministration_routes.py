from flask import Blueprint, jsonify, request
import os
import smtplib
from email.message import EmailMessage

try:
    from backend.database.db import db
    from backend.models.ministration import Ministration
    from backend.models.confirmation import Confirmation
    from backend.models.user import User
    from backend.models.song import Song
except ImportError:
    from database.db import db
    from models.ministration import Ministration
    from models.confirmation import Confirmation
    from models.user import User
    from models.song import Song

def send_email(to_email, subject, body):
    host = os.environ.get('MAIL_HOST')
    port = int(os.environ.get('MAIL_PORT', '587'))
    user = os.environ.get('MAIL_USER')
    password = os.environ.get('MAIL_PASS')
    sender = os.environ.get('MAIL_FROM', user)

    if not host or not user or not password:
        print('Email not sent (SMTP not configured). To:', to_email, 'Subject:', subject)
        print('Body:', body)
        return False

    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = to_email
        msg.set_content(body)

        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)

        return True
    except Exception as e:
        print('Failed to send email', e)
        return False

ministration_bp = Blueprint("ministrations", __name__)

@ministration_bp.route("/api/ministrations", methods=["GET"])
def get_ministrations():
    ministrations = Ministration.query.order_by(Ministration.date.desc()).all()
    return jsonify([ministration.to_dict() for ministration in ministrations])

@ministration_bp.route("/api/ministrations", methods=["POST"])
def create_ministration():
    data = request.json or {}

    ministration = Ministration()
    ministration.title = data.get("title", "Sem título")
    ministration.date = data.get("date")
    ministration.notes = data.get("notes")
    ministration.attachment_url = data.get("attachment_url")

    db.session.add(ministration)
    db.session.commit()

    return jsonify(ministration.to_dict()), 201

@ministration_bp.route("/api/ministrations/<int:ministration_id>", methods=["PATCH"])
def update_ministration(ministration_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    data = request.json or {}

    ministration.title = data.get("title", ministration.title)
    ministration.date = data.get("date", ministration.date)
    ministration.notes = data.get("notes", ministration.notes)
    ministration.attachment_url = data.get("attachment_url", ministration.attachment_url)

    db.session.commit()
    return jsonify(ministration.to_dict())

@ministration_bp.route("/api/ministrations/<int:ministration_id>", methods=["DELETE"])
def delete_ministration(ministration_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    db.session.delete(ministration)
    db.session.commit()
    return jsonify({"message": "Ministração removida"})


@ministration_bp.route("/api/ministrations/<int:ministration_id>/notify", methods=["POST"])
def notify_ministration(ministration_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    users = User.query.filter(User.email != None).all()
    sent = 0
    for u in users:
        if not u.email:
            continue
        confirm_url = f"{request.host_url.rstrip('/')}/api/ministrations/{ministration_id}/confirm"
        body = f"Olá {u.full_name or u.email},\n\nVocê está convidado para a ministração '{ministration.title}' em {ministration.date}.\nConfirme sua presença clicando aqui: {confirm_url}?email={u.email}\n\nAbraços"
        ok = send_email(u.email, f"Convite: {ministration.title}", body)
        if ok:
            sent += 1

    ministration.notified = True
    db.session.commit()
    return jsonify({"sent": sent})


@ministration_bp.route("/api/ministrations/<int:ministration_id>/confirm", methods=["POST", "GET"])
def confirm_ministration(ministration_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    data = request.json or request.args or {}
    email = data.get('email')
    user_id = data.get('user_id')
    if not email and not user_id:
        return jsonify({"error": "email or user_id required"}), 400

    user = None
    if user_id:
        user = User.query.get(user_id)
    elif email:
        user = User.query.filter_by(email=email).first()

    confirmation = Confirmation(
        ministration_id=ministration.id, 
        user_id=user.id if user else (int(user_id) if user_id and str(user_id).isdigit() else None), 
        email=email or (user.email if user else None))
    db.session.add(confirmation)
    db.session.commit()

    return jsonify(confirmation.to_dict())


@ministration_bp.route("/api/ministrations/<int:ministration_id>/songs", methods=["POST"])
def add_song_to_ministration(ministration_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    data = request.json or {}
    song_id = data.get("song_id")
    if not song_id:
        return jsonify({"error": "song_id é obrigatório"}), 400

    song = Song.query.get_or_404(song_id)
    if song not in ministration.songs:
        ministration.songs.append(song)
        db.session.commit()

    return jsonify(ministration.to_dict())


@ministration_bp.route("/api/ministrations/<int:ministration_id>/songs/<int:song_id>", methods=["DELETE"])
def remove_song_from_ministration(ministration_id, song_id):
    ministration = Ministration.query.get_or_404(ministration_id)
    song = Song.query.get_or_404(song_id)
    if song in ministration.songs:
        ministration.songs.remove(song)
        db.session.commit()

    return jsonify(ministration.to_dict())
