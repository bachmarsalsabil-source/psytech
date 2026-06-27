import React, { useState } from 'react';
import { TestCard } from '../../components/lab/TestCard';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { Plus, Search, Share2, Users, QrCode, BarChart3, TrendingUp, Activity, FlaskConical } from 'lucide-react';
import { getTests, saveTest } from '../../lib/lab';
import { GoldButton } from '../../components/clinic/GoldButton';
import { useNavigate } from 'react-router-dom';

export const TestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [testsData, setTestsData] = useState(() => getTests());

  const handlePublishTest = (id: string) => {
    const target = getTests().find(t => t.id === id);
    if (target) {
      const updated = { ...target, status: 'published' as const };
      saveTest(updated);
      setTestsData(getTests());
    }
  };

  const tests = testsData.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const navigate = useNavigate();

  const stats = [
    { label: 'إجمالي العينات المستقطبة', value: '1,240', icon: Users, color: 'text-psy-gold', bg: 'bg-psy-gold/10' },
    { label: 'دراسات نشطة ميدانياً', value: '4', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'طلبات الانضمام للفريق', value: '12', icon: Share2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'أدوات قيد التحكيم', value: '3', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">

        {/* Back Button */}
        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />

        {/* ── Hero Header ─────────────────────────────────────── */}
        <div className="relative glass rounded-[32px] md:rounded-[48px] p-8 md:p-12 overflow-hidden min-h-[180px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Decorative glow */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-psy-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 right-10 w-48 h-48 rounded-full bg-psy-gold/5 blur-2xl pointer-events-none" />

          <div className="relative space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-psy-gold/15 flex items-center justify-center text-psy-gold">
                <FlaskConical size={20} />
              </div>
              <span className="text-xs font-bold text-psy-gold/70 uppercase tracking-widest">مكتبة الأدوات القياسية</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-text leading-tight">
              مكتبة الاختبارات النفسية
            </h1>
            <p className="text-psy-text/40 font-medium max-w-lg">
              بناء الاختبارات، تقنينها، وجمع العينات الميدانية بدقة علمية.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/lab/dashboard')}
              className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-psy-gold font-bold hover:bg-white/10 transition-all flex items-center gap-2 text-sm"
            >
              <Activity size={16} />
              انضمام بكود
            </button>
            {/* <GoldButton onClick={() => navigate('/lab/builder')}>
              <Plus size={18} />
              بناء أداة جديدة
            </GoldButton> */}
          </div>
        </div>

        {/* ── Stats Row ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl md:rounded-[32px] p-6 space-y-4 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <div className="text-2xl font-black text-psy-text">{stat.value}</div>
                <div className="text-[10px] text-psy-text/40 font-bold uppercase tracking-widest mt-1 leading-snug">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters & Search ──────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Filter tabs */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
              <FilterTab active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>الكل</FilterTab>
              <FilterTab active={statusFilter === 'published'} onClick={() => setStatusFilter('published')}>منشورة</FilterTab>
              <FilterTab active={statusFilter === 'draft'} onClick={() => setStatusFilter('draft')}>مسودة</FilterTab>
              <FilterTab active={statusFilter === 'under_review'} onClick={() => setStatusFilter('under_review')}>قيد المراجعة</FilterTab>
              <FilterTab active={statusFilter === 'archived'} onClick={() => setStatusFilter('archived')}>مؤرشفة</FilterTab>
            </div>

            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-gold/50" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في مكتبة الاختبارات..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pr-12 pl-4 outline-none focus:border-psy-gold/60 focus:bg-white/8 transition-all text-sm placeholder:text-psy-text/30"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="text-xs text-psy-text/30 font-medium px-1">
            {tests.length} اختبار{tests.length !== 1 ? 'ات' : ''} مطابق
          </div>

          {/* ── Tests Grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div key={test.id} className="relative group">
                <TestCard
                  test={test}
                  onPublish={handlePublishTest}
                  onPreview={(id) => navigate(`/lab/public-test/${id}`)}
                />
                {/* QR floating badge */}
                <button
                  onClick={() => navigate(`/lab/public-test/${test.id}`)}
                  className="absolute -top-3 -left-3 bg-psy-bg border border-psy-gold/30 p-2 rounded-2xl flex items-center gap-2 shadow-xl hover:scale-105 transition-all z-10"
                >
                  <div className="w-8 h-8 rounded-xl bg-psy-gold/10 flex items-center justify-center group-hover:bg-psy-gold transition-all">
                    <QrCode size={14} className="text-psy-gold group-hover:text-psy-bg" />
                  </div>
                  <div className="pr-2 border-r border-white/10 text-right">
                    <div className="text-[10px] font-black text-psy-gold leading-none">N: 142/250</div>
                    <div className="text-[8px] text-psy-text/40 mt-1 uppercase tracking-tighter">معاينة الباحث</div>
                  </div>
                </button>
              </div>
            ))}

            {/* Empty State */}
            {tests.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center glass rounded-[32px] space-y-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-psy-gold/10 flex items-center justify-center text-psy-gold/40">
                  <FlaskConical size={40} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-psy-text/40">لا توجد اختبارات تطابق معايير البحث</p>
                  <p className="text-xs text-psy-text/20">جرّب تعديل الفلتر أو إنشاء اختبار جديد</p>
                </div>
                {/* <GoldButton onClick={() => navigate('/lab/builder')}>
                  <Plus size={18} />
                  إنشاء أول اختبار
                </GoldButton> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const FilterTab = ({ active, children, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
      active
        ? 'bg-psy-gold text-psy-bg shadow-sm'
        : 'text-psy-text/40 hover:text-psy-text hover:bg-white/5'
    }`}
  >
    {children}
  </button>
);
