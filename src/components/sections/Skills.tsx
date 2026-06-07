import { SectionTitle } from '@/components/ui/SectionTitle';

type DbSkill = {
  id: string;
  title: string;
  category: string;
  level?: string; // Optional for fallback
  description?: string;
  tags?: string[];
  icon?: string;
};

interface SkillsProps {
  dbSkills?: DbSkill[];
  learningText?: string | null;
}

export function Skills({ dbSkills, learningText }: SkillsProps) {
  // Fallback estático caso não existam skills no BD
  const staticSkills: DbSkill[] = [
    { id: '1', title: 'React', level: '90%', category: 'Frontend' },
    { id: '2', title: 'Next.js', level: '85%', category: 'Frontend' },
    { id: '3', title: 'TypeScript', level: '85%', category: 'Frontend' },
    { id: '4', title: 'Tailwind CSS', level: '95%', category: 'Frontend' },
    { id: '5', title: 'Node.js', level: '80%', category: 'Backend' },
    { id: '6', title: 'PostgreSQL', level: '75%', category: 'Database' },
    { id: '7', title: 'Prisma', level: '80%', category: 'Backend' },
    { id: '8', title: 'Flutter', level: '70%', category: 'Mobile' },
  ];

  const skillsList = dbSkills && dbSkills.length > 0 ? dbSkills : staticSkills;

  return (
    <section className="py-lg md:py-xl" id="skills">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-xl">
          <SectionTitle title="Habilidades & Stack" target="skills" className="mb-sm" />
          <p className="text-on-surface-variant font-body-md max-w-2xl mx-auto">
            Tecnologias que utilizo no dia a dia para construir produtos sólidos e escaláveis.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md md:gap-lg">
          {skillsList.map((skill) => (
            <div 
              key={skill.id} 
              className="bg-surface border border-white/5 p-md md:p-lg rounded-2xl hover:border-primary/30 transition-all duration-300 group flex flex-col justify-start items-start text-left shadow-lg hover:shadow-primary/5 active:scale-[0.98] hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>

              <div className="flex items-center gap-sm mb-md w-full">
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 shadow-inner">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    {skill.icon || (
                      skill.category === 'Frontend' ? 'web' : 
                      skill.category === 'Backend' ? 'dns' : 
                      skill.category === 'Database' ? 'database' : 
                      skill.category === 'Mobile' ? 'smartphone' : 'code'
                    )}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{skill.title}</h3>
              </div>

              {skill.description && (
                <p className="text-on-surface-variant text-sm mb-md line-clamp-3">
                  {skill.description}
                </p>
              )}

              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-xs mb-md mt-auto">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[10px] md:text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="w-full bg-surface-container-highest rounded-full h-1 mt-auto overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full opacity-70 group-hover:opacity-100 transition-opacity" 
                  style={{ width: skill.level || '100%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {learningText && (
          <div className="mt-xl text-center flex items-center justify-center gap-xs text-on-surface-variant text-sm border border-white/5 bg-surface-container-lowest p-sm rounded-xl max-w-md mx-auto">
            <span className="material-symbols-outlined text-secondary text-[20px] animate-pulse">rocket_launch</span>
            <span className="font-bold">Atualmente estudando:</span> {learningText}
          </div>
        )}
      </div>
    </section>
  );
}
