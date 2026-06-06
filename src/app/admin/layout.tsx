'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from './login/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ocultar sidebar e layout completo na tela de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Projetos', href: '/admin/projects', icon: 'developer_mode' },
    { label: 'Habilidades', href: '/admin/skills', icon: 'terminal' },
    { label: 'Mensagens / Leads', href: '/admin/leads', icon: 'mail' },
    { label: 'Meu Perfil', href: '/admin/profile', icon: 'person' },
    { label: 'Seções do Site', href: '/admin/settings', icon: 'view_carousel' },
  ];

  return (
    <div className="flex h-screen bg-surface-container-lowest text-on-surface overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-surface border-r border-white/10 p-md flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="flex items-center gap-xs mb-xl">
            <span className="material-symbols-outlined text-primary text-[28px]">shield_person</span>
            <span className="font-h3 text-h3 text-primary font-bold">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-sm px-md py-sm rounded-xl font-body-md transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-bright hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-sm">
          <Link
            href="/"
            className="flex items-center gap-sm px-md py-sm rounded-xl font-body-md text-on-surface-variant hover:bg-surface-bright hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
            Ver Site Público
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-sm px-md py-sm rounded-xl font-body-md text-error/80 hover:bg-error/10 hover:text-error transition-all text-left w-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Estrutura Mobile */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Mobile */}
        <header className="h-16 border-b border-white/10 bg-surface px-md flex items-center justify-between md:hidden">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">shield_person</span>
            <span className="font-bold text-on-surface text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-xs rounded-xl bg-surface-container-high border border-white/10 text-on-surface active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </header>

        {/* Menu Lateral Mobile */}
        {mobileMenuOpen && (
          <div className="bg-surface border-b border-white/10 p-md flex flex-col gap-md md:hidden">
            <nav className="flex flex-col gap-xs">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-sm px-md py-sm rounded-xl font-body-md transition-colors ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'text-on-surface-variant hover:bg-surface-bright hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="h-px bg-white/10 my-xs" />
            <div className="flex flex-col gap-sm">
              <Link
                href="/"
                className="flex items-center gap-sm px-md py-sm rounded-xl font-body-md text-on-surface-variant hover:bg-surface-bright hover:text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                Ver Site Público
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-sm px-md py-sm rounded-xl font-body-md text-error/80 hover:bg-error/10 hover:text-error transition-all text-left w-full"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sair do Painel
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 p-sm md:p-lg overflow-y-auto max-w-container-max w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
