import React from 'react';
import { PatientSidebar } from './PatientSidebar';

export const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen h-screen bg-psy-bg flex flex-col lg:flex-row text-psy-text overflow-hidden" dir="rtl">
      <PatientSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden w-full min-w-0 pb-safe lg:pb-8">
        <div className="w-full max-w-none space-y-6 md:space-y-8 animate-in fade-in duration-500 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
};
