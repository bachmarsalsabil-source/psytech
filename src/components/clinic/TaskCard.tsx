import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, CheckCircle, FileUp, X, Info } from 'lucide-react';
import { TherapeuticTask, updateTask } from '../../lib/clinic';
import { GoldButton } from './GoldButton';
import { GlassCard } from './GlassCard';
import { useFeedback } from './FeedbackToast';

interface TaskCardProps {
  task: TherapeuticTask;
  onDetailClick?: (task: TherapeuticTask) => void;
  isPatient?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDetailClick, isPatient }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeColors = {
    behavioral: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cognitive: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    expressive: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    mindfulness: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    exposure: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const { showFeedback } = useFeedback();
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateTask(task.id, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      showFeedback(
        'تم إنجاز الواجب المترتب',
        `أحسنت صنعاً! لقد أتممت المهمة "${task.title}" بنجاح وثُبِّت التقرير بالملف لتقييمه من لدن الطبيب المعالج.`,
        'success'
      );
      setShowDialog(false);
      setIsSubmitting(false);
      window.location.reload(); // Refresh to show updated state
    }, 1000);
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4B483]/30 transition-all space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${typeColors[task.taskType]}`}>
              {task.taskType}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${statusColors[isOverdue ? 'overdue' : task.status]}`}>
              {isOverdue ? 'متأخر' : task.status === 'pending' ? 'نشط' : task.status === 'in-progress' ? 'قيد التنفيذ' : 'مكتمل'}
            </span>
          </div>
          <div className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-400 font-bold' : 'text-psy-text/40'}`}>
            <Calendar size={12} />
            <span>{task.dueDate}</span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-base">{task.title}</h4>
          <p className="text-xs text-psy-text/50 line-clamp-2 leading-relaxed">{task.description}</p>
        </div>

        <div className="flex justify-end pt-2">
          {isPatient ? (
            <GoldButton 
              variant={task.status === 'completed' ? "secondary" : "primary"} 
              size="sm" 
              onClick={() => setShowDialog(true)} 
              className="text-xs"
            >
              <span>{task.status === 'completed' ? 'عرض التقرير' : 'إنجاز المهمة'}</span>
              <ArrowLeft size={14} />
            </GoldButton>
          ) : (
            <GoldButton variant="ghost" size="sm" onClick={() => onDetailClick?.(task)} className="text-xs">
              <span>التفاصيل</span>
              <ArrowLeft size={14} />
            </GoldButton>
          )}
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#181816]/90 backdrop-blur-md animate-in fade-in duration-300">
           <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 relative space-y-8 shadow-[0_0_100px_rgba(212,180,131,0.2)]">
              <button onClick={() => setShowDialog(false)} className="absolute top-6 left-6 text-psy-text/40 hover:text-psy-text transition-colors">
                <X size={24} />
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#D4B483]">
                   <Info size={24} />
                   <h2 className="text-3xl font-black">{task.title}</h2>
                </div>
                <p className="text-psy-text/40 text-sm">أتمم هذه المهمة وشارك النتائج مع معالجك الخاص.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                   <h4 className="font-bold text-sm text-[#D4B483] underline decoration-wavy underline-offset-8 decoration-1">التعليمات:</h4>
                   <p className="text-sm leading-relaxed text-psy-text/80">{task.instructions || 'لا توجد تعليمات خاصة لهذه المهمة.'}</p>
                </div>

                {task.status !== 'completed' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-xs font-bold text-psy-text/40">اكتب ردك أو ملاحظاتك حول المهمة</label>
                       <textarea 
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="مثال: شعرت بالراحة بعد ممارسة التمارين..."
                          className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-[#D4B483] transition-all h-32 resize-none"
                       />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button className="flex-1 border-2 border-dashed border-white/10 rounded-2xl p-4 text-psy-text/40 hover:text-[#D4B483] hover:border-[#D4B483]/30 flex flex-col items-center justify-center gap-2 transition-all">
                          <FileUp size={24} />
                          <span className="text-[10px] font-bold">إرفاق صورة أو مستند</span>
                       </button>
                       <div className="flex-1 flex flex-col justify-center">
                          <GoldButton 
                            className="w-full h-full" 
                            size="lg" 
                            onClick={handleComplete}
                            disabled={isSubmitting}
                          >
                             {isSubmitting ? 'جاري الحفظ...' : <><CheckCircle size={20} /> تم الإنجاز</>}
                          </GoldButton>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-3xl space-y-4">
                     <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle size={32} />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-emerald-400">لقد أنجزت هذه المهمة!</h4>
                        <p className="text-xs text-psy-text/40 mt-2">تم إرسال التقرير للمعالج وسيتم مناقشته في الجلسة القادمة.</p>
                     </div>
                  </div>
                )}
              </div>
           </GlassCard>
        </div>
      )}
    </>
  );
};
