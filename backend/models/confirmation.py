from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db


class Confirmation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ministration_id = db.Column(db.Integer, db.ForeignKey('ministration.id'), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    email = db.Column(db.String(255))
    confirmed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'ministration_id': self.ministration_id,
            'user_id': self.user_id,
            'email': self.email,
            'confirmed_at': self.confirmed_at.isoformat() if self.confirmed_at else None,
        }
