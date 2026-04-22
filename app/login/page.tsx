import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Login — Flüxa Kitchen' };

const FOOD_EMOJIS = ['🍔','🍕','🌮','🍜','🥩','🍣','🥗','🧆','🍝','🥪','🌯','🍱','🥘','🍛','🥙','🍤','🧇','🥞'];

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex overflow-hidden">
      {/* Left — animated food cascade */}
      <div className="hidden lg:flex flex-col relative flex-1 bg-fluxa-red overflow-hidden">
        {/* Cascading emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {FOOD_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl opacity-20 animate-cascade select-none"
              style={{
                left: `${(i % 6) * 17 + 2}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${8 + (i % 4)}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">Flüxa Kitchen</span>
            </div>
            <p className="text-white/50 text-sm">Sistema Operacional de Restaurantes</p>
          </div>

          <div className="space-y-4">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">sys.core // on-line</p>
            <h2 className="text-white font-black text-4xl leading-tight">
              Pedidos na tela,<br />
              <span className="text-white/60">sabor no prato.</span>
            </h2>
            <p className="text-white/40 text-sm">Tecnologia que acelera sua cozinha</p>
          </div>

          <p className="text-white/20 text-xs">© 2026 Flüxa. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 lg:max-w-[480px] flex items-center justify-center p-6 bg-white relative overflow-hidden">
        {/* Mobile food cascade */}
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          {FOOD_EMOJIS.slice(0, 8).map((emoji, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-5 animate-cascade select-none"
              style={{
                left: `${(i % 4) * 25 + 5}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${9 + i}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-fluxa-red flex items-center justify-center">
              <span className="text-white font-black">F</span>
            </div>
            <span className="font-black text-[#333] text-xl">
              Flüxa <span className="text-fluxa-red">Kitchen</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Autenticação</p>
            <h1 className="text-3xl font-black text-[#333] leading-tight">Bem-vindo<br />de volta!</h1>
            <p className="text-gray-400 text-sm mt-2">Faça login para acessar o painel</p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-gray-400 mt-8">
            Problemas para entrar?{' '}
            <span className="text-fluxa-red cursor-pointer hover:underline font-medium">
              Fale com o suporte Flüxa
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
