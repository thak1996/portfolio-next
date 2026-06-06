import React from 'react';
import { prisma } from '@/lib/db';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic'; // Garantir carregamento dinâmico em tempo real

export default async function AdminLeadsPage() {
  // Buscar todas as mensagens recebidas do PostgreSQL
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <LeadsClient initialLeads={leads} />;
}
