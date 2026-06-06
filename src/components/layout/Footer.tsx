import { getSiteContent } from '@/app/admin/settings/actions';

import { formatWhatsappUrl, formatEmailUrl } from '@/utils/formatContact';

export async function Footer() {
  const content = await getSiteContent();

  const dynamicContacts = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'chat', href: formatWhatsappUrl(content.contactWhatsapp) },
    { id: 'email', label: 'E-mail', icon: 'mail', href: formatEmailUrl(content.contactEmail) },
    { id: 'linkedin', label: 'LinkedIn', icon: 'person', href: content.contactLinkedin },
    { id: 'github', label: 'GitHub', icon: 'code', href: content.contactGithub },
  ].filter(c => c.href);

  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-white/10 full-width bottom-0">
      <div className="flex flex-col md:flex-row justify-between items-center py-xl px-gutter max-w-container-max mx-auto w-full">
        <div className="mb-md md:mb-0 text-center md:text-left">
          <div className="font-h3 text-h3 text-primary mb-1">{content.heroTitle}</div>
          <p className="font-code-label text-code-label text-secondary dark:text-secondary opacity-80">
            {content.footerText}
          </p>
        </div>
        <div className="flex gap-md md:gap-lg items-center">
          {dynamicContacts.map((contact) => (
            <a
              key={contact.id}
              className="flex items-center gap-xs font-code-label text-code-label text-on-surface-variant hover:text-secondary transition-colors"
              href={contact.href as string}
              target="_blank"
              rel="noopener noreferrer"
              title={contact.label}
            >
              <span className="material-symbols-outlined text-[24px] md:text-[20px]">{contact.icon}</span>
              <span className="hidden md:inline">{contact.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
