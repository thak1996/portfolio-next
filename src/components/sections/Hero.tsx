import { getSiteContent } from '@/app/admin/settings/actions';

export async function Hero() {
  const content = await getSiteContent();

  return (
    <section className="relative pt-lg pb-16 md:pt-32 md:pb-40 overflow-hidden code-pattern" id="hero">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-gutter relative z-10 text-center md:text-left mt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-xl">
        <div className="flex-1 flex flex-col items-center md:items-start mb-sm">
          <div className="inline-flex items-center gap-xs mb-base px-3 py-1 rounded-full border border-primary/40 bg-primary/20">
            <span className="font-code-label text-[11px] text-primary-fixed uppercase tracking-[0.25em] font-bold">
              {content.heroBadge}
            </span>
          </div>
          <h1 className="font-h1 text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-fixed-dim to-secondary-fixed mb-1 tracking-tight">
            {content.heroTitle}
          </h1>
          <div className="font-body-lg text-body-lg text-on-surface-variant my-lg max-w-2xl leading-relaxed">
            <p className="mb-md">
              {content.heroSubtitle}
            </p>
            <p className="mb-md text-base">
              {content.heroDescription}
            </p>
            {content.heroTerminalText && (
              <span className="inline-flex items-center py-1 px-3 bg-surface-container rounded-lg border border-white/5 font-code-label text-sm text-secondary flex-wrap justify-center md:justify-start">
                <span className="material-symbols-outlined text-sm mr-2 hidden sm:block">terminal</span>
                {content.heroTerminalText}
              </span>
            )}
            
            {content.resumeUrl && (
              <div className="mt-xl flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href={content.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold hover:bg-secondary-fixed transition-colors shadow-lg hover:shadow-secondary/20 active:scale-95"
                >
                  <span className="material-symbols-outlined">download</span>
                  Baixar Currículo
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center relative mb-8 md:mb-0 mt-8 md:mt-0">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-surface-container shadow-2xl relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={content.heroPhotoUrl || 'https://github.com/thak1996.png'} 
              alt={content.heroTitle} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0 w-full h-full"></div>
        </div>
      </div>
    </section>
  );
}
