import React from 'react';
import { prisma } from '@/lib/db';
import SkillsClient from './SkillsClient';

export const dynamic = 'force-dynamic'; // Garantir carregamento dinâmico em tempo real

export default async function AdminSkillsPage() {
  // Buscar todas as habilidades cadastradas no PostgreSQL
  const skills = await prisma.skill.findMany({
    orderBy: { title: 'asc' },
  });

  return <SkillsClient initialSkills={skills} />;
}
