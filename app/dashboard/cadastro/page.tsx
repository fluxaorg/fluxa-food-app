"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import StepIndicator from "@/components/cadastro/StepIndicator";
import Step1Basicos from "@/components/cadastro/Step1Basicos";
import Step2Juridicos from "@/components/cadastro/Step2Juridicos";
import Step3Documentos from "@/components/cadastro/Step3Documentos";
import Step4Login from "@/components/cadastro/Step4Login";

export interface CadastroData {
  // Step 1
  name: string;
  cnpj: string;
  address: string;
  address_city: string;
  address_cep: string;
  phone: string;
  // Step 2
  razao_social: string;
  owner_name: string;
  owner_email: string;
  owner_cpf: string;
  // Step 3
  doc_contrato: File | null;
  doc_rg: File | null;
  doc_comprovante: File | null;
  // Step 4
  gestor_email: string;
  gestor_name: string;
  gestor_password: string;
  gestor_confirm: string;
}

const initialData: CadastroData = {
  name: "",
  cnpj: "",
  address: "",
  address_city: "",
  address_cep: "",
  phone: "",
  razao_social: "",
  owner_name: "",
  owner_email: "",
  owner_cpf: "",
  doc_contrato: null,
  doc_rg: null,
  doc_comprovante: null,
  gestor_email: "",
  gestor_name: "",
  gestor_password: "",
  gestor_confirm: "",
};

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CadastroData>(initialData);
  const [completed, setCompleted] = useState(false);
  const [createdEmail, setCreatedEmail] = useState("");

  function updateData(patch: Partial<CadastroData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleReset() {
    setStep(1);
    setData(initialData);
    setCompleted(false);
    setCreatedEmail("");
  }

  if (completed) {
    return (
      <>
        <TopBar title="Cadastro de Restaurante" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-[#FFF2EA] mb-2">Restaurante criado!</h2>
            <p className="text-[#888888] mb-6">
              O restaurante foi cadastrado com sucesso e o login do gestor foi criado.
            </p>
            <div className="bg-[#0D0D1A] border border-[#1A1A2E] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#888888] text-sm mb-1">Login do gestor:</p>
              <p className="text-[#FFF2EA] font-mono font-medium">{createdEmail}</p>
            </div>
            <button
              onClick={handleReset}
              className="bg-[#C41C3B] hover:bg-[#A01530] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Cadastrar outro restaurante
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Cadastro de Restaurante" subtitle="Onboarding de novo restaurante" />
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={step} />

          <div className="mt-8 bg-[#0D0D1A] border border-[#1A1A2E] rounded-2xl p-6 lg:p-8">
            {step === 1 && (
              <Step1Basicos
                data={data}
                updateData={updateData}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2Juridicos
                data={data}
                updateData={updateData}
                onNext={() => setStep(3)}
                onPrev={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Documentos
                data={data}
                updateData={updateData}
                onNext={() => setStep(4)}
                onPrev={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <Step4Login
                data={data}
                updateData={updateData}
                onPrev={() => setStep(3)}
                onSuccess={(email) => {
                  setCreatedEmail(email);
                  setCompleted(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
