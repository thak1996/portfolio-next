'use client';

import React, { useState } from 'react';
import { NavLink } from '@/components/common/NavLink';

type NavigationMenuProps = {
  resumeUrl?: string | null;
  sectionOrder: string[];
};

const labels: Record<string, string> = {
  hero: 'Home',
  about: 'Sobre',
  skills: 'Habilidades',
  projects: 'Projetos',
  contact: 'Contato',
};

export function NavigationMenu({ resumeUrl, sectionOrder }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-lg items-center">
        {sectionOrder.map((key) => (
          labels[key] ? (
            <NavLink 
              key={key} 
              target={key} 
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
            >
              {labels[key]}
            </NavLink>
          ) : null
        ))}
        {resumeUrl && (
          <a
            aria-label="Baixar Currículo"
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold hover:scale-95 transition-transform hover:bg-primary hover:text-on-primary shadow-lg shadow-primary/20"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Currículo
          </a>
        )}
      </nav>

      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden text-primary p-2 active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menu"
      >
        <span className="material-symbols-outlined text-[28px]">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-surface-container-high border-b border-white/10 shadow-2xl flex flex-col md:hidden z-40 animate-fadeIn">
          {sectionOrder.map((key) => (
            labels[key] ? (
              <div key={key} onClick={() => setIsOpen(false)} className="w-full">
                <NavLink 
                  target={key} 
                  className="w-full text-left p-md border-b border-white/5 text-on-surface hover:bg-surface-bright transition-colors font-bold"
                >
                  {labels[key]}
                </NavLink>
              </div>
            ) : null
          ))}
          {resumeUrl && (
            <a
              className="w-full text-left p-md text-primary font-bold hover:bg-surface-bright transition-colors"
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              Baixar Currículo
            </a>
          )}
        </div>
      )}
    </>
  );
}
