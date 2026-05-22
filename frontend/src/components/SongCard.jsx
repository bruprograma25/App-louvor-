import { Youtube, Music2, Play, BookOpen, Trash2 } from "lucide-react";

export default function SongCard({ song, onDelete }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-rose-50 p-3 text-rose-600">
              <Music2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{song.title}</h3>
              <p className="text-sm text-slate-500">{song.artist || "Artista desconhecido"}</p>
            </div>
          </div>
          {song.leader && (
            <p className="mt-3 text-sm text-slate-500">
              Líder: <span className="font-semibold text-slate-800">{song.leader}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
            {song.key || "N/A"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[.2em] text-slate-600">
            {song.bpm ? `${song.bpm} BPM` : "BPM não informado"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          {song.youtube_url ? (
            <a href={song.youtube_url} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:text-rose-600">
              Ver no YouTube
            </a>
          ) : (
            "YouTube não adicionado"
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={song.youtube_url || "#"}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              song.youtube_url ? "border-rose-600 bg-rose-600 text-white hover:bg-rose-700" : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Youtube className="h-4 w-4" />
            YT
          </a>
          <a
            href={song.spotify_url || "#"}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              song.spotify_url ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Play className="h-4 w-4" />
            Spotify
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            <BookOpen className="h-4 w-4" />
            Cifra
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
