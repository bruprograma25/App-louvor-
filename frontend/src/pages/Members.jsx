import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Upload, Trash2 } from "lucide-react";
import { read, utils } from "xlsx";
import api from "../api/api";

const STATUS_OPTIONS = ["Apto", "Inapto", "Em breve", "Breve", "Dezembro"];

const DEFAULT_MEMBERS = [
  {
    id: "member-bruna",
    full_name: "BRUNA",
    email: "brunarrocha@gmail.com",
    voiceType: "Mezzo-soprano",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
    spotify_url: "https://open.spotify.com/search/BRUNA",
    youtube_url: "https://www.youtube.com/results?search_query=BRUNA",
    cifra_url: "https://www.cifraclub.com.br/busca/?q=BRUNA",
  },
  {
    id: "member-luidi",
    full_name: "LUIDI",
    email: "luidi@louvor.com",
    voiceType: "Violão",
    roleBadge: "Violão",
    leader: false,
    status: "Breve",
    notes: "Liderando períodos de sala de oração",
    spotify_url: "https://open.spotify.com/search/LUIDI",
    youtube_url: "https://www.youtube.com/results?search_query=LUIDI",
    cifra_url: "https://www.cifraclub.com.br/busca/?q=LUIDI",
  },
  {
    id: "member-pra-sarah",
    full_name: "PRA. SARAH",
    email: "sarinahadoradora@gmail.com",
    voiceType: "Mezzo-soprano",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-beatriz",
    full_name: "BEATRIZ",
    email: "balmeida82282@gmail.com",
    voiceType: "Mezzo-soprano",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "Líder de time de louvor jovens",
    spotify_url: "https://open.spotify.com/search/BEATRIZ",
    youtube_url: "https://www.youtube.com/results?search_query=BEATRIZ",
    cifra_url: "https://www.cifraclub.com.br/busca/?q=BEATRIZ",
  },
  {
    id: "member-pri",
    full_name: "PRI",
    email: "pricampos.r@gmail.com",
    voiceType: "Soprano",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-thiago-a",
    full_name: "THIAGO A",
    email: "thiagoazevedo92@gmail.com",
    voiceType: "Tenor",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-valeska",
    full_name: "VALESKA",
    email: "familiaalmeida626@gmail.com",
    voiceType: "Mezzo-soprano",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-helosman",
    full_name: "HELOSMAN",
    email: "helosman.unb@gmail.com",
    voiceType: "Barítono",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-claudia",
    full_name: "CLAUDIA",
    email: "claudiakismann@gmail.com",
    voiceType: "Contralto",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-pr-breno",
    full_name: "PR. BRENO",
    email: "brenno.maia@gmail.com",
    voiceType: "Tenor / Bateria",
    roleBadge: "Instrumental",
    leader: true,
    status: "Apto",
    notes: "",
    spotify_url: "",
    youtube_url: "",
    cifra_url: "",
  },
  {
    id: "member-isaias",
    full_name: "ISAIAS",
    email: "oisaiasbarbeiro@gmail.com",
    voiceType: "Tenor / Teclado",
    roleBadge: "Instrumental / Backing",
    leader: true,
    status: "Apto",
    notes: "",
  },
  {
    id: "member-tati",
    full_name: "TATI",
    email: "tatianemmlima@gmail.com",
    voiceType: "Contralto",
    roleBadge: "Backing Vocal",
    leader: true,
    status: "Apto",
    notes: "",
    spotify_url: "",
    youtube_url: "",
    cifra_url: "",
  },
];

function parseCSV(csvText) {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (!lines.length) return [];

  const headers = lines[0].split(/,|;/).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(/,|;/).map((value) => value.trim());
    const item = {};
    headers.forEach((header, index) => {
      item[header.toLowerCase().replace(/\s+/g, "")] = values[index] || "";
    });
    return item;
  });
}

async function parseXlsxFile(file) {
  const data = await file.arrayBuffer();
  const workbook = read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  return utils.sheet_to_json(sheet, { defval: "" });
}

export default function Members() {
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [cifraUrl, setCifraUrl] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [memberStatuses, setMemberStatuses] = useState(
    DEFAULT_MEMBERS.reduce((acc, member) => {
      acc[member.id] = member.status;
      return acc;
    }, {})
  );
  const importInputRef = useRef(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await api.get("/users");
        if (response.data?.length) {
          setMembers(response.data);
          const statusMap = response.data.reduce((acc, member) => {
            acc[member.id] = member.status || "Apto";
            return acc;
          }, {});
          setMemberStatuses(statusMap);
        }
      } catch (error) {
        console.warn("Backend usuários indisponível, usando dados locais.", error);
      }
    }

    loadMembers();
  }, []);

  async function handleCreateMember() {
    try {
      const response = await api.post("/users", {
        full_name: fullName,
        email,
        password,
        image,
        spotify_url: spotifyUrl,
        youtube_url: youtubeUrl,
        cifra_url: cifraUrl,
      });

      const newMember = {
        id: response.data?.id || `local-${Date.now()}`,
        full_name: fullName,
        email,
        image: response.data?.image || image,
        spotify_url: spotifyUrl,
        youtube_url: youtubeUrl,
        cifra_url: cifraUrl,
        voiceType: response.data?.voiceType || "",
        roleBadge: response.data?.roleBadge || "",
        leader: response.data?.leader || false,
        status: "Apto",
        notes: "",
      };

      setMembers((current) => [newMember, ...current]);
      setMemberStatuses((current) => ({ ...current, [newMember.id]: "Apto" }));
      setFullName("");
      setEmail("");
      setPassword("");
      setSpotifyUrl("");
      setYoutubeUrl("");
      setCifraUrl("");
      setImage("");
      setMessage("Membro cadastrado com sucesso.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao cadastrar membro.");
      console.error(error);
    }
  }

  function handleImportClick() {
    importInputRef.current?.click();
  }

  async function handleImportChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let rows = [];
      if (file.name.toLowerCase().endsWith(".csv")) {
        const content = await file.text();
        rows = parseCSV(content);
      } else {
        rows = await parseXlsxFile(file);
      }

      const imported = rows.map((row, index) => {
        const normalize = (key) => key.toLowerCase().replace(/\s+/g, "");
        const mappedRow = Object.keys(row).reduce((acc, key) => {
          acc[normalize(key)] = row[key];
          return acc;
        }, {});

        return {
          id: `imported-${Date.now()}-${index}`,
          full_name: mappedRow["nome"] || mappedRow["name"] || "",
          email: mappedRow["email"] || mappedRow["e-mail"] || "",
          voiceType: mappedRow["voicetype"] || mappedRow["voz"] || "",
          roleBadge: mappedRow["cargo"] || mappedRow["role"] || "",
          leader: mappedRow["lider"] === "sim" || mappedRow["leader"] === "true",
          status: mappedRow["status"] || "Apto",
          notes: mappedRow["observacao"] || mappedRow["notes"] || "",
          spotify_url: mappedRow["spotify"] || mappedRow["spotify_url"] || mappedRow["spotifyurl"] || "",
          youtube_url: mappedRow["youtube"] || mappedRow["youtube_url"] || mappedRow["youtubeurl"] || "",
          cifra_url: mappedRow["cifra"] || mappedRow["cifra_url"] || mappedRow["cifraurl"] || "",
        };
      });

      if (!imported.length) {
        setMessage("Nenhum integrante encontrado na planilha.");
        return;
      }

      setMembers((current) => [...imported, ...current]);
      setMemberStatuses((current) => {
        const next = { ...current };
        imported.forEach((member) => {
          next[member.id] = member.status || "Apto";
        });
        return next;
      });
      setMessage("Integrantes importados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao importar planilha. Verifique o arquivo e tente novamente.");
    } finally {
      event.target.value = "";
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      [member.full_name, member.email, member.voiceType, member.roleBadge]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()))
    );
  }, [members, search]);

  function handleStatusChange(memberId, status) {
    setMemberStatuses((current) => ({ ...current, [memberId]: status }));
  }

  function handleDeleteMember(id) {
    setMembers((current) => current.filter((member) => member.id !== id));
    setMemberStatuses((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  async function handleMemberImageChange(memberId, file) {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      setMembers((current) => current.map((m) => (m.id === memberId ? { ...m, image: url } : m)));
      setMessage("Foto atualizada com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar a foto.");
    }
  }

  return (
    <div className="space-y-8 p-10">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Integrantes do Ministério</h1>
            <p className="mt-2 text-sm text-slate-500">{members.length} integrantes cadastrados</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Importar Planilha
            </button>
            <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xlsm" onChange={handleImportChange} className="hidden" />
            <button
              type="button"
              onClick={handleCreateMember}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </div>

        <div className="mt-6 relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar integrante..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 px-5 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredMembers.map((member) => (
          <div key={member.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-xl font-bold text-rose-700 overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.full_name} className="h-14 w-14 object-cover" />
                  ) : (
                    member.full_name?.[0] || "U"
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{member.full_name}</h3>
                  <p className="text-sm text-slate-500">{member.voiceType}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMember(member.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600">{member.email}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${member.email}`}
                className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
              >
                Email
              </a>
              {member.spotify_url ? (
                <a
                  href={member.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm"
                >
                  Spotify
                </a>
              ) : null}
              {member.youtube_url ? (
                <a
                  href={member.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm"
                >
                  YouTube
                </a>
              ) : null}
              {member.cifra_url ? (
                <a
                  href={member.cifra_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm"
                >
                  Cifra Club
                </a>
              ) : null}
              <a
                href={`https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
                  `Reunião com ${member.full_name}`
                )}&details=${encodeURIComponent(member.roleBadge || "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm"
              >
                Google Agenda
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {member.roleBadge}
              </span>
              {member.leader && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                  Líder de Time
                </span>
              )}
            </div>

            <div className="mt-4 rounded-3xl bg-slate-50 p-3">
              <select
                value={memberStatuses[member.id] || member.status}
                onChange={(event) => handleStatusChange(member.id, event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {member.notes && <p className="mt-3 text-sm text-slate-600">{member.notes}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Novo integrante</h2>
        <p className="mt-2 text-sm text-slate-500">Cadastre um membro com e-mail e senha para iniciar.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nome completo"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            type="password"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
            <p className="text-sm text-slate-500">Upload de foto</p>
            <input type="file" onChange={(e) => setImage(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : "")} className="mt-2 w-full text-sm" />
          </div>
          <input
            value={spotifyUrl}
            onChange={(event) => setSpotifyUrl(event.target.value)}
            placeholder="Spotify URL (opcional)"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
          <input
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="YouTube URL (opcional)"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
          <input
            value={cifraUrl}
            onChange={(event) => setCifraUrl(event.target.value)}
            placeholder="Cifra Club URL (opcional)"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-rose-500"
          />
        </div>
        {message && <p className="mt-4 text-sm text-rose-600">{message}</p>}
      </div>
    </div>
  );
}
