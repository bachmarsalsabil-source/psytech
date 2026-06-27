import React from 'react';
import { PsychTest } from '../../lib/lab';
import { GlassCard } from '../clinic/GlassCard';
import { Eye, Edit3, BarChart3, Send, Clock, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestCardProps {
  test: PsychTest;
  onPublish?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, onPublish, onPreview }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'draft': return 'bg-psy-gold/10 text-psy-gold border-psy-gold/20';
      case 'archived': return 'bg-white/5 text-psy-text/30 border-white/10';
      default: return 'bg-white/5 text-psy-text/40';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      clinical: 'إكلينيكي',
      educational: 'تربوي',
      organizational: 'مهني',
      personality: 'شخصية',
      research: 'بحثي'
    };
    return map[cat] || cat;
  };

  return (
    <GlassCard className="p-6 space-y-6 group hover:border-psy-gold/30 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(test.status)}`}>
              {test.status === 'published' ? 'منشور' : test.status === 'draft' ? 'مسودة' : 'مؤرشف'}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              {getCategoryLabel(test.category)}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-tight group-hover:text-psy-gold transition-colors">{test.title}</h3>
          <p className="text-xs text-psy-text/40 line-clamp-2">{test.description}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
        <div className="flex items-center gap-2 text-psy-text/40">
          <Layers size={14} />
          <span className="text-[10px] font-bold">{test.items.length} بند</span>
        </div>
        <div className="flex items-center gap-2 text-psy-text/40">
          <Clock size={14} />
          <span className="text-[10px] font-bold">~15 دقيقة</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => onPreview?.(test.id)}
          className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 text-psy-text/60 hover:bg-white/10 hover:text-psy-gold transition-all text-[10px] font-bold"
        >
          <Eye size={14} /> معاينة
        </button>
        
        {test.status === 'draft' ? (
          <>
            {/* <Link 
              to={`/lab/builder?id=${test.id}`}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 text-psy-text/60 hover:bg-white/10 hover:text-psy-gold transition-all text-[10px] font-bold"
            >
              <Edit3 size={14} /> تحرير
            </Link> */}
            <button 
              onClick={() => onPublish?.(test.id)}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-psy-gold text-psy-bg hover:opacity-90 transition-all text-[10px] font-black"
            >
              <Send size={14} /> نشر الاختبار
            </button>
          </>
        ) : (
          <Link 
            to={`/lab/analysis?id=${test.id}`}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 text-psy-text/60 hover:bg-white/10 hover:text-psy-gold transition-all text-[10px] font-bold"
          >
            <BarChart3 size={14} /> تحليل سيكومتري
          </Link>
        )}
      </div>
    </GlassCard>
  );
};
