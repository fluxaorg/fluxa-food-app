"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Email ou senha incorretos.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#C41C3B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-[#FFF2EA]">Flüxa</span>
            <span className="text-[#FFE6D2] text-sm font-medium bg-[#C41C3B]/20 px-2 py-0.5 rounded-full border border-[#C41C3B]/30">
              Admin
            </span>
          </div>
          <p className="text-[#888888] text-sm">Painel administrativo Flüxa Food&apos;s</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-[#FFF2EA] mb-1">Entrar</h1>
          <p className="text-[#888888] text-sm mb-6">Acesso restrito ao time Flüxa</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#FFE6D2] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="cavanha@fluxa.com"
                className="w-full bg-[#050510] border border-[#1A1A2E] rounded-xl px-4 py-3 text-[#FFF2EA] placeholder-[#888888] text-sm focus:border-[#C41C3B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFE6D2] mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#050510] border border-[#1A1A2E] rounded-xl px-4 py-3 text-[#FFF2EA] placeholder-[#888888] text-sm focus:border-[#C41C3B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C41C3B] hover:bg-[#A01530] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#888888] text-xs mt-6">
          Flüxa Food&apos;s © 2026 · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
