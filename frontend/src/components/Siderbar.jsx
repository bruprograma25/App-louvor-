import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Music2,
  Bell,
  Users,
  ClipboardList,
  BookOpen,
  Church,
  Star,
  User,
  ListChecks,
} from "lucide-react";

const navigation = [
  { title: "Início", path: "/dashboard", icon: Home },
  { title: "Minha Agenda", path: "/calendar", icon: CalendarDays },
  { title: "Canções", path: "/songs", icon: Music2 },
  { title: "Quadro de Avisos", path: "/notifications", icon: Bell },
  { title: "Integrantes", path: "/members", icon: Users },
  { title: "Agenda de Processos", path: "/processes", icon: ClipboardList },
  { title: "Devocional", path: "/devotional", icon: BookOpen },
  { title: "Nossa Igreja", path: "/church", icon: Church },
  { title: "Área de Iniciantes", path: "/beginners", icon: Star },
  { title: "Meu Perfil", path: "/profile", icon: User },
];

const adminNavigation = [
  { title: "Ministrações", path: "/ministrations", icon: ListChecks },
];

export default function Siderbar() {
  return (
    <aside className="flex h-screen w-72 flex-col gap-6 border-r border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-slate-900">Ministério de Louvor</div>
        <p className="text-sm uppercase tracking-[.18em] text-rose-600">Gestão Interna</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-red-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500">Administração</div>
        <div className="mt-3 space-y-2">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-red-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
