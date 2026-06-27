import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getTasks, 
  getJournals, 
  getMessages, 
  getAppointments,
  PatientCase,
  getCases
} from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { TaskCard } from '../../components/clinic/TaskCard';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);
  
  const tasks = getTasks(patientCase?.id).filter(t => t.status !== 'completed');
  const journals = getJournals(patientCase?.id);
  const appointments = getAppointments().filter(a => a.caseId === patientCase?.id);
  
  const quickActions = [
    { 
      label: 'بدء تدوين جديد', 
      description: 'سجل مشاعرك وأفكارك اليوم',
      icon: Plus, 
      to: '/patient/journal/new',
      color: 'hover:border-psy-gold/50',
      iconBg: 'bg-psy-gold/10',
      iconColor: 'text-psy-gold'
    },
    { 
      label: 'مراجعة مهامي', 
      description: `لديك ${tasks.length} مهام بانتظارك`,
      icon: ClipboardCheck, 
      to: '/patient/tasks',
      color: 'hover:border-orange-500/50',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    { 
      label: 'حجز جلسة', 
      description: 'موعد جديد مع الأخصائي',
      icon: Calendar, 
      to: '/patient/appointments',
      color: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    { 
      label: 'مركز الرسائل', 
      description: 'تواصل مع فريقك العلاجي',
      icon: MessageSquare, 
      to: '/patient/messages',
      color: 'hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    },
  ];

  // Fake messages count
  const unreadMessages = 2;

  const quickStats = [
    { label: 'المهام القائمة', value: tasks.length, icon: ClipboardCheck, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'يوميات هذا الشهر', value: journals.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'رسائل جديدة', value: unreadMessages, icon: MessageSquare, color: 'text-[#D4B483]', bg: 'bg-[#D4B483]/10' },
    { label: 'الموعد القادم', value: appointments.length > 0 ? appointments[0].time : 'لا يوجد', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="relative h-auto py-8 md:h-64 md:py-0 rounded-[40px] overflow-hidden border border-white/5 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 group bg-psy-bg shadow-2xl gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-psy-bg via-psy-bg/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200" 
          alt="Patient Welcome Banner" 
          className="absolute left-0 top-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[3000ms]" 
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 space-y-4 text-right">
           <h1 className="text-3xl md:text-5xl font-serif font-black text-psy-text tracking-tighter">مرحباً بك مجدداً</h1>
           <div className="flex items-center gap-4">
              <span className="text-psy-text/40 text-xs font-bold uppercase tracking-[0.2em]">كود الحالة:</span>
              <span className="px-6 py-1.5 bg-[#D4B483]/20 text-[#D4B483] font-black font-mono rounded-full border border-[#D4B483]/30 tracking-widest text-base shadow-xl backdrop-blur-md">
                {user?.patientCode}
              </span>
           </div>
        </div>

        <GoldButton size="lg" className="relative z-20 shadow-2xl hover:shadow-[#D4B483]/20 transition-all font-black text-base md:text-xl py-4 px-6 md:py-8 md:px-12 rounded-2xl w-full md:w-auto" onClick={() => navigate('/patient/journal/new')}>
           <Plus size={28} /> كتابة يومية جديدة
        </GoldButton>
      </div>

      {/* Quick Actions Menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.to)}
            className={`flex flex-col items-start p-4 bg-psy-surface border border-white/5 rounded-3xl transition-all group ${action.color} text-right`}
          >
            <div className={`w-10 h-10 rounded-2xl ${action.iconBg} ${action.iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <div className="font-bold text-sm mb-1">{action.label}</div>
            <div className="text-[10px] text-psy-text/40">{action.description}</div>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, i) => (
          <GlassCard key={i} className="p-6 group hover:border-[#D4B483]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
               <div className="text-3xl font-black mb-1">{stat.value}</div>
               <div className="text-xs text-psy-text/40 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Pending Tasks */}
        <div className="lg:col-span-3 space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 <ClipboardCheck className="text-psy-gold" /> مهامي الحالية
              </h2>
              <GoldButton variant="ghost" size="sm" onClick={() => navigate('/patient/tasks')}>عرض الكل</GoldButton>
           </div>

           <div className="space-y-4">
              {tasks.length > 0 ? tasks.slice(0, 3).map(task => (
                <div key={task.id} className="relative">
                   <TaskCard task={task} isPatient={true} />
                </div>
              )) : (
                <div className="p-12 text-center glass rounded-3xl text-psy-text/20 italic">
                  أحسنت! لا توجد مهام معلقة حالياً.
                </div>
              )}
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 <Calendar className="text-psy-gold" /> الموعد القادم
              </h2>
              {appointments.length > 0 ? (
                <GlassCard className="p-6 bg-[#D4B483]/5 border-[#D4B483]/30">
                   <div className="text-4xl font-black text-psy-gold mb-2">{appointments[0].time}</div>
                   <div className="text-sm font-bold">{appointments[0].date}</div>
                   <p className="text-xs text-psy-text/40 mt-4 leading-relaxed">{appointments[0].title}</p>
                </GlassCard>
              ) : (
                <div className="p-10 text-center glass rounded-3xl text-psy-text/20 italic text-xs">
                  لا توجد مواعيد مقررة قريباً
                </div>
              )}
           </div>

           <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <TrendingUp size={18} className="text-emerald-400" /> مؤشر التقدم
              </h3>
              <p className="text-xs text-psy-text/60 leading-relaxed mb-6">لقد أكملت 75% من الخطة العلاجية المقررة لهذا الشهر. استمر في العمل الجيد!</p>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-400" style={{ width: '75%' }} />
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border-red-500/20 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                 <AlertCircle size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-bold mb-1">تحتاج مساعدة؟</h4>
                 <p className="text-[10px] text-psy-text/40 leading-relaxed">إذا كنت تمر بأزمة وتحتاج لتحدث فوري، يمكنك مراسلة الأخصائي عبر مركز الرسائل.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
