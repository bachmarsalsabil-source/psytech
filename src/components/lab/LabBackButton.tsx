import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LabBackButtonProps {
  to?: string;
  label?: string;
}

export const LabBackButton: React.FC<LabBackButtonProps> = ({ to, label = 'عودة' }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-2 text-psy-gold hover:text-psy-gold/80 transition-all font-bold text-sm mb-4 group"
    >
      <div className="p-1 rounded-lg bg-psy-gold/10 group-hover:bg-psy-gold group-hover:text-psy-bg transition-all">
        <ChevronRight size={16} />
      </div>
      <span>{label}</span>
    </button>
  );
};
