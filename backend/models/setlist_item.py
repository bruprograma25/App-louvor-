from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db


class SetlistItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey("song.id"), nullable=True)
    ministration_id = db.Column(db.Integer, db.ForeignKey("ministration.id"), nullable=True)
    position = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    song = db.relationship("Song", lazy=True)
    ministration = db.relationship("Ministration", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "song_id": self.song_id,
            "ministration_id": self.ministration_id,
            "position": self.position,
            "notes": self.notes,
            "song": self.song.to_dict() if self.song else None,
            "ministration": self.ministration.to_dict() if self.ministration else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
