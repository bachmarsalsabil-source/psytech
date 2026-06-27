import React, { memo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard = memo(function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl md:rounded-[28px] bg-psy-surface border border-psy-gold/15 p-5 md:p-6 relative overflow-hidden group',
        'shadow-md dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)]',
        'hover:border-psy-gold/30 hover:shadow-lg dark:hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all duration-300',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      <div
        className="absolute -inset-20 bg-psy-gold/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
});
