import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/api";

export default function Dashboard() {
  const [ministrations, setMinistrations] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/ministrations");
        setMinistrations(res.data);
      } catch (err) {
        console.error("Erro ao carregar agenda", err);
      }
    }
    loadData();
  }, []);

  // Mock de dias do calendário para visualização
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-8 space-y-8">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex items-center justify-between bg-white p-8 rounded-[34px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Minha Agenda</h1>
          <p className="text-slate-500">Confira suas próximas escalas e eventos</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100 transition"><ChevronLeft /></button>
          <span className="font-semibold text-slate-700 self-center">Janeiro 2024</span>
          <button className="p-2 rounded-full hover:bg-slate-100 transition"><ChevronRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendário Visual (Baseado na Imagem 3) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[34px] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-7 gap-4 mb-6 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <span key={day} className="text-xs font-bold uppercase text-slate-400 tracking-wider">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4 text-center">
            {/* Dias vazios para alinhar o início do mês se necessário */}
            {days.map(day => (
              <div 
                key={day} 
                className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-all cursor-pointer
                  ${day === 15 ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'hover:bg-rose-50 text-slate-600'}`}
              >
                {day}
                {day === 15 && <div className="absolute mt-8 w-1 h-1 bg-white rounded-full" />}
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Próximas Escalas */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-2">Próximas Escalas</h2>
          {ministrations.length > 0 ? (
            ministrations.map(min => (
              <div key={min.id} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase">
                      {min.cult_type || "Culto"}
                    </span>
                    <h3 className="font-bold text-slate-900">{min.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarIcon size={14} /> {min.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} /> {min.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} /> {min.location || "Templo Principal"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-10">Nenhuma escala para este mês.</p>
          )}
        </div>
      </div>
    </div>
  );
}