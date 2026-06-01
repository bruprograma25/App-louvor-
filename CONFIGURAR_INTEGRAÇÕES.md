# 🚀 Guia Completo - Configurar Integrações (Spotify, Cifra Club, YouTube)

## 🎯 Status Atual

| Integração | Status | O que fazer |
|-----------|--------|------------|
| **Spotify** | ✅ Pronto | Configurar credenciais |
| **Cifra Club** | ✅ Pronto | Usar diretamente |
| **YouTube** | ❌ Não implementado | Será adicionado depois |

---

## 🎵 1. SPOTIFY - Passo a Passo

### Passo 1: Criar Aplicação no Spotify Developer

1. Acesse: https://developer.spotify.com/dashboard
2. Faça login (crie conta se não tiver)
3. Clique em **"Create an App"**
4. Preencha:
   - **App name**: "App Louvor" (ou outro nome)
   - **Accept the checkboxes** 
   - Clique **"Create"**

5. Você verá a tela com:
   - **Client ID** ← Copie este
   - **Client Secret** ← Copie este também

### Passo 2: Configurar no Projeto

#### Opção A: Windows (PowerShell) - Recomendado

1. Abra PowerShell em: `c:\Users\Aluno tarde\app louvor\backend\`

2. Execute este comando:
```powershell
@"
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
"@ | Out-File -Encoding UTF8 .env
```

3. Edite o arquivo `.env` e cole os valores:
   - **Substitua**: `seu_client_id_aqui` pelo Client ID do Spotify
   - **Substitua**: `seu_client_secret_aqui` pelo Client Secret do Spotify

#### Opção B: Editar Manualmente

1. Vá para: `backend/.env`
2. Se não existir, crie um novo arquivo
3. Adicione:
```
SPOTIFY_CLIENT_ID=seu_id_aqui
SPOTIFY_CLIENT_SECRET=seu_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

### Passo 3: Reiniciar Backend

```bash
# Terminal 1
cd backend
python app.py
```

### Passo 4: Testar no Browser

1. Abra: http://localhost:5173
2. Vá para **"Canções"**
3. Procure por uma música: "Graça Maior"
4. Veja os resultados do Spotify com album art!

---

## 🎸 2. CIFRA CLUB - Usa Diretamente

### ✅ Já Funciona Sem Configuração!

#### Como Usar no Browser

1. Vá para: http://localhost:5173/songs
2. Veja uma canção na lista
3. Clique no botão **"Cifra"** 🎸
4. Abre automaticamente no Cifra Club em nova aba

#### Como Funciona
- Procura a música no Cifra Club
- Abre em: `https://www.cifraclub.com.br/busca/?q=nome-da-musica`

#### Exemplo
```
Música: Graça Maior
Abre: https://www.cifraclub.com.br/busca/?q=Graça+Maior
```

---

## 📺 3. YOUTUBE - Não Implementado Ainda

### ℹ️ Informação
- YouTube não foi implementado nesta versão
- O botão **"YT"** mostra apenas um link vazio
- **Será adicionado em atualizações futuras**

### Como Funcionar Manualmente Enquanto Isso
1. Copie o nome da música
2. Procure no YouTube
3. Cole o link manualmente em **"Link YouTube"**

---

## 🧪 Teste Completo Passo a Passo

### 1️⃣ Verificar Backend

```bash
# Terminal - Verificar se está rodando
curl http://127.0.0.1:5000/

# Resultado esperado:
# {"message": "Backend funcionando"}
```

### 2️⃣ Testar Spotify

```bash
curl "http://127.0.0.1:5000/api/search/spotify?q=Graça%20Maior"

# Sem credenciais: 
# {"error": "Spotify credentials not configured"}

# Com credenciais configuradas:
# { "tracks": [ {"id": "...", "name": "...", "artist": "...", ...} ] }
```

### 3️⃣ Testar Cifra Club

```bash
curl "http://127.0.0.1:5000/api/search/cifra?q=Graça%20Maior"

# Resultado:
# { "message": "Pesquisar no Cifra Club", "search_url": "https://..." }
```

### 4️⃣ Testar no Browser

1. Abrir: http://localhost:5173
2. Navegar para: **Canções**
3. Procurar: "Graça Maior"
4. Verificar resultados

---

## ❌ Se Não Funcionar

### Erro: "Spotify credentials not configured"
```
✅ Solução: 
   1. Criar/editar backend/.env
   2. Adicionar SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET
   3. Reiniciar: python app.py
```

### Erro: "Network Error / CORS"
```
✅ Solução:
   1. Verificar se backend está rodando: http://127.0.0.1:5000
   2. Verificar se frontend está rodando: http://localhost:5173
   3. Reiniciar ambos
```

### Erro: "Nenhuma música encontrada"
```
✅ Possíveis causas:
   1. Spotify sem credenciais (coloque as credenciais)
   2. Serviços do Spotify temporariamente indisponíveis
   3. Tente com outro nome de música
```

### Botão Cifra não abre nada
```
✅ Verificar:
   1. Pop-up pode estar bloqueado (permitir no navegador)
   2. Tentar em outra aba
   3. Verificar console (F12 > Console)
```

---

## 📋 Checklist Final

- [ ] Backend rodando em http://127.0.0.1:5000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Arquivo `.env` criado em `backend/`
- [ ] Credenciais Spotify adicionadas em `.env`
- [ ] Backend reiniciado após adicionar credenciais
- [ ] Spotify search funcionando (resultados aparecem)
- [ ] Cifra Club funcionando (abre em nova aba)
- [ ] YouTube link funcional (manual por enquanto)

---

## 🎓 Resumo

| Ação | Resultado |
|------|-----------|
| **Configurar Spotify** | Busca músicas com album art e preview |
| **Usar Cifra Club** | Abre búsqueda direta no site |
| **YouTube** | Adicione manualmente por enquanto |

---

## 💡 Dica Pro

Depois de configurar Spotify, você pode:
1. ✅ Procurar qualquer música
2. ✅ Ver album art
3. ✅ Ouvir preview de 30 segundos
4. ✅ Abrir no Spotify Web Player
5. ✅ Cifra Club para acordes

---

*Bom uso! Se tiver dúvidas, verifique os logs no console (F12)* 🚀
