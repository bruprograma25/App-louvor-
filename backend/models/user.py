try:
    from backend.database.db import db
except ImportError:
    from database.db import db

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(255))

    email = db.Column(db.String(255), unique=True)

    password = db.Column(db.String(255))

    role = db.Column(db.String(50), default="member")

    status = db.Column(db.String(50), default="Apto")

    image = db.Column(db.String(500))

    # New fields for members
    voice = db.Column(db.String(100))  # e.g., Mezzo-soprano, Tenor, Guitarra
    birth_date = db.Column(db.String(50))  # e.g., 20/05/1990
    notes = db.Column(db.Text)  # Observações

    def to_dict(self):

        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "image": self.image,
            "voice": self.voice,
            "voiceType": self.voice,
            "birth_date": self.birth_date,
            "birthdate": self.birth_date,
            "notes": self.notes
        }