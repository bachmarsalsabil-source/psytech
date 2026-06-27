import React, { useState } from 'react';
import { Star, Share2, MessageSquare, Save } from 'lucide-react';
import { JournalEntry as JournalType, saveJournal } from '../../lib/clinic';
import { GoldButton } from './GoldButton';
import { GlassCard } from './GlassCard';

interface JournalEntryProps {
  entry: JournalType;
  isClinician?: boolean;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({ entry, isClinician }) => {
  const [showFull, setShowFull] = useState(false);
  const [comment, setComment] = useState(entry.clinicianComment || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveComment = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveJournal({ ...entry, clinicianComment: comment });
      setIsSaving(false);
    }, 500);
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] text-psy-text/40">{new Date(entry.createdAt).toLocaleDateString('ar-EG')}</div>
          <h4 className="font-bold text-lg">{entry.title}</h4>
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#D4B483]/10 text-[#D4B483] rounded-lg text-[10px] font-bold">
            {entry.entryType}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${entry.moodRating && i < entry.moodRating ? 'bg-[#D4B483]' : 'bg-white/10'}`} 
              />
            ))}
          </div>
          {entry.isSharedWithClinician && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Share2 size={10} />
              <span>مشتركة</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-psy-text/60 line-clamp-3 leading-relaxed mb-4">
        {entry.content}
      </p>

      {!showFull ? (
        <GoldButton variant="ghost" size="sm" onClick={() => setShowFull(true)} className="text-xs">
          عرض الكامل
        </GoldButton>
      ) : (
        <div className="space-y-6 pt-4 border-t border-white/5 animate-in slide-in-from-top duration-300">
          <div className="text-sm text-psy-text leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>

          {entry.drawingData && (
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img src={entry.drawingData} alt="Drawing" className="w-full h-auto" />
            </div>
          )}

          {entry.audioData && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <audio controls src={entry.audioData} className="w-full h-8" />
            </div>
          )}

          {entry.imageAttachments.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {entry.imageAttachments.map((img, i) => (
                <img key={i} src={img} className="rounded-xl border border-white/10 w-full" alt="" />
              ))}
            </div>
          )}

          {(entry.clinicianComment || isClinician) && (
            <div className="bg-[#D4B483]/5 border border-[#D4B483]/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#D4B483] font-bold text-sm">
                <MessageSquare size={16} />
                <span>تعليق المعالج</span>
              </div>
              
              {isClinician ? (
                <div className="space-y-3">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="أضف توجيهاتك هنا..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] h-24 resize-none"
                  />
                  <div className="flex justify-end">
                    <GoldButton variant="primary" size="sm" onClick={handleSaveComment} isLoading={isSaving}>
                      <Save size={14} /> حفظ التعليق
                    </GoldButton>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-psy-text/80 leading-relaxed italic border-r-2 border-[#D4B483]/30 pr-4">
                  {entry.clinicianComment}
                </p>
              )}
            </div>
          )}

          <GoldButton variant="ghost" size="sm" onClick={() => setShowFull(false)} className="text-xs">
            إخفاء
          </GoldButton>
        </div>
      )}
    </GlassCard>
  );
};
