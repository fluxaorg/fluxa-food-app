"use client";

import { useState, useRef } from "react";
import { Upload, FileCheck, X } from "lucide-react";
import type { CadastroData } from "@/app/dashboard/cadastro/page";

interface Props {
  data: CadastroData;
  updateData: (patch: Partial<CadastroData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface UploadFieldProps {
  label: string;
  file: File | null;
  required?: boolean;
  onChange: (file: File | null) => void;
  accept: string;
}

function UploadField({ label, file, required, onChange, accept }: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-[#FFE6D2] mb-1.5">
        {label} {required && <span className="text-[#C41C3B]">*</span>}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center gap-3 bg-[#050510] border border-green-500/30 rounded-xl px-4 py-3">
          <FileCheck size={18} className="text-green-400 flex-shrink-0" />
          <span className="text-[#FFF2EA] text-sm flex-1 truncate">{file.name}</span>
          <button
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-[#888888] hover:text-[#C41C3B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full bg-[#050510] border border-[#1A1A2E] border-dashed hover:border-[#C41C3B]/50 rounded-xl px-4 py-4 flex flex-col items-center gap-2 transition-colors group"
        >
          <Upload size={20} className="text-[#888888] group-hover:text-[#C41C3B] transition-colors" />
          <span className="text-[#888888] text-xs">Clique para selecionar arquivo</span>
          <span className="text-[#1A1A2E] text-xs">{accept}</span>
        </button>
      )}
    </div>
  );
}

export default function Step3Documentos({ data, updateData, onNext, onPrev }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.doc_contrato) e.doc_contrato = "Contrato obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#FFF2EA] mb-1">Upload de Documentos</h2>
      <p className="text-[#888888] text-sm mb-6">Anexe os documentos necessários para o onboarding</p>

      <div className="space-y-4">
        <div>
          <UploadField
            label="Contrato assinado"
            file={data.doc_contrato}
            required
            accept=".pdf"
            onChange={(f) => updateData({ doc_contrato: f })}
          />
          {errors.doc_contrato && (
            <p className="text-[#C41C3B] text-xs mt-1">{errors.doc_contrato}</p>
          )}
        </div>

        <UploadField
          label="RG ou CNH"
          file={data.doc_rg}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(f) => updateData({ doc_rg: f })}
        />

        <UploadField
          label="Comprovante de endereço"
          file={data.doc_comprovante}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(f) => updateData({ doc_comprovante: f })}
        />
      </div>

      <p className="text-[#888888] text-xs mt-4">
        * Os documentos serão armazenados no Supabase Storage com acesso restrito.
      </p>

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
