import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton } from './GoldButton';

export const BackButton: React.FC<{ homePath?: string }> = ({ homePath }) => {
  const navigate = useNavigate();

  return (
    <GoldButton 
      variant="ghost" 
      size="sm" 
      onClick={() => homePath ? navigate(homePath) : navigate(-1)}
      className="flex items-center gap-2"
    >
      <ArrowRight size={16} /> <span>عودة</span>
    </GoldButton>
  );
};
