export default function Devotional() {
  return (
    <div className="p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Devocional</h1>
          <p className="mt-4 text-sm text-slate-500">Acompanhe o conteúdo devocional e materiais espirituais da equipe.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          + Adicionar
        </button>
      </div>
      <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Este espaço será usado para estudos, reflexões e devocionais.</p>
      </div>
    </div>
  );
}
