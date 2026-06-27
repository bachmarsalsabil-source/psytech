import React, { useState } from 'react';
import { StudyDesign, createStudy, getTests } from '../../lib/lab';
import { GlassCard } from '../clinic/GlassCard';
import { GoldButton } from '../clinic/GoldButton';
import { 
  FlaskConical, 
  Target, 
  Users, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'design', label: 'التصميم المنهجي', icon: FlaskConical },
  { id: 'variables', label: 'المتغيرات والفرضيات', icon: Target },
  { id: 'sampling', label: 'العينة والمشاركين', icon: Users },
  { id: 'tools', label: 'أدوات القياس', icon: FileText },
  { id: 'ethics', label: 'الأخلاقيات والموافقة', icon: ShieldCheck },
];

import { toast } from 'react-hot-toast';

interface StudyBuilderProps {
  onComplete?: () => void;
}

export const StudyBuilder: React.FC<StudyBuilderProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [study, setStudy] = useState<StudyDesign>({
    id: `study-${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    description: '',
    researcherId: 'res-701',
    status: 'planning',
    startDate: new Date().toISOString(),
    participants: [],
    testIds: [],
    variables: {
      independent: [],
      dependent: [],
      control: [],
      confounding: []
    }
  });

  const tests = getTests().filter(t => t.status === 'published');

  const handleCreate = () => {
    if (!study.title) {
      toast.error('يرجى إدخال عنوان الدراسة');
      setCurrentStep(0);
      return;
    }
    createStudy(study as any);
    toast.success('تم إنشاء الدراسة البحثية بنجاح');
    if (onComplete) onComplete();
    else navigate('/lab/studies');
  };


  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4">
         <div className="w-20 h-20 bg-psy-gold/10 rounded-[30px] flex items-center justify-center mx-auto text-psy-gold">
            <FlaskConical size={40} />
         </div>
         <h1 className="text-4xl font-black">تصميم دراسة بحثية جديدة</h1>
         <p className="text-psy-text/40 max-w-xl mx-auto">قم ببناء الإطار المنهجي لدراستك وربط أدوات القياس الرقمية لجمع البيانات وإجراء التحليلات الإحصائية المتقدمة.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center gap-4 px-8 overflow-x-auto pb-4 hide-scrollbar">
         {STEPS.map((step, idx) => (
            <button 
               key={step.id} 
               onClick={() => setCurrentStep(idx)}
               className={`
                  flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap
                  ${currentStep === idx ? 'bg-psy-gold text-psy-bg border-psy-gold font-black' : 'bg-white/5 border-white/5 text-psy-text/40 font-bold'}
               `}
            >
               <step.icon size={18} />
               <span className="text-sm">{step.label}</span>
            </button>
         ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
               <GlassCard className="p-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-xs font-black text-psy-gold uppercase tracking-widest">عنوان الدراسة</label>
                       <input 
                          type="text" 
                          value={study.title}
                          onChange={(e) => setStudy({...study, title: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold text-lg font-bold"
                          placeholder="مثلاً: تأثير التدخل المعرفي الرقمي..."
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-black text-psy-gold uppercase tracking-widest">موضوع البحث (Research Topic)</label>
                       <input 
                          type="text" 
                          value={(study as any).researchTopic || ''}
                          onChange={(e) => setStudy({...study, researchTopic: e.target.value} as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold text-lg font-bold"
                          placeholder="تحديد موضوع البحث بدقة..."
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-black text-psy-text/40 uppercase tracking-widest">هدف البحث (Research Goal)</label>
                     <textarea 
                        value={(study as any).researchGoal || ''}
                        onChange={(e) => setStudy({...study, researchGoal: e.target.value} as any)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold h-20 resize-none font-medium"
                        placeholder="ما الذي تسعى للوصول إليه من خلال هذا البحث؟"
                     />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-xs font-black text-psy-text/40 uppercase tracking-widest">المفهوم السيكومتري (Psychometric Concept)</label>
                       <input 
                          type="text" 
                          value={(study as any).psychometricConcept || ''}
                          onChange={(e) => setStudy({...study, psychometricConcept: e.target.value} as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold font-medium"
                          placeholder="مثلاً: قلق الاختبار، الذكاء العاطفي..."
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-black text-psy-text/40 uppercase tracking-widest">وصف العينة (Sample Description)</label>
                       <input 
                          type="text" 
                          value={(study as any).sampleDescription || ''}
                          onChange={(e) => setStudy({...study, sampleDescription: e.target.value} as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold font-medium"
                          placeholder="مثلاً: طلبة جامعة الجزائر (18-25 سنة)..."
                       />
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-black text-psy-text/40 uppercase tracking-widest">نوع الدراسة والمنهجية</label>
                     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {['تجريبية', 'ارتباطية', 'وصفية', 'طولية', 'جامعة منيسوتا'].map(type => (
                           <button 
                            key={type} 
                            onClick={() => setStudy({...study, methodology: type === 'جامعة منيسوتا' ? 'minnesota' : type} as any)}
                            className={`p-4 rounded-xl border transition-all text-xs font-bold ${(study as any).methodology === type || ((study as any).methodology === 'minnesota' && type === 'جامعة منيسوتا') ? 'bg-psy-gold border-psy-gold text-psy-bg' : 'border-white/5 bg-white/5 hover:border-psy-gold/50'}`}
                           >
                            {type}
                           </button>
                        ))}
                     </div>
                  </div>
               </GlassCard>
            )}

            {currentStep === 1 && (
               <div className="grid md:grid-cols-2 gap-8">
                  <VariableSection title="المتغيرات المستقلة (IV)" icon={<Plus size={16} />} color="blue" />
                  <VariableSection title="المتغيرات التابعة (DV)" icon={<Plus size={16} />} color="emerald" />
                  <VariableSection title="المتغيرات الضابطة" icon={<Plus size={16} />} color="orange" />
                  <VariableSection title="المتغيرات العشوائية" icon={<Plus size={16} />} color="red" />
               </div>
            )}

            {currentStep === 3 && (
               <GlassCard className="p-10 space-y-8">
                  <h3 className="text-xl font-black">اختيار أدوات القياس</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                     {tests.map(test => (
                        <button 
                           key={test.id}
                           onClick={() => {
                              const testIds = [...study.testIds];
                              if (testIds.includes(test.id)) {
                                 setStudy({...study, testIds: testIds.filter(id => id !== test.id)});
                              } else {
                                 setStudy({...study, testIds: [...testIds, test.id]});
                              }
                           }}
                           className={`
                              p-6 rounded-3xl border text-right transition-all flex justify-between items-center
                              ${study.testIds.includes(test.id) ? 'bg-psy-gold/10 border-psy-gold text-psy-gold' : 'bg-white/5 border-white/5 text-psy-text/60'}
                           `}
                        >
                           <div>
                              <div className="font-bold">{test.title}</div>
                              <div className="text-[10px] opacity-60">{test.items.length} بند • {test.category}</div>
                           </div>
                           {study.testIds.includes(test.id) && <CheckCircle2 size={24} />}
                        </button>
                     ))}
                  </div>
               </GlassCard>
            )}

            {currentStep === 4 && (
               <div className="max-w-2xl mx-auto space-y-8">
                  <GlassCard className="p-10 space-y-6 text-center">
                     <ShieldCheck size={48} className="mx-auto text-psy-gold" />
                     <h3 className="text-2xl font-black">الموافقة الأخلاقية</h3>
                     <p className="text-sm text-psy-text/40 leading-relaxed italic">
                        يرجى التأكد من الحصول على الموافقات اللازمة من لجان أخلاقيات البحث (IRB) قبل البدء في جمع البيانات.
                     </p>
                     <div className="pt-6">
                        <GoldButton className="w-full h-16 text-lg" onClick={handleCreate}>
                           تأكيد وإنشاء الدراسة
                        </GoldButton>
                     </div>
                  </GlassCard>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center pt-8">
         <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center gap-2 font-bold text-psy-text/40 hover:text-psy-gold transition-colors disabled:opacity-0"
         >
            <ChevronRight size={20} /> الخطوة السابقة
         </button>
         <div className="flex gap-1">
            {STEPS.map((_, idx) => (
               <div key={idx} className={`w-2 h-2 rounded-full transition-all ${currentStep === idx ? 'bg-psy-gold w-6' : 'bg-white/10'}`} />
            ))}
         </div>
         <button 
            disabled={currentStep === STEPS.length - 1}
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="flex items-center gap-2 font-bold text-psy-gold hover:underline disabled:opacity-0"
         >
            الخطوة التالية <ChevronLeft size={20} />
         </button>
      </div>
    </div>
  );
};

const VariableSection = ({ title, icon, color }: any) => (
   <GlassCard className={`p-6 border-t-4 ${color === 'blue' ? 'border-blue-500' : color === 'emerald' ? 'border-emerald-500' : 'border-psy-gold/30'}`}>
      <div className="flex justify-between items-center mb-6">
         <h4 className="font-bold text-sm">{title}</h4>
         <button className="p-2 bg-white/5 rounded-lg text-psy-text/40 hover:text-psy-gold">{icon}</button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[40px]">
         <span className="text-[10px] text-psy-text/30 italic">لا توجد متغيرات حالياً...</span>
      </div>
   </GlassCard>
);
