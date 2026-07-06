from flask import Blueprint, request, jsonify
from flask_socketio import emit
from datetime import datetime

try:
    from backend.database.db import db
    from backend.models.notification import Notification
except ImportError:
    from database.db import db
    from models.notification import Notification

notification_bp = Blueprint("notifications", __name__)

@notification_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    status = request.args.get("status", "ativo")  # Filtrar por status
    
    query = Notification.query
    if status != "todos":
        query = query.filter_by(status=status)
    
    notifications = query.order_by(Notification.notice_date.desc()).all()
    return jsonify([notification.to_dict() for notification in notifications])

@notification_bp.route("/api/notifications", methods=["POST"])
def create_notification():
    data = request.json or {}

    # Validar campos obrigatórios
    if not data.get("title"):
        return jsonify({"error": "Título é obrigatório"}), 400

    notification = Notification()
    notification.title = data.get("title")
    notification.message = data.get("message", "")
    notification.notice_date = datetime.fromisoformat(data.get("notice_date")) if data.get("notice_date") else datetime.utcnow().date()
    notification.expire_date = datetime.fromisoformat(data.get("expire_date")).date() if data.get("expire_date") else None
    notification.priority = data.get("priority", "normal")
    notification.author = data.get("author", "Admin")
    notification.status = data.get("status", "ativo")

    db.session.add(notification)
    db.session.commit()
    
    # Notificar via WebSocket
    try:
        from flask import current_app
        socketio = current_app.extensions.get('socketio')
        if socketio:
            socketio.emit("notification", notification.to_dict(), broadcast=True)
    except:
        pass

    return jsonify(notification.to_dict()), 201

@notification_bp.route("/api/notifications/<int:notification_id>", methods=["PATCH"])
def update_notification(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    data = request.json or {}

    if "title" in data:
        notification.title = data.get("title")
    if "message" in data:
        notification.message = data.get("message")
    if "notice_date" in data:
        notification.notice_date = datetime.fromisoformat(data.get("notice_date")).date()
    if "expire_date" in data:
        notification.expire_date = datetime.fromisoformat(data.get("expire_date")).date() if data.get("expire_date") else None
    if "priority" in data:
        notification.priority = data.get("priority")
    if "status" in data:
        notification.status = data.get("status")
    
    notification.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify(notification.to_dict())

@notification_bp.route("/api/notifications/<int:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Aviso removido"})
