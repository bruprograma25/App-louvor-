import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import SongCard from "../components/SongCard";
import { Search, Plus, Music2, Spotify, Youtube, Music, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SongsImproved() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [leader, setLeader] = useState("");
  const [key, setKey] = useState("");
  const [bpm, setBpm] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [cifraUrl, setCifraUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTab, setSearchTab] = useState("local");

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      const response = await api.get("/songs");
      setSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSearchIntegrations() {
    if (!search.trim() || search.length < 2) {
      alert("Digite pelo menos 2 caracteres para buscar");
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get("/songs/search/integrations", {
        params: { q: search }
      });
      setSearchResults(response.data);
      setSearchTab("integrations");
    } catch (error) {
      console.error("Erro ao buscar integrações:", error);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectResult(result) {
    if (result.source === "spotify") {
      setSpotifyUrl(result.url);
      setTitle(result.query);
    } else if (result.source === "youtube") {
      setYoutubeUrl(result.url);
      setTitle(result.query);
    } else if (result.source === "cifra_club") {
      setCifraUrl(result.url);
      setTitle(result.query);
    }
  }

  async function handleCreateSong() {
    if (!title || !artist) {
      alert("Por favor, preencha pelo menos título e artista.");
      return;
    }

    try {
      await api.post("/songs/add-with-urls", {
        title,
        artist,
        leader,
        key,
        bpm: bpm ? Number(bpm) : undefined,
        spotify_url: spotifyUrl,
        cifra_url: cifraUrl,
        youtube_url: youtubeUrl
      });

      loadSongs();
      setTitle("");
      setArtist("");
      setLeader("");
      setKey("");
      setBpm("");
      setSpotifyUrl("");
      setCifraUrl("");
      setYoutubeUrl("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteSong(songId) {
    try {
      await api.delete(`/songs/${songId}`);
      setSongs((current) => current.filter((song) => song.id !== songId));
    } catch (error) {
      console.error(error);
    }
  }

  const leaderOptions = useMemo(() => {
    const list = songs
      .map((song) => song.leader)
      .filter(Boolean)
      .reduce((acc, leaderName) => {
        if (!acc.includes(leaderName)) acc.push(leaderName);
        return acc;
      }, []);
    return ["Todas", ...list];
  }, [songs]);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch = [song.title, song.artist, song.leader]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()));
      const matchesLeader = selectedLeader === "Todas" || song.leader === selectedLeader;
      return matchesSearch && matchesLeader;
    });
  }, [songs, search, selectedLeader]);

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Banco de Canções</h1>
            <p className="mt-2 text-sm text-slate-500">{songs.length} canções cadastradas</p>
          </div>
          {(user?.role === 'admin' || user?.leader) && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 shadow-md"
            >
              <Plus className={`h-4 w-4 transition-transform ${showForm ? 'rotate-45' : ''}`} />
              {showForm ? "Fechar" : "Adicionar Canção"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Adicionar Nova Canção</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da canção"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artista/Compositor"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                placeholder="Líder/Primeiro vocalize"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Tom (ex: C, D, Em)"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="BPM"
                type="number"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Adicionar links de plataformas:
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3">
                  <Spotify className="h-5 w-5 text-green-500" />
                  <input
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    placeholder="URL Spotify"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="URL YouTube"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3">
                  <Music className="h-5 w-5 text-orange-500" />
                  <input
                    value={cifraUrl}
                    onChange={(e) => setCifraUrl(e.target.value)}
                    placeholder="URL Cifra Club"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCreateSong}
                className="flex-1 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Salvar Canção
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar canção ou artista..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
            </div>
            <button
              onClick={handleSearchIntegrations}
              disabled={isSearching || !search.trim()}
              className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {isSearching ? "Buscando..." : "Buscar Integrações"}
            </button>
          </div>
          <select 
            value={selectedLeader}
            onChange={(e) => setSelectedLeader(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="Todas">Todos os Líderes</option>
            {leaderOptions.filter(l => l !== "Todas").map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {searchResults?.sources && searchResults.sources.length > 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 font-semibold text-slate-900">Resultados das Integrações:</h3>
            <div className="grid gap-3">
              {searchResults.sources.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
                >
                  {result.source === "spotify" && <Spotify className="h-6 w-6 text-green-500" />}
                  {result.source === "youtube" && <Youtube className="h-6 w-6 text-red-500" />}
                  {result.source === "cifra_club" && <Music className="h-6 w-6 text-orange-500" />}
                  <div>
                    <p className="font-semibold text-slate-900 capitalize">{result.source.replace('_', ' ')}</p>
                    <p className="text-sm text-slate-500">Clique para acessar</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-slate-900">Canções Cadastradas ({filteredSongs.length})</h3>
          {filteredSongs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Music2 className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Nenhuma canção cadastrada ainda</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSongs.map((song) => (
                <div key={song.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 line-clamp-2">{song.title}</h4>
                    <p className="text-sm text-slate-500">{song.artist}</p>
                  </div>

                  <div className="mb-4 flex gap-2 flex-wrap">
                    {song.spotify_url && (
                      <a href={song.spotify_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                        <Spotify className="h-5 w-5 text-green-500" />
                      </a>
                    )}
                    {song.youtube_url && (
                      <a href={song.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                        <Youtube className="h-5 w-5 text-red-500" />
                      </a>
                    )}
                    {song.cifra_url && (
                      <a href={song.cifra_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                        <Music className="h-5 w-5 text-orange-500" />
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs text-slate-500">
                    {song.key && <span className="rounded-full bg-slate-100 px-3 py-1">Tom: {song.key}</span>}
                    {song.bpm && <span className="rounded-full bg-slate-100 px-3 py-1">BPM: {song.bpm}</span>}
                  </div>

                  {(user?.role === 'admin' || user?.leader) && (
                    <button
                      onClick={() => handleDeleteSong(song.id)}
                      className="mt-4 w-full rounded-full border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}