import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Flüxa Kitchen',
  description: 'Sistema operacional de restaurantes Flüxa',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kitchen',
  },
};

export const viewport: Viewport = {
  themeColor: '#C41C3B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
