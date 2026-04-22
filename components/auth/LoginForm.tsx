'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        setError('Preencha email e senha');
        return;
      }
      setError('');
      setLoading(true);
      try {
        await login(email, password);
        router.replace('/pedidos');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Credenciais inválidas');
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, router]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="nome@restaurante.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right">
          <span className="text-xs text-fluxa-red cursor-pointer hover:underline">Esqueceu a senha?</span>
        </div>
      </div>

      {error && (
        <div className="bg-fluxa-red-light border border-fluxa-red/20 text-fluxa-red text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <Button type="submit" fullWidth size="lg" loading={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
