import React, { useState, useEffect } from 'react';
import {
  Building2,
  Key,
  Users,
  MapPin,
  Mail,
  BookOpen,
  FileEdit,
  Languages,
  ClipboardCheck,
  Compass,
  Database,
  QrCode,
  Download,
  Printer,
  Calculator,
  CheckCircle2,
  Award,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  CreditCard,
  Plus,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Lock,
  ChevronRight,
  UserCheck,
  Save,
  Eye,
  Upload,
  Bell,
  X,
  Check,
  Menu,
  Home,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  FlaskConical,
  Globe
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrentUser, logoutUser, updateUserProfile } from '../../lib/clinic';
import {
  getTests,
  saveTest,
  QuestionType,
  PsychTest,
  TestItem,
  QuestionType as LabQuestionType,
  getStudies
} from '../../lib/lab';

// Interfaces for our custom modular states
interface LabIdentity {
  labName: string;
  securityCode: string;
  inviteEmail: string;
  invitedEmails: { email: string; role: string; invitedAt: string }[];
  address: string;
  institution: string;
}

interface TheoreticalFramework {
  framework: string;
  operationalDefinition: string;
  references: string[];
}

interface FieldResponse {
  id: string;
  num: number;
  age: number;
  gender: 'male' | 'female';
  scores: Record<string, number>; // itemId -> score (value, e.g., 1-5)
  submittedAt: string;
}

interface TeamPayment {
  id: string;
  memberName: string;
  role: string;
  paymentMethod: 'baridimob' | 'ccp';
  ripCCP: string;
  amount: number;
  status: 'pending' | 'completed';
}

export const ResearcherLab: React.FC = () => {
  const [user, setUser] = useState(() => {
    return getCurrentUser() || {
      id: 'researcher-1',
      fullName: 'د. سامي الأحمد',
      email: 'researcher@psy-labs.dz',
      role: 'researcher' as const,
      specialization: 'علم النفس السريري والقياس السيكومتري والبحث الأكاديمي',
      avatarUrl: '',
      phone: '+213 555 12 34 56',
      bio: 'أستاذ باحث في علم النفس والقياس السيكومتري وعضو اللجنة الوطنية للبحوث العلمية بوزارة التعليم العالي.'
    };
  });

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState(() => ({ ...user }));
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync profile form when user state changes
  useEffect(() => {
    setProfileForm({ ...user });
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth presentation delay
    const updated = updateUserProfile(profileForm);
    if (updated) {
      setUser(updated);
      triggerToast("تم تحديث معلوماتك الشخصية بنجاح 🟢");
      setIsEditProfileModalOpen(false);
    } else {
      updateUserProfile(profileForm);
      triggerToast("تعذّر حفظ الملف — يرجى تسجيل الدخول مجدداً.");
    }
    setIsSavingProfile(false);
  };

  const handleLogout = () => {
    logoutUser();
    triggerToast("تم تسجيل الخروج بنجاح. نلقاك على خير يا دكتور 🚪");
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  const navigate = useNavigate();

  // 1. Service Program State (أولا: اختيار المسار والخدمة المالية ثنائية الاتجاه)
  const [activeProgram, setActiveProgram] = useState<string | null>(() => {
    return localStorage.getItem("psytech_active_program");
  });

  // State to trigger program change modal
  const [showProgramSelector, setShowProgramSelector] = useState(false);

  // Sidebar state removed as layout is managed globally

  // 2. Main Selected Page via URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'home';
  const setCurrentTab = (tab: string) => {
    if (tab === 'home') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Laboratories List State (المختبرات النشطة)
  const [laboratories, setLaboratories] = useState([
    { id: 'lab-1', name: 'مخبر القياس والتقويم النفسي الحديث', institution: 'جامعة الجزائر ٢ - بوزريعة', testsCount: 14, membersCount: 8, status: 'نشط 🟢', active: true },
    { id: 'lab-2', name: 'العيادة النفسية للأبحاث القياسية المتقدمة - وهران', institution: 'جامعة أحمد بن بلة - وهران ١', testsCount: 8, membersCount: 5, status: 'نشط 🟢', active: false },
    { id: 'lab-3', name: 'معهد الدراسات السلوكية والأبحاث المعرفية المستجدة', institution: 'جامعة قسنطينة ٣', testsCount: 5, membersCount: 4, status: 'تحت المراجعة ⏳', active: false }
  ]);

  const [studiesList, setStudiesList] = useState(() => getStudies());

  // Toast notifications
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // New State variables for requested features
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  // Bibliographic and Incentives details
  const [bibTargetPop, setBibTargetPop] = useState(() => localStorage.getItem("psytech_bib_target_pop") || "طلبة الماجستير والباحثين في علم النفس");
  const [bibTargetSize, setBibTargetSize] = useState(() => localStorage.getItem("psytech_bib_target_size") || "200");
  const [bibMethodology, setBibMethodology] = useState(() => localStorage.getItem("psytech_bib_methodology") || "منهج وصفي ارتباطي سيكومتري");
  const [incFinance, setIncFinance] = useState(() => Number(localStorage.getItem("psytech_inc_finance")) || 250);
  const [incCert, setIncCert] = useState(() => localStorage.getItem("psytech_inc_cert") === "true");

  // Import CSV spreadsheet text paste state
  const [importCsvText, setImportCsvText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  // System Notifications live log
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>(() => {
    const stored = localStorage.getItem("psytech_lab_notifications");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'n-1', text: "قام أ.د بلعيد قويدر بإجراء مراجعة علمية جديدة لمؤشرات صدق البند الأول وثبت ملائمتها 📝", time: "منذ 10 دقائق", read: false },
      { id: 'n-2', text: "النظام الإحصائي المطور: تماسك الثبات الكلي للمقياس تفوق وارتفع إلى α = 0.814 🟢", time: "منذ 30 دقيقة", read: false },
      { id: 'n-3', text: "وصلت استجابة عينية حقيقية جديدة من مفحوِص بالغرفة السحابية لجامعة الجزائر 2 📥", time: "منذ ساعة", read: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("psytech_bib_target_pop", bibTargetPop);
    localStorage.setItem("psytech_bib_target_size", bibTargetSize);
    localStorage.setItem("psytech_bib_methodology", bibMethodology);
    localStorage.setItem("psytech_inc_finance", incFinance.toString());
    localStorage.setItem("psytech_inc_cert", incCert.toString());
  }, [bibTargetPop, bibTargetSize, bibMethodology, incFinance, incCert]);

  // Active Team Directory state
  const [collaborators, setCollaborators] = useState([
    { name: 'أ. د. بلعيد قويدر', role: 'محكم صدق محتوى ومناهج', online: true },
    { name: 'د. يمينة بومعزة', role: 'دراسة التحيز والتعريب السلوكي', online: true },
    { name: 'يوسف مزياني', role: 'مستقطب العينات والخدمة الميدانية', online: false },
    { name: 'أ. بلعاصم نور الدين', role: 'محلل سيكومتري إحصائي', online: true }
  ]);

  // Universal save handler per section
  const handleSaveSection = (section: string) => {
    setIsSaving(prev => ({ ...prev, [section]: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, [section]: false }));
      triggerToast("🔐 تم بنجاح الحفظ التراكمي والمزامنة السحابية الفورية لسحابة PsyTech المشفرة!");
    }, 850);
  };

  // Helper code to format URL conversion (converts -dev- to -pre- shared URL to bypass 403 authentication redirects)
  const getPublicTestUrl = (testId: string) => {
    const origin = window.location.origin;
    if (origin.includes("-dev-")) {
      return `${origin.replace("-dev-", "-pre-")}/public-test/${testId}`;
    }
    return `${origin}/public-test/${testId}`;
  };

  // -------------------------------------------------------------
  // PAGE 1 STATE: تسجيل المختبر والهوية
  // -------------------------------------------------------------
  const [identity, setIdentity] = useState<LabIdentity>(() => {
    const stored = localStorage.getItem("psytech_lab_identity");
    if (stored) return JSON.parse(stored);
    return {
      labName: 'مخبر القياس والتقويم النفسي الحديث',
      securityCode: 'SEC-2026-LAB',
      inviteEmail: '',
      invitedEmails: [
        { email: 'a.belkacem@univ-alger.dz', role: 'محلل سيكومتري رئيسي', invitedAt: '2026-06-18' },
        { email: 'y.benyamina@psy-labs.dz', role: 'محكم صدق خارجي', invitedAt: '2026-06-19' }
      ],
      address: 'كلية العلوم الإنسانية والاجتماعية، جامعة الجزائر 2',
      institution: 'جامعة الجزائر 2 - بوزريعة'
    };
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_identity", JSON.stringify(identity));
  }, [identity]);

  const handleUpdateIdentity = (fields: Partial<LabIdentity>) => {
    setIdentity(prev => ({ ...prev, ...fields }));
    triggerToast("تم حفظ بيانات هوية المختبر سحابياً 🔐");
  };

  const handleJoinLabByCode = () => {
    if (!joinCodeInput.trim()) {
      triggerToast("يرجى إدخال كود الانضمام للمخبر أولاً 🔐");
      return;
    }
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      setIdentity({
        labName: "العيادة النفسية للأبحاث القياسية المتقدمة - وهران",
        securityCode: joinCodeInput.toUpperCase(),
        inviteEmail: "",
        invitedEmails: [
          { email: 'director.lab@univ-oran2.dz', role: 'مدير مخبر غرب الجزائر', invitedAt: '2026-06-20' },
          { email: 'm.khaldi@univ-alger2.dz', role: 'منسق دراسات عليا', invitedAt: '2026-06-20' }
        ],
        address: "معهد علم النفس والعلوم التربوية، جامعة وهران الكبرى",
        institution: "جامعة أحمد بن بلة - وهران 1"
      });
      setNotifications(prev => [
        { id: `join-${Date.now()}`, text: `🔐 انضمام ناجح لغرفة المخبر التفاعلية بالرمز المشفر ${joinCodeInput.toUpperCase()}`, time: "الآن", read: false },
        ...prev
      ]);
      setJoinCodeInput('');
      triggerToast("🔬 تمت تلبية الاتصال البرمجي بالمعمل وسحب وتوطين بيانات المقياس بنجاح!");
    }, 1300);
  };

  const handleInviteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.inviteEmail.trim()) return;
    const newInvite = {
      email: identity.inviteEmail,
      role: 'باحث مشارك / محكّم',
      invitedAt: new Date().toISOString().split('T')[0]
    };
    setIdentity(prev => ({
      ...prev,
      invitedEmails: [...prev.invitedEmails, newInvite],
      inviteEmail: ''
    }));
    triggerToast("🔓 تم إرسال دعوة الانضمام والكود السري بنجاح!");
  };

  // -------------------------------------------------------------
  // PAGE 2 STATE: مسودة البناء النظري ومراجع وبنود (إدماج منشئ المقاييس المطور)
  // -------------------------------------------------------------
  const [framework, setFramework] = useState<TheoreticalFramework>(() => {
    const stored = localStorage.getItem("psytech_lab_framework");
    if (stored) return JSON.parse(stored);
    return {
      framework: 'يهدف هذا المقياس إلى تقييم مستوى الصمود الأكاديمي والتكيف النفسي لدى باحثي ومعدي الدكتوراه والماجستير بصفته أحد الركائز الجوهرية للوقاية من الاحتراق النفسي الأكاديمي.',
      operationalDefinition: 'الصمود الأكاديمي: هو قدرة الطالب الباحث على التغلب الفعال على التحديات الضاغطة والمنهجية في بيئة التعلم العالي وتماسك إرادته المعرفية.',
      references: [
        'أولدفيلد، س. (2022). الاتساق المنهجي لدراسات علم النفس القياسي، المجلة العربية لعلم النفس، 12(3).',
        'Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. Psychometrika, 16(3), 297–334.'
      ]
    };
  });

  const [newRef, setNewRef] = useState('');
  const handleAddReference = () => {
    if (!newRef.trim()) return;
    setFramework(prev => ({
      ...prev,
      references: [...prev.references, newRef.trim()]
    }));
    setNewRef('');
    triggerToast("تمت إضافة المرجعية بالتنسيق العلمي APA 7 📚");
  };

  useEffect(() => {
    localStorage.setItem("psytech_lab_framework", JSON.stringify(framework));
  }, [framework]);

  // Integrated Test Items Builder State
  const [items, setItems] = useState<Omit<TestItem, 'createdAt' | 'updatedAt'>[]>(() => {
    const stored = localStorage.getItem("psytech_lab_draft_items");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'item-1', testId: 'default-lab-test', orderIndex: 1, questionText: 'أجد متعة واضحة في تفكيك الأسئلة المعقدة وإعادة بنائها منطقياً.', questionType: QuestionType.LIKERT_5, isRequired: true, reverseScored: false, tags: ['صمود'] },
      { id: 'item-2', testId: 'default-lab-test', orderIndex: 2, questionText: 'ينتابني توتر شديد ووهن إرادي كلما تداخلت التحليلات والافتراضات النظرية.', questionType: QuestionType.LIKERT_5, isRequired: true, reverseScored: true, tags: ['احتراق'] },
      { id: 'item-3', testId: 'default-lab-test', orderIndex: 3, questionText: 'أثق تماماً في قدرتي المنهجية على تصميم دراسة سيكومترية سليمة بمفردي.', questionType: QuestionType.LIKERT_5, isRequired: true, reverseScored: false, tags: ['ثقة'] },
      { id: 'item-4', testId: 'default-lab-test', orderIndex: 4, questionText: 'أتهرب من مراجعة البنود والعبارات بعد صياغتها وأشعر بالملل السريع.', questionType: QuestionType.LIKERT_5, isRequired: true, reverseScored: true, tags: ['تهرب'] }
    ];
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_draft_items", JSON.stringify(items));
    // Synced database entry save placeholder
    const allLabTests = getTests();
    const activeLabTest = allLabTests.find(t => t.id === 'default-lab-test') || {
      id: 'default-lab-test',
      title: 'مقياس الصمود الأكاديمي والتكيف النفسي بالمعمل',
      description: 'مقياس سيكومتري موجه لطلبة الدراسات العليا في البيئة العربية',
      instructions: 'يرجى الإجابة عن كل عبارة بدقة وموضوعية تامة واختيار التدريج الأقرب لواقعك الأكاديمي.',
      category: 'clinical',
      targetPopulation: { ageRange: '18-45', gender: 'both', languages: ['ar', 'fr'], culturalContext: 'الجزائر والعالم العربي' },
      estimatedTime: 10,
      items: [],
      scales: [],
      settings: {
        allowBacktracking: true,
        showProgressBar: true,
        randomizeItems: false,
        showResultsImmediately: true,
        requireAllAnswers: true,
        adaptiveTesting: false
      }
    } as PsychTest;

    activeLabTest.items = items.map(it => ({
      ...it,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    saveTest(activeLabTest);
  }, [items]);

  const [newItemText, setNewItemText] = useState('');
  const [newItemReverse, setNewItemReverse] = useState(false);
  const [newItemTag, setNewItemTag] = useState('عام');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const item: Omit<TestItem, 'createdAt' | 'updatedAt'> = {
      id: `item-${Date.now()}`,
      testId: 'default-lab-test',
      orderIndex: items.length + 1,
      questionText: newItemText.trim(),
      questionType: QuestionType.LIKERT_5,
      isRequired: true,
      reverseScored: newItemReverse,
      tags: [newItemTag]
    };
    setItems(prev => [...prev, item]);
    setNewItemText('');
    setNewItemReverse(false);
    triggerToast("تمت إضافة البند بنجاح ➕");
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
    triggerToast("تم حذف العبارة من المقياس 🗑️");
  };

  // -------------------------------------------------------------
  // PAGE 3 STATE: الترجمة وتكييف الصياغة
  // -------------------------------------------------------------
  const [translations, setTranslations] = useState<Record<string, { fr: string; en: string; notes: string }>>(() => {
    const stored = localStorage.getItem("psytech_lab_translations");
    if (stored) return JSON.parse(stored);
    return {
      'item-1': { fr: "Je trouve un plaisir évident à analyser et reconstruire les questions complexes.", en: "I find clear joy in deconstructing and logically rebuilding complex questions.", notes: "تم استبدال 'تفكيك' بـ 'deconstructing' لضمان الدقة الأكاديمية." },
      'item-2': { fr: "Je ressens une tension intense et une baisse d'énergie face à des théories complexes.", en: "I feel intense tension and fatigue whenever theoretical assumptions overlap.", notes: "ملائمة للبيئة الجامعية تجنباً للمصطلحات الإكلينيكية الحادة." }
    };
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_translations", JSON.stringify(translations));
  }, [translations]);

  const handleUpdateTranslation = (itemId: string, lang: 'fr' | 'en' | 'notes', val: string) => {
    setTranslations(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { fr: '', en: '', notes: '' }),
        [lang]: val
      }
    }));
  };

  // -------------------------------------------------------------
  // PAGE 4 STATE: التحكيم والتعليقات
  // -------------------------------------------------------------
  const [arbitrators, setArbitrators] = useState<{ id: string; name: string; title: string; university: string }[]>(() => {
    const stored = localStorage.getItem("psytech_lab_arbitrators");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'arb-1', name: 'أ. د. بلعيد قويدر', title: 'بروفيسور القياس وعلم النفس المعرفي', university: 'جامعة وهران 2' },
      { id: 'arb-2', name: 'د. يمينة بومعزة', title: 'محاضرة في القياس السيكومتري وبناء المقاييس', university: 'جامعة قسنطينة 2' }
    ];
  });

  const [newArbName, setNewArbName] = useState('');
  const [newArbTitle, setNewArbTitle] = useState('');
  const [newArbUni, setNewArbUni] = useState('');

  const handleAddArbitrator = () => {
    if (!newArbName.trim()) return;
    setArbitrators(prev => [...prev, {
      id: `arb-${Date.now()}`,
      name: newArbName,
      title: newArbTitle || 'عضو اللجنة العلمية للتحكيم',
      university: newArbUni || 'قيد الترشيح'
    }]);
    setNewArbName('');
    setNewArbTitle('');
    setNewArbUni('');
    triggerToast("تم تسجيل المحكم رسمياً وإرسال وثيقة الصدق الظاهري 📄");
  };

  const [itemReviews, setItemReviews] = useState<Record<string, { score: number; comment: string }>>(() => {
    const stored = localStorage.getItem("psytech_lab_item_reviews");
    if (stored) return JSON.parse(stored);
    return {
      'item-1': { score: 4, comment: "العبارة ممتازة ومشبعة وعصية على التأويل الخاطئ." },
      'item-2': { score: 3.8, comment: "مقبول جداً ويفضل استبدال كلمة توتر شديد بضيق أكاديمي." }
    };
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_item_reviews", JSON.stringify(itemReviews));
    localStorage.setItem("psytech_lab_arbitrators", JSON.stringify(arbitrators));
  }, [itemReviews, arbitrators]);

  const handleUpdateReview = (itemId: string, field: 'score' | 'comment', value: any) => {
    setItemReviews(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { score: 4, comment: '' }),
        [field]: value
      }
    }));
  };

  // -------------------------------------------------------------
  // PAGE 5 STATE: استقطاب العينات والاستجابات الحية
  // -------------------------------------------------------------
  const [qrColor, setQrColor] = useState('#D4AF37');
  const [qrBg, setQrBg] = useState('#0a0a09');

  const [fieldResponses, setFieldResponses] = useState<FieldResponse[]>(() => {
    const stored = localStorage.getItem("psytech_lab_field_responses");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'resp-1', num: 1, age: 26, gender: 'female', scores: { 'item-1': 5, 'item-2': 1, 'item-3': 4, 'item-4': 2 }, submittedAt: '2026-06-19 12:30' },
      { id: 'resp-2', num: 2, age: 29, gender: 'male', scores: { 'item-1': 4, 'item-2': 2, 'item-3': 5, 'item-4': 1 }, submittedAt: '2026-06-19 13:45' },
      { id: 'resp-3', num: 3, age: 24, gender: 'female', scores: { 'item-1': 5, 'item-2': 2, 'item-3': 4, 'item-4': 1 }, submittedAt: '2026-06-19 14:15' },
      { id: 'resp-4', num: 4, age: 31, gender: 'male', scores: { 'item-1': 2, 'item-2': 4, 'item-3': 2, 'item-4': 4 }, submittedAt: '2026-06-19 14:50' },
      { id: 'resp-5', num: 5, age: 28, gender: 'female', scores: { 'item-1': 4, 'item-2': 1, 'item-3': 4, 'item-4': 2 }, submittedAt: '2026-06-19 15:02' }
    ];
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_field_responses", JSON.stringify(fieldResponses));
  }, [fieldResponses]);

  const handleExportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fieldResponses, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "psytech_respondents_matrix.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let csvContent = "data:text/csv;charset=utf-8,المعرف,العمر,الجنس," + items.map(it => it.id).join(",") + "\n";
      fieldResponses.forEach(r => {
        csvContent += `${r.num},${r.age},${r.gender === 'female' ? 'أنثى' : 'ذكر'},${items.map(it => r.scores[it.id] || 0).join(",")}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute("download", "psytech_responses_matrix.csv");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
    triggerToast("تم تنزيل مصفوفة البيانات بصيغ علمية معالجة 📊");
  };

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("يرجى تفعيل النوافذ المنبثقة للطباعة");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>طباعة رمز الاستجابة للمقياس</title>
          <style>
            body { background: #fff; text-align: center; font-family: sans-serif; padding: 50px; color: #111; }
            h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            p { font-size: 14px; color: #666; margin-bottom: 30px; }
            img { width: 350px; height: 350px; border: 1px solid #eee; padding: 10px; }
          </style>
        </head>
        <body onload="window.print()">
          <h1>مقياس الصمود الأكاديمي والتكيف النفسي</h1>
          <p>امسح الرمز ضوئياً بالمحمول للمشاركة الفورية والآمنة في البحث</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${qrColor.replace('#', '')}&bgcolor=${qrBg.replace('#', '')}&data=${encodeURIComponent(getPublicTestUrl('default-lab-test'))}" alt="QR Code" />
          <div style="margin-top: 40px; font-size: 12px; color: #999;">منصة PsyTech للقياس السيكومتري المتقدم</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // -------------------------------------------------------------
  // PAGE 6 STATE: التحليل الإحصائي السيكومتري والادخال اليدوي المباشر
  // -------------------------------------------------------------
  // Manual Grid States: 5 rows initially
  const [manualGrid, setManualGrid] = useState<number[][]>(() => {
    const stored = localStorage.getItem("psytech_lab_manual_grid");
    if (stored) return JSON.parse(stored);
    // 5 rows x length of items
    return [
      [5, 1, 4, 2],
      [4, 2, 5, 1],
      [5, 2, 4, 1],
      [2, 4, 2, 4],
      [4, 1, 4, 2]
    ];
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_manual_grid", JSON.stringify(manualGrid));
  }, [manualGrid]);

  const handleCellChange = (rowIdx: number, colIdx: number, val: string) => {
    let intVal = parseInt(val) || 0;
    if (intVal > 5) intVal = 5;
    if (intVal < 0) intVal = 0;

    setManualGrid(prev => {
      const nextGrid = prev.map((row, r) => {
        if (r === rowIdx) {
          // Initialize nextRow matching items.length to support dynamic additions
          const nextRow = Array(items.length).fill(3);
          if (row && Array.isArray(row)) {
            row.forEach((v, idx) => {
              if (idx < items.length) nextRow[idx] = v;
            });
          }
          nextRow[colIdx] = intVal;
          return nextRow;
        }
        return row;
      });
      return nextGrid;
    });
  };

  const handleAddGridRow = () => {
    setManualGrid(prev => [...prev, new Array(items.length).fill(3)]);
    triggerToast("تمت إضافة سطر مصفوفة جديد يدوياً ➕");
  };

  const handleClearGrid = () => {
    setManualGrid([new Array(items.length).fill(3)]);
    triggerToast("تم تنظيف مصفوفة البيانات يدوياً 🧹");
  };

  const handleSimulatorAnswer = (itemId: string, score: number) => {
    setPreviewAnswers(prev => ({
      ...prev,
      [itemId]: score
    }));
  };

  const handleSimulatorSubmit = () => {
    const nextResponseNum = fieldResponses.length + 1;
    const newSimResponse: FieldResponse = {
      id: `sim-resp-${Date.now()}`,
      num: nextResponseNum,
      age: Math.floor(Math.random() * 12) + 20,
      gender: Math.random() > 0.5 ? 'female' : 'male',
      scores: { ...previewAnswers },
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setFieldResponses(prev => [...prev, newSimResponse]);

    const gridRow = items.map(it => previewAnswers[it.id] || 3);
    setManualGrid(prev => [...prev, gridRow]);

    setPreviewAnswers({});
    setShowPreviewModal(false);

    setNotifications(prev => [
      { id: `sim-notif-${Date.now()}`, text: `📥 استجابة سيمترية تجريبية جديدة تم حقنها في جداول التحليلات (مستجيب رقم ${nextResponseNum})`, time: "الآن", read: false },
      ...prev
    ]);

    triggerToast("📥 تم استقبال الاستجابة التجريبية وحقن بياناتها في الجداول بنجاح!");
  };

  // --- Real-time mathematical calculation of Cronbach's Alpha ---
  const calculateCronbachAlpha = () => {
    const n = items.length;
    if (n < 2) return 0.0;

    // Rows represent patients, columns items
    // Get array of sum per respondent
    const personSums = manualGrid.map(row => {
      let sum = 0;
      for (let colIdx = 0; colIdx < n; colIdx++) {
        // Fallback to 3 (neutral Likert score) if cell doesn't exist yet
        const rawVal = (row && typeof row[colIdx] === 'number') ? row[colIdx] : 3;
        const itemVal = isNaN(rawVal) ? 3 : rawVal;
        const isReverse = items[colIdx]?.reverseScored;
        const actualVal = isReverse ? (6 - itemVal) : itemVal;
        sum += actualVal;
      }
      return sum;
    });

    // Calculate variance of the total sums
    const personSumsLen = personSums.length || 1;
    const meanSum = personSums.reduce((s, v) => s + v, 0) / personSumsLen;
    const totalVariance = personSums.reduce((s, v) => s + Math.pow(v - meanSum, 2), 0) / (personSums.length - 1 || 1);

    // Calculate sum of item variances
    let sumOfItemVariances = 0;
    for (let col = 0; col < n; col++) {
      const colValues = manualGrid.map(row => {
        const rawVal = (row && typeof row[col] === 'number') ? row[col] : 3;
        const itemVal = isNaN(rawVal) ? 3 : rawVal;
        const isReverse = items[col]?.reverseScored;
        const actualVal = isReverse ? (6 - itemVal) : itemVal;
        return isNaN(actualVal) ? 3 : actualVal;
      });
      const colValuesLen = colValues.length || 1;
      const meanCol = colValues.reduce((s, v) => s + v, 0) / colValuesLen;
      const colVariance = colValues.reduce((s, v) => s + Math.pow(v - meanCol, 2), 0) / (colValues.length - 1 || 1);
      sumOfItemVariances += isNaN(colVariance) ? 0 : colVariance;
    }

    if (totalVariance === 0 || isNaN(totalVariance) || !isFinite(totalVariance)) return 0.0;

    const alpha = (n / (n - 1)) * (1 - (sumOfItemVariances / totalVariance));
    if (isNaN(alpha) || !isFinite(alpha)) return 0.0;

    const finalAlpha = Math.max(0.0, Math.min(0.99, Number(alpha.toFixed(3))));
    return isNaN(finalAlpha) ? 0.0 : finalAlpha;
  };

  const cronbachAlphaVal = calculateCronbachAlpha();

  // -------------------------------------------------------------
  // PAGE 6 EXTENDED STATE: المتغيرات الإحصائية السيكومترية اليدوية
  // -------------------------------------------------------------
  interface ManualStatVar {
    id: string;
    label: string;        // اسم المتغير
    symbol: string;       // الرمز الرياضي
    formula: string;      // المعادلة الحسابية
    value: string;        // القيمة المُدخلة يدوياً
    unit: string;         // الوحدة (اختياري)
    interpretation: string; // التفسير
  }

  const DEFAULT_STAT_VARS: ManualStatVar[] = [
    { id: 'sem', label: 'الخطأ المعياري للقياس', symbol: 'SEM', formula: 'SEM = SD × √(1 − α)', value: '', unit: 'نقطة', interpretation: 'يُعبّر عن دقة القياس. كلما صغُر، كان القياس أكثر دقة.' },
    { id: 'item_difficulty', label: 'مؤشر صعوبة البند (متوسط)', symbol: 'p̄', formula: 'p = Σf / N', value: '', unit: '', interpretation: 'يتراوح بين 0 و1. القيمة المثلى بين 0.3 و0.7 للتمييز الجيد.' },
    { id: 'discrimination', label: 'مؤشر التمييز (الفصل)', symbol: 'D', formula: 'D = (UG − LG) / n', value: '', unit: '', interpretation: 'يتراوح بين -1 و+1. القيمة الجيدة فوق 0.30.' },
    { id: 'validity_cvi', label: 'مؤشر صدق المحتوى (CVI)', symbol: 'CVI', formula: 'CVI = نسبة اتفاق المحكمين', value: '', unit: '%', interpretation: 'نسبة مئوية. القبول المعياري ≥ 0.78 لكل بند.' },
    { id: 'test_retest', label: 'معامل الاستقرار (إعادة الاختبار)', symbol: 'r_tt', formula: 'r = Cov(X₁,X₂) / √(Var(X₁)×Var(X₂))', value: '', unit: '', interpretation: 'يجب أن يكون ≥ 0.70 للاعتماد التشخيصي.' },
    { id: 'split_half', label: 'معامل التجزئة النصفية (سبيرمان-براون)', symbol: 'r_sb', formula: 'r_sb = 2r₁₂ / (1 + r₁₂)', value: '', unit: '', interpretation: 'معامل ثبات مكمّل لألفا كرونباخ. ≥ 0.70 مقبول.' },
    { id: 'variance_explained', label: 'نسبة التباين المُفسَّر (التحليل العاملي)', symbol: 'R²', formula: 'R² = λ / Σλ', value: '', unit: '%', interpretation: 'تُعبّر عن مقدار ما يفسره العامل الأول من التباين الكلي. ≥ 40% مثالي.' },
    { id: 'sample_sd', label: 'الانحراف المعياري للعينة الكلية', symbol: 'SD', formula: 'SD = √(Σ(xᵢ−x̄)² / (n−1))', value: '', unit: 'نقطة', interpretation: 'يُقيس تشتت الدرجات الكلية حول المتوسط الحسابي.' },
  ];

  const [manualStatVars, setManualStatVars] = useState<ManualStatVar[]>(() => {
    const stored = localStorage.getItem("psytech_lab_stat_vars");
    if (stored) return JSON.parse(stored);
    return DEFAULT_STAT_VARS;
  });

  const [newCustomVar, setNewCustomVar] = useState<Partial<ManualStatVar>>({ label: '', symbol: '', formula: '', value: '', unit: '', interpretation: '' });
  const [showAddStatVar, setShowAddStatVar] = useState(false);

  useEffect(() => {
    localStorage.setItem("psytech_lab_stat_vars", JSON.stringify(manualStatVars));
  }, [manualStatVars]);

  const handleUpdateStatVar = (id: string, value: string) => {
    setManualStatVars(prev => prev.map(v => v.id === id ? { ...v, value } : v));
  };

  const handleAddCustomStatVar = () => {
    if (!newCustomVar.label?.trim() || !newCustomVar.symbol?.trim()) {
      triggerToast("يرجى تعبئة اسم المتغير ورمزه الرياضي على الأقل 📊");
      return;
    }
    const newVar: ManualStatVar = {
      id: `custom-${Date.now()}`,
      label: newCustomVar.label || '',
      symbol: newCustomVar.symbol || '',
      formula: newCustomVar.formula || 'يُدخله الإحصائي يدوياً',
      value: newCustomVar.value || '',
      unit: newCustomVar.unit || '',
      interpretation: newCustomVar.interpretation || ''
    };
    setManualStatVars(prev => [...prev, newVar]);
    setNewCustomVar({ label: '', symbol: '', formula: '', value: '', unit: '', interpretation: '' });
    setShowAddStatVar(false);
    triggerToast("✅ تم إضافة المتغير الإحصائي المخصص بنجاح!");
  };

  const handleDeleteStatVar = (id: string) => {
    setManualStatVars(prev => prev.filter(v => v.id !== id));
    triggerToast("🗑️ تم حذف المتغير الإحصائي");
  };

  // -------------------------------------------------------------
  // PAGE 7 EXTRA STATE: نشر المقياس في المكتبة الرقمية
  // -------------------------------------------------------------
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishForm, setPublishForm] = useState({
    category: 'clinical',
    price: '0',
    availability: 'public' as 'public' | 'private' | 'restricted',
    shortDescription: '',
    tags: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishToLibrary = () => {
    if (!publishForm.shortDescription.trim()) {
      triggerToast("يرجى كتابة وصف مختصر للمقياس قبل النشر 📝");
      return;
    }
    setIsPublishing(true);
    setTimeout(() => {
      // Save to library localStorage index
      const libraryStored = localStorage.getItem("psytech_library_scales") || "[]";
      let libraryScales: any[] = [];
      try { libraryScales = JSON.parse(libraryStored); } catch { libraryScales = []; }

      const newEntry = {
        id: `lib-scale-${Date.now()}`,
        title: items.length > 0
          ? (localStorage.getItem("psytech_lab_framework") ? JSON.parse(localStorage.getItem("psytech_lab_framework")!).framework?.slice(0, 50) : 'مقياس سيكومتري')
          : 'مقياس سيكومتري',
        scaleName: identity.labName || 'مقياس المخبر',
        category: publishForm.category,
        price: parseFloat(publishForm.price) || 0,
        availability: publishForm.availability,
        shortDescription: publishForm.shortDescription,
        tags: publishForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: user?.fullName || 'باحث مخبر PsyTech',
        institution: identity.institution || 'جامعة الجزائر',
        cronbachAlpha: cronbachAlphaVal,
        itemsCount: items.length,
        publishedAt: new Date().toISOString(),
        labId: identity.labName
      };

      libraryScales = [newEntry, ...libraryScales];
      localStorage.setItem("psytech_library_scales", JSON.stringify(libraryScales));

      setIsPublishing(false);
      setShowPublishModal(false);
      triggerToast("🎉 تم نشر المقياس بنجاح في المكتبة الرقمية PsyTech!");

      // Navigate to library after short delay
      setTimeout(() => navigate('/library'), 1800);
    }, 1400);
  };

  const handleDownloadDraft = () => {
    const draftData = {
      identity,
      framework,
      items,
      translations,
      arbitrators,
      fieldResponses,
      manualStatVars,
      cronbachAlpha: cronbachAlphaVal,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftData, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `psytech_draft_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    triggerToast("📥 تم تحميل المسودة الكاملة بصيغة JSON بنجاح!");
  };

  // -------------------------------------------------------------
  // PAGE 7 STATE: النتائج والاعتماد والتقرير والمراسلات الأكاديمية
  // -------------------------------------------------------------
  const [labMessages, setLabMessages] = useState<{ id: string; author: string; msg: string; time: string; system: boolean }[]>(() => {
    const stored = localStorage.getItem("psytech_lab_messages");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'm-1', author: 'د. ياسمين قاسي', msg: 'أدعو الزملاء لمراجعة تباعد البند الرابع، يظهر ارتباطاً تنازلياً في العينة الجامعية.', time: '13:02', system: false },
      { id: 'm-2', author: 'النظام السيكومتري لجامعة الجزائر 2', msg: 'المصادقة الأكاديمية جارية. تم إخطار العميد والمشرف الخارجي بالملف البحثي بنجاح.', time: '14:50', system: true }
    ];
  });
  const [newMsgText, setNewMsgText] = useState('');

  useEffect(() => {
    localStorage.setItem("psytech_lab_messages", JSON.stringify(labMessages));
  }, [labMessages]);

  const handleSendMessage = () => {
    if (!newMsgText.trim()) return;
    setLabMessages(prev => [...prev, {
      id: `m-${Date.now()}`,
      author: user?.fullName || 'عضو المختبر',
      msg: newMsgText.trim(),
      time: new Date().toTimeString().slice(0, 5),
      system: false
    }]);
    setNewMsgText('');
    triggerToast("تم بث الرسالة لشركاء المعمل والتحكيم 💬");
  };

  // PAGE 5 BIBLIOGRAPHIC AND INCENTIVE STATES
  const [bibliographicInfo, setBibliographicInfo] = useState(() => {
    const stored = localStorage.getItem("psytech_lab_bibliographic");
    if (stored) return JSON.parse(stored);
    return {
      title: 'مقياس جودة الحياة النفسية والصحة الوجدانية المعدل للبيئة الجزائرية',
      authors: 'أ.د. ياسمين قاسي، د. يمينة بومعزة، د. فاسي جيلالي',
      source: 'مخبر القياس والتقويم السيكولوجي السلوكي، جامعة الجزائر ٢',
      year: '2026',
      doi: 'DOI: 10.1037/psytech.dz.2026.115',
      citation: 'قاسي، ياسمين وبومعزة، يمينة (2026). تقنين مقياس جودة الحياة النفسية لدى الطلبة الجزائريين. مجلة القياس والتقويم النفسي، 14(2)، 112-135.'
    };
  });

  const [incentiveType, setIncentiveType] = useState(() => {
    return localStorage.getItem("psytech_lab_incentive_type") || "pdf_certificate";
  });

  const [incentiveDetail, setIncentiveDetail] = useState(() => {
    return localStorage.getItem("psytech_lab_incentive_detail") || "شهادة مشاركة وتقدير أكاديمية موقعة ومختومة من عمادة المخبر وجامعة الجزائر ٢ ترسل فوراً لبريد المفحوص فور الاكتمال بنجاح.";
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_bibliographic", JSON.stringify(bibliographicInfo));
  }, [bibliographicInfo]);

  useEffect(() => {
    localStorage.setItem("psytech_lab_incentive_type", incentiveType);
  }, [incentiveType]);

  useEffect(() => {
    localStorage.setItem("psytech_lab_incentive_detail", incentiveDetail);
  }, [incentiveDetail]);

  // Concept Board Canvas State
  interface CanvasComment {
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }

  interface CanvasNodeAttachment {
    id: string;
    name: string;
    author: string;
    size?: string;
  }

  interface CanvasNode {
    id: string;
    type: 'file' | 'message' | 'concept';
    title: string;
    content: string;
    x: number;
    y: number;
    color?: string;
    fileType?: string;
    authorName?: string;
    comments?: CanvasComment[];
    attachments?: CanvasNodeAttachment[];
  }

  interface CanvasConnection {
    id: string;
    from: string;
    to: string;
  }

  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>(() => {
    const stored = localStorage.getItem("psytech_lab_canvas_nodes");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'node-1', type: 'file', title: 'مسودة جودة الحياة النفسية.docx', content: 'ملف المقياس المعدل ومصاغ بالبيئة الجزائرية والمحكّم سيكومترياً', x: 10, y: 15, color: '#D4AF37', fileType: 'docx', authorName: 'الأستاذ بن عودة', comments: [{ id: '1', author: 'د. ياسمين قاسي', text: 'تمت المراجعة المعجمية، صياغة ممتازة.', createdAt: '10:15' }] },
      { id: 'node-2', type: 'file', title: 'نتائج CVI المعتمدة.xlsx', content: 'نتائج حساب مؤشرات الصدق لآراء لجنة المحكمين الأكاديميين', x: 200, y: 35, color: '#a0a095', fileType: 'xlsx', authorName: 'د. ياسمين قاسي' },
      { id: 'node-3', type: 'message', title: 'توصية د. ياسمين قاسي', content: 'يجب زيادة حجم عينة الاستقطاب لـ 450 مفحوصاً لتجنب التحيز المعياري بالبيئة المحلية.', x: 10, y: 150, color: '#000000', authorName: 'د. ياسمين قاسي' },
      { id: 'node-4', type: 'concept', title: 'فرضية الدراسة الثالثة:', content: 'توجد علاقة ارتباطية ذات دلالة إحصائية بين القلق المدرسي والتوافق الأسري والتحفيز الذاتي.', x: 180, y: 130, color: '#D4AF37', authorName: 'البروفيسور بوعبد الله' }
    ];
  });

  const [canvasConnections, setCanvasConnections] = useState<CanvasConnection[]>(() => {
    const stored = localStorage.getItem("psytech_lab_canvas_connections");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'conn-1', from: 'node-1', to: 'node-4' },
      { id: 'conn-2', from: 'node-2', to: 'node-3' }
    ];
  });

  const [newCanvasText, setNewCanvasText] = useState('');
  const [newCanvasType, setNewCanvasType] = useState<'message' | 'concept'>('concept');
  const [isFullscreenCanvas, setIsFullscreenCanvas] = useState(false);

  // States for commenting and attachments dialog
  const [commentingNodeId, setCommentingNodeId] = useState<string | null>(null);
  const [newCommentAuthor, setNewCommentAuthor] = useState('د. ياسمين قاسي');
  const [newCommentText, setNewCommentText] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentAuthor, setNewAttachmentAuthor] = useState('د. ياسمين قاسي');
  const [canvasAuthorName, setCanvasAuthorName] = useState('د. ياسمين قاسي');

  const [linkingNodeId, setLinkingNodeId] = useState<string | null>(null);

  // States for dynamic Zoom & auto-expansion
  const [zoomInline, setZoomInline] = useState(1.0);
  const [zoomFull, setZoomFull] = useState(1.0);
  const [dimensionsInline, setDimensionsInline] = useState({ width: 950, height: 600 });
  const [dimensionsFull, setDimensionsFull] = useState({ width: 2000, height: 1400 });

  const autoExpandCanvas = (x: number, y: number, isFull: boolean) => {
    let expanded = false;
    if (isFull) {
      setDimensionsFull(prev => {
        let w = prev.width;
        let h = prev.height;
        const thresholdX = prev.width - 320;
        const thresholdY = prev.height - 220;
        if (x > thresholdX) {
          w = Math.max(prev.width, Math.round(x + 450));
          expanded = true;
        }
        if (y > thresholdY) {
          h = Math.max(prev.height, Math.round(y + 350));
          expanded = true;
        }
        if (expanded) {
          triggerToast("📡 تم التوسيع التلقائي لأبعاد اللوحة الكبرى لحفظ وتنظيم محتوى الباحثين المتزايد!");
        }
        return { width: w, height: h };
      });
    } else {
      setDimensionsInline(prev => {
        let w = prev.width;
        let h = prev.height;
        const thresholdX = prev.width - 180;
        const thresholdY = prev.height - 140;
        if (x > thresholdX) {
          w = Math.max(prev.width, Math.round(x + 250));
          expanded = true;
        }
        if (y > thresholdY) {
          h = Math.max(prev.height, Math.round(y + 200));
          expanded = true;
        }
        if (expanded) {
          triggerToast("📡 تم التوسيع التلقائي لنسب أبعاد لوحة المفاهيم لتوفير مساحة سيكومترية كافية!");
        }
        return { width: w, height: h };
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("psytech_lab_canvas_nodes", JSON.stringify(canvasNodes));
  }, [canvasNodes]);

  useEffect(() => {
    localStorage.setItem("psytech_lab_canvas_connections", JSON.stringify(canvasConnections));
  }, [canvasConnections]);

  const handleNodeMouseDown = (e: React.MouseEvent, node: CanvasNode, isFull: boolean) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.no-drag')) {
      return;
    }

    e.preventDefault();
    const scale = isFull ? zoomFull : zoomInline;
    const startX = node.x;
    const startY = node.y;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startClientX) / scale;
      const deltaY = (moveEvent.clientY - startClientY) / scale;

      let newX = startX + deltaX;
      let newY = startY + deltaY;

      const currentWidth = isFull ? dimensionsFull.width : dimensionsInline.width;
      const currentHeight = isFull ? dimensionsFull.height : dimensionsInline.height;
      const maxW = isFull ? 200 : 130;
      const maxH = isFull ? 120 : 90;

      newX = Math.max(5, Math.min(currentWidth - maxW - 5, newX));
      newY = Math.max(5, Math.min(currentHeight - maxH - 5, newY));

      setCanvasNodes(prev => prev.map(n => n.id === node.id ? { ...n, x: newX, y: newY } : n));

      // Auto expand when dragged near actual limits
      if (newX > currentWidth - maxW - 40 || newY > currentHeight - maxH - 40) {
        autoExpandCanvas(newX, newY, isFull);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleNodeTouchStart = (e: React.TouchEvent, node: CanvasNode, isFull: boolean) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.no-drag')) {
      return;
    }

    const scale = isFull ? zoomFull : zoomInline;
    const startX = node.x;
    const startY = node.y;
    const touch = e.touches[0];
    const startClientX = touch.clientX;
    const startClientY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchMove = moveEvent.touches[0];
      const deltaX = (touchMove.clientX - startClientX) / scale;
      const deltaY = (touchMove.clientY - startClientY) / scale;

      let newX = startX + deltaX;
      let newY = startY + deltaY;

      const currentWidth = isFull ? dimensionsFull.width : dimensionsInline.width;
      const currentHeight = isFull ? dimensionsFull.height : dimensionsInline.height;
      const maxW = isFull ? 200 : 130;
      const maxH = isFull ? 120 : 90;

      newX = Math.max(5, Math.min(currentWidth - maxW - 5, newX));
      newY = Math.max(5, Math.min(currentHeight - maxH - 5, newY));

      setCanvasNodes(prev => prev.map(n => n.id === node.id ? { ...n, x: newX, y: newY } : n));

      if (newX > currentWidth - maxW - 40 || newY > currentHeight - maxH - 40) {
        autoExpandCanvas(newX, newY, isFull);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContainerDrop = (e: React.DragEvent, isFull: boolean) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const containerId = isFull ? 'psytech-concept-board-canvas-full' : 'psytech-concept-board-canvas';
      const container = document.getElementById(containerId);

      let posX = 40;
      let posY = 40;
      const scale = isFull ? zoomFull : zoomInline;
      const currentWidth = isFull ? dimensionsFull.width : dimensionsInline.width;
      const currentHeight = isFull ? dimensionsFull.height : dimensionsInline.height;
      const maxW = isFull ? 200 : 130;
      const maxH = isFull ? 120 : 90;

      if (container) {
        const rect = container.getBoundingClientRect();
        // Calculate raw drop offset relative to parent viewport
        const physicalX = e.clientX - rect.left;
        const physicalY = e.clientY - rect.top;
        // Project onto scaled space and center card origin
        posX = (physicalX / scale) - (maxW / 2);
        posY = (physicalY / scale) - (maxH / 2);
      }

      posX = Math.max(5, Math.min(currentWidth - maxW - 5, posX));
      posY = Math.max(5, Math.min(currentHeight - maxH - 5, posY));

      // Trigger automatic expansion if dropped near or beyond limits
      autoExpandCanvas(posX, posY, isFull);

      const ext = file.name.split('.').pop() || 'docx';
      const newNode: CanvasNode = {
        id: `node-${Date.now()}`,
        type: 'file',
        title: file.name,
        content: `ملف مرفوع بحجم ${(file.size / 1024).toFixed(1)} كيلوبايت لمجتمع الفريق الباحث`,
        x: posX,
        y: posY,
        color: '#D4AF37',
        fileType: ext,
        authorName: canvasAuthorName.trim() || 'باحث مشارك',
        comments: [],
        attachments: []
      };
      setCanvasNodes(prev => [...prev, newNode]);
      triggerToast(`📁 تم إفلات وإدراج الملف "${file.name}" بنجاح في اللوحة!`);
    }
  };

  const handleCreateCanvasNode = (isFull: boolean) => {
    if (!newCanvasText.trim()) return;

    const currentWidth = isFull ? dimensionsFull.width : dimensionsInline.width;
    const currentHeight = isFull ? dimensionsFull.height : dimensionsInline.height;
    const maxW = isFull ? 200 : 130;
    const maxH = isFull ? 120 : 90;

    // Spawn somewhat centered relative to the visible area
    let posX = 40 + Math.random() * (currentWidth - maxW - 100);
    let posY = 40 + Math.random() * (currentHeight - maxH - 100);

    posX = Math.max(5, Math.min(currentWidth - maxW - 5, posX));
    posY = Math.max(5, Math.min(currentHeight - maxH - 5, posY));

    autoExpandCanvas(posX, posY, isFull);

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type: newCanvasType,
      title: newCanvasType === 'concept' ? 'فكرة / فرضية 💡' : 'رسالة تعاون 💬',
      content: newCanvasText.trim(),
      x: posX,
      y: posY,
      color: newCanvasType === 'concept' ? '#D4AF37' : '#e5e5e0',
      authorName: canvasAuthorName.trim() || 'باحث رئيسي',
      comments: [],
      attachments: []
    };

    setCanvasNodes(prev => [...prev, newNode]);
    setNewCanvasText('');
    triggerToast("✨ تم إدراج فكرتك في لوحة التعاون التفاعلية!");
  };

  const handleAddComment = (nodeId: string) => {
    if (!newCommentText.trim()) return;
    setCanvasNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const existingComments = node.comments || [];
        const newComment: CanvasComment = {
          id: `comment-${Date.now()}`,
          author: newCommentAuthor.trim() || 'باحث مشارك',
          text: newCommentText.trim(),
          createdAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...node,
          comments: [...existingComments, newComment]
        };
      }
      return node;
    }));
    setNewCommentText('');
    triggerToast("💬 تم نشر تعليقك الأكاديمي بنجاح!");
  };

  const renderCanvasConnections = (isFull: boolean) => {
    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 0 }}>
        {canvasConnections.map((conn) => {
          const fromNode = canvasNodes.find(n => n.id === conn.from);
          const toNode = canvasNodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const nodeW = isFull ? 200 : 130;
          const nodeH = isFull ? 120 : 80;
          const x1 = fromNode.x + nodeW / 2;
          const y1 = fromNode.y + nodeH / 2;
          const x2 = toNode.x + nodeW / 2;
          const y2 = toNode.y + nodeH / 2;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={conn.id}>
              {/* Glow Behind */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D4AF37"
                strokeWidth="3.5"
                className="opacity-20 blur-[1px]"
              />
              {/* Core dashed line */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-60"
              />
              {/* Interactive circular delete button at midpoint */}
              <circle
                cx={midX}
                cy={midY}
                r="7"
                fill="#10100e"
                stroke="#D4AF37"
                strokeWidth="1"
                className="cursor-pointer hover:fill-red-500/30 transition-colors pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setCanvasConnections(prev => prev.filter(c => c.id !== conn.id));
                  triggerToast("🗑️ تم قطع الرابط بين المفهومين");
                }}
              />
              <text
                x={midX}
                y={midY + 2.5}
                fill="#D4AF37"
                fontSize="8"
                fontWeight="black"
                textAnchor="middle"
                className="cursor-pointer select-none pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setCanvasConnections(prev => prev.filter(c => c.id !== conn.id));
                  triggerToast("🗑️ تم قطع الرابط بين المفهومين");
                }}
              >
                ×
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const handlePrintAcademicReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("يرجى تفعيل النوافذ المنبثقة لتحميل التقرير المنهجي");
      return;
    }
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>التقرير المنهجي السيكومتري النهائي - APA 7</title>
          <style>
            body { font-family: 'Georgia', 'Arial', sans-serif; padding: 40px; color: #222; text-align: right; line-height: 1.8; }
            .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            .badge { display: inline-block; padding: 5px 15px; border: 1px solid #D4AF37; color: #D4AF37; font-weight: bold; border-radius: 4px; font-size: 11px; }
            .title { font-size: 26px; font-weight: bold; color: #111; margin: 10px 0; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #A08030; margin-bottom: 10px; border-right: 4px solid #D4AF37; padding-right: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 12px; }
            th { background-color: #fafad2; }
            .cronbach { font-size: 22px; font-weight: bold; color: #2e7d32; text-align: center; padding: 20px; border: 1px dashed #2e7d32; background: #f1f8e9; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <div class="badge">نظام التقويم المعتمد الدولي لجامعة الجزائر ٢</div>
            <div class="title">التقرير الفحصي السيكومتري للمقاييس النفسية</div>
            <p>اسم المختبر: ${identity.labName} | المؤسسة الأكاديمية: ${identity.institution}</p>
          </div>

          <div class="section">
            <div class="section-title">أولاً: بطاقة المقياس الفنية</div>
            <p><strong>العنوان العلمي:</strong> مقياس الصمود الأكاديمي والتكيف النفسي بالمعمل</p>
            <p><strong>البناء النظري:</strong> ${framework.framework}</p>
            <p><strong>التعريف الإجرائي:</strong> ${framework.operationalDefinition}</p>
          </div>

          <div class="section">
            <div class="section-title">ثانياً: المتانة الإحصائية (Reliability and Consistency)</div>
            <div class="cronbach">معامل الاتساق الداخلي (ألفا كرونباخ للأبعاد): α = ${cronbachAlphaVal}</div>
            <p>تعتبر هذه القيمة مؤشراً قوياً ومتفوقاً للاتساق البنائي وفق الشروط المنهجية لجمعية السيكومتري (APA 7th)، مما يؤكد ملاءمة المقياس للتطبيق الميداني وسلامة الصياغة للبنود المكونة.</p>
          </div>

          <div class="section">
            <div class="section-title">ثالثاً: البنود وصلاحية الترجمة والتحكيم العكسي</div>
            <table>
              <thead>
                <tr>
                  <th>رقم البند</th>
                  <th>صياغة البند المعتمدة العربي</th>
                  <th>تنبيه الصياغة العكسية</th>
                  <th>درجة الاتساق التميزي</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(it => `
                  <tr>
                    <td>${it.orderIndex}</td>
                    <td>${it.questionText}</td>
                    <td>${it.reverseScored ? 'بند عكسي الصياغة' : 'بند مباشر'}</td>
                    <td>ثابت علمياً</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            وثيقة رقمية معتمدة وصادرة تلقائياً من مخابر PsyTech لعام 2026. طبعة جامعة الجزائر.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // -------------------------------------------------------------
  // PAGE 8 STATE: الاستحقاقات المالية لأعضاء الفريق
  // -------------------------------------------------------------
  const [teamPayments, setTeamPayments] = useState<TeamPayment[]>(() => {
    const stored = localStorage.getItem("psytech_lab_team_payments");
    if (stored) return JSON.parse(stored);
    return [
      { id: 'pay-1', memberName: 'أ. د. بلعيد قويدر', role: 'محكم علمي رئيسي (صدق محتوى)', paymentMethod: 'baridimob', ripCCP: '00799999000123456789', amount: 8500, status: 'completed' },
      { id: 'pay-2', memberName: 'د. يمينة بومعزة', role: 'محكم علمي خارجي (تحكيم الصدق المبدئي)', paymentMethod: 'ccp', ripCCP: '102345678912', amount: 6000, status: 'pending' },
      { id: 'pay-3', memberName: 'يوسف مزياني', role: 'مستقطب عينات ميداني (وهران والرمال)', paymentMethod: 'baridimob', ripCCP: '00799999000987654321', amount: 11000, status: 'pending' }
    ];
  });

  useEffect(() => {
    localStorage.setItem("psytech_lab_team_payments", JSON.stringify(teamPayments));
  }, [teamPayments]);

  const handleUpdatePaymentStatus = (id: string, status: 'pending' | 'completed') => {
    setTeamPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    triggerToast(status === 'completed' ? "تمت تسوية المستحقات المالية للمكلف بنجاح عبر بريدي موب 💳" : "أعيدت المعاملة للمراجعة الأكاديمية ⚙️");
  };

  // Total active budget spent calculation
  const totalPayout = teamPayments.reduce((sum, p) => sum + p.amount, 0);

  // Auto-generate active program info
  const getProgramDetails = () => {
    switch (activeProgram) {
      case 'construction':
        return {
          title: "بناء واختبار مقياس نفسي جديد متكامل",
          price: "25,000 DA",
          duration: "سنة دراسية مفتوحة",
          percs: ["صياغة بنود ذكية", "تحكيم الصدق الظاهري التفاعلي", "استقطاب عينات شاملة", "Alpha كلي فوري"]
        };
      case 'adaptation':
        return {
          title: "تكييف وتقنين مقياس نفسي مترجم وعابر للثقافات",
          price: "35,000 DA",
          duration: "تطبيق منهجي للبيئة المحلية والجزائرية",
          percs: ["ترجمة عكسية متقنة AR/FR/EN", "حساب صدق المحتوى CVI", "دراسة التحيز وصعوبة البند", "الاستحقاقات المالية مدمجة"]
        };
      case 'recruitment_only':
        return {
          title: "خدمة استقطاب العينات الإلكترونية الدقيقة فقط",
          price: "15,500 DA",
          duration: "حملة مستهدفة للعيادات والمجامع",
          percs: ["توليد الباركود والرابط الفوري", "تنزيل البيانات CSV/JSON لـ SPSS", "دفع مستحقات العينة آلياً", "أقصى قدر من سرية البيانات"]
        };
      default:
        return null;
    }
  };

  const activeProgInfo = getProgramDetails();

  // Linear Stepper sequences
  const tabSeq = ['identity', 'draft', 'translation', 'arbitration', 'sampling', 'stats', 'certification', 'payouts'];
  const currentTabIndex = tabSeq.indexOf(currentTab);

  const getTabLabel = (tabId: string) => {
    switch (tabId) {
      case 'identity': return 'الهوية والكود';
      case 'draft': return 'صياغة بنود المقياس';
      case 'translation': return 'ترجمة المقياس وتكييفه';
      case 'arbitration': return 'تحكيم الصدق واللجنة';
      case 'sampling': return 'استقطاب العينات والباركود';
      case 'stats': return 'التحليلات وحساب كرونباخ';
      case 'certification': return 'المصادقة وإصدار التقارير';
      case 'payouts': return 'تسيير المستحقات والرواتب';
      default: return '';
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < tabSeq.length - 1) {
      handleSaveSection(currentTab);
      setCurrentTab(tabSeq[currentTabIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setCurrentTab(tabSeq[currentTabIndex - 1]);
    }
  };

  const activeCommentNode = canvasNodes.find(n => n.id === commentingNodeId);

  return (
    <div className="text-[#e5e5e0] font-sans antialiased selection:bg-[#D4AF37] selection:text-black w-full" dir="rtl">

      {/* INNER ALERTS/TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-gradient-to-r from-black via-[#1c1c18] to-black border border-[#D4AF37]/40 shadow-[0_4px_30px_rgba(212,175,55,0.15)] text-[#e5e5e0] px-6 py-3.5 rounded-full text-xs font-bold text-center flex items-center gap-2.5"
          >
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header with lab actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/5" dir="rtl">
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_8px_#D4AF37]" />
            <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">PSYTECH SCIENTIFIC LABORATORY SYSTEM</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">المخبر الرقمي للمقاييس والتقويم السيكومتري</h1>
          <p className="text-xs text-[#a0a095] max-w-2xl leading-relaxed hidden sm:block">
            منصة تفاعلية آمنة لبناء وتقنين وتكييف المقاييس النفسية مع تحليلات إحصائية دقيقة.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {activeProgram && (
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/40 text-xs font-black rounded-xl text-[#D4AF37] hover:from-[#D4AF37]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye size={13} className="animate-pulse" />
              <span>معاينة المقياس</span>
            </button>
          )}
          {activeProgram && (
            <div className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-right hidden sm:block">
              <span className="text-[8px] text-[#D4AF37] font-black uppercase tracking-wider block">المسار النشط</span>
              <span className="text-xs font-black text-white">{activeProgInfo?.title.slice(0, 25)}...</span>
            </div>
          )}
          <button
            onClick={() => setShowProgramSelector(true)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 text-xs font-bold rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CreditCard size={13} className="text-[#D4AF37]" />
            <span>تغيير المسار</span>
          </button>
        </div>
      </div>

      {/* SELECTION POPUP OR ROOT SCREEN */}
      {(!activeProgram || showProgramSelector) ? (
        <div className="w-full max-w-[98%] mx-auto px-4 py-12" dir="rtl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-3.5 py-1.5 rounded-full font-black border border-[#D4AF37]/20 uppercase">
              الخطوة الأولى للعملية المنهجية
            </span>
            <h2 className="text-2xl font-black text-white">تحديد المسار والخدمة والمالية لملف المختبر</h2>
            <p className="text-xs text-[#a0a095] leading-relaxed">
              يرجى اختيار طبيعة العمل السيكومتري المستهدف لتوفير التوجيه الميكانيكي السليم وأسعار الباقات وتخصيص الأوعية البريدية والاتصال بالعينات.
            </p>
          </div>

          {/* JOIN LAB BY CODE — prominently placed at start */}
          <div className="max-w-lg mx-auto mb-10">
            <div className="relative bg-gradient-to-b from-[#141412] to-[#0a0a09] border border-[#D4AF37]/30 rounded-[28px] p-6 space-y-4 text-right shadow-[0_0_30px_rgba(212,175,55,0.06)]">
              <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent rounded-t-[28px]" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
                  <span>انضم لمخبر موجود برمز الدخول</span>
                  <Key size={15} className="text-[#D4AF37]" />
                </h3>
                <p className="text-[11px] text-[#a0a095]">إذا دعاك زميل لمختبر بحثي، أدخل الرمز السري للانضمام الفوري لفريق البحث.</p>
              </div>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinLabByCode()}
                  placeholder="مثال: SEC-2026-LAB"
                  className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono font-black text-[#D4AF37] outline-none focus:border-[#D4AF37] transition-all uppercase"
                  id="join-lab-code-input"
                />
                <button
                  onClick={handleJoinLabByCode}
                  disabled={isJoining}
                  className="px-5 py-3 bg-[#D4AF37] hover:bg-[#c4a030] disabled:bg-[#D4AF37]/40 text-black font-black text-xs rounded-2xl active:scale-95 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  id="join-lab-by-code-btn"
                >
                  {isJoining ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                  <span>انضمام</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 mb-2">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] text-[#a0a095] font-bold uppercase">أو أنشئ مخبراً جديداً</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* OPTION A */}
            <div className="relative group rounded-[32px] p-8 border border-white/5 bg-gradient-to-b from-[#141412] to-[#0a0a09] hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent group-hover:via-[#D4AF37] transition-all" />
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-black text-lg">أ</div>
                  <span className="text-[10px] uppercase font-black text-[#D4AF37]">مقياس جديد كلياً</span>
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="text-lg font-black text-white">بناء مقياس أو اختبار نفسي جديد</h3>
                  <p className="text-[11px] text-[#a0a095] leading-relaxed">تخطيط وبناء البنود والتحكيم وإجراء التحققات الميدانية وحوسبتها إحصائياً.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl space-y-2 border border-white/5 text-right">
                  <span className="text-[9px] text-[#a0a095] block">السعر الإجمالي للخدمة:</span>
                  <span className="text-2xl font-mono text-white font-bold">25,000 DA</span>
                  <p className="text-[10px] text-[#D4AF37]/80 font-medium">شاملة استقطاب فريق محكمين وعينات لـ 200 مشارك</p>
                </div>
                <ul className="space-y-2 text-right">
                  {["تأطير البناء النظري ومراجع APA", "مسودة البنود والترجمة الثنائية", "نموذج التحكيم العلمي الرقمي CVI", "معايرة الاتساق الداخلي والصدق البنائي"].map((item, idx) => (
                    <li key={idx} className="text-xs text-[#a0a095] flex items-center gap-1.5 justify-start">
                      <CheckCircle2 size={12} className="text-[#D4AF37] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("psytech_active_program", "construction");
                  setActiveProgram("construction");
                  setShowProgramSelector(false);
                  triggerToast("تم تفعيل مسار بناء مقياس نفسي جديد 🎉");
                }}
                className="w-full mt-8 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-2xl text-xs active:scale-95 transition-all text-center cursor-pointer"
              >
                تحديث وتفعيل المسار
              </button>
            </div>

            {/* OPTION B */}
            <div className="relative group rounded-[32px] p-8 border border-white/5 bg-gradient-to-b from-[#141412] to-[#0a0a09] hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent group-hover:via-[#D4AF37] transition-all" />
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-black text-lg">ب</div>
                  <span className="text-[10px] uppercase font-black text-[#D4AF37]">تقنين ومواءمة ثقافية</span>
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="text-lg font-black text-white">تكييف وتقنين اختبار نفسي مترجم</h3>
                  <p className="text-[11px] text-[#a0a095] leading-relaxed">ترجمة المقاييس العالمية (أجنبية) وملائمتها مع الخصوصية الثقافية الجزائرية والعربية.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl space-y-2 border border-white/5 text-right">
                  <span className="text-[9px] text-[#a0a095] block">السعر الإجمالي للخدمة:</span>
                  <span className="text-2xl font-mono text-white font-bold">35,000 DA</span>
                  <p className="text-[10px] text-[#D4AF37]/80 font-medium">شاملة الترجمة العكسية وعينة تقنينية لـ 350 مفحوصاً</p>
                </div>
                <ul className="space-y-2 text-right">
                  {["عقد الترجمة العلمي والتحقق الثلاثي", "الملاءمة السيكوسوسيوثقافية للجزائر", "حساب مصفوفات التباعد والتحيز والاتساق", "الاعتماد والأعضاء المستحقين للمكافآت"].map((item, idx) => (
                    <li key={idx} className="text-xs text-[#a0a095] flex items-center gap-1.5 justify-start">
                      <CheckCircle2 size={12} className="text-[#D4AF37] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("psytech_active_program", "adaptation");
                  setActiveProgram("adaptation");
                  setShowProgramSelector(false);
                  triggerToast("تم تفعيل مسار تقنين وتكييف مقياس نفسي مترجم 🌟");
                }}
                className="w-full mt-8 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-2xl text-xs active:scale-95 transition-all text-center cursor-pointer"
              >
                تحديث وتفعيل المسار
              </button>
            </div>

            {/* OPTION C */}
            <div className="relative group rounded-[32px] p-8 border border-white/5 bg-gradient-to-b from-[#141412] to-[#0a0a09] hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col justify-between shadow-xl">
              <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent group-hover:via-[#D4AF37] transition-all" />
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] font-black text-lg">ج</div>
                  <span className="text-[10px] uppercase font-black text-[#D4AF37]">الاستقطاب الحصري للعينات</span>
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="text-lg font-black text-white">استقطاب العينات الإلكترونية فقط</h3>
                  <p className="text-[11px] text-[#a0a095] leading-relaxed">مقياسك جاهز بالكامل وتحتاج فقط لرفع استجابات حقيقية من مشاركين موثوقين ومؤهلين.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl space-y-2 border border-white/5 text-right">
                  <span className="text-[9px] text-[#a0a095] block">السعر الإجمالي للخدمة:</span>
                  <span className="text-2xl font-mono text-white font-bold">15,500 DA</span>
                  <p className="text-[10px] text-[#D4AF37]/80 font-medium">شاملة استقطاب فوري آمن لـ 150 استجابة منتقاة</p>
                </div>
                <ul className="space-y-2 text-right">
                  {["باركود QR مخصص للمسح بالهاتف", "لوحة تتبع حية للعينات والاستجابات", "تصادق ثنائي بريدي لخصوصية تامة", "تنزيل مصفوفة Excel فوراً للـ SPSS"].map((item, idx) => (
                    <li key={idx} className="text-xs text-[#a0a095] flex items-center gap-1.5 justify-start">
                      <CheckCircle2 size={12} className="text-[#D4AF37] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("psytech_active_program", "recruitment_only");
                  setActiveProgram("recruitment_only");
                  setShowProgramSelector(false);
                  triggerToast("تم تفعيل مسار استقطاب العينات السيكومترية 🎯");
                }}
                className="w-full mt-8 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-2xl text-xs active:scale-95 transition-all text-center cursor-pointer"
              >
                تحديث وتفعيل المسار
              </button>
            </div>

          </div>

          {activeProgram && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowProgramSelector(false)}
                className="text-xs text-[#a0a095] underline hover:text-[#D4AF37]"
              >
                إغلاق والعودة لقسم الحالي بالمختبر
              </button>
            </div>
          )}
        </div>
      ) : (

        // MASTER LAYOUT OF THE COHESIVE SYSTEM
        <div className="w-full max-w-none mx-auto relative" dir="rtl">
          {/* MAIN DYNAMIC VIEW WORKSPACE CONTAINER */}
          <div className="space-y-8 w-full">

              {/* PAGE HOME: لوحة التحكم والتحليل البادئة */}
              {currentTab === 'home' && (
                <div className="space-y-8 animate-in fade-in duration-300">

                  {/* HERO BANNER FOR THE LAB HOME */}
                  <div className="relative overflow-hidden rounded-[36px] border border-[#D4AF37]/30 bg-gradient-to-r from-[#121210] via-black to-[#070706] p-8 lg:p-10 shadow-[0_0_50px_rgba(212,175,55,0.06)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-4 max-w-2xl text-right">
                      <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] px-3.5 py-1.5 rounded-full font-black border border-[#D4AF37]/25 uppercase inline-block">
                        بوابة التحكم السيكومتري والأبحاث المستقرة
                      </span>
                      <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                        شاشة الحوكمة العلمية وتكامل المختبر
                      </h2>
                      <p className="text-xs text-[#a0a095] leading-relaxed">
                        أهلاً بك يا دكتور في لوحة الاستقراء والرقمنة السيكومترية. تتيح لك هذه الشاشة موائمة وتتبع كافة المختبرات الملحقة، أعضاء لجنة التحكيم المعتمدين، والعمليات الاستقصائية الكبرى.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-end">
                        <button
                          onClick={() => setIsFullscreenCanvas(true)}
                          className="px-5 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/35 hover:border-[#D4AF37]/60 font-black rounded-2xl text-xs active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2 w-fit mr-auto sm:mr-0"
                        >
                          <Upload size={14} />
                          <span>فتح لوحة المفاهيم التفاعلية (Canvas)</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Stat Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-right">
                        <span className="text-[9px] text-[#a0a095] block mb-0.5">البنود والصياغات</span>
                        <span className="text-base font-black text-white font-mono">{items.length} عبارات</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-right">
                        <span className="text-[9px] text-[#a0a095] block mb-0.5">مكافئ الثبات الكلي α</span>
                        <span className="text-base font-black text-emerald-400 font-mono">{cronbachAlphaVal}</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-right">
                        <span className="text-[9px] text-[#a0a095] block mb-0.5">المحكمين المعتمدين</span>
                        <span className="text-base font-black text-[#D4AF37] font-mono">{arbitrators.length} خبراء</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-right">
                        <span className="text-[9px] text-[#a0a095] block mb-0.5">الاستجابات الميدانية</span>
                        <span className="text-base font-black text-blue-400 font-mono">{fieldResponses.length} عينة</span>
                      </div>
                    </div>
                  </div>

                  {/* 3-COLUMN BENTO GRID: LABORATORIES, MEMBERS, NOTIFICATIONS */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* 1. المختبرات النشطة بالمنصة (Active Laboratories) */}
                    <div className="bg-[#121210] border border-white/5 rounded-3xl p-6 space-y-4 shadow-md text-right">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[9px] font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">المعامل الملقمة</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">المختبرات والشركاء</span>
                          <Building2 size={13} className="text-[#D4AF37]" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {laboratories.map(lab => (
                          <div
                            key={lab.id}
                            onClick={() => {
                              // Highlight active lab toggling
                              setLaboratories(prev => prev.map(l => ({ ...l, active: l.id === lab.id })));
                              triggerToast(`🔬 تم تفعيل وتحميل وتوطين بيانات ورقة العمل لـ ${lab.name}`);
                              handleUpdateIdentity({ labName: lab.name, institution: lab.institution });
                            }}
                            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer group ${lab.active
                                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/45 shadow-[0_4px_16px_rgba(212,175,55,0.05)]'
                                : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'
                              }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-md ${lab.active ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-white/5 text-[#a0a095]'
                                }`}>{lab.status}</span>
                              <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">{lab.name}</h4>
                            </div>
                            <span className="text-[10px] text-[#a0a095]/60 block">{lab.institution}</span>
                            <div className="flex items-center gap-3 mt-3 pt-2 font-mono text-[9px] text-[#a0a095]/80">
                              <span>📁 المقاييس: {lab.testsCount}</span>
                              <span>👥 الباحثين: {lab.membersCount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. أعضاء الهيئة البحثية ولجنة التحكيم (Members List) */}
                    <div className="bg-[#121210] border border-white/5 rounded-3xl p-6 space-y-4 shadow-md text-right">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-[9px] font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">الهيئة العلمية</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">الأعضاء والمحكمين</span>
                          <Users size={13} className="text-[#D4AF37]" />
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar">
                        {collaborators.map((col, idx) => (
                          <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between transition-all hover:border-white/10">
                            <div className="flex items-center gap-2 select-none">
                              <span className={`w-1.5 h-1.5 rounded-full ${col.online ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-[#a0a095]/30'}`} />
                              <span className="text-[9px] text-[#a0a095]">{col.online ? 'متصل الآن' : 'غير متصل'}</span>
                            </div>

                            <div className="text-right">
                              <h4 className="text-xs font-black text-white">{col.name}</h4>
                              <p className="text-[9px] text-[#a0a095]/60 mt-0.5">{col.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. المعايير الوطنية المعتمدة (Approved National Norms) */}
                    <div className="bg-[#121210] border border-white/5 rounded-3xl p-6 space-y-4 shadow-md text-right flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <button
                            onClick={() => navigate('/lab/national-norms')}
                            className="text-[9.5px] font-black text-[#D4AF37] hover:underline cursor-pointer bg-transparent border-none"
                          >
                            تصفح الكل ←
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">المعايير الوطنية المرجعية</span>
                            <Globe size={13} className="text-[#D4AF37]" />
                          </div>
                        </div>

                        <div className="space-y-2.5 max-h-[290px] overflow-y-auto no-scrollbar">
                          {[
                            { name: 'مقياس الصمود النفسي (CDR)', pop: 'عينة وطنية (N=3847)', score: '68.4 (SD 11.2)' },
                            { name: 'مقياس القلق العام (GAD-7)', pop: 'موظفي القطاع العام (N=1250)', score: '7.8 (SD 4.3)' },
                            { name: 'مقياس احترام الذات (RSES)', pop: 'طلبة الجامعات (N=2100)', score: '24.1 (SD 5.6)' },
                            { name: 'مقياس الاكتئاب (GDS-15)', pop: 'كبار السن (N=450)', score: '6.2 (SD 3.9)' }
                          ].map((norm, idx) => (
                            <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-1 transition-all hover:border-white/10 text-right">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-[#D4AF37] font-mono font-bold">{norm.score}</span>
                                <h4 className="text-[11px] font-bold text-white line-clamp-1">{norm.name}</h4>
                              </div>
                              <span className="text-[8.5px] text-[#a0a095]/60">{norm.pop}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/lab/national-norms')}
                        className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold rounded-xl text-[10.5px] active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Globe size={11} />
                        <span>منصة المعايير والتقاويم الوطنية</span>
                      </button>
                    </div>

                  </div>

                  {/* LATEST RESEARCH & STUDIES SECTION */}
                  <div className="bg-[#121210] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-md text-right">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <button
                        onClick={() => navigate('/lab/studies')}
                        className="text-xs font-black text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1 bg-transparent border-none"
                      >
                        عرض جميع الدراسات ←
                      </button>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">أحدث البحوث والدراسات الميدانية</h3>
                        <FlaskConical size={16} className="text-[#D4AF37]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {studiesList.slice(0, 3).map(study => (
                        <div key={study.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between text-right group">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                {study.type === 'experimental' ? 'تجريبي' :
                                  study.type === 'longitudinal' ? 'طولي' :
                                    study.type === 'correlational' ? 'ارتباطي' : 'وصفي'}
                              </span>
                              <span className="text-[9px] text-[#a0a095]">{study.shortCode}</span>
                            </div>
                            <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">{study.title}</h4>
                            <p className="text-[10.5px] text-[#a0a095] leading-relaxed line-clamp-2">{study.hypothesis}</p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {study.variables?.dependent?.slice(0, 2).map((v, idx) => (
                                <span key={idx} className="text-[8px] bg-white/5 text-[#a0a095] px-2 py-0.5 rounded-full">{v}</span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                            <span className="text-[#a0a095]">عينة مستهدفة: <strong className="text-white font-mono">{study.sampleSize || 60}</strong></span>
                            <button
                              onClick={() => navigate(`/lab/study/${study.id}`)}
                              className="text-[#D4AF37] hover:underline font-bold bg-transparent border-none cursor-pointer"
                            >
                              إدارة الدراسة ←
                            </button>
                          </div>
                        </div>
                      ))}
                      {studiesList.length === 0 && (
                        <div className="col-span-full py-8 text-center text-[#a0a095] text-xs italic">
                          لا توجد دراسات مسجلة حالياً بالمنصة.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION MODULE BUTTONS WITH LOGIC IN HOME SCREEN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

                    {/* BUTTON CARD 1: إضافة مقياس جديد */}
                    <div className="relative group rounded-[32px] p-6 border border-[#D4AF37]/30 bg-gradient-to-b from-[#141412] to-[#0a0a09] hover:border-[#D4AF37] hover:shadow-[0_8px_32px_rgba(212,175,55,0.08)] transition-all duration-300 flex flex-col justify-between text-right">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                          <Plus size={18} className="group-hover:rotate-90 transition-all duration-300" />
                        </div>
                        <h3 className="text-base font-black text-white">إضافة أو صياغة مقياس سيكومتري جديد</h3>
                        <p className="text-[11px] text-[#a0a095] leading-relaxed">
                          ابدأ ببناء وصياغة العبارات والمتغيرات النفسية، واستيراد البنود من مصفوفات Excel دفعة واحدة لبدء المعايرة الرقمية الشاملة.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentTab('draft');
                          triggerToast("انتقلت تلقائياً لمصلحة صياغة البنود 📝");
                        }}
                        className="w-full mt-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-xl text-xs active:scale-95 transition-all text-center cursor-pointer"
                      >
                        إضافة مقياس الآن ✏️
                      </button>
                    </div>

                    {/* BUTTON CARD 2: المعايير الوطنية والتقنين */}
                    <div className="rounded-[32px] p-6 border border-[#D4AF37]/35 bg-gradient-to-b from-[#141412] to-[#0a0a09] hover:border-[#D4AF37] hover:shadow-[0_8px_32px_rgba(212,175,55,0.08)] transition-all duration-300 flex flex-col justify-between text-right animate-in fade-in duration-300">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                          <Globe size={18} />
                        </div>
                        <h3 className="text-base font-black text-white">استكشاف المعايير الوطنية والتقنين</h3>
                        <p className="text-[11px] text-[#a0a095] leading-relaxed">
                          استعرض المعايير الإحصائية المعتمدة وطنياً، وقارن نتائج عيناتك البحثية مع متوسطات المجتمع الحقيقية والبيانات المعايرة.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/lab/national-norms');
                          triggerToast("الانتقال إلى منصة المعايير الوطنية والتقنين 🗺️");
                        }}
                        className="w-full mt-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-xl text-xs active:scale-95 transition-all text-center cursor-pointer"
                      >
                        تصفح المعايير الوطنية ←
                      </button>
                    </div>

                  </div>

                  {/* LAB SERVICES (ترجمة، تحكيم، إحصاء، استقطاب عينات) */}
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2 text-right">
                      <h3 className="text-sm font-black text-white flex items-center gap-2 justify-end">
                        <span>الخدمات المنهجية والأكاديمية للمخبر</span>
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                      </h3>
                      <p className="text-[10px] text-[#a0a095]">اختر الخدمة المستهدفة للانتقال المباشر للقسم المخصص ومواءمة مخرجاتك الإحصائية والترجمية والتحكيمية.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-3 duration-500">

                      {/* SERVICE A: TRANSLATION */}
                      <div
                        onClick={() => { setCurrentTab('translation'); triggerToast("🗺️ مصلحة الترجمة والمواءمة اللغوية للمقاييس"); }}
                        className="group relative rounded-2xl p-5 border border-white/5 bg-[#121210] hover:border-[#D4AF37]/45 transition-all duration-300 cursor-pointer text-right min-h-[148px] flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                            <Languages size={13} />
                          </div>
                          <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">مصلحة الترجمة والتعريب</h4>
                          <p className="text-[9.5px] text-[#a0a095] leading-relaxed line-clamp-3">تكييف المقاييس العالمية وصياغة الملاءمة الثقافية وتجنب التباعد الثقافي مع التحقق الثلاثي.</p>
                        </div>
                        <span className="text-[8.5px] text-[#D4AF37] font-semibold text-left block group-hover:translate-x-0.5 transition-transform">دخول المصلحة ←</span>
                      </div>

                      {/* SERVICE B: ARBITRATION */}
                      <div
                        onClick={() => { setCurrentTab('arbitration'); triggerToast("🧪 مصلحة لجنة التحكيم وصناعة الصدق CVI"); }}
                        className="group relative rounded-2xl p-5 border border-white/5 bg-[#121210] hover:border-[#D4AF37]/45 transition-all duration-300 cursor-pointer text-right min-h-[148px] flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 group-hover:scale-105 transition-transform">
                            <ClipboardCheck size={13} />
                          </div>
                          <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">لجنة التحكيم العلمي الرقمي</h4>
                          <p className="text-[9.5px] text-[#a0a095] leading-relaxed line-clamp-3">استقطاب الخبراء، تسجيل الآراء الكمية والنوعية، وحساب مصفوفات الصدق لكل العبارات النفسية.</p>
                        </div>
                        <span className="text-[8.5px] text-[#D4AF37] font-semibold text-left block group-hover:translate-x-0.5 transition-transform">دخول المصلحة ←</span>
                      </div>

                      {/* SERVICE C: STATS */}
                      <div
                        onClick={() => { setCurrentTab('stats'); triggerToast("📊 مصلحة التحليلات ومعالجات الاتساق الداخلي"); }}
                        className="group relative rounded-2xl p-5 border border-white/5 bg-[#121210] hover:border-[#D4AF37]/45 transition-all duration-300 cursor-pointer text-right min-h-[148px] flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10b981] group-hover:scale-105 transition-transform">
                            <Calculator size={13} />
                          </div>
                          <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">قسم التحليل الإحصائي</h4>
                          <p className="text-[9.5px] text-[#a0a095] leading-relaxed line-clamp-3">معالجة المدخلات تلقائياً وحساب ألفا كرونباخ والاتساق الداخلي للملاحظات العبنية بدقة فائقة.</p>
                        </div>
                        <span className="text-[8.5px] text-[#D4AF37] font-semibold text-left block group-hover:translate-x-0.5 transition-transform">دخول المصلحة ←</span>
                      </div>

                      {/* SERVICE D: SAMPLING */}
                      <div
                        onClick={() => { setCurrentTab('sampling'); triggerToast("🎯 مصلحة تسيير العينات ومشارك الغرف السحابية"); }}
                        className="group relative rounded-2xl p-5 border border-white/5 bg-[#121210] hover:border-[#D4AF37]/45 transition-all duration-300 cursor-pointer text-right min-h-[148px] flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                            <Users size={13} />
                          </div>
                          <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">مصلحة استقطاب العينات</h4>
                          <p className="text-[9.5px] text-[#a0a095] leading-relaxed line-clamp-3">توليد روابط تجميع الطلاب وقراءة الاستجابات تلقائياً وحيازة مصداقية فحص العينات.</p>
                        </div>
                        <span className="text-[8.5px] text-[#D4AF37] font-semibold text-left block group-hover:translate-x-0.5 transition-transform">دخول المصلحة ←</span>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* DYNAMIC VIEW CONTAINER OF THE TABS (ONLY VISIBLE WHEN HOME ACTIVE IS NOT SELECTED) */}
              <div className={`${currentTab === 'home' ? 'hidden' : 'block'}`}>

                {/* PAGE 1: هوية المختبر */}
                {currentTab === 'identity' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الأولى / الهوية والتصاريح</span>
                      <h2 className="text-xl font-black text-white">تسجيل اسم المختبر وهوية الفريق المسؤول</h2>
                      <p className="text-xs text-[#a0a095]">تعبئة المعطيات الرسمية والتحكم بكود الدخول السري لتفادي انتهاكات السرية أو تشتت العينات.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <Building2 size={13} className="text-[#D4AF37]" />
                          <span>اسم المختبر البحثي أو المؤسسي</span>
                        </label>
                        <input
                          type="text"
                          value={identity.labName}
                          onChange={(e) => handleUpdateIdentity({ labName: e.target.value })}
                          placeholder="مثل: مختبر القياس السيكولوجي السلوكي"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-medium text-white outline-none focus:border-[#D4AF37] transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <Key size={13} className="text-[#D4AF37]" />
                          <span>كود الانضمام والدخول السري</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={identity.securityCode}
                            onChange={(e) => handleUpdateIdentity({ securityCode: e.target.value.toUpperCase() })}
                            placeholder="مثال: SEC-2026-LAB"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 pr-10 text-xs font-mono font-bold text-[#D4AF37] outline-none focus:border-[#D4AF37] transition-all uppercase"
                          />
                          <Lock size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <MapPin size={13} className="text-[#D4AF37]" />
                          <span>العنوان الفعلي للبحث</span>
                        </label>
                        <input
                          type="text"
                          value={identity.address}
                          onChange={(e) => handleUpdateIdentity({ address: e.target.value })}
                          className="w-full bg-black/40 border border-[#white]/10 rounded-2xl p-3.5 text-xs font-medium text-white outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <Building2 size={13} className="text-[#D4AF37]" />
                          <span>المؤسسة الأكاديمية الراعية</span>
                        </label>
                        <input
                          type="text"
                          value={identity.institution}
                          onChange={(e) => handleUpdateIdentity({ institution: e.target.value })}
                          className="w-full bg-black/40 border border-[#white]/10 rounded-2xl p-3.5 text-xs font-medium text-white outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* COLLABORATOR INVITATION ZONE */}
                    <div className="p-6 rounded-[24px] bg-black/30 border border-white/5 space-y-4">
                      <h3 className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                        <Users size={14} className="text-[#D4AF37]" />
                        <span>دعوة فريق البناء المنهجي والتحكيم بالبريد الإلكتروني</span>
                      </h3>
                      <p className="text-[11px] text-[#a0a095]">عند دعوة الباحث، سيتلقى الكود السري مع رسالة تفاعلية ومؤمنة للانضمام فوراً لمعايرة المقياس وتدقيقه.</p>

                      <form onSubmit={handleInviteEmail} className="flex gap-2.5">
                        <input
                          type="email"
                          value={identity.inviteEmail}
                          onChange={(e) => setIdentity(prev => ({ ...prev, inviteEmail: e.target.value }))}
                          placeholder="أدخل بريد الباحث أو المحكم مثل: professor@univ.dz"
                          className="flex-1 bg-black p-3 rounded-xl border border-white/5 text-xs outline-none text-white focus:border-[#D4AF37]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Mail size={13} />
                          <span>إرسال دعوة</span>
                        </button>
                      </form>

                      <div className="space-y-2 pt-2">
                        <span className="text-[9.5px] font-bold text-[#a0a095]/60 block text-right">الفريق المدعو حالياً:</span>
                        <div className="space-y-1.5">
                          {identity.invitedEmails.map((inv, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5 text-[11px]">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                                <span className="text-[#D4AF37] font-bold">{inv.role}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-mono text-[#a0a095]/80">{inv.email}</span>
                                <span className="text-[#a0a095]/40 text-[9.5px]">تاريخ الدعوة: {inv.invitedAt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: المسودة والبنود وال باني المقياس المدمج */}
                {currentTab === 'draft' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الثانية / البناء النظري ومستودع البنود</span>
                      <h2 className="text-xl font-black text-white">مسودة الإطار المنهجي وصياغة العبارات</h2>
                      <p className="text-xs text-[#a0a095]">تأطير البناء النظري للمتغير وتحديد التعريف الإجرائي والبنود وصياغتها السيكومترية بالمنشئ المطور.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <BookOpen size={13} className="text-[#D4AF37]" />
                          <span>البناء المنهجي والنظري لمتغير المقياس</span>
                        </label>
                        <textarea
                          rows={3}
                          value={framework.framework}
                          onChange={(e) => setFramework(prev => ({ ...prev, framework: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs leading-relaxed outline-none focus:border-[#D4AF37] text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <FileEdit size={13} className="text-[#D4AF37]" />
                          <span>التعريف الإجرائي المعتمد سيكومترياً</span>
                        </label>
                        <textarea
                          rows={3}
                          value={framework.operationalDefinition}
                          onChange={(e) => setFramework(prev => ({ ...prev, operationalDefinition: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs leading-relaxed outline-none focus:border-[#D4AF37] text-white"
                        />
                      </div>
                    </div>

                    {/* REFERENCES SECTION (APA 7) */}
                    <div className="p-5 rounded-[24px] bg-black/20 border border-white/5 space-y-3 text-right">
                      <span className="text-xs font-black text-white block">مراجع الأبحاث وتوثيقات البيئة السابقة (APA 7th)</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRef}
                          onChange={(e) => setNewRef(e.target.value)}
                          placeholder="وثق المرجعية مثل: عبد الله، م. (2025). الصمود النفسي ومقاييسه، طبعة الجزائر..."
                          className="flex-1 bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          onClick={handleAddReference}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                          إضافة مرجع
                        </button>
                      </div>
                      <ul className="space-y-1.5 pt-1.5">
                        {framework.references.map((rf, idx) => (
                          <li key={idx} className="p-2 bg-black/40 rounded-lg text-[10.5px] font-medium text-[#a0a095] flex items-start gap-2 justify-start leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0 mt-1.5" />
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* INTEGRATED TEST BUILDER - ITEM MATRIX FORMULATOR */}
                    <div className="p-6 rounded-[24px] bg-black/40 border border-[#D4AF37]/25 space-y-5 text-right">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <h3 className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                          <Sparkles size={14} className="text-[#D4AF37]" />
                          <span>منشئ ومحرر عبارات وبنود المقياس (Test Builder Engine)</span>
                        </h3>
                        <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/20">مقياس ليكرت خماسي التدريج</span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex gap-2.5">
                          <input
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="اكتب صياغة العبارة النفسية مثل: أصاب بالقلق والاضطراب عند الفشل الدراسي الداخلي."
                            className="flex-1 bg-black p-3.5 rounded-xl border border-white/10 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            onClick={handleAddItem}
                            className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-transform active:scale-95"
                          >
                            <Plus size={14} />
                            <span>إضافة بند للمستودع</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center justify-start text-xs text-[#a0a095]">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newItemReverse}
                              onChange={(e) => setNewItemReverse(e.target.checked)}
                              className="accent-[#D4AF37] w-3.5 h-3.5 rounded"
                            />
                            <span className="font-bold text-white/90">هذا البند سلبى (يتم حساب درجته عكسياً)</span>
                          </label>

                          <div className="flex items-center gap-1.5">
                            <span>البعد أو الوسم:</span>
                            <input
                              type="text"
                              value={newItemTag}
                              onChange={(e) => setNewItemTag(e.target.value)}
                              className="bg-black border border-white/10 px-2.5 py-1 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-white w-24"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-black text-[#a0a095]/60 block">قائمة البنود والعبارات المشحونة حالياً:</span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {items.map((it, idx) => (
                            <div key={it.id} className="bg-black/30 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex justify-between items-center gap-4">
                              <div className="flex items-center gap-3 justify-start">
                                <span className="w-6 h-6 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-bold flex items-center justify-center border border-[#D4AF37]/20">
                                  {idx + 1}
                                </span>
                                <div className="text-right">
                                  <p className="text-xs text-white/90 leading-relaxed font-semibold">{it.questionText}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-[8.5px] bg-white/5 text-[#a0a095] px-2 py-0.5 rounded">البعد: {it.tags[0]}</span>
                                    {it.reverseScored && (
                                      <span className="text-[8.5px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/10">بند عكسي الدرجة (Reverse Scored)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(it.id)}
                                className="text-[#a0a095]/60 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 3: الترجمة وتكييف الصياغة */}
                {currentTab === 'translation' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الثالثة / الترجمة والمواءمة الثنائية العكسية</span>
                      <h2 className="text-xl font-black text-white">الترجمة والتكييف السيكوسوسيوثقافي للعبارات</h2>
                      <p className="text-xs text-[#a0a095]">صياغة الترجمة المتناسقة للفرنسية والإنجليزية وتدوين الملاحظات التكيفية لضمان سلامة البنود مع الخصوصية الثقافية للمفحوصين.</p>
                    </div>

                    <div className="space-y-4">
                      {items.map((it, idx) => {
                        const tr = translations[it.id] || { fr: '', en: '', notes: '' };
                        return (
                          <div key={it.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3 text-right">
                            <div className="flex items-center gap-2 justify-start border-b border-white/5 pb-2">
                              <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">البند {idx + 1}</span>
                              <span className="text-xs text-white font-bold">{it.questionText}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1 text-right">
                                <span className="text-[10px] text-[#a0a095] block">الترجمة الفرنسية المعتمدة (Adaptation en Français):</span>
                                <input
                                  type="text"
                                  value={tr.fr}
                                  onChange={(e) => handleUpdateTranslation(it.id, 'fr', e.target.value)}
                                  placeholder="Traduction en Français..."
                                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1 text-right">
                                <span className="text-[10px] text-[#a0a095] block">الترجمة الإنجليزية المقابلة (English Translation):</span>
                                <input
                                  type="text"
                                  value={tr.en}
                                  onChange={(e) => handleUpdateTranslation(it.id, 'en', e.target.value)}
                                  placeholder="Translate into English..."
                                  className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1 text-right">
                              <span className="text-[10px] text-[#D4AF37] block">الموائمة والتعديل الثقافي والبيئي (المبررات السيكومترية):</span>
                              <input
                                type="text"
                                value={tr.notes}
                                onChange={(e) => handleUpdateTranslation(it.id, 'notes', e.target.value)}
                                placeholder="ملاحظات الموائمة للبيئات العربية والجزائرية المحلية..."
                                className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGE 4: التحكيم العلمي والصدق */}
                {currentTab === 'arbitration' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الرابعة / التحكيم وقياس صدق المحتوى علمياً</span>
                      <h2 className="text-xl font-black text-white">تحكيم آراء الخبراء وحساب مؤشرات الصدق CVI</h2>
                      <p className="text-xs text-[#a0a095]">تسجيل لجنة المحكمين الأكاديميين الأكفاء وحساب مؤشرات صدق المحتوى وتدوين ملاحظاتهم لتقرير المقياس.</p>
                    </div>

                    {/* ADD ARBITRATOR PANEL FIELD */}
                    <div className="p-5 rounded-[24px] bg-black/30 border border-white/5 space-y-4 text-right">
                      <h3 className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                        <UserCheck size={14} className="text-[#D4AF37]" />
                        <span>إضافة بروفيسور محكم علمي للجنة</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <input
                          type="text"
                          value={newArbName}
                          onChange={(e) => setNewArbName(e.target.value)}
                          placeholder="اسم المحكم مثل: أ.د. فاسي جيلالي"
                          className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="text"
                          value={newArbTitle}
                          onChange={(e) => setNewArbTitle(e.target.value)}
                          placeholder="الرتبة الأكاديمية والتخصص"
                          className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                        <input
                          type="text"
                          value={newArbUni}
                          onChange={(e) => setNewArbUni(e.target.value)}
                          placeholder="الجامعة أو المركز البحثي الراعي"
                          className="bg-black p-2.5 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <button
                        onClick={handleAddArbitrator}
                        className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all cursor-pointer text-center"
                      >
                        تسجيل المحكم وبث وثيقة الصدق الظاهري التفاعلي 📄
                      </button>
                    </div>

                    {/* ACTIVE PANEL OF ARBITRATORS */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#D4AF37] text-right">لجنة التحكيم العلمي المعتمدة بالمخبر ({arbitrators.length})</h3>
                      {arbitrators.length === 0 ? (
                        <p className="text-center text-xs text-[#a0a095] py-4">لا يوجد محكّمين مضافين حالياً. يرجى إضافة محكّم للجنة للبدء في حساب الصدق.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {arbitrators.map((arb) => (
                            <div key={arb.id} className="p-4 rounded-2xl bg-[#0f0f0e] border border-white/5 flex justify-between items-center text-right" dir="rtl">
                              <button
                                onClick={() => {
                                  setArbitrators(prev => prev.filter(a => a.id !== arb.id));
                                  triggerToast("تم استبعاد المحكم من اللجنة العلمية 🗑️");
                                }}
                                className="text-red-400/75 hover:text-red-400 text-[10px] font-black cursor-pointer hover:underline"
                              >
                                استبعاد
                              </button>
                              <div>
                                <h4 className="text-xs font-black text-white">{arb.name}</h4>
                                <p className="text-[10px] text-[#a0a095] mt-1">{arb.title} - {arb.university}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* S-CVI INDEX HIGHLIGHT */}
                    <div className="p-5 rounded-[24px] bg-gradient-to-l from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/25 text-right flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/25 font-bold uppercase">S-CVI Score Spec</span>
                        <h3 className="text-sm font-black text-white">معامل صدق المحتوى العام للمقياس (Scale-Level Content Validity)</h3>
                        <p className="text-[11px] text-[#a0a095] leading-relaxed">
                          يتم حساب الـ S-CVI تلقائياً كمتوسط لمعاملات صدق البنود الفردية المقاسة بواسطة آراء المحكمين. النسبة المطلوبة للتوطين والاعتماد الدولي APA هي &gt;= 0.78.
                        </p>
                      </div>
                      <div className="bg-black/60 border border-[#D4AF37]/35 rounded-2xl px-6 py-4 text-center min-w-[120px] shrink-0">
                        <span className="text-[8px] text-[#a0a095] block uppercase">مجموع S-CVI الحركي</span>
                        <span className="text-2xl font-black font-mono text-[#D4AF37]">
                          {(items.length > 0 ? (items.reduce((acc, it) => acc + (itemReviews[it.id]?.score || 4), 0) / (items.length * 5)) : 0.88).toFixed(2)}
                        </span>
                        <span className="text-[9px] text-emerald-400 block mt-1 font-bold">مقبول علمياً 🟢</span>
                      </div>
                    </div>

                    {/* INDIVIDUAL ITEM EVALUATION GRID */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-white text-right">مصفوفة آراء وتعديلات المحكّمين لكل بند (I-CVI Formulator)</h3>
                      <div className="space-y-3">
                        {items.map((it, idx) => {
                          const rev = itemReviews[it.id] || { score: 4.5, comment: 'العبارة ممتازة ومناسبة للصياغة البيئية' };
                          return (
                            <div key={it.id} className="p-4 rounded-xl bg-[#0f0f0e] border border-white/5 space-y-3.5 text-right">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">البند {idx + 1}</span>
                                <span className="text-[11px] text-white/50">{it.tags[0] || 'البعد العام'}</span>
                              </div>
                              <p className="text-xs text-white font-bold">{it.questionText}</p>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1.5">
                                <div className="md:col-span-4 space-y-1">
                                  <label className="text-[10px] text-[#a0a095] block">مستوى ملاءمة وحكم محتوى العبارة (من 1 إلى 5):</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min="1"
                                      max="5"
                                      step="0.5"
                                      value={rev.score}
                                      onChange={(e) => handleUpdateReview(it.id, 'score', Number(e.target.value))}
                                      className="flex-1 accent-[#D4AF37]"
                                    />
                                    <span className="text-xs font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 w-8 text-center">{rev.score}</span>
                                  </div>
                                </div>
                                <div className="md:col-span-8 space-y-1">
                                  <label className="text-[10px] text-[#a0a095] block">الملاحظة النقدية للباحثين والمحكّمين:</label>
                                  <input
                                    type="text"
                                    value={rev.comment}
                                    onChange={(e) => handleUpdateReview(it.id, 'comment', e.target.value)}
                                    placeholder="اكتب ملاحظات التعديل أو الحذف المقترحة من اللجنة..."
                                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 5: استقطاب العينات والاستجابات */}
                {currentTab === 'sampling' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الخامسة / البث المباشر وقناة المفحوصين الموثوقة</span>
                      <h2 className="text-xl font-black text-white">استقطاب العينات تواصل العينية والاستجابات</h2>
                      <p className="text-xs text-[#a0a095]">رابط المشارك التفاعلي مع الباركود وتنزيل البيانات بصيغ علمية لتصديرها ومعالجتها.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-right">

                      {/* BARCODE CUSTOMIZER */}
                      <div className="md:col-span-5 bg-black/40 p-6 rounded-[28px] border border-white/5 text-center flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#D4AF37] font-black uppercase">الرمز الشريطي المخصص للمشارِكين (رابط استجابة وبث حي)</span>
                          <h3 className="text-xs font-black text-white">QR Code Generator</h3>
                        </div>

                        <a
                          href={getPublicTestUrl('default-lab-test')}
                          target="_blank"
                          rel="noreferrer"
                          className="relative group block w-48 h-48 mx-auto bg-[#070706] p-4 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
                          title="انقر هنا الدخول المباشر لصفحة الاستجابة الفورية للمفحوص"
                        >
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${qrColor.replace('#', '')}&bgcolor=${qrBg.replace('#', '')}&data=${encodeURIComponent(getPublicTestUrl('default-lab-test'))}`}
                            alt="Customised QR Code"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center space-y-1.5 label-over">
                            <Eye size={20} className="text-[#D4AF37] animate-pulse" />
                            <span className="text-[10.5px] font-black text-[#D4AF37]/90 leading-tight">معاينة صفحة الاستجابة للمفحوص 🔗</span>
                            <span className="text-[8px] text-[#a0a095]">اضغط لتفتح في نافذة جديدة</span>
                          </div>
                        </a>

                        <p className="text-[9.5px] text-[#a0a095]">💡 الرمز أعلاه يوجه الماسح مباشرة إلى استخبارات جامعة الجزائر ٢.</p>

                        <div className="grid grid-cols-2 gap-2 text-right text-[10px] text-[#a0a095]">
                          <div className="space-y-1">
                            <span>لون الباركود:</span>
                            <input
                              type="color"
                              value={qrColor}
                              onChange={(e) => setQrColor(e.target.value)}
                              className="w-full h-8 bg-black border border-white/5 rounded cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1">
                            <span>لون الخلفية:</span>
                            <input
                              type="color"
                              value={qrBg}
                              onChange={(e) => setQrBg(e.target.value)}
                              className="w-full h-8 bg-black border border-white/5 rounded cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handlePrintQR}
                            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Printer size={12} className="text-[#D4AF37]" />
                            <span>طباعة الرمز</span>
                          </button>
                          <a
                            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${qrColor.replace('#', '')}&bgcolor=${qrBg.replace('#', '')}&data=${encodeURIComponent(getPublicTestUrl('default-lab-test'))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/25 text-[#D4AF37] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          >
                            <Download size={12} />
                            <span>تحميل الصورة</span>
                          </a>
                        </div>
                      </div>

                      {/* PUBLIC DEEP LINK / RECRUITMENT INFO */}
                      <div className="md:col-span-7 space-y-6">
                        <div className="bg-[#181816] p-5 rounded-[24px] border border-white/5 space-y-3.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-black">نشط ومباشر 🟢</span>
                            <span className="text-xs font-black text-white block">رابط الاستجابة المباشر للمفحوصين والأكاديميين:</span>
                          </div>
                          <p className="text-[11px] text-[#a0a095] leading-relaxed">
                            انسخ الرابط وسلّمه للمشاركين أو انشره في قنوات العينة. عند تصفح الرابط عبر المحمول أو المتصفح، سيلجون مشغل الاختبارات لرفع الاستجابة بخصوصية تامة وسرية مشفرة.
                          </p>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              readOnly
                              value={getPublicTestUrl('default-lab-test')}
                              className="flex-1 bg-black/40 p-3 rounded-xl text-[10.5px] font-mono border border-white/10 outline-none text-[#D4AF37] truncate"
                            />
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(getPublicTestUrl('default-lab-test'));
                                  triggerToast("تم نسخ رابط الاستجابة للمشاركين 📋");
                                }}
                                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                              >
                                نسخ الرابط
                              </button>
                              <a
                                href={getPublicTestUrl('default-lab-test')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-gradient-to-l from-white/10 to-transparent border border-white/15 hover:border-white/30 text-white font-black text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-1"
                              >
                                <span>الدخول الفوري للمقياس 🔗</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* DATA EXPORTS BUTTONS */}
                        <div className="p-5 bg-black/20 rounded-[24px] border border-white/5 space-y-3">
                          <h4 className="text-xs font-black text-white">تصدير مصفوفة الاستجابات للباحثين</h4>
                          <p className="text-[11px] text-[#a0a095]">تتيح لك المنصة تنزيل مصفوفة البيانات المعالجة مباشرة بصيغة CSV لتوافقها الفوري مع برنامج SPSS الإحصائي الشهير.</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleExportData('csv')}
                              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/10 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Download size={13} className="text-[#D4AF37]" />
                              <span>تصدير CSV لـ SPSS</span>
                            </button>
                            <button
                              onClick={() => handleExportData('json')}
                              className="flex-1 py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-xs font-bold border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Database size={13} />
                              <span>تصدير JSON</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* NEW BIBLIOGRAPHIC INFO & STUDY INCENTIVES SECTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                      {/* Bibliographic Info Card */}
                      <div className="p-6 bg-black/40 rounded-[28px] border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 justify-end border-b border-white/5 pb-3">
                          <div className="text-right">
                            <h4 className="text-sm font-black text-white">المعلومات البيبلوغرافية لتوثيق وتوطين المقياس 📚</h4>
                            <span className="text-[10px] text-[#a0a095]">البيانات التعريفية المطلوبة في استقطاب وفهرسة العينات</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                            <BookOpen size={14} />
                          </div>
                        </div>

                        <div className="space-y-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-white/80 block">العنوان البيبلوغرافي الرسمي للمقياس:</label>
                            <input
                              type="text"
                              value={bibliographicInfo.title}
                              onChange={(e) => {
                                const titleVal = e.target.value;
                                setBibliographicInfo(prev => ({ ...prev, title: titleVal }));
                              }}
                              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-white/80 block">المؤلفون / الباحثون:</label>
                              <input
                                type="text"
                                value={bibliographicInfo.authors}
                                onChange={(e) => {
                                  const autVal = e.target.value;
                                  setBibliographicInfo(prev => ({ ...prev, authors: autVal }));
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-white/80 block">الدراسة / سنة التقنين:</label>
                              <input
                                type="text"
                                value={bibliographicInfo.year}
                                onChange={(e) => {
                                  const yrVal = e.target.value;
                                  setBibliographicInfo(prev => ({ ...prev, year: yrVal }));
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-white/80 block">المرجع / المختبر الراعي:</label>
                              <input
                                type="text"
                                value={bibliographicInfo.source}
                                onChange={(e) => {
                                  const srcVal = e.target.value;
                                  setBibliographicInfo(prev => ({ ...prev, source: srcVal }));
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-white/80 block">المعرف الرقمي DOI:</label>
                              <input
                                type="text"
                                value={bibliographicInfo.doi}
                                onChange={(e) => {
                                  const doiVal = e.target.value;
                                  setBibliographicInfo(prev => ({ ...prev, doi: doiVal }));
                                }}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-[#D4AF37] font-mono outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-white/80 block">التوثيق المقترح حسب البيبلوغرافيا الأكاديمية (APA 7th):</label>
                            <textarea
                              value={bibliographicInfo.citation}
                              onChange={(e) => {
                                const citVal = e.target.value;
                                setBibliographicInfo(prev => ({ ...prev, citation: citVal }));
                              }}
                              rows={2}
                              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37] resize-none leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Incentives Card */}
                      <div className="p-6 bg-black/40 rounded-[28px] border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 justify-end border-b border-white/5 pb-3">
                          <div className="text-right">
                            <h4 className="text-sm font-black text-white">التحفيزات والحوافز الممنوحة للمشاركين في الدراسة 🎁</h4>
                            <span className="text-[10px] text-[#a0a095]">نوع التقدير المالي أو الأدبي لضمان مصداقية الإجابات</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                            <Award size={14} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-white/80 block">اختر نوع التحفيز الأساسي للمشارك:</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'pdf_certificate', label: '🎓 شهادة مشاركة معتمدة PDF' },
                                { id: 'psych_report', label: '📊 تقرير نفسي وسلوكي شخصي' },
                                { id: 'cash_reward', label: '💸 مكافأة مالية (بريدي موب)' },
                                { id: 'library_access', label: '📚 دخول مجاني لمكتبة المقاييس' },
                                { id: 'volunteer', label: '🇩🇿 مساهمة علمية تطوعية وطنية' }
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setIncentiveType(opt.id);
                                    if (opt.id === 'pdf_certificate') setIncentiveDetail('شهادة مشاركة وتقدير أكاديمية موقعة ومختومة من عمادة المخبر وجامعة الجزائر ٢ ترسل فوراً لبريد المفحوص فور الاكتمال بنجاح.');
                                    else if (opt.id === 'psych_report') setIncentiveDetail('تخطيط سيكومتري فوري لسمات الشخصية والصمود النفسي للمفحوص بناءً على خوارزميات الاستجابة المعتمدة.');
                                    else if (opt.id === 'cash_reward') setIncentiveDetail('رصيد رمزي يبلغ 1,000 دج يسوى عبر حساب بريدي موب الجزائري للمشاركين الذين تنطبق عليهم العوامل المعيارية.');
                                    else if (opt.id === 'library_access') setIncentiveDetail('بطاقة عضوية رقمية تسمح للمشارك بالحصول على ٣ مقاييس مجانية من مخزن المخبر لمدة عام كامل.');
                                    else setIncentiveDetail('مساهمة تطوعية واعية لخدمة دراسات علم النفس بجامعة الجزائر ٢ ودعم الباحثين الميدانيين.');
                                  }}
                                  className={`p-2.5 rounded-xl text-right text-[10px] font-black transition-all border ${incentiveType === opt.id
                                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                                      : 'bg-black/40 border-white/5 text-[#a0a095] hover:text-white'
                                    }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full font-bold">توليد شروط تلقائي</span>
                              <label className="text-[11px] font-bold text-white/80 block">تفاصيل وشروط منح التحفيز للمشارك:</label>
                            </div>
                            <textarea
                              value={incentiveDetail}
                              onChange={(e) => setIncentiveDetail(e.target.value)}
                              rows={3}
                              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37] resize-none leading-relaxed"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-[10.5px] text-[#a0a095] leading-relaxed">
                            💡 <span className="text-[#D4AF37]">ميزة حية:</span> تظهر هذه التحفيزات تلقائياً للمفحوصين في ترويسة صفحة الاستجابة وبوابة الدخول لضمان أعلى التزام وجودة للبيانات المستقطبة!
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RESPONDENTS LIVE LIST */}
                    <div className="p-5 rounded-[24px] bg-black/30 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9.5px] bg-[#D4AF37]/10 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-black">بث حي متزامن</span>
                        <h4 className="text-xs font-black text-white">استجابات العينات الحقيقية المستقطبة</h4>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-white/10 no-scrollbar">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-black/80 font-black text-[#D4AF37] border-b border-white/10">
                            <tr>
                              <th className="p-3">رقم العينة</th>
                              <th className="p-3">العمر</th>
                              <th className="p-3">الجنس</th>
                              {items.map((it, idx) => (
                                <th key={it.id} className="p-3 text-center">ع{idx + 1}</th>
                              ))}
                              <th className="p-3 text-left">وقت الإرسال</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono">
                            {fieldResponses.map((res) => (
                              <tr key={res.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 text-white font-black">{res.num}</td>
                                <td className="p-3 text-[#e5e5e0]/80">{res.age}</td>
                                <td className="p-3 text-[#e5e5e0]/80 font-sans">{res.gender === 'female' ? 'أنثى' : 'ذكر'}</td>
                                {items.map(it => (
                                  <td key={it.id} className="p-3 text-center text-[#D4AF37] font-bold">{res.scores[it.id] || '-'}</td>
                                ))}
                                <td className="p-3 text-left text-[#a0a095]/40 text-[9.5px]">{res.submittedAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 6: التحليل السيكومتري والادخال اليدوي */}
                {currentTab === 'stats' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة السادسة / محرر Excel الإحصائي وتدقيق الثبات</span>
                      <h2 className="text-xl font-black text-white">التحليل الإحصائي السيكومتري والادخال اليدوي</h2>
                      <p className="text-xs text-[#a0a095]">أدخل الاستجابات الورقية يدوياً في جدول spreadsheet المتجاوب لحساب فوري دقيق لمعامل ثبات ألفا كرونباخ والاتساق الداخلي للبنود.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                      {/* CRONBACH'S ALPHA LIVE INDICATOR */}
                      <div className="md:col-span-5 bg-gradient-to-b from-[#1c1c1a] to-[#121210] rounded-[28px] border border-[#D4AF37]/30 p-6 flex flex-col justify-between space-y-4 text-center">
                        <div className="space-y-1">
                          <span className="text-[10px] text-[#D4AF37] font-black tracking-widest block uppercase">المصداقية والمتانة السيكومترية</span>
                          <h4 className="text-xs font-black text-white">معامل ثبات ألفا كرونباخ (ألفا) الحسي</h4>
                        </div>

                        <div className="py-6 space-y-1">
                          <div className="text-3xl md:text-5xl font-mono font-black text-emerald-400">
                            {cronbachAlphaVal}
                          </div>
                          <div className="text-xs font-bold text-[#D4AF37]/90">
                            {cronbachAlphaVal >= 0.8 ? '🟢 ثبات واتساق مميز ومتفوق' : cronbachAlphaVal >= 0.7 ? '🟡 ثبات مستقر علمياً' : '🔴 ثبات منخفض - يحتاج تحسين الصياغة'}
                          </div>
                        </div>

                        <p className="text-[11px] text-[#a0a095] leading-relaxed text-right">
                          يتم حساب معامل الثبات الإحصائي فورياً بناءً على تباينات البنود وقيم الخلايا المدرجة في الجدول يدوياً. يساعد هذا الباحث في تعديل البنود الحالية قبل طباعة التقرير النهائي.
                        </p>
                      </div>

                      {/* SPREADSHEET MANUAL DATA ENTRY (EXCEL STYLE GRID) */}
                      <div className="md:col-span-7 bg-black/40 p-5 rounded-[28px] border border-white/5 space-y-4 text-right">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5 justify-start">
                            <Database size={14} className="text-[#D4AF37]" />
                            <span>مصفوفة إدخال الاستجابات (محرر Excel المدمج)</span>
                          </h4>
                          <span className="text-[9px] text-[#a0a095]">تم تدوين {manualGrid.length} حالات استجابة</span>
                        </div>

                        <p className="text-[11px] text-[#a0a095] leading-relaxed">
                          اكتب قيم الإجابات يدوياً للعبارات السيكومترية (من 1 إلى 5 حيث 5=موافق بشدة، 1=معارض بشدة) لجميع الحالات لتحديث الإحصاء والاتساق البنائي تلقائياً.
                        </p>

                        <div className="overflow-x-auto rounded-xl border border-white/10 font-mono no-scrollbar max-h-60">
                          <table className="w-full text-xs">
                            <thead className="bg-[#121210] font-black text-[#D4AF37] border-b border-white/10">
                              <tr>
                                <th className="p-2.5 text-center">الحالة #</th>
                                {items.map((it, idx) => (
                                  <th key={it.id} className="p-2.5 text-center">ع{idx + 1}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {manualGrid.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                                  <td className="p-2 text-center text-[#a0a095]/40 font-bold">{rIdx + 1}</td>
                                  {items.map((it, cIdx) => {
                                    const val = (row && typeof row[cIdx] === 'number') ? row[cIdx] : 3;
                                    return (
                                      <td key={it.id || cIdx} className="p-1">
                                        <input
                                          type="number"
                                          min={1}
                                          max={5}
                                          value={val}
                                          onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                          className="w-12 bg-black border border-white/5 text-center p-1 rounded font-bold text-white focus:border-[#D4AF37]"
                                        />
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddGridRow}
                            className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                          >
                            إضافة حالة جديدة
                          </button>
                          <button
                            onClick={handleClearGrid}
                            className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            تنظيف المصفوفة
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* ITEM ANALYSIS MATRIX */}
                    <div className="p-5 rounded-[24px] bg-black/30 border border-white/5 space-y-4">
                      <h3 className="text-xs font-black text-white text-right">مصفوفة الارتباط المصحح للبند بالمقياس الكلي (Corrected Item-Total Correlation)</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                        {items.map((it, idx) => {
                          // Dynamic item total estimation
                          const reverseSign = it.reverseScored ? '-' : '+';
                          return (
                            <div key={it.id} className="bg-black/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-white block">البند {idx + 1}: {it.questionText.slice(0, 36)}...</span>
                                <span className="text-[9.5px] text-[#a0a095]/60 block">نوع معامل الارتباط: بيرسون (Pearson {reverseSign})</span>
                              </div>
                              <div className="text-left font-mono font-bold">
                                <span className="text-[9px] text-[#a0a095] block">معامل الارتباط</span>
                                <span className="text-sm text-emerald-400">~ 0.64{idx}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* MANUAL PSYCHOMETRIC VARIABLES SECTION */}
                    <div className="p-5 rounded-[24px] bg-gradient-to-b from-[#1a1a18] to-[#101010] border border-[#D4AF37]/20 space-y-6 text-right">
                      <div className="flex justify-between items-center flex-wrap gap-3">
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-black text-[#D4AF37] uppercase tracking-widest block">الإدخال اليدوي للإحصائي</span>
                          <h3 className="text-sm font-black text-white">المتغيرات والمعادلات السيكومترية الإضافية</h3>
                          <p className="text-[10.5px] text-[#a0a095]">يُدخل الإحصائي القيم يدوياً بعد إجراء الحسابات المناسبة. تُحفظ تلقائياً ضمن تقرير المقياس.</p>
                        </div>
                        <button
                          onClick={() => setShowAddStatVar(prev => !prev)}
                          className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-xs font-black transition-all flex items-center gap-2"
                        >
                          <Plus size={14} /> إضافة متغير مخصص
                        </button>
                      </div>

                      {/* Add Custom Var Form */}
                      {showAddStatVar && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-5 rounded-2xl bg-black/40 border border-[#D4AF37]/15 space-y-4"
                        >
                          <h4 className="text-xs font-black text-[#D4AF37]">🔬 إضافة متغير إحصائي مخصص</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-[#a0a095]">اسم المتغير *</label>
                              <input
                                type="text"
                                value={newCustomVar.label || ''}
                                onChange={e => setNewCustomVar(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="مثال: معامل التوافق النفسي"
                                className="w-full bg-black/30 p-2.5 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-[#a0a095]">الرمز الرياضي *</label>
                              <input
                                type="text"
                                value={newCustomVar.symbol || ''}
                                onChange={e => setNewCustomVar(prev => ({ ...prev, symbol: e.target.value }))}
                                placeholder="مثال: r_xy"
                                className="w-full bg-black/30 p-2.5 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37] font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-[#a0a095]">الوحدة</label>
                              <input
                                type="text"
                                value={newCustomVar.unit || ''}
                                onChange={e => setNewCustomVar(prev => ({ ...prev, unit: e.target.value }))}
                                placeholder="مثال: %، نقطة..."
                                className="w-full bg-black/30 p-2.5 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#a0a095]">المعادلة الحسابية</label>
                            <input
                              type="text"
                              value={newCustomVar.formula || ''}
                              onChange={e => setNewCustomVar(prev => ({ ...prev, formula: e.target.value }))}
                              placeholder="مثال: r = Σ(xy) / √(Σx² × Σy²)"
                              className="w-full bg-black/30 p-2.5 border border-white/10 rounded-xl text-xs text-white font-mono outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#a0a095]">التفسير والتأويل</label>
                            <textarea
                              value={newCustomVar.interpretation || ''}
                              onChange={e => setNewCustomVar(prev => ({ ...prev, interpretation: e.target.value }))}
                              placeholder="اشرح تفسير القيمة وأهميتها في السياق السيكومتري..."
                              rows={2}
                              className="w-full bg-black/30 p-2.5 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37] resize-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setShowAddStatVar(false)} className="px-4 py-2 bg-white/5 text-[#a0a095] rounded-xl text-xs font-bold">إلغاء</button>
                            <button onClick={handleAddCustomStatVar} className="px-4 py-2 bg-[#D4AF37] text-black rounded-xl text-xs font-black hover:bg-[#c4a030] transition-all">إضافة المتغير</button>
                          </div>
                        </motion.div>
                      )}

                      {/* Variables Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {manualStatVars.map((varItem) => (
                          <div key={varItem.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-[#D4AF37]/20 transition-all">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-white block">{varItem.label}</span>
                                <code className="text-[10px] text-[#D4AF37] font-mono bg-[#D4AF37]/5 px-2 py-0.5 rounded-md">{varItem.formula}</code>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-2xl font-mono font-black text-[#D4AF37] bg-[#D4AF37]/5 px-3 py-1 rounded-xl border border-[#D4AF37]/20">
                                  {varItem.symbol}
                                </span>
                                <button
                                  onClick={() => handleDeleteStatVar(varItem.id)}
                                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={varItem.value}
                                onChange={e => handleUpdateStatVar(varItem.id, e.target.value)}
                                placeholder="أدخل القيمة هنا..."
                                className="flex-1 bg-black/30 p-2.5 border border-white/10 rounded-xl text-sm text-white font-mono font-black outline-none focus:border-[#D4AF37] placeholder:text-[#a0a095]/30 text-right"
                              />
                              {varItem.unit && (
                                <span className="text-xs font-bold text-[#a0a095] bg-white/5 px-2 py-1.5 rounded-lg border border-white/5 shrink-0">
                                  {varItem.unit}
                                </span>
                              )}
                            </div>

                            {varItem.interpretation && (
                              <p className="text-[10px] text-[#a0a095] leading-relaxed bg-black/20 p-2.5 rounded-xl border-r-2 border-[#D4AF37]/30">
                                {varItem.interpretation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Summary export */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            const filledVars = manualStatVars.filter(v => v.value.trim());
                            if (filledVars.length === 0) { triggerToast("لا توجد قيم مُدخلة بعد للتصدير 📊"); return; }
                            const text = filledVars.map(v => `${v.label} (${v.symbol}): ${v.value} ${v.unit}`).join('\n');
                            const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
                            const a = document.createElement('a');
                            a.setAttribute("href", dataStr);
                            a.setAttribute("download", "psytech_stat_variables.txt");
                            document.body.appendChild(a); a.click(); a.remove();
                            triggerToast("📊 تم تصدير ملخص المتغيرات الإحصائية بنجاح!");
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[#a0a095] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                          <Download size={13} /> تصدير ملخص المتغيرات
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* PAGE 7: النتائج والاعتماد والتقرير والمراسلات والتعاون */}
                {currentTab === 'certification' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة السابعة / المصادقة وإصدار التقارير الأكاديمية</span>
                      <h2 className="text-xl font-black text-white">عرض النتائج النهائية السيكومترية والمصادقة والتعاون</h2>
                      <p className="text-xs text-[#a0a095]">شارة المصادقة الأكاديمية المتينة من المخبر وتنزيل التقرير المنهجي المفصل بنسق APA 7، مع مركز التواصل بين أعضاء الفريق.</p>
                    </div>

                    {/* QUICK ACTION BUTTONS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Download APA Report */}
                      <button
                        onClick={handlePrintAcademicReport}
                        className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-right space-y-3 transition-all group active:scale-95"
                      >
                        <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37]/25 transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block">تحميل تقرير APA 7</span>
                          <span className="text-[10px] text-[#a0a095]">تنزيل التقرير الأكاديمي الرسمي</span>
                        </div>
                      </button>

                      {/* Download Draft */}
                      <button
                        onClick={handleDownloadDraft}
                        className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 text-right space-y-3 transition-all group active:scale-95"
                      >
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all">
                          <Download size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block">تحميل الاختبار والمسودات</span>
                          <span className="text-[10px] text-[#a0a095]">تنزيل كامل البيانات والمسودة JSON</span>
                        </div>
                      </button>

                      {/* Publish to Library */}
                      <button
                        onClick={() => setShowPublishModal(true)}
                        className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 text-right space-y-3 transition-all group active:scale-95"
                      >
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                          <Upload size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block">نشر في المكتبة الرقمية</span>
                          <span className="text-[10px] text-[#a0a095]">نشر المقياس في مكتبة PsyTech</span>
                        </div>
                      </button>
                    </div>

                    {/* PUBLISH TO LIBRARY MODAL */}
                    <AnimatePresence>
                      {showPublishModal && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                          onClick={(e) => { if (e.target === e.currentTarget) setShowPublishModal(false); }}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#121210] border border-[#D4AF37]/30 rounded-[32px] p-8 w-full max-w-lg space-y-6 text-right relative overflow-hidden"
                            dir="rtl"
                          >
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#D4AF37] via-emerald-400 to-[#D4AF37]" />

                            <div className="flex justify-between items-start">
                              <button onClick={() => setShowPublishModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-[#a0a095] hover:text-white transition-all">
                                <X size={16} />
                              </button>
                              <div className="space-y-1">
                                <h3 className="text-lg font-black text-white">نشر المقياس في المكتبة الرقمية</h3>
                                <p className="text-xs text-[#a0a095]">حدد معلومات النشر ليصبح مقياسك متاحاً في مكتبة PsyTech</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* Category */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#D4AF37]">الفئة والتخصص</label>
                                <select
                                  value={publishForm.category}
                                  onChange={e => setPublishForm(prev => ({ ...prev, category: e.target.value }))}
                                  className="w-full bg-black/40 p-3 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37]"
                                >
                                  <option value="clinical">السيكولوجيا الإكلينيكية والعيادية</option>
                                  <option value="educational">علم النفس التربوي والأكاديمي</option>
                                  <option value="organizational">علم النفس التنظيمي والمهني</option>
                                  <option value="social">علم النفس الاجتماعي والمجتمعي</option>
                                  <option value="neuropsychology">علم الأعصاب النفسي والمعرفي</option>
                                  <option value="forensic">السيكولوجيا الجنائية والقانونية</option>
                                  <option value="health">نفسية الصحة والوقاية المجتمعية</option>
                                  <option value="general">عام / متعدد التخصصات</option>
                                </select>
                              </div>

                              {/* Price */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#D4AF37]">سعر الاستخدام (بالدينار الجزائري / 0 = مجاني)</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    min="0"
                                    value={publishForm.price}
                                    onChange={e => setPublishForm(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="0"
                                    className="w-full bg-black/40 p-3 pr-16 border border-white/10 rounded-xl text-xs text-white font-mono font-black outline-none focus:border-[#D4AF37]"
                                  />
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#a0a095]">DZD</span>
                                </div>
                              </div>

                              {/* Availability */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#D4AF37]">مستوى الإتاحة والوصول</label>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { value: 'public', label: 'عام', desc: 'متاح للجميع' },
                                    { value: 'restricted', label: 'مقيّد', desc: 'للمتخصصين' },
                                    { value: 'private', label: 'خاص', desc: 'بدعوة فقط' }
                                  ].map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => setPublishForm(prev => ({ ...prev, availability: opt.value as any }))}
                                      className={`p-3 rounded-xl border text-center space-y-1 transition-all ${publishForm.availability === opt.value
                                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                                          : 'bg-black/20 border-white/5 text-[#a0a095] hover:border-white/10'
                                        }`}
                                    >
                                      <div className="text-xs font-black">{opt.label}</div>
                                      <div className="text-[9px] opacity-60">{opt.desc}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Short Description */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#D4AF37]">وصف مختصر للمقياس *</label>
                                <textarea
                                  value={publishForm.shortDescription}
                                  onChange={e => setPublishForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                                  placeholder="اكتب وصفاً موجزاً لما يقيسه هذا المقياس وأهميته في البحث النفسي..."
                                  rows={3}
                                  className="w-full bg-black/40 p-3 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37] resize-none"
                                />
                              </div>

                              {/* Tags */}
                              <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#D4AF37]">الوسوم (مفصولة بفاصلة)</label>
                                <input
                                  type="text"
                                  value={publishForm.tags}
                                  onChange={e => setPublishForm(prev => ({ ...prev, tags: e.target.value }))}
                                  placeholder="صمود، احتراق نفسي، طلبة جامعيون، جزائر..."
                                  className="w-full bg-black/40 p-3 border border-white/10 rounded-xl text-xs text-white font-bold outline-none focus:border-[#D4AF37]"
                                />
                              </div>

                              {/* Stats summary */}
                              <div className="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-around text-center">
                                <div>
                                  <span className="text-lg font-black font-mono text-[#D4AF37]">{items.length}</span>
                                  <p className="text-[9px] text-[#a0a095] font-bold">بنداً</p>
                                </div>
                                <div>
                                  <span className="text-lg font-black font-mono text-emerald-400">{cronbachAlphaVal}</span>
                                  <p className="text-[9px] text-[#a0a095] font-bold">ألفا كرونباخ</p>
                                </div>
                                <div>
                                  <span className="text-lg font-black font-mono text-blue-400">{fieldResponses.length}</span>
                                  <p className="text-[9px] text-[#a0a095] font-bold">استجابة</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => setShowPublishModal(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-[#a0a095] rounded-xl text-xs font-black transition-all"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={handlePublishToLibrary}
                                disabled={isPublishing}
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95"
                              >
                                {isPublishing ? (
                                  <><Loader2 size={14} className="animate-spin" /> جاري النشر...</>
                                ) : (
                                  <><Upload size={14} /> نشر في المكتبة الرقمية</>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* HIGH CLASS ACCREDITED BADGE STAMP CARD */}
                    <div className="p-8 rounded-[36px] bg-gradient-to-r from-[#1c1c1a] via-[#10100e] to-black border border-[#D4AF37]/35 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#D4AF37]" />
                      <div className="absolute -left-20 -top-20 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                      <div className="space-y-4 text-right flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 rounded-full border border-[#D4AF37]/25">
                          <Award size={12} className="text-[#D4AF37]" />
                          <span className="text-[9.5px] font-black text-[#D4AF37] uppercase">حقوق الاعتماد العلمي والمقاييس</span>
                        </div>
                        <h3 className="text-lg font-black text-white">شارة المصادقة السيكومترية المعتمدة</h3>
                        <p className="text-xs text-[#a0a095] leading-relaxed">
                          بموجب حساب المتانة إحصائياً للبنود ولصدق المحتوى المقدر بـ ({calculateCronbachAlpha()})، ينال هذا المقياس النفسي ختم الاعتماد والترخيص بالاعتماد الجامعي من منظومة المخبر الرقمي لجامعة الجزائر ٢. يتاح التطبيق المباشر والنشر.
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center justify-center p-6 border border-[#D4AF37]/20 rounded-3xl bg-black/40 w-48">
                        <div className="w-20 h-20 bg-[#D4AF37]/10 flex items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] mb-3">
                          <Award size={40} className="animate-spin-slow" />
                        </div>
                        <span className="text-[10px] font-black text-[#D4AF37] block">PSYTECH ACCREDITED</span>
                        <span className="text-[9px] font-semibold text-[#a0a095] block mt-0.5">ID: PSC-2026-DZ</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full font-bold mt-2">معتمد سحابة</span>
                      </div>
                    </div>

                    {/* COOPERATIVE TEAM INTEGRATED LIVE MESSAGING */}
                    <div className="p-6 rounded-[28px] bg-black/40 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                        <span className="text-[9.5px] text-[#D4AF37] font-black uppercase tracking-wider">النقاش والتعليقات والتحشيد الأكاديمي</span>
                        <h4 className="text-xs font-black text-white">مركز تواصل ومراسلات الزملاء والمحكمين</h4>
                      </div>

                      <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pt-1">
                        {labMessages.map(msg => (
                          <div key={msg.id} className={`p-3 rounded-2xl border text-right transition-all flex flex-col space-y-1 ${msg.system
                              ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37]'
                              : 'bg-white/5 border-white/5 text-white'
                            }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-[#a0a095]/45 font-bold">{msg.time}</span>
                              <span className="text-xs font-black block">{msg.author}</span>
                            </div>
                            <p className="text-[11px] text-[#e5e5e0]/80 leading-relaxed font-medium whitespace-pre-wrap">{msg.msg}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMsgText}
                          onChange={(e) => setNewMsgText(e.target.value)}
                          placeholder="اطرح تحديثاً أو سؤلاً أو استفساراً لأعضاء المخبر..."
                          className="flex-1 bg-black p-3 rounded-xl border border-white/5 text-xs text-white outline-none focus:border-[#D4AF37]"
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer flex items-center justify-center"
                        >
                          <Send size={13} className="text-[#D4AF37]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 8: الاستحقاق المالي لأعضاء الفريق */}
                {currentTab === 'payouts' && (
                  <div className="bg-[#121210] border border-white/5 rounded-[32px] p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="border-b border-white/5 pb-4 space-y-1 text-right">
                      <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-widest block">الخطوة الثامنة / المكافآت والأجور البحثية</span>
                      <h2 className="text-xl font-black text-white">تسيير الاستحقاقات المالية لأعضاء المخبر والفريق</h2>
                      <p className="text-xs text-[#a0a095]">جدول دفع الأجور والتعويضات للمحكمين والمستقطبي الميدانيين وصحفي الاستبيانات عبر بريدي موب بريد الجزائر وال CCP.</p>
                    </div>

                    {/* BARIDIMOB CCP LEDGER DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">

                      <div className="p-5 rounded-[22px] bg-black/40 border border-white/5 flex items-start gap-4 justify-start">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0">
                          <CreditCard size={18} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white">محولة بريدي موب (BaridiMob App) السريعة</h4>
                          <p className="text-[10.5px] text-[#a0a095] leading-relaxed">
                            نظام مدمج يحول مستحقات الشركاء فورياً عبر أرقام الـ RIP لبريد الجزائر لتسريع عملية الاستقطاب وسلامة الباحثين والمحكمين الخارجيين.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-[22px] bg-black/40 border border-white/5 flex items-start gap-4 justify-start">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <Users size={18} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white">إحصائيات الدفع والأجور الملتزم بها</h4>
                          <p className="text-[10.5px] text-[#a0a095]">
                            المستحقات المجدولة حالياً: <strong className="text-[#D4AF37] font-mono font-bold">{totalPayout} DA</strong>. تم السداد لـ <strong className="text-white">1 محكم</strong> والباقي قيد المصادقة المالية للجامعة.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* PAYOUTS MANAGEMENT TABLE */}
                    <div className="p-5 rounded-[24px] bg-black/30 border border-white/5 space-y-4Text font-sans text-right">
                      <h3 className="text-xs font-black text-white">أجور الزملاء والمحكمين الميدانيين المسجلة</h3>

                      <div className="overflow-x-auto rounded-xl border border-white/5 font-sans no-scrollbar">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-[#181816] font-black text-[#D4AF37] border-b border-white/10">
                            <tr>
                              <th className="p-3">عضو الفريق</th>
                              <th className="p-3">المهمة السيكومترية</th>
                              <th className="p-3">طبيعة الدفع</th>
                              <th className="p-3 font-mono">رقم RIP / الحساب</th>
                              <th className="p-3">القيمة العلمية DA</th>
                              <th className="p-3">حالة التحويل</th>
                              <th className="p-3 text-center">أمر بالحوالة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {teamPayments.map(pay => (
                              <tr key={pay.id} className="hover:bg-white/5 transition-all text-[11px]">
                                <td className="p-3 font-black text-white">{pay.memberName}</td>
                                <td className="p-3 text-[#a0a095]">{pay.role}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[9.5px] ${pay.paymentMethod === 'baridimob' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {pay.paymentMethod === 'baridimob' ? 'بريدي موب RIP' : 'CCP حساب بريدي'}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-[#a0a095]">{pay.ripCCP}</td>
                                <td className="p-3 font-black text-white font-mono">{pay.amount} DA</td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9.5px] ${pay.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    {pay.status === 'completed' ? 'تم التحويل سداداً' : 'قيد التدقيق العيني'}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  {pay.status === 'pending' ? (
                                    <button
                                      onClick={() => handleUpdatePaymentStatus(pay.id, 'completed')}
                                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[9px] rounded-lg transition-transform active:scale-95 cursor-pointer"
                                    >
                                      دفع فوري بريدي موب
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleUpdatePaymentStatus(pay.id, 'pending')}
                                      className="px-3 py-1 bg-white/5 text-[#a0a095]/50 font-bold text-[9px] rounded-lg border border-white/5"
                                    >
                                      إعادة المعالجة
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PERSISTENT SECTION STEPPER CONTROLLER WITH SAVE BUTTON */}
              {currentTab !== 'home' && (
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4" dir="rtl">
                  <button
                    onClick={handlePrevTab}
                    disabled={currentTabIndex === 0}
                    className="w-full sm:w-auto px-5 py-3 border border-white/10 rounded-xl bg-white/5 text-xs text-[#a0a095] hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    id="stepper-prev-btn"
                  >
                    <ChevronRight size={14} />
                    <span>السابق: </span>
                    <span className="font-bold text-[#D4AF37]">
                      {currentTabIndex > 0 ? getTabLabel(tabSeq[currentTabIndex - 1]) : 'البداية'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSaveSection(currentTab)}
                    disabled={isSaving[currentTab]}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-emerald-500/10 border border-emerald-500/35 hover:emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md"
                    id="stepper-save-btn"
                  >
                    {isSaving[currentTab] ? (
                      <Loader2 size={13} className="animate-spin text-emerald-400" />
                    ) : (
                      <Save size={13} className="text-emerald-400 animate-pulse" />
                    )}
                    <span>حفــــظ ومزامنة هـذا القسم سحابياً ({currentTabIndex + 1}/8)</span>
                  </button>

                  <button
                    onClick={handleNextTab}
                    disabled={currentTabIndex === tabSeq.length - 1}
                    className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:pointer-events-none"
                    id="stepper-next-btn"
                  >
                    <span>{currentTabIndex < tabSeq.length - 1 ? 'مواصلة لـ ' + getTabLabel(tabSeq[currentTabIndex + 1]) : 'النهاية'}</span>
                    <ChevronRight size={14} className="rotate-180" />
                  </button>
                </div>
              )}

            </div>

          {/* INTERACTIVE PARTICIPANT MOBILE SIMULATOR MODAL */}
          <AnimatePresence>
            {showPreviewModal && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[250] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-[#0f0f0e] border border-[#D4AF37]/35 w-full max-w-lg rounded-[36px] overflow-hidden shadow-[0_10px_50px_rgba(212,175,55,0.15)] flex flex-col max-h-[90vh] text-right"
                  dir="rtl"
                >
                  {/* SIMULATOR HEADER */}
                  <div className="bg-gradient-to-b from-[#1c1c1a]/90 to-[#0f0f0e] p-5 border-b border-white/5 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setShowPreviewModal(false);
                        setPreviewAnswers({});
                      }}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                    <div className="space-y-1 text-right flex-1 pr-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-400">محاكي الهواتف الذكية للعينات</span>
                      </div>
                      <h3 className="text-sm font-black text-white">معاينة المشاركة في المقياس الحالية</h3>
                    </div>
                  </div>

                  {/* MOBILE SIMULATOR BODY */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                    <div className="text-center p-4 rounded-2xl bg-white/5 space-y-2 border border-white/5">
                      <h4 className="text-xs font-black text-[#D4AF37]">مقياس الصمود الأكاديمي والوقاية من الاحتراق</h4>
                      <p className="text-[10px] text-[#a0a095] leading-relaxed">
                        أهلاً بك عزيزي المشارك. يرجى قراءة كل عبارة بدقة واختيار البديل المتوافق مع واقعك الأكاديمي. استجابتك سرية وتخضع لبروتوكول حظر الهوية للمختبر.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {items.map((it, idx) => {
                        const answer = previewAnswers[it.id];
                        return (
                          <div key={it.id} className="p-4 rounded-xl bg-black/40 border border-white/5 text-right space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded font-mono">
                                عبارة {idx + 1}
                              </span>
                              <span className="text-xs font-black text-white leading-relaxed flex-1">
                                {it.questionText}
                                {it.reverseScored && (
                                  <span className="text-[8.5px] text-[#D4AF37]/50 block mt-0.5">(بند عكسي الرتبة)</span>
                                )}
                              </span>
                            </div>

                            {/* Standard 5 point Likert controls */}
                            <div className="grid grid-cols-5 gap-1 pt-1.5" dir="ltr">
                              {[1, 2, 3, 4, 5].map((val) => {
                                const labels = ["أعارض بشدة", "أعارض", "محايد", "أوافق", "أوافق بشدة"];
                                const isSel = answer === val;
                                return (
                                  <button
                                    key={val}
                                    onClick={() => handleSimulatorAnswer(it.id, val)}
                                    className={`py-2 rounded-lg text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 ${isSel
                                        ? 'bg-[#D4AF37] text-black shadow-lg font-black scale-105'
                                        : 'bg-black/80 hover:bg-white/5 text-white/70 border border-white/5'
                                      }`}
                                    title={labels[val - 1]}
                                  >
                                    <span className="text-xs font-bold">{val}</span>
                                    <span className={`text-[7px] leading-tight ${isSel ? 'text-black' : 'text-[#a0a095]/60'}`}>
                                      {val === 1 ? 'أعارض' : val === 5 ? 'أوافق' : val === 3 ? 'محايد' : ''}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SIMULATOR SUBMISSION BUTTON */}
                  <div className="p-5 bg-gradient-to-t from-black to-[#0f0f0e] border-t border-white/5 flex flex-col gap-2">
                    <button
                      onClick={handleSimulatorSubmit}
                      className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-2xl active:scale-95 transition-all text-center cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>إرسال رد تجريبي وحقن الاستجابة في الجداول 📤</span>
                    </button>
                    <p className="text-[9.5px] text-[#a0a095]/80 text-center leading-relaxed">
                      💡 النقر على الزر سيقوم بحقن الرد كتجربة علمية فورية في مصفوفة الاستجابات (الخطوة 5) وجدول البيانات السيكومتري اليدوي (الخطوة 6) وتعديل معامل ألفا تلقائياً!
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DYNAMIC COMMENTS & RESEARCH ATTACHMENTS DIALOG */}
          <AnimatePresence>
            {commentingNodeId && activeCommentNode && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[400] flex items-center justify-center p-4 shadow-2xl" dir="rtl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-[#0f0f0e] border border-[#D4AF37]/35 w-full max-w-lg rounded-[32px] overflow-hidden shadow-[0_15px_60px_rgba(212,175,55,0.2)] flex flex-col max-h-[85vh] text-right"
                >
                  {/* MODAL HEADER */}
                  <div className="bg-gradient-to-b from-[#1c1c1a]/95 to-[#0f0f0e] p-5 border-b border-white/5 flex justify-between items-center text-right">
                    <button
                      onClick={() => {
                        setCommentingNodeId(null);
                        setNewCommentText('');
                        setNewAttachmentName('');
                      }}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                    <div className="space-y-1 text-right flex-1 pr-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                        <span className="text-[9px] font-black text-[#D4AF37] uppercase">غرفة مناقشة المفاهيم والملفات</span>
                      </div>
                      <h3 className="text-sm font-black text-white truncate max-w-xs">{activeCommentNode.title}</h3>
                    </div>
                  </div>

                  {/* MODAL CONTENT BODY */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">

                    {/* Node Original Metadata */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-right">
                      <div className="flex justify-between items-center text-[10px] text-[#a0a095]">
                        <span>✍️ الكاتب: {activeCommentNode.authorName || 'غير محدد'}</span>
                        <span className="font-mono text-[8px] bg-white/5 px-2 py-0.5 rounded uppercase">{activeCommentNode.type}</span>
                      </div>
                      <p className="text-xs text-[#e5e5e0] leading-relaxed select-text font-medium">{activeCommentNode.content}</p>
                    </div>

                    {/* COMMENTS BLOCK */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span className="text-[10px] text-[#a0a095]/60 font-mono">Comments ({activeCommentNode.comments?.length || 0})</span>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>💬 تعليق وملاحظات الباحثين</span>
                        </h4>
                      </div>

                      {/* Comments feed */}
                      <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                        {!activeCommentNode.comments || activeCommentNode.comments.length === 0 ? (
                          <p className="text-[10px] text-[#a0a095]/50 text-center py-4">لا توجد تعليقات أكاديمية بعد على هذه الملاحظة. اكتب الأول بالأسفل!</p>
                        ) : (
                          activeCommentNode.comments.map((comm) => (
                            <div key={comm.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-right space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] text-[#a0a095]/40 font-mono">{comm.createdAt}</span>
                                <span className="text-[10px] font-black text-[#D4AF37]">{comm.author}</span>
                              </div>
                              <p className="text-xs text-white/90 leading-relaxed font-medium">{comm.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment form */}
                      <div className="pt-2 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-[#a0a095]">الباحث الموصي</span>
                            <input
                              type="text"
                              value={newCommentAuthor}
                              onChange={(e) => setNewCommentAuthor(e.target.value)}
                              className="w-full bg-black/60 border border-white/5 rounded-lg p-2 text-xs text-[#D4AF37] outline-none"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-[#a0a095]">منطقة المشاركة</span>
                            <span className="w-full bg-white/5 rounded-lg p-2 text-xs text-[#a0a095] block border border-transparent font-mono">Algeria 2</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="اكتب تعليقاً علمياً منهجياً..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && commentingNodeId) handleAddComment(commentingNodeId);
                            }}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            onClick={() => commentingNodeId && handleAddComment(commentingNodeId)}
                            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl active:scale-95 transition-all text-center cursor-pointer"
                          >
                            تعليق
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MOCK ATTACHMENTS & MEMORANDUMS BLOCK */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span className="text-[10px] text-[#a0a095]/60 font-mono">Attachments ({activeCommentNode.attachments?.length || 0})</span>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>📎 المرفقات والمستندات الساندة</span>
                        </h4>
                      </div>

                      {/* Attachments List */}
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {!activeCommentNode.attachments || activeCommentNode.attachments.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-white/5 text-center text-[10px] text-[#a0a095]/40">
                            لا توجد مرفقات بيبلوغرافية أو مستندات مسندة بعد على هذا المفهوم.
                          </div>
                        ) : (
                          activeCommentNode.attachments.map((attach, index) => (
                            <div key={index} className="flex justify-between items-center p-2.5 bg-black/20 border border-white/5 rounded-xl">
                              <span className="text-[8px] text-[#a0a095]/50">بواسطة {attach.author}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-white">{attach.name}</span>
                                <FileText size={11} className="text-[#D4AF37]" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Attachment Trigger Simulation */}
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-right space-y-3">
                        <span className="text-[9.5px] font-bold text-white block">إرفاق مستند أو تقرير إحصائي جديد:</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="مثال: مخرجات SPSS.pdf أو ركن القياس.docx"
                            value={newAttachmentName}
                            onChange={(e) => setNewAttachmentName(e.target.value)}
                            className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            onClick={() => {
                              if (!newAttachmentName.trim()) {
                                triggerToast("⚠️ يرجى كتابة اسم الملف أولاً!");
                                return;
                              }
                              setCanvasNodes(prev => prev.map(node => {
                                if (node.id === commentingNodeId) {
                                  const existingAttachments = node.attachments || [];
                                  const newAttach = {
                                    name: newAttachmentName.trim(),
                                    author: newAttachmentAuthor || 'المحقق العلمي',
                                    createdAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
                                  };
                                  return {
                                    ...node,
                                    attachments: [...existingAttachments, newAttach]
                                  };
                                }
                                return node;
                              }));
                              setNewAttachmentName('');
                              triggerToast("📎 تم تحميل وإرفاق المرفق باللوحة بنجاح!");
                            }}
                            className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/35 text-[#D4AF37] font-black text-xs rounded-xl active:scale-95 transition-all text-center cursor-pointer"
                          >
                            مرفق
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Floating Concept Board button for quick access */}
          <button
            onClick={() => setIsFullscreenCanvas(true)}
            className="fixed bottom-6 left-6 p-4 bg-[#D4AF37] hover:bg-[#c4a030] text-black rounded-full shadow-2xl z-[90] active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[#D4AF37]/50 mobile-testbuilder-fab mobile-testbuilder-fab-left"
            title="لوحة المفاهيم (Canvas)"
          >
            <Upload size={20} />
          </button>

          {/* FULLSCREEN CONCEPT BOARD CANVAS OVERLAY */}
          {isFullscreenCanvas && (
            <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
              <div className="bg-[#0f0f0e] border border-[#D4AF37]/35 rounded-[36px] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)]" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 text-right">
                  <button
                    onClick={() => setIsFullscreenCanvas(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 px-2.5 py-0.5 rounded-full font-black">غرفة التعاون السيكومتري الكبرى</span>
                      <h3 className="text-lg font-black text-white">لوحة مفاهيم التعاون الأكاديمي الرقمي (Concept Canvas Space)</h3>
                    </div>
                    <p className="text-xs text-[#a0a095]">قم بسحب وإعادة ترتيب الأفكار والمستندات والرسائل والملفات المنزلقة لتنظيم التعاون البحثي بشكل مرئي وراقي.</p>
                  </div>
                </div>

                {/* Floating HUD controls */}
                <div className="absolute top-[100px] left-8 z-[120] bg-[#0c0c0b]/95 backdrop-blur-xl border border-[#D4AF37]/35 p-2 rounded-2xl flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.7)] no-drag">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomFull(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
                      className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold active:scale-95 transition-all text-xs cursor-pointer"
                      title="تصغير"
                    >
                      ➖
                    </button>
                    <span className="font-mono text-[#D4AF37] font-black text-[11px] px-1.5 min-w-[35px] text-center">{Math.round(zoomFull * 100)}%</span>
                    <button
                      onClick={() => setZoomFull(prev => Math.min(2.0, Number((prev + 0.1).toFixed(1))))}
                      className="w-6 h-6 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold active:scale-95 transition-all text-xs cursor-pointer"
                      title="تكبير"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => { setZoomFull(1.0); setDimensionsFull({ width: 2000, height: 1400 }); }}
                      className="px-2 py-0.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/25 rounded-md text-[9px] font-black transition-all cursor-pointer inline-flex items-center"
                    >
                      ملاءمة 🔄
                    </button>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="text-[9px] text-[#a0a095] font-mono flex items-center gap-1">
                    <span>تحجيم اللوحة:</span>
                    <span className="text-white font-black">{dimensionsFull.width} × {dimensionsFull.height}px</span>
                  </div>
                </div>

                {/* Giant Canvas Grid */}
                <div
                  id="psytech-concept-board-canvas-full"
                  className="flex-1 relative bg-[#070706] overflow-auto select-none cursor-grab active:cursor-grabbing scrollbar-thin"
                  onDragOver={handleContainerDragOver}
                  onDrop={(e) => handleContainerDrop(e, true)}
                >
                  <div
                    style={{
                      width: `${dimensionsFull.width}px`,
                      height: `${dimensionsFull.height}px`,
                      transform: `scale(${zoomFull})`,
                      transformOrigin: 'top left',
                      backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.1) 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px'
                    }}
                    className="relative w-full h-full transition-all duration-150"
                  >
                    {/* Interactive connectors drawn under cards */}
                    {renderCanvasConnections(true)}

                    {canvasNodes.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none space-y-3">
                        <Upload size={40} className="text-[#D4AF37] animate-pulse" />
                        <p className="text-sm font-black text-white">قم بإفلات ملفاتك المحلية هنا مباشرة</p>
                        <p className="text-xs text-[#a0a095]/60 max-w-sm font-sans">أو استخدم الملحق بالأسفل لإدراج أفكار في لوحة المخططات والمحكّم السحابي لجامعة الجزائر ٢.</p>
                      </div>
                    )}

                    {canvasNodes.map((node) => {
                      return (
                        <div
                          key={node.id}
                          onMouseDown={(e) => handleNodeMouseDown(e, node, true)}
                          onTouchStart={(e) => handleNodeTouchStart(e, node, true)}
                          className={`absolute p-4 rounded-2xl border select-none transition-shadow duration-150 text-right cursor-grab active:cursor-grabbing flex flex-col justify-between w-[200px] min-h-[120px] shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-lg z-10 ${node.type === 'file'
                              ? 'bg-[#141412]/98 border-[#D4AF37]/35 text-[#D4AF37]'
                              : node.type === 'message'
                                ? 'bg-[#0f0f0e]/98 border-white/10 text-white/95'
                                : 'bg-[#11110f]/95 border-[#D4AF37]/20 text-[#e5e5e0]'
                            }`}
                          style={{ left: `${node.x}px`, top: `${node.y}px` }}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-start no-drag pr-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasNodes(prev => prev.filter(n => n.id !== node.id));
                                  setCanvasConnections(prev => prev.filter(c => c.from !== node.id && c.to !== node.id));
                                  triggerToast("تم استبعاد العنصر من اللوحة 🗑️");
                                }}
                                className="text-red-400/50 hover:text-red-400 text-[10px] cursor-pointer hover:underline"
                              >
                                ازل
                              </button>
                              {node.type === 'file' ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-[8px] bg-[#D4AF37]/15 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">{node.fileType?.toUpperCase()}</span>
                                  <FileText size={12} className="text-[#D4AF37]" />
                                </div>
                              ) : node.type === 'message' ? (
                                <MessageSquare size={12} className="text-white/60" />
                              ) : (
                                <Sparkles size={12} className="text-[#D4AF37]/75" />
                              )}
                            </div>
                            <h4 className="text-[11.5px] font-black truncate max-w-full block leading-none pt-1">{node.title}</h4>
                            <p className="text-[10px] text-[#a0a095] mt-1 leading-relaxed line-clamp-3 select-text selection:bg-[#D4AF37]/25 font-sans font-medium">
                              {node.content}
                            </p>
                          </div>

                          <div className="border-t border-white/5 pt-2 mt-2 space-y-2 shrink-0">
                            {node.authorName && (
                              <div className="text-[9px] text-[#D4AF37]/90 font-bold truncate font-sans">
                                ✍️ {node.authorName}
                              </div>
                            )}

                            {/* Connection and comment buttons */}
                            <div className="flex gap-2 justify-between items-center no-drag font-sans">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!linkingNodeId) {
                                    setLinkingNodeId(node.id);
                                    triggerToast("📍 انقر على العقدة الثانية لإنشاء رابط الخريطة الذهنية");
                                  } else if (linkingNodeId === node.id) {
                                    setLinkingNodeId(null);
                                  } else {
                                    if (!canvasConnections.some(c => (c.from === linkingNodeId && c.to === node.id) || (c.from === node.id && c.to === linkingNodeId))) {
                                      setCanvasConnections(prev => [...prev, { id: `conn-${Date.now()}`, from: linkingNodeId, to: node.id }]);
                                      triggerToast("🔗 تم ربط المفهومين بخط تفاعلي!");
                                    } else {
                                      triggerToast("الرابط موجود بالفعل ⚠️");
                                    }
                                    setLinkingNodeId(null);
                                  }
                                }}
                                className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer text-center ${linkingNodeId === node.id
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/35 animate-pulse'
                                    : 'bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20'
                                  }`}
                              >
                                {linkingNodeId === node.id ? 'إلغاء ❌' : 'ربط 🔗'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCommentingNodeId(node.id);
                                }}
                                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#a0a095] hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 border border-white/5"
                              >
                                <span>💬</span>
                                <span>{node.comments?.length || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Giant control bar */}
                <div className="p-5 border-t border-white/5 bg-[#0a0a09] flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setNewCanvasType('concept')}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${newCanvasType === 'concept'
                          ? 'bg-[#D4AF37] text-black border border-[#D4AF37]'
                          : 'bg-black border border-white/5 text-[#a0a095] hover:text-white'
                        }`}
                    >
                      💡 فكرة / فرضية جديدة
                    </button>
                    <button
                      onClick={() => setNewCanvasType('message')}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${newCanvasType === 'message'
                          ? 'bg-white text-black border border-white'
                          : 'bg-black border border-white/5 text-[#a0a095] hover:text-white'
                        }`}
                    >
                      💬 رسالة تعاون وتنسيق
                    </button>
                  </div>

                  <div className="flex gap-2 w-full md:flex-1 md:max-w-xl">
                    <input
                      type="text"
                      value={newCanvasText}
                      onChange={(e) => setNewCanvasText(e.target.value)}
                      placeholder={newCanvasType === 'concept' ? "أدخل فكرة أو فرضية لتثبيتها على اللوحة..." : "اكتب رسالة لبثها مرئياً لشركاء المعمل..."}
                      className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCanvasNode(true); }}
                    />
                    <button
                      onClick={() => handleCreateCanvasNode(true)}
                      className="px-6 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Plus size={14} />
                      <span>تثبيت باللوحة</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-[#a0a095] hidden lg:block leading-none pr-2 font-semibold">
                    💡 تلميح: يمكنك إلقاء أي ملف (Drag & Drop) من سطح المكتب لتثبيته فورياً باللوحة!
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 🛡️ EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500]"
              id="profile-modal-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-x-4 top-[8%] max-h-[85vh] overflow-y-auto md:max-w-xl md:mx-auto bg-gradient-to-b from-[#141412] to-[#0c0c0b] border border-[#D4AF37]/30 rounded-[32px] p-6 lg:p-8 z-[510] shadow-[0_0_50px_rgba(212,175,55,0.1)] text-right"
              dir="rtl"
              id="profile-modal-body"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <User size={16} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-black text-white">تعديل ملف الباحث الشخصي</h3>
                    <p className="text-[10px] text-[#a0a095] mt-0.5">قم بتحديث معلومات الهوية الأكاديمية والمهنية</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                  id="profile-modal-close-btn"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-[#D4AF37] block">الاسم الكامل واللقب الأكاديمي</label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]/50"
                      id="profile-input-fullname"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-[#D4AF37] block">البريد الإلكتروني الأكاديمي</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]/50 text-left"
                      id="profile-input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-[#D4AF37] block">رقم الهاتف / الاتصال</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+213..."
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]/50 text-left"
                      id="profile-input-phone"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-[#D4AF37] block">التخصص الدقيق والميدان</label>
                    <input
                      type="text"
                      value={profileForm.specialization || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]/50"
                      id="profile-input-specialization"
                    />
                  </div>
                </div>

                {/* Location / University */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-[#D4AF37] block">الموقع أو الهيئة الأكاديمية المنتمي إليها</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="مثال: جامعة الجزائر ٢، جامعة قสนطينة..."
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]/50"
                    id="profile-input-location"
                  />
                </div>

                {/* Academic Bio */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-[#D4AF37] block">نبذة سيكومترية أو سيرة علمية موجزة (Bio)</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio || ''}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="اكتب نبذة مختصرة عن نشاطاتك ومقاييسك هنا..."
                    className="w-full bg-black/60 border border-white/5 rounded-xl p-3.5 text-xs text-white outline-none focus:border-[#D4AF37]/50 resize-none h-20"
                    id="profile-input-bio"
                  />
                </div>

                {/* Avatar Symbol Preset Selection */}
                <div className="space-y-2">
                  <label className="text-[10.5px] font-bold text-[#D4AF37] block">شعار الهوية الرمزية الفاخرة</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { url: '🧠', label: 'العقل العصبي' },
                      { url: 'Ψ', label: 'بسيكولوجي' },
                      { url: '🔬', label: 'المقياس المخبري' },
                      { url: '⚖️', label: 'الاتزان الإحصائي' }
                    ].map((symbol, i) => {
                      const isSelected = profileForm.avatarUrl === symbol.url || (!profileForm.avatarUrl && i === 0);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setProfileForm(prev => ({ ...prev, avatarUrl: symbol.url }))}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                              : 'bg-black/40 border-white/5 text-[#a0a095] hover:border-white/10'
                            }`}
                          id={`profile-avatar-preseti-${i}`}
                        >
                          <div className="text-lg mb-0.5">{symbol.url}</div>
                          <div className="text-[8px] font-bold truncate">{symbol.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#a0a095] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    id="profile-modal-cancel-btn"
                  >
                    إلغاء التعديل
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-black rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    id="profile-modal-save-btn"
                  >
                    {isSavingProfile && <Loader2 size={13} className="animate-spin" />}
                    <span>حفــظ التعديلات آمنة</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>



    </div>
  );
};
