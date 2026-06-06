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
              className="bg-surface border border-white/5 p-md rounded-xl hover:border-primary/30 transition-colors group flex flex-col justify-center items-center text-center shadow-lg hover:shadow-primary/5 active:scale-95"
            >
              <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-sm group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  {skill.category === 'Frontend' ? 'web' : 
                   skill.category === 'Backend' ? 'dns' : 
                   skill.category === 'Database' ? 'database' : 
                   skill.category === 'Mobile' ? 'smartphone' : 'code'}
                </span>
              </div>
              <h3 className="font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{skill.title}</h3>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-auto overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" 
                  style={{ width: skill.level }}
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
