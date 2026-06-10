import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 text-3xl font-bold text-rose-700">
            {user?.image ? (
              <img src={user.image} alt={user.full_name} className="h-full w-full rounded-full object-cover" />
            ) : (
              user?.full_name?.[0] || "U"
            )}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{user?.full_name}</h1>
            <p className="text-slate-500">{user?.voiceType || "Integrante do Ministério"}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <Mail className="text-rose-600" />
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">E-mail</p>
              <p className="font-medium text-slate-700">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <Shield className="text-rose-600" />
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Cargo / Permissão</p>
              <p className="font-medium text-slate-700">{user?.role === 'admin' ? 'Administrador' : 'Ministro / Integrante'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
