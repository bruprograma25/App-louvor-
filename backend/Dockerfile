FROM python:3.13-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY backend ./backend
RUN mkdir -p /app/uploads

EXPOSE 5000

CMD ["python", "backend/app.py"]
