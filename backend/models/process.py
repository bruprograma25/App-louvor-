from datetime import datetime
try:
    from backend.database.db import db
except ImportError:
    from database.db import db

class Process(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    process_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(50))
    end_time = db.Column(db.String(50))
    location = db.Column(db.String(255))
    responsible = db.Column(db.String(255))
    status = db.Column(db.String(50), default="planejado")  # planejado, em_andamento, concluído
    category = db.Column(db.String(100))  # tipo de processo (administrativo, espiritual, etc)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "process_date": self.process_date.isoformat() if self.process_date else None,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "location": self.location,
            "responsible": self.responsible,
            "status": self.status,
            "category": self.category,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
