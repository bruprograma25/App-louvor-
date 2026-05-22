from flask import Blueprint, jsonify, request

try:
    from backend.database.db import db
    from backend.models.ministration import Ministration
except ImportError:
    from database.db import db
    from models.ministration import Ministration

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
