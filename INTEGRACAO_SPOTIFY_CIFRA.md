# Guia de Integração - Spotify e Cifra Club

## 🎵 Configuração do Spotify API

### Passo 1: Criar uma aplicação no Spotify Developer

1. Acesse https://developer.spotify.com/dashboard
2. Clique em "Create an App"
3. Aceite os termos e crie a aplicação
4. Você receberá:
   - **Client ID**
   - **Client Secret**

### Passo 2: Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Adicione suas credenciais do Spotify no arquivo `.env`:

```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback
```

### Passo 3: Endpoints disponíveis

#### Buscar música no Spotify
```
GET /api/search/spotify?q=nome_da_musica
```
**Resposta:**
```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Nome da Música",
      "artist": "Artista",
      "url": "https://open.spotify.com/track/...",
      "preview_url": "https://...",
      "image": "https://..."
    }
  ]
}
```

#### Obter detalhes da faixa
```
GET /api/spotify/track/<track_id>
```

#### Buscar no Cifra Club
```
GET /api/search/cifra?q=nome_da_musica
```

## 🎸 Integração Frontend

A página de Canções agora possui:

1. **Busca integrada do Spotify**
   - Campo de busca com autocomplete
   - Visualização de capa do álbum
   - Seleção rápida de faixa
   - Preenchimento automático de título/artista

2. **Reprodutor de Spotify**
   - Links diretos para o Spotify
   - Preview de áudio quando disponível

3. **Busca do Cifra Club**
   - Integração com o site oficial
   - Busca de acordes e letras

## 📋 Estrutura de Dados

### Modelo Song (Canção)
```python
{
  "id": 1,
  "title": "Nome da Música",
  "artist": "Artista",
  "leader": "Líder",
  "key": "Tom",
  "bpm": 120,
  "spotify_url": "https://open.spotify.com/track/...",
  "youtube_url": "https://youtube.com/...",
  "cifra_url": "https://cifraclub.com.br/...",
  "audio_url": "..."
}
```

## 🚀 Próximos Passos

### Implementado ✅
- [x] Busca do Spotify integrada
- [x] Busca do Cifra Club
- [x] Armazenamento de URLs
- [x] API endpoints backend

### Em desenvolvimento 🔄
- [ ] OAuth Spotify para reprodução web
- [ ] Web Playback SDK
- [ ] Sincronização automática de metadados
- [ ] Cache de resultados

### A implementar 📝
- [ ] Recomendações personalizadas
- [ ] Playlists do Spotify
- [ ] Histórico de buscas
- [ ] Download de PDFs com acordes

## 🔧 Troubleshooting

### "Spotify credentials not configured"
**Solução:** Verifique se as variáveis `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET` estão definidas no arquivo `.env`

### "Erro ao buscar no Spotify"
**Solução:** Verifique se as credenciais estão corretas e se sua aplicação está registrada no Spotify Dashboard

### Busca não retorna resultados
**Solução:** Tente com um termo mais específico ou verifique a conexão com a internet

## 📚 Referências

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Cifra Club](https://www.cifraclub.com.br)
- [Spotipy Documentation](https://spotipy.readthedocs.io/)
