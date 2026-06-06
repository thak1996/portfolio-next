'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/session';

const GLOBAL_ID = 'global';

export type SiteContentInput = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroTerminalText?: string | null;
  heroPhotoUrl?: string | null;
  learningText?: string | null;
  aboutText: string;
  contactEmail: string;
  contactWhatsapp?: string | null;
  contactLinkedin?: string | null;
  contactGithub?: string | null;
  footerText: string;
  resumeUrl?: string | null;
  showHero?: boolean;
  showAbout?: boolean;
  showSkills?: boolean;
  showProjects?: boolean;
  showWhyHireMe?: boolean;
  showContact?: boolean;
  sectionOrder?: string[];
};

export async function getSiteContent() {
  let content = await prisma.siteContent.findUnique({
    where: { id: GLOBAL_ID },
  });

  if (!content) {
    content = await prisma.siteContent.create({
      data: {
        id: GLOBAL_ID,
        heroBadge: 'Senior Profile',
        heroTitle: 'Franklyn Viana',
        heroSubtitle: 'Desenvolvedor Fullstack | Mobile & Web',
        heroDescription: 'Desenvolvedor Mobile com foco em Flutter, atuando na construção de aplicações Android e iOS com uso de Dart, Firebase e arquitetura limpa.',
        heroPhotoUrl: 'https://github.com/thak1996.png',
        aboutText: 'Sou um desenvolvedor apaixonado por criar soluções eficientes...',
        contactEmail: 'dev@franklyndev.com.br',
        contactWhatsapp: '',
        contactLinkedin: '',
        contactGithub: 'https://github.com/thak1996',
        footerText: '© 2024 Franklyn Viana • Fullstack Developer',
        showHero: true,
        showAbout: true,
        showSkills: true,
        showProjects: true,
        showWhyHireMe: true,
        showContact: true,
        sectionOrder: ['hero', 'about', 'skills', 'projects', 'whyHireMe', 'contact'],
      },
    });
  }

  return content;
}

export async function updateSiteContent(data: SiteContentInput) {
  try {
    await requireAuth();
    const updated = await prisma.siteContent.upsert({
      where: { id: GLOBAL_ID },
      update: {
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroDescription: data.heroDescription,
        heroTerminalText: data.heroTerminalText,
        heroPhotoUrl: data.heroPhotoUrl,
        learningText: data.learningText,
        aboutText: data.aboutText,
        contactEmail: data.contactEmail,
        contactWhatsapp: data.contactWhatsapp,
        contactLinkedin: data.contactLinkedin,
        contactGithub: data.contactGithub,
        footerText: data.footerText,
        resumeUrl: data.resumeUrl,
        showHero: data.showHero,
        showAbout: data.showAbout,
        showSkills: data.showSkills,
        showProjects: data.showProjects,
        showWhyHireMe: data.showWhyHireMe,
        showContact: data.showContact,
        sectionOrder: data.sectionOrder,
      },
      create: {
        id: GLOBAL_ID,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroDescription: data.heroDescription,
        heroTerminalText: data.heroTerminalText,
        heroPhotoUrl: data.heroPhotoUrl,
        learningText: data.learningText,
        aboutText: data.aboutText,
        contactEmail: data.contactEmail,
        contactWhatsapp: data.contactWhatsapp,
        contactLinkedin: data.contactLinkedin,
        contactGithub: data.contactGithub,
        footerText: data.footerText,
        resumeUrl: data.resumeUrl,
        showHero: data.showHero ?? true,
        showAbout: data.showAbout ?? true,
        showSkills: data.showSkills ?? true,
        showProjects: data.showProjects ?? true,
        showWhyHireMe: data.showWhyHireMe ?? true,
        showContact: data.showContact ?? true,
        sectionOrder: data.sectionOrder ?? ['hero', 'about', 'skills', 'projects', 'whyHireMe', 'contact'],
      },
    });

    revalidatePath('/', 'layout');
    return { success: true, content: updated };
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return { success: false, error: 'Falha ao salvar as configurações.' };
  }
}
