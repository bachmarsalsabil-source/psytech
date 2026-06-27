import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Cloud, 
  Clock, 
  Trash2, 
  FileText,
  Save,
  Plus
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { getCurrentUser } from '../../lib/clinic';

export const ClinicSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = getCurrentUser();

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'templates', label: 'القوالب العلاجية', icon: FileText },
    { id: 'schedule', label: 'ساعات العمل', icon: Clock },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'backup', label: 'النسخ والاحتياط', icon: Cloud },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">إعدادات المنصة</h1>
          <p className="text-psy-text/40">تخصيص العيادة الرقمية حسب أسلوب عملك</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full p-4 flex items-center gap-4 rounded-2xl font-bold transition-all
                ${activeTab === tab.id ? 'bg-[#D4B483] text-[#181816]' : 'text-psy-text/40 hover:bg-white/5 hover:text-psy-text'}
              `}
            >
              <tab.icon size={18} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'templates' && <TemplatesSettings />}
          {activeTab === 'schedule' && <ScheduleSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'backup' && <BackupSettings />}
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = ({ user }: any) => (
  <GlassCard className="p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-400">
    <div className="flex items-center gap-6">
       <div className="w-24 h-24 rounded-3xl bg-[#D4B483]/10 flex items-center justify-center text-[#D4B483] border-2 border-dashed border-[#D4B483]/30">
          <User size={40} />
       </div>
       <div className="space-y-2">
          <h3 className="text-xl font-bold">{user?.fullName}</h3>
          <p className="text-xs text-psy-text/40">{user?.specialization}</p>
          <GoldButton size="sm" variant="secondary">تغيير الصورة</GoldButton>
       </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
       <div className="space-y-2">
          <label className="text-xs font-bold text-psy-text/40">الاسم الكامل</label>
          <input defaultValue={user?.fullName} className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]" />
       </div>
       <div className="space-y-2">
          <label className="text-xs font-bold text-psy-text/40">البريد الإلكتروني</label>
          <input defaultValue={user?.email} className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]" />
       </div>
       <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-psy-text/40">التخصص / الكفاءة</label>
          <input defaultValue={user?.specialization} className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]" />
       </div>
    </div>

    <div className="pt-6 border-t border-white/5 flex gap-4">
       <GoldButton icon={<Save size={18} />}>حفظ التغييرات</GoldButton>
       <GoldButton variant="secondary">إعادة تعيين</GoldButton>
    </div>
  </GlassCard>
);

const TemplatesSettings = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-400">
     <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">قوالب الجلسات والمهام</h3>
        <GoldButton size="sm"><Plus size={16} /> إضافة قالب</GoldButton>
     </div>
     <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: 'قالب جلسة تقييم أولية', type: 'جلسة', items: 12 },
          { title: 'برنامج علاج الرهاب الاجتماعي', type: 'خطة', items: 8 },
          { title: 'تمرين السجل اليومي للأفكار', type: 'مهمة', items: 5 },
          { title: 'خطة التدخل في الأزمات', type: 'خطة', items: 15 },
        ].map((t, i) => (
           <GlassCard key={i} className="p-6 group hover:border-[#D4B483]/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold text-[#D4B483] px-2 py-0.5 bg-[#D4B483]/10 rounded-lg">{t.type}</span>
              </div>
              <h4 className="font-bold group-hover:text-[#D4B483] transition-colors">{t.title}</h4>
              <p className="text-[10px] text-psy-text/40 mt-1">{t.items} عنصراً / قسماً</p>
           </GlassCard>
        ))}
     </div>
  </div>
);

const ScheduleSettings = () => (
  <GlassCard className="p-8 space-y-6 animate-in fade-in slide-in-from-left-4 duration-400">
     <h3 className="text-xl font-bold">تحديد ساعات العمل الرسمية</h3>
     <div className="space-y-4">
        {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
          <div key={day} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
             <div className="font-bold w-24">{day}</div>
             <div className="flex items-center gap-4">
                <input type="time" defaultValue="09:00" className="bg-[#181816] rounded-lg px-2 py-1 text-xs border border-white/10" />
                <span className="text-psy-text/40">إلى</span>
                <input type="time" defaultValue="17:00" className="bg-[#181816] rounded-lg px-2 py-1 text-xs border border-white/10" />
             </div>
             <div className="flex items-center gap-2">
                <label className="text-[10px] text-psy-text/40">متاح</label>
                <input type="checkbox" defaultChecked={day !== 'الجمعة'} className="accent-[#D4B483]" />
             </div>
          </div>
        ))}
     </div>
  </GlassCard>
);

const NotificationSettings = () => (
  <GlassCard className="p-8 space-y-6 animate-in fade-in slide-in-from-left-4 duration-400">
     <h3 className="text-xl font-bold">تنبيهات النظام</h3>
     <div className="space-y-4">
        {[
          'إرسال بريد إلكتروني عند انتهاء مريض من مهمة',
          'تنبيه عند استلام رسالة جديدة من مريض',
          'تنبيهات المتصفح لجلسات اليوم قبل البدء بـ 15 دقيقة',
          'تحديثات المقاييس والاختبارات الأسبوعية'
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
             <span className="text-sm">{item}</span>
             <input type="checkbox" defaultChecked={true} className="w-10 h-10 accent-[#D4B483]" />
          </div>
        ))}
     </div>
  </GlassCard>
);

const BackupSettings = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-400">
     <GlassCard className="p-8 space-y-4">
        <h3 className="text-xl font-bold">تصدير البيانات</h3>
        <p className="text-sm text-psy-text/40">يمكنك تحميل نسخة كاملة من بيانات عيادتك بصيغة JSON أو CSV للأرشفة الخارجية.</p>
        <div className="flex gap-4">
           <GoldButton variant="secondary">تصدير كـ JSON</GoldButton>
           <GoldButton variant="secondary">تصدير كـ CSV</GoldButton>
        </div>
     </GlassCard>

     <GlassCard className="p-8 space-y-4 border-red-500/20">
        <h3 className="text-xl font-bold text-red-400">منطقة الخطر</h3>
        <p className="text-sm text-psy-text/40">مسح كافة البيانات السحابية والمحلية. يرجى الحذر، هذا الإجراء لا يمكن التراجع عنه.</p>
        <button onClick={() => {}} className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all">
           <Trash2 size={18} /> مسح جميع البيانات
        </button>
     </GlassCard>
  </div>
);
