import React, { useState } from 'react';
import { getTests, PsychTest } from '../../lib/lab';
import { GlassCard } from '../clinic/GlassCard';
import { GoldButton } from '../clinic/GoldButton';
import { Scale, Users, Plus, BarChart3, TrendingUp, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const NormManager: React.FC = () => {
  const tests = getTests().filter(t => t.status === 'published');
  const [selectedTestId, setSelectedTestId] = useState<string | null>(tests[0]?.id || null);

  const test = tests.find(t => t.id === selectedTestId);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-end bg-white/5 p-8 rounded-[40px] border border-white/10">
         <div className="space-y-2">
            <h1 className="text-3xl font-black text-psy-gold">إدارة معايير القياس (Norms)</h1>
            <p className="text-sm text-psy-text/40 font-medium">تعريف وتحديث معايير المقارنة المحلية والوطنية لاختباراتك.</p>
         </div>
         <div className="w-80 space-y-2">
            <label className="text-[10px] font-black text-psy-text/40 uppercase tracking-widest">اختر الاختبار</label>
            <select 
               value={selectedTestId || ''}
               onChange={(e) => setSelectedTestId(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-psy-gold appearance-none font-bold"
            >
               {tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-4">
               <h3 className="text-xl font-black">المعايير المسجلة ({test?.scales?.flatMap(s => s.norms).length || 0})</h3>
               <GoldButton size="sm"><Plus size={16} /> إضافة معيار جديد</GoldButton>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <NormCard 
                  title="المجتمع الجزائري (عينة وطنية 2024)" 
                  population="18-70 سنة (جميع الولايات)" 
                  n={5840} 
                  mean={152.8} 
                  sd={14.2} 
               />
               <NormCard 
                  title="القطاع المدرسي (شرق الجزائر)" 
                  population="12-18 سنة (قسنطينة، عنابة، سطيف)" 
                  n={1250} 
                  mean={132.5} 
                  sd={11.9} 
               />
               <NormCard 
                  title="الموظفون في الجنوب الكبير" 
                  population="25-55 سنة (ورقلة، حاسي مسعود)" 
                  n={820} 
                  mean={148.1} 
                  sd={13.5} 
               />
               <NormCard 
                  title="الطلبة الجامعيين (الغرب الجزائري)" 
                  population="18-24 سنة (وهران، تلمسان)" 
                  n={2100} 
                  mean={141.2} 
                  sd={12.8} 
               />
            </div>

            <GlassCard className="p-8 space-y-6">
               <h4 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> منحنى التوزيع المعياري المقترح</h4>
               <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={[{x:-3,y:10},{x:-2,y:30},{x:-1,y:80},{x:0,y:120},{x:1,y:80},{x:2,y:30},{x:3,y:10}]}>
                        <defs>
                           <linearGradient id="normGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4B483" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#D4B483" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="y" stroke="#D4B483" fillOpacity={1} fill="url(#normGradient)" strokeWidth={3} />
                        <XAxis dataKey="x" hide />
                        <YAxis hide />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex justify-around text-center pt-4 border-t border-white/5">
                  <div>
                     <div className="text-[10px] text-psy-text/40 uppercase">المتوسط (M)</div>
                     <div className="text-lg font-black">{test?.scales?.[0]?.norms?.[0]?.mean || '142.0'}</div>
                  </div>
                  <div>
                     <div className="text-[10px] text-psy-text/40 uppercase">الانحراف (SD)</div>
                     <div className="text-lg font-black">{test?.scales?.[0]?.norms?.[0]?.sd || '11.5'}</div>
                  </div>
                  <div>
                     <div className="text-[10px] text-psy-text/40 uppercase">خطأ القياس (SEM)</div>
                     <div className="text-lg font-black">2.4</div>
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="space-y-6">
            <GlassCard className="p-8 space-y-6 bg-psy-gold/5 border-psy-gold/20">
               <div className="space-y-4">
                  <div className="w-12 h-12 bg-psy-gold/20 rounded-2xl flex items-center justify-center text-psy-gold">
                     <Info size={24} />
                  </div>
                  <h3 className="text-xl font-black">لماذا المعايير؟</h3>
                  <p className="text-sm text-psy-text/60 leading-relaxed">
                     المعايير تسمح بتحويل الدرجات الخام إلى درجات معيارية (Z-scores / T-scores) مما يتيح مقارنة أداء الفرد بأداء المجتمع المرجعي المشابه له.
                  </p>
               </div>
            </GlassCard>
            
            <GlassCard className="p-8 space-y-4">
               <h4 className="font-bold text-sm uppercase tracking-widest text-psy-text/40">تحديث تلقائي</h4>
               <p className="text-[10px] text-psy-text/60 italic leading-relaxed">
                  يمكنك تفعيل التحديث التلقائي للمعايير بناءً على البيانات المُجمعة حديثاً في دراساتك النشطة.
               </p>
               <GoldButton variant="secondary" className="w-full">تفعيل المزامنة</GoldButton>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

const NormCard = ({ title, population, n, mean, sd }: any) => (
  <GlassCard className="p-6 space-y-4 hover:border-psy-gold/50 transition-all cursor-pointer">
     <div className="flex justify-between items-start">
        <h4 className="font-bold">{title}</h4>
        <span className="text-[10px] bg-psy-gold/10 text-psy-gold px-2 py-0.5 rounded-lg font-bold">نشط</span>
     </div>
     <div className="space-y-3">
        <div className="flex justify-between text-xs">
           <span className="text-psy-text/40">المجتمع:</span>
           <span className="font-bold">{population}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
           <div>
              <div className="text-[8px] text-psy-text/40 uppercase">N</div>
              <div className="text-xs font-black">{n}</div>
           </div>
           <div>
              <div className="text-[8px] text-psy-text/40 uppercase">M</div>
              <div className="text-xs font-black">{mean}</div>
           </div>
           <div>
              <div className="text-[8px] text-psy-text/40 uppercase">SD</div>
              <div className="text-xs font-black">{sd}</div>
           </div>
        </div>
     </div>
  </GlassCard>
);
