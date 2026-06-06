import React from 'react';

interface IconBadgeProps {
  icon: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  size?: 'md' | 'lg';
}

const variants = {
  primary: 'bg-primary-container/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  tertiary: 'bg-tertiary-container/20 text-tertiary',
};

export function IconBadge({ icon, variant = 'primary', className = '', size = 'md' }: IconBadgeProps) {
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-[32px]' : 'w-12 h-12 text-[24px]';

  return (
    <div className={`flex-shrink-0 ${sizeClass} rounded-xl flex items-center justify-center ${variants[variant]} ${className}`}>
      <span className="material-symbols-outlined text-inherit" style={{ fontSize: 'inherit' }}>
        {icon}
      </span>
    </div>
  );
}
