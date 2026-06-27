import React, { useState, useEffect } from 'react';
import { 
  PsychTest, 
  TestSession, 
  QuestionType,
  startTestSession,
  submitResponse,
  completeSession,
} from '../../lib/lab';
import { getCurrentUser } from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Clock,
  AlertCircle,
  CheckCircle2,
  Gift,
  Check,
  User,
  MapPin,
  GraduationCap,
  Sparkles,
  Settings2,
  ChevronDown
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

// ─── Likert Preset Types ──────────────────────────────────────────────────────
interface LikertOption {
  value: number;
  label: string;
  color?: string;
}

interface LikertPreset {
  id: string;
  name: string;
  description: string;
  options: LikertOption[];
}

const LIKERT_PRESETS: LikertPreset[] = [
  {
    id: 'agreement_5',
    name: 'سلم الموافقة الخماسي',
    description: 'من "موافق بشدة" إلى "غير موافق بشدة"',
    options: [
      { value: 5, label: 'موافق بشدة' },
      { value: 4, label: 'موافق' },
      { value: 3, label: 'محايد' },
      { value: 2, label: 'غير موافق' },
      { value: 1, label: 'غير موافق بشدة' },
    ]
  },
  {
    id: 'frequency_5',
    name: 'سلم التكرار الخماسي',
    description: 'من "دائماً" إلى "أبداً"',
    options: [
      { value: 5, label: 'دائماً' },
      { value: 4, label: 'غالباً' },
      { value: 3, label: 'أحياناً' },
      { value: 2, label: 'نادراً' },
      { value: 1, label: 'أبداً' },
    ]
  },
  {
    id: 'frequency_3',
    name: 'سلم التكرار الثلاثي',
    description: 'دائماً / أحياناً / أبداً',
    options: [
      { value: 3, label: 'دائماً' },
      { value: 2, label: 'أحياناً' },
      { value: 1, label: 'أبداً' },
    ]
  },
  {
    id: 'agreement_3',
    name: 'سلم الموافقة الثلاثي',
    description: 'موافق / محايد / غير موافق',
    options: [
      { value: 3, label: 'موافق' },
      { value: 2, label: 'محايد' },
      { value: 1, label: 'غير موافق' },
    ]
  },
  {
    id: 'importance_5',
    name: 'سلم الأهمية الخماسي',
    description: 'من "مهم جداً" إلى "غير مهم إطلاقاً"',
    options: [
      { value: 5, label: 'مهم جداً' },
      { value: 4, label: 'مهم' },
      { value: 3, label: 'محايد' },
      { value: 2, label: 'غير مهم' },
      { value: 1, label: 'غير مهم إطلاقاً' },
    ]
  },
  {
    id: 'satisfaction_5',
    name: 'سلم الرضا الخماسي',
    description: 'من "راضٍ جداً" إلى "غير راضٍ إطلاقاً"',
    options: [
      { value: 5, label: 'راضٍ جداً' },
      { value: 4, label: 'راضٍ' },
      { value: 3, label: 'محايد' },
      { value: 2, label: 'غير راضٍ' },
      { value: 1, label: 'غير راضٍ إطلاقاً' },
    ]
  },
  {
    id: 'binary_yes_no',
    name: 'ثنائي: نعم / لا',
    description: 'إجابة ثنائية مباشرة',
    options: [
      { value: 2, label: 'نعم' },
      { value: 1, label: 'لا' },
    ]
  },
  {
    id: 'binary_true_false',
    name: 'ثنائي: صحيح / خاطئ',
    description: 'استجابة تقييمية ثنائية',
    options: [
      { value: 2, label: 'صحيح' },
      { value: 1, label: 'خاطئ' },
    ]
  }
];

// ─── Component Props ──────────────────────────────────────────────────────────
interface LabTestPlayerProps {
  test: PsychTest;
  mode: 'preview' | 'live';
  onComplete?: (session: TestSession) => void;
  onClose?: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const LabTestPlayer: React.FC<LabTestPlayerProps> = ({ test, mode, onComplete, onClose }) => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  // ── Likert Scale Selection State ──────────────────────────────────
  const [selectedPresetId, setSelectedPresetId] = useState<string>('agreement_5');
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [hasSelectedPreset, setHasSelectedPreset] = useState(true);

  const currentPreset = LIKERT_PRESETS.find(p => p.id === selectedPresetId) || LIKERT_PRESETS[0];

  // ── Demographic Form States ───────────────────────────────────────
  const [demoForm, setDemoForm] = useState({
    age: '24',
    gender: 'أنثى',
    education: 'ماستر علم النفس الإكلينيكي',
    region: 'الجزائر العاصمة'
  });
  const [hasFilledDemo, setHasFilledDemo] = useState(false);
  const [labState, setLabState] = useState<any>(null);
  const [demoError, setDemoError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('psytech_lab_pro');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.testData && parsed.testData.id === test.id) {
          setLabState(parsed);
          if (parsed.recruitment && parsed.recruitment.scalePreset) {
            setSelectedPresetId(parsed.recruitment.scalePreset);
          }
        }
      } catch (e) {
        console.error("Error loading lab state in player:", e);
      }
    }
    // Load persisted preset if available
    const storedPreset = localStorage.getItem(`psytech_scale_preset_${test.id}`);
    if (storedPreset && LIKERT_PRESETS.find(p => p.id === storedPreset)) {
      setSelectedPresetId(storedPreset);
    }
  }, [test.id]);

  useEffect(() => {
    const newSession = startTestSession(
      test.id,
      user?.id || 'temp-user',
      user?.fullName || 'عضو زائر'
    );
    setSession(newSession);
    setStartTime(Date.now());
  }, [test.id, user?.id]);

  if (!session || !test.items.length) return null;

  const currentItem = test.items[currentIndex];
  if (!currentItem) return null;

  const handleSelectOption = (value: number) => {
    if (!session) return;
    const duration = Date.now() - startTime;
    const updatedSession = submitResponse(session, currentItem.id, value, duration);
    setSession(updatedSession);
    if (currentIndex < test.items.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setStartTime(Date.now());
      }, 280);
    }
  };

  const handleFinish = () => {
    if (!session) return;
    const finalSession = completeSession(session);
    setIsFinished(true);

    const ageNum = parseInt(demoForm.age) || 24;
    const genderText = demoForm.gender || 'أنثى';
    const eduText = demoForm.education || 'بكالوريوس علم النفس';
    const regText = demoForm.region || 'الجزائر العاصمة';
    const rawAnswers = test.items.map(item => {
      const resp = session.responses.find(r => r.itemId === item.id);
      return resp && typeof resp.answer === 'number' ? resp.answer : 3;
    });

    let rewardText = 'مساهمة تطوعية';
    const saved = localStorage.getItem('psytech_lab_pro');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.testData && parsed.testData.id === test.id) {
          if (parsed.recruitment.rewardType === 'monetary') {
            rewardText = `شهادة + ${parsed.recruitment.rewardValue || 150} دج`;
          } else if (parsed.recruitment.rewardType === 'certificate') {
            rewardText = 'شهادة مشاركة معتمدة';
          }

          const existingResponsesLst = parsed.recruitment.responses || [];
          const existingIdsSet = new Set(existingResponsesLst.map((r: any) => r.id));
          let finalNum = 101;
          while (existingIdsSet.has(`SUB-${finalNum}`)) { finalNum++; }
          const finalId = `SUB-${finalNum}`;

          const responseItem = {
            id: finalId,
            age: ageNum,
            gender: genderText,
            education: eduText,
            region: regText,
            incentive: rewardText,
            scalePreset: currentPreset.name,
            timestamp: new Date().toLocaleTimeString('ar-DZ') + ' ' + new Date().toLocaleDateString('ar-DZ'),
            valid: true,
            data: rawAnswers
          };

          parsed.recruitment.responses = [responseItem, ...(parsed.recruitment.responses || [])];
          parsed.recruitment.current = parsed.recruitment.responses.length;
          localStorage.setItem('psytech_lab_pro', JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error saving participant responses back to lab storage:", e);
      }
    }

    if (mode === 'live') {
      fetch('/api/testbuilder/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: { age: ageNum, gender: genderText, education: eduText, region: regText, incentive: rewardText, scalePreset: currentPreset.name, data: rawAnswers }
        })
      })
      .then(res => res.json())
      .then(data => console.log("Response synced:", data))
      .catch(err => console.error("Sync failed:", err));
    }

    if (onComplete) {
      setTimeout(() => onComplete(finalSession), 2000);
    }
  };

  const progress = !hasFilledDemo ? 0 : ((currentIndex + 1) / test.items.length) * 100;

  // ── Render: Scale Preset Selection Screen ─────────────────────────
  const renderPresetSelector = () => (
    <motion.div
      key="preset-select"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar py-2 text-right"
    >
      <div className="bg-psy-gold/5 border border-psy-gold/20 p-6 rounded-3xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-psy-gold text-psy-bg px-3 py-1 rounded-br-2xl text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
          <Settings2 size={10} className="animate-pulse" /> اختر نمط الإجابة
        </div>
        <h2 className="text-2xl font-black text-psy-gold pt-4">تحديد سلّم الإجابة</h2>
        <p className="text-xs text-psy-text/60 leading-relaxed">
          اختر نمط الخيارات الذي سيظهر لجميع المشاركين أثناء الإجابة على بنود المقياس. يمكن للباحث تغيير هذا الإعداد في أي وقت.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LIKERT_PRESETS.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setSelectedPresetId(preset.id)}
            className={`p-4 rounded-2xl border text-right transition-all space-y-2 ${
              selectedPresetId === preset.id
                ? 'bg-psy-gold/10 border-psy-gold shadow-[0_0_18px_rgba(212,175,55,0.2)]'
                : 'bg-white/5 border-white/5 hover:border-psy-gold/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedPresetId === preset.id ? 'border-psy-gold bg-psy-gold' : 'border-white/20'
              }`}>
                {selectedPresetId === preset.id && <Check size={10} className="text-psy-bg" />}
              </div>
              <span className="text-sm font-black text-psy-text">{preset.name}</span>
            </div>
            <p className="text-[10px] text-psy-text/50">{preset.description}</p>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {preset.options.map(opt => (
                <span
                  key={opt.value}
                  className="px-2 py-0.5 bg-black/30 rounded-md text-[9px] font-bold text-psy-text/60 border border-white/5"
                >
                  {opt.label}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <p className="text-[10px] text-psy-text/40 leading-relaxed max-w-xs">
          السلّم المحدد: <strong className="text-psy-gold">{currentPreset.name}</strong> — سيتم تطبيقه على جميع بنود المقياس
        </p>
        <GoldButton
          onClick={() => {
            localStorage.setItem(`psytech_scale_preset_${test.id}`, selectedPresetId);
            setHasSelectedPreset(true);
          }}
        >
          تأكيد السلّم والمتابعة <ChevronLeft size={16} />
        </GoldButton>
      </div>
    </motion.div>
  );

  // ── Render: Demographics Form ─────────────────────────────────────
  const renderDemoForm = () => (
    <motion.div
      key="demographics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 no-scrollbar py-2 text-right"
    >
      <div className="bg-psy-gold/5 border border-psy-gold/20 p-6 rounded-3xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 bg-psy-gold text-psy-bg px-3 py-1 rounded-br-2xl text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
          <Sparkles size={10} className="animate-pulse" /> بوابة استقطاب المشاركين الميدانية
        </div>
        <h2 className="text-2xl font-black text-psy-gold pt-2">استمارة المشاركة وجمع العينات</h2>
        <p className="text-xs text-psy-text/60 leading-relaxed">
          مرحباً بك في الاستبيان السيكومتري لغرض المعايرة والتقنين الميداني. يرجى توفير بيانات دقيقة للاحتساب الإحصائي.
        </p>
        {/* Scale Preset Badge */}
        <div className="inline-flex items-center gap-2 bg-psy-gold/10 border border-psy-gold/25 px-3 py-1.5 rounded-xl">
          <Settings2 size={12} className="text-psy-gold" />
          <span className="text-[10px] font-black text-psy-gold">نمط الإجابة المحدد: {currentPreset.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-4">
          <div className="w-12 h-12 bg-psy-gold/10 rounded-xl flex items-center justify-center text-psy-gold shrink-0">
            <User size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-psy-text/40 block">المجتمع والعينة المستهدفة</span>
            <span className="text-xs font-bold text-psy-text/80">{labState?.recruitment?.sampleType || 'مفتوح لكافة شرائح المجتمع من ممارسين وطلبة ديموغرافياً'}</span>
          </div>
        </div>

        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
            <Gift size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-psy-text/40 block">التعويضات والحوافز المالية المخصصة</span>
            <span className="text-xs font-bold text-emerald-400">
              {labState?.recruitment?.rewardType === 'monetary'
                ? `تعويض مالي بقيمة ${labState?.recruitment?.rewardValue || 150} دج + شهادة مساهمة`
                : labState?.recruitment?.rewardType === 'certificate'
                ? 'شهادة مشاركة علمية موثقة وممضية بختم المخبر السيكومتري'
                : 'مساهمة وطنية تطوعية لدعم دراسات التقنين النفسي'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-6 md:p-8 rounded-[30px] border border-white/10 space-y-6">
        <h3 className="font-black text-sm text-psy-gold flex items-center gap-2">
          <User size={16} /> المعلومات الديموغرافية والبيبليوغرافية (الخدمة الإجبارية للتقنين)
        </h3>

        {demoError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={14} /> {demoError}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60 block mb-1">الجنس</label>
              <div className="grid grid-cols-2 gap-3">
                {['ذكر', 'أنثى'].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setDemoForm(prev => ({ ...prev, gender: g }))}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      demoForm.gender === g
                        ? 'bg-psy-gold/10 border-psy-gold text-psy-gold'
                        : 'bg-black/20 border-white/5 text-psy-text/40 hover:border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60 block mb-1">السن والعمر الحالي</label>
              <div className="relative">
                <input
                  type="number"
                  value={demoForm.age}
                  onChange={(e) => setDemoForm(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="مثال: 24"
                  className="w-full bg-black/20 p-3 pr-10 border border-white/5 rounded-xl text-xs outline-none focus:border-psy-gold text-psy-text font-bold"
                />
                <User size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-psy-text/40" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60 block mb-1">المستوى الفكري والمسار الأكاديمي</label>
              <div className="relative">
                <select
                  value={demoForm.education}
                  onChange={(e) => setDemoForm(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full bg-[#1e1e1c] p-3 pr-10 border border-white/5 rounded-xl text-xs outline-none focus:border-psy-gold text-psy-text font-bold"
                >
                  <option value="ماستر علم النفس الإكلينيكي">ماستر عيادي / إكلينيكي</option>
                  <option value="ليسانس علم النفس">ليسانس العلوم الاجتماعية</option>
                  <option value="دكتوراه سيكولوجيا">دكتوراه علوم صحية ونفسية</option>
                  <option value="أخصائي وممارس نفسي">أخصائي نفساني ممارس</option>
                  <option value="بكالوريا فما دون">طالب جامعي تخصص آخر / بكالوريا</option>
                </select>
                <GraduationCap size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-psy-text/40" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60 block mb-1">ولاية الإقامة بالجزائر</label>
              <div className="relative">
                <input
                  type="text"
                  value={demoForm.region}
                  onChange={(e) => setDemoForm(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="مثال: الجزائر العاصمة، وهران، قسنطينة..."
                  className="w-full bg-black/20 p-3 pr-10 border border-white/5 rounded-xl text-xs outline-none focus:border-psy-gold text-psy-text font-bold"
                />
                <MapPin size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-psy-text/40" />
              </div>
              <div className="flex gap-1.5 flex-wrap pt-1.5 justify-end">
                {['الجزائر العاصمة', 'وهران', 'عنابة', 'قسنطينة', 'سطيف', 'تلمسان'].map(city => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => setDemoForm(prev => ({ ...prev, region: city }))}
                    className="px-2 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-psy-text/50 hover:bg-psy-gold/10 hover:text-psy-gold transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
        <p className="text-[10px] text-psy-text/40 text-center md:text-right leading-relaxed max-w-md">
          🔒 ميثاق السرية وحماية الهوية: كافة البيانات المجمعة محمية تماماً وتستخدم حصرياً للمعالجة السيكومترية والتحليل الإحصائي.
        </p>
        <div className="shrink-0">
          <GoldButton
            onClick={() => {
              if (!demoForm.age || parseInt(demoForm.age) < 10 || parseInt(demoForm.age) > 100) {
                setDemoError('يرجى كتابة عمر صحيح بين 10 و 100 سنة');
                return;
              }
              if (!demoForm.region.trim()) {
                setDemoError('يرجى تحديد ولاية أو مكان الإقامة لغرض التوزيع الجغرافي');
                return;
              }
              setDemoError('');
              setHasFilledDemo(true);
              setStartTime(Date.now());
            }}
          >
            موافقة وبدء الإجابة السيكومترية الآن <ChevronLeft size={16} />
          </GoldButton>
        </div>
      </div>
    </motion.div>
  );

  // ── Render: Question Screen ───────────────────────────────────────
  const renderQuestion = () => (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-10 animate-in duration-350 ease-out"
    >
      {/* Scale preset info bar */}
      <div className="flex items-center justify-between bg-white/3 rounded-2xl px-4 py-2.5 border border-white/5">
        <span className="text-[10px] text-psy-text/40 font-bold flex items-center gap-1.5">
          <Settings2 size={10} />
          {currentPreset.name}
        </span>
        <span className="text-xs font-bold text-psy-gold uppercase tracking-widest">بند {currentIndex + 1} من {test.items.length}</span>
        <div className="flex items-center gap-2 text-xs text-psy-text/40">
          <Clock size={14} />
          <span>{Math.round((Date.now() - startTime) / 1000)} ث</span>
        </div>
      </div>

      {/* Question Text */}
      <h3 className="text-3xl font-black leading-tight text-right">{currentItem.questionText}</h3>

      {/* Dynamic Likert Options from selected preset */}
      <div className={`grid gap-3 ${currentPreset.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {currentPreset.options.map((opt, idx) => {
          const isSelected = session.responses.find(r => r.itemId === currentItem.id)?.answer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelectOption(opt.value)}
              className={`p-5 rounded-2xl border text-right transition-all flex justify-between items-center group ${
                isSelected
                  ? 'bg-psy-gold text-psy-bg border-psy-gold shadow-[0_0_20px_rgba(212,165,116,0.3)]'
                  : 'bg-white/5 border-white/5 hover:border-psy-gold/50 hover:bg-white/8'
              }`}
            >
              <span className={`text-xs opacity-40 font-mono ${isSelected ? 'text-psy-bg' : ''}`}>
                {indexToAlpha(idx)}
              </span>
              <span className="text-lg font-bold">{opt.label}</span>
              {isSelected && <Check size={18} className="text-psy-bg shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-white/5">
        <button
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex(prev => prev - 1);
            setStartTime(Date.now());
          }}
          className="flex items-center gap-2 text-psy-text/40 hover:text-psy-gold disabled:opacity-0 transition-opacity"
        >
          <ChevronRight size={20} /> السابق
        </button>

        {currentIndex === test.items.length - 1 ? (
          <GoldButton
            onClick={handleFinish}
            disabled={session.responses.length < test.items.length}
          >
            إرسال الإجابات والنتائج <Send size={18} />
          </GoldButton>
        ) : (
          <button
            onClick={() => {
              setCurrentIndex(prev => prev + 1);
              setStartTime(Date.now());
            }}
            className="flex items-center gap-2 text-psy-gold hover:underline font-bold animate-pulse"
          >
            السؤال التالي <ChevronLeft size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );

  // ── Render: Finished Screen ───────────────────────────────────────
  const renderFinished = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={48} />
      </div>
      <div className="space-y-3">
        <h3 className="text-3xl font-black">اكتمل إرسال استجابتك بنجاح!</h3>
        <p className="text-psy-text/60 max-w-md mx-auto text-xs leading-relaxed">
          شكراً لمساهمتك العلمية القيمة! تم تشفير استجابتك وجاري مواءمتها في لوحة الإحصائيات مع سائر أفراد عينة البحث لدى المختبر.
        </p>
        <div className="inline-block bg-psy-gold/10 border border-psy-gold/20 px-4 py-2 rounded-xl text-xs text-psy-gold font-bold mt-2">
          السلّم المستخدم: {currentPreset.name}
        </div>
      </div>
      <div className="pt-8 flex justify-center gap-4">
        <GoldButton variant="secondary" onClick={onClose}>إغلاق المقياس</GoldButton>
        <GoldButton onClick={() => navigate(`/lab/report/${session.id}`)}>عرض التحليل السيكومتري الفوري</GoldButton>
      </div>
    </motion.div>
  );

  // ── Main Render ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] bg-[#181816]/95 backdrop-blur-xl flex flex-col p-8 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-psy-gold">{test.title}</h2>
          <p className="text-xs text-psy-text/40">{test.category} • {mode === 'preview' ? 'تجربة المقياس' : 'جلسة قياس نشطة مستمرة'}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-psy-text/40 hover:text-psy-text">
          <X size={24} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center gap-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose scale preset */}
          {!hasSelectedPreset ? renderPresetSelector() :
          /* Step 2: Demographic form */
          !hasFilledDemo ? renderDemoForm() :
          /* Step 3: Questions */
          !isFinished ? renderQuestion() :
          /* Step 4: Done */
          renderFinished()}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-4 space-y-2">
        <div className="flex justify-between text-[10px] text-psy-text/40 font-bold uppercase tracking-widest">
          <span>نسبة الاستكمال والتعمير</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-psy-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

const indexToAlpha = (index: number) => String.fromCharCode(65 + index);
