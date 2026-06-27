import React, { memo } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  priority?: boolean;
}

export const Logo = memo(function Logo({
  size = 48,
  className = '',
  showText = false,
  priority = false,
}: LogoProps) {
  const adjustedSize = size * 1.35;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group shrink-0" style={{ width: adjustedSize, height: adjustedSize }}>
        <div
          className="absolute inset-[-8px] bg-gradient-to-tr from-[#D4AF37]/25 via-[#7C3AED]/25 to-[#D4AF37]/25 blur-[16px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />
        <img
          src="/assets/logo-main.jpg"
          alt="PsyTech Logo"
          width={Math.round(adjustedSize)}
          height={Math.round(adjustedSize)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="w-full h-full object-cover rounded-full luxury-logo-border relative z-10 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <span className="text-2xl font-serif font-black tracking-tight gold-text-gradient">psyTech</span>
          <span className="text-[9px] text-psy-text/55 tracking-[0.2em] uppercase font-bold mt-0.5">
            المنصة الرقمية النفسية
          </span>
        </div>
      )}
    </div>
  );
});
