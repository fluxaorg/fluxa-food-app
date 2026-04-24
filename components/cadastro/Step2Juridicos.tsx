"use client";

import { useState } from "react";
import { formatCPF } from "@/lib/utils";
import type { CadastroData } from "@/app/dashboard/cadastro/page";

interface Props {
  data: CadastroData;
  updateData: (patch: Partial<CadastroData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Juridicos({ data, updateData, onNext, onPrev }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.razao_social.trim()) e.razao_social = "Razão social obrigatória";
    if (!data.owner_name.trim()) e.owner_name = "Nome obrigatório";
    if (!data.owner_email.trim() || !/\S+@\S+\.\S+/.test(data.owner_email)) e.owner_email = "Email inválido";
    if (!data.owner_cpf || data.owner_cpf.replace(/\D/g, "").length < 11) e.owner_cpf = "CPF inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#FFF2EA] mb-1">Dados Jurídicos</h2>
      <p className="text-[#888888] text-sm mb-6">Informações legais do responsável</p>

      <div className="space-y-4">
        <Field label="Razão Social" error={errors.razao_social} required>
          <input
            type="text"
            value={data.razao_social}
            onChange={(e) => updateData({ razao_social: e.target.value })}
            placeholder="Quiosque Lanches LTDA"
            className={inputCls(errors.razao_social)}
          />
        </Field>

        <Field label="Nome do dono/responsável" error={errors.owner_name} required>
          <input
            type="text"
            value={data.owner_name}
            onChange={(e) => updateData({ owner_name: e.target.value })}
            placeholder="João Silva"
            className={inputCls(errors.owner_name)}
          />
        </Field>

        <Field label="Email do dono" error={errors.owner_email} required>
          <input
            type="email"
            value={data.owner_email}
            onChange={(e) => updateData({ owner_email: e.target.value })}
            placeholder="joao@restaurante.com"
            className={inputCls(errors.owner_email)}
          />
        </Field>

        <Field label="CPF do responsável" error={errors.owner_cpf} required>
          <input
            type="text"
            value={data.owner_cpf}
            onChange={(e) => updateData({ owner_cpf: formatCPF(e.target.value) })}
            placeholder="000.000.000-00"
            className={inputCls(errors.owner_cpf)}
          />
        </Field>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="border border-[#1A1A2E] hover:border-[#888888] text-[#888888] hover:text-[#FFF2EA] font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={handleNext}
          className="bg-[#C41C3B] hover:bg-[#A01530] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Próximo →
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
