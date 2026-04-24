"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import type { CadastroData } from "@/app/dashboard/cadastro/page";

interface Props {
  data: CadastroData;
  updateData: (patch: Partial<CadastroData>) => void;
  onPrev: () => void;
  onSuccess: (email: string) => void;
}

export default function Step4Login({ data, updateData, onPrev, onSuccess }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!data.gestor_email.trim() || !/\S+@\S+\.\S+/.test(data.gestor_email)) e.gestor_email = "Email inválido";
    if (!data.gestor_name.trim()) e.gestor_name = "Nome obrigatório";
    if (data.gestor_password.length < 6) e.gestor_password = "Mínimo 6 caracteres";
    if (data.gestor_password !== data.gestor_confirm) e.gestor_confirm = "Senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: {
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            address_city: data.address_city,
            address_cep: data.address_cep,
            phone: data.phone,
            razao_social: data.razao_social,
            owner_name: data.owner_name,
            owner_email: data.owner_email,
            owner_cpf: data.owner_cpf,
          },
          gestor: {
            email: data.gestor_email,
            name: data.gestor_name,
            password: data.gestor_password,
          },
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Erro ao criar restaurante");
        return;
      }

      toast.success("Restaurante criado com sucesso!");
      onSuccess(data.gestor_email);
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#FFF2EA] mb-1">Criar Login do Gestor</h2>
      <p className="text-[#888888] text-sm mb-6">
        O gestor usará essas credenciais para acessar o Flüxa Kitchen
      </p>

      <div className="space-y-4">
        <Field label="Nome completo do gestor" error={errors.gestor_name} required>
          <input
            type="text"
            value={data.gestor_name}
            onChange={(e) => updateData({ gestor_name: e.target.value })}
            placeholder="Maria Oliveira"
            className={inputCls(errors.gestor_name)}
          />
        </Field>

        <Field label="Email do gestor" error={errors.gestor_email} required>
          <input
            type="email"
            value={data.gestor_email}
            onChange={(e) => updateData({ gestor_email: e.target.value })}
            placeholder="gestor@restaurante.com"
            className={inputCls(errors.gestor_email)}
          />
        </Field>

        <Field label="Senha" error={errors.gestor_password} required>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={data.gestor_password}
              onChange={(e) => updateData({ gestor_password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className={`${inputCls(errors.gestor_password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFF2EA]"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <Field label="Confirmar senha" error={errors.gestor_confirm} required>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={data.gestor_confirm}
              onChange={(e) => updateData({ gestor_confirm: e.target.value })}
              placeholder="Repita a senha"
              className={`${inputCls(errors.gestor_confirm)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFF2EA]"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-[#050510] border border-[#1A1A2E] rounded-xl p-4">
        <p className="text-[#888888] text-xs mb-2">Resumo do cadastro:</p>
        <div className="space-y-1">
          <p className="text-[#FFF2EA] text-sm"><span className="text-[#888888]">Restaurante:</span> {data.name}</p>
          <p className="text-[#FFF2EA] text-sm"><span className="text-[#888888]">CNPJ:</span> {data.cnpj}</p>
          <p className="text-[#FFF2EA] text-sm"><span className="text-[#888888]">Responsável:</span> {data.owner_name}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={loading}
          className="border border-[#1A1A2E] hover:border-[#888888] text-[#888888] hover:text-[#FFF2EA] font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          ← Anterior
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#C41C3B] hover:bg-[#A01530] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Criando..." : "Criar Restaurante e Login ✓"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, required, children }: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#FFE6D2] mb-1.5">
        {label} {required && <span className="text-[#C41C3B]">*</span>}
      </label>
      {children}
      {error && <p className="text-[#C41C3B] text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full bg-[#050510] border ${
    error ? "border-[#C41C3B]" : "border-[#1A1A2E] focus:border-[#C41C3B]"
  } rounded-xl px-4 py-2.5 text-[#FFF2EA] placeholder-[#888888] text-sm transition-colors`;
}
