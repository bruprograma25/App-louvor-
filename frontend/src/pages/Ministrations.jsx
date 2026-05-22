import { useEffect, useState } from "react";
import api from "../api/api";

export default function Ministrations() {
  const [ministrations, setMinistrations] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMinistrations();
  }, []);

  async function loadMinistrations() {
    try {
      const response = await api.get("/ministrations");
      setMinistrations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateMinistration() {
    try {
      const response = await api.post("/ministrations", {
        title,
        date,
        notes,
      });

      setMinistrations((current) => [response.data, ...current]);
      setTitle("");
      setDate("");
      setNotes("");
      setMessage("Ministração cadastrada com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao cadastrar ministração.");
    }
  }

  async function handleDeleteMinistration(id) {
    try {
      await api.delete(`/ministrations/${id}`);
      setMinistrations((current) => current.filter((ministration) => ministration.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUploadAttachment(ministrationId, file) {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data.url;
      await api.patch(`/ministrations/${ministrationId}`, { attachment_url: url });
      setMinistrations((current) => current.map((m) => (m.id === ministrationId ? { ...m, attachment_url: url } : m)));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSendMinistrationToTeam(ministration) {
    try {
      const title = `Ministração: ${ministration.title}`;
      const message = ministration.attachment_url
        ? `Nova ministração disponível: ${ministration.title} — ${window.location.origin}${ministration.attachment_url}`
        : `Nova ministração: ${ministration.title}`;

      await api.post(`/notifications`, { title, message });
      // Optionally show feedback
      setMessage("Ministração enviada para a equipe.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar ministração para a equipe.");
    }
  }

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Ministrações</h1>
            <p className="mt-2 text-sm text-slate-500">Registre cultos, reuniões e notas relevantes.</p>
          </div>
          <button
            type="button"
            onClick={handleCreateMinistration}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Adicionar ministração
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="date"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notas"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ministrations.map((ministration) => (
          <div key={ministration.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{ministration.title}</h2>
                <p className="text-sm text-slate-500">{ministration.date || "Data não informada"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
                  Evento
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteMinistration(ministration.id)}
                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                >
                  Excluir
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{ministration.notes || "Sem notas adicionais."}</p>
              <div className="mt-4 flex items-center gap-3">
                <input type="file" accept=".pdf" id={`pdf-${ministration.id}`} className="hidden" onChange={(e) => handleUploadAttachment(ministration.id, e.target.files?.[0])} />
                <label htmlFor={`pdf-${ministration.id}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
                  Enviar PDF
                </label>
                {ministration.attachment_url && (
                  <a href={ministration.attachment_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-rose-600 hover:underline">Abrir PDF</a>
                )}
                <button
                  type="button"
                  onClick={() => handleSendMinistrationToTeam(ministration)}
                  className="ml-auto rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Enviar para equipe
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
