import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { WhyHireMe } from '@/components/sections/WhyHireMe';
import { Contact } from '@/components/sections/Contact';
import { prisma } from '@/lib/db';
import { getSiteContent } from '@/app/admin/settings/actions';

import { formatWhatsappUrl, formatEmailUrl } from '@/utils/formatContact';

export const revalidate = 0; // Garantir que atualizações no admin apareçam instantaneamente

export default async function Home() {
  // Buscar dados do banco PostgreSQL
  const dbProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const dbSkills = await prisma.skill.findMany({
    orderBy: { title: 'asc' },
  });

  const content = await getSiteContent();
  const dynamicContacts = [
    { id: 'whatsapp', label: 'WhatsApp', href: formatWhatsappUrl(content.contactWhatsapp), icon: 'chat', variant: 'secondary' as const },
    { id: 'email', label: 'E-mail', href: formatEmailUrl(content.contactEmail), icon: 'mail', variant: 'primary' as const },
    { id: 'linkedin', label: 'LinkedIn', href: content.contactLinkedin, icon: 'person', variant: 'primary' as const },
    { id: 'github', label: 'GitHub', href: content.contactGithub, icon: 'code', variant: 'neutral' as const },
  ].filter(c => c.href) as { id: string; label: string; href: string; icon: string; variant: 'primary'|'secondary'|'neutral' }[];

  let sectionOrder = (content.sectionOrder as string[]) || [];
  if (sectionOrder.length === 0) {
    sectionOrder = ['hero', 'about', 'skills', 'projects', 'whyHireMe', 'contact'];
  }

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return content.showHero !== false ? <Hero key={key} /> : null;
      case 'about':
        return content.showAbout !== false ? <About key={key} /> : null;
      case 'skills':
        return content.showSkills !== false ? <Skills key={key} dbSkills={dbSkills} learningText={content.learningText || null} /> : null;
      case 'projects':
        return content.showProjects !== false ? <Projects key={key} dbProjects={dbProjects} /> : null;
      case 'whyHireMe':
        return content.showWhyHireMe !== false ? <WhyHireMe key={key} /> : null;
      case 'contact':
        return content.showContact !== false ? <Contact key={key} dynamicContacts={dynamicContacts} /> : null;
      default:
        return null;
    }
  };

  return (
    <>
      {sectionOrder.map((key) => renderSection(key))}
    </>
  );
}
