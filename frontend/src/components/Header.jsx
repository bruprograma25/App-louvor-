import NotificationBell from "./NotificationBell";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 rounded-[32px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-slate-500">Bem-vindo de volta,</p>
        <h1 className="text-2xl font-semibold text-slate-900">{user?.full_name || "Time de Louvor"}</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar músicas, membros ou ministrações"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <NotificationBell />

        <button
          type="button"
          onClick={logout}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
