import React from 'react';
import { Clock, Star, ArrowLeft } from 'lucide-react';
import { Session } from '../../lib/clinic';
import { GoldButton } from './GoldButton';

interface SessionTimelineProps {
  sessions: Session[];
  onDetailClick?: (session: Session) => void;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ sessions, onDetailClick }) => {
  return (
    <div className="relative space-y-8 pr-4">
      {/* Vertical line */}
      <div className="absolute top-0 right-7 bottom-0 w-0.5 bg-[#D4B483]/20" />

      {sessions.map((session, index) => (
        <div key={session.id} className="relative flex items-start gap-8 group">
          {/* Dot */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-[#181816] border-2 border-[#D4B483] flex items-center justify-center text-[#D4B483] font-bold shadow-[0_0_15px_rgba(212,180,131,0.1)] group-hover:scale-110 transition-transform">
            {session.sessionNumber}
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4B483]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg">جلسة رقم {session.sessionNumber}</h4>
                <div className="flex items-center gap-4 text-xs text-psy-text/40 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{session.durationMinutes} دقيقة</span>
                  </div>
                  <span>{new Date(session.sessionDate).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={12} 
                    className={session.moodRating && s <= session.moodRating ? "fill-[#D4B483] text-[#D4B483]" : "text-psy-text/20"} 
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-psy-text/60 line-clamp-2 mb-4 leading-relaxed">
              {session.notes}
            </p>

            <div className="flex justify-end">
              <GoldButton 
                variant="ghost" 
                size="sm" 
                onClick={() => onDetailClick?.(session)}
                className="text-xs"
              >
                <span>التفاصيل</span>
                <ArrowLeft size={14} />
              </GoldButton>
            </div>
          </div>
        </div>
      ))}

      {sessions.length === 0 && (
        <div className="text-center py-12 text-psy-text/40 italic">
          لم يتم تسجيل أي جلسات بعد
        </div>
      )}
    </div>
  );
};
