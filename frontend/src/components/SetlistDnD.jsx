import { DndContext } from "@dnd-kit/core";

export default function SetlistDnD() {
  function handleDragEnd() {
    console.log("movido");
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Arraste músicas aqui</p>
        <p className="mt-2 text-sm">Use este espaço para planejar a sequência de canções.</p>
      </div>
    </DndContext>
  );
}
