import { useEffect, useState } from "react";
import { Calendar, Users, MapPin, ExternalLink, Filter, Music, Baby, Church as ChurchIcon, PlusCircle, Youtube, Play, Trash2, UserPlus, CheckCircle2, FileDown, AlertTriangle } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { id: 'domingos', label: 'Cultos de Domingo', icon: <ChurchIcon className="w-4 h-4" /> },
  { id: 'kids', label: 'Ministério Kids', icon: <Baby className="w-4 h-4" /> },
  { id: 'auxiliares', label: 'Cultos Auxiliares', icon: <PlusCircle className="w-4 h-4" /> }
];

// Dados da escala fornecida mapeados para o formato do App
const SCALE_DATA = [
  {
    id: "m1",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-02-02",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala completa de Domingo",
    team: [
      { name: "Thiago A", role: "Líder", email: "thiagoazevedo92@gmail.com" },
      { name: "Fabiano", role: "Back 1", email: "fabianomorenolima@gmail.com" },
      { name: "Juliana", role: "Back 2", email: "jujulianamagalhaes95@gmail.com" },
      { name: "Sheila", role: "Back 3", email: "sheilachiarel@gmail.com" },
      { name: "Isaias", role: "Teclado", email: "oisaiasbarbeiro@gmail.com" },
      { name: "Clayton", role: "Guitarra", email: "clayton512.96@gmail.com" },
      { name: "Ricardo", role: "Baixo", email: "" },
      { name: "Vinicius", role: "Bateria", email: "vinislves.100@gmail.com" }
    ]
  },
  {
    id: "m2",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-02-09",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala completa de Domingo",
    team: [
      { name: "Pr. Breno", role: "Líder / Violão", email: "brenoo.maiia@gmail.com" },
      { name: "Sandro", role: "Back 1", email: "sandrochiarel@gmail.com" },
      { name: "Soninha", role: "Back 2", email: "soniaisabel.sedf@gmail.com" },
      { name: "Beatriz", role: "Back 3", email: "balmeida82282@gmail.com" },
      { name: "Clayton", role: "Guitarra", email: "clayton512.96@gmail.com" },
      { name: "Iury", role: "Baixo", email: "contatoiury1@gmail.com" },
      { name: "Vinicius", role: "Bateria", email: "vinislves.100@gmail.com" }
    ]
  },
  {
    id: "m3",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-02-16",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala Domingo",
    team: [
      { name: "Bruna", role: "Líder", email: "brunarrocha@gmail.com" },
      { name: "Sheila", role: "Back 1", email: "sheilachiarel@gmail.com" },
      { name: "Helosman", role: "Back 2", email: "helosman.unb@gmail.com" },
      { name: "Isaias", role: "Teclado", email: "oisaiasbarbeiro@gmail.com" },
      { name: "Gadiel", role: "Guitarra", email: "gadielbarbosalima@gmail.com" },
      { name: "Pr. Breno", role: "Bateria", email: "brenoo.maiia@gmail.com" }
    ]
  },
  {
    id: "m4",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-02-23",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala Domingo",
    team: [
      { name: "Valeska", role: "Líder", email: "familiaalmeida626@gmail.com" },
      { name: "Sandro", role: "Back 1", email: "sandrochiarel@gmail.com" },
      { name: "Beatriz", role: "Back 2", email: "balmeida82282@gmail.com" },
      { name: "Sheila", role: "Back 3", email: "sheilachiarel@gmail.com" },
      { name: "Isaias", role: "Teclado", email: "oisaiasbarbeiro@gmail.com" },
      { name: "Gadiel", role: "Guitarra", email: "gadielbarbosalima@gmail.com" },
      { name: "Iury", role: "Baixo", email: "contatoiury1@gmail.com" },
      { name: "Vinicius", role: "Bateria", email: "vinislves.100@gmail.com" }
    ]
  },
  {
    id: "m5",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-03-02",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala Domingo",
    team: [
      { name: "Tati", role: "Líder", email: "tatianemmlima@gmail.com" },
      { name: "Soninha", role: "Back 1", email: "soniaisabel.sedf@gmail.com" },
      { name: "Juliana", role: "Back 2", email: "jujulianamagalhaes95@gmail.com" },
      { name: "Thiago A", role: "Back 3", email: "thiagoazevedo92@gmail.com" },
      { name: "Gadiel", role: "Teclado", email: "gadielbarbosalima@gmail.com" },
      { name: "Clayton", role: "Guitarra", email: "clayton512.96@gmail.com" },
      { name: "Ricardo", role: "Baixo", email: "" },
      { name: "Pr. Breno", role: "Bateria", email: "brenoo.maiia@gmail.com" }
    ]
  },
  {
    id: "m6",
    type: "domingos",
    title: "Ministração de Louvor",
    date: "2025-03-09",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Escala Domingo",
    team: [
      { name: "Pra. Sarah", role: "Líder", email: "sarinhaadoradora@gmail.com" },
      { name: "Juliana", role: "Back 1", email: "jujulianamagalhaes95@gmail.com" },
      { name: "Fabiano", role: "Back 2", email: "fabianomorenolima@gmail.com" },
      { name: "Helosman", role: "Back 3", email: "helosman.unb@gmail.com" },
      { name: "Pr. Laercio", role: "Teclado", email: "laercioestevan@gmail.com" },
      { name: "Gadiel", role: "Guitarra", email: "gadielbarbosalima@gmail.com" },
      { name: "Iury", role: "Baixo", email: "contatoiury1@gmail.com" },
      { name: "Vinicius", role: "Bateria", email: "vinislves.100@gmail.com" }
    ]
  },
  {
    id: "mk1",
    type: "kids",
    title: "Ministração Kids",
    date: "2025-02-01",
    startTime: "08:00:00",
    endTime: "12:30:00",
    location: "Igreja Apostólica Altar",
    notes: "Louvor Kids",
    team: [
      { name: "PR. BRENO", role: "Líder", email: "brenoo.maiia@gmail.com" },
      { name: "THIAGO A", role: "Back 1", email: "thiagoazevedo92@gmail.com" },
      { name: "BRUNA", role: "Back 2", email: "brunarrocha@gmail.com" },
      { name: "PR. LAERCIO", role: "Teclado", email: "laercioestevan@gmail.com" },
      { name: "RAUL", role: "Bateria", email: "raulkairos@gmail.com" }
    ]
  }
];

export default function Ministrations() {
  const getDirectLink = (type, song) => {
    const savedUrl = type === 'yt' ? song.youtube_url : (type === 'spotify' ? song.spotify_url : song.cifra_url);
    if (savedUrl) return savedUrl;
    const query = encodeURIComponent(`${song.title} ${song.artist || ""}`);
    if (type === 'yt') return `https://www.youtube.com/results?search_query=${query}`;
    if (type === 'spotify') return `https://open.spotify.com/search/${query}`;
    if (type === 'cifra') return `https://www.cifraclub.com.br/busca/?q=${query}`;
    return "#";
  };

  const { user } = useAuth();
  const [ministrations, setMinistrations] = useState(SCALE_DATA);
  const [activeCategory, setActiveCategory] = useState('domingos');
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("domingos");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:30");
  const [location, setLocation] = useState("Igreja Apostólica Altar");
  const [notes, setNotes] = useState("");
  const [newTeam, setNewTeam] = useState([]);
  const [tempMember, setTempMember] = useState("");
  const [tempRole, setTempRole] = useState("");
  const [previewSong, setPreviewSong] = useState(null);
  const [message, setMessage] = useState("");
  const [newSongs, setNewSongs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [generatingReportId, setGeneratingReportId] = useState(null);

  useEffect(() => {
    loadMinistrations();
    loadSongs();
    loadUsers();
  }, []);

  async function loadMinistrations() {
    try {
      const response = await api.get("/ministrations");
      if (response.data && response.data.length > 0) {
        setMinistrations(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar ministrações:", error);
    }
  }

  const generateGoogleCalendarLink = (ministration) => {
    const baseUrl = "https://calendar.google.com/calendar/u/0/r/eventedit";
    const dateStr = (ministration.date || "").replace(/-/g, "");
    const start = `${dateStr}T${(ministration.startTime || "00:00:00").replace(/:/g, "")}`;
    const end = `${dateStr}T${(ministration.endTime || "00:00:00").replace(/:/g, "")}`;
    
    const teamDetails = (ministration.team || []).filter(t => t.name).map(t => `${t.role}: ${t.name}`).join('%0A');
    const details = `${ministration.notes}%0A%0A--- EQUIPE ---%0A${teamDetails}`;
    
    return `${baseUrl}?text=${encodeURIComponent(ministration.title)}&dates=${start}/${end}&details=${details}&location=${encodeURIComponent(ministration.location)}`;
  };

  // Filtra por categoria e, se não for admin, filtra apenas as escalas do próprio usuário
  const filteredMinistrations = (ministrations || [])
    .filter(m => m.type === activeCategory)
    .filter(m => {
      if (user?.role === 'admin') return true;
      return m.team?.some(t => 
        t.email === user?.email || t.name?.toLowerCase() === user?.full_name?.toLowerCase()
      );
    });

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
        type,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        location,
        notes,
        team: newTeam,
        songs: newSongs
      });

      loadMinistrations();
      setTitle("");
      setDate("");
      setNewTeam([]);
      setType("domingos");
      setNotes("");
      setMessage("Ministração cadastrada com sucesso.");
      setShowForm(false);
      setNewSongs([]);
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

  function handleAddMemberToNewTeam() {
    if (!tempMember || !tempRole) return;
    setNewTeam([...newTeam, { name: tempMember, role: tempRole }]);
    setTempMember("");
    setTempRole("");
  }

  function handleRemoveMemberFromNewTeam(index) {
    setNewTeam(newTeam.filter((_, i) => i !== index));
  }

  function handleAddSongToNew(songId) {
    const song = songs.find(s => s.id === parseInt(songId));
    if (song && !newSongs.some(s => s.id === song.id)) setNewSongs([...newSongs, song]);
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

  async function handleAddTeamMemberToExisting(ministrationId, name, role) {
    try {
      const res = await api.post(`/ministrations/${ministrationId}/members`, { name, role });
      setMinistrations((current) => current.map((m) => (m.id === ministrationId ? res.data : m)));
      setMessage("Integrante adicionado à escala.");
    } catch (error) {
      console.error(error);
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
    const ministration = ministrations.find(m => m.id === ministrationId);
    
    // Validação de data: Check-in permitido apenas até o dia do evento
    const today = new Date().toISOString().split('T')[0];
    if (ministration?.date && today > ministration.date) {
      setMessage('O prazo para check-in expirou. O registro só é permitido até o dia do evento.');
      return;
    }

    let email = user?.email;
    if (!email) {
      email = window.prompt('Insira seu email para confirmar presença:');
    }
    
    if (!email) return;
    
    try {
      await api.post(`/ministrations/${ministrationId}/confirm`, { email });
      setMessage('Check-in realizado com sucesso! Presença confirmada.');
      loadMinistrations();
    } catch (error) {
      console.error(error);
      setMessage('Erro ao confirmar presença.');
    }
  }

  async function handleGenerateReport(ministrationId) {
    setGeneratingReportId(ministrationId);
    try {
      // Endpoint que gera o PDF no backend e envia para os admins cadastrados
      await api.post(`/ministrations/${ministrationId}/report-to-admin`);
      setMessage("O relatório de presença foi gerado e enviado para os administradores.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao gerar ou enviar o relatório.");
    } finally {
      setGeneratingReportId(null);
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

  function openYouTubeSearch(title, artist) {
    const q = `${title} ${artist || ''}`.trim();
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
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
          {(user?.role === 'admin' || user?.leader) && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 shadow-md"
            >
              {showForm ? "Cancelar" : "Nova Ministração"}
            </button>
          )}
        </div>

        {message && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {(user?.role === 'admin' || user?.leader) && showForm && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título da Ministração"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                type="date"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              >
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
            </div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Localização"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
          </div>
          
          {/* Seção de Montagem de Equipe */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4" /> Montar Equipe da Ministração
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <select 
                value={tempMember}
                onChange={(e) => setTempMember(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose-500"
              >
                <option value="">Selecionar Integrante...</option>
                {users.map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
              </select>
              <input 
                value={tempRole}
                onChange={(e) => setTempRole(e.target.value)}
                placeholder="Função (ex: Líder, Baixo...)"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose-500"
              />
              <button 
                onClick={handleAddMemberToNewTeam}
                className="bg-slate-900 text-white rounded-2xl py-2 text-sm font-bold hover:bg-slate-800 transition"
              >
                Adicionar ao Time
              </button>
            </div>
            
            {newTeam.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {newTeam.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs shadow-sm">
                    <span className="font-bold text-rose-600 uppercase">{m.role}:</span>
                    <span className="text-slate-700">{m.name}</span>
                    <button 
                      onClick={() => handleRemoveMemberFromNewTeam(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Músicas da Ministração */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Music className="w-4 h-4" /> Repertório da Ministração
            </h3>
            <div className="flex gap-3">
              <select 
                onChange={(e) => handleAddSongToNew(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose-500"
              >
                <option value="">Selecionar música do banco...</option>
                {songs.map(s => <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>)}
              </select>
            </div>
            
            {newSongs.length > 0 && (
              <div className="grid gap-2">
                {newSongs.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{s.title}</span>
                      <span className="text-slate-400">{s.artist}</span>
                    </div>
                    <button 
                      onClick={() => setNewSongs(newSongs.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notas e observações adicionais..."
            className="w-full lg:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            rows={2}
          />
          <div className="lg:col-span-2 flex justify-end">
            <button
              onClick={handleCreateMinistration}
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-lg"
            >
              Salvar Ministração
            </button>
          </div>
        </div>
        )}
      </div>

      {/* Seletor de Categorias */}
      <div className="flex gap-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm w-fit overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMinistrations.map((ministration) => (
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
            
            {/* Lista da Equipe Escalada */}
            {ministration.team && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-500" /> Time Escalado
                </h4>
                <div className="grid gap-2">
                  {ministration.team.map((member, idx) => {
                    const isConfirmed = (ministration.confirmations || []).some(
                      (c) => c.email?.toLowerCase() === member.email?.toLowerCase()
                    );
                    return (
                      <div key={idx} className="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700 uppercase">{member.role}</span>
                          {isConfirmed && <CheckCircle2 className="w-3 h-3 text-emerald-500" title="Presença Confirmada" />}
                        </div>
                        <span className="text-slate-500">{member.name}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Adicionar Integrante Manualmente no Card */}
                <div className="mt-4 flex flex-col gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <select id={`member-add-${ministration.id}`} className="rounded-xl border border-slate-200 px-2 py-2 text-[10px] outline-none">
                      <option value="">Integrante...</option>
                      {users.map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
                    </select>
                    <input id={`role-add-${ministration.id}`} placeholder="Função" className="rounded-xl border border-slate-200 px-2 py-2 text-[10px] outline-none" />
                  </div>
                  <button 
                    onClick={() => {
                      const name = document.getElementById(`member-add-${ministration.id}`).value;
                      const role = document.getElementById(`role-add-${ministration.id}`).value;
                      if(name && role) {
                        handleAddTeamMemberToExisting(ministration.id, name, role);
                        document.getElementById(`role-add-${ministration.id}`).value = "";
                      }
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-3 w-3" /> Adicionar à Escala
                  </button>
                </div>

                <a 
                  href={generateGoogleCalendarLink(ministration)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Sincronizar Google Agenda
                </a>
              </div>
            )}

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-800">Músicas</h4>
              <div className="mt-2 flex flex-col gap-2">
                {(ministration.songs || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <div className="font-medium text-sm">{s.title}</div>
                      <div className="text-xs text-slate-500">{s.artist}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <a href={getDirectLink('spotify', s)} target="_blank" rel="noreferrer" className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                          <Music className="w-3.5 h-3.5" />
                        </a>
                        <a href={getDirectLink('yt', s)} target="_blank" rel="noreferrer" className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                          <Youtube className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      
                      <button onClick={() => setPreviewSong(s)} title="Ver Player" className="p-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition">
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-col gap-1 items-end">
                        <button
                          type="button"
                          onClick={() => openSpotifySearch(s.title, s.artist)}
                          className="text-[10px] font-bold text-green-600 hover:underline"
                        >
                          +Spotify
                        </button>
                        <button
                          type="button"
                          onClick={() => openYouTubeSearch(s.title, s.artist)}
                          className="text-[10px] font-bold text-red-600 hover:underline"
                        >
                          +YouTube
                        </button>
                      </div>
                      
                      <button onClick={() => handleRemoveSong(ministration.id, s.id)} className="p-1.5 text-rose-400 hover:text-rose-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
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

            {/* Player Integrado */}
            {previewSong && (ministration.songs || []).some(s => s.id === previewSong.id) && (
              <div className="mt-4 p-4 bg-slate-900 rounded-[24px] relative animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={() => setPreviewSong(null)}
                  className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg z-10"
                >
                  <PlusCircle className="w-4 h-4 rotate-45" />
                </button>
                
                <div className="space-y-4">
                  {previewSong.spotify_url && previewSong.spotify_url.includes('track') && (
                    <iframe
                      src={`https://open.spotify.com/embed/track/${previewSong.spotify_url.split('/track/')[1].split('?')[0]}`}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                      className="rounded-xl"
                    ></iframe>
                  )}
                  
                  {previewSong.youtube_url && (previewSong.youtube_url.includes('watch?v=') || previewSong.youtube_url.includes('youtu.be/')) && (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${previewSong.youtube_url.includes('watch?v=') ? previewSong.youtube_url.split('v=')[1].split('&')[0] : previewSong.youtube_url.split('be/')[1]}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl shadow-lg"
                    ></iframe>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Ações da Escala</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendMinistrationToTeam(ministration)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition"
                  >
                    Notificar Time
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirm(ministration.id)}
                    className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Check-in
                  </button>
                </div>
              </div>
              
              {(ministration.confirmations || []).length > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3 h-3" /> Confirmados ({(ministration.confirmations || []).length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(ministration.confirmations || []).map((c) => (
                      <span key={c.id} className="text-[9px] bg-white text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
                        {c.email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
