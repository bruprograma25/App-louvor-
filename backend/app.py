import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from sqlalchemy import text

# Sistema de importação robusto para evitar "ModuleNotFoundError"
from database.db import db
from routes.song_routes import song_bp
from routes.dashboard_routes import dashboard_bp
from routes.ministration_routes import ministration_bp
from routes.auth_routes import auth_bp
from routes.notification_routes import notification_bp
from routes.upload_routes import upload_bp
from routes.user_routes import user_bp
from routes.setlist_routes import setlist_bp
from routes.integrations_routes import integrations_bp
from sockets.socket_events import register_socket_events


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///app.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "change-this-secret")
    app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    CORS(app)
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(song_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(ministration_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(setlist_bp)
    app.register_blueprint(integrations_bp)
    try:
        from backend.routes.google_calendar import calendar_bp
        app.register_blueprint(calendar_bp)
    except Exception:
        try:
            from routes.google_calendar import calendar_bp
            app.register_blueprint(calendar_bp)
        except Exception:
            pass

    @app.route("/")
    def home():
        return jsonify({"message": "Backend funcionando"})

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    with app.app_context():
        db.create_all()
        try:
            result = db.session.execute(text("PRAGMA table_info('song')")).all()
            existing_columns = {row[1] for row in result}
            if "leader" not in existing_columns:
                db.session.execute(text("ALTER TABLE song ADD COLUMN leader TEXT"))
            if "spotify_url" not in existing_columns:
                db.session.execute(text("ALTER TABLE song ADD COLUMN spotify_url TEXT"))
            if "youtube_url" not in existing_columns:
                db.session.execute(text("ALTER TABLE song ADD COLUMN youtube_url TEXT"))
            if "cifra_url" not in existing_columns:
                db.session.execute(text("ALTER TABLE song ADD COLUMN cifra_url TEXT"))
            if "audio_url" not in existing_columns:
                db.session.execute(text("ALTER TABLE song ADD COLUMN audio_url TEXT"))
            # ensure ministration has attachment column
            result_min = db.session.execute(text("PRAGMA table_info('ministration')")).all()
            existing_min_cols = {row[1] for row in result_min}
            if "attachment_url" not in existing_min_cols:
                db.session.execute(text("ALTER TABLE ministration ADD COLUMN attachment_url TEXT"))
            if "notified" not in existing_min_cols:
                db.session.execute(text("ALTER TABLE ministration ADD COLUMN notified BOOLEAN"))
            
            # Força a criação dos campos que você pediu na aba de ministração
            columns_to_add = ["minister", "cult_type", "status", "playlist_url", "whatsapp_url", "type", "startTime", "endTime", "location", "team_json"]
            for col in columns_to_add:
                if col not in existing_min_cols:
                    db.session.execute(text(f"ALTER TABLE ministration ADD COLUMN {col} TEXT"))
            
            result_user = db.session.execute(text("PRAGMA table_info('user')")).all()
            existing_user_cols = {row[1] for row in result_user}
            user_cols_to_add = ["status", "voice", "birth_date", "notes"]
            for col in user_cols_to_add:
                if col not in existing_user_cols:
                    db.session.execute(text(f"ALTER TABLE user ADD COLUMN {col} TEXT"))
            db.session.commit()
        except Exception:
            db.session.rollback()

    return app


app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
register_socket_events(socketio)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
