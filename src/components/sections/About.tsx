import { getSiteContent } from '@/app/admin/settings/actions';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { IconBadge } from '@/components/ui/IconBadge';

export async function About() {
  const content = await getSiteContent();

  return (
    <section className="py-lg md:py-xl bg-surface-container-low border-y border-white/5" id="about">
      <div className="max-w-container-max mx-auto px-gutter grid md:grid-cols-2 gap-xl items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary opacity-25 blur transition duration-1000 group-hover:opacity-40"></div>
          <div className="relative bg-surface rounded-xl overflow-hidden border border-white/10 aspect-square md:aspect-video flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Software development workstation"
              className="w-full h-full object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv4bWvOw0X4GsOsNtzdHsJynQyTHlaLOf4uw0LrJDkfCTRmrxUV8emI37DxbSC_dDVEtljKZm-1rFRuGJnmpGa0hvK4RAydgNCQC6gQAoWT6gbLmmyEEbyIBXc4FFwDE7HNUmj2IKgdpuPaIcwowy_WlSU-aW52h6Y9U22tesW0fcTTIGL0ytJd9b3E9aBgUuH9208hg2PIacrXp52L-ccp1toUse0vfsZLU726hqrU-YHe9leTo3tazLKE_i-2dL7Lk8dpWiXIsk"
            />
            <div className="absolute bottom-md left-md bg-surface/90 backdrop-blur px-md py-sm rounded-xl border border-white/10">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-error/50"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary/50"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                </div>
                <p className="font-code-label text-xs text-primary/80 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  visionary_logic.js
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SectionTitle title="Sobre Mim" target="about" className="mb-md" />
          <div className="space-y-sm font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
            {content.aboutText}
          </div>
          <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Full-Cycle Delivery Card */}
            <div className="group relative p-md glass-panel rounded-xl overflow-hidden card-hover">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
              <div className="flex items-center gap-md mb-xs relative z-10">
                <IconBadge icon="deployed_code" variant="primary" className="icon-float" />
                <div>
                  <p className="font-h1 text-[32px] text-primary leading-none">100%</p>
                  <p className="font-code-label text-code-label text-on-surface-variant uppercase tracking-tighter">De ponta a ponta</p>
                </div>
              </div>
              <h4 className="font-h3 text-lg text-on-surface mb-1 relative z-10">Full-Cycle Delivery</h4>
              <p className="text-on-surface-variant text-sm relative z-10 leading-relaxed">Da concepção da infraestrutura ao deploy final nas lojas. Autonomia completa em todo o ciclo de desenvolvimento.</p>
            </div>
            {/* Product Ownership Card */}
            <div className="group relative p-md glass-panel rounded-xl overflow-hidden card-hover">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-all"></div>
              <div className="flex items-center gap-md mb-xs relative z-10">
                <IconBadge icon="handshake" variant="secondary" className="icon-float" />
                <div>
                  <p className="font-h1 text-[32px] text-secondary leading-none">Visão</p>
                  <p className="font-code-label text-code-label text-on-surface-variant uppercase tracking-tighter">De Dono</p>
                </div>
              </div>
              <h4 className="font-h3 text-lg text-on-surface mb-1 relative z-10">Product Ownership</h4>
              <p className="text-on-surface-variant text-sm relative z-10 leading-relaxed">Maturidade técnica aplicada ao negócio, garantindo que cada linha de código gere valor real para o produto final.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
