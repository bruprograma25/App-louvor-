# ❓ Perguntas Frequentes (FAQ) - Spotify + Cifra Club

## 🚀 Começar

### P: Como começo do zero?
**R:** Siga o arquivo `CHECKLIST.md`. É um guia passo-a-passo com 10 fases que leva ~20 minutos.

### P: Preciso de contas especiais?
**R:** Você precisa de:
- Conta Spotify (gratuita)
- Conta Spotify Developer (gratuita, em https://developer.spotify.com/dashboard)
- Nenhuma outra assinatura necessária

### P: Qual Python eu preciso?
**R:** Python 3.8+ (recomendado 3.9, 3.10 ou 3.11)
```bash
python --version
```

### P: Qual Node.js?
**R:** Node.js 16+ (recomendado 18+)
```bash
node --version
```

---

## 🎵 Integração Spotify

### P: Não consigo fazer login no Spotify Developer
**R:** 
1. Vá para https://www.spotify.com (crie conta se necessário)
2. Depois acesse https://developer.spotify.com/dashboard
3. Se ainda tiver problemas, tente outro navegador

### P: Onde encontro Client ID e Secret?
**R:**
1. Acesse https://developer.spotify.com/dashboard
2. Clique na app que criou
3. Vá para "Settings" ou clique na app
4. Você verá "Client ID" e um botão para revelar "Client Secret"

### P: Qual é exatamente o Redirect URI?
**R:** Deve ser exatamente: `http://localhost:5000/api/spotify/callback`

Se quer usar produção, mude para seu domínio real:
`https://seudominio.com/api/spotify/callback`

### P: Como testo sem colocar em `.env`?
**R:** Não recomendado. As credenciais são obrigatórias. Se estiver testando:
1. Use um ambiente temporário
2. Nunca commite `.env` (use `.env.example` no git)
3. Para produção, use variáveis de sistema

### P: Posso usar a mesma app Spotify para múltiplas instâncias?
**R:** Sim, você pode. Mas se não funcionar:
1. Verifique o Redirect URI (deve corresponder ao ambiente)
2. Cada ambiente (dev, prod) pode ter seu Redirect URI diferente

### P: Por que a busca retorna 5 resultados apenas?
**R:** É limitado no código para:
- Performance
- UX melhor (não assustar com muitos resultados)
- Economizar requests à API

Se quiser mais, edite `integrations_routes.py`:
```python
params = {'q': query, 'type': 'track', 'limit': 10}  # Mude 5 para 10
```

### P: Posso ter acesso à música completa para tocar?
**R:** No momento, apenas preview de 30 segundos (quando disponível).

Para música completa, você precisaria:
- Upgrade para Spotify Premium
- Implementar Web Playback SDK
- OAuth flow para usuário (mais complexo)

---

## 🎸 Cifra Club

### P: Cifra Club realmente funciona?
**R:** Sim, mas com limitações. Atualmente:
- ✅ Links de busca funcionam
- ✅ Redirecionamento para site funciona
- ❌ Sem API oficial (por enquanto)

### P: Posso ter os acordes diretamente no app?
**R:** No futuro, sim. Teríamos que:
1. Usar scraping (mais complexo, mais lento)
2. Encontrar uma API oficial
3. Negociar acesso com Cifra Club

Por enquanto, é apenas link direto.

---

## ⚙️ Configuração e Ambiente

### P: Posso usar diferentes `.env` para dev e prod?
**R:** Sim! Você pode:
- `.env.local` - Local
- `.env.production` - Produção

Mas no código Python, você carrega com:
```python
from dotenv import load_dotenv
load_dotenv('.env.production')  # Específico
```

### P: Preciso de banco de dados especial?
**R:** Não, o SQLite embutido funciona. Está em `backend/app.db` (criado automaticamente).

Para produção, você pode migrar para PostgreSQL depois.

### P: Posso deixar a porta 5000 diferente?
**R:** Sim, mas:
1. Mude em `app.py` (procure `app.run`)
2. Atualize `SPOTIFY_REDIRECT_URI` no `.env`
3. Frontend tentará outras portas automaticamente

---

## 🔐 Segurança

### P: Meu Client Secret está seguro?
**R:** ⚠️ **NÃO COMMITE `.env`!**

Checklist:
- [x] `.env` está em `.gitignore`?
- [x] Você não fez push de `.env` no git?
- [x] Se já fez, regenere o Secret no Spotify Dashboard

### P: Posso compartilhar `.env` com o time?
**R:** **NÃO!** Cada desenvolvedor deve:
1. Ter seu próprio `.env` local
2. Usar `.env.example` como referência
3. Nunca compartilhar via email/chat

### P: E em produção?
**R:** Use variáveis de sistema/environment:
- Heroku: Config Vars
- Docker: Environment variables
- AWS: Systems Manager / Secrets Manager
- Vercel: Environment Variables

---

## 🐛 Troubleshooting

### P: "Spotify credentials not configured" - O que fazer?
**R:** 
1. Abra `backend/.env`
2. Confirme que preencheu `SPOTIFY_CLIENT_ID`
3. Confirme que preencheu `SPOTIFY_CLIENT_SECRET`
4. Reinicie backend: `Ctrl+C` → `python app.py`

### P: Porta 5000 já está em uso
**R:**
1. Backend tenta: 5000, 5001, 5002... 5010 automaticamente
2. Procure no console qual foi usada
3. Se nenhuma funcionar, feche outro programa usando a porta
4. Comando para ver o que usa a porta:
   ```bash
   netstat -ano | findstr :5000
   ```

### P: Frontend não consegue conectar ao backend
**R:**
1. Backend está rodando? (procure "Running on")
2. Frontend tenta `http://127.0.0.1:5000` por padrão
3. Se backend está em outra porta, edite `frontend/src/api/api.js`

### P: Módulo não encontrado: 'spotipy'
**R:**
```bash
cd backend
pip install spotipy
```

### P: Nenhum resultado de busca retorna
**R:**
1. Conexão com internet está funcionando?
2. Credenciais Spotify estão corretas?
3. Tente em inglês: "Amazing Grace"
4. Verifique limite de requisições do Spotify

### P: CORS error no frontend
**R:**
1. Backend está rodando?
2. `flask-cors` está instalado?
3. Reinicie backend: `pip install flask-cors`

---

## 📱 Usando a Integração

### P: Como busco uma música?
**R:**
1. Vá para **CANÇÕES**
2. Procure o campo **"🎵 Buscar no Spotify"**
3. Digite a música ou artista
4. Clique **"Buscar"**
5. Selecione um resultado
6. Complete os campos e clique **"Adicionar"**

### P: Os campos se preenchem automaticamente?
**R:** Sim! Quando você seleciona um resultado:
- ✅ Título (name da faixa)
- ✅ Artista (artist name)
- ✅ URL Spotify (link direto)

Você ainda preenche:
- Líder (manual)
- Tom (manual)
- BPM (manual)
- YouTube (manual)

### P: Posso editar a URL Spotify depois?
**R:** Sim! Edite a canção e mude a URL.

### P: A URL Spotify fica atualizada?
**R:** Sim, o Spotify mantém URLs estáveis. O link que você salva hoje funcionará para sempre.

---

## 🚀 Deployment

### P: Como faço deploy para produção?
**R:** Existem várias opções:

**Opção 1: Heroku**
- Backend: `Procfile` + `requirements.txt`
- Frontend: Build estático + nginx

**Opção 2: AWS**
- Backend: EC2 ou Elastic Beanstalk
- Frontend: S3 + CloudFront

**Opção 3: Docker**
- Use `docker-compose.yml` (já existe!)
- Mude URLs para seu domínio

**Opção 4: DigitalOcean, Render, Railway**
- Similar ao Heroku

Consulte `DEPLOYING.md` (será criado).

### P: Posso usar Docker?
**R:** Sim! O `docker-compose.yml` já existe:
```bash
docker compose up --build
```

### P: Preciso de HTTPS?
**R:** Para produção, **SIM**. Use:
- Let's Encrypt (gratuito)
- CloudFlare
- Certificado pago

---

## 📚 Aprendizado

### P: Onde aprendo mais sobre Spotify API?
**R:** 
- Documentação oficial: https://developer.spotify.com/documentation/web-api
- SDK Python (spotipy): https://spotipy.readthedocs.io/

### P: Como aprendo React/Flask?
**R:**
- React: https://react.dev (documentação oficial)
- Flask: https://flask.palletsprojects.com (documentação oficial)

### P: Como contribuo para melhorar o projeto?
**R:** 
1. Crie uma branch
2. Faça suas mudanças
3. Teste
4. Abra um Pull Request
5. Espere revisão

---

## 💰 Custos

### P: Spotify cobra por usar a API?
**R:** **Não!** Totalmente gratuito:
- Developer: Gratuito
- Requisições à API: Gratuito
- Limites: 5 requisições/segundo (mais que suficiente)

### P: E quando escalar?
**R:** Para aplicações muito grandes, pode haver custos:
- Acima de 10 mil requisições/dia: Contate Spotify
- Web Playback SDK: Pode ter limitações

---

## ❓ Outras Dúvidas

### P: Posso remover essa integração?
**R:** Sim, remova:
1. `backend/routes/integrations_routes.py`
2. Import em `app.py`
3. `spotipy` de `requirements.txt`
4. Componente de Songs.jsx

### P: Posso usar outra API de música?
**R:** Sim, existem:
- YouTube Music API
- Apple Music API
- Deezer API
- SoundCloud API

Use como template e adapte.

### P: O código está otimizado?
**R:** 
- ✅ Componentes são reutilizáveis
- ✅ Serviços são separados
- ✅ Sem muitas queries desnecessárias
- ❌ Pode adicionar cache
- ❌ Pode adicionar testes

### P: Como adiciono testes?
**R:** Você pode usar:
- **Backend:** `pytest`, `unittest`
- **Frontend:** `vitest`, `jest`, `react-testing-library`

Exemplo:
```python
# test_spotify.py
def test_search_spotify():
    response = client.get('/api/search/spotify?q=test')
    assert response.status_code == 200
```

---

## 🎯 Próximos Passos

### P: Qual é o roadmap?
**R:**
1. **Curto prazo:** Usar integração atual
2. **Médio:** Web Playback SDK
3. **Longo:** YouTube Music + Recomendações

### P: Pode ajudar a implementar X?
**R:** Talvez! Crie uma issue descrevendo o que quer.

---

## 📞 Precisa de Ajuda?

1. **Consulte:** CHECKLIST.md → QUICKSTART.md → API_REFERENCE.md
2. **Procure:** Documentação incluída no projeto
3. **Teste:** Use exemplos de cURL nos docs
4. **Debug:** Verifique console do navegador + terminal

---

**Última atualização:** Janeiro 2024
**FAQ v1.0**

Não encontrou sua pergunta? Crie uma issue no repositório!
