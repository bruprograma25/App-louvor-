﻿import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Mail, Lock, Music, ArrowRight, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api, { baseRoot } from "../api/api";
import loginImage from "../assets/login-image.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const googleToken = searchParams.get("googleToken");
    const googleUser = searchParams.get("googleUser");
    if (googleToken && googleUser) {
      api.defaults.headers.common.Authorization = `Bearer ${googleToken}`;
      localStorage.setItem("token", googleToken);
      localStorage.setItem("user", googleUser);
      try {
        setUser(JSON.parse(googleUser));
      } catch (parseError) {
        console.error("Falha ao parsear usuário Google:", parseError);
      }
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, searchParams, setUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.error || "E-mail ou senha incorretos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[42px] border border-slate-200 shadow-2xl">
        <img
          src={loginImage}
          alt="Imagem de fundo da área de login"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative bg-white/95 p-10 backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <Music size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Bem-vindo</h1>
          <p className="mt-2 text-slate-500">Acesse sua conta para gerenciar o louvor</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Link "Esqueceu a senha?" */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-slate-500 hover:text-rose-600 hover:underline">Esqueceu a senha?</Link>
          </div>

          {error && <p className="text-center text-sm font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 text-sm font-semibold text-white transition hover:from-rose-700 hover:to-rose-800 disabled:opacity-70"
          >
            {loading ? "Entrando..." : (
              <>
                Entrar no App
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Botão de Login com Google - Agora com destaque */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => window.location.href = "/api/auth/google"}
            className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-blue-500 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 shadow-md"
          >
            <LogIn className="h-5 w-5" />
            Entrar com Google
          </button>
        </div>

        {/* Separador "Ou entrar com e-mail" */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Ou entrar com e-mail</span></div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{" "}
            <button onClick={() => navigate("/register")} className="font-semibold text-rose-600 hover:underline">Solicitar acesso</button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}