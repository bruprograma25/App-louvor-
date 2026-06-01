# 📡 Referência da API - Endpoints

## 🎵 Integrações (NOVO)

### Spotify

#### 1. Buscar Músicas
```
GET /api/search/spotify?q=<query>

Descrição: Busca faixas no Spotify
Autenticação: Não requerida (usa credenciais backend)
Query Params:
  - q (obrigatório): termo de busca

Exemplo:
GET /api/search/spotify?q=Graça%20Maior

Resposta (200 OK):
{
  "tracks": [
    {
      "id": "6rqhFgbbKwnb9MLmUQDvDm",
      "name": "Graça Maior",
      "artist": "Jailson Mendes, Jeferson Pillar",
      "url": "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDvDm",
      "preview_url": "https://p.scdn.co/mp3-preview/...",
      "image": "https://i.scdn.co/image/..."
    },
    ...mais 4 resultados
  ]
}

Erros:
- 400: Query obrigatório
- 500: Spotify credentials not configured
- 500: Erro na API Spotify
```

#### 2. Detalhes da Faixa
```
GET /api/spotify/track/<track_id>

Descrição: Obtém informações detalhadas de uma faixa
Autenticação: Não requerida
Params:
  - track_id: ID do Spotify da faixa

Exemplo:
GET /api/spotify/track/6rqhFgbbKwnb9MLmUQDvDm

Resposta (200 OK):
{
  "id": "6rqhFgbbKwnb9MLmUQDvDm",
  "name": "Graça Maior",
  "artist": "Jailson Mendes, Jeferson Pillar",
  "url": "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDvDm",
  "preview_url": "https://p.scdn.co/mp3-preview/...",
  "image": "https://i.scdn.co/image/...",
  "duration_ms": 240000
}

Erros:
- 404: Track not found
- 500: Spotify API error
```

### Cifra Club

#### 3. Buscar Cifras
```
GET /api/search/cifra?q=<query>

Descrição: Busca cifras/acordes no Cifra Club
Autenticação: Não requerida
Query Params:
  - q (obrigatório): termo de busca

Exemplo:
GET /api/search/cifra?q=Graça%20Maior

Resposta (200 OK):
{
  "search_url": "https://www.cifraclub.com.br/busca/?q=Graça+Maior",
  "query": "Graça Maior",
  "message": "Pesquisar no Cifra Club"
}

Erros:
- 400: Query obrigatório
- 500: Erro na busca
```

---

## 🎸 Canções (EXISTENTE)

### 4. Listar Canções
```
GET /songs

Descrição: Lista todas as canções cadastradas
Autenticação: JWT Token obrigatório
Headers:
  - Authorization: Bearer <token>

Resposta (200 OK):
[
  {
    "id": 1,
    "title": "Graça Maior",
    "artist": "Jailson Mendes",
    "leader": "João Silva",
    "key": "C",
    "bpm": 120,
    "spotify_url": "https://open.spotify.com/track/...",
    "youtube_url": "https://youtube.com/watch?v=...",
    "cifra_url": "https://cifraclub.com.br/...",
    "audio_url": null,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  },
  ...
]

Erros:
- 401: Token inválido/expirado
- 500: Erro no servidor
```

### 5. Criar Canção
```
POST /songs

Descrição: Cria uma nova canção
Autenticação: JWT Token obrigatório
Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json

Body:
{
  "title": "Graça Maior",           (obrigatório)
  "artist": "Jailson Mendes",       (obrigatório)
  "leader": "João Silva",            (opcional)
  "key": "C",                        (opcional)
  "bpm": 120,                        (opcional)
  "spotify_url": "https://...",     (opcional)
  "youtube_url": "https://...",     (opcional)
  "cifra_url": "https://...",       (opcional)
  "audio_url": "https://..."        (opcional)
}

Exemplo:
POST /songs
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Graça Maior",
  "artist": "Jailson Mendes",
  "leader": "João",
  "key": "C",
  "bpm": 120,
  "spotify_url": "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDvDm"
}

Resposta (201 Created):
{
  "id": 1,
  "title": "Graça Maior",
  "artist": "Jailson Mendes",
  "leader": "João",
  "key": "C",
  "bpm": 120,
  "spotify_url": "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDvDm",
  "youtube_url": null,
  "cifra_url": null,
  "audio_url": null,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}

Erros:
- 400: Campos obrigatórios faltando
- 401: Token inválido
- 409: Canção já existe
- 500: Erro no servidor
```

### 6. Obter Canção
```
GET /songs/<id>

Descrição: Obtém detalhes de uma canção específica
Autenticação: JWT Token obrigatório
Params:
  - id: ID da canção

Resposta (200 OK):
{
  "id": 1,
  "title": "Graça Maior",
  ...
}

Erros:
- 401: Token inválido
- 404: Canção não encontrada
- 500: Erro no servidor
```

### 7. Atualizar Canção
```
PUT /songs/<id>

Descrição: Atualiza dados de uma canção
Autenticação: JWT Token obrigatório
Params:
  - id: ID da canção
Body: (parcial)
{
  "title": "Novo Título",
  "leader": "João Silva",
  ...
}

Resposta (200 OK): Canção atualizada

Erros:
- 400: Dados inválidos
- 401: Token inválido
- 404: Canção não encontrada
- 403: Sem permissão
- 500: Erro no servidor
```

### 8. Deletar Canção
```
DELETE /songs/<id>

Descrição: Deleta uma canção
Autenticação: JWT Token obrigatório
Params:
  - id: ID da canção

Resposta (204 No Content): Sucesso (sem body)

Erros:
- 401: Token inválido
- 404: Canção não encontrada
- 403: Sem permissão
- 500: Erro no servidor
```

---

## 👥 Membros (EXISTENTE)

### 9. Listar Membros
```
GET /users

Descrição: Lista todos os membros
Autenticação: JWT Token obrigatório

Resposta (200 OK):
[
  {
    "id": 1,
    "full_name": "João Silva",
    "email": "joao@example.com",
    "role": "member",
    "birthdate": "1990-01-15",
    "spotify_url": "https://open.spotify.com/user/...",
    "cifra_url": "https://cifraclub.com.br/...",
    "created_at": "2024-01-01T10:00:00"
  },
  ...
]

Erros:
- 401: Token inválido
- 500: Erro no servidor
```

### 10. Criar Membro
```
POST /users

Body:
{
  "full_name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha_segura",
  "role": "member",
  "birthdate": "1995-05-20",
  "spotify_url": "https://open.spotify.com/user/...",
  "cifra_url": "https://cifraclub.com.br/..."
}

Resposta (201 Created): Novo membro criado
```

---

## 📅 Ministrações (EXISTENTE)

### 11. Listar Ministrações
```
GET /ministrations

Descrição: Lista todas as ministrações/eventos
Autenticação: JWT Token obrigatório

Resposta (200 OK):
[
  {
    "id": 1,
    "title": "Culto Domingo",
    "description": "Culto dominical",
    "date": "2024-01-21",
    "time": "10:00",
    "location": "Igreja",
    "songs": [...],
    "confirmations": [...],
    "notified": false,
    "created_at": "2024-01-15T10:00:00"
  },
  ...
]
```

### 12. Criar Ministração
```
POST /ministrations

Body:
{
  "title": "Culto Domingo",
  "description": "Culto dominical",
  "date": "2024-01-21",
  "time": "10:00",
  "location": "Igreja"
}

Resposta (201 Created): Nova ministração criada
```

### 13. Adicionar Canção à Ministração
```
POST /ministrations/<id>/songs

Body:
{
  "song_id": 1
}

Resposta (200 OK): Canção adicionada
```

### 14. Criar Evento no Google Calendar
```
POST /ministrations/<id>/create_event

Descrição: Cria um evento correspondente no Google Calendar
Autenticação: JWT Token obrigatório

Resposta (200 OK):
{
  "event_id": "...",
  "message": "Evento criado com sucesso"
}

Resposta (207):
{
  "need_auth": true,
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}

Erros:
- 404: Ministração não encontrada
- 401: Autenticação necessária
```

---

## 🔐 Autenticação (EXISTENTE)

### 15. Registrar Usuário
```
POST /auth/register

Body:
{
  "full_name": "João Silva",
  "email": "joao@example.com",
  "password": "senha_segura"
}

Resposta (201 Created):
{
  "id": 1,
  "full_name": "João Silva",
  "email": "joao@example.com",
  "access_token": "eyJhbGc..."
}

Erros:
- 400: Email já registrado
- 400: Campos obrigatórios faltando
```

### 16. Login
```
POST /auth/login

Body:
{
  "email": "joao@example.com",
  "password": "senha_segura"
}

Resposta (200 OK):
{
  "id": 1,
  "full_name": "João Silva",
  "email": "joao@example.com",
  "access_token": "eyJhbGc..."
}

Erros:
- 401: Credenciais inválidas
- 400: Email ou senha faltando
```

### 17. Renovar Token
```
POST /auth/refresh

Headers:
  - Authorization: Bearer <token>

Resposta (200 OK):
{
  "access_token": "novo_token_jwt"
}

Erros:
- 401: Token inválido/expirado
```

---

## 📝 Upload (EXISTENTE)

### 18. Upload de Arquivo
```
POST /upload

Body: multipart/form-data
  - file: arquivo (PDF, áudio, etc)

Resposta (200 OK):
{
  "file_url": "https://...",
  "filename": "musica.pdf"
}

Erros:
- 400: Arquivo obrigatório
- 413: Arquivo muito grande
```

---

## 🔗 Usando a API - Exemplos Completos

### Exemplo 1: Buscar e Criar Canção

```javascript
// 1. Buscar no Spotify
const response1 = await fetch('http://127.0.0.1:5000/api/search/spotify?q=Graça%20Maior');
const data1 = await response1.json();
const track = data1.tracks[0];

// 2. Criar canção com dados da busca
const response2 = await fetch('http://127.0.0.1:5000/songs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: track.name,
    artist: track.artist,
    leader: 'João',
    spotify_url: track.url
  })
});

const song = await response2.json();
console.log('Canção criada:', song.id);
```

### Exemplo 2: Integração com Google Calendar

```javascript
// 1. Obter URL de autorização
const response1 = await fetch('http://127.0.0.1:5000/api/google/oauth_url');
const data1 = await response1.json();
// Redirecionar usuário para data1.auth_url

// 2. Criar evento no calendar
const response2 = await fetch('http://127.0.0.1:5000/ministrations/1/create_event', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const result = await response2.json();
console.log('Evento criado:', result.event_id);
```

---

## 🧪 Testar com cURL

```bash
# Buscar Spotify
curl -X GET "http://localhost:5000/api/search/spotify?q=Graça%20Maior"

# Buscar Cifra Club
curl -X GET "http://localhost:5000/api/search/cifra?q=Graça%20Maior"

# Criar canção (requer token)
curl -X POST "http://localhost:5000/songs" \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Graça Maior",
    "artist": "Jailson Mendes",
    "leader": "João",
    "spotify_url": "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDvDm"
  }'

# Listar canções
curl -X GET "http://localhost:5000/songs" \
  -H "Authorization: Bearer seu_token"
```

---

## 📚 Status Codes Padrão

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 204 | No Content - Sucesso sem resposta |
| 207 | Multi-Status - Ação parcial |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe |
| 413 | Payload Too Large - Arquivo grande |
| 500 | Internal Server Error - Erro no servidor |

---

**Última atualização:** Janeiro 2024
**Versão:** 1.0.0
