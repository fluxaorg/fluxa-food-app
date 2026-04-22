import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Login — Flüxa Kitchen' };

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex">
      {/* Left panel (desktop) */}
      <div className="hidden lg:flex flex-col justify-between flex-1 bg-gradient-to-br from-fluxa-red to-fluxa-red-dark p-12">
        <div>
          <h1 className="text-white font-black text-3xl tracking-tight">
            Flüxa <span className="opacity-80">Kitchen</span>
          </h1>
          <p className="text-white/60 text-sm mt-1">Sistema Operacional de Restaurantes</p>
        </div>
        <div>
          <blockquote className="text-white/80 text-xl font-light leading-relaxed italic">
            "Pedidos na tela, sabor no prato."
          </blockquote>
          <p className="text-white/50 text-sm mt-3">Tecnologia que acelera sua cozinha</p>
        </div>
        <div className="text-white/30 text-xs">© 2026 Flüxa. Todos os direitos reservados.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white lg:max-w-[480px]">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-fluxa-red font-black text-2xl tracking-tight">
              Flüxa <span className="text-[#333]">Kitchen</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sistema Operacional de Restaurantes</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#333]">Bem-vindo de volta!</h2>
            <p className="text-gray-400 text-sm mt-1">Faça login para continuar</p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-gray-400 mt-8">
            Problemas para entrar?{' '}
            <span className="text-fluxa-red cursor-pointer hover:underline">
              Fale com o suporte Flüxa
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
