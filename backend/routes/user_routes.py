from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt

try:
    from backend.database.db import db
    from backend.models.user import User
except ImportError:
    from database.db import db
    from models.user import User

user_bp = Blueprint("users", __name__)

@user_bp.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.order_by(User.full_name).all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route("/api/users", methods=["POST"])
def create_user():
    data = request.json or {}
    full_name = data.get("full_name", "Usuário")
    email = data.get("email")
    password_text = data.get("password")
    role = data.get("role", "member")
    status = data.get("status", "Apto")
    image = data.get("image")
    voice = data.get("voice") or data.get("voiceType")
    birth_date = data.get("birth_date") or data.get("birthdate")
    notes = data.get("notes")

    if not email or not password_text:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Já existe usuário com este email"}), 400

    password = bcrypt.hashpw(password_text.encode(), bcrypt.gensalt())

    user = User(
        full_name=full_name,
        email=email,
        password=password.decode(),
        role=role,
        status=status,
        image=image,
        voice=voice,
        birth_date=birth_date,
        notes=notes,
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201

@user_bp.route("/api/users/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@user_bp.route("/api/users/<int:user_id>", methods=["PATCH"])
def patch_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json or {}

    user.full_name = data.get("full_name", user.full_name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    user.status = data.get("status", user.status)
    user.image = data.get("image", user.image)
    
    if "voice" in data or "voiceType" in data:
        user.voice = data.get("voice") or data.get("voiceType")
    if "birth_date" in data or "birthdate" in data:
        user.birth_date = data.get("birth_date") or data.get("birthdate")
    if "notes" in data:
        user.notes = data.get("notes")

    db.session.commit()
    return jsonify(user.to_dict())


@user_bp.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuário deletado com sucesso"})


@user_bp.route("/api/users/<int:user_id>/mark_beginner", methods=["POST"])
def mark_beginner(user_id):
    """Marca ou desmarca um usuário como iniciante via campo `status` = 'iniciante'"""
    user = User.query.get_or_404(user_id)
    data = request.json or {}
    make_beginner = data.get('beginner')
    if make_beginner is None:
        return jsonify({"error": "Campo 'beginner' é obrigatório (true/false)"}), 400

    if make_beginner:
        user.status = 'iniciante'
    else:
        user.status = data.get('status', 'Apto')

    db.session.commit()
    return jsonify(user.to_dict())
