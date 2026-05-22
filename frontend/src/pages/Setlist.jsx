import { useEffect, useState } from "react";
import api from "../api/api";
import SetlistDnD from "../components/SetlistDnD";

export default function Setlist() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadSetlist();
  }, []);

  async function loadSetlist() {
    try {
      const response = await api.get("/setlist");
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddItem() {
    if (!title) {
      return;
    }

    try {
      const response = await api.post("/setlist", {
        title,
        position: items.length,
      });
      setItems((current) => [response.data, ...current]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Setlist</h1>
            <p className="mt-2 text-sm text-slate-500">Organize os itens do culto e mantenha a equipe alinhada.</p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Adicionar item
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título do item do setlist"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Itens do setlist</h2>
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum item adicionado ainda.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.song?.title || item.ministration?.title || "Item geral"}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
                      Posição {item.position}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <SetlistDnD />
      </div>
    </div>
  );
}
