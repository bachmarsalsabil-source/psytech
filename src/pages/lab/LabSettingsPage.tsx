import React, { useState } from 'react';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { GlassCard } from '../../components/clinic/GlassCard';
import { Settings, Shield, Bell, Database, Download, Upload, Trash2, ChevronLeft, Info } from 'lucide-react';
import { exportLabData, importLabData, initLabData } from '../../lib/lab';
import { toast } from 'react-hot-toast';

export const LabSettingsPage: React.FC = () => {
  const handleExport = () => {
    const data = exportLabData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psytech-lab-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('تم تصدير البيانات بنجاح');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const success = importLabData(event.target?.result as string);
          if (success) {
            toast.success('تم استيراد البيانات بنجاح، سيتم التحديث...');
            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast.error('ملف بيانات غير صالح');
          }
        } catch (err) {
          toast.error('حدث خطأ أثناء استيراد البيانات');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف كافة بيانات المختبر؟ لا يمكن التراجع عن هذه الخطوة.')) {
      localStorage.removeItem('psytech_lab_tests');
      localStorage.removeItem('psytech_lab_items');
      localStorage.removeItem('psytech_lab_sessions');
      localStorage.removeItem('psytech_lab_studies');
      initLabData();
      toast.success('تمت إعادة تعيين المختبر');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-700 pb-20" dir="rtl">
        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-psy-gold/15 flex items-center justify-center text-psy-gold">
              <Settings size={20} />
            </div>
            <span className="text-xs font-bold text-psy-gold/70 uppercase tracking-widest">الإعدادات والتكوين</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-gold">إعدادات المختبر الرقمي</h1>
          <p className="text-psy-text/40 font-medium max-w-xl">
            تخصيص بيئة البحث، إدارة الخصوصية، وتكوين تكاملات البيانات العلمية.
          </p>
        </div>

        {/* ── Settings Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Privacy & Security */}
          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/8">
              <div className="w-10 h-10 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-black text-psy-text">الخصوصية والأمان</h3>
                <p className="text-xs text-psy-text/30">حماية بيانات المشاركين والباحثين</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleSetting label="تشفير بيانات المشاركين" checked={true} />
              <ToggleSetting label="إخفاء الهوية تلقائياً" checked={true} />
              <ToggleSetting label="طلب موافقة أخلاقية لكل دراسة" checked={true} />
              <ToggleSetting label="تصدير التقارير بكلمة سر" checked={false} />
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/8">
              <div className="w-10 h-10 rounded-2xl bg-psy-gold/10 flex items-center justify-center text-psy-gold">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-black text-psy-text">إعدادات الإشعارات</h3>
                <p className="text-xs text-psy-text/30">تخصيص تنبيهات المختبر والدراسات</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleSetting label="إشعار عند وصول مستجيب جديد" checked={true} />
              <ToggleSetting label="تنبيه اكتمال العينة المستهدفة" checked={true} />
              <ToggleSetting label="تقارير أسبوعية بالبريد الإلكتروني" checked={false} />
              <ToggleSetting label="إشعارات المراجعة الأخلاقية" checked={true} />
            </div>
          </GlassCard>

          {/* Data Management */}
          <GlassCard className="p-8 space-y-6 md:col-span-2">
            <div className="flex items-center gap-3 pb-4 border-b border-white/8">
              <div className="w-10 h-10 rounded-2xl bg-psy-gold/10 flex items-center justify-center text-psy-gold">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-black text-psy-gold">إدارة البيانات والنسخ الاحتياطية</h3>
                <p className="text-xs text-psy-text/30">تصدير واستيراد بيانات المختبر بأمان</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Export */}
              <button
                onClick={handleExport}
                className="group flex flex-col items-center justify-center gap-3 p-6 bg-white/5 hover:bg-psy-gold/5 border border-white/8 hover:border-psy-gold/30 rounded-2xl transition-all text-center min-h-[120px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-psy-gold/10 flex items-center justify-center text-psy-gold transition-all">
                  <Download size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-psy-text group-hover:text-psy-gold transition-colors">تصدير نسخة احتياطية</div>
                  <div className="text-[10px] text-psy-text/30 mt-1">صيغة JSON</div>
                </div>
              </button>

              {/* Import */}
              <label className="group flex flex-col items-center justify-center gap-3 p-6 bg-white/5 hover:bg-psy-gold/5 border border-white/8 hover:border-psy-gold/30 rounded-2xl transition-all text-center cursor-pointer min-h-[120px]">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-psy-gold/10 flex items-center justify-center text-psy-gold transition-all">
                  <Upload size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-psy-text group-hover:text-psy-gold transition-colors">استيراد بيانات</div>
                  <div className="text-[10px] text-psy-text/30 mt-1">ملف JSON</div>
                </div>
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
              </label>

              {/* Reset / Danger */}
              <button
                onClick={handleReset}
                className="group flex flex-col items-center justify-center gap-3 p-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/30 rounded-2xl transition-all text-center min-h-[120px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 transition-all">
                  <Trash2 size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-red-500">مسح كافة البيانات</div>
                  <div className="text-[10px] text-red-500/40 mt-1">لا يمكن التراجع</div>
                </div>
              </button>
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-3 p-4 bg-psy-gold/5 border border-psy-gold/15 rounded-2xl">
              <Info size={16} className="text-psy-gold/60 shrink-0 mt-0.5" />
              <p className="text-xs text-psy-text/50 leading-relaxed">
                يُنصح بتصدير نسخة احتياطية دورية من بيانات المختبر لضمان سلامة البيانات البحثية وإمكانية استرجاعها عند الحاجة.
              </p>
            </div>
          </GlassCard>

        </div>
      </div>
    </>
  );
};

const ToggleSetting = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
    <span className="text-sm font-medium text-psy-text/60">{label}</span>
    <div
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        checked ? 'bg-psy-gold' : 'bg-white/10'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-psy-bg rounded-full shadow-sm transition-all duration-300 ${
          checked ? 'right-1' : 'right-7'
        }`}
      />
    </div>
  </div>
);
