'use client';

import React, { useState, useTransition, useRef } from 'react';
import { createProject, updateProject, deleteProject, uploadImage } from './actions';

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  detailsLink: string;
  githubLink?: string | null;
  featured: boolean;
  createdAt: Date;
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();

  // Estados dos formulários
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [detailsLink, setDetailsLink] = useState('#');
  const [githubLink, setGithubLink] = useState('');
  const [featured, setFeatured] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  function openAddModal() {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImageFile(null);
    setTagsInput('');
    setDetailsLink('#');
    setGithubLink('');
    setFeatured(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setImageUrl(project.imageUrl);
    setImageFile(null);
    setTagsInput(project.tags.join(', '));
    setDetailsLink(project.detailsLink);
    setGithubLink(project.githubLink || '');
    setFeatured(project.featured);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Processar tags de string separada por vírgula em array de strings limpas
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    startTransition(async () => {
      let finalImageUrl = imageUrl;

      // Se houver um novo arquivo, fazer upload primeiro
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResult = await uploadImage(formData);
        if (uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url;
        } else {
          alert(uploadResult.error || 'Falha ao fazer upload da imagem.');
          return;
        }
      }

      if (!finalImageUrl) {
        alert('É necessário ter uma imagem do projeto.');
        return;
      }

      const projectData = {
        title,
        description,
        imageUrl: finalImageUrl,
        tags,
        detailsLink,
        githubLink: githubLink || null,
        featured,
      };

      try {
        if (editingProject) {
          // Atualização
          const result = await updateProject(editingProject.id, projectData);
          if (result && result.success && result.project) {
            const updated = result.project as Project;
            setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
            setIsModalOpen(false);
          } else {
            alert(result?.error || 'Erro desconhecido ao atualizar.');
          }
        } else {
          // Criação
          const result = await createProject(projectData);
          if (result && result.success && result.project) {
            const created = result.project as Project;
            setProjects((prev) => [created, ...prev]);
            setIsModalOpen(false);
          } else {
            alert(result?.error || 'Erro desconhecido ao criar.');
          }
        }
      } catch (err: any) {
        console.error(err);
        alert('Ocorreu um erro na requisição: ' + err.message);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover este projeto do portfólio?')) return;

    startTransition(async () => {
      const result = await deleteProject(id);
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-h1 text-h2 text-primary mb-xs">Projetos</h1>
          <p className="text-on-surface-variant font-body-md">Cadastre e gerencie os trabalhos exibidos no portfólio</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-bold hover:bg-primary-container/85 transition-all self-start active:scale-95 shadow-lg shadow-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Adicionar Projeto
        </button>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {projects.length === 0 ? (
          <div className="md:col-span-2 py-xl text-center bg-surface border border-white/5 rounded-2xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-xs block text-on-surface-variant/40">
              folder_open
            </span>
            Nenhum projeto cadastrado ainda. Clique em "Adicionar Projeto" para começar!
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-video w-full bg-surface-container-high overflow-hidden relative border-b border-white/5">
                  <img
                    src={project.imageUrl || 'https://via.placeholder.com/600x400'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  {project.featured && (
                    <span className="absolute top-md right-md px-3 py-1 bg-secondary/90 text-on-secondary rounded-full font-code-label text-[10px] uppercase font-bold flex items-center gap-xs shadow-md border border-white/10">
                      <span className="material-symbols-outlined text-[12px]">star</span>
                      Destaque
                    </span>
                  )}
                </div>

                <div className="p-md flex flex-col gap-xs">
                  <div className="flex justify-between items-start gap-sm">
                    <h3 className="font-h3 text-h3 text-primary group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-on-surface-variant font-body-md text-sm mt-xs line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-xs mt-md">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-surface-container border border-white/10 rounded text-xs text-primary/80 font-code-label"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {(project.githubLink || (project.detailsLink && project.detailsLink !== '#')) && (
                    <div className="flex flex-wrap gap-sm mt-md pt-sm border-t border-white/5">
                      {project.detailsLink && project.detailsLink !== '#' && (
                        <a
                          href={project.detailsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all px-3 py-1 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/20 text-xs"
                        >
                          Visualizar <span className="material-symbols-outlined ml-1 text-[14px]">open_in_new</span>
                        </a>
                      )}
                      
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-on-surface-variant hover:text-on-surface font-bold hover:gap-2 transition-all px-3 py-1 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 text-xs"
                        >
                          GitHub <span className="material-symbols-outlined ml-1 text-[14px]">code</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Ações inferiores */}
              <div className="p-md pt-0 flex gap-sm border-t border-white/5 mt-md pt-md">
                <button
                  onClick={() => openEditModal(project)}
                  className="flex-1 flex items-center justify-center gap-xs bg-white/5 text-on-surface border border-white/10 hover:bg-white/10 px-md py-sm rounded-xl font-bold text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-sm bg-error/10 border border-error/20 text-error hover:bg-error/20 rounded-xl transition-colors"
                  title="Excluir Projeto"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-gutter overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl p-md sm:p-lg shadow-2xl flex flex-col gap-md my-8">
            <div className="flex justify-between items-center mb-xs">
              <h3 className="font-h3 text-h3 text-primary font-bold">
                {editingProject ? 'Editar Projeto' : 'Adicionar Projeto'}
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
                    Título do Projeto
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Dimber Mobile App"
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                    Link do Projeto (Visualização)
                  </label>
                  <input
                    type="text"
                    value={detailsLink}
                    onChange={(e) => setDetailsLink(e.target.value)}
                    placeholder="Ex: https://meusite.com ou #"
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                    Link do GitHub (Repositório)
                  </label>
                  <input
                    type="text"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="Ex: https://github.com/usuario/repo"
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                  Imagem do Projeto
                </label>
                <div className="flex flex-col sm:flex-row gap-sm items-start sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {(imageFile || imageUrl) && (
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                      <img 
                        src={imageFile ? URL.createObjectURL(imageFile) : imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                  Tags / Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  required
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: React, Node.js, Tailwind, Flutter"
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-code-label text-code-label text-on-surface-variant uppercase">
                  Descrição
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva sobre a tecnologia utilizada, a solução entregue, etc..."
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface whitespace-pre-wrap"
                />
              </div>

              <div className="flex items-center gap-xs py-xs">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 rounded bg-surface-container-high border border-white/10 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="featured"
                  className="text-on-surface select-none font-body-md text-sm cursor-pointer"
                >
                  Destacar projeto na página inicial do portfólio
                </label>
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
                      Salvar Projeto
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
