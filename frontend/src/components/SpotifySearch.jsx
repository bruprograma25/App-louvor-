import { useState } from "react";
import { Search, Loader, X } from "lucide-react";
import spotifyService from "../services/spotifyService";

export default function SpotifySearch({ onSelectTrack, autoHideName = true }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  async function handleSearch() {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const tracks = await spotifyService.searchTracks(query);
      setResults(tracks);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectTrack(track) {
    if (onSelectTrack) {
      onSelectTrack(track);
    }
    if (autoHideName) {
      setQuery("");
      setShowResults(false);
      setResults([]);
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="🎵 Digite o nome da música ou artista..."
          className="flex-1 rounded-2xl border border-green-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-green-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
        {query && (
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-3 py-2 text-slate-600 transition hover:bg-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-2 max-h-64 overflow-y-auto space-y-1">
          {results.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className="w-full text-left flex gap-3 p-2 rounded hover:bg-green-100 transition"
            >
              {track.image && (
                <img src={track.image} alt={track.name} className="w-10 h-10 rounded flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{track.name}</p>
                <p className="text-xs text-slate-600 truncate">{track.artist}</p>
                {track.preview_url && (
                  <p className="text-xs text-green-600">▶ Preview disponível</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
          Nenhuma música encontrada. Tente outro termo.
        </div>
      )}
    </div>
  );
}
