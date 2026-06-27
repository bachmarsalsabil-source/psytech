import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, User, Clock, Layers } from 'lucide-react';
import { getSessions, getCases, Session } from '../../lib/clinic';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { GlassCard } from '../../components/clinic/GlassCard';

export const GlobalSessionsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const allSessions = getSessions();
  const cases = getCases();

  const filteredSessions = useMemo(() => {
    return allSessions.filter(s => {
      const patientCase = cases.find(c => c.id === s.caseId);
      return (
        (patientCase?.patientCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }).sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
  }, [allSessions, searchTerm, cases]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">

      {/* ── Hero Header ── */}
      <div className="relative min-h-[180px] md:h-56 rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col justify-between p-6 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(212,180,131,0.18) 0%, rgba(212,180,131,0.04) 60%, transparent 100%)' }}>
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border border-psy-gold/10 pointer-events-none" />
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full border border-psy-gold/10 pointer-events-none" />

        <BackButton />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-text leading-tight">
              الجلسات العلاجية
            </h1>
            <p className="text-psy-text/40 mt-1 text-sm md:text-base">
              إجمالي {allSessions.length} جلسة علاجية في كافة الحالات
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl text-sm font-bold text-psy-gold">
              <Layers size={15} />
              <span>{allSessions.length} جلسة</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl text-sm font-bold text-psy-text/60">
              <User size={15} />
              <span>{cases.length} حالة</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/30 pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="بحث بكود الحالة أو ملاحظات الجلسة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pr-12 pl-4 text-sm outline-none focus:border-psy-gold/60 transition-all placeholder:text-psy-text/30"
          />
        </div>
        <GoldButton variant="secondary" className="h-12 px-6 gap-2 shrink-0">
          <Filter size={16} /> تصفية التاريخ
        </GoldButton>
      </div>

      {/* ── Sessions Grid ── */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((s) => {
            const patientCase = cases.find(c => c.id === s.caseId);
            const moodStars = Math.round((s.moodRating / 10) * 5);
            return (
              <GlassCard
                key={s.id}
                className="p-6 md:p-8 rounded-2xl md:rounded-[32px] flex flex-col gap-4 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-psy-gold/10 flex items-center justify-center text-psy-gold shrink-0">
                      <User size={16} />
                    </div>
                    <span className="font-black text-psy-gold font-mono text-sm">
                      {patientCase?.patientCode || 'مجهول'}
                    </span>
                  </div>
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-xl bg-white/5 font-black text-xs border border-white/10">
                    #{s.sessionNumber}
                  </span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between text-xs text-psy-text/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-psy-gold/60" />
                    <span>{new Date(s.sessionDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-psy-gold/10 text-psy-gold font-bold">
                    <Clock size={11} />
                    {s.durationMinutes} دقيقة
                  </span>
                </div>

                {s.notes && (
                  <p className="text-xs text-psy-text/40 leading-relaxed line-clamp-2">
                    {s.notes}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          moodStars >= star ? 'bg-psy-gold' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <GoldButton variant="ghost" size="sm" className="text-xs h-8 px-4">
                    التفاصيل
                  </GoldButton>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-16 rounded-2xl md:rounded-[32px] flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-psy-gold/10 flex items-center justify-center text-psy-gold/40">
            <Search size={28} strokeWidth={1.5} />
          </div>
          <p className="text-psy-text/30 text-sm italic">لا توجد جلسات مطابقة للبحث</p>
        </GlassCard>
      )}
    </div>
  );
};
