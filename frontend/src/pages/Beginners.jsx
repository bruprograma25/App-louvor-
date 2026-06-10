import { useEffect, useState, useMemo } from "react";
import { UserPlus, Star, Mail, Music, Trash2, Search, Info } from "lucide-react";
import api from "../api/api";

export default function Beginners() {
  const [beginners, setBeginners] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instrument, setInstrument] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBeginners();
  }, []);

  async function loadBeginners() {
    try {
      const res = await api.get("/users");
      // Filtra usuários que possuem status ou notas relacionadas a iniciantes
      const list = (res.data || []).filter(u => 
        (u.status || "").toLowerCase().includes("inici") || 
        (u.notes || "").toLowerCase().includes("inici")
      );
      setBeginners(list);
    } catch (error) {
      console.error("Erro ao carregar iniciantes:", error);
    }
  }

  async function handleAddBeginner() {
    if (!name) return;
    try {
      const res = await api.post("/users", {
        full_name: name,
        email: email || `${name.replace(/\s+/g, "").toLowerCase()}@altar.com`,
        password: "iniciante123",
        voiceType: instrument,
        status: "Iniciante",
        notes: notes || "Novo iniciante no ministério"
      });
      setBeginners([res.data, ...beginners]);
      setName("");
      setEmail("");
      setInstrument("");
      setNotes("");
      setMessage("Iniciante adicionado com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao adicionar iniciante.");
    }
  }

  const filteredBeginners = useMemo(() => {
    return beginners.filter(b => 
      b.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (b.voiceType || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [beginners, search]);

  return (
    <div className="p-10 space-y-8">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Área de Iniciantes</h1>
            <p className="mt-2 text-sm text-slate-500">Gestão e acompanhamento de novos membros em treinamento.</p>
          </div>
          <Star className="h-10 w-10 text-amber-400 fill-amber-400" />
        </div>

        {message && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-sm">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <input 
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Nome do Iniciante" 
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
          <input 
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="E-mail (opcional)" 
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
          <input 
            value={instrument} onChange={e => setInstrument(e.target.value)}
            placeholder="Instrumento / Voz" 
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
          <button 
            onClick={handleAddBeginner}
            className="flex items-center justify-center gap-2 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition"
          >
            <UserPlus className="h-4 w-4" /> Adicionar
          </button>
          <textarea 
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Observações iniciais..." 
            className="md:col-span-2 lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input 
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filtrar iniciantes..." 
          className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 bg-white shadow-sm outline-none focus:border-rose-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBeginners.map(beginner => (
          <div key={beginner.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                {beginner.full_name[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{beginner.full_name}</h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Music className="h-3 w-3" /> {beginner.voiceType || "Não definido"}
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 flex items-start gap-2">
              <Info className="h-4 w-4 text-slate-400 shrink-0" />
              {beginner.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}