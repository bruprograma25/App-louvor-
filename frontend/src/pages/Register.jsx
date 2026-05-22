import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      await api.post("/register", {
        full_name: fullName,
        email,
        password,
      });

      setSuccess("Conta criada com sucesso. Faça login para continuar.");
      setError("");
      setFullName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar conta.");
      setSuccess("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Registrar nova conta</h1>
        <p className="mt-2 text-sm text-slate-500">Crie um usuário para acessar o painel de gestão.</p>

        {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <div className="mt-6 space-y-4">
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nome completo"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            type="password"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="button"
          onClick={handleRegister}
          className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Registrar
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
