import { useEffect, useState } from "react";
import { Bell, Plus } from "lucide-react";
import api from "../api/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateNotice() {
    if (!title || !message) {
      setIsCreating(true);
      return;
    }

    try {
      const response = await api.post("/notifications", {
        title,
        message,
      });
      setNotifications((current) => [response.data, ...current]);
      setTitle("");
      setMessage("");
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8 p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Quadro de Avisos</h1>
          <p className="mt-2 text-sm text-slate-500">Comunicados do ministério</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" />
          Novo Aviso
        </button>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        {notifications.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 py-24 text-center text-slate-500">
            <Bell className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-4 text-lg font-medium text-slate-900">Nenhum aviso publicado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-[32px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
              </div>
            ))}
          </div>
        )}

        {isCreating && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Título do aviso"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Mensagem do aviso"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={handleCreateNotice}
              className="col-span-full inline-flex justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Salvar aviso
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
