# ⚡ Guia Rápido - Configuração e Execução

## 📋 Checklist de Setup

- [ ] Python 3.8+ instalado
- [ ] Node.js 16+ instalado
- [ ] Conta Spotify Developer criada
- [ ] Credenciais Spotify obtidas
- [ ] .env configurado

## 🎯 Passo 1: Criar Aplicação Spotify

```
1. Vá para https://developer.spotify.com/dashboard
2. Clique em "Log In" e crie/faça login na sua conta
3. Clique em "Create an App"
4. Preencha nome e aceite termos
5. Você receberá:
   - Client ID
   - Client Secret
6. Clique em "Edit Settings"
7. Em "Redirect URIs" adicione:
   http://localhost:5000/api/spotify/callback
```

## 🔐 Passo 2: Configurar Variáveis de Ambiente

**No diretório `backend/`:**

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Ou abra backend\.env no editor e adicione:
```

**Arquivo `backend/.env`:**
```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
```

(Deixe outras variáveis em branco por enquanto)

## 📦 Passo 3: Instalar Dependências Python

```bash
# Abra PowerShell no diretório do projeto
cd backend

# Instale todas as dependências (incluindo spotipy)
pip install -r requirements.txt
```

**Saída esperada:**
```
Successfully installed spotipy requests beautifulsoup4 ...
```

## 🚀 Passo 4: Executar Backend

```bash
# No diretório backend/
python app.py
```

**Saída esperada:**
```
 * Running on http://127.0.0.1:5000
```

**Mantenha este terminal aberto!**

## 🎨 Passo 5: Executar Frontend (Novo Terminal)

```bash
# Abra outro PowerShell
cd frontend

# Instale dependências (primeira vez)
npm install

# Execute o servidor
npm run dev
```

**Saída esperada:**
```
VITE v5.4.21  ready in 500 ms

➜  Local:   http://localhost:5175
```

## ✅ Passo 6: Testar a Integração

1. Abra http://localhost:5175 no navegador
2. Clique em **CANÇÕES** (no menu lateral)
3. Procure por "🎵 Buscar no Spotify" (no topo do formulário)
4. Digite: `Graça Maior`
5. Clique em **"Buscar"**
6. Você deve ver resultados com capas de álbum
7. Clique em um resultado
8. Os campos **Título** e **Artista** serão preenchidos automaticamente
9. Preencha os outros campos e clique "Adicionar Canção"

## 🧪 Teste Alternativo (via Terminal)

Se quiser testar sem UI:

```bash
# Teste o backend diretamente
curl "http://localhost:5000/api/search/spotify?q=Graça%20Maior"
```

**Resposta esperada:**
```json
{
  "tracks": [
    {
      "id": "...",
      "name": "Graça Maior",
      "artist": "Jailson Mendes",
      "url": "https://open.spotify.com/track/...",
      "image": "https://..."
    }
  ]
}
```

## ⚠️ Problemas Comuns

### "Spotify credentials not configured"
```
Solução:
1. Verifique se backend/.env existe
2. Confirme que SPOTIFY_CLIENT_ID e SECRET estão lá
3. Reinicie o backend (Ctrl+C, depois python app.py)
```

### "ModuleNotFoundError: No module named 'spotipy'"
```
Solução:
pip install spotipy
```

### "Conexão recusada localhost:5000"
```
Solução:
1. Verifique se backend está rodando
2. Procure por "http://127.0.0.1:5000" no console
```

### "Porta 5175 já em uso"
```
Solução:
Frontend tentará 5173, 5174, 5175...
Procure a porta que foi usada na saída do npm run dev
```

## 📚 Estrutura de Pastas Importante

```
app-louvor/
├── backend/
│   ├── .env              ← CRIE AQUI (copie de .env.example)
│   ├── app.py            ← Servidor principal
│   └── requirements.txt   ← pip install isso
├── frontend/
│   ├── src/
│   │   └── pages/Songs.jsx  ← Página com busca Spotify
│   └── package.json      ← npm install isso
└── README.md
```

## 🎵 Arquivos Novos Criados

Para sua informação:

```
backend/
├── routes/
│   └── integrations_routes.py  ← Endpoints Spotify/Cifra
├── .env                        ← Você precisa criar
└── .env.example               ← Template

frontend/
├── src/
│   ├── components/
│   │   └── SpotifySearch.jsx  ← Novo componente
│   └── services/
│       ├── spotifyService.js  ← Novo serviço
│       └── cifraClubService.js ← Novo serviço
```

## 🎯 Resumo de Comandos

```bash
# Terminal 1 - Backend
cd app-louvor/backend
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd app-louvor/frontend
npm install
npm run dev

# Depois visite: http://localhost:5175
```

## ✨ Funcionalidades Disponíveis

✅ Busca Spotify integrada
✅ Seleção automática de metadados
✅ Links diretos para Spotify
✅ Busca Cifra Club
✅ Preview de músicas

## 🚀 Próximas Features

- [ ] Web Playback SDK (reprodução na própria página)
- [ ] Playlists do Spotify
- [ ] Sincronização automática
- [ ] YouTube Music
- [ ] Apple Music

---

**Pronto para começar?**

1. Configure .env com credenciais Spotify
2. Rode os dois servidores
3. Vá para Canções e teste a busca!
