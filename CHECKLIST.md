# ✅ Checklist de Configuração - Spotify + Cifra Club

## 📋 Antes de Começar

- [ ] Python 3.8+ instalado (`python --version`)
- [ ] Node.js 16+ instalado (`node --version`)
- [ ] Conta Spotify (gratuita)
- [ ] Editor de texto (VS Code recomendado)
- [ ] Git (opcional, para controle de versão)

## 🎯 Fase 1: Obter Credenciais Spotify (5 min)

- [ ] Acesar https://developer.spotify.com/dashboard
- [ ] Fazer login ou criar conta
- [ ] Clicar em "Create an App"
- [ ] Preencher: Nome da app
- [ ] Aceitar os termos
- [ ] Copiar **Client ID**
- [ ] Copiar **Client Secret**
- [ ] Clicar em "Edit Settings"
- [ ] Adicionar Redirect URI: `http://localhost:5000/api/spotify/callback`
- [ ] Salvar

✅ Você agora tem:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## 📝 Fase 2: Configurar Variáveis de Ambiente (3 min)

### 2.1 Windows PowerShell

```powershell
# Navegue para o diretório do projeto
cd "c:\Users\Aluno tarde\app louvor"

# Vá até backend
cd backend

# Copie o arquivo exemplo
Copy-Item .env.example .env

# Abra o arquivo em seu editor favorito
notepad .env
# ou
code .env
```

### 2.2 Editar `.env`

Encontre e preenchaa estas 3 linhas:

```env
# Adicione estas credenciais (tire as aspas vazias):
SPOTIFY_CLIENT_ID=SEU_CLIENT_ID_AQUI
SPOTIFY_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

**Exemplo real:**
```env
SPOTIFY_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2
SPOTIFY_CLIENT_SECRET=m2n3o4p5q6r7s8t9u0v1w2x3
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

- [ ] Abir `backend/.env`
- [ ] Preencher `SPOTIFY_CLIENT_ID`
- [ ] Preencher `SPOTIFY_CLIENT_SECRET`
- [ ] Preencher `SPOTIFY_REDIRECT_URI`
- [ ] Salvar arquivo (Ctrl+S)

## 🐍 Fase 3: Instalar Dependências Python (2 min)

```powershell
# Certifique-se de estar em: app-louvor\backend
cd "c:\Users\Aluno tarde\app louvor\backend"

# Instale todos os pacotes
pip install -r requirements.txt
```

✅ Saída esperada:
```
Successfully installed spotipy requests beautifulsoup4 ... (mais pacotes)
```

- [ ] Executar `pip install -r requirements.txt`
- [ ] Esperar conclusão (pode levar 1-2 min)
- [ ] Ver mensagem "Successfully installed..."

## 🚀 Fase 4: Executar Backend (1 min)

```powershell
# Certifique-se de estar em: app-louvor\backend
cd "c:\Users\Aluno tarde\app louvor\backend"

# Inicie o servidor
python app.py
```

✅ Saída esperada:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**⚠️ MANTENHA ESTE TERMINAL ABERTO!**

- [ ] Terminal aberto em `backend/`
- [ ] `python app.py` executado
- [ ] Ver "Running on http://127.0.0.1:5000"
- [ ] Não feche este terminal

## 📦 Fase 5: Instalar Dependências Frontend (2 min)

**Em um NOVO PowerShell** (não feche o primeiro):

```powershell
# Navegue para frontend
cd "c:\Users\Aluno tarde\app louvor\frontend"

# Instale as dependências
npm install
```

✅ Saída esperada:
```
added XX packages in X.XXs
```

- [ ] Abrir NOVO PowerShell (não feche o anterior!)
- [ ] Navegar para `frontend/`
- [ ] Executar `npm install`
- [ ] Esperar conclusão (2-5 min)

## 🎨 Fase 6: Executar Frontend (1 min)

```powershell
# Certifique-se de estar em: app-louvor\frontend
cd "c:\Users\Aluno tarde\app louvor\frontend"

# Inicie o servidor Vite
npm run dev
```

✅ Saída esperada:
```
VITE v5.4.21  ready in 500 ms

➜  Local:   http://localhost:5175
```

- [ ] Executar `npm run dev` no mesmo terminal
- [ ] Ver "ready in X ms"
- [ ] Ver URL local (pode ser 5173, 5174 ou 5175)
- [ ] Manter terminal aberto

## 🌐 Fase 7: Acessar a Aplicação (1 min)

- [ ] Abrir navegador (Chrome, Edge, Firefox, Safari)
- [ ] Copiar a URL do Fase 6 (ex: `http://localhost:5175`)
- [ ] Colar na barra de endereço
- [ ] Pressionar Enter
- [ ] Ver página de login do App Louvor

## 🔐 Fase 8: Fazer Login (1 min)

- [ ] Fazer login ou registrar nova conta
- [ ] Confirmar autenticação
- [ ] Acessar dashboard

## 🎵 Fase 9: Testar Integração Spotify (2 min)

1. [ ] Clicar em **CANÇÕES** (menu lateral)
2. [ ] Procurar campo **"🎵 Buscar no Spotify"** (topo da página)
3. [ ] Digitar: `Graça Maior`
4. [ ] Clicar **"Buscar"**
5. [ ] ✅ Ver lista de resultados com imagens
6. [ ] Clicar em um resultado
7. [ ] ✅ Ver campos preenchidos:
   - Título: "Graça Maior"
   - Artista: "Jailson Mendes"
   - Link Spotify: (URL preenchida)
8. [ ] Preencher campos adicionais (Líder, Tom, BPM)
9. [ ] Clicar **"Adicionar Canção"**
10. [ ] ✅ Ver mensagem de sucesso

## ✨ Fase 10: Testar Cifra Club (1 min)

- [ ] Na página de Canções, procurar URL do Cifra Club
- [ ] Clicar no link
- [ ] ✅ Abrir site Cifra Club em nova aba

## 🎉 Conclusão

Se você chegou até aqui com ✅ em todos os itens, parabéns! 

**Sua integração Spotify + Cifra Club está funcionando!**

## 🆘 Se Algo Deu Errado

### Erro: "Spotify credentials not configured"
1. Abir `backend/.env`
2. Confirmar que `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` estão preenchidos
3. Salvar
4. Reiniciar backend (Ctrl+C, depois `python app.py`)

### Erro: "ModuleNotFoundError: No module named 'spotipy'"
1. Ir para `backend/`
2. Executar: `pip install spotipy`
3. Reiniciar backend

### Porta 5000 já em uso
1. Backend tentará: 5000, 5001, 5002... até 5010
2. Procure no console qual porta foi usada
3. Use essa porta na próxima solicitação

### Busca não retorna resultados
1. Verificar conexão com internet
2. Tentar outro termo (ex: "Amazing Grace" em inglês)
3. Confirmar credenciais Spotify estão corretas

### Não consegue acessar localhost:5175
1. Verificar se frontend está rodando
2. Procurar no console frontend qual porta foi usada (5173, 5174 ou 5175?)
3. Acessar a URL correta

## 📞 Suporte

Consultee os arquivos de documentação:

| Problema | Arquivo |
|---|---|
| Não sabe começar | QUICKSTART.md |
| Quer entender a arquitetura | ARQUITETURA.md |
| Quer referência de APIs | API_REFERENCE.md |
| Quer detalhes técnicos | INTEGRACAO_SPOTIFY_CIFRA.md |

## 📊 Checklist Completo

### Ambiente
- [ ] Python 3.8+
- [ ] Node.js 16+
- [ ] Git (opcional)

### Credenciais
- [ ] Conta Spotify Developer criada
- [ ] Client ID obtido
- [ ] Client Secret obtido
- [ ] Redirect URI configurado

### Configuração
- [ ] .env criado
- [ ] Credenciais preenchidas
- [ ] requirements.txt instalado
- [ ] package.json instalado

### Execução
- [ ] Backend rodando (127.0.0.1:5000)
- [ ] Frontend rodando (localhost:5175)
- [ ] Login realizado
- [ ] Página Canções acessível

### Testes
- [ ] Busca Spotify funcionando
- [ ] Resultados exibem imagens
- [ ] Seleção preenche formulário
- [ ] Canção criada com sucesso
- [ ] Link Cifra Club funciona

## 🚀 Próximos Passos

Depois de confirmar que tudo funciona:

1. [ ] Explorar outras páginas (Membros, Escalas)
2. [ ] Configurar Google Calendar (opcional)
3. [ ] Ler documentação técnica
4. [ ] Começar a usar para gerenciar canções
5. [ ] Customizar conforme necessário

---

**Você está pronto! 🎉**

Qualquer dúvida, consulte os arquivos de documentação inclusos no projeto.
