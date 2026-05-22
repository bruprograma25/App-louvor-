import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin() {
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao fazer login.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Entrar</h1>
        <p className="mt-2 text-sm text-slate-500">Acesse o painel do louvor com suas credenciais.</p>

        {error && <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 space-y-4">
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
          onClick={handleLogin}
          className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Entrar
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Não tem conta?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
