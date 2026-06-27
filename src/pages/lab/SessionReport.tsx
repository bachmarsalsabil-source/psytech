import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSessions,
  getTests,
  TestSession,
  PsychTest,
  calculateCronbachAlpha
} from '../../lib/lab';
import { GlassCard } from '../../components/clinic/GlassCard';
import { BackButton } from '../../components/clinic/BackButton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  FileText,
  User,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
  Brain,
  History,
  Zap,
  MousePointer2,
  TrendingUp
} from 'lucide-react';

export const SessionReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<TestSession | null>(null);
  const [test, setTest] = useState<PsychTest | null>(null);

  useEffect(() => {
    const s = getSessions().find(x => x.id === id);
    if (s) {
      setSession(s);
      const t = getTests().find(x => x.id === s.testId);
      if (t) setTest(t);
    }
  }, [id]);

  if (!session || !test) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-[32px] p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-psy-gold/10 flex items-center justify-center text-psy-gold animate-pulse">
          <Brain size={32} />
        </div>
        <p className="text-psy-text/40 font-medium">جاري تحميل التقرير...</p>
      </div>
    </div>
  );

  const radarData = session.scales.map(s => ({
    subject: s.name,
    score: s.percentage,
    fullMark: 100
  }));

  const itemStats = session.responses.map(r => ({
    item: r.itemId.split('-').pop(),
    duration: r.duration / 1000,
    score: r.score
  }));

  const severityLabel =
    session.severity === 'extreme' ? 'مستوى حرج جداً' :
    session.severity === 'severe' ? 'مستوى حاد' :
    session.severity === 'moderate' ? 'مستوى متوسط' : 'مستوى طبيعي';

  const severityColor =
    session.severity === 'extreme' ? 'text-red-500' :
    session.severity === 'severe' ? 'text-orange-400' :
    session.severity === 'moderate' ? 'text-yellow-400' : 'text-emerald-400';

  const totalPossible = test.items.length * 4;
  const scorePercent = Math.round((session.totalScore / totalPossible) * 100);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto" dir="rtl">

      {/* ── Report Header ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-3">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-psy-gold/15 flex items-center justify-center text-psy-gold">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-psy-gold/70 uppercase tracking-widest">القياس النفسي</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-gold">تقرير القياس النفسي</h1>
          <p className="text-psy-text/40 text-sm">
            جلسة رقم: <span className="text-psy-text/60 font-bold">{session.id}</span>
            <span className="mx-2 text-psy-text/20">•</span>
            {new Date(session.completedAt).toLocaleString('ar-EG')}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button className="h-12 px-6 flex items-center gap-2 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10">
            <Download size={16} />
            تصوير التقرير
          </button>
          <button className="h-12 px-6 flex items-center gap-2 bg-psy-gold text-psy-bg rounded-2xl text-sm font-black shadow-lg shadow-psy-gold/20 hover:bg-psy-gold/90 transition-all">
            <Share2 size={16} />
            مشاركة مع الحالة
          </button>
        </div>
      </div>

      {/* ── Score Hero Card ─────────────────────────────── */}
      <div className="relative glass rounded-[32px] md:rounded-[40px] p-8 md:p-10 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-psy-gold/5 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          {/* Score ring */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#D4AF37" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${scorePercent * 2.64} 264`}
                />
              </svg>
              <div className="text-center">
                <div className="text-3xl font-black text-psy-gold">{scorePercent}%</div>
                <div className="text-[10px] text-psy-text/40 font-bold">الدرجة الكلية</div>
              </div>
            </div>
            <div className="text-xs text-psy-text/30 font-medium">
              {Math.round(session.totalScore)} / {totalPossible} نقطة
            </div>
          </div>

          {/* Key stats */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: User, label: 'المستجيب', value: session.userName, color: 'text-psy-text' },
              { icon: Clock, label: 'متوسط الزمن/بند', value: `${Math.round(session.behavioralAnalysis.averageSpeed / 1000)} ثا`, color: 'text-blue-400' },
              { icon: Brain, label: 'المقاييس', value: `${session.scales.length} أبعاد`, color: 'text-purple-400' },
              { icon: TrendingUp, label: 'مستوى الخطورة', value: severityLabel, color: severityColor },
              { icon: Activity, label: 'البنود', value: `${test.items.length} بند`, color: 'text-psy-text/60' },
              { icon: CheckCircle2, label: 'الموثوقية', value: session.behavioralAnalysis.straightliningDetected ? 'تحتاج مراجعة' : 'موثوقة', color: session.behavioralAnalysis.straightliningDetected ? 'text-orange-400' : 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={13} className="text-psy-text/30" />
                  <span className="text-[10px] text-psy-text/30 font-bold uppercase tracking-wide">{stat.label}</span>
                </div>
                <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left Sidebar ──────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Behavioral Analysis */}
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/8">
              <div className="w-9 h-9 rounded-xl bg-psy-gold/10 flex items-center justify-center text-psy-gold">
                <AlertCircle size={16} />
              </div>
              <h4 className="font-black text-psy-text text-sm">تحليل السلوك الاستجابي</h4>
            </div>
            <div className="space-y-4">
              <BehaviorBadge
                label="الموثوقية السلوكية"
                status={session.behavioralAnalysis.straightliningDetected ? 'risk' : 'good'}
                desc={session.behavioralAnalysis.straightliningDetected ? 'نمط استجابة خطي مكتشف' : 'لا يوجد نمط خطي'}
              />
              <BehaviorBadge
                label="سرعة الاستجابة"
                status={session.behavioralAnalysis.averageSpeed < 2000 ? 'risk' : 'good'}
                desc={session.behavioralAnalysis.averageSpeed < 2000 ? 'استجابة سريعة جداً' : 'سرعة طبيعية'}
              />
              <div className="pt-3 border-t border-white/5">
                <div className="text-[10px] text-psy-gold/60 uppercase tracking-widest font-bold mb-2">توصية المحلل الذكي</div>
                <p className="text-xs text-psy-text/50 leading-relaxed">
                  {session.behavioralAnalysis.straightliningDetected
                    ? 'يُنصح بإعادة الاختبار للاشتباه في نمط استجابة عشوائي أو غير جاد.'
                    : 'البيانات تظهر اتساقاً منطقياً في الاستجابة، يمكن الاعتماد على النتائج للتشخيص الأولي.'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Mini profile */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-psy-gold/10 flex items-center justify-center text-psy-gold">
                <User size={28} />
              </div>
              <div>
                <h3 className="font-bold text-psy-text">{session.userName}</h3>
                <p className="text-xs text-psy-text/40">رمز الحالة: {session.userId || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <SummaryItem icon={Clock} label="مدة الاختبار" value={`${Math.round(session.behavioralAnalysis.averageSpeed / 1000)} ثانية/بند`} />
              <SummaryItem icon={Activity} label="الدرجة المعيارية" value={`${Math.round(session.totalScore)} / ${totalPossible}`} />
              <SummaryItem icon={Brain} label="إجمالي المقاييس" value={session.scales.length} />
            </div>
          </GlassCard>
        </div>

        {/* ── Main Charts & Analysis ──────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Scale scores with progress bars */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-black text-psy-text mb-6 flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full bg-psy-gold" />
              تحليل الأبعاد النفسية
            </h3>
            <div className="space-y-5">
              {session.scales.map(scale => {
                const barColor =
                  scale.percentage > 70 ? 'bg-red-500' :
                  scale.percentage > 40 ? 'bg-orange-400' : 'bg-emerald-500';
                return (
                  <div key={scale.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="font-bold text-sm text-psy-text">{scale.name}</div>
                        <div className="text-xs text-psy-text/40">{scale.interpretation}</div>
                      </div>
                      <div className={`text-2xl font-black ${
                        scale.percentage > 70 ? 'text-red-500' :
                        scale.percentage > 40 ? 'text-orange-400' : 'text-emerald-400'
                      }`}>
                        {Math.round(scale.percentage)}%
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${scale.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h4 className="font-bold text-sm text-psy-text mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-psy-gold" />
                البصمة النفسية
              </h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                    <Radar name="الدرجة" dataKey="score" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h4 className="font-bold text-sm text-psy-text mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                زمن الاستجابة/بند (ثانية)
              </h4>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={itemStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="item" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#181816', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                    <Bar dataKey="duration" fill="#D4AF37" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Clinical summary */}
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-black text-psy-text flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full bg-psy-gold" />
              الخلاصة الإكلينيكية والتوصيات
            </h3>

            <div className="p-5 bg-white/3 rounded-2xl border border-white/8 leading-relaxed text-sm text-psy-text/60">
              بناءً على إجمالي النقاط ({Math.round(session.totalScore)}) وتوزيعها على المقاييس الفرعية، تظهر النتائج{' '}
              <span className={`font-black mx-1 ${severityColor}`}>{severityLabel}</span>
              {' '}في المعايير المقاسة. من الضروري مقابلة الحالة لمناقشة هذه النتائج في سياق التاريخ العيادي.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendationCard
                type="clinical"
                title="التوجهات العلاجية"
                suggestion="يُنصح بالبدء بجلسات تفريغ انفعالي تقييمية قبل البدء في CBT."
              />
              <RecommendationCard
                type="followup"
                title="المتابعة"
                suggestion="إعادة المقياس بعد 4 أسابيع من الخطة العلاجية لقياس فاعلية التدخل."
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3 text-psy-text/40">
      <Icon size={14} />
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-sm font-bold text-psy-text">{value}</span>
  </div>
);

const BehaviorBadge = ({ label, status, desc }: any) => (
  <div className="flex items-center gap-3 p-3 bg-white/3 rounded-2xl border border-white/5">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
      status === 'good' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
    }`}>
      {status === 'good' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    </div>
    <div>
      <div className="text-[10px] text-psy-text/30 font-bold uppercase tracking-wide">{label}</div>
      <div className="text-xs font-bold text-psy-text/70 mt-0.5">{desc}</div>
    </div>
  </div>
);

const RecommendationCard = ({ type, title, suggestion }: any) => (
  <div className={`p-5 rounded-2xl border ${
    type === 'clinical'
      ? 'border-psy-gold/20 bg-psy-gold/5'
      : 'border-blue-500/20 bg-blue-500/5'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      {type === 'clinical'
        ? <Zap className="text-psy-gold" size={14} />
        : <History className="text-blue-400" size={14} />
      }
      <span className={`text-xs font-black ${type === 'clinical' ? 'text-psy-gold/80' : 'text-blue-400/80'}`}>
        {title}
      </span>
    </div>
    <p className="text-xs text-psy-text/50 leading-relaxed">{suggestion}</p>
  </div>
);
