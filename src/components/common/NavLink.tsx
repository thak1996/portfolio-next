'use client';

import React from 'react';

export type NavLinkProps = {
  /** ID of the target element to scroll to */
  target: string;
  /** Content of the link/button */
  children: React.ReactNode;
  /** Optional CSS classes (preserves existing styling) */
  className?: string;
};

/**
 * Button that smoothly scrolls to a section without changing the URL hash.
 * Usage: <NavLink target="about" className="inline-block hover:no-underline">Sobre</NavLink>
 */
export const NavLink: React.FC<NavLinkProps> = ({ target, children, className }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
};
