import { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import { Upload, Trash2, Calendar, Search, Filter, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

function parseCSV(csvText) {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (!lines.length) return [];

  const headers = lines[0].split(/,|;/).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(/,|;/).map((value) => value.trim());
    const item = {};
    headers.forEach((header, index) => {
      item[header.toLowerCase().replace(/\s+/g, "")] = values[index] || "";
    });
    return item;
  });
}

async function parseXlsxFile(file) {
  const data = await file.arrayBuffer();
  const workbook = read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  return utils.sheet_to_json(sheet, { defval: "" });
}

const STATUS_OPTIONS = ["Pendente", "Adiado", "Concluído", "Em andamento"];

const DEFAULT_PROCESSES = [
  { month: "Fevereiro", date: "20/02/2026", title: "Culto de Casais", status: "Concluído" },
  { month: "Fevereiro", date: "Data a definir", title: "Iniciar Organização Seminário de Louvor", status: "Adiado" },
  { month: "Fevereiro", date: "27/02/2026", title: "Reunião Geral do Louvor", status: "Concluído" },
  { month: "Março", date: "06/03/2026", title: "Culto de Mulheres", status: "Concluído" },
  { month: "Março", date: "10/03/2026", title: "Ensaio Vocal Cantata de Páscoa", status: "Concluído" },
  { month: "Março", date: "11/03/2026", title: "Ensaio Vocal Cantata de Páscoa", status: "Concluído" },
  { month: "Março", date: "18/03/2026", title: "Ensaio Vocal Cantata de Páscoa", status: "Concluído" },
  { month: "Março", date: "25/03/2026", title: "Ensaio Vocal Cantata de Páscoa", status: "Concluído" },
  { month: "Abril", date: "01/04/2026", title: "Ensaio Geral Cantata de Páscoa", status: "Concluído" },
  { month: "Abril", date: "24/04/2026", title: "Culto de Homens", status: "Concluído" },
  { month: "Maio", date: "03/05/2026", title: "Culto dia das mães (kids)", status: "Concluído" },
  { month: "Maio", date: "09/05/2026", title: "Culto de Mulheres", status: "Concluído" },
  { month: "Maio", date: "27/05/2026", title: "Encontro com Apoio e Instrumentistas", status: "Concluído" },
  { month: "Maio", date: "28/05/2026", title: "Remir Regional", status: "Concluído" },
  { month: "Maio", date: "29/05/2026", title: "Remir Regional", status: "Concluído" },
  { month: "Maio", date: "30/05/2026", title: "Remir Regional", status: "Concluído" },
  { month: "Junho", date: "Data a definir", title: "Iniciar Organização Seminário de Louvor", status: "Adiado" },
  { month: "Junho", date: "Data a definir", title: "Encontro com Louvor Jovens", status: "Adiado" },
  { month: "Junho", date: "13/06/2026", title: "Culto de Casais", status: "Concluído" },
  { month: "Junho", date: "17/06/2026", title: "Encontro com Instrumentistas", status: "Concluído" },
  { month: "Junho", date: "24/06/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Junho", date: "27/06/2026", title: "Cristão e as emoções", status: "Concluído" },
  { month: "Julho", date: "Data a definir", title: "Organização Seminário de Louvor", status: "Adiado" },
  { month: "Julho", date: "18/07/2026", title: "Ação Social (Praça)", status: "Concluído" },
  { month: "Julho", date: "22/07/2026", title: "Encontro com Apoio Vocal", status: "Concluído" },
  { month: "Julho", date: "25/07/2026", title: "Culto de Homens", status: "Concluído" },
  { month: "Julho", date: "29/07/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Agosto", date: "Data a definir", title: "Organização Seminário de Louvor", status: "Adiado" },
  { month: "Agosto", date: "Data a definir", title: "Organização Conferência Profética Altar", status: "Adiado" },
  { month: "Agosto", date: "Segundas", title: "Segunda de oração - louvor", status: "Concluído" },
  { month: "Agosto", date: "08/08/2026", title: "Culto de Mulheres", status: "Concluído" },
  { month: "Agosto", date: "19/08/2026", title: "Encontro com Instrumentistas", status: "Concluído" },
  { month: "Agosto", date: "26/08/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Setembro", date: "Data a definir", title: "Encontro com Louvor Jovens", status: "Adiado" },
  { month: "Setembro", date: "Data a definir", title: "Organização Seminário de Louvor", status: "Adiado" },
  { month: "Setembro", date: "Data a definir", title: "Organização Conferência Profética Altar", status: "Adiado" },
  { month: "Setembro", date: "18/09/2026", title: "Conferência Profética Altar", status: "Concluído" },
  { month: "Setembro", date: "19/09/2026", title: "Conferência Profética Altar", status: "Concluído" },
  { month: "Setembro", date: "20/09/2026", title: "Conferência Profética Altar", status: "Concluído" },
  { month: "Setembro", date: "23/09/2026", title: "Encontro com Apoio Vocal", status: "Concluído" },
  { month: "Setembro", date: "30/09/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Outubro", date: "Data a definir", title: "Organização Seminário de Louvor", status: "Adiado" },
  { month: "Outubro", date: "10/10/2026", title: "Dia Das Crianças", status: "Concluído" },
  { month: "Outubro", date: "21/10/2026", title: "Encontro com Instrumentistas", status: "Concluído" },
  { month: "Outubro", date: "23/10/2026", title: "Congresso de Casais", status: "Concluído" },
  { month: "Outubro", date: "24/10/2026", title: "Congresso de Casais", status: "Concluído" },
  { month: "Outubro", date: "28/10/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Outubro", date: "31/10/2026", title: "Workshop Instrumental", status: "Concluído" },
  { month: "Novembro", date: "Data a definir", title: "Seminário de Louvor", status: "Adiado" },
  { month: "Novembro", date: "18/11/2026", title: "Encontro com Apoio Vocal", status: "Concluído" },
  { month: "Novembro", date: "25/11/2026", title: "Encontro com Líderes de Adoração", status: "Concluído" },
  { month: "Novembro", date: "28/11/2026", title: "Culto de Homens", status: "Concluído" },
];

function groupByMonth(processes) {
  return processes.reduce((grouped, process) => {
    const m = process.month || "Geral";
    grouped[m] = grouped[m] || [];
    grouped[m].push(process);
    return grouped;
  }, {});
}

export default function Processes() {
  const [processes, setProcesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [message, setMessage] = useState("");
  const importInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("process_schedule");
    if (stored) {
      setProcesses(JSON.parse(stored));
    } else {
      setProcesses(DEFAULT_PROCESSES);
    }
  }, []);

  useEffect(() => {
    if (processes.length) {
      localStorage.setItem("process_schedule", JSON.stringify(processes));
    }
  }, [processes]);

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let rows = [];
      if (file.name.toLowerCase().endsWith(".csv")) {
        const content = await file.text();
        rows = parseCSV(content);
      } else {
        rows = await parseXlsxFile(file);
      }

      if (!rows.length) {
        setMessage("Nenhum processo encontrado na planilha.");
        return;
      }

      const imported = rows.map((row, index) => {
        const normalized = Object.keys(row).reduce((acc, key) => {
          acc[key.toLowerCase().trim()] = row[key];
          return acc;
        }, {});

        return {
          month: normalized.mes || normalized.month || "Geral",
          date: normalized.data || normalized.dueDate || normalized.due || "Data a definir",
          title: normalized.encontro || normalized.title || normalized.event || "Processo",
          status: normalized.status || "Pendente",
        };
      });

      setProcesses((current) => [...imported, ...current]);
      setMessage("Agenda de processos importada com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao importar a planilha de processos.");
    } finally {
      event.target.value = "";
    }
  }

  function handleAddProcess() {
    const now = new Date();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const newProcess = {
      month: months[now.getMonth()],
      date: now.toLocaleDateString('pt-BR'),
      title: "Novo processo",
      status: "Pendente",
    };
    setProcesses((current) => [newProcess, ...current]);
  }

  function handleStatusChange(index, status) {
    setProcesses((current) => current.map((process, idx) => (idx === index ? { ...process, status } : process)));
  }

  function handleDeleteProcess(index) {
    setProcesses((current) => current.filter((_, idx) => idx !== index));
  }

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Todos" || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const groupedProcesses = groupByMonth(filteredProcesses);

  const getStatusStyles = (status) => {
    switch(status) {
      case "Concluído": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Em andamento": return "bg-sky-50 text-sky-700 border-sky-200";
      case "Adiado": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-8">
      {/* Header Estilo Calendário */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Calendar size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Agenda de Processos</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Planejamento Anual do Ministério de Louvor
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleImportClick} className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition-all">
              <Upload className="h-5 w-5" /> Importar
            </button>
            <button onClick={handleAddProcess} className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 transition-all">
              + Novo Evento
            </button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por título do processo..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
            <Filter className="h-5 w-5 text-slate-400" />
            <select 
              className="bg-transparent border-none focus:ring-0 font-medium text-slate-600"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos os Status</option>
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xlsm" onChange={handleImportChange} className="hidden" />

      {/* Visualização Estilo Grade de Calendário (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedProcesses).map(([month, items]) => (
          <div key={month} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{month}</h2>
              </div>
              <span className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-full">{items.length} Eventos</span>
            </div>
            
            <div className="space-y-3 flex-1">
              {items.map((process, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${getStatusStyles(process.status)} border-opacity-30`}>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm leading-tight flex-1">{process.title}</h3>
                    <button 
                      onClick={() => handleDeleteProcess(processes.indexOf(process))}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold opacity-70 uppercase">{process.date}</span>
                    <select 
                      value={process.status}
                      onChange={(e) => handleStatusChange(processes.indexOf(process), e.target.value)}
                      className="bg-white bg-opacity-50 border-none text-[10px] font-bold rounded-lg py-1 px-2 focus:ring-0 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
