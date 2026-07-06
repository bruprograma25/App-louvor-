from flask import Blueprint, request, jsonify
from datetime import datetime

try:
    from backend.database.db import db
    from backend.models.process import Process
except ImportError:
    from database.db import db
    from models.process import Process

process_bp = Blueprint("processes", __name__)

@process_bp.route("/api/processes", methods=["GET"])
def get_processes():
    status = request.args.get("status")  # Filtro opcional
    
    query = Process.query
    if status:
        query = query.filter_by(status=status)
    
    processes = query.order_by(Process.process_date.asc()).all()
    return jsonify([process.to_dict() for process in processes])

@process_bp.route("/api/processes", methods=["POST"])
def create_process():
    data = request.json or {}
    
    if not data.get("name"):
        return jsonify({"error": "Nome do processo é obrigatório"}), 400
    
    if not data.get("process_date"):
        return jsonify({"error": "Data é obrigatória"}), 400
    
    try:
        process_date = datetime.fromisoformat(data.get("process_date")).date()
    except:
        return jsonify({"error": "Data inválida"}), 400
    
    process = Process()
    process.name = data.get("name")
    process.description = data.get("description", "")
    process.process_date = process_date
    process.start_time = data.get("start_time")
    process.end_time = data.get("end_time")
    process.location = data.get("location", "")
    process.responsible = data.get("responsible", "")
    process.status = data.get("status", "planejado")
    process.category = data.get("category", "")
    process.notes = data.get("notes", "")
    
    db.session.add(process)
    db.session.commit()
    
    return jsonify(process.to_dict()), 201

@process_bp.route("/api/processes/<int:process_id>", methods=["PATCH"])
def update_process(process_id):
    process = Process.query.get_or_404(process_id)
    data = request.json or {}
    
    if "name" in data:
        process.name = data.get("name")
    if "description" in data:
        process.description = data.get("description")
    if "process_date" in data:
        process.process_date = datetime.fromisoformat(data.get("process_date")).date()
    if "start_time" in data:
        process.start_time = data.get("start_time")
    if "end_time" in data:
        process.end_time = data.get("end_time")
    if "location" in data:
        process.location = data.get("location")
    if "responsible" in data:
        process.responsible = data.get("responsible")
    if "status" in data:
        process.status = data.get("status")
    if "category" in data:
        process.category = data.get("category")
    if "notes" in data:
        process.notes = data.get("notes")
    
    process.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(process.to_dict())

@process_bp.route("/api/processes/<int:process_id>", methods=["DELETE"])
def delete_process(process_id):
    process = Process.query.get_or_404(process_id)
    db.session.delete(process)
    db.session.commit()
    return jsonify({"message": "Processo removido"})

@process_bp.route("/api/processes/calendar", methods=["GET"])
def get_calendar_events():
    """Retorna processos em formato compatível com calendário"""
    month = request.args.get("month")
    year = request.args.get("year")
    
    query = Process.query
    if month and year:
        from datetime import date
        first_day = date(int(year), int(month), 1)
        if int(month) == 12:
            last_day = date(int(year) + 1, 1, 1)
        else:
            last_day = date(int(year), int(month) + 1, 1)
        query = query.filter(Process.process_date >= first_day, Process.process_date < last_day)
    
    processes = query.order_by(Process.process_date.asc()).all()
    
    return jsonify([{
        "id": p.id,
        "title": p.name,
        "date": p.process_date.isoformat() if p.process_date else None,
        "start_time": p.start_time,
        "end_time": p.end_time,
        "status": p.status,
        "location": p.location,
    } for p in processes])
