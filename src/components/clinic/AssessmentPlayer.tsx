import React, { useState, useMemo } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { AssessmentAssignment, updateAssignment, getScales } from '../../lib/clinic';
import { GlassCard } from './GlassCard';
import { GoldButton } from './GoldButton';
import { useFeedback } from './FeedbackToast';

interface AssessmentPlayerProps {
  assignment: AssessmentAssignment;
  onComplete: (assignment: AssessmentAssignment) => void;
  onCancel: () => void;
}

export const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ assignment, onComplete, onCancel }) => {
  const { showFeedback } = useFeedback();
  const [step, setStep] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string, value: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = useMemo(() => {
    if (assignment.customScale?.questions) return assignment.customScale.questions;
    if (assignment.scaleId) {
      const scale = getScales().find(s => s.id === assignment.scaleId);
      if (scale) return scale.questions;
    }
    return [];
  }, [assignment]);
  
  const handleAnswer = (value: number) => {
    const qId = questions[currentIndex].id;
    const newAnswers = [...answers.filter(a => a.questionId !== qId), { questionId: qId, value }];
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const calculateScore = () => {
    return answers.reduce((sum, a) => sum + a.value, 0);
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const resultAssignment: AssessmentAssignment = {
      ...assignment,
      status: 'completed',
      completedAt: new Date().toISOString(),
      results: {
        score,
        answers: answers
      }
    };

    setTimeout(() => {
      updateAssignment(assignment.id, resultAssignment);
      showFeedback(
        'اكتمل التقييم بنجاح',
        `لقد أنهيت الإجابة بنجاح على مقياس "${assignment.title}". النتيجة المحرزة: ${score} من النقاط. تم التوثيق!`,
        'success'
      );
      setStep('completed');
      setIsSubmitting(false);
      onComplete(resultAssignment);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#181816]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <GlassCard className="w-full max-w-2xl p-10 space-y-12 relative overflow-hidden shadow-[0_0_100px_rgba(212,180,131,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4B483]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

        {step === 'intro' && (
          <div className="space-y-10 py-10">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-[#D4B483]/10 rounded-3xl flex items-center justify-center text-[#D4B483] mx-auto mb-6 rotate-3">
                 <ClipboardCheck size={48} />
              </div>
              <h2 className="text-4xl font-black">{assignment.title}</h2>
              <p className="text-psy-text/40 max-w-sm mx-auto leading-relaxed">يرجى قراءة التعليمات بعناية قبل البدء في الإجابة على البنود.</p>
            </div>

            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <h4 className="font-bold flex items-center gap-2 text-[#D4B483]">
                  <Info size={18} /> تعليمات هامة:
               </h4>
               <p className="text-sm leading-relaxed text-psy-text/60">
                 {assignment.instructions || 'لا توجد تعليمات خاصة. يرجى الإجابة عما تشعر به حالياً.'}
               </p>
               {assignment.condition && (
                 <div className="pt-2 flex items-center gap-2 text-xs font-bold text-yellow-400">
                    <AlertCircle size={14} />
                    <span>شرط الإنجاز: {assignment.condition}</span>
                 </div>
               )}
            </div>

            <div className="flex gap-4">
               <GoldButton className="flex-1 h-16" onClick={() => setStep('playing')}>ابدأ الآن</GoldButton>
               <GoldButton variant="secondary" className="px-10 h-16" onClick={onCancel}>لاحقاً</GoldButton>
            </div>
          </div>
        )}

        {step === 'playing' && (
          <div className="space-y-12 py-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-psy-text/40 uppercase tracking-widest">السؤال {currentIndex + 1} من {questions.length}</span>
              <div className="flex-1 max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden mx-4">
                 <div className="h-full bg-[#D4B483] transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <div className="min-h-[140px] flex items-center justify-center text-center">
               <h3 className="text-3xl md:text-4xl font-black leading-tight animate-in slide-in-from-right-4">
                  {questions[currentIndex]?.text}
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
               {[1, 2, 3, 4, 5].map((val) => (
                 <button
                   key={val}
                   onClick={() => handleAnswer(val)}
                   className={`
                     p-6 rounded-2xl border-2 transition-all font-bold text-lg
                     ${answers.find(a => a.questionId === questions[currentIndex].id)?.value === val 
                       ? 'bg-[#D4B483] border-[#D4B483] text-[#181816] shadow-[0_0_30px_rgba(212,180,131,0.3)]' 
                       : 'bg-white/5 border-white/5 hover:border-[#D4B483]/30 text-psy-text/60 hover:text-psy-text'}
                   `}
                 >
                   {val === 1 ? 'أبداً' : val === 5 ? 'دائماً' : val}
                 </button>
               ))}
            </div>

            <div className="flex justify-between pt-8 border-t border-white/5">
               <button 
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="flex items-center gap-2 text-xs font-bold text-psy-text/40 hover:text-psy-text disabled:opacity-0"
               >
                  <ArrowRight size={16} /> السابق
               </button>

               {currentIndex === questions.length - 1 ? (
                 <GoldButton onClick={handleFinish} disabled={answers.length < questions.length || isSubmitting}>
                   {isSubmitting ? 'جاري الحفظ...' : 'إنهاء وإرسال'}
                 </GoldButton>
               ) : (
                 <button 
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="flex items-center gap-2 text-xs font-bold text-[#D4B483] hover:underline"
                 >
                    التالي <ArrowLeft size={16} />
                 </button>
               )}
            </div>
          </div>
        )}

        {step === 'completed' && (
          <div className="space-y-10 py-12 text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
               <CheckCircle size={56} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black">شكراً لك!</h2>
              <p className="text-psy-text/40 text-lg leading-relaxed">لقد أكملت التقييم بنجاح. تم إرسال النتائج للأخصائي الخاص بك.</p>
            </div>
            <div className="pt-6">
              <GoldButton className="px-12 h-16" onClick={onCancel}>العودة للوحة التحكم</GoldButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

import { AlertCircle, ClipboardCheck } from 'lucide-react';
