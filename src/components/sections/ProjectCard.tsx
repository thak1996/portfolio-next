import React from 'react';
import { Badge } from '@/components/ui/Badge';

export type DbProject = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  detailsLink: string;
  githubLink?: string | null;
  featured: boolean;
};

interface ProjectCardProps {
  project: DbProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="flex-shrink-0 w-[85vw] md:w-[calc(50%-24px)] lg:w-[calc(33.3333%-32px)] snap-start group relative glass-panel rounded-xl overflow-hidden card-hover flex flex-col"
    >
      <div className="aspect-video bg-surface-container-highest overflow-hidden relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={project.title}
          className="w-full h-full object-cover img-reveal"
          src={project.imageUrl}
        />
      </div>
      <div className="p-md flex flex-col flex-1">
        <div className="flex justify-between items-start mb-sm gap-sm">
          <h3 className="font-h3 text-h3 text-primary group-hover:text-primary-container transition-colors">
            {project.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-xs shrink-0 mb-sm">
          {project.tags.map((tag, idx) => (
            <Badge key={tag} label={tag} variant={idx % 2 === 0 ? 'secondary' : 'primary'} />
          ))}
        </div>
        <p className="text-on-surface-variant mb-md leading-relaxed font-body-md text-sm sm:text-base flex-1">
          {project.description}
        </p>
        {(project.githubLink || (project.detailsLink && project.detailsLink !== '#')) && (
          <div className="flex flex-wrap gap-sm mt-auto pt-md border-t border-white/5 shrink-0">
            {project.detailsLink && project.detailsLink !== '#' && (
              <a
                className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all btn-glow px-4 py-2 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/20 text-sm"
                href={project.detailsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visualizar <span className="material-symbols-outlined ml-1 text-[18px]">open_in_new</span>
              </a>
            )}
            
            {project.githubLink && (
              <a
                className="inline-flex items-center text-on-surface-variant hover:text-on-surface font-bold hover:gap-2 transition-all px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 text-sm"
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span className="material-symbols-outlined ml-1 text-[18px]">code</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
