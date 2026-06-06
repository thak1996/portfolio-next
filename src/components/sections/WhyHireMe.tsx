import { SectionTitle } from '@/components/ui/SectionTitle';
import { IconBadge } from '@/components/ui/IconBadge';

export function WhyHireMe() {
  return (
    <section className="py-lg md:py-xl">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="bg-surface-container rounded-2xl border border-white/5 p-lg md:p-xl flex flex-col md:flex-row gap-lg md:gap-xl items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-lg opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div className="md:w-1/2 relative z-10">
            <SectionTitle title="Diferenciais que geram valor" className="mb-sm md:mb-md" />
            <p className="text-on-surface-variant text-body-lg">Mais que um desenvolvedor, um parceiro estratégico para o seu produto digital.</p>
          </div>
          <div className="md:w-1/2 grid gap-md relative z-10">
            <div className="flex gap-md">
              <IconBadge icon="package_2" variant="primary" />
              <div>
                <h4 className="font-h3 text-[18px] text-on-surface mb-1">Entrega Completa</h4>
                <p className="text-on-surface-variant text-sm">Capacidade de atuar da infraestrutura básica à publicação nas lojas.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <IconBadge icon="visibility" variant="secondary" />
              <div>
                <h4 className="font-h3 text-[18px] text-on-surface mb-1">Visão de Negócio</h4>
                <p className="text-on-surface-variant text-sm">Entendimento do impacto técnico nas metas comerciais e experiência do usuário.</p>
              </div>
            </div>
            <div className="flex gap-md">
              <IconBadge icon="bolt" variant="tertiary" />
              <div>
                <h4 className="font-h3 text-[18px] text-on-surface mb-1">Resiliência Técnica</h4>
                <p className="text-on-surface-variant text-sm">Foco na resolução de problemas complexos e arquitetura de escala.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
