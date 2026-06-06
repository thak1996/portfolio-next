'use client';

import React, { useState, useTransition } from 'react';
import { updateLeadStatus, deleteLead } from './actions';
import { LeadStatus } from '@prisma/client';

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
};

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();

  // Atualizar lista local caso as props mudem
  React.useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  // Filtrar leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleStatusUpdate(id: string, newStatus: LeadStatus) {
    startTransition(async () => {
      const result = await updateLeadStatus(id, newStatus);
      if (result.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir esta mensagem permanentemente?')) return;

    startTransition(async () => {
      const result = await deleteLead(id);
      if (result.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setSelectedLead(null);
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-h1 text-h2 text-primary mb-xs">Contatos / Leads</h1>
          <p className="text-on-surface-variant font-body-md">Gerencie as mensagens e potenciais clientes</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md bg-surface p-md rounded-2xl border border-white/5">
        <div className="sm:col-span-2 relative">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/40">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high border border-white/10 pl-xl pr-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface transition-colors cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="NEW">Novos</option>
            <option value="READ">Lidos</option>
            <option value="CONTACTED">Contatados</option>
            <option value="ARCHIVED">Arquivados</option>
          </select>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex flex-col gap-sm">
        {filteredLeads.length === 0 ? (
          <div className="py-xl text-center bg-surface border border-white/5 rounded-2xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-xs block text-on-surface-variant/40">
              inbox
            </span>
            Nenhuma mensagem encontrada para os filtros atuais.
          </div>
        ) : (
          filteredLeads.map((lead) => {
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
                onClick={() => {
                  setSelectedLead(lead);
                  if (lead.status === 'NEW') {
                    handleStatusUpdate(lead.id, 'READ');
                  }
                }}
                className={`p-md bg-surface border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-md hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group ${
                  lead.status === 'NEW' ? 'border-orange-500/20 shadow-sm shadow-orange-500/5' : 'border-white/5'
                }`}
              >
                <div className="flex flex-col gap-base">
                  <div className="flex items-center gap-sm">
                    <span className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">
                      {lead.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-code-label border ${
                      lead.status === 'NEW'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : lead.status === 'CONTACTED'
                        ? 'bg-secondary/10 text-secondary border-secondary/20'
                        : lead.status === 'ARCHIVED'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                    }`}>
                      {lead.status === 'NEW' ? 'Nova' : lead.status === 'CONTACTED' ? 'Contatado' : lead.status === 'ARCHIVED' ? 'Arquivado' : 'Lida'}
                    </span>
                  </div>
                  <span className="text-on-surface-variant font-body-md text-sm">{lead.email}</span>
                  <p className="text-on-surface-variant line-clamp-2 text-sm mt-xs italic leading-relaxed">
                    "{lead.message}"
                  </p>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-sm shrink-0">
                  <span className="text-on-surface-variant/40 text-xs font-code-label">{dateStr}</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform font-bold text-sm flex items-center gap-base">
                    Ver Mensagem <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Detalhes da Mensagem */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-gutter">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl p-md sm:p-lg shadow-2xl flex flex-col gap-md relative"
          >
            {/* Fechar */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute right-md top-md p-xs rounded-xl bg-surface-container hover:bg-surface-bright border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Cabeçalho */}
            <div>
              <div className="flex items-center gap-sm flex-wrap mb-xs pr-12">
                <h3 className="font-h3 text-h3 text-primary font-bold">{selectedLead.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-code-label border ${
                  selectedLead.status === 'NEW'
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    : selectedLead.status === 'CONTACTED'
                    ? 'bg-secondary/10 text-secondary border-secondary/20'
                    : selectedLead.status === 'ARCHIVED'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-white/5 text-on-surface-variant border-white/10'
                }`}>
                  {selectedLead.status === 'NEW' ? 'Nova' : selectedLead.status === 'CONTACTED' ? 'Contatado' : selectedLead.status === 'ARCHIVED' ? 'Arquivado' : 'Lida'}
                </span>
              </div>
              <a
                href={`mailto:${selectedLead.email}`}
                className="text-on-surface-variant font-body-md text-sm hover:underline hover:text-primary transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {selectedLead.email}
              </a>
            </div>

            <div className="h-px bg-white/10 my-xs" />

            {/* Conteúdo */}
            <div className="flex flex-col gap-xs">
              <span className="font-code-label text-code-label text-on-surface-variant uppercase">Mensagem</span>
              <div className="bg-surface-container border border-white/5 p-md rounded-xl font-body-md text-on-surface whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                {selectedLead.message}
              </div>
            </div>

            <div className="h-px bg-white/10 my-xs" />

            {/* Botões de Ação */}
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <div className="flex gap-sm">
                {selectedLead.status !== 'CONTACTED' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedLead.id, 'CONTACTED')}
                    className="flex items-center gap-xs bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 px-md py-sm rounded-xl font-bold text-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Marcar como Contatado
                  </button>
                )}
                {selectedLead.status !== 'ARCHIVED' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedLead.id, 'ARCHIVED')}
                    className="flex items-center gap-xs bg-white/5 text-on-surface hover:bg-white/10 border border-white/10 px-md py-sm rounded-xl font-bold text-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">archive</span>
                    Arquivar
                  </button>
                )}
              </div>

              <div className="flex gap-sm">
                <a
                  href={`mailto:${selectedLead.email}?subject=Contato - Franklyn Viana&body=Olá ${selectedLead.name},`}
                  className="flex items-center gap-xs bg-primary-container text-on-primary-container hover:bg-primary-container/85 px-md py-sm rounded-xl font-bold text-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">reply</span>
                  Responder via E-mail
                </a>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  className="flex items-center justify-center p-sm rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-all"
                  title="Excluir Mensagem"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
