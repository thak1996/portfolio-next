import { getSiteContent } from '@/app/admin/settings/actions';
import { NavLink } from '@/components/common/NavLink';

import { NavigationMenu } from './NavigationMenu';

export async function Header() {
  const content = await getSiteContent();
  let sectionOrder = (content.sectionOrder as string[]) || [];
  if (sectionOrder.length === 0) {
    sectionOrder = ['hero', 'about', 'skills', 'projects', 'whyHireMe', 'contact'];
  }

  // Filter only visible sections
  const visibleSections = sectionOrder.filter((key) => {
    switch (key) {
      case 'hero': return content.showHero !== false;
      case 'about': return content.showAbout !== false;
      case 'skills': return content.showSkills !== false;
      case 'projects': return content.showProjects !== false;
      case 'whyHireMe': return content.showWhyHireMe !== false;
      case 'contact': return content.showContact !== false;
      default: return false;
    }
  });

  return (
    <header className="bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-white/10 docked full-width top-0 sticky z-50 h-20">
      <div className="flex justify-between items-center max-w-container-max mx-auto px-gutter w-full h-full">
        <NavLink target="hero" className="font-h3 text-h3 font-bold text-primary dark:text-primary tracking-tight hover:opacity-80 transition-opacity">{content.heroTitle}</NavLink>
        <NavigationMenu resumeUrl={content.resumeUrl} sectionOrder={visibleSections} />
      </div>
    </header>
  );
}
