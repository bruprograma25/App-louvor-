import { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import { Upload, Trash2 } from "lucide-react";

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
    grouped[process.month] = grouped[process.month] || [];
    grouped[process.month].push(process);
    return grouped;
  }, {});
}

export default function Processes() {
  const [processes, setProcesses] = useState([]);
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
    const newProcess = {
      month: "Novo",
      date: "Data a definir",
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

  const groupedProcesses = groupByMonth(processes);

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Agenda de Processos</h1>
            <p className="mt-2 text-sm text-slate-500">Mapeamento e agenda geral do Ministério de Louvor</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Importar Planilha
            </button>
            <button
              type="button"
              onClick={handleAddProcess}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </div>

      <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xlsm" onChange={handleImportChange} className="hidden" />

      {message && (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedProcesses).map(([month, items]) => (
          <div key={month} className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-[24px] bg-rose-50 px-4 py-3 text-sm font-semibold uppercase tracking-[.15em] text-rose-700">
              {month}
            </div>
            <div className="mt-4 space-y-4">
              {items.map((process, index) => (
                <div key={`${month}-${index}`} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-[136px] text-sm font-semibold text-slate-500">{process.date}</div>
                    <div className="flex-1 text-sm font-semibold text-slate-900">{process.title}</div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          process.status === "Concluído"
                            ? "bg-emerald-100 text-emerald-700"
                            : process.status === "Adiado"
                            ? "bg-rose-100 text-rose-700"
                            : process.status === "Em andamento"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {process.status}
                      </span>
                      <select
                        value={process.status}
                        onChange={(event) => handleStatusChange(processes.indexOf(process), event.target.value)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteProcess(processes.indexOf(process))}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
