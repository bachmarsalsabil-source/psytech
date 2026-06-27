import React, { useState, useEffect, useRef } from 'react';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, TrendingUp, Users, Globe, FlaskConical, Plus, Search,
  Check, X, Upload, Download, ChevronDown, ChevronUp, Eye,
  Calendar, MapPin, BookOpen, Star, Award, Share2, Bell,
  Layers, Activity, Microscope, Target, Clock, Lock, ArrowLeft
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line,
  Cell, PieChart, Pie
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────────────
type StudyType = 'longitudinal' | 'cross_sectional' | 'normative' | 'comparative' | 'pilot';
type StudyStatus = 'active' | 'recruiting' | 'analysis' | 'published' | 'planned';
type RegionCode = 'الجزائر العاصمة' | 'وهران' | 'قسنطينة' | 'عنابة' | 'سطيف' | 'تلمسان' | 'بسكرة' | 'ورقلة' | 'أخرى';

interface NationalStudy {
  id: string;
  title: string;
  type: StudyType;
  status: StudyStatus;
  leadResearcher: string;
  institution: string;
  regions: RegionCode[];
  targetN: number;
  currentN: number;
  waves: number;
  completedWaves: number;
  startDate: string;
  endDate?: string;
  variables: string[];
  ageRange: string;
  gender: 'both' | 'male' | 'female';
  abstract: string;
  alphaScore?: number;
  findings?: string[];
  openForJoin: boolean;
  tags: string[];
}

interface NormDatabaseEntry {
  id: string;
  scaleName: string;
  population: string;
  region: string;
  n: number;
  mean: number;
  sd: number;
  median: number;
  min: number;
  max: number;
  year: number;
  ageRange: string;
  gender: string;
  validityEvidence: string[];
  reliabilityAlpha: number;
}

// ── Static Mock Data ───────────────────────────────────────────────────────
const NATIONAL_STUDIES: NationalStudy[] = [
  {
    id: 'ns-001',
    title: 'دراسة المعايير الوطنية للصحة النفسية بالجزائر (2024-2026)',
    type: 'normative',
    status: 'active',
    leadResearcher: 'أ.د. بوعلام سعدي',
    institution: 'جامعة الجزائر 2 — مخبر علم النفس التطبيقي',
    regions: ['الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'سطيف'],
    targetN: 6000,
    currentN: 3847,
    waves: 1,
    completedWaves: 0,
    startDate: '2024-03-01',
    endDate: '2026-06-30',
    variables: ['الصمود النفسي', 'الاحتراق المهني', 'مستوى القلق', 'جودة الحياة النفسية'],
    ageRange: '18-65',
    gender: 'both',
    abstract: 'دراسة مقطعية واسعة تهدف لبناء قاعدة بيانات معيارية شاملة لأدوات القياس النفسي الأكثر استخداماً في البيئة الجزائرية مع مراعاة الفوارق الجهوية والثقافية والاجتماعية.',
    alphaScore: 0.89,
    findings: ['الصمود النفسي للمرأة العاملة أعلى بـ 12%', 'تباين واضح بين الشمال والجنوب في مؤشرات القلق'],
    openForJoin: true,
    tags: ['معايير وطنية', 'تقنين', 'صحة نفسية', 'جزائر']
  },
  {
    id: 'ns-002',
    title: 'الدراسة الطولية لتطور الذكاء الوجداني لدى طلبة الجامعات (2022-2027)',
    type: 'longitudinal',
    status: 'active',
    leadResearcher: 'د. سمية بن يحيى',
    institution: 'جامعة وهران 2 — كلية العلوم الاجتماعية',
    regions: ['وهران', 'تلمسان', 'الجزائر العاصمة'],
    targetN: 1200,
    currentN: 987,
    waves: 5,
    completedWaves: 3,
    startDate: '2022-09-01',
    endDate: '2027-06-30',
    variables: ['الذكاء الوجداني', 'الكفاءة الأكاديمية', 'مهارات التواصل', 'التعاطف الاجتماعي'],
    ageRange: '18-25',
    gender: 'both',
    abstract: 'تتبع طولي لعينة من طلبة الجامعة عبر 5 موجات قياس لرصد مسارات تطور مكونات الذكاء الوجداني ودوره في النجاح الأكاديمي والاجتماعي.',
    alphaScore: 0.84,
    findings: ['الذكاء الوجداني يرتفع بمعدل 7% كل عام', 'الطالبات أعلى في التعاطف بـ 15 درجة'],
    openForJoin: false,
    tags: ['طولية', 'ذكاء وجداني', 'جامعة', 'تطور']
  },
  {
    id: 'ns-003',
    title: 'الدراسة المستعرضة لاضطرابات الصحة النفسية في بيئات العمل الجزائرية',
    type: 'cross_sectional',
    status: 'recruiting',
    leadResearcher: 'د. كريم مسلاتي',
    institution: 'المركز الوطني للبحث في علم النفس التطبيقي، الجزائر',
    regions: ['الجزائر العاصمة', 'عنابة', 'قسنطينة', 'ورقلة', 'بسكرة'],
    targetN: 2500,
    currentN: 632,
    waves: 1,
    completedWaves: 0,
    startDate: '2025-01-15',
    variables: ['الاحتراق المهني', 'ضغط العمل', 'الرضا الوظيفي', 'الدعم التنظيمي'],
    ageRange: '22-60',
    gender: 'both',
    abstract: 'دراسة مستعرضة ترصد انتشار مؤشرات الاضطراب النفسي المرتبطة بالعمل وعوامل الخطر والحماية عبر قطاعات مهنية مختلفة بالجزائر.',
    openForJoin: true,
    tags: ['بيئة عمل', 'احتراق مهني', 'مستعرضة', 'ضغط']
  },
  {
    id: 'ns-004',
    title: 'معايير مقياس الاكتئاب لدى المسنين في دور الرعاية الجزائرية',
    type: 'normative',
    status: 'published',
    leadResearcher: 'أ.د. نجوى العمري',
    institution: 'جامعة قسنطينة 2 — قسم علم النفس العيادي',
    regions: ['قسنطينة', 'سطيف', 'عنابة'],
    targetN: 450,
    currentN: 450,
    waves: 1,
    completedWaves: 1,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    variables: ['الاكتئاب', 'الوحدة', 'جودة الحياة', 'النشاط الاجتماعي'],
    ageRange: '60-90',
    gender: 'both',
    abstract: 'تقنين مقياس الاكتئاب لدى كبار السن في دور الرعاية الجزائرية وبناء جداول معيارية خاصة بهذه الشريحة المهمة التي تفتقر لأدوات قياس محلية ملائمة.',
    alphaScore: 0.91,
    findings: ['الانتشار 23% أعلى من المعدل الغربي', 'الوحدة العامل الأبرز للاكتئاب لدى المسنين'],
    openForJoin: false,
    tags: ['مسنون', 'اكتئاب', 'دور رعاية', 'معايير']
  },
  {
    id: 'ns-005',
    title: 'الدراسة المقارنة للصحة النفسية بين الطلبة الجزائريين والمهاجرين',
    type: 'comparative',
    status: 'planned',
    leadResearcher: 'د. أسماء حمزة',
    institution: 'مخبر الأنثروبولوجيا النفسية، جامعة الجزائر 1',
    regions: ['الجزائر العاصمة'],
    targetN: 800,
    currentN: 0,
    waves: 2,
    completedWaves: 0,
    startDate: '2026-09-01',
    variables: ['الهوية الثقافية', 'التكيف النفسي', 'الصمود', 'الهلع الثقافي'],
    ageRange: '18-35',
    gender: 'both',
    abstract: 'مقارنة نفسية بين المقيمين والمهاجرين الجزائريين بفرنسا وكندا لفهم أثر الهجرة على مؤشرات الصحة النفسية والهوية الثقافية.',
    openForJoin: true,
    tags: ['هجرة', 'مقارنة', 'هوية', 'مهاجرون']
  }
];

const NORM_DATABASE: NormDatabaseEntry[] = [
  { id: 'nd-01', scaleName: 'مقياس الصمود النفسي — كونور وديفيدسون (CDR)', population: 'عينة وطنية جزائرية', region: 'وطنية', n: 3847, mean: 68.4, sd: 11.2, median: 69, min: 18, max: 100, year: 2024, ageRange: '18-65', gender: 'مختلط', validityEvidence: ['صدق عاملي', 'صدق تقارب'], reliabilityAlpha: 0.89 },
  { id: 'nd-02', scaleName: 'مقياس القلق العام (GAD-7) - النسخة العربية', population: 'موظفو القطاع العام', region: 'وطنية', n: 1250, mean: 7.8, sd: 4.3, median: 7, min: 0, max: 21, year: 2023, ageRange: '22-55', gender: 'مختلط', validityEvidence: ['صدق محتوى', 'صدق معياري'], reliabilityAlpha: 0.82 },
  { id: 'nd-03', scaleName: 'مقياس احترام الذات — روزنبرغ (RSES)', population: 'طلبة الجامعات الجزائرية', region: 'شمال', n: 2100, mean: 24.1, sd: 5.6, median: 25, min: 10, max: 40, year: 2024, ageRange: '18-25', gender: 'مختلط', validityEvidence: ['صدق عاملي', 'صدق ظاهري'], reliabilityAlpha: 0.78 },
  { id: 'nd-04', scaleName: 'مقياس الاكتئاب لدى المسنين (GDS-15)', population: 'المسنون في دور الرعاية', region: 'شرق الجزائر', n: 450, mean: 6.2, sd: 3.9, median: 6, min: 0, max: 15, year: 2023, ageRange: '60-90', gender: 'مختلط', validityEvidence: ['صدق تشخيصي', 'صدق تقارب'], reliabilityAlpha: 0.91 },
  { id: 'nd-05', scaleName: 'مقياس الاحتراق المهني (MBI) النسخة العربية', population: 'معلمو المرحلة الابتدائية', region: 'وطنية', n: 1680, mean: 42.3, sd: 9.1, median: 42, min: 15, max: 90, year: 2022, ageRange: '25-55', gender: 'مختلط', validityEvidence: ['صدق عاملي تأكيدي'], reliabilityAlpha: 0.86 },
];

const TIMELINE_DATA = [
  { year: '2018', studies: 2, participants: 850 },
  { year: '2019', studies: 3, participants: 1200 },
  { year: '2020', studies: 2, participants: 980 },
  { year: '2021', studies: 4, participants: 2100 },
  { year: '2022', studies: 6, participants: 3800 },
  { year: '2023', studies: 8, participants: 5200 },
  { year: '2024', studies: 12, participants: 8400 },
  { year: '2025', studies: 9, participants: 4800 },
];

const REGION_STATS = [
  { region: 'الجزائر العاصمة', studies: 9, participants: 5200, fill: '#D4AF37' },
  { region: 'وهران', studies: 5, participants: 2100, fill: '#C4A027' },
  { region: 'قسنطينة', studies: 7, participants: 3100, fill: '#B49017' },
  { region: 'عنابة', studies: 4, participants: 1800, fill: '#A48007' },
  { region: 'سطيف', studies: 3, participants: 1200, fill: '#947000' },
];

const RADAR_DATA = [
  { subject: 'الصمود', A: 88, fullMark: 100 },
  { subject: 'القلق', A: 65, fullMark: 100 },
  { subject: 'الاكتئاب', A: 58, fullMark: 100 },
  { subject: 'الذكاء الوجداني', A: 74, fullMark: 100 },
  { subject: 'احترام الذات', A: 71, fullMark: 100 },
  { subject: 'الاحتراق المهني', A: 60, fullMark: 100 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StudyStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'جارية', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  recruiting: { label: 'استقطاب', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  analysis: { label: 'تحليل', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  published: { label: 'منشورة', color: 'text-psy-gold', bg: 'bg-psy-gold/10 border-psy-gold/20' },
  planned: { label: 'مخططة', color: 'text-white/50', bg: 'bg-white/5 border-white/10' },
};

const TYPE_CONFIG: Record<StudyType, { label: string; icon: React.ElementType }> = {
  longitudinal: { label: 'طولية', icon: TrendingUp },
  cross_sectional: { label: 'مستعرضة', icon: Layers },
  normative: { label: 'معيارية', icon: Target },
  comparative: { label: 'مقارنة', icon: BarChart3 },
  pilot: { label: 'تجريبية', icon: FlaskConical },
};

// ── Main Component ─────────────────────────────────────────────────────────
const NationalNormsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'studies' | 'norms' | 'join' | 'results'>('overview');
  const [searchStudies, setSearchStudies] = useState('');
  const [filterType, setFilterType] = useState<StudyType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StudyStatus | 'all'>('all');
  const [selectedStudy, setSelectedStudy] = useState<NationalStudy | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinStudy, setJoinStudy] = useState<NationalStudy | null>(null);
  const [searchNorms, setSearchNorms] = useState('');
  const [joinForm, setJoinForm] = useState({ name: '', institution: '', email: '', role: 'researcher', region: '', message: '' });
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const filteredStudies = NATIONAL_STUDIES.filter(s => {
    const matchSearch = searchStudies === '' || s.title.includes(searchStudies) || s.leadResearcher.includes(searchStudies) || s.tags.some(t => t.includes(searchStudies));
    const matchType = filterType === 'all' || s.type === filterType;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const filteredNorms = NORM_DATABASE.filter(n =>
    searchNorms === '' || n.scaleName.includes(searchNorms) || n.population.includes(searchNorms)
  );

  const totalParticipants = NATIONAL_STUDIES.reduce((sum, s) => sum + s.currentN, 0);
  const activeStudiesCount = NATIONAL_STUDIES.filter(s => s.status === 'active' || s.status === 'recruiting').length;
  const publishedCount = NATIONAL_STUDIES.filter(s => s.status === 'published').length;
  const joinableCount = NATIONAL_STUDIES.filter(s => s.openForJoin).length;

  return (
    <>
      <div className="space-y-6 text-right" dir="rtl">
        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-[#D4AF37] text-[#0D1117] px-5 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-2"
            >
              <Check size={16} />
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />

        {/* ─── Hero Header ───────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-l from-[#0D1117] via-[#1a1608] to-[#0D1117] border border-psy-gold/20 p-8 md:p-12 rounded-[36px] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20">
                  المخبر النفسي الوطني
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-bold">قاعدة بيانات حية</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                <span className="text-[#D4AF37]">المعايير الوطنية</span>
                <br />
                <span className="text-white/80 text-3xl">والدراسات الطولية والمستعرضة</span>
              </h1>
              <p className="text-sm text-[#F5F0E8]/50 leading-relaxed max-w-xl">
                منصة وطنية متكاملة لمشاركة نتائج الدراسات السيكومترية، وعرض المعايير المحلية المقننة، وتنسيق الجهود البحثية المشتركة بين مؤسسات التعليم العالي والمراكز البحثية الجزائرية.
              </p>
            </div>

            {/* KPI Tiles */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: 'مشارك في القاعدة', value: totalParticipants.toLocaleString('ar'), icon: Users, color: 'text-emerald-400' },
                { label: 'دراسة نشطة', value: activeStudiesCount, icon: Activity, color: 'text-amber-400' },
                { label: 'أداة تم تقنينها', value: NORM_DATABASE.length, icon: Target, color: 'text-[#D4AF37]' },
                { label: 'دراسة منشورة', value: publishedCount, icon: Award, color: 'text-blue-400' },
              ].map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center space-y-1 hover:border-[#D4AF37]/30 transition-all"
                >
                  <kpi.icon size={20} className={`mx-auto ${kpi.color}`} />
                  <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-[9px] text-white/40 font-bold leading-tight">{kpi.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tab Navigation ────────────────────────────────────────────── */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-2 flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: Globe },
            { id: 'studies', label: 'الدراسات الوطنية', icon: FlaskConical },
            { id: 'norms', label: 'قاعدة المعايير', icon: Target },
            { id: 'results', label: 'أحدث النتائج', icon: Star },
            { id: 'join', label: 'المشاركة والانضمام', icon: Users },
          ].map(tab => {
            const isActive = activeTab === tab.id as any;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0D1117] shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── Overview Tab ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Timeline Chart */}
              <div className="bg-[#0D1117] border border-white/5 rounded-[28px] p-6 space-y-4">
                <h3 className="text-lg font-black text-[#D4AF37] flex items-center gap-2">
                  <TrendingUp size={20} />
                  التطور الزمني للأبحاث السيكومترية الوطنية
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="studiesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="partGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34D399" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, color: '#fff', fontSize: 11 }}
                        itemStyle={{ color: '#D4AF37' }}
                      />
                      <Area yAxisId="left" type="monotone" dataKey="studies" name="عدد الدراسات" stroke="#D4AF37" strokeWidth={2} fill="url(#studiesGrad)" />
                      <Area yAxisId="right" type="monotone" dataKey="participants" name="المشاركون" stroke="#34D399" strokeWidth={2} fill="url(#partGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Region Stats */}
                <div className="bg-[#0D1117] border border-white/5 rounded-[28px] p-6 space-y-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin size={16} className="text-[#D4AF37]" />
                    التوزيع الجغرافي للدراسات
                  </h3>
                  <div className="space-y-3">
                    {REGION_STATS.map((r, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/50">{r.studies} دراسات • {r.participants.toLocaleString('ar')} مشارك</span>
                          <span className="font-bold text-white">{r.region}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-[#D4AF37]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(r.participants / 5200) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radar of metrics */}
                <div className="bg-[#0D1117] border border-white/5 rounded-[28px] p-6 space-y-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Activity size={16} className="text-[#D4AF37]" />
                    مؤشرات الصحة النفسية الوطنية
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 40, left: 40, bottom: 10 }}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <Radar name="المتوسط الوطني" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, fontSize: 11 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Featured Studies Grid */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Star size={16} className="text-[#D4AF37]" />
                  الدراسات البارزة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {NATIONAL_STUDIES.slice(0, 3).map(study => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onView={() => { setSelectedStudy(study); setActiveTab('studies'); }}
                      onJoin={() => { setJoinStudy(study); setShowJoinModal(true); }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Studies Tab ───────────────────────────────────────────────── */}
          {activeTab === 'studies' && (
            <motion.div
              key="studies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchStudies}
                    onChange={e => setSearchStudies(e.target.value)}
                    placeholder="ابحث في الدراسات والباحثين..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 pr-12 text-sm outline-none focus:border-[#D4AF37]/50 text-white placeholder-white/30"
                  />
                  <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 text-white appearance-none"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="longitudinal">طولية</option>
                  <option value="cross_sectional">مستعرضة</option>
                  <option value="normative">معيارية</option>
                  <option value="comparative">مقارنة</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 text-white appearance-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">جارية</option>
                  <option value="recruiting">استقطاب</option>
                  <option value="published">منشورة</option>
                  <option value="planned">مخططة</option>
                </select>
                <button
                  onClick={() => triggerToast('تم تفعيل إشعارات الدراسات الجديدة 🔔')}
                  className="px-4 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/25 text-[#D4AF37] rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shrink-0"
                >
                  <Bell size={15} />
                  تنبيهات
                </button>
              </div>

              {/* Studies List */}
              <div className="space-y-4">
                {filteredStudies.length === 0 && (
                  <div className="text-center py-16 text-white/30 font-bold">
                    لا توجد دراسات تطابق معايير البحث الحالية
                  </div>
                )}
                {filteredStudies.map((study) => (
                  <StudyDetailCard
                    key={study.id}
                    study={study}
                    isExpanded={selectedStudy?.id === study.id}
                    onToggle={() => setSelectedStudy(selectedStudy?.id === study.id ? null : study)}
                    onJoin={() => { setJoinStudy(study); setShowJoinModal(true); }}
                    onShare={() => triggerToast(`تم نسخ رابط الدراسة: ${study.title.slice(0, 20)}... 📋`)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Norms Tab ─────────────────────────────────────────────────── */}
          {activeTab === 'norms' && (
            <motion.div
              key="norms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">قاعدة المعايير السيكومترية الوطنية</h2>
                  <p className="text-sm text-white/40 mt-1">معايير مقننة ومعتمدة للأدوات السيكومترية على البيئة الجزائرية</p>
                </div>
                <button
                  onClick={() => triggerToast('سيتم تحميل قاعدة المعايير قريباً 📥')}
                  className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#0D1117] font-black rounded-2xl text-sm hover:scale-105 transition-all shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
                >
                  <Download size={16} />
                  تصدير CSV
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchNorms}
                  onChange={e => setSearchNorms(e.target.value)}
                  placeholder="ابحث في قاعدة المعايير..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 pr-12 text-sm outline-none focus:border-[#D4AF37]/50 text-white placeholder-white/30"
                />
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
              </div>

              <div className="bg-[#0D1117] border border-white/5 rounded-[24px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs min-w-[900px]">
                    <thead className="bg-[#D4AF37]/5 border-b border-white/5">
                      <tr>
                        {['الأداة', 'المجتمع', 'المنطقة', 'N', 'M', 'SD', 'Median', 'Alpha (α)', 'السنة', ''].map((h, i) => (
                          <th key={i} className="p-4 text-[10px] font-black text-white/40 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredNorms.map((norm) => (
                        <tr key={norm.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4 font-bold text-white max-w-[220px] leading-snug">{norm.scaleName}</td>
                          <td className="p-4 text-white/60 max-w-[140px]">{norm.population}</td>
                          <td className="p-4 text-white/60">{norm.region}</td>
                          <td className="p-4 text-[#D4AF37] font-black font-mono">{norm.n.toLocaleString('ar')}</td>
                          <td className="p-4 text-white font-mono">{norm.mean}</td>
                          <td className="p-4 text-white/70 font-mono">{norm.sd}</td>
                          <td className="p-4 text-white/50 font-mono">{norm.median}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-lg font-black text-[10px] ${
                              norm.reliabilityAlpha >= 0.9 ? 'bg-emerald-500/15 text-emerald-400' :
                              norm.reliabilityAlpha >= 0.8 ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                              'bg-amber-500/10 text-amber-400'
                            }`}>
                              {norm.reliabilityAlpha}
                            </span>
                          </td>
                          <td className="p-4 text-white/40 font-mono">{norm.year}</td>
                          <td className="p-4">
                            <button
                              onClick={() => triggerToast(`تم نسخ بيانات ${norm.scaleName.slice(0,20)}...`)}
                              className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl font-black text-[9px] transition-all"
                            >
                              نسخ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Results Tab ───────────────────────────────────────────────── */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-black text-white">أحدث النتائج والاكتشافات الوطنية</h2>
                <p className="text-sm text-white/40 mt-1">ملخصات علمية ونتائج حديثة صادرة عن الدراسات الوطنية المقننة</p>
              </div>

              {/* Key Finding Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[
                  {
                    title: 'الصمود النفسي للمرأة العاملة',
                    finding: 'أعلى بـ 12% من نظيرتها غير العاملة',
                    source: 'الدراسة الوطنية للمعايير 2024',
                    icon: TrendingUp,
                    color: 'emerald',
                    n: 3847,
                    alpha: 0.89
                  },
                  {
                    title: 'انتشار الاحتراق المهني لدى المعلمين',
                    finding: '41.3% يعانون من مستوى متوسط أو مرتفع',
                    source: 'دراسة بيئات العمل الجزائرية 2025',
                    icon: Activity,
                    color: 'amber',
                    n: 1680,
                    alpha: 0.86
                  },
                  {
                    title: 'الذكاء الوجداني عبر السنوات الدراسية',
                    finding: 'ارتفاع منتظم بمعدل 7% سنوياً',
                    source: 'الدراسة الطولية — وهران 2022-2025',
                    icon: Star,
                    color: 'blue',
                    n: 987,
                    alpha: 0.84
                  },
                  {
                    title: 'الاكتئاب لدى المسنين في دور الرعاية',
                    finding: 'الانتشار 23% أعلى من المعدل الغربي',
                    source: 'دراسة كبار السن — قسنطينة 2023',
                    icon: BookOpen,
                    color: 'rose',
                    n: 450,
                    alpha: 0.91
                  },
                  {
                    title: 'الوحدة والاكتئاب لدى المسنين',
                    finding: 'الوحدة تفسر 68% من تباين الاكتئاب',
                    source: 'دراسة كبار السن — قسنطينة 2023',
                    icon: BarChart3,
                    color: 'purple',
                    n: 450,
                    alpha: 0.91
                  },
                  {
                    title: 'تباين القلق بين الشمال والجنوب',
                    finding: 'مؤشرات القلق أعلى في الجنوب بـ 9 نقاط',
                    source: 'الدراسة الوطنية للمعايير 2024',
                    icon: Globe,
                    color: 'teal',
                    n: 3847,
                    alpha: 0.89
                  },
                ].map((item, i) => {
                  const colorMap: Record<string, string> = {
                    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-[#0D1117] border border-white/8 rounded-[24px] p-6 space-y-4 hover:border-[#D4AF37]/25 transition-all group"
                    >
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black ${colorMap[item.color]}`}>
                        <item.icon size={12} />
                        نتيجة بحثية
                      </div>
                      <h4 className="font-black text-white text-sm leading-snug group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                      <p className="text-xl font-black text-[#D4AF37] leading-snug">{item.finding}</p>
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <p className="text-[10px] text-white/40 italic">{item.source}</p>
                        <div className="flex gap-3 text-[10px]">
                          <span className="text-white/30">N = <span className="text-white/60 font-bold">{item.n.toLocaleString('ar')}</span></span>
                          <span className="text-white/30">α = <span className="text-[#D4AF37] font-bold">{item.alpha}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bar chart of studies by type */}
              <div className="bg-[#0D1117] border border-white/5 rounded-[28px] p-6 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#D4AF37]" />
                  توزيع المشاركين حسب الدراسة
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={NATIONAL_STUDIES.filter(s => s.currentN > 0).map(s => ({ name: s.title.slice(0, 22) + '...', n: s.currentN, target: s.targetN }))} layout="vertical" margin={{ right: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} axisLine={false} tickLine={false} width={180} />
                      <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, fontSize: 11 }} />
                      <Bar dataKey="target" fill="rgba(255,255,255,0.05)" radius={[4, 4, 4, 4]} name="الهدف" />
                      <Bar dataKey="n" fill="#D4AF37" radius={[4, 4, 4, 4]} name="الحالي" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Join Tab ──────────────────────────────────────────────────── */}
          {activeTab === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Open Studies */}
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-white">الدراسات المفتوحة للمشاركة</h2>
                  <p className="text-sm text-white/40">يمكنك الانضمام كباحث شريك أو مقدّم عينات أو محكّم علمي</p>
                  <div className="space-y-4">
                    {NATIONAL_STUDIES.filter(s => s.openForJoin).map(study => (
                      <div key={study.id} className="bg-[#0D1117] border border-white/8 hover:border-[#D4AF37]/30 rounded-[24px] p-5 space-y-3 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${STATUS_CONFIG[study.status].bg} ${STATUS_CONFIG[study.status].color}`}>
                              {STATUS_CONFIG[study.status].label}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-white/50">
                              {TYPE_CONFIG[study.type].label}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="text-[10px] text-white/30 font-bold">{study.currentN}/{study.targetN}</div>
                            <div className="h-1 w-24 bg-white/10 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${(study.currentN / study.targetN) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                        <h4 className="font-black text-white text-sm leading-snug">{study.title}</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed">{study.abstract.slice(0, 120)}...</p>
                        <div className="flex gap-2 flex-wrap">
                          {study.regions.slice(0, 3).map(r => (
                            <span key={r} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-lg text-[9px] text-white/40 font-bold">{r}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => { setJoinStudy(study); setShowJoinModal(true); }}
                          className="w-full py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-black text-xs transition-all"
                        >
                          طلب الانضمام للدراسة
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Propose a Study Form */}
                <div className="bg-[#0D1117] border border-[#D4AF37]/15 rounded-[28px] p-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-xl inline-block border border-[#D4AF37]/20">
                      اقتراح دراسة جديدة
                    </span>
                    <h3 className="text-xl font-black text-white">هل لديك مشروع بحثي وطني؟</h3>
                    <p className="text-sm text-white/40">قدّم دراستك للمنصة لتنسيق الجهود مع باحثين آخرين وجمع العينات والحصول على الدعم التقني</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'الاسم الكامل والدرجة العلمية', placeholder: 'مثال: أ.د. محمد بن علي', key: 'name' },
                      { label: 'المؤسسة الأكاديمية', placeholder: 'مثال: جامعة الجزائر 2 — مخبر...', key: 'institution' },
                      { label: 'البريد الإلكتروني الأكاديمي', placeholder: 'exemple@univ-alger.dz', key: 'email' },
                    ].map(field => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-[11px] font-black text-white/50 block">{field.label}</label>
                        <input
                          type="text"
                          value={(joinForm as any)[field.key]}
                          onChange={e => setJoinForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 text-white placeholder-white/20"
                        />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-white/50 block">الولاية / المنطقة</label>
                      <select
                        value={joinForm.region}
                        onChange={e => setJoinForm(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full bg-[#131311] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 text-white"
                      >
                        <option value="">اختر الولاية...</option>
                        {['الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'سطيف', 'تلمسان', 'بسكرة', 'ورقلة'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-white/50 block">ملخص المشروع البحثي المقترح</label>
                      <textarea
                        value={joinForm.message}
                        onChange={e => setJoinForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        placeholder="اشرح هدف الدراسة والمنهج المقترح والفئة المستهدفة..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 text-white placeholder-white/20 resize-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!joinForm.name || !joinForm.email) {
                          triggerToast('⚠️ يرجى ملء الحقول الإلزامية');
                          return;
                        }
                        setJoinSuccess(true);
                        triggerToast('✅ تم إرسال طلب المشاركة البحثية بنجاح!');
                        setTimeout(() => setJoinSuccess(false), 4000);
                        setJoinForm({ name: '', institution: '', email: '', role: 'researcher', region: '', message: '' });
                      }}
                      className="w-full py-4 bg-[#D4AF37] hover:bg-[#C4A027] text-[#0D1117] font-black text-sm rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
                    >
                      إرسال طلب المشاركة البحثية
                    </button>
                    {joinSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold text-center"
                      >
                        ✅ تم استلام طلبك بنجاح! سيتواصل معك فريق البحث خلال 48 ساعة.
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Join Study Modal ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showJoinModal && joinStudy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0D1117] border border-[#D4AF37]/25 rounded-[32px] p-8 w-full max-w-lg space-y-6 text-right relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                <div className="flex justify-between items-start">
                  <button
                    onClick={() => { setShowJoinModal(false); setJoinStudy(null); }}
                    className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all text-white/50"
                  >
                    <X size={18} />
                  </button>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">طلب انضمام للدراسة</span>
                    <h3 className="text-lg font-black text-white max-w-sm leading-snug">{joinStudy.title.slice(0, 60)}...</h3>
                    <p className="text-[10px] text-white/40 font-bold">{joinStudy.leadResearcher} — {joinStudy.institution.slice(0, 40)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'اسمك الكامل والرتبة', placeholder: 'د. / م. / أ. ...' },
                    { label: 'البريد الإلكتروني المؤسسي', placeholder: 'name@univ-*.dz' },
                    { label: 'المؤسسة والمخبر', placeholder: 'جامعة / معهد / مركز بحثي...' },
                  ].map((f, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-[10px] font-black text-white/40 block">{f.label}</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]/50 text-white placeholder-white/20"
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-white/40 block">دور المشاركة المقترح</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['باحث شريك', 'مجمّع عينات', 'محكّم علمي', 'مستشار إحصائي'].map(role => (
                        <button
                          key={role}
                          className="py-2 px-3 bg-white/5 hover:bg-[#D4AF37]/10 border border-white/5 hover:border-[#D4AF37]/30 text-white/60 hover:text-[#D4AF37] rounded-xl text-[10px] font-bold transition-all"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowJoinModal(false); setJoinStudy(null); }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 rounded-xl font-bold text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => {
                      setShowJoinModal(false);
                      setJoinStudy(null);
                      triggerToast('✅ تم إرسال طلب الانضمام! سيتواصل الباحث الرئيسي معك قريباً.');
                    }}
                    className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#C4A027] text-[#0D1117] font-black text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
                  >
                    إرسال طلب الانضمام
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// ── Study Cards Sub-Components ─────────────────────────────────────────────
const StudyCard: React.FC<{ study: NationalStudy; onView: () => void; onJoin: () => void }> = ({ study, onView, onJoin }) => {
  const cfg = STATUS_CONFIG[study.status];
  const typeCfg = TYPE_CONFIG[study.type];
  const TypeIcon = typeCfg.icon;
  const progress = Math.round((study.currentN / study.targetN) * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-[#0D1117] border border-white/8 hover:border-[#D4AF37]/30 rounded-[24px] p-5 space-y-4 transition-all cursor-pointer group"
      onClick={onView}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-white/50 flex items-center gap-1">
            <TypeIcon size={9} />
            {typeCfg.label}
          </span>
        </div>
        {study.openForJoin && (
          <span className="shrink-0 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-black">
            مفتوحة
          </span>
        )}
      </div>

      <h4 className="font-black text-white text-sm leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
        {study.title}
      </h4>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-white/40">
          <span>التقدم في جمع العينة</span>
          <span className="font-bold text-[#D4AF37]">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-[#D4AF37] to-[#C4A027] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="text-[9px] text-white/30 text-left">{study.currentN.toLocaleString('ar')} / {study.targetN.toLocaleString('ar')} مشارك</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-[10px] text-white/30 truncate max-w-[120px]">{study.leadResearcher}</div>
        {study.openForJoin && (
          <button
            onClick={e => { e.stopPropagation(); onJoin(); }}
            className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/25 text-[#D4AF37] rounded-lg font-black text-[9px] transition-all"
          >
            انضمام
          </button>
        )}
      </div>
    </motion.div>
  );
};

const StudyDetailCard: React.FC<{
  study: NationalStudy;
  isExpanded: boolean;
  onToggle: () => void;
  onJoin: () => void;
  onShare: () => void;
}> = ({ study, isExpanded, onToggle, onJoin, onShare }) => {
  const cfg = STATUS_CONFIG[study.status];
  const typeCfg = TYPE_CONFIG[study.type];
  const TypeIcon = typeCfg.icon;
  const progress = Math.round((study.currentN / study.targetN) * 100);

  return (
    <div className={`bg-[#0D1117] border rounded-[24px] transition-all overflow-hidden ${isExpanded ? 'border-[#D4AF37]/30' : 'border-white/8 hover:border-white/15'}`}>
      <div
        className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row gap-4 justify-between items-start"
        onClick={onToggle}
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
            <span className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-white/50 flex items-center gap-1">
              <TypeIcon size={9} />
              {typeCfg.label}
            </span>
            {study.waves > 1 && (
              <span className="px-2.5 py-1 rounded-lg border border-blue-500/20 bg-blue-500/8 text-[9px] font-black text-blue-400">
                {study.completedWaves}/{study.waves} موجات
              </span>
            )}
          </div>
          <h3 className="font-black text-white text-base leading-snug">{study.title}</h3>
          <p className="text-[11px] text-white/40">{study.leadResearcher} — {study.institution}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="text-lg font-black text-[#D4AF37]">{progress}%</div>
            <div className="text-[9px] text-white/30 font-bold">مكتمل</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-white">{study.currentN.toLocaleString('ar')}</div>
            <div className="text-[9px] text-white/30 font-bold">مشارك</div>
          </div>
          {isExpanded ? <ChevronUp size={18} className="text-[#D4AF37]" /> : <ChevronDown size={18} className="text-white/30" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-4">
                  <p className="text-sm text-white/60 leading-relaxed">{study.abstract}</p>
                  <div className="flex flex-wrap gap-2">
                    {study.variables.map(v => (
                      <span key={v} className="px-2.5 py-1 bg-white/5 border border-white/8 rounded-lg text-[10px] text-white/50 font-bold">{v}</span>
                    ))}
                  </div>
                  {study.findings && study.findings.length > 0 && (
                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">أبرز النتائج</span>
                      {study.findings.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                          <span className="text-[#D4AF37] shrink-0 mt-0.5">▸</span>
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'الفئة العمرية', value: study.ageRange + ' سنة', icon: Users },
                    { label: 'تاريخ البدء', value: study.startDate, icon: Calendar },
                    { label: 'المناطق', value: study.regions.slice(0, 3).join('، '), icon: MapPin },
                    ...(study.alphaScore ? [{ label: 'معامل ألفا (α)', value: study.alphaScore.toString(), icon: Activity }] : []),
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-white/50 font-bold flex items-center gap-1.5"><item.icon size={11} className="text-[#D4AF37]" />{item.label}</span>
                      <span className="text-white/70 font-bold text-left">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                {study.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-black/30 border border-white/5 rounded-lg text-[9px] text-white/30 font-bold">#{tag}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {study.openForJoin && (
                  <button
                    onClick={onJoin}
                    className="px-5 py-2.5 bg-[#D4AF37] text-[#0D1117] font-black text-xs rounded-xl hover:scale-105 transition-all"
                  >
                    طلب الانضمام
                  </button>
                )}
                <button
                  onClick={onShare}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <Share2 size={13} />
                  مشاركة الدراسة
                </button>
                <button
                  onClick={() => {}}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <Download size={13} />
                  تحميل الملخص
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NationalNormsPage;
