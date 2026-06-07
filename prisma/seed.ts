import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Configurando db driver se for necessário inicializar assim localmente (ou apenas usar o export de lib/db)
import { prisma } from '../src/lib/db';

import { seedUsers } from './seeds/users';
import { seedSkills } from './seeds/skills';
import { seedProjects } from './seeds/projects';
import { seedSiteContent } from './seeds/siteContent';

async function main() {
  console.log('Iniciando semeação (seeding) do banco de dados (Prisma 7)...');

  // 1. Limpar banco de dados existente
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.lead.deleteMany();
  console.log('Banco de dados limpo.');

  // 2. Chamar cada um dos semeadores
  await seedUsers();
  await seedSkills();
  await seedProjects();
  await seedSiteContent();

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao semear o banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
