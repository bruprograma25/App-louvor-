import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, AlertTriangle, Info, CheckCircle, X } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const PRIORITIES = [
  { id: "normal", label: "Normal", color: "bg-blue-500" },
  { id: "importante", label: "Importante", color: "bg-yellow-500" },
  { id: "urgente", label: "Urgente", color: "bg-red-500" },
];

const STATUSES = [
  { id: "ativo", label: "Ativo" },
  { id: "arquivado", label: "Arquivado" },
  { id: "expirado", label: "Expirado" },
];

export default function NotificationsImproved() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ativo");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    notice_date: new Date().toISOString().split("T")[0],
    expire_date: "",
    priority: "normal",
  });

  useEffect(() => {
    loadNotifications();
  }, [statusFilter]);

  async function loadNotifications() {
    try {
      const response = await api.get("/notifications", {
        params: { status: statusFilter },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      message: "",
      notice_date: new Date().toISOString().split("T")[0],
      expire_date: "",
      priority: "normal",
    });
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      alert("Preencha o título do aviso");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notifications", {
        ...formData,
        author: user?.full_name || "Admin",
        status: "ativo",
      });

      loadNotifications();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao criar aviso:", error);
      alert("Erro ao criar aviso");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja remover este aviso?")) return;

    try {
      await api.delete(`/notifications/${id}`);
      loadNotifications();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  async function handleArchive(id) {
    try {
      await api.patch(`/notifications/${id}`, { status: "arquivado" });
      loadNotifications();
    } catch (error) {
      console.error("Erro ao arquivar:", error);
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgente":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "importante":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Quadro de Avisos</h1>
            <p className="mt-2 text-sm text-slate-500">
              Gerencie os avisos do ministério
            </p>
          </div>
          {(user?.role === "admin" || user?.leader) && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 shadow-md"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancelar" : "Novo Aviso"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Novo Aviso</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título do aviso"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />

              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Descrição do aviso"
                rows="4"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Data do Aviso
                  </label>
                  <input
                    value={formData.notice_date}
                    onChange={(e) =>
                      setFormData({ ...formData, notice_date: e.target.value })
                    }
                    type="date"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Data de Expiração
                  </label>
                  <input
                    value={formData.expire_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expire_date: e.target.value })
                    }
                    type="date"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Aviso"}
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
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === s.id
                  ? "bg-rose-600 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Lista de Avisos */}
        <div className="mt-8">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <Bell className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">Nenhum aviso nesta categoria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getPriorityIcon(notif.priority)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {notif.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {notif.message}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                          {notif.notice_date && (
                            <div>
                              <span className="font-semibold">Data:</span>{" "}
                              {new Date(notif.notice_date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </div>
                          )}
                          {notif.expire_date && (
                            <div>
                              <span className="font-semibold">Expira:</span>{" "}
                              {new Date(notif.expire_date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </div>
                          )}
                          {notif.author && (
                            <div>
                              <span className="font-semibold">Por:</span>{" "}
                              {notif.author}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold">Status:</span>{" "}
                            <span className="capitalize">{notif.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(user?.role === "admin" || user?.leader) && (
                      <div className="flex gap-2 ml-4">
                        {notif.status === "ativo" && (
                          <button
                            onClick={() => handleArchive(notif.id)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            title="Arquivar"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          title="Deletar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
