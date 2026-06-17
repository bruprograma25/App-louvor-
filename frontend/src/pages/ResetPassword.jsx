import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Music, CheckCircle2, Circle } from "lucide-react"; // Importado Circle
import api from "../api/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Estados para o checklist de força da senha
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Verifica se o token é válido ao carregar a página
        await api.get(`/auth/verify-token?token=${token}`);
      } catch (err) {
        setError("O link de redefinição de senha é inválido ou já expirou. Por favor, solicite um novo.");
      }
    }
    verifyToken();
  }, [token, navigate]);

  const handlePasswordChange = (val) => {
    setPassword(val);
    
    let s = 0;
    const minLength = val.length >= 6;
    const uppercase = /[A-Z]/.test(val);
    const number = /[0-9]/.test(val);
    const symbol = /[^A-Za-z0-9]/.test(val); // Verifica se há caracteres especiais

    if (minLength) s += 25;
    if (uppercase) s += 25;
    if (number) s += 25;
    if (symbol) s += 25;
    setStrength(s);

    // Atualiza os estados para o checklist visual
    setHasMinLength(minLength);
    setHasUppercase(uppercase);
    setHasNumber(number);
    setHasSymbol(symbol); // Novo estado para símbolo
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      // O usuário receberá um e-mail de confirmação via backend
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm -z-10" />
        <div className="w-full max-w-[440px] rounded-[42px] border border-slate-200 bg-white p-10 shadow-2xl text-center animate-in zoom-in duration-300">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Senha Alterada!</h1>
          <p className="mt-4 text-slate-500">Sua senha foi redefinida. Enviamos uma confirmação para seu e-mail por segurança. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm -z-10" />
      
      <div className="w-full max-w-[440px] rounded-[42px] border border-slate-200 bg-white p-10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <Music size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Senha</h1>
          <p className="mt-2 text-slate-500">Crie uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Nova senha"
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Barra de força da senha */}
          <div className="px-2">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  strength <= 25 ? "bg-rose-500 w-1/4" : 
                  strength <= 50 ? "bg-amber-500 w-1/2" : 
                  strength <= 75 ? "bg-blue-500 w-3/4" : "bg-emerald-500 w-full"
                }`}
              />
            </div>
            {/* Checklist de requisitos da senha */}
            <div className="mt-2 space-y-1 text-xs">
              <p className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600' : 'text-slate-500'}`}>
                {hasMinLength ? <CheckCircle2 size={14} /> : <Circle size={14} />} Mínimo de 6 caracteres
              </p>
              <p className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600' : 'text-slate-500'}`}>
                {hasUppercase ? <CheckCircle2 size={14} /> : <Circle size={14} />} Pelo menos uma letra maiúscula
              </p>
              <p className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600' : 'text-slate-500'}`}>
                {hasNumber ? <CheckCircle2 size={14} /> : <Circle size={14} />} Pelo menos um número
              </p>
              <p className={`flex items-center gap-2 ${hasSymbol ? 'text-emerald-600' : 'text-slate-500'}`}>
                {hasSymbol ? <CheckCircle2 size={14} /> : <Circle size={14} />} Pelo menos um símbolo (ex: !@#$)
              </p>
            </div>
            {/* Mensagem de dica, se a senha ainda não for forte */}
            {strength < 75 && (
              <p className="text-[10px] text-slate-400 mt-2">
                Use maiúsculas, números e símbolos para uma senha forte.
              </p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              className="w-full rounded-3xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
            />
          </div>

          {error && <p className="text-center text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-100">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token || strength < 75 || error}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 py-4 text-sm font-semibold text-white transition hover:from-rose-700 hover:to-rose-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : strength < 75 ? "Senha muito fraca" : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}