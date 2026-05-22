# Louvor App

## Como rodar localmente

### Backend
1. Ative o ambiente Python:
   - Windows PowerShell:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
2. Instale dependências:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```
3. Inicie o backend:
   ```powershell
   python backend/app.py
   ```

### Frontend
1. No diretório `frontend`, instale dependências:
   ```powershell
   cd frontend
   npm install
   ```
2. Inicie o frontend:
   ```powershell
   npm run dev
   ```

A aplicação React usa a API em `http://127.0.0.1:5000/api` por padrão.

## Usando Docker Compose

```powershell
docker compose up --build
```

Isso iniciará:
- backend em `http://localhost:5000`
- frontend em `http://localhost:5173`
