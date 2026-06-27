import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, X, AlertTriangle, Activity, Heart, Shield } from 'lucide-react';
import { getCases, createCase, PatientCase, CaseStatus } from '../../lib/clinic';
import { PatientCard } from '../../components/clinic/PatientCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { GlassCard } from '../../components/clinic/GlassCard';
import { EmptyState } from '../../components/clinic/EmptyState';
import { Modal } from '../../components/clinic/Modal';
import { toast } from 'react-hot-toast';

export const PatientsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<CaseStatus | 'all'>('all');
  const [allCases, setAllCases] = useState<PatientCase[]>(() => getCases());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [ageGroup, setAgeGroup] = useState('25-30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(2);
  const [risk, setRisk] = useState<'low' | 'moderate' | 'medium' | 'high' | 'critical'>('low');

  const filteredCases = useMemo(() => {
    return allCases.filter(c => {
      const matchesSearch = 
        (c.patientCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.reasonForVisit || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.currentSymptoms || []).some(s => (s || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTab = activeTab === 'all' || c.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [allCases, searchTerm, activeTab]);

  const stats = {
    all: allCases.length,
    active: allCases.filter(c => c.status === 'active').length,
    closed: allCases.filter(c => c.status === 'closed').length,
    "on-hold": allCases.filter(c => c.status === 'on-hold').length,
  };

  const handleOpenModal = () => {
    // Generate a beautiful default randomized patient code
    const randAlpha = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randNum = Math.floor(100 + Math.random() * 900);
    const randSuffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(10 + Math.random() * 90);
    setNewCode(`${randAlpha}${randNum}-${randSuffix}`);
    
    // Reset other fields
    setAgeGroup('25-30');
    setGender('male');
    setReason('');
    setHistory('');
    setSymptoms([]);
    setSymptomInput('');
    setSeverity(2);
    setRisk('low');
    
    setIsModalOpen(true);
  };

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = symptomInput.trim();
    if (clean && !symptoms.includes(clean)) {
      setSymptoms([...symptoms, clean]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (toRemove: string) => {
    setSymptoms(symptoms.filter(s => s !== toRemove));
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      toast.error('الرجاء إدخال كود المريض');
      return;
    }
    if (!reason.trim()) {
      toast.error('الرجاء كتابة سبب الزيارة أو الشكوى الرئيسية');
      return;
    }

    const created = createCase({
      patientCode: newCode.trim(),
      ageGroup,
      gender,
      reasonForVisit: reason.trim(),
      psychologicalHistory: history.trim(),
      currentSymptoms: symptoms.length > 0 ? symptoms : ['صداع ونقص تركيز'],
      severityLevel: severity,
      riskLevel: risk,
      status: 'active'
    });

    // Refresh core list state
    setAllCases(getCases());
    setIsModalOpen(false);
    toast.success(`تم تسجيل الحالة السريرية بنجاح تحت الكود الآمن: ${created.patientCode}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Header and Callout action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">منظومة الحالات السريرية والملفات الطبية</h1>
          <p className="text-xs text-psy-text/40">خصوصية مطلقة مع تشفير كامل لبيانات وهوية المريض.</p>
        </div>
        <GoldButton size="sm" onClick={handleOpenModal} className="w-full sm:w-auto">
          <Plus size={16} /> حالة سريرية جديدة
        </GoldButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/30" size={18} />
          <input 
            type="text"
            placeholder="ابحث بكود المريض، الأعراض السلوكية، أو الملف النفسي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121216]/60 border border-white/5 rounded-xl pr-12 pl-4 py-3 text-xs outline-none focus:border-[#D4B483] transition-all"
          />
        </div>

        <div className="flex bg-[#121216]/60 p-1.5 rounded-xl border border-white/5 scrollbar-thin overflow-x-auto gap-1">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={stats.all}>الكل</TabButton>
          <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} count={stats.active}>نشطة</TabButton>
          <TabButton active={activeTab === 'on-hold'} onClick={() => setActiveTab('on-hold')} count={stats['on-hold']}>معلقة</TabButton>
          <TabButton active={activeTab === 'closed'} onClick={() => setActiveTab('closed')} count={stats.closed}>مغلقة</TabButton>
        </div>
      </div>

      {/* Main Grid display / Empty state */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(c => (
            <PatientCard key={c.id} patientCase={c} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 md:p-20">
          <EmptyState 
            icon={Users} 
            title="لا توجد نتائج مطابقة لبحثك النفسي" 
            description="حاول تعديل شروط التصفية أو الكلمات المفتاحية، أو قم بإنشاء ملف حالة عيادية جديدة فوراً."
            actionText="تسجيل حالة جديدة الآن"
            onAction={handleOpenModal}
          />
        </GlassCard>
      )}

      {/* Upgrade Custom Patient Modal Dialog */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="إنشاء ملف مريض وسجل عيادي جديد"
      >
        <form onSubmit={handleSaveCase} className="space-y-6 text-right" dir="rtl">
          {/* Top Banner Alert */}
          <div className="p-3.5 bg-psy-gold/5 border border-psy-gold/15 rounded-xl text-[11px] text-psy-gold/90 font-bold flex gap-3 items-start">
            <Shield size={16} className="shrink-0 mt-0.5" />
            <p className="m-0 leading-relaxed">
              تحذير سري: يرجى عدم إدخال الاسم الحقيقي للمريض أو أي هوية مباشرة هنا. يعتمد النظام على التشفير اللفظي والأكواد الآمنة تلقائياً لموافقة قوانين HIPAA الطبية العالمية للخصوصية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input 1: Patient Code */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60">كود ترميز المريض الموجه (Clinical Code)</label>
              <input 
                type="text" 
                required 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="مثال: X92J-K12L"
                className="w-full bg-[#121218]/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:border-psy-gold outline-none"
              />
            </div>

            {/* Input 2: Age Group */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60">الفئة العمرية للمفحوص</label>
              <select 
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full bg-[#121218]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-psy-text focus:border-psy-gold outline-none"
              >
                <option value="تحت 18">تحت 18 عام (يافعين)</option>
                <option value="18-24">18 - 24 عاماً</option>
                <option value="25-30">25 - 30 عاماً</option>
                <option value="31-40">31 - 40 عاماً</option>
                <option value="41-50">41 - 50 عاماً</option>
                <option value="فوق 50">فوق 50 عاماً</option>
              </select>
            </div>
          </div>

          {/* Gender selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-psy-text/60">الجنس البيولوجي</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                  gender === 'male' 
                    ? 'bg-psy-gold/10 border-psy-gold text-psy-gold' 
                    : 'bg-white/5 border-white/5 text-psy-text/50 hover:bg-white/10'
                }`}
              >
                ذكر (Male)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                  gender === 'female' 
                    ? 'bg-psy-gold/10 border-psy-gold text-psy-gold' 
                    : 'bg-white/5 border-white/5 text-psy-text/50 hover:bg-white/10'
                }`}
              >
                أنثى (Female)
              </button>
            </div>
          </div>

          {/* Reason for visit */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-psy-text/60">الشكوى الأساسية وسبب الزيارة أو المقابلة العيادية الأولى</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب التقييم والتشخيص الأولي للسبب..."
              className="w-full bg-[#121218]/80 border border-white/5 rounded-xl p-4 text-xs font-sans focus:border-psy-gold outline-none"
            />
          </div>

          {/* Symptoms list tags manager */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-psy-text/60">حصر الأعراض السلوكية النشطة (Symptoms Manager)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="اكتب العَرَض مثل (أرق، نوبات ذعر، قلق مستمر) ثم اضغط إضافة..."
                className="flex-1 bg-[#121218]/80 border border-white/5 rounded-xl px-4 py-2 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSymptom(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                className="px-4 py-2 bg-psy-gold/15 text-psy-gold border border-psy-gold/15 rounded-xl text-xs hover:bg-psy-gold/25"
              >
                إضافة
              </button>
            </div>

            {/* Display Symptoms Chips list */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {symptoms.length === 0 ? (
                <span className="text-[10px] text-psy-text/30 italic">لم تضف أعراض بعد، سيتم تعيين أعراض افتراضية عند المتابعة.</span>
              ) : (
                symptoms.map(sym => (
                  <span key={sym} className="inline-flex items-center gap-1.5 bg-psy-gold/10 border border-psy-gold/15 text-psy-gold py-1 px-2.5 rounded-lg text-[10px] font-bold">
                    {sym}
                    <button type="button" onClick={() => removeSymptom(sym)} className="text-psy-gold/50 hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* History */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-psy-text/60">التاريخ المرضي والخلفية النفسية (بالغة السرية)</label>
            <textarea
              rows={2}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="سجل مختصر للمراجعات والانتكاسات أو التروما السابقة إن وُجدت..."
              className="w-full bg-[#121218]/80 border border-white/5 rounded-xl p-4 text-xs font-sans focus:border-psy-gold outline-none"
            />
          </div>

          {/* Severity & Risk Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-psy-text/60">مستوى الخطورة السلوكي (Risk Level)</label>
              <select 
                value={risk}
                onChange={(e) => setRisk(e.target.value as any)}
                className="w-full bg-[#121218]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-psy-text focus:border-psy-gold"
              >
                <option value="low">منخفض (Low Risk)</option>
                <option value="moderate">متوسط (Moderate)</option>
                <option value="medium">متزايد (Medium)</option>
                <option value="high">مرتفع حاد (High Risk)</option>
                <option value="critical">حرج جداً (Critical Case)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-psy-text/60">مستوى شدة العَرَض الحالي (Clinical Severity)</label>
                <span className="text-xs text-psy-gold font-black">{severity} / 4</span>
              </div>
              <input 
                type="range"
                min="1"
                max="4"
                step="1"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full xl:h-2 h-4 my-2.5 outline-none font-sans accent-psy-gold cursor-ew-resize bg-white/5 rounded-lg border border-white/5"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 py-3 border border-white/5 hover:bg-white/5 rounded-xl font-bold text-xs text-psy-text/50"
            >
              إلغاء الأمر
            </button>
            <GoldButton 
              type="submit" 
              className="flex-1 py-3 rounded-xl font-black text-xs"
            >
              حفظ وتأسيس الملف السري
            </GoldButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const TabButton = ({ children, active, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 ${
      active 
        ? 'bg-[#181816] text-[#D4B483] shadow-lg border border-[#D4B483]/20' 
        : 'text-psy-text/40 hover:text-psy-text'
    }`}
  >
    {children}
    <span className={`px-2 py-0.5 rounded-md text-[9px] ${active ? 'bg-[#D4B483]/20' : 'bg-white/5 text-psy-text/40'}`}>{count}</span>
  </button>
);
