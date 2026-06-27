import React from 'react';
import { StudyDesign } from '../../lib/lab';
import { GlassCard } from '../clinic/GlassCard';
import { FlaskConical, Users, Calendar, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudyCardProps {
  study: StudyDesign;
}

export const StudyCard: React.FC<StudyCardProps> = ({ study }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'planning': return 'text-psy-gold bg-psy-gold/10 border-psy-gold/20';
      case 'completed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-psy-text/40 bg-white/5 border-white/10';
    }
  };

  return (
    <GlassCard className="p-8 space-y-6 group border-l-4 border-psy-gold/50">
      <div className="flex justify-between items-start">
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(study.status)}`}>
          {study.status === 'active' ? 'نشطة حالياً' : study.status === 'planning' ? 'في مرحلة التخطيط' : 'دراسة مكتملة'}
        </div>
        <div className="text-[10px] text-psy-text/40 font-bold flex items-center gap-2">
           <Calendar size={12} /> {new Date(study.startDate || '').getFullYear() || '2024'}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black leading-tight group-hover:text-psy-gold transition-colors">{study.title}</h3>
        <p className="text-xs text-psy-text/40 font-medium">الباحث الرئيسي: {study.researcherId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users size={16} />
           </div>
           <div>
              <div className="text-sm font-black">{study.participants?.length || 0}</div>
              <div className="text-[9px] text-psy-text/40 uppercase">عينة الدراسة</div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BarChart3 size={16} />
           </div>
           <div>
              <div className="text-sm font-black">{study.testIds?.length || 0}</div>
              <div className="text-[9px] text-psy-text/40 uppercase">أدوات القياس</div>
           </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
         <Link 
            to={`/lab/study/${study.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-psy-gold text-psy-bg text-xs font-black hover:opacity-90 transition-all shadow-lg shadow-psy-gold/10"
         >
            إدارة الدراسة <ArrowRight size={16} />
         </Link>
         <button className="px-4 py-3 rounded-2xl bg-white/5 text-psy-text/60 hover:bg-white/10 transition-all font-bold text-xs">
            تقرير
         </button>
      </div>
    </GlassCard>
  );
};
