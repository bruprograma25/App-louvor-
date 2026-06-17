import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import api from "../api/api";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await api.get("/ministrations");
        setEvents(
          response.data.map((item) => ({
            id: item.id,
            title: item.title,
            date: item.date || item.created_at?.slice(0, 10),
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Agenda</h1>
        <p className="mt-2 text-sm text-slate-500">Veja as ministrações agendadas diretamente em um calendário.</p>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-200">
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} height={650} />
        </div>
      </div>
    </div>
  );
}
