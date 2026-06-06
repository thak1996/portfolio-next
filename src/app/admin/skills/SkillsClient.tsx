'use client';

import React, { useState, useTransition } from 'react';
import { createSkill, updateSkill, deleteSkill } from './actions';

type Skill = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
  createdAt: Date;
};

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isPending, startTransition] = useTransition();

  // Estados dos formulários
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Frontend');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [icon, setIcon] = useState('language');

  React.useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  function openAddModal() {
    setEditingSkill(null);
    setTitle('');
    setCategory('Web Frontend');
    setDescription('');
    setTagsInput('');
    setIcon('language');
    setIsModalOpen(true);
  }

  function openEditModal(skill: Skill) {
    setEditingSkill(skill);
    setTitle(skill.title);
    setCategory(skill.category);
    setDescription(skill.description);
    setTagsInput(skill.tags.join(', '));
    setIcon(skill.icon);
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const skillData = {
      title,
      category,
      description,
      tags,
      icon,
    };

    startTransition(async () => {
      if (editingSkill) {
        const result = await updateSkill(editingSkill.id, skillData);
        if (result.success && result.skill) {
          const updated = result.skill as Skill;
          setSkills((prev) => prev.map((s) => (s.id === editingSkill.id ? updated : s)));
          setIsModalOpen(false);
        } else {
          alert(result.error);
        }
      } else {
        const result = await createSkill(skillData);
        if (result.success && result.skill) {
          const created = result.skill as Skill;
          setSkills((prev) => [...prev, created]);
          setIsModalOpen(false);
        } else {
          alert(result.error);
        }
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover esta habilidade?')) return;

    startTransition(async () => {
      const result = await deleteSkill(id);
      if (result.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(result.error);
      }
    });
  }

  // Agrupar skills por categorias
  const categories = ['Mobile', 'Web Frontend', 'Backend', 'Infra & Deploy'];

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-h1 text-h2 text-primary mb-xs">Habilidades / Skills</h1>
          <p className="text-on-surface-variant font-body-md">Gerencie as qualificações e tecnologias exibidas no portfólio</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-bold hover:bg-primary-container/85 transition-all self-start active:scale-95 shadow-lg shadow-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Adicionar Habilidade
        </button>
      </div>

      {/* Categorias e Skills */}
      <div className="flex flex-col gap-lg">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);

          return (
            <div key={cat} className="flex flex-col gap-md">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-xs border-b border-white/5 pb-2 uppercase tracking-wider font-code-label">
                <span className="material-symbols-outlined text-[22px]">
                  {cat === 'Mobile'
                    ? 'smartphone'
                    : cat === 'Web Frontend'
                    ? 'language'
                    : cat === 'Backend'
                    ? 'database'
                    : 'terminal'}
                </span>
                {cat}
              </h2>

              {catSkills.length === 0 ? (
                <div className="py-md text-center bg-surface/30 border border-dashed border-white/5 rounded-xl text-on-surface-variant text-sm italic">
                  Nenhuma habilidade cadastrada para esta categoria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-md bg-surface border border-white/5 rounded-2xl flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all group"
                    >
                      <div className="flex flex-col gap-xs">
                        <div className="flex items-center gap-sm">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">
                              {skill.icon}
                            </span>
                          </div>
                          <h3 className="font-bold text-on-surface font-h3 text-base">
                            {skill.title}
                          </h3>
                        </div>
                        <p className="text-on-surface-variant font-body-md text-sm mt-xs">
                          {skill.description}
                        </p>

                        <div className="flex flex-wrap gap-xs mt-sm">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-surface-container-high border border-white/5 rounded text-[10px] text-primary/80 font-code-label"
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-sm border-t border-white/5 mt-md pt-sm justify-end">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="flex items-center gap-xs text-on-surface-variant hover:text-primary text-xs font-bold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="flex items-center gap-xs text-error/80 hover:text-error text-xs font-bold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-gutter">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-md sm:p-lg shadow-2xl flex flex-col gap-md">
            <div className="flex justify-between items-center mb-xs">
              <h3 className="font-h3 text-h3 text-primary font-bold">
                {editingSkill ? 'Editar Habilidade' : 'Adicionar Habilidade'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-xs rounded-xl bg-surface-container hover:bg-surface-bright border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                    Título / Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: React.js"
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                      Material Symbol Icon
                    </label>
                    <a 
                      href="https://fonts.google.com/icons" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold"
                    >
                      Ver Catálogo
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={icon}
                      onChange={(e) => setIcon(e.target.value.toLowerCase().replace(/[\s-]/g, '_'))}
                      placeholder="Ex: language, database, smartphone"
                      className="w-full bg-surface-container-high border border-white/10 pl-md pr-12 py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[20px] text-primary">
                        {icon || 'help'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    required
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Ex: FLUTTER, DART"
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Desenvolvimento mobile nativo rápido."
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div className="h-px bg-white/10 my-xs" />

              <div className="flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 text-on-surface border border-white/10 hover:bg-white/10 px-md py-sm rounded-xl font-bold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-xs bg-primary-container text-on-primary-container hover:bg-primary-container/85 px-md py-sm rounded-xl font-bold text-sm transition-all"
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Salvar Habilidade
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
