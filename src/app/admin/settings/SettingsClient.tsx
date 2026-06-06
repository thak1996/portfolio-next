'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/app/admin/projects/actions';
import { updateSiteContent, SiteContentInput } from './actions';
import type { SiteContent } from '@prisma/client';

type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'whyHireMe' | 'contact';

export function SettingsClient({ initialContent }: { initialContent: SiteContent }) {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(
    initialContent.sectionOrder && initialContent.sectionOrder.length > 0
      ? (initialContent.sectionOrder as SectionId[])
      : ['hero', 'about', 'skills', 'projects', 'whyHireMe', 'contact']
  );
  
  const [showHero, setShowHero] = useState(initialContent.showHero ?? true);
  const [showAbout, setShowAbout] = useState(initialContent.showAbout ?? true);
  const [showSkills, setShowSkills] = useState(initialContent.showSkills ?? true);
  const [showProjects, setShowProjects] = useState(initialContent.showProjects ?? true);
  const [showWhyHireMe, setShowWhyHireMe] = useState(initialContent.showWhyHireMe ?? true);
  const [showContact, setShowContact] = useState(initialContent.showContact ?? true);

  // Field states
  const [heroBadge, setHeroBadge] = useState(initialContent.heroBadge);
  const [heroTitle, setHeroTitle] = useState(initialContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent.heroSubtitle);
  const [heroDescription, setHeroDescription] = useState(initialContent.heroDescription);
  const [heroTerminalText, setHeroTerminalText] = useState(initialContent.heroTerminalText || '');
  const [heroPhotoUrl, setHeroPhotoUrl] = useState(initialContent.heroPhotoUrl || '');
  const [heroPhotoFile, setHeroPhotoFile] = useState<File | null>(null);
  
  const [resumeUrl, setResumeUrl] = useState(initialContent.resumeUrl || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [learningText, setLearningText] = useState(initialContent.learningText || '');
  const [aboutText, setAboutText] = useState(initialContent.aboutText);

  const [contactEmail, setContactEmail] = useState(initialContent.contactEmail);
  const [contactWhatsapp, setContactWhatsapp] = useState(initialContent.contactWhatsapp || '');
  const [contactLinkedin, setContactLinkedin] = useState(initialContent.contactLinkedin || '');
  const [contactGithub, setContactGithub] = useState(initialContent.contactGithub || '');

  const [footerText, setFooterText] = useState(initialContent.footerText);

  // Ordering Logic
  function moveSection(index: number, direction: 'up' | 'down') {
    const newOrder = [...sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setSectionOrder(newOrder);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalPhotoUrl = heroPhotoUrl;

      if (heroPhotoFile) {
        const formData = new FormData();
        formData.append('image', heroPhotoFile);
        const uploadResult = await uploadImage(formData);
        if (uploadResult.success && uploadResult.url) {
          finalPhotoUrl = uploadResult.url;
        } else {
          alert(uploadResult.error || 'Falha ao fazer upload da foto.');
          setIsSaving(false);
          return;
        }
      }

      let finalResumeUrl = resumeUrl;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('image', resumeFile);
        const uploadResult = await uploadImage(formData);
        if (uploadResult.success && uploadResult.url) {
          finalResumeUrl = uploadResult.url;
        } else {
          alert(uploadResult.error || 'Falha ao fazer upload do currículo.');
          setIsSaving(false);
          return;
        }
      }

      const data: SiteContentInput = {
        showHero,
        showAbout,
        showSkills,
        showProjects,
        showWhyHireMe,
        showContact,
        sectionOrder,

        heroBadge,
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroTerminalText: heroTerminalText || null,
        heroPhotoUrl: finalPhotoUrl || null,
        learningText: learningText || null,
        aboutText,
        contactEmail,
        contactWhatsapp: contactWhatsapp || null,
        contactLinkedin: contactLinkedin || null,
        contactGithub: contactGithub || null,
        footerText,
        resumeUrl: finalResumeUrl || null,
      };

      const result = await updateSiteContent(data);
      if (result?.success) {
        alert('Configurações salvas com sucesso!');
        setHeroPhotoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setResumeFile(null);
        if (resumeInputRef.current) resumeInputRef.current.value = '';
      } else {
        alert(result?.error || 'Erro ao salvar.');
      }
    } catch (error: any) {
      alert('Erro ao salvar as configurações: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const sectionsConfig: Record<SectionId, { title: string; icon: string; showState: boolean; setShowState: (v: boolean) => void; content: React.ReactNode }> = {
    hero: {
      title: 'Página Inicial (Hero)',
      icon: 'home',
      showState: showHero,
      setShowState: setShowHero,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md px-lg pb-lg pt-lg border-t border-white/5">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Badge Superior</label>
            <input 
              type="text" 
              value={heroBadge} 
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Título Principal (Seu Nome)</label>
            <input 
              type="text" 
              value={heroTitle} 
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Subtítulo / Stack Line</label>
            <input 
              type="text" 
              value={heroSubtitle} 
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Texto do Terminal (Tags Curtas)</label>
            <input 
              type="text" 
              value={heroTerminalText} 
              onChange={(e) => setHeroTerminalText(e.target.value)}
              placeholder="Ex: Flutter • React • Laravel"
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Descrição Resumida (Parágrafo)</label>
            <textarea 
              value={heroDescription} 
              onChange={(e) => setHeroDescription(e.target.value)}
              rows={3}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-md items-start">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-on-surface-variant mb-xs">Foto de Perfil (Link ou Arquivo)</label>
              <input 
                type="text" 
                value={heroPhotoUrl} 
                onChange={(e) => setHeroPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none mb-2"
              />
              <div className="flex flex-col gap-xs mt-2">
                <label className="block text-sm font-bold text-on-surface-variant">Ou Enviar Nova Foto</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setHeroPhotoFile(e.target.files?.[0] || null)}
                  className="text-sm text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
            {(heroPhotoFile || heroPhotoUrl) && (
              <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-surface-container shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={heroPhotoFile ? URL.createObjectURL(heroPhotoFile) : heroPhotoUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 border border-white/5 p-4 rounded-xl bg-surface-container-low">
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">Link Atual do Currículo (PDF)</label>
            <input 
              type="text" 
              value={resumeUrl} 
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="/uploads/curriculo.pdf"
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none mb-4"
            />
            <div className="flex flex-col gap-xs">
              <label className="block text-sm font-bold text-on-surface-variant">Ou Enviar Novo Currículo (PDF)</label>
              <input 
                type="file" 
                ref={resumeInputRef}
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="text-sm text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>
        </div>
      )
    },
    about: {
      title: 'Sobre Mim',
      icon: 'person',
      showState: showAbout,
      setShowState: setShowAbout,
      content: (
        <div className="px-lg pb-lg pt-lg border-t border-white/5">
          <label className="block text-sm font-bold text-on-surface-variant mb-xs">Texto Completo</label>
          <textarea 
            value={aboutText} 
            onChange={(e) => setAboutText(e.target.value)}
            rows={8}
            className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
      )
    },
    skills: {
      title: 'Habilidades',
      icon: 'terminal',
      showState: showSkills,
      setShowState: setShowSkills,
      content: (
        <div className="px-lg pb-lg pt-lg border-t border-white/5">
          <label className="block text-sm font-bold text-on-surface-variant mb-xs">Texto "Em Evolução" (Rodapé da seção de habilidades)</label>
          <input 
            type="text"
            value={learningText} 
            onChange={(e) => setLearningText(e.target.value)}
            placeholder="Ex: Go (Golang) para alta disponibilidade"
            className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
      )
    },
    projects: {
      title: 'Projetos',
      icon: 'developer_mode',
      showState: showProjects,
      setShowState: setShowProjects,
      content: (
        <div className="px-lg pb-lg pt-lg border-t border-white/5 text-on-surface-variant text-sm">
          A seção de projetos será exibida apenas se você tiver projetos cadastrados na aba Projetos. Você pode ocultar toda a seção desativando a chave acima.
        </div>
      )
    },
    whyHireMe: {
      title: 'Por Que Me Contratar',
      icon: 'thumb_up',
      showState: showWhyHireMe,
      setShowState: setShowWhyHireMe,
      content: (
        <div className="px-lg pb-lg pt-lg border-t border-white/5 text-on-surface-variant text-sm">
          Esta seção não possui textos editáveis no momento, mas você pode controlar se ela deve aparecer no site desativando a chave acima.
        </div>
      )
    },
    contact: {
      title: 'Contato & Redes Sociais',
      icon: 'mail',
      showState: showContact,
      setShowState: setShowContact,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md px-lg pb-lg pt-lg border-t border-white/5">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">E-mail Principal</label>
            <input 
              type="email" 
              value={contactEmail} 
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">WhatsApp (URL ou Número)</label>
            <input 
              type="text" 
              value={contactWhatsapp} 
              onChange={(e) => setContactWhatsapp(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">LinkedIn (URL)</label>
            <input 
              type="url" 
              value={contactLinkedin} 
              onChange={(e) => setContactLinkedin(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-xs">GitHub (URL)</label>
            <input 
              type="url" 
              value={contactGithub} 
              onChange={(e) => setContactGithub(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-xl max-w-4xl pb-xl">
      <div className="flex items-center gap-sm mb-lg text-on-surface-variant">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-sm">
          Ative, desative e ordene as seções do seu site usando as setas. Clique em uma seção para editar seus textos.
        </p>
      </div>

      <div className="space-y-md">
        {sectionOrder.map((sectionKey, index) => {
          const config = sectionsConfig[sectionKey];
          if (!config) return null; // Fallback in case of schema mismatches

          const isFirst = index === 0;
          const isLast = index === sectionOrder.length - 1;

          return (
            <details 
              key={sectionKey} 
              open={index === 0}
              className={`bg-surface border border-white/5 rounded-2xl group overflow-hidden transition-all duration-300 ${!config.showState ? 'opacity-60 grayscale-[50%]' : ''}`}
            >
              <summary className="p-lg flex items-center justify-between cursor-pointer list-none select-none hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-md">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-1 items-center">
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveSection(index, 'up'); }}
                      disabled={isFirst}
                      className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); moveSection(index, 'down'); }}
                      disabled={isLast}
                      className="p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-sm text-xl font-bold text-primary">
                    <span className="material-symbols-outlined">{config.icon}</span>
                    {config.title}
                  </div>
                </div>

                <div className="flex items-center gap-md">
                  {/* Toggle Button */}
                  <label className="flex items-center cursor-pointer gap-sm mr-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-sm font-bold text-on-surface-variant hidden sm:inline">
                      {config.showState ? 'Ativa' : 'Oculta'}
                    </span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={config.showState}
                        onChange={(e) => config.setShowState(e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${config.showState ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.showState ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>

                  <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </summary>
              
              <div className="transition-opacity duration-300">
                {config.content}
              </div>
            </details>
          );
        })}
      </div>

      {/* Footer Settings is global, not orderable right now */}
      <details className="bg-surface border border-white/5 rounded-2xl group overflow-hidden mt-xl">
        <summary className="p-lg text-xl font-bold text-primary flex items-center justify-between cursor-pointer list-none select-none hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined">horizontal_rule</span>
            Rodapé Global (Footer)
          </div>
          <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
        </summary>
        <div className="px-lg pb-lg pt-lg border-t border-white/5">
          <label className="block text-sm font-bold text-on-surface-variant mb-xs">Texto de Copyright</label>
          <input 
            type="text" 
            value={footerText} 
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
      </details>

      <div className="sticky bottom-md bg-surface/80 backdrop-blur-lg border border-white/10 p-md rounded-2xl shadow-2xl flex items-center justify-between mt-xl z-20">
        <span className="text-on-surface-variant text-sm hidden sm:block">Não esqueça de salvar suas alterações.</span>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-xs bg-primary text-primary-fixed-dim hover:bg-primary/90 px-xl py-sm rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 w-full sm:w-auto"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}
