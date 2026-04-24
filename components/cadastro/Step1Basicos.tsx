"use client";

import { useState } from "react";
import { formatCNPJ, formatPhone, formatCEP, validateCNPJ } from "@/lib/utils";
import type { CadastroData } from "@/app/dashboard/cadastro/page";

interface Props {
  data: CadastroData;
  updateData: (patch: Partial<CadastroData>) => void;
  onNext: () => void;
}

export default function Step1Basicos({ data, updateData, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Nome obrigatório";
    if (!data.cnpj || data.cnpj.replace(/\D/g, "").length < 14) e.cnpj = "CNPJ inválido";
    else if (!validateCNPJ(data.cnpj)) e.cnpj = "CNPJ inválido";
    if (!data.address.trim()) e.address = "Endereço obrigatório";
    if (!data.address_city.trim()) e.address_city = "Cidade obrigatória";
    if (!data.address_cep || data.address_cep.replace(/\D/g, "").length < 8) e.address_cep = "CEP inválido";
    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#FFF2EA] mb-1">Dados Básicos</h2>
      <p className="text-[#888888] text-sm mb-6">Informações principais do restaurante</p>

      <div className="space-y-4">
        <Field label="Nome do Restaurante" error={errors.name} required>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Ex: Quiosque Lanches"
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="CNPJ" error={errors.cnpj} required>
          <input
            type="text"
            value={data.cnpj}
            onChange={(e) => updateData({ cnpj: formatCNPJ(e.target.value) })}
            placeholder="00.000.000/0001-00"
            className={inputCls(errors.cnpj)}
          />
        </Field>

        <Field label="Endereço completo" error={errors.address} required>
          <input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Rua das Flores, 123 - Centro"
            className={inputCls(errors.address)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cidade" error={errors.address_city} required>
            <input
              type="text"
              value={data.address_city}
              onChange={(e) => updateData({ address_city: e.target.value })}
              placeholder="São Paulo"
              className={inputCls(errors.address_city)}
            />
          </Field>
          <Field label="CEP" error={errors.address_cep} required>
            <input
              type="text"
              value={data.address_cep}
              onChange={(e) => updateData({ address_cep: formatCEP(e.target.value) })}
              placeholder="00000-000"
              className={inputCls(errors.address_cep)}
            />
          </Field>
        </div>

        <Field label="Telefone" error={errors.phone} required>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => updateData({ phone: formatPhone(e.target.value) })}
            placeholder="(11) 99999-0000"
            className={inputCls(errors.phone)}
          />
        </Field>
      </div>

      <div className="flex justify-end mt-8">
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
