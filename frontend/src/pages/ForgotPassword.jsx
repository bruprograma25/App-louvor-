import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Music } from "lucide-react";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um formato de e-mail válido (ex: usuario@dominio.com).");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Se o e-mail estiver cadastrado, você receberá as instruções em breve.");
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Muitas tentativas. Por favor, aguarde uma hora antes de tentar novamente.");
      } else {
        setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm -z-10" />
      
      <div className="w-full max-w-[440px] rounded-[42px] border border-slate-200 bg-white p-10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <Music size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Recuperar Senha</h1>
          <p className="mt-2 text-slate-500">Informe seu e-mail para receber um link de redefinição.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail cadastrado"
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
          </div>

          {message && <p className="text-center text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">{message}</p>}
          {error && <p className="text-center text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 text-sm font-semibold text-white transition hover:from-rose-700 hover:to-rose-800 disabled:opacity-70"
          >
            {loading ? "Enviando..." : "Enviar Instruções"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition">
            <ArrowLeft size={16} />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}