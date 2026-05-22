import { useEffect, useState } from "react";
import { MapPin, Clock3, Instagram, Youtube, ExternalLink } from "lucide-react";

export default function Church() {
  const [address, setAddress] = useState("");
  const [serviceDays, setServiceDays] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAddress(localStorage.getItem("church_address") || "ADE Águas Claras - Arniqueira, Brasília - DF, 71986-720");
    setServiceDays(localStorage.getItem("church_serviceDays") || "Domingo Manhã: 10h");
    setInstagramUrl(localStorage.getItem("church_instagramUrl") || "https://www.instagram.com/igrejaapostolicaaltar");
    setYoutubeUrl(localStorage.getItem("church_youtubeUrl") || "https://www.youtube.com/@igrejaapostolicaaltar");
  }, []);

  function handleSave() {
    localStorage.setItem("church_address", address);
    localStorage.setItem("church_serviceDays", serviceDays);
    localStorage.setItem("church_instagramUrl", instagramUrl);
    localStorage.setItem("church_youtubeUrl", youtubeUrl);
    setMessage("Informações atualizadas com sucesso.");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Igreja Apostólica Altar</h1>
        <p className="mt-2 text-sm text-slate-500">Dados da igreja, cultos e redes sociais.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="h-5 w-5 text-rose-600" />
              <div>
                <p className="text-xs uppercase tracking-[.2em] text-slate-500">Endereço</p>
                <p className="mt-2 text-sm text-slate-700">{address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-slate-700">
              <Clock3 className="h-5 w-5 text-rose-600" />
              <div>
                <p className="text-xs uppercase tracking-[.2em] text-slate-500">Dias de Culto</p>
                <p className="mt-2 text-sm text-slate-700">{serviceDays}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-900">Redes Sociais</p>
          <div className="mt-4 space-y-3">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100">
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-rose-600" />
                Instagram
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100">
              <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-rose-600" />
                YouTube
              </div>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Editar informações</h2>
          <div className="mt-4 grid gap-4">
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Endereço"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={serviceDays}
              onChange={(event) => setServiceDays(event.target.value)}
              placeholder="Dias de culto"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              placeholder="Link do Instagram"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="Link do YouTube"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Salvar informações
            </button>
            {message && <p className="text-sm text-rose-600">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
