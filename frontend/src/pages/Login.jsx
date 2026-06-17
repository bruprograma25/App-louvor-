import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Music, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user, response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Fundo com efeito blur para destacar o card */}
      <div className="absolute inset-0 bg-rose-50/50 backdrop-blur-sm -z-10" />
      
      <div className="w-full max-w-[440px] rounded-[42px] border border-white/40 bg-white/80 p-10 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <Music size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Bem-vindo</h1>
          <p className="mt-2 text-slate-500">Acesse sua conta para gerenciar o louvor</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full rounded-3xl border border-slate-200 bg-white/50 py-4 pl-12 pr-5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full rounded-3xl border border-slate-200 bg-white/50 py-4 pl-12 pr-5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
          </div>

          {error && <p className="text-center text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {loading ? "Entrando..." : (
              <>
                Entrar no App
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{" "}
            <button onClick={() => navigate("/register")} className="font-semibold text-rose-600 hover:underline">Solicitar acesso</button>
          </p>
        </div>
      </div>
    </div>
  );
}