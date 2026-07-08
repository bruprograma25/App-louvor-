import { useEffect, useState } from "react";
import { Plus, Trash2, Music, ExternalLink, Link as LinkIcon } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Setlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedSong, setSelectedSong] = useState("");

  useEffect(() => {
    loadSetlist();
    loadSongs();
  }, []);

  async function loadSetlist() {
    try {
      const response = await api.get("/setlist");
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadSongs() {
    try {
      const response = await api.get("/songs");
      setSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddItem() {
    if (!title && !selectedSong) {
      return;
    }

    try {
      const payload = {
        title: title || (songs.find(s => s.id === parseInt(selectedSong))?.title || ""),
        position: items.length,
        song_id: selectedSong ? parseInt(selectedSong) : null,
      };
      
      const response = await api.post("/setlist", payload);
      setItems((current) => [response.data, ...current]);
      setTitle("");
      setSelectedSong("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteItem(id) {
    try {
      await api.delete(`/setlist/${id}`);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Setlist</h1>
            <p className="mt-2 text-sm text-slate-500">Organize os itens do culto e mantenha a equipe alinhada.</p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Adicionar item
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título do item do setlist"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
            />
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Ou selecionar do Banco de Canções
              </label>
              <select
                value={selectedSong}
                onChange={(event) => setSelectedSong(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
              >
                <option value="">Selecionar música do banco...</option>
                {songs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} - {s.artist}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Itens do setlist</h2>
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum item adicionado ainda.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      {item.song && (
                        <p className="text-sm text-slate-500">
                          {item.song.title} - {item.song.artist}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
                        Posição {item.position}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Banco de Canções</h2>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {songs.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma canção cadastrada</p>
            ) : (
              songs.map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{song.title}</p>
                    <p className="text-xs text-slate-500">{song.artist}</p>
                  </div>
                  <div className="flex gap-1">
                    {song.spotify_url && (
                      <a href={song.spotify_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-green-100 text-green-700 rounded-lg">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {song.youtube_url && (
                      <a href={song.youtube_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {song.cifra_url && (
                      <a href={song.cifra_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}