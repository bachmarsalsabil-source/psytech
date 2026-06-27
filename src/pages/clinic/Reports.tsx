import React from 'react';
import { FileText, Download, Activity, TrendingUp, Users } from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { getCases } from '../../lib/clinic';

export const ClinicReports: React.FC = () => {
  const cases = getCases();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">نظام التقارير السريرية</h1>
          <p className="text-psy-text/40">توليد تقارير شاملة ومقننة للحالات والمتابعة</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReportCard 
          icon={FileText} 
          title="تقرير جلسة مفرّد" 
          description="توليد تقرير تفصيلي لجلسة معينة يتضمن الملاحظات والواجبات والمؤشرات الحيوية."
          btnText="اختر الجلسة"
          color="border-blue-500/30 text-blue-400"
        />
        <ReportCard 
          icon={Activity} 
          title="تقرير الخطة العلاجية" 
          description="ملخص لمدى التقدم في مراحل الخطة العلاجية وما تم إنجازه من أهداف."
          btnText="اختر الحالة"
          color="border-[#D4B483]/30 text-[#D4B483]"
        />
        <ReportCard 
          icon={TrendingUp} 
          title="تقرير التقدم الدوري" 
          description="تحليل إحصائي ورسوم بيانية لتقلبات المزاج والأعراض على مدى فترة زمنية."
          btnText="توليد التحليل"
          color="border-emerald-500/30 text-emerald-400"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <GlassCard className="flex-1 p-8 space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <Download size={20} className="text-[#D4B483]" /> توليد تقرير شامل للحالة
          </h3>
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/40">اختر الحالة السريرية</label>
                <select className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]">
                   {cases.map(c => <option key={c.id} value={c.id}>{c.patientCode} - {c.reasonForVisit.slice(0, 40)}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/40">الفترة الزمنية</label>
                <div className="grid grid-cols-2 gap-4">
                   <input type="date" className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]" />
                   <input type="date" className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]" />
                </div>
             </div>
             <div className="pt-4">
                <GoldButton className="w-full" size="lg">توليد تقرير PDF شامل</GoldButton>
             </div>
          </div>
        </GlassCard>

        <div className="lg:w-80 space-y-6">
           <h3 className="font-bold">أحدث التقارير المولّدة</h3>
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 glass rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group">
                   <div className="p-3 rounded-xl bg-[#D4B483]/10 text-[#D4B483]">
                      <FileText size={18} />
                   </div>
                   <div className="flex-1 truncate">
                      <div className="text-xs font-bold truncate">تقرير تقدم X92J-K12L</div>
                      <div className="text-[10px] text-psy-text/40">2024/04/22 • 2.4 MB</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ icon: Icon, title, description, btnText, color }: any) => (
  <GlassCard className={`p-8 border-t-4 ${color} flex flex-col h-full`}>
    <div className="mb-6">
       <Icon size={40} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <p className="text-xs text-psy-text/40 leading-relaxed mb-8 flex-1">{description}</p>
    <GoldButton variant="secondary" className="w-full">{btnText}</GoldButton>
  </GlassCard>
);
