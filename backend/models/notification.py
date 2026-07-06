from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notice_date = db.Column(db.Date, default=datetime.utcnow)  # Data do aviso
    expire_date = db.Column(db.Date)  # Data de expiração
    status = db.Column(db.String(50), default="ativo")  # ativo, arquivado, expirado
    priority = db.Column(db.String(20), default="normal")  # normal, urgente, importante
    author = db.Column(db.String(255))  # Quem criou
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "notice_date": self.notice_date.isoformat() if self.notice_date else None,
            "expire_date": self.expire_date.isoformat() if self.expire_date else None,
            "status": self.status,
            "priority": self.priority,
            "author": self.author,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
