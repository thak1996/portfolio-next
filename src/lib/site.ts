import type {
  ContactLink,
  Differential,
  NavLink,
  Project,
  SkillCategory,
} from '@/types';

export const siteConfig = {
  name: 'Franklyn Viana',
  role: 'Desenvolvedor Fullstack | Mobile & Web',
  stackLine: 'Flutter • React • Laravel • Node',
  email: 'dev@franklyndev.com.br',
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? '#',
  copyrightYear: new Date().getFullYear(),
};

export const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const skills: SkillCategory[] = [
  {
    id: 'mobile',
    icon: 'smartphone',
    title: 'Mobile',
    description: 'Flutter (iOS/Android), performance, UI/UX, App Store Connect.',
    tags: [{ label: 'FLUTTER' }, { label: 'UI/UX' }],
  },
  {
    id: 'web',
    icon: 'language',
    title: 'Web Frontend',
    description: 'React.js, interfaces modernas e responsivas.',
    tags: [{ label: 'REACT.JS' }, { label: 'TAILWIND' }],
  },
  {
    id: 'backend',
    icon: 'database',
    title: 'Backend',
    description: 'PHP/Laravel, Node.js, APIs REST.',
    tags: [{ label: 'LARAVEL' }, { label: 'NODE.JS' }],
  },
  {
    id: 'infra',
    icon: 'terminal',
    title: 'Infra & Deploy',
    description: 'Linux (Ubuntu), Docker, Coolify.',
    tags: [{ label: 'DOCKER' }, { label: 'LINUX' }],
  },
];

export const projects: Project[] = [
  {
    id: 'dimber',
    title: 'Dimber (iOS & Android)',
    description:
      'Aplicativo completo (Flutter + Laravel). Ciclo de vida completo até publicação na App Store.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBd5GAnzWysO9w8UiXGyVdCixnVKQe1sX6xfUFlF-6VKiRaYar5ZKJwBmS05p0Tj1GtMM0sKAs65BtGbL7701ubKxl7nK8ijplYgEWnLMXouTHXGXOPSbSulbSWDLVkzB575zxjPIVt6Fqwb42QiMTymky-AtJAvFD91nJHwDG0Zy59o9ublA_zqWTr7Zuilb5oUBhZWZ90TZjcAhxtff1nnyZjYHoolYh8CM4rqlqetq9yJFrawFxlEPodkGbIrhdLFi1GH9wITJk',
    imageAlt: 'Dimber Mobile Application',
    tags: [
      { label: 'Flutter', variant: 'secondary' },
      { label: 'Laravel', variant: 'primary' },
    ],
    href: '#',
  },
  {
    id: 'dashboard',
    title: 'Dashboard de Gestão',
    description:
      'Dashboard de gestão / Sistema de leads (React, Node, PostgreSQL). Foco em usabilidade e segurança.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBH9cPQUXn4IFvr6TGI_FT5jHaOiJpR06c3TX8h7n7_nnLSZynILbBirB-Uj_KO0OZyrTgpvjkkrc0mMttkdXsmS7YbhosziZHqhCx63kHg4Kd_7hh_-ieWlS6a45Gjf6BCNYFiCPdBJf2NdPQ0WavQq2OWosBUUhrkfGBnn_2H7KBR1oZS8CtR7Jsipw1hxa6qNJ5cvWfF9vpxcrXduHs1r3ftldKg7xS7O1YCwKvN5jWy74g40a3nZU4-U0NNOYXxxQ8rPvCnKmk',
    imageAlt: 'Management Dashboard System',
    tags: [
      { label: 'React', variant: 'primary' },
      { label: 'Node', variant: 'secondary' },
    ],
    href: '#',
  },
];

export const differentials: Differential[] = [
  {
    id: 'delivery',
    icon: 'package_2',
    title: 'Entrega Completa',
    description: 'Capacidade de atuar da infraestrutura básica à publicação nas lojas.',
    variant: 'primary',
  },
  {
    id: 'vision',
    icon: 'visibility',
    title: 'Visão de Negócio',
    description: 'Entendimento do impacto técnico nas metas comerciais e experiência do usuário.',
    variant: 'secondary',
  },
  {
    id: 'resilience',
    icon: 'bolt',
    title: 'Resiliência Técnica',
    description: 'Foco na resolução de problemas complexos e arquitetura de escala.',
    variant: 'tertiary',
  },
];

export const contacts: ContactLink[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '#',
    icon: 'chat',
    variant: 'secondary',
    ariaLabel: 'Contact me on WhatsApp',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_CONTACT_LINKEDIN ?? '#',
    icon: 'person',
    variant: 'primary',
    ariaLabel: 'Visit my LinkedIn profile',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: process.env.NEXT_PUBLIC_CONTACT_GITHUB ?? '#',
    icon: 'code',
    variant: 'neutral',
    ariaLabel: 'Visit my GitHub profile',
  },
];
