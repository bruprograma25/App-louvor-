import { useState } from "react";
import api from "../api/api";

export default function UploadImagem({ onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setMessage("Selecione um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = response.data.url;
      setMessage("Upload realizado com sucesso.");
      onUpload?.(url);
    } catch (error) {
      console.error(error);
      setMessage("Falha ao enviar a imagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">Enviar imagem</div>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Enviando..." : "Enviar imagem"}
      </button>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
