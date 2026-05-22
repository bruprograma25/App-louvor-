import { useEffect, useState } from "react";
import { CalendarDays, Music, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const DAYS_HEADER = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const calendarWeeks = [
  ["26", "27", "28", "29", "30", "1", "2"],
  ["3", "4", "5", "6", "7", "8", "9"],
  ["10", "11", "12", "13", "14", "15", "16"],
  ["17", "18", "19", "20", "21", "22", "23"],
  ["24", "25", "26", "27", "28", "29", "30"],
  ["31", "1", "2", "3", "4", "5", "6"],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ songs: 0, ministrations: 0, members: 0 });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard");
      setData(response.data || {});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-600 p-3 text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L19 7v10l-7 5-7-5V7l7-5z" fill="currentColor"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Olá, {user?.full_name || "Ministério de Louvor"} 👋</h1>
              <p className="text-sm text-slate-500">Ministério de Louvor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-50 p-3 text-rose-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Próximas escalas</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">0</p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-50 p-3 text-rose-700">
              <Music className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Canções</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{data.songs || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-50 p-3 text-rose-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ministrações</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{data.ministrations || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Calendário do Ministério</h2>
            <p className="mt-1 text-sm text-slate-500">Maio 2026</p>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">Mês atual</div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-slate-500">
            {DAYS_HEADER.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          {calendarWeeks.map((week, index) => (
            <div key={index} className="grid grid-cols-7 gap-2 text-center text-sm text-slate-600">
              {week.map((day) => {
                const isSelected = day === "20";
                const isMarked = day === "3";
                return (
                  <div
                    key={`${day}-${index}`}
                    className={`rounded-3xl p-3 ${
                      isSelected
                        ? "bg-rose-600 text-white"
                        : isMarked
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-50"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-rose-700">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            Culto
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-amber-700">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Ensaio
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-sky-700">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Jovens
          </span>
        </div>
      </div>
    </div>
  );
}