from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

try:
    from backend.models.song import Song
except ImportError:
    from models.song import Song

# association table between ministrations and songs
ministration_song = db.Table(
    'ministration_song',
    db.Column('ministration_id', db.Integer, db.ForeignKey('ministration.id')),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'))
)

class Ministration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50))
    notes = db.Column(db.Text)
    attachment_url = db.Column(db.String(500))
    notified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    songs = db.relationship('Song', secondary=ministration_song, backref=db.backref('ministrations', lazy='dynamic'))
    confirmations = db.relationship('Confirmation', backref='ministration', lazy='dynamic')

    def to_dict(self):
        # include associated songs if relationship present
        songs = []
        try:
            if hasattr(self, "songs") and self.songs:
                songs = [song.to_dict() for song in self.songs]
        except Exception:
            songs = []

        # confirmations
        confirmations = []
        try:
            if hasattr(self, 'confirmations') and self.confirmations:
                confirmations = [c.to_dict() for c in self.confirmations]
        except Exception:
            confirmations = []

        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "notes": self.notes,
            "attachment_url": self.attachment_url,
            "notified": self.notified,
            "songs": songs,
            "confirmations": confirmations,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
