import React from 'react';
import { prisma } from '@/lib/db';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic'; // Garantir dados atualizados em tempo real

export default async function AdminProjectsPage() {
  // Buscar todos os projetos cadastrados no PostgreSQL
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ProjectsClient initialProjects={projects} />;
}
