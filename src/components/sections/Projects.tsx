'use client';

import React, { useRef } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjectCard, DbProject } from './ProjectCard';

interface ProjectsProps {
  dbProjects?: DbProject[];
}

export function Projects({ dbProjects }: ProjectsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Lista padrão estática caso não venha nada do banco
  const staticProjects: DbProject[] = [
    {
      id: 'dimber',
      title: 'Dimber (iOS & Android)',
      description: 'Aplicativo completo (Flutter + Laravel). Ciclo de vida completo até publicação na App Store.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd5GAnzWysO9w8UiXGyVdCixnVKQe1sX6xfUFlF-6VKiRaYar5ZKJwBmS05p0Tj1GtMM0sKAs65BtGbL7701ubKxl7nK8ijplYgEWnLMXouTHXGXOPSbSulbSWDLVkzB575zxjPIVt6Fqwb42QiMTymky-AtJAvFD91nJHwDG0Zy59o9ublA_zqWTr7Zuilb5oUBhZWZ90TZjcAhxtff1nnyZjYHoolYh8CM4rqlqetq9yJFrawFxlEPodkGbIrhdLFi1GH9wITJk',
      tags: ['Flutter', 'Laravel'],
      detailsLink: '#',
      githubLink: null,
      featured: true,
    },
    {
      id: 'dashboard',
      title: 'Dashboard de Gestão',
      description: 'Dashboard de gestão / Sistema de leads (React, Node, PostgreSQL). Foco em usabilidade e segurança.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH9cPQUXn4IFvr6TGI_FT5jHaOiJpR06c3TX8h7n7_nnLSZynILbBirB-Uj_KO0OZyrTgpvjkkrc0mMttkdXsmS7YbhosziZHqhCx63kHg4Kd_7hh_-ieWlS6a45Gjf6BCNYFiCPdBJf2NdPQ0WavQq2OWosBUUhrkfGBnn_2H7KBR1oZS8CtR7Jsipw1hxa6qNJ5cvWfF9vpxcrXduHs1r3ftldKg7xS7O1YCwKvN5jWy74g40a3nZU4-U0NNOYXxxQ8rPvCnKmk',
      tags: ['React', 'Node'],
      detailsLink: '#',
      githubLink: null,
      featured: true,
    },
  ];

  const projectsList = dbProjects && dbProjects.length > 0 ? dbProjects : staticProjects;

  if (projectsList.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.children[0] as HTMLElement;
      const scrollAmount = card ? card.offsetWidth + 48 : 400; // 48 is gap-lg
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const card = carouselRef.current.children[0] as HTMLElement;
      const scrollAmount = card ? card.offsetWidth + 48 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-lg md:py-xl bg-surface-container-low" id="projects">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
          <div>
            <SectionTitle title="Projetos em Destaque" target="projects" className="mb-sm" />
            <p className="text-on-surface-variant">Sistemas reais entregues de ponta a ponta</p>
          </div>
          {projectsList.length > 1 && (
            <div className="flex gap-xs">
              <button 
                onClick={scrollLeft}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-white/5 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Anterior"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button 
                onClick={scrollRight}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-white/5 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
                aria-label="Próximo"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-md md:gap-lg pb-12 pt-6 px-2 snap-x snap-mandatory hide-scrollbar items-stretch scroll-smooth"
        >
          {projectsList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
