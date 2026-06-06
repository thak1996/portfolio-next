import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

const variants = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  neutral: 'bg-surface-container-high text-on-surface-variant border-white/10',
};

export function Badge({ label, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`px-3 py-1 border rounded-full font-code-label text-[10px] uppercase font-bold ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
