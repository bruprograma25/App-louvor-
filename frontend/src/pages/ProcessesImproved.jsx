import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, X, Edit, MapPin, User, Clock, FileText } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const STATUSES = [
  { id: "planejado", label: "Planejado", color: "bg-blue-500" },
  { id: "em_andamento", label: "Em Andamento", color: "bg-yellow-500" },
  { id: "concluído", label: "Concluído", color: "bg-green-500" },
];

export default function ProcessesImproved() {
  const { user } = useAuth();
  const [processes, setProcesses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    process_date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "12:00",
    location: "",
    responsible: "",
    category: "",
    status: "planejado",
    notes: "",
  });

  useEffect(() => {
    loadProcesses();
  }, [statusFilter]);

  async function loadProcesses() {
    try {
      const params = statusFilter === "todos" ? {} : { status: statusFilter };
      const response = await api.get("/processes", { params });
      setProcesses(response.data);
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
    }
  }

  function openForm(processItem = null) {
    if (processItem) {
      setFormData({
        name: processItem.name || "",
        description: processItem.description || "",
        process_date: processItem.process_date || "",
        start_time: processItem.start_time || "09:00",
        end_time: processItem.end_time || "12:00",
        location: processItem.location || "",
        responsible: processItem.responsible || "",
        category: processItem.category || "",
        status: processItem.status || "planejado",
        notes: processItem.notes || "",
      });
      setEditingId(processItem.id);
    } else {
      setFormData({
        name: "",
        description: "",
        process_date: new Date().toISOString().split("T")[0],
        start_time: "09:00",
        end_time: "12:00",
        location: "",
        responsible: "",
        category: "",
        status: "planejado",
        notes: "",
      });
      setEditingId(null);
    }
    setShowForm(true);
  }

  async function handleSave() {
    if (!formData.name.trim()) {
      alert("Preencha o nome do processo");
      return;
    }

    if (!formData.process_date) {
      alert("Preencha a data do processo");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.patch(`/processes/${editingId}`, formData);
      } else {
        await api.post("/processes", formData);
      }

      loadProcesses();
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar processo");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja remover este processo?")) return;

    try {
      await api.delete(`/processes/${id}`);
      loadProcesses();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  const getStatusColor = (status) => {
    return STATUSES.find((s) => s.id === status)?.color || "bg-gray-500";
  };

  const getStatusLabel = (status) => {
    return STATUSES.find((s) => s.id === status)?.label || "Desconhecido";
  };

  const filteredProcesses = processes.filter((p) => {
    if (statusFilter === "todos") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Agenda de Processos
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Gerencie os eventos e processos do ministério
            </p>
          </div>
          {(user?.role === "admin" || user?.leader) && (
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Novo Processo
            </button>
          )}
        </div>

        {showForm && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId ? "Editar" : "Novo"} Processo
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do evento/processo"
                  className="w-full rounded-3xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição"
                rows="3"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Data do Evento
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      value={formData.process_date}
                      onChange={(e) =>
                        setFormData({ ...formData, process_date: e.target.value })
                      }
                      type="date"
                      className="w-full rounded-3xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Categoria
                  </label>
                  <input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Ex: Administrativo, Espiritual"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Horário de Início
                  </label>
                  <input
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    type="time"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Horário de Término
                  </label>
                  <input
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    type="time"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Local"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                />

                <input
                  value={formData.responsible}
                  onChange={(e) =>
                    setFormData({ ...formData, responsible: e.target.value })
                  }
                  placeholder="Responsável"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                />
              </div>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notas adicionais"
                rows="2"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Processo"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mt-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("todos")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              statusFilter === "todos"
                ? "bg-rose-600 text-white"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === s.id
                  ? `${s.color} text-white`
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Lista de Processos */}
        <div className="mt-8">
          {filteredProcesses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Nenhum processo nesta categoria</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProcesses.map((process) => (
                <div
                  key={process.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {process.name}
                      </h3>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                          process.status
                        )}`}
                      >
                        {getStatusLabel(process.status)}
                      </span>
                    </div>
                    {(user?.role === "admin" || user?.leader) && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openForm(process)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(process.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {process.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {process.description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-slate-500">
                    {process.process_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(process.process_date).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    )}

                    {process.start_time && process.end_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {process.start_time} - {process.end_time}
                      </div>
                    )}

                    {process.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {process.location}
                      </div>
                    )}

                    {process.responsible && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {process.responsible}
                      </div>
                    )}

                    {process.category && (
                      <div className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {process.category}
                      </div>
                    )}
                  </div>

                  {process.notes && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                      <p className="font-semibold mb-1">Notas:</p>
                      <p className="line-clamp-2">{process.notes}</p>
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