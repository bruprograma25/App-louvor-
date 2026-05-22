from flask import Blueprint, jsonify, request

try:
    from backend.database.db import db
    from backend.models.setlist_item import SetlistItem
except ImportError:
    from database.db import db
    from models.setlist_item import SetlistItem

setlist_bp = Blueprint("setlist", __name__)

@setlist_bp.route("/api/setlist", methods=["GET"])
def get_setlist():
    items = SetlistItem.query.order_by(SetlistItem.position).all()
    return jsonify([item.to_dict() for item in items])

@setlist_bp.route("/api/setlist", methods=["POST"])
def create_setlist_item():
    data = request.json or {}

    item = SetlistItem(
        title=data.get("title", "Novo item"),
        song_id=data.get("song_id"),
        ministration_id=data.get("ministration_id"),
        position=data.get("position", 0),
        notes=data.get("notes"),
    )

    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@setlist_bp.route("/api/setlist/<int:item_id>", methods=["PATCH"])
def update_setlist_item(item_id):
    item = SetlistItem.query.get_or_404(item_id)
    data = request.json or {}

    item.title = data.get("title", item.title)
    item.position = data.get("position", item.position)
    item.notes = data.get("notes", item.notes)

    db.session.commit()
    return jsonify(item.to_dict())

@setlist_bp.route("/api/setlist/<int:item_id>", methods=["DELETE"])
def delete_setlist_item(item_id):
    item = SetlistItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removido da lista"})
