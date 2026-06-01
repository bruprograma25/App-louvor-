# 🎵 Diagrama da Arquitetura de Integração

## Fluxo de Busca Spotify

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND - React                          │
│                   (localhost:5175)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Página: Songs.jsx                                 │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Componente: SpotifySearch                   │   │   │
│  │  │ • Input: "Graça Maior"                      │   │   │
│  │  │ • Button: "Buscar"                          │   │   │
│  │  │ • Estado: query, results, loading           │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │           ↓                                         │   │
│  │  spotifyService.searchTracks("Graça Maior")        │   │
│  │           ↓                                         │   │
│  │  api.get("/api/search/spotify?q=...")             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Resultados Exibidos:                              │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Imagem] Graça Maior - Jailson Mendes     │   │   │
│  │  │ [Imagem] Graça Maior - Outro Artista      │   │   │
│  │  │ ...                                        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │           ↓ (ao clicar)                            │   │
│  │  handleSelectSpotifyTrack(track)                   │   │
│  │  • setTitle("Graça Maior")                         │   │
│  │  • setArtist("Jailson Mendes")                     │   │
│  │  • setSpotifyUrl("https://...")                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP
                    (CORS enabled)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND - Flask                           │
│                 (http://127.0.0.1:5000)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Route: GET /api/search/spotify                     │   │
│  │ └─────────────────────────────────────────────────┘   │
│  │                  ↓                                  │   │
│  │  integrations_routes.py                            │   │
│  │  def search_spotify():                             │   │
│  │   • query = "Graça Maior"                          │   │
│  │   • token = get_spotify_token()                    │   │
│  │     └─ authenticate com SPOTIFY_CLIENT_ID/SECRET  │   │
│  │           ↓                                        │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Spotify API Request:                        │   │   │
│  │  │ POST accounts.spotify.com/api/token         │   │   │
│  │  │ Response: access_token                      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │           ↓                                        │   │
│  │  requests.get("https://api.spotify.com/v1/search")│   │
│  │   + Header: Authorization: Bearer {token}         │   │
│  │   + Params: q=Graça Maior&type=track&limit=5     │   │
│  │           ↓                                        │   │
│  │  Parse resposta:                                   │   │
│  │  {                                                 │   │
│  │    "id": "...",                                    │   │
│  │    "name": "Graça Maior",                          │   │
│  │    "artist": "Jailson Mendes",                     │   │
│  │    "url": "https://open.spotify.com/track/...",   │   │
│  │    "preview_url": "https://...",                   │   │
│  │    "image": "https://..."                          │   │
│  │  }                                                 │   │
│  │           ↓                                        │   │
│  │  return jsonify({"tracks": [...]})                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Banco de Dados: SQLite                             │   │
│  │ Tabelas:                                           │   │
│  │ • songs (title, artist, spotify_url, ...)         │   │
│  │ • users, ministrations, etc                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Arquitetura de Componentes Frontend

```
frontend/src/
├── pages/
│   ├── Songs.jsx ◄────────┐
│   │  • Gerencia formulário│
│   │  • Chama searotifyTrack() quando selecionado
│   └─────────────────────┘
│
├── components/
│   ├── SpotifySearch.jsx ◄─ NOVO
│   │   • query state
│   │   • results state
│   │   • loading state
│   │   • handleSearch()
│   │   • UI para exibir resultados
│   │
│   └── SongCard.jsx
│       • Exibe canção cadastrada
│
├── services/
│   ├── spotifyService.js ◄─ NOVO
│   │   • searchTracks(query)
│   │   • getTrackDetails(trackId)
│   │   • openInSpotify(url)
│   │   • createPreviewPlayer(url)
│   │
│   ├── cifraClubService.js ◄─ NOVO
│   │   • searchCifras(query)
│   │   • openCifraSearch(query)
│   │   • buildCifraUrl(artist, song)
│   │
│   └── api.js (EXISTENTE)
│       • Cliente HTTP Axios
│       • Base URL: http://127.0.0.1:5000
│
└── context/
    └── AuthContext.jsx
        • Autenticação JWT
```

## Arquitetura de Componentes Backend

```
backend/
├── app.py ◄────────────────┐
│  • Flask app factory       │ Registra integrations_bp
│  • SQLAlchemy init        │
│  • CORS setup             │
│  • JWT setup              │
│  • Blueprint registration │
│  └───────────────────────┘
│
├── routes/
│   ├── integrations_routes.py ◄─ NOVO
│   │   • GET /api/search/spotify
│   │   • GET /api/spotify/track/<id>
│   │   • GET /api/search/cifra
│   │   • Usa spotipy library
│   │   • Usa requests para Cifra Club
│   │
│   ├── auth_routes.py (EXISTENTE)
│   ├── song_routes.py (EXISTENTE)
│   ├── ministration_routes.py (EXISTENTE)
│   └── ...
│
├── database/
│   └── db.py
│       • SQLAlchemy instance
│       • Models mapping
│
├── models/
│   ├── song.py ◄─ ATUALIZADO
│   │  + spotify_url
│   │  + youtube_url
│   │  + cifra_url
│   │  + audio_url
│   │
│   └── ...
│
├── .env ◄────────────────── NOVO
│   • SPOTIFY_CLIENT_ID
│   • SPOTIFY_CLIENT_SECRET
│   • SPOTIFY_REDIRECT_URI
│   • ... outras configs
│
└── requirements.txt ◄────── ATUALIZADO
    + spotipy
    + requests
    + beautifulsoup4
```

## Fluxo de Dados - Visão Completa

```
┌──────────────────────────────────────────────────────────────────┐
│  USUÁRIO INTERAGE COM INTERFACE                                   │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Digite "Graça Maior" no campo 🎵 Buscar no Spotify
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND: SpotifySearch.jsx                                     │
│  Estado: query = "Graça Maior"                                   │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Clique em "Buscar"
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND: handleSearch()                                        │
│  • spotifyService.searchTracks("Graça Maior")                   │
│  • Estado: loading = true                                        │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ HTTP GET com Axios
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  HTTP REQUEST: GET /api/search/spotify?q=Graça%20Maior          │
│  Headers: Content-Type: application/json                         │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Transmissão pela rede
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND: integrations_routes.py                                 │
│  Route: @integrations_bp.route('/api/search/spotify')           │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Executa: search_spotify()
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND: Autenticação Spotify                                  │
│  • get_spotify_token()                                           │
│  • Usa SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET                │
│  • POST para accounts.spotify.com/api/token                     │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Token JWT obtido
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND: Busca na API Spotify                                  │
│  • requests.get("https://api.spotify.com/v1/search")            │
│  • Params: q=Graça Maior, type=track, limit=5                  │
│  • Header: Authorization: Bearer {access_token}                │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ API Spotify retorna JSON com faixas
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND: Parse Resposta                                        │
│  • Extract: id, name, artist, url, preview_url, image         │
│  • Build array de tracks                                       │
│  • return jsonify({"tracks": [...]})                           │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ HTTP Response 200 OK
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND: Recebe JSON                                          │
│  Estado: results = [track1, track2, track3, ...]               │
│  Estado: loading = false                                        │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ React re-renderiza com resultados
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  UI EXIBE: Lista de Faixas                                      │
│  [Capa] Graça Maior - Jailson Mendes                           │
│  [Capa] Graça Maior - Outro Artista                            │
│  ...                                                             │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Usuário clica em "Graça Maior - Jailson Mendes"
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND: handleSelectTrack(track)                             │
│  • setTitle("Graça Maior")                                     │
│  • setArtist("Jailson Mendes")                                 │
│  • setSpotifyUrl("https://open.spotify.com/track/...")        │
│  • Fecha lista de resultados                                   │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Formulário atualizado automaticamente
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  FORM PREENCHIDO:                                               │
│  Título: "Graça Maior"                                          │
│  Artista: "Jailson Mendes"                                      │
│  Líder: [vazío - preencher]                                    │
│  Tom: [vazio - opcional]                                        │
│  BPM: [vazio - opcional]                                        │
│  Link Spotify: "https://open.spotify.com/track/..."           │
│  Link YouTube: [vazio - opcional]                              │
│                                                                 │
│  Button: "Adicionar Canção"                                    │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Usuário preenche campos restantes e clica "Adicionar"
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  POST /songs (EXISTENTE)                                        │
│  Body: {                                                         │
│    title: "Graça Maior",                                        │
│    artist: "Jailson Mendes",                                   │
│    leader: "João",                                              │
│    spotify_url: "https://...",                                 │
│    ...                                                          │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
         ↓
         │ Salva no banco de dados SQLite
         ↓
┌──────────────────────────────────────────────────────────────────┐
│  SUCESSO! ✨                                                     │
│  Canção "Graça Maior" adicionada ao banco                       │
└──────────────────────────────────────────────────────────────────┘
```

## Arquitetura de Segurança

```
┌────────────────────────────────────┐
│ FRONTEND (localhost:5175)          │
│ • CORS Origin Verificada          │
└────────────────────────────────────┘
         ↓
    Flask-CORS middleware
         ↓
┌────────────────────────────────────┐
│ BACKEND (127.0.0.1:5000)          │
│ • JWT Token Verification          │
│ • Rate Limiting (opcional)        │
│ • Input Validation                │
└────────────────────────────────────┘
         ↓
    Spotify OAuth 2.0
         ↓
┌────────────────────────────────────┐
│ SPOTIFY API (api.spotify.com)      │
│ • Token-based Authentication      │
│ • HTTPS Only                       │
│ • Rate Limits                      │
└────────────────────────────────────┘
```

## Variáveis de Ambiente (Fluxo)

```
.env (Backend)
├── SPOTIFY_CLIENT_ID ──┐
├── SPOTIFY_CLIENT_SECRET ├─→ get_spotify_token()
└── SPOTIFY_REDIRECT_URI ──┘
         ↓
    Spotify API Auth
         ↓
    access_token
         ↓
    Authorization Header
         ↓
    Spotify Search API
```

---

**Esse é o fluxo completo da integração Spotify!**
