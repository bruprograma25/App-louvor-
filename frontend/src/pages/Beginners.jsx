import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

const defaultBeginners = [
  {
    id: "lg",
    name: "LUIS GUSTAVO",
    role: "Instrumental",
    skills: "Teclado / Violão / Guitarra / Baixo",
    badge: "Iniciante",
    tasks: [],
  },
  {
    id: "ld",
    name: "LUIDI",
    role: "Líder de Adoração",
    skills: "Violão",
    badge: "Iniciante",
    tasks: [],
  },
];

const categories = ["Prática", "Técnica", "Estudo", "Acompanhamento"];

export default function Beginners() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState(categories[0]);
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLink, setTaskLink] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("beginners_data");
    if (saved) {
      setStudents(JSON.parse(saved));
      return;
    }
    setStudents(defaultBeginners);
  }, []);

  useEffect(() => {
    if (!students.length) return;
    localStorage.setItem("beginners_data", JSON.stringify(students));
  }, [students]);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  function openTaskModal(studentId) {
    setSelectedStudentId(studentId);
    setTaskTitle("");
    setTaskDescription("");
    setTaskCategory(categories[0]);
    setTaskDueDate("");
    setTaskLink("");
  }

  function closeTaskModal() {
    setSelectedStudentId(null);
  }

  function saveTask() {
    if (!taskTitle.trim()) return;

    setStudents((current) =>
      current.map((student) => {
        if (student.id !== selectedStudentId) return student;

        const nextTask = {
          id: `${student.id}-${Date.now()}`,
          title: taskTitle,
          description: taskDescription,
          category: taskCategory,
          dueDate: taskDueDate,
          resourceLink: taskLink,
        };

        return {
          ...student,
          tasks: [...student.tasks, nextTask],
        };
      })
    );

    closeTaskModal();
  }

  return (
    <div className="p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            ⭐ Área de Iniciantes
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Acompanhamento e desenvolvimento de novos integrantes</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Aqui você acompanha as primeiras tarefas dos novos integrantes e acompanha seu desenvolvimento musical.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {students.map((student) => (
          <div key={student.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[.3em] text-slate-500">{student.role}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{student.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{student.skills}</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">{student.badge}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openTaskModal(student.id)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:text-rose-700"
              >
                <Plus className="h-4 w-4" />
                Tarefa
              </button>
            </div>

            <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              {student.tasks.length > 0 ? (
                <div className="space-y-3">
                  {student.tasks.map((task) => (
                    <div key={task.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          {task.category}
                        </span>
                      </div>
                      {task.description && <p className="mt-2 text-slate-600">{task.description}</p>}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {task.dueDate && <span>Prazo: {task.dueDate}</span>}
                        {task.resourceLink && (
                          <a href={task.resourceLink} target="_blank" rel="noreferrer" className="font-semibold text-rose-600 hover:underline">
                            Ver recurso
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-500">Nenhuma tarefa atribuída. Clique em "+ Tarefa".</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Nova Tarefa para {selectedStudent.name}</h2>
                <p className="mt-2 text-sm text-slate-500">Preencha as informações para acompanhar o desenvolvimento.</p>
              </div>
              <button onClick={closeTaskModal} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Ex: Aprender escala pentatônica"
                className="w-full rounded-3xl border border-rose-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <textarea
                value={taskDescription}
                onChange={(event) => setTaskDescription(event.target.value)}
                rows={4}
                placeholder="Descreva o que deve ser feito..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  value={taskCategory}
                  onChange={(event) => setTaskCategory(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  value={taskDueDate}
                  onChange={(event) => setTaskDueDate(event.target.value)}
                  placeholder="dd/mm/aaaa"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
                />
              </div>
              <input
                value={taskLink}
                onChange={(event) => setTaskLink(event.target.value)}
                placeholder="Link de recurso (YouTube, artigo...)"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={saveTask}
                className="w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Salvar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
