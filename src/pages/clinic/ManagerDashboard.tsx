import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Database, 
  Activity, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  Search, 
  ShieldAlert, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Eye,
  Sliders,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { getAuditLogs, getCurrentUser, ClinicalLog } from '../../lib/clinic';

// Simulated default accounts directory for system manager
const INITIAL_ACCOUNTS = [
  { id: 'u1', name: 'أ. د. سارة الهاشمي', role: 'clinician', email: 'sara@psytech.app', status: 'active', date: '2023-11-20', plan: 'Clinic Suite', sessionsCount: 142 },
  { id: 'u2', name: 'د. سامي الأحمد', role: 'clinician', email: 'sami@psytech.app', status: 'active', date: '2024-01-15', plan: 'Professional', sessionsCount: 98 },
  { id: 'u3', name: 'أ. ليلى الباحثة', role: 'researcher', email: 'researcher@psytech.app', status: 'active', date: '2024-02-10', plan: 'Research Pro', sessionsCount: 0 },
  { id: 'u4', name: 'د. كريم بن جلول', role: 'clinician', email: 'karim@psytech.app', status: 'inactive', date: '2024-05-01', plan: 'Basic', sessionsCount: 14 },
  { id: 'u5', name: 'الحالة: رضوان علوي (مستفيد)', role: 'patient', email: 'radwan@patient.psytech.app', status: 'active', date: '2025-12-01', plan: 'Premium', sessionsCount: 16 },
  { id: 'u6', name: 'د. أمينة طاهري', role: 'clinician', email: 'amina@psytech.app', status: 'active', date: '2024-04-12', plan: 'Professional', sessionsCount: 74 },
  { id: 'u7', name: 'مروان عياش (مساعد)', role: 'clinician', email: 'marwan@psytech.app', status: 'active', date: '2024-03-24', plan: 'Basic', sessionsCount: 30 },
  { id: 'u8', name: 'معهد أبحاث هواري بومدين', role: 'researcher', email: 'usthb_lab@psytech.app', status: 'active', date: '2023-09-08', plan: 'University / Lab', sessionsCount: 0 },
];

// Simulated subscription payments ledger
const INITIAL_SUBSCRIPTIONS = [
  { id: 'sub-201', user: 'أ. د. سارة الهاشمي', plan: 'Clinic Suite', amount: 75000, date: '2026-06-12', status: 'completed', expiry: '2026-07-12' },
  { id: 'sub-202', user: 'د. سامي الأحمد', plan: 'Professional', amount: 34000, date: '2026-06-10', status: 'completed', expiry: '2026-07-10' },
  { id: 'sub-203', user: 'أ. ليلى الباحثة', plan: 'Research Pro', amount: 42000, date: '2026-06-08', status: 'completed', expiry: '2026-07-08' },
  { id: 'sub-204', user: 'معهد أبحاث هواري بومدين', plan: 'University / Lab', amount: 120000, date: '2026-06-01', status: 'completed', expiry: '2027-06-01' },
  { id: 'sub-205', user: 'الحالة: رضوان علوي (مستفيد)', plan: 'Premium2', amount: 4900, date: '2026-05-28', status: 'completed', expiry: '2026-06-28' },
  { id: 'sub-206', user: 'د. أمينة طاهري', plan: 'Professional', amount: 34000, date: '2026-05-20', status: 'completed', expiry: '2026-06-20' },
  { id: 'sub-207', user: 'د. كريم بن جلول', plan: 'Basic', amount: 18000, date: '2026-05-15', status: 'unpaid', expiry: '2026-06-15' },
  { id: 'sub-208', user: 'د. بلال بوسعدية', plan: 'Professional', amount: 34000, date: '2026-05-10', status: 'refunded', expiry: '2026-06-10' },
];

// Simulated platform updates / notices channel
const SYSTEM_NOTICES = [
  { id: 'n-1', tag: 'تحديث أمنبي', text: 'تم تحديث بروتوكول تيسير الجلسات المترابط والتشفير البيني التام لمكالمات الأخصائيين بالتوافق مع معايير HIPAA وGDPR.', date: 'اليوم، 09:20' },
  { id: 'n-2', tag: 'تحسين الخوادم', text: 'خوادم النسخ السحابي الاحتياطي لـ PsyTech المحدثة v3.4 تعمل الآن بأداء أعلى بنسبة 45% وبمستوى استقرار قياسي.', date: 'أمس، 18:45' },
  { id: 'n-3', tag: 'تكامل المقاييس', text: 'تكامل تلقائي ناجح لمجموعات مقاييس التقييم المعرفي الذاتي بين الأخصائي والمختبر الأكاديمي بسلاسة.', date: 'قبل يومين' },
  { id: 'n-4', tag: 'تحديث الدفع', text: 'تم بنجاح دمج نظام السحب بنقرة واحدة لتحويل العمولات والاشتراكات المالية مباشرة لحسابات الممارسين.', date: 'قبل 3 أيام' },
];

const revenueChartData = [
  { month: 'جانفي', subscriptions: 420000, users: 40 },
  { month: 'فيفري', subscriptions: 490000, users: 55 },
  { month: 'مارس', subscriptions: 580000, users: 72 },
  { month: 'أفريل', subscriptions: 710000, users: 95 },
  { month: 'ماي', subscriptions: 840000, users: 120 },
  { month: 'جوان', subscriptions: 1080000, users: 165 },
];

export const ManagerDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [activeSubTab, setActiveSubTab] = useState<'updates' | 'subscriptions' | 'users'>('updates');
  
  // Real-time states
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'clinician' | 'researcher' | 'patient'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [auditLogs, setAuditLogs] = useState<ClinicalLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load audit logs on start
  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle account status
  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
    triggerToast(`⏳ تم تحديث حالة حساب "${name}" إلى [${nextStatus === 'active' ? 'نشط' : 'غير نشط'}] بنجاح.`);
  };

  // Filter logs and accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (acc.plan && acc.plan.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || acc.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredSubscriptions = subscriptions.filter(sub => {
    return sub.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
           sub.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
           sub.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700 text-right" dir="rtl">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-6 z-[200] px-5 py-4 bg-[#121110] border border-psy-gold/30 text-psy-gold text-xs font-black rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-2 h-2 rounded-full bg-psy-gold animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative min-h-[16rem] md:h-64 rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 flex flex-col md:flex-row items-center justify-between p-8 md:px-16 group bg-[#110e0c] shadow-2xl gap-8 md:gap-0">
        <div className="absolute inset-0 bg-gradient-to-r from-psy-bg via-psy-bg/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200" 
          alt="Manager Dashboard Banner" 
          className="absolute left-0 top-0 w-full h-full object-cover opacity-20 group-hover:scale-102 transition-transform duration-1000" 
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 space-y-4 md:space-y-5 flex flex-col items-center md:items-start text-center md:text-right">
          <BackButton homePath="/" />
          <h1 className="text-4xl md:text-5xl font-serif font-black text-psy-text tracking-tighter m-0">بوابة الإدارة العليا للمنصة</h1>
          <p className="text-psy-gold/70 font-medium text-base md:text-lg max-w-xl">مرحباً {user?.fullName || 'حضرة المدير'} • لوحة تحكم وإشراف شامل على المستجدات، سجلات الاشتراكات، وحسابات الطاقم.</p>
        </div>

        <div className="relative z-20 shrink-0 px-5 py-3 bg-psy-gold/10 border border-psy-gold/20 rounded-2xl text-psy-gold text-xs font-black flex items-center gap-2">
          <Clock size={14} className="animate-spin-slow" />
          <span>توقيت النظام: Live Server UTC</span>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-subtle-gold/40" />
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-psy-gold/10 rounded-xl text-psy-gold border border-psy-gold/15 group-hover:scale-110 transition-transform">
              <Zap size={20} />
            </div>
            <span className="text-[10px] bg-psy-gold/10 text-psy-gold px-2 py-0.5 rounded-md font-bold">+28%</span>
          </div>
          <h4 className="text-xs font-bold text-psy-text/40 m-0">الاشتراكات الفعالة</h4>
          <div className="text-2xl font-serif font-black mt-1 text-psy-text">165 باقة</div>
          <p className="text-[10px] text-psy-text/30 mt-1">عيادات، باحثين، وحالات بريميوم</p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" />
          <div className="flex justify-between items-start mb-3">
            <div 
              style={{ width: '1139.6px' }}
              className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10 group-hover:scale-110 transition-transform"
            >
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-bold">+18.5k د.ج</span>
          </div>
          <h4 className="text-xs font-bold text-psy-text/40 m-0">الإيرادات الشهرية المتكررة</h4>
          <div className="text-2xl font-serif font-black mt-1 text-emerald-400">1,080,000 د.ج</div>
          <p className="text-[10px] text-psy-text/30 mt-1">تطور حجم التمويلات والاشتراكات الحالية</p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/40" />
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/10 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-bold">مستقر</span>
          </div>
          <h4 className="text-xs font-bold text-psy-text/40 m-0">إجمالي الحسابات المسجلة</h4>
          <div className="text-2xl font-serif font-black mt-1 text-psy-text">412 حساباً</div>
          <p className="text-[10px] text-psy-text/30 mt-1">طواقم طبية، معالجين، وباحثين مأذونين</p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500/40" />
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-bold">99.98%</span>
          </div>
          <h4 className="text-xs font-bold text-psy-text/40 m-0">سلامة الخوادم والأمان</h4>
          <div className="text-2xl font-serif font-black mt-1 text-psy-text">متصل وآمن</div>
          <p className="text-[10px] text-psy-text/30 mt-1">جميع نقاط النهاية والبنية مشفرة كلياً</p>
        </GlassCard>
      </div>

      {/* Tabs Navigation for Manager */}
      <div className="flex flex-wrap items-center gap-2.5 p-1.5 bg-psy-surface/30 border border-white/5 rounded-[24px] w-fit">
        <button
          onClick={() => { setActiveSubTab('updates'); setSearchQuery(''); }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'updates' ? 'bg-psy-gold text-psy-bg shadow-lg' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <BellRing size={15} />
          <span>مستجدات وإحصائيات النظام</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('subscriptions'); setSearchQuery(''); }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'subscriptions' ? 'bg-psy-gold text-psy-bg shadow-lg' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <DollarSign size={15} />
          <span>سجلات الاشتراك والمدفوعات</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('users'); setSearchQuery(''); }}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'users' ? 'bg-psy-gold text-psy-bg shadow-lg' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <Users size={15} />
          <span>دليل حسابات المستخدمين</span>
        </button>
      </div>

      {/* Core Dynamic Content Container */}
      <AnimatePresence mode="wait">
        
        {/* =======================
            TAB 1: SYSTEM UPDATES, ALERTS & GRAPHICS
            ======================= */}
        {activeSubTab === 'updates' && (
          <motion.div
            key="updates"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Updates Log Column (LEFT/MIDDLE) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-serif font-black m-0 flex items-center gap-2">
                  <Sparkles className="text-psy-gold animate-pulse" size={20} />
                  <span>مستجدات وإشعارات المنصة الفورية</span>
                </h3>
                <span className="text-xs text-psy-text/40 font-mono">آخر تحديث: منذ دقيقتين</span>
              </div>

              {/* Notice Cards */}
              <div className="space-y-4">
                {SYSTEM_NOTICES.map(notice => (
                  <div key={notice.id} className="p-5 glass rounded-[24px] border-r-4 border-psy-gold flex gap-4 transition-all hover:translate-x-[-4px]">
                    <div className="mt-0.5 py-1 px-2.5 bg-psy-gold/10 text-psy-gold border border-psy-gold/20 text-[9px] font-black rounded-lg h-fit select-none whitespace-nowrap">
                      {notice.tag}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs text-psy-text/80 font-bold leading-normal m-0">{notice.text}</p>
                      <span className="text-[10px] text-psy-text/30 font-bold block">{notice.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Server live stats */}
              <GlassCard className="p-6 space-y-4" title="نشاط الخادم الفوري (PsyTech API Monitor)">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="py-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-psy-text/40 font-medium block">سرعة الاستجابة</span>
                    <span className="text-sm font-black text-emerald-440 font-mono">14ms</span>
                  </div>
                  <div className="py-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-psy-text/40 font-medium block">حمل المعالجة CPU</span>
                    <span className="text-sm font-black text-psy-gold font-mono">12.4%</span>
                  </div>
                  <div className="py-3 bg-white/[0.01] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-psy-text/40 font-medium block">معدل نقل البيانات</span>
                    <span className="text-sm font-black text-psy-text/80 font-mono">4.2 TB</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Audit Logs Stream Column (RIGHT) */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-serif font-black m-0 flex items-center gap-2 px-2">
                <Database className="text-psy-gold" size={20} />
                <span>سجل الأنشطة وتدقيق النظام الجاري</span>
              </h3>

              <GlassCard className="p-5 max-h-[480px] overflow-y-auto no-scrollbar space-y-4 relative">
                {auditLogs.slice(0, 10).map((log, i) => (
                  <div key={log.id || i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-psy-gold font-black">{log.userName} ({log.userRole})</span>
                      <span className="text-psy-text/30">{new Date(log.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="font-bold text-psy-text/85">{log.action}</div>
                    <div className="text-[11px] text-psy-text/40 leading-normal">{log.details}</div>
                  </div>
                ))}
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* =======================
            TAB 2: SUBSCRIPTION RECORDS & FINANCE LEDGER
            ======================= */}
        {activeSubTab === 'subscriptions' && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Visual Analytics Block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <GlassCard className="lg:col-span-8 p-6 flex flex-col justify-between" title="منحنى نمو مدفوعات العشري وتطور الاشتراكات">
                <div className="h-64 w-full mt-4" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="managerSubGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#141211', borderColor: '#D4AF37', borderRadius: '16px', color: '#F4F4F3' }} />
                      <Area type="monotone" dataKey="subscriptions" name="الاشتراكات السحابية" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#managerSubGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Stats Box Right */}
              <GlassCard className="lg:col-span-4 p-6 flex flex-col justify-between" title="تنوع باقات الاشتراكات">
                <div className="space-y-4">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold">باقة العيادة (Clinic Suite)</span>
                    <span className="text-psy-gold font-black">24 عيادة نشطة</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold">باقة الأخصائي (Professional)</span>
                    <span className="text-psy-gold font-black">68 حساباً نشطاً</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold">باقة الباحثين (Research Pro)</span>
                    <span className="text-psy-gold font-black">35 معملأ وجامعة</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold">باقة المستفيدين (Premium/Pro)</span>
                    <span className="text-psy-gold font-black">38 مستفيداً مميزاً</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* List Table of Subscriptions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl font-serif font-black m-0 flex items-center gap-2">
                  <FileText className="text-psy-gold" size={20} />
                  <span>أحدث سجلات الاشتراك والعمليات الحية</span>
                </h3>
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-psy-text/40" />
                  <input
                    type="text"
                    placeholder="ابحث بـ اسم المشترك، الباقة، رقم العملية..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '172px' }}
                    className="bg-psy-surface border border-white/10 rounded-xl py-2 px-4 pl-10 text-xs text-white focus:border-psy-gold outline-none text-right"
                  />
                </div>
              </div>

              {/* Desktop Subscription logs ledger Table */}
              <div className="overflow-x-auto relative rounded-2xl border border-white/5 bg-[#12100e]">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] text-psy-text/40 font-black">
                      <th className="p-4">كود الاشتراك</th>
                      <th className="p-4">اسم الحساب والمشترك</th>
                      <th className="p-4">الباقة المختارة</th>
                      <th className="p-4 text-center">المبلغ المستخلص</th>
                      <th className="p-4 text-center">تاريخ الدفع</th>
                      <th className="p-4 text-center">انتهاء الاشتراك</th>
                      <th className="p-4 text-center">حالة الدفعة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b border-white/[0.03] text-xs hover:bg-white/[0.01] transition-all">
                        <td className="p-4 font-mono font-bold text-psy-text/50">{sub.id}</td>
                        <td className="p-4 font-bold">{sub.user}</td>
                        <td className="p-4 font-bold">
                          <span className="px-2 py-1 rounded-md bg-psy-gold/10 text-psy-gold text-[10px] border border-psy-gold/15">
                            {sub.plan}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-psy-gold">{sub.amount.toLocaleString('ar-EG')} د.ج</td>
                        <td className="p-4 text-center font-mono text-psy-text/50">{sub.date}</td>
                        <td className="p-4 text-center font-mono text-psy-text/50">{sub.expiry}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2 py-1 font-black text-[9px] rounded-md ${
                            sub.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            sub.status === 'unpaid' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {sub.status === 'completed' ? 'مدفوعة ومقيدة' :
                             sub.status === 'unpaid' ? 'قيد الانتظار' :
                             'مسترجعة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredSubscriptions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-psy-text/20 italic">
                          لا توجد سجلات مطابقة للبحث حالياً.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {/* =======================
            TAB 3: USER ACCOUNTS DIRECTORY
            ======================= */}
        {activeSubTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Headers and Quick Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <h3 className="text-xl font-serif font-black m-0 flex items-center gap-2">
                <Users className="text-psy-gold" size={20} />
                <span>دليل حسابات الأخصائيين والباحثين والمستفيدين</span>
              </h3>

              {/* Filters panel */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-psy-text/40" />
                  <input
                    type="text"
                    placeholder="ابحث بـ الاسم أو البريد الإلكتروني..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '172px' }}
                    className="bg-psy-surface border border-white/10 rounded-xl py-2 px-4 pl-10 text-xs text-white focus:border-psy-gold outline-none text-right"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="bg-psy-surface border border-white/10 rounded-xl p-2 px-3 text-xs text-white focus:border-psy-gold outline-none text-right"
                >
                  <option value="all">كل الرتب</option>
                  <option value="clinician">طاقم أخصائي</option>
                  <option value="researcher">طاقم مسؤولي أبحاث</option>
                  <option value="patient">حالات ومستفيدين</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-psy-surface border border-white/10 rounded-xl p-2 px-3 text-xs text-white focus:border-psy-gold outline-none text-right"
                >
                  <option value="all">كل الحالات</option>
                  <option value="active">نشط فقط</option>
                  <option value="inactive">غير نشط فقط</option>
                </select>
              </div>
            </div>

            {/* User Directory Table Grid */}
            <div className="overflow-x-auto relative rounded-2xl border border-white/5 bg-[#12100e]">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] text-psy-text/40 font-black">
                    <th className="p-4">اسم المستخدم</th>
                    <th className="p-4">البريد الإلكتروني</th>
                    <th className="p-4 text-center">الصلاحية والصفة</th>
                    <th className="p-4 text-center">الباقة والاشتراك الحالية</th>
                    <th className="p-4 text-center">تاريخ التسجيل</th>
                    <th className="p-4 text-center">الجلسات/الدراسات</th>
                    <th className="p-4 text-center">حالة الحساب</th>
                    <th className="p-4 text-center">الإجراءات والتحكم</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="border-b border-white/[0.03] text-xs hover:bg-white/[0.01] transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center font-black text-[10px] text-psy-gold shrink-0">
                            {acc.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-extrabold block text-psy-text">{acc.name}</span>
                            <span className="text-[10px] text-psy-text/40 font-mono block mt-0.5">{acc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono select-all text-psy-text/60">{acc.email}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 font-bold text-[10px] rounded ${
                          acc.role === 'clinician' ? 'bg-psy-gold/15 text-psy-gold' :
                          acc.role === 'researcher' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-[#A67C4A]/20 text-[#A67C4A]'
                        }`}>
                          {acc.role === 'clinician' ? 'أخصائي عيادي' :
                           acc.role === 'researcher' ? 'باحث علمي' :
                           'مستفيد / مريض'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-psy-gold font-bold">{acc.plan || 'بدون اشتراك'}</span>
                      </td>
                      <td className="p-4 text-center font-mono text-psy-text/40">{acc.date}</td>
                      <td className="p-4 text-center font-mono font-bold">{acc.sessionsCount > 0 ? acc.sessionsCount : '—'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
                          <span className="font-bold">{acc.status === 'active' ? 'نشط' : 'معطل'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(acc.id, acc.name, acc.status)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                            acc.status === 'active' 
                              ? 'bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-red-400' 
                              : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {acc.status === 'active' ? 'تعطيل الحساب' : 'تنشيط الحساب'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-psy-text/20 italic">
                        لا توجد حسابات مستخدمين بالمعايير الحالية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
