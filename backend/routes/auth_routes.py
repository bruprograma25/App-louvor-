from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

try:
    from backend.models.user import User
    from backend.database.db import db
except ImportError:
    from models.user import User
    from database.db import db

import bcrypt

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
