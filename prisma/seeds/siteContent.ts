import { prisma } from '../../src/lib/db';

export async function seedSiteContent() {
  await prisma.siteContent.upsert({
    where: { id: 'global' },
    update: {
      contactLinkedin: 'https://www.linkedin.com/in/franklyn-v-santos/',
      contactGithub: 'https://github.com/thak1996',
    },
    create: {
      id: 'global',
      heroBadge: 'Senior Profile',
      heroTitle: 'Franklyn Viana',
      heroSubtitle: 'Desenvolvedor Fullstack | Mobile & Web',
      heroDescription: 'Desenvolvedor Mobile com foco em Flutter, atuando na construção de aplicações Android e iOS com uso de Dart, Firebase e arquitetura limpa.',
      heroPhotoUrl: 'https://github.com/thak1996.png',
      aboutText: 'Sou um desenvolvedor apaixonado por criar soluções eficientes...',
      contactEmail: 'dev@franklyndev.com.br',
      contactWhatsapp: '5511967306464',
      contactLinkedin: 'https://www.linkedin.com/in/franklyn-v-santos/',
      contactGithub: 'https://github.com/thak1996',
      footerText: '© 2024 Franklyn Viana • Fullstack Developer',
    }
  });

  console.log('SiteContent semeado.');
}
