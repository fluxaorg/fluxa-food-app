interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Dados Básicos" },
  { number: 2, label: "Dados Jurídicos" },
  { number: 3, label: "Documentos" },
  { number: 4, label: "Login do Gestor" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#1A1A2E] mx-8 hidden sm:block" />
      <div
        className="absolute top-4 left-0 h-0.5 bg-[#C41C3B] mx-8 hidden sm:block transition-all duration-500"
        style={{ right: `calc(${((4 - currentStep) / 3) * 100}% + 2rem)` }}
      />

      <div className="flex justify-between relative">
        {steps.map(({ number, label }) => {
          const done = number < currentStep;
          const active = number === currentStep;

          return (
            <div key={number} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10 ${
                  done
                    ? "bg-[#C41C3B] border-[#C41C3B] text-white"
                    : active
                    ? "bg-[#C41C3B]/10 border-[#C41C3B] text-[#C41C3B]"
                    : "bg-[#050510] border-[#1A1A2E] text-[#888888]"
                }`}
              >
                {done ? "✓" : number}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-[#FFF2EA]" : done ? "text-[#C41C3B]" : "text-[#888888]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
