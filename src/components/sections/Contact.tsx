'use client';

import React, { useState, useTransition } from 'react';
import { submitContactForm } from '@/app/actions/contact';
import { SectionTitle } from '@/components/ui/SectionTitle';

const iconColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-on-surface-variant',
};

const hoverStyles = {
  primary: 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
  secondary: 'hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10',
  neutral: 'hover:border-white/30 hover:shadow-lg hover:shadow-white/5',
};

export function Contact({ dynamicContacts }: { dynamicContacts: { id: string; label: string; href: string; icon: string; variant: 'primary'|'secondary'|'neutral' }[] }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactForm(null, formData);
      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error || 'Erro ao enviar a mensagem.');
      }
    });
  }

  return (
    <section className="py-lg md:py-xl bg-surface-container-lowest border-t border-white/5" id="contact">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-start">
          {/* Coluna Esquerda: Informações e Redes */}
          <div className="flex flex-col gap-md text-left lg:sticky lg:top-8">
            <div>
              <SectionTitle title="Pronto para elevar seu projeto?" target="contact" className="mb-sm" />
              <p className="text-on-surface-variant text-body-lg leading-relaxed max-w-lg">
                Estou em busca de novas oportunidades como Desenvolvedor Fullstack em regime CLT ou projetos freelance desafiadores. Vamos conversar sobre como posso agregar valor ao seu time.
              </p>
            </div>

            <div className="flex flex-col gap-sm mt-md">
              <span className="font-code-label text-code-label text-on-surface-variant uppercase">
                Conecte-se comigo
              </span>
              <div className="flex flex-wrap gap-sm">
                {dynamicContacts.map((contact) => (
                  <a
                    key={contact.id}
                    aria-label={contact.label}
                    className={`flex items-center justify-center gap-sm bg-surface-container-highest border border-white/10 w-12 h-12 sm:w-auto sm:h-auto sm:px-md sm:py-sm rounded-xl hover:bg-surface-bright transition-colors active:scale-95 hover:shadow-lg ${
                      hoverStyles[contact.variant as keyof typeof hoverStyles] || ''
                    }`}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={`material-symbols-outlined text-[24px] sm:text-[20px] ${
                      iconColors[contact.variant as keyof typeof iconColors] || ''
                    }`}>
                      {contact.icon}
                    </span>
                    <span className="font-bold text-on-surface hidden sm:inline">{contact.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Formulário de Contato */}
          <div className="p-md sm:p-lg bg-surface border border-white/5 rounded-2xl shadow-2xl hover:border-primary/20 transition-all duration-300">
            <h3 className="font-h3 text-h3 text-primary mb-md">Mande uma mensagem</h3>

            {success && (
              <div className="mb-md p-sm rounded-xl border border-secondary/20 bg-secondary/10 text-secondary font-body-md flex items-center gap-xs animate-fadeIn">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Mensagem enviada com sucesso! Entrarei em contato em breve.</span>
              </div>
            )}

            {error && (
              <div className="mb-md p-sm rounded-xl border border-error/20 bg-error/10 text-error font-body-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label htmlFor="name" className="font-code-label text-code-label text-on-surface-variant uppercase text-xs">
                  Seu Nome
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Como posso te chamar?"
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label htmlFor="email" className="font-code-label text-code-label text-on-surface-variant uppercase text-xs">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Ex: seuemail@empresa.com"
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label htmlFor="message" className="font-code-label text-code-label text-on-surface-variant uppercase text-xs">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  placeholder="Sobre o que você gostaria de conversar?"
                  className="w-full bg-surface-container-high border border-white/10 px-md py-sm rounded-xl focus:outline-none focus:border-primary/50 text-on-surface placeholder:text-on-surface-variant/30 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-xs flex items-center justify-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-bold hover:bg-primary-container/80 transition-colors active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/5"
              >
                {isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
