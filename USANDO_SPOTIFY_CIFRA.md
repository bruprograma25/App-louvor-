# 🎵 Integração Spotify + Cifra Club

## ✅ O que foi implementado

### Backend
- ✅ Rotas de busca integradas
- ✅ Biblioteca Spotipy configurada
- ✅ Cliente HTTP para integração
- ✅ Endpoints `/api/search/spotify` e `/api/search/cifra`
- ✅ Detalhes de faixas do Spotify

### Frontend
- ✅ Componente `SpotifySearch.jsx` reutilizável
- ✅ Página Songs.jsx atualizada com busca integrada
- ✅ Serviço `spotifyService.js`
- ✅ Serviço `cifraClubService.js`
- ✅ Seleção automática de metadados

## 🚀 Como usar

### 1. Configurar Spotify Developer

1. Acesse https://developer.spotify.com/dashboard
2. Clique em "Create an App"
3. Preencha o nome e aceite os termos
4. Você receberá `Client ID` e `Client Secret`
5. Configure Redirect URI: `http://localhost:5000/api/spotify/callback`

### 2. Adicionar credenciais ao .env

```bash
# Copie o arquivo exemplo
cp backend\.env.example backend\.env

# Edite backend\.env e adicione:
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
```

### 3. Instalar dependências

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 4. Executar

```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Testar

1. Abra http://localhost:5175
2. Vá para **Canções**
3. Use o campo de busca **🎵 Buscar no Spotify**
4. Digite "Graça Maior" ou qualquer música
5. Selecione um resultado
6. Campos serão preenchidos automaticamente ✨

## 📡 Endpoints API

### Buscar no Spotify
```
GET /api/search/spotify?q=Graça%20Maior

Response:
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Graça Maior",
      "artist": "Jailson Mendes",
      "url": "https://open.spotify.com/track/...",
      "preview_url": "https://...",
      "image": "https://..."
    }
  ]
}
```

### Detalhes da faixa
```
GET /api/spotify/track/track_id

Response:
{
  "id": "track_id",
  "name": "Música",
  "artist": "Artista",
  "url": "https://open.spotify.com/track/...",
  "duration_ms": 180000,
  "image": "https://..."
}
```

### Buscar Cifra Club
```
GET /api/search/cifra?q=Graça%20Maior

Response:
{
  "search_url": "https://www.cifraclub.com.br/busca/?q=Graça+Maior",
  "query": "Graça Maior",
  "message": "Pesquisar no Cifra Club"
}
```

## 🧪 Testar via cURL

```bash
# Spotify
curl "http://localhost:5000/api/search/spotify?q=Amazing%20Grace"

# Cifra Club
curl "http://localhost:5000/api/search/cifra?q=Amazing%20Grace"
```

## 📁 Arquivos Criados

```
backend/
├── routes/
│   └── integrations_routes.py      ← Novos endpoints
├── .env                             ← Credenciais locais
└── requirements.txt                 ← Atualizado com spotipy

frontend/
├── src/
│   ├── components/
│   │   └── SpotifySearch.jsx       ← Novo componente
│   ├── services/
│   │   ├── spotifyService.js       ← Novo serviço
│   │   └── cifraClubService.js     ← Novo serviço
│   └── pages/
│       └── Songs.jsx               ← Atualizado
└── package.json                     ← npm run dev

.env.example                         ← Template variáveis
INTEGRACAO_SPOTIFY_CIFRA.md         ← Este arquivo
```

## 🎯 Fluxo de Busca

```
User digita "Graça Maior"
        ↓
SpotifySearch.jsx chamla searchSpotify()
        ↓
Chamada para /api/search/spotify?q=...
        ↓
Backend chama Spotify API (com spotipy)
        ↓
Retorna lista de faixas com capa
        ↓
Frontend exibe resultados com imagem
        ↓
User seleciona faixa
        ↓
Dados preenchidos automaticamente:
  - title: "Graça Maior"
  - artist: "Jailson Mendes"
  - spotifyUrl: "https://open.spotify.com/track/..."
```

## 🔧 Troubleshooting

### Erro: "Spotify credentials not configured"
**Solução:**
1. Verifique se `backend/.env` existe
2. Confirme que `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` estão preenchidos
3. Reinicie o backend

### Erro: "ModuleNotFoundError: No module named 'spotipy'"
**Solução:**
```bash
cd backend
pip install spotipy
```

### Busca retorna vazio
**Solução:**
1. Verifique sua conexão com internet
2. Confirme que a frase é válida em português/inglês
3. Teste com um termo em inglês conhecido (ex: "Amazing Grace")

### Porta 5000 já em uso
**Solução:**
- Backend tenta portas 5000 até 5010 automaticamente
- Verifique qual porta foi usada no console

### CORS Error
**Solução:**
- Confirme que backend está rodando em `http://127.0.0.1:5000`
- Verifique se `flask-cors` está instalado

## 📈 Próximas Melhorias

- [ ] Web Playback SDK do Spotify (reprodução online)
- [ ] Playlists do Spotify
- [ ] Recomendações de músicas
- [ ] Cache de buscas
- [ ] Integração com YouTube Music
- [ ] Sincronização automática com biblioteca Spotify

## 🎵 Exemplo de Uso Completo

```javascript
// Frontend - usar o componente
import SpotifySearch from "@/components/SpotifySearch";

function Songs() {
  const handleSelectTrack = (track) => {
    setTitle(track.name);
    setArtist(track.artist);
    setSpotifyUrl(track.url);
  };

  return (
    <SpotifySearch onSelectTrack={handleSelectTrack} />
  );
}
```

```python
# Backend - endpoints disponíveis
@integrations_bp.route('/api/search/spotify', methods=['GET'])
def search_spotify():
    query = request.args.get('q', '')
    token = get_spotify_token()
    # ... busca e retorna
```

---

**Dúvidas?** Verifique [INTEGRACAO_SPOTIFY_CIFRA.md](./INTEGRACAO_SPOTIFY_CIFRA.md)
