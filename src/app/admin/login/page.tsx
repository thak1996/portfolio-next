'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const result = await loginAction(null, formData);
        if (result?.success) {
          // Redirecionar para o painel
          router.push('/admin');
          router.refresh();
        } else {
          setError(result?.error || 'Ocorreu um erro no login. Tente atualizar a página.');
        }
      } catch (err) {
        setError('Erro de conexão ou servidor. Atualize a página e tente novamente.');
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest px-gutter text-on-surface">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
        <div className="mb-8 text-center">
          <h1 className="font-h2 text-h2 text-primary mb-xs">Painel Admin</h1>
          <p className="text-on-surface-variant font-body-md">Entre para gerenciar seu portfólio</p>
        </div>

        {error && (
          <div className="mb-md p-sm rounded-xl border border-error/20 bg-error/10 text-error font-body-md flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="email" className="font-code-label text-code-label text-on-surface-variant uppercase">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Digite seu e-mail"
              className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="password" className="font-code-label text-code-label text-on-surface-variant uppercase">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                required
                placeholder="Digite sua senha"
                className="w-full bg-surface-container-high border border-white/10 px-md py-sm pr-12 rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-sm flex items-center justify-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-bold hover:bg-primary-container/80 transition-colors active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                Entrando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                Acessar Painel
              </>
            )}
          </button>
        </form>

        <div className="mt-md text-center">
          <a href="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-code-label flex items-center justify-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
}
