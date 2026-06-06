export type NavLink = {
  label: string;
  href: string;
};

export type SkillTag = {
  label: string;
};

export type SkillCategory = {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: SkillTag[];
};

export type ProjectTag = {
  label: string;
  variant: 'primary' | 'secondary';
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: ProjectTag[];
  href?: string;
};

export type Differential = {
  id: string;
  icon: string;
  title: string;
  description: string;
  variant: 'primary' | 'secondary' | 'tertiary';
};

export type ContactLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'neutral';
  ariaLabel: string;
};
