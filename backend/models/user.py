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

    def to_dict(self):

        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "image": self.image
        }