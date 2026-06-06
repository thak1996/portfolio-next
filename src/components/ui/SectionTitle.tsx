import React from 'react';
import { NavLink } from '@/components/common/NavLink';

interface SectionTitleProps {
  title: string;
  target?: string;
  className?: string;
}

export function SectionTitle({ title, target, className = '' }: SectionTitleProps) {
  const content = (
    <h2 className={`font-h2 text-h2 text-primary interactive-title ${className}`}>
      {title}
    </h2>
  );

  if (target) {
    return (
      <NavLink target={target} className="inline-block hover:no-underline">
        {content}
      </NavLink>
    );
  }

  return content;
}
