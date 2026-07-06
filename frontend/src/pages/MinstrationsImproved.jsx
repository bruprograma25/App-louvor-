import { useEffect, useState } from "react";
import { Calendar, Users, MapPin, Music, Trash2, Plus, X, Save } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { id: "leader", label: "Líder", color: "bg-red-500" },
  { id: "back1", label: "Back 1", color: "bg-purple-500" },
  { id: "back2", label: "Back 2", color: "bg-blue-500" },
  { id: "back3", label: "Back 3", color: "bg-pink-500" },
  { id: "keyboard", label: "Teclado", color: "bg-yellow-500" },
  { id: "guitar", label: "Guitarra", color: "bg-green-500" },
  { id: "bass", label: "Baixo", color: "bg-orange-500" },
  { id: "drums", label: "Bateria", color: "bg-gray-500" },
];

export default function MinstrationsImproved() {
  const { user } = useAuth();
  const [ministrations, setMinstrations] = useState([]);
  const [members, setMembers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "Igreja Apostólica Altar",
    notes: "",
    team: [],
    selectedSongs: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [minRes, memRes, songRes] = await Promise.all([
        api.get("/api/ministrations"),
        api.get("/api/members"),
        api.get("/songs"),
      ]);
      setMinstrations(minRes.data);
      setMembers(memRes.data);
      setSongs(songRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  function openForm(ministration = null) {
    if (ministration) {
      setFormData({
        title: ministration.title || "",
        date: ministration.date || "",
        startTime: ministration.startTime || "",
        endTime: ministration.endTime || "",
        location: ministration.location || "Igreja Apostólica Altar",
        notes: ministration.notes || "",
        team: ministration.team || [],
        selectedSongs: ministration.selectedSongs || [],
      });
      setEditingId(ministration.id);
    } else {
      setFormData({
        title: "Ministração de Louvor",
        date: "",
        startTime: "08:00",
        endTime: "12:30",
        location: "Igreja Apostólica Altar",
        notes: "",
        team: [],
        selectedSongs: [],
      });
      setEditingId(null);
    }
    setShowForm(true);
  }

  function addTeamMember(role) {
    setFormData((prev) => ({
      ...prev,
      team: [
        ...prev.team,
        { id: Date.now(), role, memberId: null, memberName: "" },
      ],
    }));
  }

  function removeTeamMember(id) {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((t) => t.id !== id),
    }));
  }

  function updateTeamMember(id, memberId, memberName) {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((t) =>
        t.id === id ? { ...t, memberId, memberName } : t
      ),
    }));
  }

  function toggleSong(songId) {
    setFormData((prev) => ({
      ...prev,
      selectedSongs: prev.selectedSongs.includes(songId)
        ? prev.selectedSongs.filter((s) => s !== songId)
        : [...prev.selectedSongs, songId],
    }));
  }

  async function handleSave() {
    if (!formData.title || !formData.date) {
      alert("Preencha pelo menos o título e data");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        notes: formData.notes,
        team: formData.team.map((t) => ({
          role: t.role,
          memberId: t.memberId,
          memberName: t.memberName,
        })),
        selectedSongs: formData.selectedSongs,
      };

      if (editingId) {
        await api.patch(`/api/ministrations/${editingId}`, payload);
      } else {
        await api.post("/api/ministrations", payload);
      }

      loadData();
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar ministração");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;
    try {
      await api.delete(`/api/ministrations/${id}`);
      loadData();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  const filteredMembers = members.filter((m) => m.status === "Apto" || m.status === "active");

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Ministrações</h1>
            <p className="mt-2 text-sm text-slate-500">
              Gerencie as escalas do ministério de louvor
            </p>
          </div>
          {(user?.role === "admin" || user?.leader) && (
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Nova Ministração
            </button>
          )}
        </div>

        {showForm && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId ? "Editar" : "Nova"} Ministração
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                type="date"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                type="time"
                placeholder="Horário de início"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                type="time"
                placeholder="Horário de término"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />
              <input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Local"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 md:col-span-2"
              />
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Observações"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 md:col-span-2"
                rows="3"
              />
            </div>

            {/* Seleção de Canções */}
            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-slate-900 flex items-center gap-2">
                <Music className="h-5 w-5 text-rose-600" />
                Canções
              </h3>
              <div className="max-h-40 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4">
                {songs.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhuma canção cadastrada</p>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.selectedSongs.includes(song.id)}
                          onChange={() => toggleSong(song.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-700">{song.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seleção de Equipe */}
            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-600" />
                Equipe
              </h3>

              {/* Mostrar membros já adicionados */}
              <div className="mb-6 space-y-3">
                {formData.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4"
                  >
                    <div
                      className={`h-10 w-10 rounded-full ${
                        ROLES.find((r) => r.id === member.role)?.color || "bg-gray-400"
                      } flex items-center justify-center text-white text-xs font-semibold`}
                    >
                      {ROLES.find((r) => r.id === member.role)?.label.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {ROLES.find((r) => r.id === member.role)?.label}
                      </p>
                      <select
                        value={member.memberId || ""}
                        onChange={(e) => {
                          const selectedMember = filteredMembers.find(
                            (m) => m.id.toString() === e.target.value
                          );
                          updateTeamMember(
                            member.id,
                            parseInt(e.target.value),
                            selectedMember?.full_name || ""
                          );
                        }}
                        className="mt-1 w-full rounded-full border border-slate-200 bg-white py-2 px-3 text-xs outline-none focus:border-rose-500"
                      >
                        <option value="">Selecionar membro...</option>
                        {filteredMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Botões para adicionar funções */}
              <div className="grid gap-2 md:grid-cols-4">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => addTeamMember(role.id)}
                    className={`rounded-full ${role.color} px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90`}
                  >
                    + {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Salvando..." : "Salvar Ministração"}
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

        {/* Lista de Ministrações */}
        <div className="mt-8">
          <h2 className="mb-4 font-semibold text-slate-900">Próximas Ministrações</h2>
          {ministrations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Nenhuma ministração cadastrada</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ministrations.map((min) => (
                <div
                  key={min.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 hover:shadow-md transition"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900">{min.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(min.date).toLocaleDateString("pt-BR")}
                    </div>
                    {min.startTime && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        ⏰ {min.startTime} - {min.endTime}
                      </div>
                    )}
                    {min.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {min.location}
                      </div>
                    )}
                  </div>

                  {/* Team preview */}
                  {min.team && min.team.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Equipe:</p>
                      <div className="flex flex-wrap gap-2">
                        {min.team.slice(0, 3).map((member, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-white rounded-full px-3 py-1 border border-slate-200"
                          >
                            {member.memberName || member.role}
                          </div>
                        ))}
                        {min.team.length > 3 && (
                          <div className="text-xs bg-white rounded-full px-3 py-1 border border-slate-200">
                            +{min.team.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Canções preview */}
                  {min.selectedSongs && min.selectedSongs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Canções:</p>
                      <div className="flex flex-wrap gap-2">
                        {min.selectedSongs.slice(0, 2).map((songId, idx) => {
                          const song = songs.find((s) => s.id === songId);
                          return (
                            <div
                              key={idx}
                              className="text-xs bg-white rounded-full px-3 py-1 border border-slate-200"
                            >
                              {song?.title || "Canção"}
                            </div>
                          );
                        })}
                        {min.selectedSongs.length > 2 && (
                          <div className="text-xs bg-white rounded-full px-3 py-1 border border-slate-200">
                            +{min.selectedSongs.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(user?.role === "admin" || user?.leader) && (
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => openForm(min)}
                        className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(min.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
