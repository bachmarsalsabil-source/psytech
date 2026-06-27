import React from 'react';

export const PageLoader: React.FC<{ label?: string }> = ({ label = 'جاري التحميل...' }) => (
  <div
    className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span
      className="w-10 h-10 border-2 border-psy-gold border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
    <p className="text-sm text-psy-text/50 font-bold">{label}</p>
  </div>
);
