import { Bell, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";

const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:5000", {
  autoConnect: true,
});

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadNotifications();

    const handleNewNotification = (notification) => {
      setNotifications((current) => [notification, ...current]);
    };

    socket.on("notification", handleNewNotification);
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CheckCircle2 className="h-4 w-4 text-sky-500" /> Notificações
            </div>
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-slate-700"
              onClick={() => setNotifications([])}
            >
              Limpar
            </button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma notificação disponível.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-900">{notification.title}</div>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
