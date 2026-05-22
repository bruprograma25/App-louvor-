from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

class Ministration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50))
    notes = db.Column(db.Text)
    attachment_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "notes": self.notes,
            "attachment_url": self.attachment_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
