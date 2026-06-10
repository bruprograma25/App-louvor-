from flask import Blueprint, request, jsonify
from flask_socketio import emit

try:
    from backend.database.db import db
    from backend.models.notification import Notification
except ImportError:
    from database.db import db
    from models.notification import Notification

notification_bp = Blueprint("notifications", __name__)

@notification_bp.route("/api/notifications", methods=["GET"])
def get_notifications():
    notifications = Notification.query.order_by(Notification.created_at.desc()).all()
    return jsonify([notification.to_dict() for notification in notifications])

@notification_bp.route("/api/notifications", methods=["POST"])
def create_notification():
    data = request.json or {}

    notification = Notification()
    notification.title = data.get("title", "Notificação")
    notification.message = data.get("message", "Nova notificação")

    db.session.add(notification)
    db.session.commit()
    
    from flask import current_app
    socketio = current_app.extensions.get('socketio')
    if socketio:
        socketio.emit("notification", notification.to_dict(), broadcast=True)

    return jsonify(notification.to_dict()), 201
