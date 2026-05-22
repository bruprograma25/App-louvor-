from flask import Blueprint, jsonify

try:
    from backend.models.song import Song
    from backend.models.ministration import Ministration
    from backend.models.user import User
except ImportError:
    from models.song import Song
    from models.ministration import Ministration
    from models.user import User

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard")
def dashboard():
    return jsonify({
        "songs": Song.query.count(),
        "ministrations": Ministration.query.count(),
        "members": User.query.count()
    })
