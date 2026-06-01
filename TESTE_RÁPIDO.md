# 🚀 Guia Rápido - Testando o App Louvor

## ✅ Status Atual

- ✅ Backend rodando: `http://127.0.0.1:5000`
- ✅ Frontend rodando: `http://localhost:5173`
- ✅ Sem erros de compilação
- ✅ Testes de API passando

---

## 🌐 Abrir no Navegador

### 1️⃣ Acesse a Aplicação
```
http://localhost:5173
```

### 2️⃣ Criar Conta (se necessário)
- Clique em **Register**
- Preencha email e senha
- Clique em **Sign Up**

### 3️⃣ Fazer Login
- Email e senha criados
- Clique em **Sign In**

---

## 🎵 Testar Integração Spotify

### Pré-requisito
Você precisa ter credenciais do Spotify. Se não tem:

1. Acesse: https://developer.spotify.com
2. Criar uma aplicação
3. Copiar `Client ID` e `Client Secret`

### Configurar Credenciais

**Arquivo**: `backend/.env`

```env
SPOTIFY_CLIENT_ID=sua_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

### Testar no Navegador

1. **Navegar para Songs Page**
   - Menu → Songs

2. **Usar Spotify Search**
   - Campo de busca aparece no topo
   - Digite: "Graça Maior" (ou outra música)
   - Pressione Enter
   - Veja resultados com album art

3. **Selecionar Música**
   - Clique em uma música nos resultados
   - O formulário auto-preenche com:
     - Título da música
     - Artista
     - URL Spotify
     - Preview de áudio

4. **Salvar Música**
   - Clique **Save Song**
   - Música salva no banco de dados

---

## 🎸 Testar Integração Cifra Club

### Sem Pré-requisitos!
Cifra Club não requer autenticação.

### Testar no Navegador

1. **Navegar para Songs Page**
   - Menu → Songs

2. **Ver Botão Cifra Club**
   - Ao lado do título (quando em edição)
   - Clique **Abrir Cifra Club**
   - Abre em nova aba com resultados

### Via API (Terminal)
```bash
curl "http://127.0.0.1:5000/api/search/cifra?q=Graça%20Maior"
```

Resposta:
```json
{
  "message": "Pesquisar no Cifra Club",
  "query": "Graça Maior",
  "search_url": "https://www.cifraclub.com.br/busca/?q=Graça+Maior"
}
```

---

## 📋 Testar Outras Funcionalidades

### Dashboard
- Menu → Dashboard
- Veja eventos próximos
- Notificações

### Ministrations
- Menu → Ministrations
- Criar novo evento
- Adicionar músicas ao setlist

### Setlist
- Menu → Setlist
- Arrastar e soltar (Drag & Drop)
- Reordenar músicas

### Members
- Menu → Members
- Ver membros do grupo
- Gerenciar confirmações

---

## 🐛 Se Encontrar Erros

### Erro: "Spotify credentials not configured"
- ✅ **Solução**: Configurar `.env` com credenciais (veja acima)
- Após configurar, reinicie o backend:
  ```bash
  cd backend
  python app.py
  ```

### Erro: "Network Error"
- ✅ **Verificar**: Backend está rodando em `http://127.0.0.1:5000`?
- ✅ **Verificar**: Frontend consegue acessar http://localhost:5173?

### Erro: "Componente não renderiza"
- ✅ **Abrir**: Devtools (F12)
- ✅ **Checar**: Aba Console (há erros JS?)
- ✅ **Checar**: Aba Network (há respostas 500?)

---

## 📊 Verificar Status via Terminal

### Testar Backend
```bash
curl http://127.0.0.1:5000/
# Resposta: {"message": "Backend funcionando"}
```

### Testar Cifra Club
```bash
curl "http://127.0.0.1:5000/api/search/cifra?q=Graça%20Maior"
```

### Testar Spotify (com credenciais)
```bash
curl "http://127.0.0.1:5000/api/search/spotify?q=Graça%20Maior"
```

---

## 🎯 Checklist de Funcionalidades

- [ ] Backend respondendo (Health Check)
- [ ] Frontend carrega sem erros
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Cifra Club search funciona (sem credenciais)
- [ ] Spotify search funciona (com credenciais)
- [ ] Selecionar música auto-preenche form
- [ ] Salvar música no banco
- [ ] Drag & Drop no Setlist funciona
- [ ] Notificações aparecem

---

## 💡 Dicas

1. **F12 no navegador** - Abrir DevTools
2. **Console** - Ver logs da aplicação
3. **Network** - Ver requisições HTTP
4. **Local Storage** - Ver dados de autenticação
5. **Refresh** - Ctrl+R ou F5 (se houver problema)

---

## 📞 Suporte Rápido

Se precisar reiniciar tudo:

```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend (em novo terminal)
cd frontend
npm run dev
```

Depois acesse: `http://localhost:5173`

---

*Bom teste! 🎉*
