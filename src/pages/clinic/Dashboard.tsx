import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Bell, 
  Plus, 
  Copy, 
  Check, 
  TrendingUp,
  TrendingDown,
  Search,
  ChevronRight,
  FileText,
  Sparkles,
  Brain,
  Heart,
  Cpu,
  Zap,
  RefreshCw,
  Layers,
  Activity,
  DollarSign,
  Clock,
  ArrowUpRight,
  Database,
  LayoutDashboard,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { 
  getClinicStats, 
  getCurrentUser, 
  PatientCase, 
  getCases, 
  createCase,
  getAppointments,
  createAppointment, // Added for full-stack operability
  Appointment,
  createTask,
  getMessages,
  sendMessage,
  Message,
  createAuditLog
} from '../../lib/clinic';
import { MessageThread } from '../../components/clinic/MessageThread';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { Modal } from '../../components/clinic/Modal';
import { PatientCard } from '../../components/clinic/PatientCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { ManagerDashboard } from './ManagerDashboard';

export const ClinicianDashboard: React.FC = () => {
  const user = getCurrentUser();
  
  if (user?.role === 'owner') {
    return <ManagerDashboard />;
  }

  const navigate = useNavigate();
  const [stats, setStats] = useState(getClinicStats(user?.id || ''));
  const [cases, setCases] = useState<PatientCase[]>(getCases().slice(0, 5));
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Case Form State
  const [newCase, setNewCase] = useState({
    patientCode: '',
    ageGroup: '20-25',
    gender: 'male' as 'male' | 'female',
    reasonForVisit: '',
    psychologicalHistory: '',
    currentSymptoms: [] as string[],
    severityLevel: 2
  });
  const [tagInput, setTagInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // --- Task Assignment States ---
  const [selectedCaseForTask, setSelectedCaseForTask] = useState<PatientCase | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    taskType: 'behavioral' as 'behavioral' | 'cognitive' | 'expressive' | 'mindfulness' | 'exposure',
    instructions: '',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    difficulty: 3
  });

  // --- Message States ---
  const [selectedCaseForMessage, setSelectedCaseForMessage] = useState<PatientCase | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');

  // --- New Interactive Clinical Tools States ---
  const [selectedCaseForCbt, setSelectedCaseForCbt] = useState<string>('');
  const [cbtAutothoughts, setCbtAutothoughts] = useState('أنا لست جائعاً أو ذكياً بما يكفي للنجاح، سأفشل بالتأكيد في هذا العرض التقديمي أمام الطاقم الإكلينيكي.');
  const [cbtCoreBeliefs, setCbtCoreBeliefs] = useState('أنا شخص فاشل وغير كفؤ وعاجز عن التكيف.');
  const [cbtCompensatory, setCbtCompensatory] = useState('التحضير المجهد لساعات طويلة، تلمس الرضا المستمر، والتجنب في الدقيقة الأخيرة.');
  const [cbtConsequences, setCbtConsequences] = useState('توتر شديد، خفقان، ضيق الصدر، نسيان النقاط وعزلة سريعة.');
  const [showFormulatorMap, setShowFormulatorMap] = useState(false);
  const [cbtSuccessMessage, setCbtSuccessMessage] = useState('');

  const [diagCategory, setDiagCategory] = useState('panic');
  const [selectedFreqCase, setSelectedFreqCase] = useState('');
  const [assignedTaskInfo, setAssignedTaskInfo] = useState('');

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForTask) return;
    createTask({
      ...taskForm,
      caseId: selectedCaseForTask.id
    });
    // Reset and notify
    setIsTaskModalOpen(false);
    setTaskForm({
      title: '',
      description: '',
      taskType: 'behavioral',
      instructions: '',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      difficulty: 3
    });
    setStats(getClinicStats(user?.id || ''));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForMessage || !messageContent.trim()) return;
    const msg = sendMessage({
      caseId: selectedCaseForMessage.id,
      senderId: user?.id || 'clinician-1',
      senderName: user?.fullName || 'د. سامي الأحمد',
      senderRole: 'clinician',
      content: messageContent
    });
    setMessagesList([...messagesList, msg]);
    setMessageContent('');
  };

  // Emergency Session Form State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencySession, setEmergencySession] = useState({
    caseId: '',
    title: 'جلسة علاجية طارئة - دعم واستجابة الأزمة',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('ar-EG', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    notes: 'تمت الجدولة كتدخل إكلينيكي عاجل لمتابعة الحالة واستقرار المستويات الفسيولوجية والوجدانية.',
    type: 'عن بعد'
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code = `${segment()}-${segment()}`;
    setNewCase({...newCase, patientCode: code});
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newCase.patientCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCase(newCase);
    setIsModalOpen(false);
    setStats(getClinicStats(user?.id || ''));
    setCases(getCases().slice(0, 5));
    // Reset form
    setNewCase({
      patientCode: '', ageGroup: '20-25', gender: 'male', 
      reasonForVisit: '', psychologicalHistory: '', 
      currentSymptoms: [], severityLevel: 2
    });
  };

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allCases = getCases();
    const chosenCase = allCases.find(c => c.id === emergencySession.caseId || c.patientCode === emergencySession.caseId);
    
    createAppointment({
      caseId: emergencySession.caseId,
      patientName: chosenCase ? `ملف المريض ${chosenCase.patientCode}` : 'مستفيد طارئ',
      title: emergencySession.title,
      date: emergencySession.date,
      time: emergencySession.time,
      type: emergencySession.type,
      notes: emergencySession.notes,
      duration: 50
    });
    
    // Refresh list & statistics
    setAppointments(getAppointments());
    setStats(getClinicStats(user?.id || ''));
    setIsEmergencyModalOpen(false);
    
    // Reset form
    setEmergencySession({
      caseId: '',
      title: 'جلسة علاجية طارئة - دعم واستجابة الأزمة',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      notes: 'تمت الجدولة كتدخل إكلينيكي عاجل لمتابعة الحالة واستقرار المستويات الفسيولوجية والوجدانية.',
      type: 'عن بعد'
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !newCase.currentSymptoms.includes(tagInput.trim())) {
      setNewCase({...newCase, currentSymptoms: [...newCase.currentSymptoms, tagInput.trim()]});
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewCase({...newCase, currentSymptoms: newCase.currentSymptoms.filter(t => t !== tag)});
  };

  const chartData = [
    { day: 'الأحد', sessions: 4 },
    { day: 'الإثنين', sessions: 6 },
    { day: 'الثلاثاء', sessions: 3 },
    { day: 'الأربعاء', sessions: 8 },
    { day: 'الخميس', sessions: 5 },
    { day: 'الجمعة', sessions: 0 },
    { day: 'السبت', sessions: 2 },
  ];

  const DIAGNOSTIC_PRESETS: Record<string, {
    name: string;
    dsmCode: string;
    distortion: string;
    formulation: string;
    protocolSteps: string[];
    suggestedHomework: {
      title: string;
      desc: string;
      instructions: string;
      dueDateOffset: number;
      difficulty: number;
    }
  }> = {
    panic: {
      name: 'اضطراب الهلع والترهيب الفسيولوجي (Acute Panic)',
      dsmCode: 'F41.0 (DSM-5)',
      distortion: 'كوارثية الأعراض الجسدية (Catastrophizing Vitals)',
      formulation: 'يقوم المستفيد بتفسير التغيرات الفسيولوجية الطبيعية كالتسارع والتعرق على أنها توقف عمل القلب الوشيك أو الجنون، مما يضاعف الإفرازات الهرمونية للذعر.',
      protocolSteps: [
        'التثقيف السريري بطبيعة هرمون الأدرينالين وحلقة البقاء.',
        'تقنية استعادة الهدوء بالتنفس السداسي البطيء.',
        'التعرض التدريجي للمثيرات الداخلية وحل الارتباط المعرفي.',
        'تدعيم المراقبة العيادية المحسوسة للمؤشرات الحيوية.'
      ],
      suggestedHomework: {
        title: 'كسر حلقة الهلع المعرفية',
        desc: 'رصد فوري لعلاقة ضربات القلب المشخصة ذاتياً بالأفكار الكارثية.',
        instructions: 'عند الشعور بالذعر، ركز انتباهك إلى تنفس متناغم بمعدل شهيق 4 ثوانٍ وزفير 6 ثوانٍ، وسجل تراجع الفكرة الكارثية خلال 5 دقائق.',
        dueDateOffset: 4,
        difficulty: 3
      }
    },
    ocd: {
      name: 'الأفكار الاقتحامية والطقوس القهرية (OCD Intrusive)',
      dsmCode: 'F42 (DSM-5)',
      distortion: 'الاندماج الفكري العملي والمخاوف المفرطة (Thought-Action Fusion)',
      formulation: 'يعتقد المستفيد خطأً بأن الأفكار الاقتحامية المرفوضة تحمل قيمة برهانية أو أخلاقية حتمية بالمستقبل، مما يدفعه للقيام بطقوس قهرية لخفض مستويات القلق.',
      protocolSteps: [
        'تفكيك الاندماج المعرفي ووصم الفكرة كـ "فضلات طاقة عصبية".',
        'تطبيق نظام التعرض ومنع الاستجابة (ERP) بوعاء زمني متدرج.',
        'تدريب فك الارتباط التلقائي وتأجيل إيقاع الطقوس.',
        'توجيه مصفوفة تقبل اللايقين الإدراكي.'
      ],
      suggestedHomework: {
        title: 'تأخير الاستجابة الطقسية (ERP)',
        desc: 'تدريب سلوكي لتوسيع الفاصل الزمني بين الفكرة الاقتحامية والطقس المصاحب.',
        instructions: 'عند ورود الفكرة، قل لنفسك "هذا وسواس عابر"، وعطّل القيام بالطقس القهري لمدة 15 دقيقة كاملة، وراقب تلاشي الاستجابة تدريجياً.',
        dueDateOffset: 3,
        difficulty: 4
      }
    },
    social: {
      name: 'التجنب والرهاب الاجتماعي الإكلينيكي (Social Anxiety)',
      dsmCode: 'F40.10 (DSM-5)',
      distortion: 'كشاف Spotlight وقراءة العقول المفترضة (Mind Reading Bias)',
      formulation: 'تركيز الانتباه المفرط على تفاصيل الأداء الذاتي بالتوازي مع افتراض مراقبة دقيقة ونقد مطلق من الحاضرين، مما يفجر سلوكيات تجنبية تعيق التكيف الوظيفي.',
      protocolSteps: [
        'تدريب تركيز الانتباه للخارج (Task Concentration Engine).',
        'تجارب سلوكية لخرق القواعد العرفية غير المكتوبة لاختبار الفرضيات.',
        'تفنيد فكرة التفسير السلبي لتعبيرات وميماءات الآخرين.',
        'التعرض الاجتماعي المتدرج وتخفيض الأمان السلوكي الانعزالي.'
      ],
      suggestedHomework: {
        title: 'توجيه الانتباه للخارج لتعديل مجهر السحابة',
        desc: 'مواجهة واقعية خفيفة ترتكز على مراقبة تفاصيل المحيط كبديل للمراقبة الذاتية.',
        instructions: 'في موقف اجتماعي قادم، اختر 3 تفاصيل في الغرفة (اللوحات، ألوان الكراسي، زاوية الإضاءة) وسجلها في ذهنك، ووصف أثر تراجع منسوب حرارة القلق الاجتماعي.',
        dueDateOffset: 5,
        difficulty: 3
      }
    },
    self_esteem: {
      name: 'تدني مستويات الكفاءة وتقدير الذات (Low Self-Esteem)',
      dsmCode: 'Z73.1 (Clinical Focus)',
      distortion: 'التبخيس أو التقليل الانتقائي للحقائق (Selective Discounting)',
      formulation: 'تحييد وتجاهل الأدلة العينية للنجاح الشخصي بالقول إنها نتيجة الظروف أو "الحظ المواتي" مع تضخيم العثرات العادية، لتثبيت تصور داخلي بالعجز المطلق.',
      protocolSteps: [
        'جمع وتوثيق سجل المكتسبات المعرفية والسلوكية اليومية الصارمة.',
        'تدريبات نقد الصوت الداخلي وإيجاد الناقف الإيجابي الموضوعي.',
        'تثبيت قواعد الشفقة الذاتية مقابل معايير المثالية الطاحنة.',
        'بناء أهداف مرنة تدريجية بمكافآت عصبية صغرى.'
      ],
      suggestedHomework: {
        title: 'تدوين "سجل الأدلة الخرسانية" للكفاءة الوجدانية',
        desc: 'كتابة تدوين يومي لأدلة حية ومادية تدعم قدرات المستفيد على التجاوب المثمر.',
        instructions: 'اجمع في نهاية كل يوم دليلين ملموسين على إتمام مهامك (ولو صغيرة) واكتب رداً داحضاً لصوت النقد بمكافأة بصرية تعبيرية.',
        dueDateOffset: 7,
        difficulty: 2
      }
    }
  };

  const currentDiag = DIAGNOSTIC_PRESETS[diagCategory];

  const handleAssignPresetTask = (patientId: string) => {
    if (!patientId) {
      alert('الرجاء اختيار حالة مريض أولاً عبر القائمة لإسناد التدريب السلوكي لها.');
      return;
    }
    const hw = currentDiag.suggestedHomework;
    const task = createTask({
      caseId: patientId,
      title: hw.title,
      description: hw.desc,
      taskType: 'behavioral',
      instructions: hw.instructions,
      dueDate: new Date(Date.now() + 86400000 * hw.dueDateOffset).toISOString().split('T')[0],
      difficulty: hw.difficulty
    });

    setAssignedTaskInfo(task.title);
    setStats(getClinicStats(user?.id || ''));
    setTimeout(() => setAssignedTaskInfo(''), 5000);
  };

  const handleCreateCbtMap = () => {
    if (!selectedCaseForCbt) {
      setCbtSuccessMessage('⚠️ الرجاء اختيار كود المستفيد لإشراك الخريطة في ملفه الإكلينيكي.');
      return;
    }
    setShowFormulatorMap(true);
    
    // Create audit log
    createAuditLog(
      'صياغة مخطط إدراكي تفاعلي لمستفيد',
      `أنشأ الأخصائي مخطط علاجي CBT للمستفيد ${selectedCaseForCbt} يشمل قناعة: "${cbtCoreBeliefs.slice(0, 30)}..."`,
      'clinical',
      selectedCaseForCbt
    );

    setCbtSuccessMessage(`✅ تم تشكيل الخريطة الإدراكية التفاعلية بنجاح، وتعميمها فورياً على لوحة المستفيد ${selectedCaseForCbt}.`);
    setTimeout(() => setCbtSuccessMessage(''), 6000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Full Width */}
      <div className="relative min-h-[18rem] md:h-72 rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 flex flex-col md:flex-row items-center justify-between p-8 md:px-16 group bg-psy-bg shadow-2xl gap-8 md:gap-0">
        <div className="absolute inset-0 bg-gradient-to-r from-psy-bg via-psy-bg/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1200" 
          alt="Dashboard Banner" 
          className="absolute left-0 top-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" 
          referrerPolicy="no-referrer"
        />
        
        <div className="relative z-20 space-y-4 md:space-y-6 flex flex-col items-center md:items-start text-center md:text-right">
          <BackButton homePath="/" />
          <h1 className="text-4xl md:text-6xl font-serif font-black text-psy-text tracking-tighter m-0">لوحة التحكم السريرية</h1>
          <p className="text-psy-text/50 font-medium text-lg md:text-xl max-w-xl">مرحباً د. {user?.fullName || 'المستخدم'} • {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <GoldButton size="lg" className="relative z-20 h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl text-lg md:text-xl font-black shadow-2xl shadow-psy-gold/30 self-stretch md:self-auto flex items-center justify-center" onClick={() => setIsModalOpen(true)}>
          <Plus size={24} className="ml-2" /> إدراج حالة جديدة
        </GoldButton>
      </div>

      {/* Stats Grid - 12 Columns */}
      <div className="grid grid-cols-4 md:grid-cols-12 gap-8">
        <div className="col-span-2 md:col-span-3">
          <StatCard icon={Users} label="الحالات النشطة" value={stats.activeCases} color="text-blue-400" />
        </div>
        <div className="col-span-2 md:col-span-3">
          <StatCard icon={Calendar} label="الجلسات الشهرية" value={stats.thisMonthSessions} color="text-[#D4B483]" />
        </div>
        <div className="col-span-2 md:col-span-3">
          <StatCard icon={ClipboardCheck} label="المهام المنتظرة" value={stats.pendingTasks} color="text-emerald-400" />
        </div>
        <div className="col-span-2 md:col-span-3">
          <StatCard icon={Bell} label="تنبيهات غير مقروءة" value={stats.unreadNotifications} color="text-red-400" />
        </div>
      </div>

      {/* Main Content Areas - 12 Columns */}
      <div className="grid grid-cols-4 md:grid-cols-12 gap-10">
        {/* Recent Cases - 8 Columns on Desktop */}
        <div className="col-span-4 md:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-3xl font-serif font-black flex items-center gap-4 m-0">
              <TrendingUp className="text-psy-gold" size={32} /> أحدث السجلات السريرية
            </h2>
            <button 
              onClick={() => navigate('/clinic/patients')}
              className="text-sm text-psy-gold font-bold hover:underline py-2 px-4 glass rounded-xl transition-all cursor-pointer hover:bg-white/5 active:scale-[0.98]"
            >
              عرض الأرشيف الكامل
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map(c => (
              <PatientCard 
                key={c.id} 
                patientCase={c} 
                onSendTask={() => {
                  setSelectedCaseForTask(c);
                  setIsTaskModalOpen(true);
                }}
                onSendMessage={() => {
                  setSelectedCaseForMessage(c);
                  setMessagesList(getMessages(c.id));
                  setIsMessageModalOpen(true);
                }}
              />
            ))}
            {cases.length === 0 && (
              <div className="col-span-2 p-24 text-center glass rounded-[40px] text-psy-text/10 border-dashed border-2 border-psy-gold/20">
                <Users size={64} className="mx-auto mb-6 opacity-20" />
                <p className="text-xl font-bold">لا توجد سجلات مسجلة حالياً في نظامك</p>
              </div>
            )}
          </div>

          {/* Activity Chart */}
          <GlassCard className="p-10 rounded-[40px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold m-0">تحليلات الكثافة الأسبوعية</h3>
              <div className="text-xs text-psy-text/30 font-black tracking-widest uppercase">البيانات المحدثة لحظياً</div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: '#1B1816', border: '1px solid #D4B48333', borderRadius: '24px', padding: '16px' }}
                  />
                  <Bar dataKey="sessions" fill="#D4B483" radius={[12, 12, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar widgets - 4 Columns on Desktop */}
        <div className="col-span-4 md:col-span-4 space-y-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-black flex items-center gap-4 m-0">
              <Calendar className="text-psy-gold" size={32} /> جدول اليوم
            </h2>
            <div className="space-y-4">
              {appointments.length > 0 ? appointments.map(app => (
                <div key={app.id} className="p-6 glass rounded-[32px] border-r-8 border-psy-gold flex items-center gap-6 group hover:translate-x-[-8px] transition-all duration-500">
                  <div className="text-center min-w-[70px] py-2 bg-psy-gold/5 rounded-2xl border border-psy-gold/10">
                    <div className="text-[11px] font-black text-psy-text/40 mb-1">{app.date ? app.date.split('-')[2] : 'اليوم'}</div>
                    <div className="text-2xl font-black text-psy-gold">{app.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold truncate mb-1">{app.patientName}</div>
                    <div className="text-sm font-medium text-psy-text/40 italic">{app.title}</div>
                  </div>
                  <ChevronRight size={20} className="text-psy-text/20 group-hover:text-psy-gold transition-colors" />
                </div>
              )) : (
                <div className="p-16 text-center text-psy-text/20 glass rounded-[40px] border-dashed border-2 border-white/5 italic">
                  <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                  لا توجد مواعيد مقررة لليوم
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <GlassCard className="p-8 rounded-[40px] border-psy-gold/20 bg-psy-gold/5">
            <h4 className="m-0 mb-6 font-bold">إجراءات سريعة</h4>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 glass rounded-2xl gap-2 hover:bg-psy-gold hover:text-psy-bg transition-all active:scale-[0.98]"
              >
                <Plus size={20} />
                <span className="text-[11px] font-bold">جلسة طارئة</span>
              </button>
              <button 
                onClick={() => navigate('/clinic/reports')}
                className="flex flex-col items-center justify-center p-4 glass rounded-2xl gap-2 hover:bg-psy-gold hover:text-psy-bg transition-all active:scale-[0.98]"
              >
                <FileText size={20} />
                <span className="text-[11px] font-bold">تقرير دوري</span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Innovative Psychometric & Cognitive Tools Portal */}
      <GlassCard className="p-10 rounded-[40px] border-[#D4AF37]/10 relative overflow-hidden bg-gradient-to-b from-[#1B1816] to-[#120e0c]">
        {/* Glowing background decor */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-yellow-600/[0.03] blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 border-b border-white/5 pb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-psy-gold mb-2 font-mono text-xs tracking-widest font-bold">
              <Sparkles size={14} className="animate-pulse" />
              بوابة الأدوات السيكومترية المبتكرة
            </div>
            <h2 className="text-3xl md:text-3xl font-serif font-black mb-1 text-white">الورشة السريرية والتشخيص التفاعلي</h2>
            <p className="text-psy-text/40 text-sm max-w-2xl">أدوات إكلينيكية متخصصة لمساعدة الأخصائي على بناء الصياغات الإدراكية وطباعة التوجيهات السلوكية الفورية وتعيينها للمستفيدين.</p>
          </div>
          <div className="px-4 py-2 bg-psy-gold/5 rounded-2xl border border-psy-gold/10 font-mono text-xs text-[#D4B483] font-bold">
            النظام المعرفي المستقل v3.2
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 relative z-10">
          {/* CBT Schema Formulator (7 columns on large screens) */}
          <div className="xl:col-span-12 xl:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold m-0 text-white font-serif">صائغ ومخطط الهياكل الإدراكية (CBT Schema Formulator)</h3>
                <p className="text-xs text-psy-text/40 font-serif">صمم مخطط الأفكار التلقائية والافتراضات الوجدانية وعممها للمريض</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-psy-text/50 text-right block">اختر كود المستفيد المحضر</label>
                  <select
                    value={selectedCaseForCbt}
                    onChange={(e) => setSelectedCaseForCbt(e.target.value)}
                    className="w-full bg-[#181816]/70 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none text-right"
                  >
                    <option value="">-- اختر ملف المستفيد --</option>
                    {getCases().map(c => (
                      <option key={c.id} value={c.patientCode}>{c.patientCode} ({c.ageGroup} سنة)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-psy-text/50 text-right block">المعتقد الجوهري (Core Belief)</label>
                  <input
                    type="text"
                    value={cbtCoreBeliefs}
                    onChange={(e) => setCbtCoreBeliefs(e.target.value)}
                    placeholder="مثال: أنا شخص فاشل أو عاجز عن التكيف"
                    className="w-full bg-[#181816]/70 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none font-bold text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-psy-text/50 text-right block">الأفكار التلقائية السلبية (Automatic Thoughts)</label>
                <textarea
                  value={cbtAutothoughts}
                  onChange={(e) => setCbtAutothoughts(e.target.value)}
                  className="w-full bg-[#181816]/70 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none h-16 resize-none text-right"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-psy-text/50 text-right block">الأساليب والخدع التعويضية</label>
                  <input
                    type="text"
                    value={cbtCompensatory}
                    onChange={(e) => setCbtCompensatory(e.target.value)}
                    className="w-full bg-[#181816]/70 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-psy-text/50 text-right block">التبعات الوجدانية والجسدية</label>
                  <input
                    type="text"
                    value={cbtConsequences}
                    onChange={(e) => setCbtConsequences(e.target.value)}
                    className="w-full bg-[#181816]/70 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none text-right"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={handleCreateCbtMap} 
                  className="w-full py-3 px-6 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-psy-bg rounded-2xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <RefreshCw size={14} className="ml-2" /> صياغة وتحديث مخطط الشبكة
                </button>
              </div>

              {cbtSuccessMessage && (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl text-xs text-center text-psy-gold">
                  {cbtSuccessMessage}
                </div>
              )}
            </div>

            {/* Glowing Interactive SVG Schema Map */}
            {showFormulatorMap && (
              <div className="bg-[#120e0c] border border-[#D4AF37]/20 rounded-[32px] p-6 space-y-4 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <div className="flex justify-between items-center text-xs font-bold pr-2">
                  <span className="text-[#D4AF37] flex items-center gap-1">🟢 المخطط العصبي المعرفي التفاعلي النشط</span>
                  <span className="text-psy-text/40">{selectedCaseForCbt}</span>
                </div>

                {/* Cyber Psychology SVG Flow Map */}
                <div className="w-full min-h-[220px] bg-black/40 rounded-2xl flex items-center justify-center p-4 border border-white/5 relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 120 110 L 260 55" stroke="rgba(212,175,55,0.25)" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 120 110 L 260 165" stroke="rgba(212,175,55,0.25)" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 260 55 L 420 110" stroke="rgba(212,175,55,0.15)" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 260 165 L 420 110" stroke="rgba(212,175,55,0.15)" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>

                  <div className="grid grid-cols-3 gap-6 w-full items-center relative z-10 text-center text-xs font-bold">
                    <div className="group cursor-pointer p-4 bg-psy-gold/5 border border-psy-gold/40 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:bg-psy-gold/10 transition-all">
                      <div className="text-[9px] text-psy-gold/80 mb-1 font-mono uppercase">المعتقد الجوهري</div>
                      <div className="text-white text-[10px] leading-relaxed line-clamp-3">{cbtCoreBeliefs}</div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="group cursor-pointer p-3 bg-red-500/5 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all">
                        <div className="text-[8px] text-red-400 mb-0.5 font-mono uppercase">الأفكار التلقائية</div>
                        <div className="text-white text-[9px] leading-relaxed line-clamp-2">{cbtAutothoughts}</div>
                      </div>
                      
                      <div className="group cursor-pointer p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-all">
                        <div className="text-[8px] text-blue-400 mb-0.5 font-mono uppercase">الأساليب التعويضية</div>
                        <div className="text-white text-[9px] leading-relaxed line-clamp-2">{cbtCompensatory}</div>
                      </div>
                    </div>

                    <div className="group cursor-pointer p-4 bg-yellow-500/5 border border-yellow-500/30 rounded-2xl hover:bg-yellow-500/10 transition-all">
                      <div className="text-[9px] text-yellow-500 mb-1 font-mono uppercase">المخرجات والتبعات</div>
                      <div className="text-white text-[10px] leading-relaxed line-clamp-3">{cbtConsequences}</div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-psy-text/30 italic font-medium m-0">يتم التحديث الآلي والسلس لخارطة الصياغة الكلية في سجلات الحالة.</p>
              </div>
            )}
          </div>

          {/* Clinical Diagnostic Assistant Copilot (5 columns) */}
          <div className="xl:col-span-12 xl:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold m-0 text-white font-serif">مساعد الصياغة والتشخيص السلوكي (CBT Copilot)</h3>
                <p className="text-xs text-psy-text/40 font-serif">توليد الصياغة العلاجية DSM-5 وتعيين الواجبات المنزلية</p>
              </div>
            </div>

            <div className="bg-[#181816]/80 p-6 rounded-[32px] border border-white/5 space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#D4AF37] block text-right">اختر الفئة الإكلينيكية المستهدفة</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setDiagCategory('panic')} 
                      className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${diagCategory === 'panic' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/5 hover:bg-white/[0.02] text-psy-text/70'}`}
                    >
                      اضطراب الهلع
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDiagCategory('ocd')} 
                      className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${diagCategory === 'ocd' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/5 hover:bg-white/[0.02] text-psy-text/70'}`}
                    >
                      الوسواس القهري
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDiagCategory('social')} 
                      className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${diagCategory === 'social' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/5 hover:bg-white/[0.02] text-psy-text/70'}`}
                    >
                      الرهاب الاجتماعي
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDiagCategory('self_esteem')} 
                      className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${diagCategory === 'self_esteem' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/5 hover:bg-white/[0.02] text-psy-text/70'}`}
                    >
                      تقدير الذات
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-4 text-right">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-psy-text/30 font-mono text-[9px]">{currentDiag.dsmCode}</span>
                      <span className="text-[#D4AF37] font-black">{currentDiag.name}</span>
                    </div>
                    <div className="text-[9px] text-pink-400 font-bold mb-2">التشوه الإدراكي المعالج: {currentDiag.distortion}</div>
                    <p className="text-xs text-psy-text/60 leading-relaxed font-light mb-0">{currentDiag.formulation}</p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-bold text-psy-text/40 block">بروتوكول التدخل العلاجي اللاحق:</span>
                    <ul className="text-xs space-y-1 text-psy-text/70 pr-4 list-decimal leading-relaxed">
                      {currentDiag.protocolSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#D4AF37]/5 p-4 rounded-2xl border border-[#D4AF37]/10 space-y-3 text-right">
                  <div className="text-[11px] font-bold text-psy-gold flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-psy-gold/10 text-[9px] rounded-lg">الصعوبة: {currentDiag.suggestedHomework.difficulty}/5</span>
                    <span>📝 تكليف منزلي مقترح:</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white mb-1">{currentDiag.suggestedHomework.title}</h5>
                    <p className="text-[10px] text-psy-text/50 leading-relaxed font-light mb-0">{currentDiag.suggestedHomework.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <label className="text-[9px] font-bold text-psy-text/40 block">إسناد مباشر للحالات المفتوحة في نظامك:</label>
                    <div className="flex gap-2">
                      <select 
                        value={selectedFreqCase}
                        onChange={(e) => setSelectedFreqCase(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2 text-[11px] text-white outline-none focus:border-[#D4AF37] text-right"
                      >
                        <option value="">-- اختر الحالة --</option>
                        {getCases().map(c => (
                          <option key={c.id} value={c.id}>{c.patientCode} - {c.reasonForVisit.slice(0, 15)}...</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        onClick={() => handleAssignPresetTask(selectedFreqCase)}
                        disabled={!selectedFreqCase}
                        className="h-10 px-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 active:scale-95 text-psy-bg rounded-xl font-bold text-xs disabled:opacity-25 transition-all cursor-pointer"
                      >
                        إسناد الواجب
                      </button>
                    </div>
                  </div>

                  {assignedTaskInfo && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-[11px] text-emerald-400 font-bold">
                      🎉 تم إسناد مهمة "{assignedTaskInfo}" وحفظها في قاعدة السرير عيادياً بنجاح!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Create Case Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="إنشاء حالة سريرية جديدة"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Code Generation Section */}
          <div className="p-6 bg-[#D4B483]/5 rounded-3xl border border-[#D4B483]/20 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-[#D4B483]">كود الحالة السري</label>
              <GoldButton type="button" variant="secondary" size="sm" onClick={generateCode}>
                توليد تلقائي
              </GoldButton>
            </div>
            
            {newCase.patientCode ? (
              <div className="flex items-center justify-between p-4 bg-[#181816]/60 rounded-2xl border border-[#D4B483]/30">
                <span className="text-3xl font-black text-[#D4B483] tracking-widest font-mono">
                  {newCase.patientCode}
                </span>
                <button type="button" onClick={copyToClipboard} className="text-psy-text/40 hover:text-[#D4B483] transition-colors">
                  {isCopied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-white/10 rounded-2xl text-center text-xs text-psy-text/20 italic">
                انقر على توليد للحصول على كود جديد
              </div>
            )}
            <p className="text-[10px] text-[#D4B483]/60 italic font-medium">أعطِ هذا الكود للحالة / المستخدم ليدخل به إلى تطبيق المتابعة</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">الفئة العمرية</label>
              <select 
                value={newCase.ageGroup} 
                onChange={(e) => setNewCase({...newCase, ageGroup: e.target.value})}
                className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
              >
                <option value="18-24">18-24 سنة</option>
                <option value="25-30">25-30 سنة</option>
                <option value="31-40">31-40 سنة</option>
                <option value="41-50">41-50 سنة</option>
                <option value="51+">51+ سنة</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">الجنس</label>
              <select 
                value={newCase.gender}
                onChange={(e) => setNewCase({...newCase, gender: e.target.value as 'male' | 'female'})}
                className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">سبب الزيارة</label>
            <textarea 
              value={newCase.reasonForVisit}
              onChange={(e) => setNewCase({...newCase, reasonForVisit: e.target.value})}
              placeholder="وصف المشكلة الحالية..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-24 outline-none focus:border-[#D4B483] text-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">التاريخ النفسي والملاحظات الأولية</label>
            <textarea 
              value={newCase.psychologicalHistory}
              onChange={(e) => setNewCase({...newCase, psychologicalHistory: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-32 outline-none focus:border-[#D4B483] text-white resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-psy-text/60">الأعراض الحالية</label>
            <div className="flex gap-2">
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="أضف عرضاً (مثل: أرق، قلق...)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#D4B483] text-white"
              />
              <GoldButton type="button" size="sm" onClick={addTag}>إضافة</GoldButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {newCase.currentSymptoms.map(tag => (
                <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-[#D4B483]/10 text-[#D4B483] rounded-lg text-xs font-bold border border-[#D4B483]/20">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-psy-text/60">مستوى الخطورة الإكلينيكية</label>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                newCase.severityLevel === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                newCase.severityLevel === 2 ? 'bg-blue-500/20 text-blue-400' :
                newCase.severityLevel === 3 ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-500'
              }`}>
                {newCase.severityLevel === 1 ? 'منخفض' : 
                 newCase.severityLevel === 2 ? 'متوسط' : 
                 newCase.severityLevel === 3 ? 'مرتفع' : 'حرج'}
              </span>
            </div>
            <input 
              type="range" min="1" max="4" step="1"
              value={newCase.severityLevel}
              onChange={(e) => setNewCase({...newCase, severityLevel: parseInt(e.target.value)})}
              className="w-full accent-[#D4B483]"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <GoldButton type="submit" className="flex-1" size="lg" disabled={!newCase.patientCode}>
              إنشاء الحالة
            </GoldButton>
            <GoldButton type="button" variant="secondary" className="flex-1" size="lg" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </GoldButton>
          </div>
        </form>
      </Modal>

      {/* Emergency Session Modal */}
      <Modal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
        title="جدولة وترخيص جلسة إرشادية طارئة"
      >
        <form onSubmit={handleEmergencySubmit} className="space-y-6">
          <div className="p-4 bg-yellow-500/5 text-yellow-300 border border-yellow-500/10 rounded-2xl text-xs leading-relaxed text-right">
            تنبيه أمني للحوكمة: تدرج الجلسة المباشرة المفتوحة كإجراء إكلينيكي طارئ للسيطرة والاستجابة اللحظية الداعمة ويرتبط بسجلات البيانات آلياً بنظام RBAC.
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">اختر ملف الحالة (المريض)</label>
            <select 
              required
              value={emergencySession.caseId}
              onChange={(e) => setEmergencySession({...emergencySession, caseId: e.target.value})}
              className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
            >
              <option value="">-- اختر الحالة --</option>
              {getCases().map(c => (
                <option key={c.id} value={c.id}>{c.patientCode} - {c.reasonForVisit.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">عنوان التدخل الطارئ</label>
            <input 
              type="text" 
              required
              value={emergencySession.title}
              onChange={(e) => setEmergencySession({...emergencySession, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">تاريخ الجلسة</label>
              <input 
                type="date" 
                required
                value={emergencySession.date}
                onChange={(e) => setEmergencySession({...emergencySession, date: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">التوقيت</label>
              <input 
                type="time" 
                required
                value={emergencySession.time}
                onChange={(e) => setEmergencySession({...emergencySession, time: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">نوع التواصل</label>
            <select 
              value={emergencySession.type}
              onChange={(e) => setEmergencySession({...emergencySession, type: e.target.value})}
              className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
            >
              <option value="عن بعد">عن بعد (فيديو مباشر مشفر)</option>
              <option value="حضوري">حضوري بالميناء العيادي</option>
              <option value="مراسلة">تتبع فوري نصي</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">ملاحظات وخطوات السيطرة</label>
            <textarea 
              value={emergencySession.notes}
              onChange={(e) => setEmergencySession({...emergencySession, notes: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-24 outline-none focus:border-[#D4B483] text-white resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <GoldButton type="submit" className="flex-1" size="lg" disabled={!emergencySession.caseId}>
              جدولة الجلسة الفورية
            </GoldButton>
            <GoldButton type="button" variant="secondary" className="flex-1" size="lg" onClick={() => setIsEmergencyModalOpen(false)}>
              إلغاء
            </GoldButton>
          </div>
        </form>
      </Modal>

      {/* Task Assignment Modal */}
      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        title={`إسناد مهمة جديدة - ${selectedCaseForTask?.patientCode || ''}`}
      >
        <form onSubmit={handleTaskSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">عنوان المهمة</label>
            <input 
              type="text" 
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              placeholder="مثال: رصد الأفكار السلبية التلقائية"
              className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">وصف المهمة والهدف منها</label>
            <textarea 
              required
              value={taskForm.description}
              onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              placeholder="صف باختصار للمريض الهدف من هذا التدريب السلوكي..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-20 outline-none focus:border-[#D4B483] text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">نوع المهمة</label>
              <select 
                value={taskForm.taskType} 
                onChange={(e) => setTaskForm({...taskForm, taskType: e.target.value as any})}
                className="w-full bg-[#181816]/60 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white"
              >
                <option value="behavioral">سلوكية</option>
                <option value="cognitive">معرفية</option>
                <option value="expressive">تعبيرية</option>
                <option value="mindfulness">يقظة ذهنية</option>
                <option value="exposure">تعرض</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-psy-text/60">تاريخ التسليم الأقصى</label>
              <input 
                type="date" 
                required
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#D4B483] text-white font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">تعليمات التنفيذ (تفصيلية)</label>
            <textarea 
              value={taskForm.instructions}
              onChange={(e) => setTaskForm({...taskForm, instructions: e.target.value})}
              placeholder="اكتب خطوات تفصيلية لتنفيذ المهمة لمساعدة المريض..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-28 outline-none focus:border-[#D4B483] text-white resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-psy-text/60">
              <label>مستوى الصعوبة المتوقع</label>
              <span className="text-[#D4B483] font-black">{taskForm.difficulty} / 5</span>
            </div>
            <input 
              type="range" min="1" max="5" step="1"
              value={taskForm.difficulty}
              onChange={(e) => setTaskForm({...taskForm, difficulty: parseInt(e.target.value)})}
              className="w-full accent-[#D4B483]"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <GoldButton type="submit" className="flex-1" size="lg">إرسال المهمة الآن</GoldButton>
            <GoldButton type="button" variant="secondary" className="flex-1" size="lg" onClick={() => setIsTaskModalOpen(false)}>إلغاء</GoldButton>
          </div>
        </form>
      </Modal>

      {/* Quick Messaging Modal */}
      <Modal 
        isOpen={isMessageModalOpen} 
        onClose={() => setIsMessageModalOpen(false)} 
        title={`محادثة سريعة آمنة - ${selectedCaseForMessage?.patientCode || ''}`}
      >
        <div className="space-y-6">
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/10 flex flex-col h-[350px]">
             <MessageThread messages={messagesList} currentUserId={user?.id || ''} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <textarea 
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(e))}
              placeholder="اكتب رسالتك التوجيهية هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483] text-white resize-none h-14"
            />
            <GoldButton type="submit" size="sm" className="h-14 px-6 font-bold">إرسال</GoldButton>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <GlassCard className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${color} bg-opacity-10`}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-xs text-psy-text/40 font-medium">{label}</div>
    </div>
  </GlassCard>
);

import { X } from 'lucide-react';

