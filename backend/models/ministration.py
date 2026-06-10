from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

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
    minister = db.Column(db.String(255))
    cult_type = db.Column(db.String(100))
    status = db.Column(db.String(50), default="Rascunho")
    playlist_url = db.Column(db.String(500))
    whatsapp_url = db.Column(db.String(500))
    notified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Novos campos para integrar a escala e detalhes
    type = db.Column(db.String(100))
    startTime = db.Column(db.String(50))
    endTime = db.Column(db.String(50))
    location = db.Column(db.String(255))
    team_json = db.Column(db.Text)

    songs = db.relationship('Song', secondary=ministration_song, backref=db.backref('ministrations', lazy='dynamic'), lazy='joined')
    confirmations = db.relationship('Confirmation', backref='ministration', lazy='dynamic')

    @property
    def team(self):
        import json
        if not self.team_json:
            return []
        try:
            return json.loads(self.team_json)
        except Exception:
            return []

    @team.setter
    def team(self, value):
        import json
        self.team_json = json.dumps(value)

    def to_dict(self):
        # include associated songs if relationship present
        songs = []
        try:
            if hasattr(self, "songs") and self.songs is not None:
                # Convert Query object to list if needed
                song_items = self.songs.all() if hasattr(self.songs, 'all') else self.songs
                songs = [song.to_dict() for song in song_items]  # type: ignore
        except Exception:
            songs = []

        # confirmations
        confirmations = []
        try:
            if hasattr(self, 'confirmations') and self.confirmations is not None:
                # Convert Query object to list if needed
                confirmation_items = self.confirmations.all() if hasattr(self.confirmations, 'all') else self.confirmations
                confirmations = [c.to_dict() for c in confirmation_items]  # type: ignore
        except Exception:
            confirmations = []

        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "notes": self.notes,
            "attachment_url": self.attachment_url,
            "minister": self.minister,
            "cult_type": self.cult_type,
            "status": self.status,
            "playlist_url": self.playlist_url,
            "whatsapp_url": self.whatsapp_url,
            "notified": self.notified,
            "type": self.type,
            "startTime": self.startTime,
            "endTime": self.endTime,
            "location": self.location,
            "team": self.team,
            "songs": songs,
            "confirmations": confirmations,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
