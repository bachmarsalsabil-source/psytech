import React from 'react';
import { GlassCard } from '../clinic/GlassCard';
import { Layers, Clock, FileText, ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  name: string;
  description: string;
  category: string;
  itemCount: number;
  duration: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ name, description, category, itemCount, duration }) => {
  return (
    <GlassCard className="p-8 space-y-6 group hover:bg-psy-gold/5 transition-all">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-psy-text/40 group-hover:text-psy-gold group-hover:bg-psy-gold/10 transition-all">
          <Layers size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-psy-text/20 group-hover:text-psy-gold/50 transition-all">{category}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black transition-colors">{name}</h3>
        <p className="text-xs text-psy-text/40 leading-relaxed">{description}</p>
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-psy-text/40">
          <FileText size={14} />
          <span className="text-[10px] font-bold">{itemCount} بند</span>
        </div>
        <div className="flex items-center gap-2 text-psy-text/40">
          <Clock size={14} />
          <span className="text-[10px] font-bold">{duration}</span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-psy-text/60 group-hover:bg-psy-gold group-hover:text-psy-bg font-black text-xs transition-all shadow-lg">
        استخدام هذا القالب <ArrowRight size={16} />
      </button>
    </GlassCard>
  );
};
