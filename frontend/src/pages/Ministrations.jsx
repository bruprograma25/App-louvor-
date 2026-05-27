import { useEffect, useState } from "react";
import api from "../api/api";

export default function Ministrations() {
  const [ministrations, setMinistrations] = useState([]);
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMinistrations();
    loadSongs();
    loadUsers();
  }, []);

  async function loadMinistrations() {
    try {
      const response = await api.get("/ministrations");
      setMinistrations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadSongs() {
    try {
      const res = await api.get("/songs");
      setSongs(res.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateMinistration() {
    try {
      const response = await api.post("/ministrations", {
        title,
        date,
        notes,
      });

      setMinistrations((current) => [response.data, ...current]);
      setTitle("");
      setDate("");
      setNotes("");
      setMessage("Ministração cadastrada com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao cadastrar ministração.");
    }
  }

  async function handleDeleteMinistration(id) {
    try {
      await api.delete(`/ministrations/${id}`);
      setMinistrations((current) => current.filter((ministration) => ministration.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUploadAttachment(ministrationId, file) {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data.url;
      await api.patch(`/ministrations/${ministrationId}`, { attachment_url: url });
      setMinistrations((current) => current.map((m) => (m.id === ministrationId ? { ...m, attachment_url: url } : m)));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddSong(ministrationId, songId) {
    try {
      const res = await api.post(`/ministrations/${ministrationId}/songs`, { song_id: songId });
      setMinistrations((current) => current.map((m) => (m.id === ministrationId ? res.data : m)));
      setMessage("Música adicionada à ministração.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao adicionar música.");
    }
  }

  async function handleRemoveSong(ministrationId, songId) {
    try {
      const res = await api.delete(`/ministrations/${ministrationId}/songs/${songId}`);
      setMinistrations((current) => current.map((m) => (m.id === ministrationId ? res.data : m)));
      setMessage("Música removida da ministração.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao remover música.");
    }
  }

  function getBeginners() {
    return users.filter((u) => {
      if (!u) return false;
      const status = (u.status || "").toLowerCase();
      const notes = (u.notes || "").toLowerCase();
      return status.includes("inici") || notes.includes("inici");
    });
  }

  async function handleCreateBeginner() {
    const name = window.prompt("Nome do iniciante:");
    if (!name) return;
    const email = window.prompt("Email do iniciante (opcional):");
    try {
      const res = await api.post("/users", { full_name: name, email: email || `${name.replace(/\s+/g,"").toLowerCase()}@example.com`, password: "iniciante123", status: "Iniciando" });
      setUsers((current) => [res.data, ...current]);
      setMessage("Iniciante adicionado.");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Erro ao adicionar iniciante.");
    }
  }

  async function handleSendMinistrationToTeam(ministration) {
    try {
      // call backend notify endpoint which will email users (requires SMTP env vars)
      const res = await api.post(`/ministrations/${ministration.id}/notify`);
      setMessage(`Notificações enviadas: ${res.data.sent}`);
      // refresh ministrations to get confirmations
      loadMinistrations();
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar notificação por email.");
    }
  }

  async function handleConfirm(ministrationId) {
    const email = window.prompt('Insira seu email para confirmar presença:');
    if (!email) return;
    try {
      const res = await api.post(`/ministrations/${ministrationId}/confirm`, { email });
      setMessage('Confirmação registrada. Obrigado!');
      loadMinistrations();
    } catch (error) {
      console.error(error);
      setMessage('Erro ao confirmar presença.');
    }
  }

  function openSpotifySearch(title, artist) {
    const q = `${title} ${artist || ''}`.trim();
    const url = `https://open.spotify.com/search/${encodeURIComponent(q)}`;
    window.open(url, '_blank');
  }

  function openCifraSearch(title, artist) {
    const q = `${title} ${artist || ''}`.trim();
    const url = `https://www.cifraclub.com.br/busca/?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Ministrações</h1>
            <p className="mt-2 text-sm text-slate-500">Registre cultos, reuniões e notas relevantes.</p>
          </div>
          <button
            type="button"
            onClick={handleCreateMinistration}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Adicionar ministração
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notas"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ministrations.map((ministration) => (
          <div key={ministration.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{ministration.title}</h2>
                <p className="text-sm text-slate-500">{ministration.date || "Data não informada"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
                  Evento
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteMinistration(ministration.id)}
                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                >
                  Excluir
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{ministration.notes || "Sem notas adicionais."}</p>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-800">Músicas</h4>
              <div className="mt-2 flex flex-col gap-2">
                {(ministration.songs || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-2">
                    <div>
                      <div className="font-medium text-sm">{s.title}</div>
                      <div className="text-xs text-slate-500">{s.artist}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.spotify_url && (
                        <a href={s.spotify_url} target="_blank" rel="noreferrer" className="text-xs text-green-600">Spotify</a>
                      )}
                      {s.youtube_url && (
                        <a href={s.youtube_url} target="_blank" rel="noreferrer" className="text-xs text-red-600">YouTube</a>
                      )}
                      {s.cifra_url && (
                        <a href={s.cifra_url} target="_blank" rel="noreferrer" className="text-xs text-amber-600">Cifra Club</a>
                      )}
                      {s.audio_url && (
                        <audio className="ml-2" controls src={s.audio_url} />
                      )}
                      <button
                        type="button"
                        onClick={() => openSpotifySearch(s.title, s.artist)}
                        className="text-xs text-green-600"
                      >
                        Buscar Spotify
                      </button>
                      <button
                        type="button"
                        onClick={() => openCifraSearch(s.title, s.artist)}
                        className="text-xs text-amber-600"
                      >
                        Buscar Cifra
                      </button>
                      <button onClick={() => handleRemoveSong(ministration.id, s.id)} className="text-xs text-rose-600">Remover</button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <select id={`song-select-${ministration.id}`} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecionar música...</option>
                    {songs.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} — {s.artist}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById(`song-select-${ministration.id}`);
                      const songId = sel?.value;
                      if (songId) {
                        handleAddSong(ministration.id, parseInt(songId, 10));
                      }
                    }}
                    className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Adicionar música
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSendMinistrationToTeam(ministration)}
                  className="ml-auto rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Enviar notificação (email)
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm(ministration.id)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold"
                >
                  Confirmar presença
                </button>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Confirmados ({(ministration.confirmations || []).length})</h4>
                <div className="mt-2 text-sm text-slate-600">
                  {(ministration.confirmations || []).map((c) => (
                    <div key={c.id}>{c.email} — {new Date(c.confirmed_at).toLocaleString()}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                id={`pdf-${ministration.id}`}
                className="hidden"
                onChange={(e) => handleUploadAttachment(ministration.id, e.target.files?.[0])}
              />
              <label
                htmlFor={`pdf-${ministration.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
              >
                Enviar PDF
              </label>
              {ministration.attachment_url && (
                <a href={ministration.attachment_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-rose-600 hover:underline">
                  Abrir PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
