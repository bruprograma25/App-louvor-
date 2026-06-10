import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import SongCard from "../components/SongCard";
import SpotifySearch from "../components/SpotifySearch";
import { Search, Plus, Music2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Songs() {
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
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("Todas");
  const [showForm, setShowForm] = useState(false);

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

  function handleSelectSpotifyTrack(track) {
    setTitle(track.name);
    setArtist(track.artist);
    setSpotifyUrl(track.url);
  }

  async function handleCreateSong() {
    if (!title || !artist) {
      alert("Por favor, preencha pelo menos título e artista.");
      return;
    }

    try {
      const response = await api.post("/songs", {
        title,
        artist,
        leader,
        key,
        bpm: bpm ? Number(bpm) : undefined,
        spotify_url: spotifyUrl,
        cifra_url: cifraUrl,
        youtube_url: youtubeUrl,
        notes
      });

      loadSongs(); // Recarrega a lista do backend para garantir consistência
      setTitle("");
      setArtist("");
      setLeader("");
      setKey("");
      setBpm("");
      setSpotifyUrl("");
      setCifraUrl("");
      setYoutubeUrl("");
      setNotes("");
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

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar canção ou artista..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
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

        <div className="mt-6 flex flex-wrap gap-2">
          {leaderOptions.map((leaderName) => (
            <button
              key={leaderName}
              type="button"
              onClick={() => setSelectedLeader(leaderName)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedLeader === leaderName
                  ? "border-rose-600 bg-rose-50 text-rose-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {leaderName}
            </button>
          ))}
        </div>

        {(user?.role === 'admin' || user?.leader) && showForm && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Spotify Search Component */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <SpotifySearch onSelectTrack={handleSelectSpotifyTrack} />
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 xl:grid-cols-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título da música"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              placeholder="Artista"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={leader}
              onChange={(event) => setLeader(event.target.value)}
              placeholder="Líder"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Tom"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <input
                value={bpm}
                onChange={(event) => setBpm(event.target.value)}
                placeholder="BPM"
                type="number"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
            </div>
            <input
              value={spotifyUrl}
              onChange={(event) => setSpotifyUrl(event.target.value)}
              placeholder="Link Spotify"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={cifraUrl}
              onChange={(event) => setCifraUrl(event.target.value)}
              placeholder="Link Cifra Club"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="Link YouTube"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações importantes da canção..."
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            rows={2}
          />
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreateSong}
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg"
            >
              Cadastrar Música
            </button>
          </div>
        </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredSongs.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            Nenhuma música encontrada.
          </div>
        ) : (
          filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onDelete={() => handleDeleteSong(song.id)} />
          ))
        )}
      </div>
    </div>
  );
}
