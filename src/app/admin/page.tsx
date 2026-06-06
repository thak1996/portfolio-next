import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Garantir dados atualizados em tempo real

export default async function AdminDashboardPage() {
  // 1. Buscar métricas do banco PostgreSQL
  const [projectCount, skillCount, totalLeads, newLeadsCount, recentLeads] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="font-h1 text-h2 text-primary mb-xs">Visão Geral</h1>
        <p className="text-on-surface-variant font-body-md">Métricas gerais e atividades do seu portfólio</p>
      </div>

      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Projetos */}
        <div className="p-md bg-surface border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all group">
          <div className="flex flex-col gap-xs">
            <span className="text-on-surface-variant font-body-md">Projetos</span>
            <span className="font-h2 text-h2 text-primary group-hover:scale-105 transition-transform origin-left">
              {projectCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">developer_mode</span>
          </div>
        </div>

        {/* Habilidades */}
        <div className="p-md bg-surface border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all group">
          <div className="flex flex-col gap-xs">
            <span className="text-on-surface-variant font-body-md">Habilidades</span>
            <span className="font-h2 text-h2 text-secondary group-hover:scale-105 transition-transform origin-left">
              {skillCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
        </div>

        {/* Total de Leads */}
        <div className="p-md bg-surface border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all group">
          <div className="flex flex-col gap-xs">
            <span className="text-on-surface-variant font-body-md">Total de Contatos</span>
            <span className="font-h2 text-h2 text-on-surface group-hover:scale-105 transition-transform origin-left">
              {totalLeads}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[24px]">mail</span>
          </div>
        </div>

        {/* Leads Novos */}
        <div className="p-md bg-surface border border-white/5 rounded-2xl flex items-center justify-between hover:border-primary/20 transition-all group">
          <div className="flex flex-col gap-xs">
            <span className="text-on-surface-variant font-body-md">Novas Mensagens</span>
            <span className={`font-h2 text-h2 group-hover:scale-105 transition-transform origin-left ${newLeadsCount > 0 ? 'text-orange-400' : 'text-on-surface-variant'}`}>
              {newLeadsCount}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${newLeadsCount > 0 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 animate-pulse' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[24px]">mark_email_unread</span>
          </div>
        </div>
      </div>

      {/* Conteúdo inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Ultimas mensagens */}
        <div className="lg:col-span-2 p-md bg-surface border border-white/5 rounded-2xl flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-h3 text-h3 text-primary">Mensagens Recentes</h3>
              <p className="text-on-surface-variant font-body-md">Últimos contatos enviados pelos visitantes do portfólio</p>
            </div>
            <Link
              href="/admin/leads"
              className="px-md py-xs rounded-xl bg-surface-container-high border border-white/10 hover:border-primary/30 transition-colors text-sm font-bold text-primary flex items-center gap-xs"
            >
              Ver Tudo
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="flex flex-col gap-sm mt-xs">
            {recentLeads.length === 0 ? (
              <div className="py-xl text-center border border-dashed border-white/5 rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] mb-xs block">inbox</span>
                Nenhuma mensagem recebida ainda.
              </div>
            ) : (
              recentLeads.map((lead) => {
                const dateStr = new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={lead.id}
                    className="p-sm bg-surface-container border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-sm hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col gap-base">
                      <div className="flex items-center gap-sm">
                        <span className="font-bold text-on-surface">{lead.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-code-label border ${
                          lead.status === 'NEW'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            : lead.status === 'CONTACTED'
                            ? 'bg-secondary/10 text-secondary border-secondary/20'
                            : 'bg-white/5 text-on-surface-variant border-white/10'
                        }`}>
                          {lead.status === 'NEW' ? 'Nova' : lead.status === 'CONTACTED' ? 'Contatado' : 'Lida'}
                        </span>
                      </div>
                      <span className="text-on-surface-variant font-body-md text-sm">{lead.email}</span>
                      <p className="text-on-surface-variant line-clamp-1 text-sm mt-xs italic">
                        "{lead.message}"
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col justify-between sm:h-12 items-end">
                      <span className="text-on-surface-variant/40 text-xs font-code-label">{dateStr}</span>
                      <Link
                        href={`/admin/leads?id=${lead.id}`}
                        className="text-primary hover:underline text-sm font-bold flex items-center gap-base"
                      >
                        Responder <span className="material-symbols-outlined text-[16px]">reply</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Links rápidos e atalhos */}
        <div className="p-md bg-surface border border-white/5 rounded-2xl flex flex-col gap-md">
          <h3 className="font-h3 text-h3 text-secondary">Ações Rápidas</h3>
          <div className="flex flex-col gap-sm">
            <Link
              href="/admin/projects"
              className="p-sm bg-surface-container border border-white/5 rounded-xl hover:border-primary/30 hover:bg-surface-bright transition-all flex items-center gap-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">add</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface text-sm">Adicionar Projeto</span>
                <span className="text-on-surface-variant text-xs">Cadastre um novo item no portfólio</span>
              </div>
            </Link>

            <Link
              href="/admin/skills"
              className="p-sm bg-surface-container border border-white/5 rounded-xl hover:border-secondary/30 hover:bg-surface-bright transition-all flex items-center gap-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">terminal</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface text-sm">Gerenciar Skills</span>
                <span className="text-on-surface-variant text-xs">Organize suas habilidades técnicas</span>
              </div>
            </Link>

            <a
              href="/"
              target="_blank"
              className="p-sm bg-surface-container border border-white/5 rounded-xl hover:border-white/20 hover:bg-surface-bright transition-all flex items-center gap-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined">open_in_new</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface text-sm">Visualizar Portfólio</span>
                <span className="text-on-surface-variant text-xs">Abra a página pública em outra aba</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
