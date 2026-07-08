import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Music, GripVertical, ExternalLink, Youtube, Play, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/api";

function SortableItem({ id, song, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{song.title}</h4>
        <p className="text-sm text-slate-500">{song.artist}</p>
      </div>
      <div className="flex gap-1">
        {song.spotify_url && (
          <a href={song.spotify_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-green-100 text-green-700 rounded-lg">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {song.youtube_url && (
          <a href={song.youtube_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-red-100 text-red-700 rounded-lg">
            <Youtube className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      <button onClick={() => onDelete(song.id)} className="text-red-500 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function SetlistDnD() {
  const [songs, setSongs] = useState([]);
  const [setlist, setSetlist] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSongs();
    loadSetlist();
  }, []);

  async function loadSongs() {
    try {
      const response = await api.get("/songs");
      setSongs(response.data);
    } catch (error) {
      console.error("Erro ao carregar canções:", error);
    }
  }

  async function loadSetlist() {
    try {
      const response = await api.get("/setlist");
      setSetlist(response.data);
    } catch (error) {
      console.error("Erro ao carregar setlist:", error);
    }
  }

  async function handleAddSong() {
    if (!selectedSong) return;
    
    try {
      const song = songs.find(s => s.id === parseInt(selectedSong));
      const response = await api.post("/setlist", {
        title: song.title,
        song_id: song.id,
        position: setlist.length
      });
      setSetlist(prev => [...prev, response.data]);
      setSelectedSong("");
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/setlist/${id}`);
      setSetlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSetlist((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Adicionar ao Setlist</h2>
        <div className="flex gap-3">
          <select
            value={selectedSong}
            onChange={(e) => setSelectedSong(e.target.value)}
            className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          >
            <option value="">Selecionar música do banco...</option>
            {songs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} - {s.artist}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddSong}
            disabled={!selectedSong}
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={setlist.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-6">
            {setlist.length === 0 ? (
              <div className="text-center py-12">
                <Music className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-slate-500">Arraste músicas aqui ou selecione do banco</p>
              </div>
            ) : (
              <div className="space-y-3">
                {setlist.map((item) => (
                  <SortableItem 
                    key={item.id} 
                    id={item.id} 
                    song={item.song || item} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}