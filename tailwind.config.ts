import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fluxa: {
          red: '#C41C3B',
          'red-dark': '#A01530',
          'red-light': 'rgba(196,28,59,0.12)',
          beige: '#F5DEB3',
          'beige-light': '#FAF9F6',
          brown: '#8B4513',
          'brown-light': 'rgba(139,69,19,0.12)',
        },
        status: {
          recebido: '#C41C3B',
          preparo: '#F59E0B',
          pronto: '#10B981',
          entregue: '#9CA3AF',
          cancelado: '#F97316',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        docker: '0 -4px 16px rgba(0,0,0,0.12)',
        card: '0 2px 8px rgba(0,0,0,0.06)',
        modal: '0 16px 48px rgba(0,0,0,0.16)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
