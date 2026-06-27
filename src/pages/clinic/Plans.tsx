import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Target,
  Calendar,
  Sparkles,
  BookOpen,
  Clipboard,
  Check,
  ChevronRight,
  User,
  Trash2,
  FileText,
  Link,
  ChevronLeft,
  Settings,
  ShieldCheck,
  Save,
  Wand2,
  BookmarkCheck
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { EmptyState } from '../../components/clinic/EmptyState';
import { getCases, getLockerItems, getTreatmentPlan, saveTreatmentPlan, PatientCase, LockerItem, TreatmentPlan } from '../../lib/clinic';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

interface CustomPhase {
  title: string;
  description: string;
  clinicalObjective: string;
  techniques: string[];
  suggestedDuration: string;
  linkedLockerItems?: string[]; // IDs of LockerItem
}

interface NewProtocol {
  id: string;
  caseId: string;
  patientCode: string;
  title: string;
  scientificModality: string;
  briefExplanation: string;
  phases: CustomPhase[];
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
}

export const Plans: React.FC = () => {
  // Load dynamic data from storage/API
  const [cases, setCases] = useState<PatientCase[]>(() => getCases());
  const [lockerItems] = useState<LockerItem[]>(() => getLockerItems());
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for protocols
  const [protocols, setProtocols] = useState<NewProtocol[]>(() => {
    const saved = localStorage.getItem('clinic_custom_protocols');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    
    // Seed initials based on existing treatment plans or defaults
    const initialProtocols: NewProtocol[] = [
      {
        id: 'proto-1',
        caseId: 'case-1',
        patientCode: 'A7B2-X9K4',
        title: 'بروتوكول السلوك المعرفي لعلاج قلق المخاوف الاجتماعية المكثف',
        scientificModality: 'العلاج السلوكي المعرفي (CBT) المطور',
        briefExplanation: 'يركز هذا البروتوكول العلمي على كسر حلقة التجنب الاجتماعي من خلال التدريب على استجواب الأفكار السلبية التلقائية والتعرض التدريجي لمثيرات الخوف بمساعدة مراجع المقراءة الببليوغرافية.',
        progress: 45,
        status: 'active',
        createdAt: '2026-04-01',
        phases: [
          {
            title: 'المرحلة 1: رسم الخريطة المعرفية والتثقيف السيكولوجي السلوكي',
            description: 'فهم النموذج الثلاثي والمثيرات المسؤولة عن بدء النوبة وبناء نموذج تشاركي مخصص.',
            clinicalObjective: 'التثقيف النفسي وتفكيك النموذج الإدراكي للقلق.',
            techniques: ['سجل رصد الأفكار السلبية (NATs)', 'فهم حلقة التجنب السلوكي', 'الاسترخاء العضلي المتدرج'],
            suggestedDuration: 'جلستان سريريتان',
            linkedLockerItems: ['lock-1']
          },
          {
            title: 'المرحلة 2: إعادة الهيكلة والتجريب السلوكي المعرفي المعارض',
            description: 'تحدي الأفكار والانبثاق الوجداني السلبي وبناء قناعات بديلة موضوعية.',
            clinicalObjective: 'تعليم الحالة أسلوب التساؤل السقراطي المستنير.',
            techniques: ['تفنيد فكرة أسوأ الاحتمالات', 'الاستجواب المعرفي الفعال للذات', 'تصميم بطاقة الاستبصار الطارئ'],
            suggestedDuration: '3 جلسات تفاعلية',
            linkedLockerItems: ['lock-3']
          },
          {
            title: 'المرحلة 3: التعرض العيني المنهجي التدريجي الموجه',
            description: 'التشجيع العملي على مواجهة المثيرات الميدانية المسجلة بمدرج القلق.',
            clinicalObjective: 'إطفاء استجابة القلق التجنبية وإحلال السلوك المرن.',
            techniques: ['مدرج الاستثارة التدريجي (SUDS)', 'تجربة ميدانية مع فك ردود الفعل العصبية', 'التعامل التوكيدي المعزز للموقف'],
            suggestedDuration: '4 جلسات عملية',
            linkedLockerItems: []
          },
          {
            title: 'المرحلة 4: الحصانة النفسية الشاملة وتوطيد المكاسب والوقاية',
            description: 'مكافحة فجوات المخططات الجوهرية العميقة وتأصيل أدلة الطوارئ الذاتية للمستقبل.',
            clinicalObjective: 'تأمين استقلالية الحالة في إدارة معوقات الرعاية اللاحقة.',
            techniques: ['صياغة دليل الإنقاذ الذاتي السلوكي', 'توثيق خارطة التحسن السيكومتري البعدي', 'جدول جلسات المتابعة الوقائية السنوية'],
            suggestedDuration: 'جلستان إكلينيكيتان',
            linkedLockerItems: ['lock-2']
          }
        ]
      }
    ];
    return initialProtocols;
  });

  // State to switch view to Protocol Designer / Workspace
  const [isDesigning, setIsDesigning] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedModality, setSelectedModality] = useState('cbt');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('adult');
  const [customGoals, setCustomGoals] = useState('');
  const [diagnosisDetails, setDiagnosisDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Active Designer Protocol Workspace
  const [activeProtocol, setActiveProtocol] = useState<NewProtocol | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Custom tool handling within designer phases
  const [newTechniqueInput, setNewTechniqueInput] = useState('');

  // Active workspace sidebar options: 'suggestions' or 'locker'
  const [sidebarTab, setSidebarTab] = useState<'locker' | 'suggestions'>('suggestions');

  // Scientific local library for clinical reference and direct copy-paste values
  const getModalitySuggestions = (modalityKey: string) => {
    const norm = (modalityKey || '').toLowerCase();
    if (norm.includes('cbt') || norm.includes('cognitive') || norm.includes('behavioral')) {
      return {
        name: 'المدرسة المعرفية السلوكية (CBT)',
        brief: 'تركز على قياس وتكسير الارتباط العاطفي المشوه بين الأفكار التلقائية السلبية (NATs) والسلوكيات التجنبية المقيدة.',
        tips: [
          {
            title: 'المرحلة 1: رسم الخارطة السريرية والتثقيف النفسي المبدئي',
            objective: 'تثبيت خط الأساس للأعراض وبناء الوعي بالارتباط الثلاثي (أفكار، مشاعر، فسيولوجيا).',
            description: 'تعليم المريض كيفية رصد وتأريخ المشاعر السلبية ومحفزات النوبات وكسر الاندفاع الفسيولوجي المبدئي عبر الفنيات الاسترخائية.',
            techniques: ['سجل رصد الأفكار التلقائية (Daily NATs Log)', 'التثقيف النفسي بنموذج A-B-C المعرفي', 'الاسترخاء العضلي المتدرج لضبط الاستجابات العصبية']
          },
          {
            title: 'المرحلة 2: إعادة الهيكلة المعرفية والتجريب السلوكي الموجه',
            objective: 'تفنيد المخططات العقلية الصلبة وزوال توهين الأنا عبر ركائز الحوار السقراطي الذاتي.',
            description: 'توجيه المريض نحو استجواب فكرة أسوأ الاحتمالات واختبار صدق الأفكار التلقائية عبر تصميم تجارب وسجلات عيانية رصينة.',
            techniques: ['تقنية الاستجواب السقراطي المنظم', 'بطاقات المواجهة والتثبيت النفسي العاجل', 'تصميم واختبار فرضية السلوك المعارض']
          },
          {
            title: 'المرحلة 3: التعرض العيني المتدرج وتثبيط منع الاستجابة الشرطية',
            objective: 'إطفاء هرمونات الاستثارة المذعورة والترويض التدريجي لمواجهة مثيرات القلق السريري.',
            description: 'تشجيع الحالة عملياً وميدانياً على الاقتراب المعير لدوائر القلق دون اللجوء مطلقا للانفصال أو الهروب المقنع.',
            techniques: ['مدرج الاستثارة التدريجي وتقييم SUDS', 'تطبيق منع الاستجابة السلوكية التجنبية (ERP)', 'فنيات الحضور وتوسيع سعة التنفس أثناء اللحظات الحرجة']
          },
          {
            title: 'المرحلة 4: الحصانة النفسية الشاملة وصيانة المكاسب والوقاية البعدية',
            objective: 'تمكين العميل ليتولى رعاية خطة الشفاء بصفته الطبيب الداخلي الأول لنفسه.',
            description: 'تجهيز دليل الطوارئ الذاتي المتكامل لتجاوز عثرات المستقبل، وتأصيل السقالات المعرفية البديلة لحفظ ديمومة التطور السلوكي.',
            techniques: ['صياغة كتيب الإنقاذ السلوكي الذاتي المخصص', 'المقاييس البعدية لقياس معدل الاتزان والتحسن', 'خطط المتابعة الوقائية ومراجعة المحاور الحيوية المكتسبة']
          }
        ]
      };
    } else if (norm.includes('act') || norm.includes('acceptance') || norm.includes('commitment')) {
      return {
        name: 'مدرسة القبول والالتزام (ACT)',
        brief: 'تهدف لبناء مرونة نفسية عبر التوقف التام عن محاربة التجربة الوجدانية، وتأصيل النية نحو القيم الكبرى.',
        tips: [
          {
            title: 'المرحلة 1: مواجهة العجز الإبداعي ورصد التجنب التجريبي السلبي',
            objective: 'رصد عدم فاعلية جهود التجنب وقبول الحضور الروحي دون قلق.',
            description: 'مساعدة العميل على رصد الكلفة الباهظة للمعركة الداخلية المفتعلة ضد العواطف وتقييم الخسائر الحياتية المترتبة على الهروب.',
            techniques: ['سجل تقييم كلفة التجنب المعيشي والروحي', 'تمرين الاستقرار الأرضي بالحواس الخمس العيانية', 'ملاحظة الأفكار ككائن منفصل والترحيب بوجوده']
          },
          {
            title: 'المرحلة 2: نزع الاندماج والارتباط اللغوي بتمثيل اليقظة الوجدانية',
            objective: 'منع تماهي الذات مع الأفكار وإرساء وعي الملاحظ الساكن.',
            description: 'تدريب الحالة على فك التشوهات اللغوية للأنا، ورؤية الأفكار كمجرد سحب عابرة فوق مسطح العقل الشاسع.',
            techniques: ['تسمية فقاعات الأفكار السارحة الطافية', 'تمرين ترحيب الضيف الثقيل بالمصافحة والقبول', 'استنشاق الوعي من موقع الذات كسياق دائم']
          },
          {
            title: 'المرحلة 3: كشف وتبيان بوصلة القيم الكبرى للوجود',
            objective: 'استجلاء القيم الوجدانية الحركية لتقود العميل لتجاوز الخوف.',
            description: 'استخراج القيم الإنسانية النبيلة والاهتمامات الروحية الكبرى لتكون خريطة السير البديلة لطريق الخضوع والهروب المعيق.',
            techniques: ['بطاقات القيم الستة لتحديد المسار الروحي', 'تمرين صياغة العزاء الافتراضي لرؤية الغايات الكبرى', 'رسم عجلة الفعالية الإنسانية الملتزمة']
          },
          {
            title: 'المرحلة 4: الفعل الملتزم وصيانة المرونة الميدانية الوجودية',
            objective: 'ترسيخ نمط سلوكي ذي معنى حركي مرن ومواجه للتحديات بقوة ورضا.',
            description: 'التطوير الإجرائي لالتزامات الحالة السلوكية اليومية بغض النظر عن تذبذب المشاعر أو تداعي الأفكار المعيقة.',
            techniques: ['عقود السلوك الملتزم المصاغة ثنائياً', 'أدوات تخطي عقبات الالتزام السلوكي الفعلي', 'أجندة الأخصائي التفاعلية لحفظ الديمومة']
          }
        ]
      };
    } else if (norm.includes('dbt') || norm.includes('dialectical') || norm.includes('جدلي')) {
      return {
        name: 'المدرسة السلوكية الجدلية (DBT)',
        brief: 'تدمج بين رغبة التغيير والسعي للقبول الفوري لإيجاد تناغم وجودي، وخفض السلوكيات الانفعالية الحادة.',
        tips: [
          {
            title: 'المرحلة 1: مهارات اليقظة الذهنية والاتزان الوجداني المبدئي',
            objective: 'تهدئة الفوار وتنشيط العقل الحكيم لمراقبة التجربة.',
            description: 'إكساب المريض القدرة الفورية على مراقبة وتفسير مشاعره الحادة بعيداً عن تقييم الذات لتقليل حدة الغضب والنبض المتسارع.',
            techniques: ['تمارين العقل الحكيم (Wise Mind)', 'ممارسات مهارات الـ (WHAT) والـ (HOW)', 'مذكرات اليقظة الوجدانية واستقراء المشاعر الساخنة']
          },
          {
            title: 'المرحلة 2: تحمل الضغوط والاضطرابات والقبول الراديكالي للأزمة',
            objective: 'بقاء المريض متزناً وإطفاء الرغبة بالاندفاعات تدمير الذات.',
            description: 'إدخال التدريبات الفسيولوجية والتنفسية والجسدية الساخنة (مثل بروتوكول TIPP) لإفراغ شحنة الطوارئ العصبية بأمان سريري.',
            techniques: ['بروتوكول TIPP الفسيولوجي المهدئ العاجل', 'سلسلة التلهية السريرية وتحسين اللحظة (IMPROVE)', 'تمرين القبول الراديكالي للألم الواقعي والمعيش']
          },
          {
            title: 'المرحلة 3: فاعلية التواصل البيني ورسم الحدود وتوكيد الذات الجسور',
            objective: 'إدارة النزاعات الأسرية والاجتماعية بصوت هادئ ومحترم.',
            description: 'مساعدة الحالة على تصميم خطاباتها وتجذير ثبات الأنا والمطالبة بالحقوق السلوكية الفاعلة دون انصياع أو عدوانية تفجيرية.',
            techniques: ['ممارسات صياغة DEAR MAN الفعالة ثنائياً', 'تقنية GIVE للعلاقات لإرساء السلام في المناخ الشخصي', 'صياغة المنهج الذاتي واستبقاء الاحترام FAST']
          },
          {
            title: 'المرحلة 4: تفكيك الجدل المرجعي وحمل الأضداد وتحقيق التوازن',
            objective: 'علاج التفكير الثنائي المتصلد وصون الحصانة والصلابة الوجدانية الممتدة.',
            description: 'الربط المنهجي السلوكي للتفكير بالوسط، والحرص البنائي على تفادي الوقوع بخبرات الانهيار والانتكاس اللاحقة.',
            techniques: ['تحليل التفاعلات الجدلية السلوكية المتطرفة', 'عقود السلامة اليومية المشتركة والموسومة بقلم الأخصائي', 'برامج صيانة السلوكيات المتزنة']
          }
        ]
      };
    } else {
      return {
        name: 'المدرسة التكاملية المنهجية (Integrative)',
        brief: 'توليفة سريرية موجهة مصممة خصيصاً للتناغم مع تفرد وأعراض الحالة لتوازن فعال وسريع.',
        tips: [
          {
            title: 'المرحلة 1: رسم الخارطة السريرية وإثبات التحالف الإكلينيكي',
            objective: 'بناء الاحتواء الساكن وزيادة استشعار أمن الحالة.',
            description: 'المتابعة المنهجية لخط الأساس وفحص تفاعل المثيرات البيئية مع الفوران الوجداني.',
            techniques: ['الصياغة التشاركية المتكاملة للحالة النفسية', 'التقييمات الذاتية وبناء خط الأساس الحركي للاكتئاب', 'تمرين الصخرة والاتزان لتهدئة تشتت الذهن']
          },
          {
            title: 'المرحلة 2: ترويض التنظيم الانفعالي وتعلم مهارات الفك الحاد',
            objective: 'بناء بدائل التفكيك المعرفي وإدارة الاستثارة الفسيولوجية.',
            description: 'مساعدة العميل على زيادة سعة الوعي بتراتبية التفاعل العاطفي ونزع فتيل النضوج التلقائي الصاخب.',
            techniques: ['سجل إطفاء الاستثارة الانفعالية الموجه', 'الحوار العلاجي مع المرجعية الذاتية العاطفية', 'إعادة هيكلة الصدمات الصغرى والنزاعات الداخلية للأنا']
          },
          {
            title: 'المرحلة 3: التعرض المتدرج والانتصار السلوكي وتفتيت المكاسب السلبية',
            objective: 'إعادة تفعيل السلوك النشط وإطفاء ردود الخوف التجنبي.',
            description: 'القيام بخطوات عملية وتحديات تضع المريض أمام مخاوفه تدريجياً لتبديد توهم الضعف الذاتي.',
            techniques: ['التعرض التخيلي والعياني تحت رعاية الأخصائي', 'إلغاء التجنب والمكاسب النفسية السلبية المترتبة', 'المساندة التأكيدية الميدانية لمشاعر القيمة والوجود']
          },
          {
            title: 'المرحلة 4: توطيد الاستقلال الذاتي الوقائي وصياغة طوق الحصانة',
            objective: 'صون المكاسب النفسية واستدامة التطور الإداري للحالة.',
            description: 'تجميع الحزمة في كتيب طوارئ ذاتي وتأمين الحصانة الوقائية الممتدة عبر قياس التحسن السيكومتري الدقيق.',
            techniques: ['صياغة كتيب الطوارئ النفسية الفردي المذهب', 'المقاييس البعدية لقياس معدلات الاتزان والتحسن النفسي', 'بروتوكول جلسات المتابعة التذكيرية للمناعة']
          }
        ]
      };
    }
  };

  // Update protocol global fields
  const handleUpdateProtocolFields = (updates: Partial<NewProtocol>) => {
    if (!activeProtocol) return;
    setActiveProtocol(prev => prev ? { ...prev, ...updates } : null);
  };

  // Update current phase fields
  const handleUpdatePhaseFields = (index: number, updates: Partial<CustomPhase>) => {
    if (!activeProtocol) return;
    const updatedPhases = [...activeProtocol.phases];
    updatedPhases[index] = {
      ...updatedPhases[index],
      ...updates
    };
    setActiveProtocol(prev => prev ? { ...prev, phases: updatedPhases } : null);
  };

  // Manual Phase Management: Adding a phase
  const handleAddPhase = () => {
    if (!activeProtocol) return;
    const newPhase: CustomPhase = {
      title: `المرحلة ${activeProtocol.phases.length + 1}: عنوان الخطوة العلاجية المخصصة`,
      description: 'أدخل تفاصيل التوجيهات السريرية التي سيتبعها المريض والمهام الموكلة إليه والمنهج السلوكي السليم.',
      clinicalObjective: 'أدخل الهدف المادي/الإجرائي الذي تبغى تحقيقه في هذه اللحظات للعميل.',
      techniques: [],
      suggestedDuration: 'جلسة أو جلستان تفاعلية',
      linkedLockerItems: []
    };
    setActiveProtocol(prev => prev ? { ...prev, phases: [...prev.phases, newPhase] } : null);
    setActivePhaseIndex(activeProtocol.phases.length);
    toast.success('تمت إضافة مرحلة علاجية جديدة للبروتوكول بنجاح. صممها بيدك الآن.');
  };

  // Manual Phase Management: Deleting a phase
  const handleDeletePhase = (index: number) => {
    if (!activeProtocol) return;
    if (activeProtocol.phases.length <= 1) {
      toast.error('يجب بقاء خطوة علاجية واحدة على الأقل بالبروتوكول تلافياً لقصور التخطيط.');
      return;
    }
    const updatedPhases = activeProtocol.phases.filter((_, idx) => idx !== index);
    setActiveProtocol(prev => prev ? { ...prev, phases: updatedPhases } : null);
    setActivePhaseIndex(Math.max(0, index - 1));
    toast.success('تم حذف المرحلة العلاجية والخطوة المحددة بنجاح.');
  };

  // Manual Starting: Create blank custom protocol completely from scratch
  const handleCreateEmptyProtocol = () => {
    if (!selectedCaseId) {
      toast.error('فضلاً اختر الحالة المرضية المرتبطة أولاً.');
      return;
    }
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (!selectedCase) return;

    const emptyProto: NewProtocol = {
      id: `proto-${Date.now()}`,
      caseId: selectedCase.id,
      patientCode: selectedCase.patientCode,
      title: `بروتوكول السلوك المعرفي المخصص للحالة ${selectedCase.patientCode}`,
      scientificModality: selectedModality === 'cbt' ? 'العلاج السلوكي المعرفي (CBT)' : selectedModality === 'act' ? 'العلاج بالقبول والالتزام (ACT)' : selectedModality === 'dbt' ? 'العلاج السلوكي الجدلي (DBT)' : 'علاج تكاملي موجه',
      briefExplanation: 'بروتوكول علاجي مخصص صممه الأخصائي يدوياً بالاتفاق والتوليفة العلمية المناسبة لملخص الحيثيات.',
      phases: [
        {
          title: 'المرحلة 1: قياس خط الأساس والتثقيف السيكولوجي السلوكي',
          description: 'توجيه العميل وإرساء محيط آمن، وفحص الترابط السلوكي الحلقي للأعراض.',
          clinicalObjective: 'رسم خط الأساس للأعراض والتحالف السريري وتثبيت رصد النظم اليومية.',
          techniques: ['أداة سجل رصد الأفكار اليومي العاجل'],
          suggestedDuration: 'جلستان سريرية',
          linkedLockerItems: []
        }
      ],
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActiveProtocol(emptyProto);
    setActivePhaseIndex(0);
    setSidebarTab('suggestions'); // default to showing suggestions so they can import ideas
    setIsDesigning(true);
    toast.success('تم إنشاء بروتوكول فارغ بنجاح! صممه وعدله بالكامل يدوياً، واستلهم من المقترحات الجانبية عِند الحاجة.');
  };

  // Persist protocols change
  useEffect(() => {
    localStorage.setItem('clinic_custom_protocols', JSON.stringify(protocols));
  }, [protocols]);

  // Handle Dynamic Protocol suggestions from server
  const handleGenerateProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      toast.error('فضلاً اختر الحالة المرضية المرتبطة أولاً.');
      return;
    }

    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (!selectedCase) return;

    setIsGenerating(true);
    toast.loading('جاري توليد مسودة المقترحات السريرية المنهجية علمياً...', { id: 'generating-protocol' });

    try {
      const response = await fetch('/api/clinic/generate-protocol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          diagnosis: diagnosisDetails || selectedCase.reasonForVisit || 'ترميم النفس والتعافي الوجداني',
          modality: selectedModality,
          ageGroup: selectedAgeGroup,
          customGoals: customGoals
        })
      });

      if (!response.ok) {
        throw new Error('فشل توليد البروتوكول من الخادم');
      }

      const data = await response.json();
      
      const generated: NewProtocol = {
        id: `proto-${Date.now()}`,
        caseId: selectedCase.id,
        patientCode: selectedCase.patientCode,
        title: data.title || `بروتوكول علاجي مقترح للحالة ${selectedCase.patientCode}`,
        scientificModality: data.scientificModality || 'علاج تكاملي موجه',
        briefExplanation: data.briefExplanation || 'تفاصيل المنهجية الموجهة لدعم وتحسين جودة حياة الحالة.',
        phases: (data.phases || []).map((ph: any) => ({
          ...ph,
          linkedLockerItems: []
        })),
        progress: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setActiveProtocol(generated);
      setActivePhaseIndex(0);
      setSidebarTab('suggestions');
      toast.success('تم تحميل مسودة المقترحات بنجاح! يمكنك الآن صيانة، حذف، أو تعديل أي حرف فيها يدوياً بالكامل.', { id: 'generating-protocol', duration: 5500 });
    } catch (err) {
      console.error(err);
      toast.error('حدثت مشكلة، جاري إنشاء قالب مبدئي مرن لتعديلك اليدوي...', { id: 'generating-protocol' });
      // Fallback template
      const fallbackSuggestions = getModalitySuggestions(selectedModality);
      const generated: NewProtocol = {
        id: `proto-${Date.now()}`,
        caseId: selectedCase.id,
        patientCode: selectedCase.patientCode,
        title: `بروتوكول مخصص للحالة ${selectedCase.patientCode} - ${fallbackSuggestions.name}`,
        scientificModality: fallbackSuggestions.name,
        briefExplanation: fallbackSuggestions.brief,
        phases: fallbackSuggestions.tips.map(x => ({
          title: x.title,
          description: x.description,
          clinicalObjective: x.objective,
          techniques: [...x.techniques],
          suggestedDuration: (x as any).duration || 'جلستان'
        })),
        progress: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setActiveProtocol(generated);
      setActivePhaseIndex(0);
      setSidebarTab('suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to design pane of an existing protocol
  const handleEditProtocol = (proto: NewProtocol) => {
    setActiveProtocol(proto);
    setActivePhaseIndex(0);
    setIsDesigning(true);
  };

  // Add technique to current phase
  const handleAddTechnique = () => {
    if (!newTechniqueInput.trim() || !activeProtocol) return;
    
    const updatedPhases = [...activeProtocol.phases];
    const currentPhase = updatedPhases[activePhaseIndex];
    currentPhase.techniques = [...currentPhase.techniques, newTechniqueInput.trim()];
    
    setActiveProtocol({
      ...activeProtocol,
      phases: updatedPhases
    });
    setNewTechniqueInput('');
    toast.success('تمت إضافة التقنية العلاجية المقترحة للمرحلة.');
  };

  // Direct append technique from Suggestion Hub
  const handleImportTechnique = (techName: string) => {
    if (!activeProtocol) return;
    
    const updatedPhases = [...activeProtocol.phases];
    const currentPhase = updatedPhases[activePhaseIndex];
    if (currentPhase.techniques.includes(techName)) {
      toast.error('هذه التقنية مدرجة بالفعل في المرحلة الحالية.');
      return;
    }
    currentPhase.techniques = [...currentPhase.techniques, techName];
    setActiveProtocol({
      ...activeProtocol,
      phases: updatedPhases
    });
    toast.success(`تم إدراج تقنية: "${techName}"`);
  };

  // Remove technique from current phase
  const handleRemoveTechnique = (techIndex: number) => {
    if (!activeProtocol) return;
    
    const updatedPhases = [...activeProtocol.phases];
    const currentPhase = updatedPhases[activePhaseIndex];
    currentPhase.techniques = currentPhase.techniques.filter((_, idx) => idx !== techIndex);
    
    setActiveProtocol({
      ...activeProtocol,
      phases: updatedPhases
    });
    toast.success('تمت إزالة التقنية لتعديل مرونة البروتوكول.');
  };

  // Link / Unlink locker item with phase
  const toggleLinkLockerItem = (itemId: string) => {
    if (!activeProtocol) return;

    const updatedPhases = [...activeProtocol.phases];
    const currentPhase = updatedPhases[activePhaseIndex];
    const itemIds = currentPhase.linkedLockerItems || [];

    let newLinkedItems: string[];
    if (itemIds.includes(itemId)) {
      newLinkedItems = itemIds.filter(id => id !== itemId);
      toast('تم إلغاء ربط أصل المخزن بالمرحلة', { icon: '📎' });
    } else {
      newLinkedItems = [...itemIds, itemId];
      toast.success('تم ربط أصل من Locker الخاص بك بالمرحلة لتمكين التحميل المباشر.');
    }

    currentPhase.linkedLockerItems = newLinkedItems;
    setActiveProtocol({
      ...activeProtocol,
      phases: updatedPhases
    });
  };

  // Deploy and save general protocol to patient file (Integration with Treatment Plan)
  const handleSaveAndDeployProtocol = () => {
    if (!activeProtocol) return;

    // Check if this is new or existing
    const existsIndex = protocols.findIndex(p => p.id === activeProtocol.id);
    let updatedProtocols = [...protocols];

    if (existsIndex > -1) {
      updatedProtocols[existsIndex] = activeProtocol;
    } else {
      updatedProtocols.unshift(activeProtocol);
    }

    setProtocols(updatedProtocols);

    // Sync with backend / library treatment plan
    const treatmentPlan: TreatmentPlan = {
      id: activeProtocol.id,
      caseId: activeProtocol.caseId,
      title: activeProtocol.title,
      progress: activeProtocol.progress,
      phases: activeProtocol.phases.map((p, idx) => ({
        id: `ph-${idx}`,
        title: p.title,
        description: p.description,
        isCompleted: idx === 0 // completed first by default or customized
      }))
    };

    saveTreatmentPlan(treatmentPlan);
    
    toast.success('تم توثيق وحفظ البروتوكول بنجاح في خطة العلاج واستمارات العيادة.', { duration: 4000 });
    setIsDesigning(false);
    setActiveProtocol(null);
  };

  const handleCreateNewClick = () => {
    setActiveProtocol(null);
    setSelectedCaseId('');
    setDiagnosisDetails('');
    setCustomGoals('');
    setIsDesigning(true);
  };

  // Quick filter protocols based on search
  const filteredProtocols = protocols.filter(p => 
    p.title.includes(searchTerm) || 
    p.patientCode.includes(searchTerm) ||
    p.scientificModality.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right" dir="rtl">
      
      {/* Header View */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="space-y-1.5 flex-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text tracking-tight flex items-center gap-2 justify-start">
            <Sparkles className="text-psy-gold w-8 h-8 filter drop-shadow-[0_0_8px_rgba(212,180,131,0.5)]" />
            مولد البروتوكولات والمناهج العلاجية
          </h1>
          <p className="text-psy-text/40 text-xs md:text-sm max-w-2xl font-bold leading-relaxed">
            صمم وهيكل بروتوكولات الرعاية الاستباقية بمصداقية علمية وبحثية عبر دمج مدارس CBT, ACT وDBT، مع إتاحة الربط الفوري بـ Locker الخاص بك والمهام التدريبية للمريض.
          </p>
        </div>
        
        {!isDesigning && (
          <GoldButton size="lg" onClick={handleCreateNewClick} className="h-12 shadow-lg shadow-psy-gold/10">
            <Plus size={18} /> تصميم بروتوكول جديد
          </GoldButton>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isDesigning ? (
          /* WORKSPACE VIEW: Create or customize an active Protocol */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Split Left Form Panel or Steps List */}
            <div className="lg:col-span-4 space-y-6">
              
              {!activeProtocol ? (
                /* STEP 1: PARAMETERS FORM */
                <GlassCard className="p-6 space-y-5 border-psy-gold/10">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] uppercase font-black text-psy-gold tracking-widest block">الدليل المطور للبروتوكول</span>
                    <h3 className="text-lg font-black mt-1">تحديد محددات البروتوكول</h3>
                  </div>

                  <form onSubmit={handleGenerateProtocol} className="space-y-5">
                    {/* Selected Case */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-psy-text/60">اختر الحالة المرتبطة *</label>
                      <select 
                        required 
                        value={selectedCaseId} 
                        onChange={(e) => {
                          const cId = e.target.value;
                          setSelectedCaseId(cId);
                          const sel = cases.find(c => c.id === cId);
                          if (sel) {
                            setDiagnosisDetails(sel.reasonForVisit);
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-psy-text focus:border-psy-gold outline-none h-11 transition-all cursor-pointer"
                      >
                        <option value="" className="bg-[#141413]">-- حدد الرمز المرضي للحالة --</option>
                        {cases.map(c => (
                          <option key={c.id} value={c.id} className="bg-[#141413]">
                            كود: {c.patientCode} - {c.reasonForVisit.substring(0, 30)}...
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Scientific Modality */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-psy-text/60">مظلة المدرسة العلمية المطبقة *</label>
                      <select 
                        required
                        value={selectedModality}
                        onChange={(e) => setSelectedModality(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-psy-text focus:border-psy-gold outline-none h-11 transition-all cursor-pointer"
                      >
                        <option value="cbt" className="bg-[#141413]">العلاج المعرفي السلوكي (CBT)</option>
                        <option value="act" className="bg-[#141413]">العلاج بالقبول والالتزام (ACT)</option>
                        <option value="dbt" className="bg-[#141413]">العلاج السلوكي الجدلي (DBT)</option>
                        <option value="psychodynamic" className="bg-[#141413]">العلاج النفسي التحليلي (Psychoanalysis)</option>
                        <option value="integrative" className="bg-[#141413]">علاج تكاملي منهجي (Integrative)</option>
                      </select>
                    </div>

                    {/* Age Group */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-psy-text/60">الفئة العمرية المستهدفة</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['adult', 'adolescent', 'child', 'elderly'].map((age) => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setSelectedAgeGroup(age)}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-black transition-all ${
                              selectedAgeGroup === age 
                                ? 'bg-psy-gold/10 border-psy-gold text-psy-gold' 
                                : 'bg-white/5 border-transparent text-psy-text/50 hover:bg-white/10'
                            }`}
                          >
                            {age === 'adult' ? 'بالغين' : age === 'adolescent' ? 'مراهقين' : age === 'child' ? 'أطفال' : 'كبار السن'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Problem/Symptoms override */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-psy-text/60">التشخيص النفسي أو التركيز السريري المعين</label>
                      <textarea
                        value={diagnosisDetails}
                        onChange={(e) => setDiagnosisDetails(e.target.value)}
                        placeholder="أدخل الأعراض أو تفاصيل التشخيص لصياغة دقيقة..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold text-psy-text focus:border-psy-gold outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Custom clinician guidance */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-psy-text/60">أهداف مخصصة أو فنيات يفضل ترصيعها</label>
                      <input
                        type="text"
                        value={customGoals}
                        onChange={(e) => setCustomGoals(e.target.value)}
                        placeholder="مثال: دمج اليقظة الوجدانية للجسد، تسكين النبض"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-psy-text focus:border-psy-gold outline-none transition-all"
                      />
                    </div>

                    {/* Two-path Choice Buttons */}
                    <div className="space-y-3 pt-2">
                      <GoldButton type="submit" className="w-full h-11" disabled={isGenerating}>
                        <Sparkles size={16} /> بدء التخطيط وتلقي مقترحات النظام
                      </GoldButton>
                      
                      <button
                        type="button"
                        onClick={handleCreateEmptyProtocol}
                        className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-white hover:text-psy-gold transition-all duration-300 flex items-center justify-center gap-1.5"
                      >
                        <Plus size={16} className="text-psy-gold" /> تصميم بروتوكول فارغ مخصص يدوياً
                      </button>
                    </div>
                  </form>
                </GlassCard>
              ) : (
                /* STEP 2: TIMELINE / PHASES OF GENERATED PROTOCOL */
                <GlassCard className="p-4 space-y-4 border-psy-gold/5 max-h-[580px] overflow-y-auto no-scrollbar">
                  <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block">فهرس الخطوات المنهجية</span>
                      <h3 className="text-sm font-black mt-1">الجدول الزمني للبروتوكول</h3>
                    </div>
                    <span className="text-[10px] bg-psy-gold/10 text-psy-gold px-2 py-0.5 rounded-md font-bold">
                      {activeProtocol.phases.length} خطوات
                    </span>
                  </div>

                  <div className="relative space-y-3 pl-1">
                    {/* Stepper timeline vertical string */}
                    <div className="absolute right-6 top-4 bottom-4 w-0.5 bg-white/5 pointer-events-none" />

                    {activeProtocol.phases.map((phase, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhaseIndex(idx)}
                        className={`w-full text-right p-3.5 rounded-2xl flex items-start gap-4 transition-all relative border ${
                          activePhaseIndex === idx 
                            ? 'bg-[#1e1e1d] border-psy-gold/30 text-white shadow-xl' 
                            : 'bg-white/[0.01] border-transparent hover:bg-white/[0.04] text-psy-text/50'
                        }`}
                      >
                        <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 relative z-10 ${
                          activePhaseIndex === idx 
                            ? 'bg-psy-gold text-[#121211] shadow-[0_0_10px_#d4af37]' 
                            : 'bg-[#181817] border border-white/15 text-psy-text/40'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <h4 className="font-black text-xs leading-none truncate">{phase.title}</h4>
                          <div className="flex justify-between items-center text-[9px] font-bold text-psy-text/40 pt-1">
                            <span>المدة: {phase.suggestedDuration}</span>
                            {phase.linkedLockerItems && phase.linkedLockerItems.length > 0 && (
                              <span className="text-psy-gold">مرتبط بـ {phase.linkedLockerItems.length} أصول</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Manual Phase Manipulators */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={handleAddPhase}
                      className="flex items-center justify-center gap-1 py-2 px-2 bg-psy-gold/5 hover:bg-psy-gold/15 text-psy-gold text-[10px] font-black rounded-lg transition-all border border-psy-gold/10"
                      title="إضافة خطوة علاجية جديدة يدوياً"
                    >
                      <Plus size={12} /> إضافة خطوة
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhase(activePhaseIndex)}
                      className="flex items-center justify-center gap-1 py-2 px-2 bg-red-500/5 hover:bg-red-500/15 text-red-400 text-[10px] font-black rounded-lg transition-all border border-red-500/10"
                      title="حذف الخطوة المحددة حالياً من البروتوكول"
                    >
                      <Trash2 size={12} /> حذف خطوة
                    </button>
                  </div>

                  {/* Reset layout */}
                  <div className="pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setActiveProtocol(null)}
                      className="w-full text-center text-[11px] font-black text-psy-text/40 hover:text-psy-gold/80 transition-colors py-2"
                    >
                      بدء توليد جديد للمريض
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Close Workspace button */}
              <button 
                onClick={() => {
                  setIsDesigning(false);
                  setActiveProtocol(null);
                }}
                className="w-full text-center text-xs font-bold text-psy-text/30 hover:text-red-400 py-1 transition-colors"
              >
                إغلاق مساحة العمل والعودة للملخص
              </button>
            </div>

            {/* Split Right Content Panel: Dedicated Workspace */}
            <div className="lg:col-span-8">
              {activeProtocol ? (
                /* ACTIVE GENERATED PROTOCOL EDITOR */
                <div className="space-y-6">
                  {/* Master Banner info & General Settings */}
                  <GlassCard className="p-6 border-psy-gold/15 bg-gradient-to-l from-psy-gold/[0.03] to-transparent space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-psy-gold/10 text-psy-gold text-[9.5px] font-black rounded-lg inline-block uppercase">
                            مدخلات يدويّة مخصصة
                          </span>
                          <span className="text-[10px] text-psy-text/30">كود الحالة المنسوبة: {activeProtocol.patientCode}</span>
                        </div>
                        
                        {/* Editable Protocol Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-psy-gold/70 block">الاسم العلمي المعير للبروتوكول:</label>
                          <input 
                            type="text"
                            value={activeProtocol.title}
                            onChange={(e) => handleUpdateProtocolFields({ title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-black text-white focus:border-psy-gold outline-none transition-all"
                            placeholder="مثال: بروتوكول السلوك المعرفي لعلاج قلق المخاوف الاجتماعية المكثف"
                          />
                        </div>

                        {/* Editable Modality & Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-psy-text/40 block">المظلة العلمية:</label>
                            <input 
                              type="text"
                              value={activeProtocol.scientificModality}
                              onChange={(e) => handleUpdateProtocolFields({ scientificModality: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-psy-text focus:border-psy-gold outline-none transition-all"
                              placeholder="مثال: العلاج السلوكي المعرفي (CBT)"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-psy-text/40 block">معدل الإنزال المعرفي للحالة:</label>
                            <select
                              value={activeProtocol.progress}
                              onChange={(e) => handleUpdateProtocolFields({ progress: Number(e.target.value) })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-psy-text focus:border-psy-gold outline-none transition-all h-9 cursor-pointer"
                            >
                              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
                                <option key={p} value={p} className="bg-[#141413]">منجز بنسبة {p}%</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 self-end md:self-start">
                        <GoldButton onClick={handleSaveAndDeployProtocol} className="h-10 text-xs px-4">
                          <Save size={15} /> اعتماد وحفظ البروتوكول للحالة
                        </GoldButton>
                      </div>
                    </div>

                    {/* Editable Brief Explanation */}
                    <div className="space-y-1 border-t border-white/5 pt-4">
                      <label className="text-[10px] font-black text-[#D4B483] block">الخلفية العلمية المنهجية (المنطلق السريري):</label>
                      <textarea
                        value={activeProtocol.briefExplanation}
                        onChange={(e) => handleUpdateProtocolFields({ briefExplanation: e.target.value })}
                        placeholder="دون المنهج أو التوجيه العلمي العام للبروتوكول لزيادة القيمة الميثودولوجية لخطة العلاج..."
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-medium text-psy-text/80 focus:border-psy-gold outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </GlassCard>

                  {/* ACTIVE PHASE WORKSPACE */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Phase scientific specs and descriptions */}
                    <div className="md:col-span-7 space-y-6">
                      <GlassCard className="p-6 space-y-5 border-white/5 relative overflow-hidden">
                        
                        {/* Glowing watermark */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-psy-gold/5 blur-2xl rounded-full" />

                        {/* Top Phase Header / Duration Input */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/5 pb-3 relative z-10">
                          <div>
                            <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block">
                              تفاصيل الخطوة العلاجية {activePhaseIndex + 1} من {activeProtocol.phases.length}
                            </span>
                            
                            {/* Editable Phase Title */}
                            <input 
                              type="text"
                              value={activeProtocol.phases[activePhaseIndex].title}
                              onChange={(e) => handleUpdatePhaseFields(activePhaseIndex, { title: e.target.value })}
                              className="mt-1 bg-transparent border-b border-transparent hover:border-white/10 focus:border-psy-gold text-sm font-black text-white focus:bg-white/5 px-1 rounded outline-none transition-all py-0.5 w-full md:w-80"
                              placeholder="عنوان هذه الخطوة العلاجية"
                            />
                          </div>

                          {/* Editable Duration */}
                          <div className="space-y-1 flex-shrink-0">
                            <label className="text-[8px] text-psy-text/40 block leading-none font-bold">الزمن الاستراتيجي المقترح:</label>
                            <input 
                              type="text"
                              value={activeProtocol.phases[activePhaseIndex].suggestedDuration}
                              onChange={(e) => handleUpdatePhaseFields(activePhaseIndex, { suggestedDuration: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white focus:border-psy-gold outline-none w-28 text-center"
                              placeholder="مثال: جلستان"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 text-xs font-bold leading-relaxed text-psy-text/70 relative z-10">
                          
                          {/* Editable Clinical Objective */}
                          <div className="space-y-1 bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
                            <label className="text-[10px] font-black text-[#D4B483] block">الهدف السريري الدقيق للمرحلة (Clinical Objective):</label>
                            <input 
                              type="text"
                              value={activeProtocol.phases[activePhaseIndex].clinicalObjective}
                              onChange={(e) => handleUpdatePhaseFields(activePhaseIndex, { clinicalObjective: e.target.value })}
                              className="w-full bg-[#1b1b1a] border border-white/5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:border-psy-gold outline-none transition-all mt-1"
                              placeholder="ما الذي تبغى تحقيقه سلوكياً أو رصدياً لدى المريض في هذا القسم..."
                            />
                          </div>

                          {/* Editable Procedural Description */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-psy-text/40 block">شرح المنهج الإجرائي والتوجيهات السيكولوجية للمرحلة:</label>
                            <textarea
                              value={activeProtocol.phases[activePhaseIndex].description}
                              onChange={(e) => handleUpdatePhaseFields(activePhaseIndex, { description: e.target.value })}
                              placeholder="اشرح هنا تفصيلياً المسار التوجيهي، ممارسات الإقناع، الخط البياني للأفكار، تفاعل السلوك والبرنامج العملي للمريض..."
                              rows={5}
                              className="w-full bg-[#1b1b1a] border border-white/5 rounded-xl p-3 text-xs font-medium text-psy-text/80 focus:border-psy-gold outline-none resize-none leading-relaxed text-justify"
                            />
                          </div>
                        </div>

                        {/* Interactive Techniques Editor */}
                        <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
                          <span className="text-[11px] font-black text-psy-text/50 block">صيانة فنيات وممارسات المرحلة:</span>
                          
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTechniqueInput}
                              onChange={(e) => setNewTechniqueInput(e.target.value)}
                              placeholder="أضف تمرين أو تقنية جديدة للمرحلة..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-psy-text outline-none focus:border-psy-gold h-9.5"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddTechnique()}
                            />
                            <button 
                              type="button" 
                              onClick={handleAddTechnique}
                              className="px-4 bg-white/5 hover:bg-psy-gold hover:text-[#121211] border border-white/5 rounded-xl text-xs font-bold transition-all"
                            >
                              إضافة
                            </button>
                          </div>

                          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                            {activeProtocol.phases[activePhaseIndex].techniques.length === 0 ? (
                              <div className="text-center py-4 text-[11px] text-psy-text/30 font-bold border border-dashed border-white/5 rounded-xl">
                                لم يتم قيد أي فنيات بعد. أضف مهارة بالأعلى أو استورد من المقترحات الجانبية.
                              </div>
                            ) : (
                              activeProtocol.phases[activePhaseIndex].techniques.map((tech, tIdx) => (
                                <div key={tIdx} className="flex justify-between items-center bg-[#191918] p-2.5 rounded-xl border border-white/5 group">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 size={13} className="text-psy-gold shrink-0" />
                                    <span className="text-xs font-bold text-psy-text/80">{tech}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTechnique(tIdx)}
                                    className="text-psy-text/20 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                                    title="حذف التقنية"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </div>

                    {/* Split Right sidebar: Specialist Locker connection & Suggestions Hub */}
                    <div className="md:col-span-5 space-y-6">
                      
                      {/* Sidebar Tabs Navigator */}
                      <GlassCard className="p-1 space-y-0 border-psy-gold/5 bg-white/[0.01] flex items-center">
                        <button
                          type="button"
                          onClick={() => setSidebarTab('suggestions')}
                          className={`flex-1 text-center py-2 text-[11px] font-black rounded-lg transition-all ${
                            sidebarTab === 'suggestions' 
                              ? 'bg-psy-gold/10 text-psy-gold shadow-sm' 
                              : 'text-psy-text/40 hover:text-white'
                          }`}
                        >
                          💡 مقترحات العيادة السريرية
                        </button>
                        <button
                          type="button"
                          onClick={() => setSidebarTab('locker')}
                          className={`flex-1 text-center py-2 text-[11px] font-black rounded-lg transition-all ${
                            sidebarTab === 'locker' 
                              ? 'bg-psy-gold/10 text-psy-gold shadow-sm' 
                              : 'text-psy-text/40 hover:text-white'
                          }`}
                        >
                          📎 ربط مقتنيات المقرأ
                        </button>
                      </GlassCard>

                      <AnimatePresence mode="wait">
                        {sidebarTab === 'suggestions' ? (
                          /* TAB 1: AI & BEST PRACTICES CLINICAL SUGGESTIONS */
                          <motion.div
                            key="suggestions-tab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <GlassCard className="p-4 space-y-4 border-psy-gold/5 bg-gradient-to-b from-psy-gold/[0.01] to-transparent">
                              <div className="space-y-1 border-b border-white/5 pb-2.5">
                                <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block">مستشار المقترحات السلوكية</span>
                                <h4 className="text-xs font-black">مقترحات المدرسة السلوكية الحالية</h4>
                                <p className="text-[10px] text-psy-text/40 leading-relaxed font-bold">
                                  اختر واستلهم من المعايير والأدبيات الأكاديمية المدونة أدناه لملئ وتطعيم خطوتك العلاجية الحالية بسرعة وبإحكام علمي.
                                </p>
                              </div>

                              {(() => {
                                const recommendation = getModalitySuggestions(activeProtocol.scientificModality);
                               // Map phase index to corresponding recommendation item
                               const recommendedPhaseItem = recommendation.tips[activePhaseIndex % recommendation.tips.length] || recommendation.tips[0];

                               return (
                                 <div className="space-y-4">
                                   {/* Modality Intro */}
                                   <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                     <span className="text-[9px] font-bold text-psy-gold block">{recommendation.name}</span>
                                     <p className="text-[10px] text-psy-text/50 font-bold mt-1 leading-relaxed text-justify">{recommendation.brief}</p>
                                   </div>

                                   {/* Current Phase Targets Suggestion Box */}
                                   <div className="space-y-3 pt-1">
                                     <span className="text-[10px] font-black text-white block">مؤشرات مقترحة للخطوة {activePhaseIndex + 1}:</span>

                                     {/* Title Suggestion */}
                                     <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5">
                                       <span className="text-[9px] font-black text-[#D4B483] block">العنوان المقترح:</span>
                                       <p className="text-[10.5px] font-bold text-psy-text leading-tight">{recommendedPhaseItem.title}</p>
                                       <button
                                         type="button"
                                         onClick={() => {
                                           handleUpdatePhaseFields(activePhaseIndex, { title: recommendedPhaseItem.title });
                                           toast.success('تم تطبيق عنوان المرحلة المقترح.');
                                         }}
                                         className="text-[9px] text-psy-gold hover:underline font-black flex items-center gap-0.5 mt-1"
                                       >
                                         استيراد وتعيين كعنوان للمرحلة ←
                                       </button>
                                     </div>

                                     {/* Objective Suggestion */}
                                     <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5">
                                       <span className="text-[9px] font-black text-[#D4B483] block">الهدف السريري المقترح:</span>
                                       <p className="text-[10.5px] font-mono text-psy-text leading-relaxed text-justify">{recommendedPhaseItem.objective}</p>
                                       <button
                                         type="button"
                                         onClick={() => {
                                           handleUpdatePhaseFields(activePhaseIndex, { clinicalObjective: recommendedPhaseItem.objective });
                                           toast.success('تم تطبيق الهدف السريري المقترح للمرحلة.');
                                         }}
                                         className="text-[9px] text-psy-gold hover:underline font-black flex items-center gap-0.5 mt-1"
                                       >
                                         استبدال وتعيين كالهدف المادي ←
                                       </button>
                                     </div>

                                     {/* Description Suggestion */}
                                     <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5">
                                       <span className="text-[9px] font-black text-[#D4B483] block">الإجراء والتوجيه الإكلينيكي المقترح:</span>
                                       <p className="text-[10.5px] text-psy-text/60 leading-relaxed text-justify line-clamp-3">{recommendedPhaseItem.description}</p>
                                       <button
                                         type="button"
                                         onClick={() => {
                                           handleUpdatePhaseFields(activePhaseIndex, { description: recommendedPhaseItem.description });
                                           toast.success('تم إدراج الشرح السيكولوجي المقترح للمرحلة.');
                                         }}
                                         className="text-[9px] text-psy-gold hover:underline font-black flex items-center gap-0.5 mt-1"
                                       >
                                         تنزيل التوجيه الإجرائي كشرح مكمل ←
                                       </button>
                                     </div>

                                     {/* Techniques Suggestions */}
                                     <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                                       <span className="text-[9px] font-black text-[#D4B483] block">فنيات وأساليب CBT/ACT الموصى بها:</span>
                                       <div className="space-y-1.5">
                                         {recommendedPhaseItem.techniques.map((itemTech, idxT) => (
                                           <div key={idxT} className="flex justify-between items-center bg-[#131312] p-2 rounded-lg border border-white/5">
                                             <span className="text-[10px] font-bold text-psy-text/80">{itemTech}</span>
                                             <button
                                               type="button"
                                               onClick={() => handleImportTechnique(itemTech)}
                                               className="text-[9px] bg-psy-gold/10 hover:bg-psy-gold text-psy-gold hover:text-[#121211] px-2 py-0.5 rounded transition-all font-black shrink-0"
                                             >
                                               إدراج التقنية +
                                             </button>
                                           </div>
                                         ))}
                                       </div>
                                     </div>

                                   </div>
                                 </div>
                               );
                              })()}
                            </GlassCard>
                          </motion.div>
                        ) : (
                          /* TAB 2: SPECIALIST LOCKER CONNECTION */
                          <motion.div
                            key="locker-tab"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <GlassCard className="p-4 space-y-4 border-psy-gold/5 bg-white/[0.005]">
                              <div className="space-y-1 border-b border-white/5 pb-2.5">
                                <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block">ربط المواد العلاجية</span>
                                <h4 className="text-xs font-black">ربط من Locker ومخزنك الخاص</h4>
                                <p className="text-[10px] text-psy-text/40 leading-relaxed font-bold">
                                  اربط الكتب، المقاييس، أو حقائب القراءة الموجودة بمخزنك بهذه المرحلة ليتاح للحالة تحميلها ومراجعتها فورا.
                                </p>
                              </div>

                              {lockerItems.length === 0 ? (
                                <div className="text-center py-6 text-xs text-psy-text/30 font-bold border border-dashed border-white/5 rounded-xl">
                                  لا توجد كتب أو أدوات حالية في Locker. ارفعها هناك أولا.
                                </div>
                              ) : (
                                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                  {lockerItems.map((item) => {
                                    const isLinked = (activeProtocol.phases[activePhaseIndex].linkedLockerItems || []).includes(item.id);
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleLinkLockerItem(item.id)}
                                        className={`w-full text-right p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                          isLinked 
                                            ? 'bg-psy-gold/5 border-psy-gold/25 text-psy-gold' 
                                            : 'bg-white/[0.01] border-white/5 text-psy-text/60 hover:border-white/10'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <BookOpen size={13} className={isLinked ? 'text-psy-gold' : 'text-psy-text/30'} />
                                          <div className="truncate text-right">
                                            <div className="font-black text-[11px] truncate">{item.title}</div>
                                            <div className="text-[9px] text-psy-text/30 font-bold pt-0.5 uppercase">{item.category}</div>
                                          </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                                          isLinked ? 'bg-psy-gold border-psy-gold text-[#121211]' : 'border-white/15'
                                        }`}>
                                          {isLinked && <Check size={10} />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </GlassCard>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Interactive sandbox tool to sync homework to Patient details card */}
                      <GlassCard className="p-4 space-y-3.5 border-white/5 bg-[#d4af37]/[0.01]">
                        <span className="text-[10px] font-black text-[#D4B483] block uppercase tracking-wide">النسخ الاحتياطي التفاعلي للمريض</span>
                        <p className="text-[10px] text-psy-text/50 font-bold leading-relaxed">
                          بمجرد تثبيت البروتوكول، يرسل النظام تلقائياً هذه الواجبات والمقاييس لملف الحالة المرضية في الأجهزة التفاعلية للحالة.
                        </p>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                          <label className="text-[9.5px] font-black text-psy-text/40 block">الحالة المرضية المتلقية:</label>
                          <span className="text-xs font-black text-white flex items-center gap-1">
                            <User size={12} className="text-psy-gold" /> الحالة المستهدفة كود: {activeProtocol.patientCode}
                          </span>
                        </div>
                      </GlassCard>
                    </div>

                  </div>

                </div>
              ) : (
                /* PROTOCOL GENERATION GUIDE LOADING SCREEN */
                <GlassCard className="p-16 text-center border-dashed border-white/10 flex flex-col items-center justify-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-psy-gold/5 flex items-center justify-center text-psy-gold animate-pulse">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">بوابة صياغة المحتوى السريري المعالج</h3>
                    <p className="text-xs text-psy-text/40 max-w-sm mx-auto mt-2 leading-relaxed font-bold">
                      فضلاً حدد رمز الحالة ونوع المنهج العلمي بالاستمارة المجاورة لبدء صياغة بروتوكول الرعاية المخصص بالذكاء الاصطناعي الأكاديمي الشارد.
                    </p>
                  </div>
                </GlassCard>
              )}
            </div>

          </motion.div>
        ) : (
          /* MAIN PROTOCOLS SUMMARY LIST & EXPLORER */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={18} />
                <input 
                  type="text"
                  placeholder="البحث بالبروتوكول، بمدرسة العلاج، أو كود الحالة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-xs font-bold font-sans outline-none focus:border-psy-gold/50 transition-all text-right h-12"
                />
              </div>
            </div>

            {/* Protocols Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProtocols.map(proto => (
                <GlassCard key={proto.id} className="p-0 overflow-hidden group border-white/5 hover:border-psy-gold/15 transition-all duration-300">
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-white group-hover:text-psy-gold transition-colors">{proto.title}</h3>
                          <span className="px-2 py-0.5 bg-psy-gold/10 text-psy-gold rounded-full text-[9px] font-black uppercase tracking-widest">
                            {proto.scientificModality.split('(')[1]?.replace(')', '') || proto.scientificModality}
                          </span>
                        </div>
                        <p className="text-[11px] text-psy-text/40 font-bold">الحالة المربوطة: {proto.patientCode} • صُمم في {proto.createdAt}</p>
                      </div>
                      <button 
                        onClick={() => handleEditProtocol(proto)}
                        className="p-2.5 text-psy-text/40 hover:text-psy-gold hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 cursor-pointer"
                        title="تعديل وتفصيل البروتوكول"
                      >
                        <Settings size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-psy-text/60 leading-relaxed font-bold text-justify line-clamp-3">
                      {proto.briefExplanation}
                    </p>

                    {/* Progress engine */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black">
                        <span className="text-psy-text/40">مستوى الإنجاز المعرفي والسلوكي للحالة</span>
                        <span className="text-psy-gold">{proto.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-l from-psy-gold to-[#A67C4A] shadow-[0_0_10px_rgba(212,180,131,0.4)] transition-all duration-1000"
                          style={{ width: `${proto.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Fast View of Steps */}
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-psy-text/30 flex items-center gap-1.5">
                        <Target size={11} /> محطات البرنامج العلاجي
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {proto.phases.map((ph, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => { handleEditProtocol(proto); setActivePhaseIndex(idx); }}
                            className="p-2 bg-white/5 border border-white/[0.02] hover:border-psy-gold/15 hover:bg-white/10 rounded-xl text-center cursor-pointer transition-all space-y-1"
                          >
                            <span className="text-[9px] font-black text-psy-gold block">مرحلة {idx + 1}</span>
                            <span className="text-[10px] font-black text-psy-text truncate block">{ph.title.split(':')[1]?.trim() || ph.title.substring(0, 15)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[10px] font-bold">
                    <div className="flex items-center gap-4 text-psy-text/40">
                      <span className="flex items-center gap-1"><Calendar size={11} /> نشط لليوم</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> 4 مراحل معتمدة</span>
                    </div>
                    <button 
                      onClick={() => handleEditProtocol(proto)}
                      className="text-psy-gold hover:underline font-black flex items-center gap-0.5 cursor-pointer text-xs"
                    >
                      افتح لوحة تحكم البروتوكول <ChevronLeft size={14} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>

            {filteredProtocols.length === 0 && (
              <GlassCard className="p-20 border-white/5">
                <EmptyState 
                  icon={TrendingUp}
                  title="لا توجد بروتوكولات علاجية حالياً"
                  description="ابدأ فوراً بتصميم خطوة مخصصة للحالات بالذكاء الاصطناعي الأكاديمي."
                  actionText="تصميم بروتوكول"
                  onAction={handleCreateNewClick}
                />
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
