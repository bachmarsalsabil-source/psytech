import React from 'react';
import { User, Calendar, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PatientCase } from '../../lib/clinic';
import { GlassCard } from './GlassCard';
import { GoldButton } from './GoldButton';

interface PatientCardProps {
  patientCase: PatientCase;
  onSendTask?: () => void;
  onSendMessage?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patientCase, onSendTask, onSendMessage }) => {
  const navigate = useNavigate();

  const statusColors = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    closed: "bg-psy-text/10 text-psy-text/40 border-psy-text/20",
    "on-hold": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="text-xl font-bold text-[#D4B483] font-mono">
          {patientCase.patientCode}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[patientCase.status]}`}>
          {patientCase.status === 'active' ? 'نشط' : patientCase.status}
        </span>
      </div>

      <div className="flex gap-4 text-xs text-psy-text/60">
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-[#D4B483]" />
          <span>{patientCase.ageGroup} سنة</span>
        </div>
        <div className="flex items-center gap-1">
          <User size={14} className="text-[#D4B483]" />
          <span>{patientCase.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-bold line-clamp-2 leading-relaxed">
          {patientCase.reasonForVisit}
        </h4>
        <div className="flex flex-wrap gap-1">
          {patientCase.currentSymptoms.slice(0, 3).map((s, i) => (
            <span key={i} className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] text-psy-text/40">
              {s}
            </span>
          ))}
          {patientCase.currentSymptoms.length > 3 && (
            <span className="text-[10px] text-psy-text/20">+{patientCase.currentSymptoms.length - 3}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[10px] text-psy-text/40">
        <div>
          <div>آخر جلسة</div>
          <div className="font-bold text-psy-text">{patientCase.lastSessionDate || 'لا يوجد'}</div>
        </div>
        <div>
          <div>إجمالي الجلسات</div>
          <div className="font-bold text-psy-text">{patientCase.totalSessions} جلسات</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <GoldButton 
          variant="primary" 
          size="sm" 
          onClick={() => navigate(`/clinic/patients/${patientCase.id}`)}
          className="w-full"
        >
          فتح الملف
        </GoldButton>
        <div className="grid grid-cols-2 gap-2">
          <GoldButton variant="secondary" size="sm" onClick={onSendTask}>
            <Plus size={14} /> مهمة
          </GoldButton>
          <GoldButton variant="secondary" size="sm" onClick={onSendMessage}>
            <MessageSquare size={14} /> رسالة
          </GoldButton>
        </div>
      </div>
    </GlassCard>
  );
};
