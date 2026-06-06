import { prisma } from '../../src/lib/db';

export async function seedSkills() {
  const skills = [
    {
      title: 'Mobile',
      category: 'Mobile',
      description: 'Flutter (iOS/Android), performance, UI/UX, App Store Connect.',
      tags: ['FLUTTER', 'UI/UX'],
      icon: 'smartphone',
    },
    {
      title: 'Web Frontend',
      category: 'Web Frontend',
      description: 'React.js, interfaces modernas e responsivas.',
      tags: ['REACT.JS', 'TAILWIND'],
      icon: 'language',
    },
    {
      title: 'Backend',
      category: 'Backend',
      description: 'PHP/Laravel, Node.js, APIs REST.',
      tags: ['LARAVEL', 'NODE.JS'],
      icon: 'database',
    },
    {
      title: 'Infra & Deploy',
      category: 'Infra & Deploy',
      description: 'Linux (Ubuntu), Docker, Coolify.',
      tags: ['DOCKER', 'LINUX'],
      icon: 'terminal',
    },
  ];

  for (const sk of skills) {
    await prisma.skill.create({
      data: sk,
    });
  }
  console.log(`${skills.length} habilidades semeadas.`);
}
