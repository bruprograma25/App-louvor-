from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), default="Desconhecido")
    leader = db.Column(db.String(255))
    key = db.Column(db.String(20))
    bpm = db.Column(db.Integer)
    spotify_url = db.Column(db.String(500))
    youtube_url = db.Column(db.String(500))
    cifra_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist,
            "leader": self.leader,
            "key": self.key,
            "bpm": self.bpm,
            "spotify_url": self.spotify_url,
            "cifra_url": self.cifra_url,
            "audio_url": self.audio_url,
            "youtube_url": self.youtube_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
