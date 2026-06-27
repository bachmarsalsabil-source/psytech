import React, { useState } from 'react';
import { StudyBuilder } from '../../components/lab/StudyBuilder';
import { StudyCard } from '../../components/lab/StudyCard';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { 
  Plus, Search, ChevronRight, Users, CheckCircle, Clock, 
  ClipboardCheck, Activity, FileText, Share2, Globe, Calendar, 
  ArrowLeft, Info, HelpCircle, ShieldAlert, BarChart3, Settings,
  FlaskConical
} from 'lucide-react';
import { getStudies, saveStudy } from '../../lib/lab';
import { GoldButton } from '../../components/clinic/GoldButton';
import { GlassCard } from '../../components/clinic/GlassCard';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const StudiesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const studies = getStudies();

  // Selected Study Logic
  const study = id ? studies.find(s => s.id === id) : null;

  // Mock participants for demonstration
  const [participants, setParticipants] = useState([
    { id: 'PAR-402', name: 'يوسف بن براهيم', email: 'y.brahim@univ-alger.dz', consentSigned: true, status: 'completed', date: '2026-06-20' },
    { id: 'PAR-119', name: 'نسرين بو طيبة', email: 'nesrine@gmail.com', consentSigned: true, status: 'progress', date: '2026-06-22' },
    { id: 'PAR-883', name: 'أ. د. جيلالي فاسي', email: 'fassi_jelali@clinic.dz', consentSigned: true, status: 'completed', date: '2026-06-23' },
    { id: 'PAR-042', name: 'سناء بن سعيد', email: 'sana.saeed@outlook.com', consentSigned: false, status: 'invited', date: '2026-06-24' }
  ]);

  const handleAddParticipant = () => {
    const name = prompt('أدخل اسم المشارك الجديد:');
    const email = prompt('أدخل البريد الإلكتروني للمشارك:');
    if (name && email) {
      setParticipants(prev => [
        ...prev,
        {
          id: `PAR-${Math.floor(100 + Math.random() * 900)}`,
          name,
          email,
          consentSigned: true,
          status: 'progress',
          date: new Date().toISOString().split('T')[0]
        }
      ]);
      toast.success('تمت إضافة المشارك ودعوته بنجاح! ✉️');
    }
  };

  const copyInviteLink = () => {
    if (study) {
      const link = `${window.location.origin}/public-test/${study.tests?.[0] || 'default-test'}`;
      navigator.clipboard.writeText(link);
      toast.success('تم نسخ رابط دعوة المشاركين بنجاح! 🔗');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة حالياً 🟢';
      case 'planning': return 'قيد التخطيط ⏳';
      case 'completed': return 'مكتملة 🔱';
      default: return 'نشطة 🟢';
    }
  };

  const getStudyTypeText = (type: string) => {
    switch (type) {
      case 'experimental': return 'تجريبي';
      case 'quasi_experimental': return 'شبه تجريبي';
      case 'correlational': return 'ارتباطي';
      case 'descriptive': return 'وصفي';
      case 'longitudinal': return 'طولي';
      default: return 'تجريبي';
    }
  };

  if (id && !study) {
    return (
      <>
        <div className="space-y-6 text-center py-20 glass rounded-[40px]" dir="rtl">
          <ShieldAlert className="mx-auto text-red-500" size={48} />
          <h2 className="text-2xl font-bold">الدراسة المطلوبة غير موجودة</h2>
          <p className="text-psy-text/40">تأكد من صحة الرابط أو رمز التعرف الخاص بالدراسة.</p>
          <GoldButton onClick={() => navigate('/lab/studies')}>العودة لقائمة الدراسات</GoldButton>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500" dir="rtl">
        {study ? (
          // STUDY DETAILS VIEW
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <LabBackButton to="/lab/studies" label="العودة للدراسات" />
              <span className="text-xs font-black text-psy-gold bg-psy-gold/10 border border-psy-gold/20 px-4 py-1.5 rounded-full">
                معرّف الدراسة: {study.shortCode || study.id}
              </span>
            </div>

            {/* Header Banner */}
            <div className="relative glass rounded-[40px] p-8 md:p-10 border-r-4 border-psy-gold overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 text-right">
                <span className="text-[9.5px] font-black text-psy-gold bg-psy-gold/10 px-3.5 py-1.5 rounded-full border border-psy-gold/25 uppercase inline-block">
                  إدارة حوكمة المشروع البحثي
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {study.title}
                </h1>
                <p className="text-xs text-psy-text/50 max-w-3xl leading-relaxed">
                  {study.researchGoal || 'لا يوجد وصف متاح لهذه الدراسة.'}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Right Panel (2 cols): Details & Participants */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Methodology & Variables Card */}
                <GlassCard className="p-8 space-y-6">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FlaskConical size={18} className="text-psy-gold" />
                    <span>الإطار المنهجي والفرضيات</span>
                  </h3>
                  
                  <div className="space-y-4 text-sm leading-relaxed">
                    <div>
                      <h4 className="font-bold text-psy-gold mb-1">فرضية الدراسة الأساسية:</h4>
                      <p className="text-xs text-psy-text/70">{study.hypothesis || 'لا توجد فرضية مسجلة.'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <h4 className="font-bold text-white mb-1.5 text-xs">المتغيرات المستقلة:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {study.variables?.independent?.map((v, idx) => (
                            <span key={idx} className="text-[10px] bg-white/5 border border-white/10 text-psy-text/80 px-2.5 py-1 rounded-xl">{v}</span>
                          )) || <span className="text-xs text-psy-text/40">لا توجد</span>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1.5 text-xs">المتغيرات التابعة:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {study.variables?.dependent?.map((v, idx) => (
                            <span key={idx} className="text-[10px] bg-psy-gold/10 border border-psy-gold/20 text-psy-gold px-2.5 py-1 rounded-xl">{v}</span>
                          )) || <span className="text-xs text-psy-text/40">لا توجد</span>}
                        </div>
                      </div>
                    </div>

                    {study.methodology && (
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="font-bold text-psy-gold mb-1">المنهجية المتبعة:</h4>
                        <p className="text-xs text-psy-text/70">{study.methodology}</p>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Participants Management Card */}
                <GlassCard className="p-8 space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-psy-gold" />
                      <h3 className="text-lg font-black text-white">العينة وتسيير المشاركين</h3>
                    </div>
                    <GoldButton size="sm" onClick={handleAddParticipant}>
                      <Plus size={16} /> إضافة مشارك
                    </GoldButton>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-psy-text/40 font-black">
                          <th className="pb-3 pr-2">المشارك</th>
                          <th className="pb-3">البريد الإلكتروني</th>
                          <th className="pb-3">الموافقة المستنيرة</th>
                          <th className="pb-3">الحالة</th>
                          <th className="pb-3 pl-2">تاريخ الانضمام</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-psy-text/80">
                        {participants.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition-all">
                            <td className="py-3.5 pr-2 font-bold text-white">{p.name}</td>
                            <td className="py-3.5 font-mono">{p.email}</td>
                            <td className="py-3.5">
                              {p.consentSigned ? (
                                <span className="text-emerald-400 font-bold">موقعة ✓</span>
                              ) : (
                                <span className="text-red-400 font-bold">غير موقعة ✗</span>
                              )}
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded-md font-bold ${
                                p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                p.status === 'progress' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                                'bg-white/5 text-[#a0a095]'
                              }`}>
                                {p.status === 'completed' ? 'مكتمل' : p.status === 'progress' ? 'قيد الإجابة' : 'مرسل'}
                              </span>
                            </td>
                            <td className="py-3.5 pl-2 text-psy-text/40">{p.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/5 justify-end">
                    <button 
                      onClick={() => toast.success('تمت مزامنة بيانات المشاركين حياً 🔄')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all"
                    >
                      مزامنة الاستجابات
                    </button>
                    <button 
                      onClick={() => toast.success('تم تصدير ملف مصفوفة البيانات SPSS بنجاح! 💾')}
                      className="px-4 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
                    >
                      تصدير SPSS/Excel
                    </button>
                  </div>
                </GlassCard>

              </div>

              {/* Left Panel (1 col): Status, Ethics & Links */}
              <div className="space-y-8">
                
                {/* Meta details */}
                <GlassCard className="p-6 space-y-4">
                  <h4 className="text-sm font-black border-b border-white/5 pb-2 text-psy-gold">معلومات الحوكمة</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-psy-text/40">حالة الدراسة:</span>
                      <span className="font-bold text-white">{getStatusText(study.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-psy-text/40">نوع التصميم:</span>
                      <span className="font-bold text-white">{getStudyTypeText(study.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-psy-text/40">العينة المستهدفة:</span>
                      <span className="font-bold text-white">{study.sampleSize || 60} مشارك</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-psy-text/40">أسلوب المعاينة:</span>
                      <span className="font-bold text-white">{study.samplingMethod === 'convenience' ? 'قصدي/ميسر' : 'عشوائي بسيط'}</span>
                    </div>
                    {study.ethicsApproval && (
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-psy-text/40">المؤسسة الأخلاقية:</span>
                          <span className="font-bold text-white">{study.ethicsApproval.institution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-psy-text/40">رقم الموافقة IRB:</span>
                          <span className="font-mono text-psy-gold">{study.ethicsApproval.approvalNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Invitation Link & QR Card */}
                <GlassCard className="p-6 space-y-6 text-center">
                  <h4 className="text-sm font-black border-b border-white/5 pb-2 text-right text-psy-gold flex items-center gap-1.5 justify-end">
                    <span>رابط الاستقطاب السريع</span>
                    <Share2 size={14} />
                  </h4>
                  
                  <div className="bg-white p-4 rounded-3xl mx-auto w-fit">
                    <div className="w-36 h-36 bg-psy-bg flex items-center justify-center text-psy-gold border border-psy-gold/20 rounded-2xl">
                      <Globe size={64} className="animate-pulse" />
                    </div>
                  </div>
                  
                  <p className="text-[10.5px] text-psy-text/40">
                    شارك الباركود أو انسخ رابط الدعوة الموجه للمشاركين لجمع العينات فورياً.
                  </p>

                  <div className="space-y-2">
                    <button 
                      onClick={copyInviteLink}
                      className="w-full py-3 bg-psy-gold hover:bg-[#c4a030] text-black font-black rounded-xl text-xs active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 size={13} />
                      <span>نسخ رابط المشاركة</span>
                    </button>
                  </div>
                </GlassCard>

              </div>

            </div>
          </div>
        ) : (
          // STUDIES LIST VIEW
          isAdding ? (
            <div className="space-y-6">
               <button 
                  onClick={() => setIsAdding(false)} 
                  className="flex items-center gap-2 text-psy-gold text-sm font-bold hover:underline mb-8"
                >
                  <ChevronRight size={16} /> العودة لقائمة الدراسات
                </button>
               <StudyBuilder onComplete={() => setIsAdding(false)} />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                 <div className="space-y-2 text-right">
                    <h1 className="text-3xl font-black">الدراسات والمشاريع البحثية</h1>
                    <p className="text-psy-text/40 font-medium">إدارة مشاريع جمع البيانات ومتابعة تقدم العينات في الوقت الحقيقي.</p>
                 </div>
                 <GoldButton onClick={() => setIsAdding(true)}><Plus size={20} /> بدء دراسة جديدة</GoldButton>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {studies.map(study => <StudyCard key={study.id} study={study} />)}
                 {studies.length === 0 && (
                   <div className="col-span-full p-20 text-center glass rounded-[40px] space-y-4">
                      <p className="text-psy-text/40 italic">لا توجد دراسات نشطة حالياً</p>
                      <GoldButton onClick={() => setIsAdding(true)}><Plus size={20} /> صمم دراستك الأولى</GoldButton>
                   </div>
                 )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

