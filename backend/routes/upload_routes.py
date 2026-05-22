import os

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/api/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    if file is None:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    if not file.filename:
        return jsonify({"error": "Arquivo sem nome"}), 400

    filename = secure_filename(file.filename)
    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    path = os.path.join(upload_folder, filename)
    file.save(path)
    url = f"/uploads/{filename}"

    return jsonify({"url": url})
