// ============================================
// psyTech Research Lab — Module كامل
// ============================================

// ============================================
// 1. TYPES — أنواع الاختبارات النفسية
// ============================================

export enum QuestionType {
  SINGLE_CHOICE = "single_choice",      // اختيار من متعدد
  MULTIPLE_CHOICE = "multiple_choice",    // اختيار متعدد
  LIKERT_5 = "likert_5",          // مقياس ليكرت 5 نقاط
  LIKERT_7 = "likert_7",          // مقياس ليكرت 7 نقاط
  VISUAL_ANALOG = "visual_analog",     // مقياس بصري (سلايدر)
  SEMANTIC_DIFFERENTIAL = "semantic_differential", // تفاضلي دلالي
  OPEN_TEXT = "open_text",         // نص حر
  RANKING = "ranking",           // ترتيب
  TRUE_FALSE = "true_false"       // صح/خطأ
}

export type TestCategory = 
  | "personality"        // الشخصية
  | "intelligence"       // الذكاء
  | "aptitude"           // التحصيل
  | "clinical"           // سريري (اكتئاب، قلق، OCD...)
  | "neuropsych"         // عصبي نفسي
  | "developmental"      // تطوري
  | "educational"        // تربوي
  | "occupational"       // مهني
  | "cross_cultural"     // ثقافي متعدد
  | "custom";            // مخصص

export type TestStatus = "draft" | "published" | "archived" | "under_review";
export type ReliabilityMethod = "cronbach_alpha" | "split_half" | "test_retest";
export type ValidityType = "content" | "construct" | "criterion" | "face";

export interface TestOption {
  id: string;
  label: string;        // النص المعروض
  value: number;        // القيمة العددية
  weight?: number;      // وزن اختياري (للاختبارات المعقدة)
}

export interface TestItem {
  id: string;
  testId: string;
  orderIndex: number;
  questionText: string;
  questionType: QuestionType;
  // للأسئلة المغلقة
  options?: TestOption[];
  // للمقاييس البصرية
  scaleMin?: number;
  scaleMax?: number;
  scaleStep?: number;
  scaleLabels?: { value: number; label: string }[];
  // للنص الحر
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  // الخصائص السيكومترية
  isRequired: boolean;
  reverseScored: boolean;   // عكس الدرجة (للأسئلة السالبة)
  timeLimit?: number;       // ثواني
  // البيانات الوصفية
  tags: string[];
  // IRT (نظرية الاستجابة للبند) — للمستقبل
  difficulty?: number;      // 0-1
  discrimination?: number; // 0-3
  createdAt: string;
  updatedAt: string;
}

export interface TestScale {
  id: string;
  testId: string;
  name: string;             // مثلاً: "القلق الاجتماعي"
  description: string;
  items: string[];          // IDs الأسئلة المرتبطة
  scoringMethod: "sum" | "average" | "weighted_sum";
  weights?: Record<string, number>; // أوزان الأسئلة
  // المعايير (Norms)
  norms?: {
    population: string;     // "طلاب جامعيون عرب، 18-25 سنة"
    ageRange: string;
    gender: "male" | "female" | "both";
    mean: number;
    sd: number;
    sampleSize: number;
    date: string;
  }[];
  // نطاقات التفسير
  interpretationRanges: {
    min: number;
    max: number;
    label: string;          // "طبيعي" | "خفيف" | "متوسط" | "شديد" | "خطير"
    color: string;          // hex للعرض البصري
    description: string;    // وصف نصي للمستوى
    recommendations: string[]; // توصيات علاجية
  }[];
}

export interface PsychTest {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructions: string;     // تعليمات واضحة للمُختبر
  category: TestCategory;
  // الفئة المستهدفة
  targetPopulation: {
    ageRange: string;         // "18-65"
    gender: "male" | "female" | "both";
    education?: string;       // "ثانوي فما فوق"
    languages: string[];    // ["ar", "en"]
    culturalContext: string;  // "العالم العربي"
  };
  estimatedTime: number;      // دقائق
  items: TestItem[];
  scales: TestScale[];
  // الخصائص السيكومترية
  reliability?: {
    method: ReliabilityMethod;
    value: number;            // 0-1
    date: string;
    sampleSize: number;
    notes?: string;
  }[];
  validity?: {
    type: ValidityType;
    description: string;
    evidence: string;         // دليل الصدق
  }[];
  // الإعدادات
  settings: {
    allowBacktracking: boolean;      // السماح بالرجوع
    showProgressBar: boolean;        // شريط التقدم
    randomizeItems: boolean;         // ترتيب عشوائي
    timeLimit?: number;             // وقت الاختبار كاملاً (دقائق)
    showResultsImmediately: boolean; // عرض النتيجة فوراً
    requireAllAnswers: boolean;      // إجبارية جميع الأسئلة
    adaptiveTesting: boolean;        // placeholder للمستقبل
  };
  // الترجمة والتكييف الثقافي
  translations: {
    language: string;
    adaptedBy: string;
    adaptationDate: string;
    backTranslated: boolean;    // الترجمة العكسية
    culturalNotes: string;      // ملاحظات ثقافية
    approvedBy?: string;        // مراجع لغوي/ثقافي
  }[];
  // المنهجية والتقنين
  methodology?: {
    type: 'minnesota' | 'custom' | 'adaptation';
    equivalences: {
      linguistic: boolean;
      cultural: boolean;
      psychological: boolean;
      psychometric: boolean;
    };
    translationData?: {
      sourceLanguage: string;
      targetLanguage: string;
      backTranslationFile?: string;
      translatorNotes: string;
    };
    arbitrationData?: {
      criteria: string[];
      refereeNotes: string;
      itemApprovals: Record<string, boolean>;
    };
    statisticalData?: {
      alphaCronbach?: number;
      testRetest?: number;
      spssFilePath?: string;
      responsesCount: number;
    };
  };
  labCode?: string; // كود المختبر للدعوة
  budget?: {
    total: number;
    distribution: {
      translator: number;
      statistician: number;
      referee: number;
    }
  };
  bibliography?: {
    author: string;
    year: string;
    journal?: string;
    doi?: string;
  };
  // فريق العمل
  collaborators?: {
    id: string;
    name: string;
    role: 'owner' | 'statistician' | 'translator' | 'referee';
    status: 'active' | 'pending';
  }[];
  comments?: Record<string, {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: string;
  }[]>;
  nationalNorms?: {
    population: string;
    region: string;
    tables: { raw: number; percentile: number; standard: number }[];
  }[];
  // البحث العلمي
  researchStudies: {
    id: string;
    title: string;
    authors: string[];
    year: number;
    journal: string;
    doi?: string;
    findings: string;
    sampleSize?: number;
  }[];
  // البيانات الوصفية
  version: number;
  status: TestStatus;
  authorId: string;
  authorName: string;
  license: "free" | "paid" | "restricted" | "academic";
  price?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TestSession {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userName: string;
  // الإجابات
  responses: {
    itemId: string;
    answer: any;              // القيمة المختارة
    responseTime: number;     // مللي ثانية
    timestamp: string;
  }[];
  // النتائج
  scores: Record<string, {    // scaleId -> {score, max, percentage}
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  totalScore?: number;
  maxTotalScore?: number;
  totalPercentage?: number;
  interpretations: {
    scaleId: string;
    scaleName: string;
    score: number;
    percentage: number;
    label: string;
    color: string;
    description: string;
    recommendations: string[];
  }[];
  severity?: "none" | "mild" | "moderate" | "severe" | "extreme";
  // بيانات الجلسة
  startedAt: string;
  completedAt: string;
  totalTime: number;          // ثواني
  device: string;
  browser: string;
  // التحليل السلوكي
  responsePattern: {
    averageTime: number;
    fastestItem: string;
    slowestItem: string;
    patternType: "normal" | "fast" | "slow" | "random" | "straightlining";
  };
  // المشاركة
  sharedWith?: string[];      // clinicianIds
  notes?: string;
}

export interface StudyDesign {
  id: string;
  shortCode: string;
  invitationCode: string;
  title: string;
  researchTopic?: string;
  researchGoal?: string;
  sampleDescription?: string;
  psychometricConcept?: string;
  researcherId: string;
  researcherName: string;
  type: "experimental" | "quasi_experimental" | "correlational" | "descriptive" | "longitudinal";
  hypothesis: string;
  variables: {
    independent: string[];
    dependent: string[];
    controlled: string[];
    confounding?: string[];
  };
  methodology: string;        // وصف مفصل
  sampleSize: number;
  samplingMethod: "random" | "stratified" | "convenience" | "snowball" | "purposive";
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  tests: string[];          // testIds المستخدمة
  status: "planning" | "recruiting" | "active" | "data_collection" | "analysis" | "completed" | "published";
  ethicsApproval?: {
    institution: string;
    approvalNumber: string;
    date: string;
  };
  participants: {
    id: string;
    code: string;
    age: number;
    gender: string;
    education: string;
    consentDate: string;
    completedTests: string[];
    withdrewAt?: string;
  }[];
  results?: {
    descriptive: Record<string, {
      mean: number;
      sd: number;
      min: number;
      max: number;
      median: number;
    }>;
    inferential?: string;
    reliability?: Record<string, number>;
    validity?: string;
    effectSize?: number;
    pValue?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NormData {
  id: string;
  testId: string;
  testTitle: string;
  population: string;
  ageRange: string;
  gender: "male" | "female" | "both";
  education?: string;
  culturalContext: string;
  sampleSize: number;
  collectionDate: string;
  collectionMethod: string;
  statistics: {
    mean: number;
    median: number;
    mode?: number;
    sd: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    percentiles: Record<number, number>; // 5, 10, 25, 50, 75, 90, 95
  };
  rawScores: number[];
  outliersRemoved: number;
  notes: string;
}

export interface TestTemplate {
  id: string;
  name: string;
  description: string;
  category: TestCategory;
  itemCount: number;
  estimatedTime: number;
  structure: {
    hasScales: boolean;
    scaleCount: number;
    hasNorms: boolean;
    hasInterpretation: boolean;
  };
  preview: Partial<PsychTest>;
}

// ============================================
// 2. STORAGE
// ============================================

const LAB_KEYS = {
  TESTS: "psytech_lab_tests",
  ITEMS: "psytech_lab_items",
  SCALES: "psytech_lab_scales",
  SESSIONS: "psytech_lab_sessions",
  STUDIES: "psytech_lab_studies",
  NORMS: "psytech_lab_norms",
  TEMPLATES: "psytech_lab_templates",
  INITIALIZED: "psytech_lab_initialized",
};

function generateId(): string {
  return `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveAll<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// 3. DEMO DATA — اختبارات معربة حقيقية
// ============================================

const DEMO_TESTS: PsychTest[] = [
  // مقياس القلق الاجتماعي (SAS-A adaptation)
  {
    id: "test-001",
    title: "مقياس القلق الاجتماعي للمراهقين",
    subtitle: "النسخة العربية المعربة",
    description: "مقياس يقيس مستوى القلق الاجتماعي في مواقف التفاعل مع الآخرين. يُستخدم للكشف المبكر والتقييم العلاجي.",
    instructions: "اقرأ كل عبارة بعناية. حدد مدى توافقها معك خلال الأسبوعين الماضيين. لا توجد إجابات صحيحة أو خاطئة — أجب بصدق.",
    category: "clinical",
    targetPopulation: {
      ageRange: "13-18",
      gender: "both",
      education: "المرحلة الثانوية",
      languages: ["ar"],
      culturalContext: "العالم العربي",
    },
    estimatedTime: 15,
    items: [
      {
        id: "item-001",
        testId: "test-001",
        orderIndex: 1,
        questionText: "أخاف من مواقف التحدث أمام الجمهور",
        questionType: QuestionType.LIKERT_5,
        options: [
          { id: "opt-1", label: "أبداً", value: 1 },
          { id: "opt-2", label: "نادراً", value: 2 },
          { id: "opt-3", label: "أحياناً", value: 3 },
          { id: "opt-4", label: "غالباً", value: 4 },
          { id: "opt-5", label: "دائماً", value: 5 },
        ],
        isRequired: true,
        reverseScored: false,
        tags: ["قلق اجتماعي", "تحدث"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      {
        id: "item-002",
        testId: "test-001",
        orderIndex: 2,
        questionText: "أشعر بالارتياح عند مقابلة أشخاص جدد",
        questionType: QuestionType.LIKERT_5,
        options: [
          { id: "opt-1", label: "أبداً", value: 1 },
          { id: "opt-2", label: "نادراً", value: 2 },
          { id: "opt-3", label: "أحياناً", value: 3 },
          { id: "opt-4", label: "غالباً", value: 4 },
          { id: "opt-5", label: "دائماً", value: 5 },
        ],
        isRequired: true,
        reverseScored: true, // عكس الدرجة
        tags: ["قلق اجتماعي", "مقابلة"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      // ... 18 سؤال إضافي مشابه
    ],
    scales: [
      {
        id: "scale-001",
        testId: "test-001",
        name: "القلق الاجتماعي العام",
        description: "المجموع الكلي للقلق الاجتماعي",
        items: ["item-001", "item-002"], // كل items
        scoringMethod: "sum",
        interpretationRanges: [
          {
            min: 18,
            max: 36,
            label: "طبيعي",
            color: "#22c55e",
            description: "مستوى قلق ضمن المعدل الطبيعي",
            recommendations: ["متابعة وقائية", "تعزيز المهارات الاجتماعية"],
          },
          {
            min: 37,
            max: 54,
            label: "خفيف",
            color: "#eab308",
            description: "قلق اجتماعي خفيف — يستحق الانتباه",
            recommendations: ["جلسات توجيهية", "تدريب على المهارات الاجتماعية"],
          },
          {
            min: 55,
            max: 72,
            label: "متوسط",
            color: "#f97316",
            description: "قلق اجتماعي متوسط — يحتاج تدخلاً علاجياً",
            recommendations: ["علاج سلوكي معرفي", "تدريب على الاسترخاء"],
          },
          {
            min: 73,
            max: 90,
            label: "شديد",
            color: "#ef4444",
            description: "قلق اجتماعي شديد — يحتاج تدخلاً مكثفاً",
            recommendations: ["علاج سلوكي معرفي مكثف", "استشارة نفسية فورية"],
          },
        ],
      },
    ],
    reliability: [
      {
        method: "cronbach_alpha",
        value: 0.87,
        date: "2024-12-01",
        sampleSize: 450,
        notes: "عينة من طلاب المرحلة الثانوية في 3 مدن عربية",
      },
    ],
    validity: [
      {
        type: "construct",
        description: "ارتباط إيجابي بمقياس القلق العام (r=0.72, p<0.001)",
        evidence: "تحليل الارتباط مع 3 مقاييس قلق معتمدة",
      },
    ],
    settings: {
      allowBacktracking: false,
      showProgressBar: true,
      randomizeItems: false,
      showResultsImmediately: false,
      requireAllAnswers: true,
      adaptiveTesting: false,
    },
    translations: [
      {
        language: "ar",
        adaptedBy: "د. نور الدين الأموي",
        adaptationDate: "2024-06-15",
        backTranslated: true,
        culturalNotes: "تم تكييف بعض العبارات لتناسب السياق العربي (مثل: 'التحدث أمام الجمهور' بدلاً من 'العرض أمام الصف')",
        approvedBy: "د. ليلى الخطيب (مراجعة ثقافية)",
      },
    ],
    researchStudies: [
      {
        id: "study-001",
        title: "التكييف الثقافي لمقياس القلق الاجتماعي للمراهقين في المجتمع العربي",
        authors: ["الأموي، ن.", "الخطيب، ل."],
        year: 2024,
        journal: "المجلة العربية للعلوم النفسية",
        doi: "10.1234/arab-psych.2024.001",
        findings: "أظهر المقياس ثباتاً جيداً (α=0.87) وصدقاً بنائياً مقبولاً في عينة 450 مراهقاً",
        sampleSize: 450,
      },
    ],
    version: 1,
    status: "published",
    authorId: "clin-001",
    authorName: "د. سارة محمود",
    license: "academic",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
    publishedAt: "2025-04-01T00:00:00Z",
  },
  
  // مقياس الاكتئاب البيكي (BDI-II adaptation)
  {
    id: "test-002",
    title: "مقياس الاكتئاب البيكي الثاني",
    subtitle: "النسخة العربية المعربة",
    description: "مقياس ذاتي التطبيق يقيس شدة الاكتئاب. يُستخدم للتشخيص الأولي ومتابعة العلاج.",
    instructions: "اختر العبارة التي تصف شعورك خلال الأسبوعين الماضيين بما فيهم اليوم.",
    category: "clinical",
    targetPopulation: {
      ageRange: "13-80",
      gender: "both",
      education: "القراءة والكتابة",
      languages: ["ar"],
      culturalContext: "العالم العربي",
    },
    estimatedTime: 10,
    items: [
      {
        id: "item-101",
        testId: "test-002",
        orderIndex: 1,
        questionText: "المزاج",
        questionType: QuestionType.SINGLE_CHOICE,
        options: [
          { id: "opt-0", label: "لا أشعر بالحزن", value: 0 },
          { id: "opt-1", label: "أشعر بالحزن أغلب الوقت", value: 1 },
          { id: "opt-2", label: "أشعر بالحزن طوال الوقت", value: 2 },
          { id: "opt-3", label: "أشعر بالحزن الشديد ولا أستطيع تحمله", value: 3 },
        ],
        isRequired: true,
        reverseScored: false,
        tags: ["اكتئاب", "مزاج"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      // ... 20 سؤال إضافي
    ],
    scales: [
      {
        id: "scale-101",
        testId: "test-002",
        name: "شدة الاكتئاب",
        description: "المجموع الكلي",
        items: ["item-101"], // كل items
        scoringMethod: "sum",
        interpretationRanges: [
          { min: 0, max: 13, label: "حد أدنى", color: "#22c55e", description: "اكتئاب في الحد الأدنى", recommendations: ["متابعة وقائية"] },
          { min: 14, max: 19, label: "خفيف", color: "#eab308", description: "اكتئاب خفيف", recommendations: ["استشارة نفسية", "تعديل نمط الحياة"] },
          { min: 20, max: 28, label: "متوسط", color: "#f97316", description: "اكتئاب متوسط", recommendations: ["علاج سلوكي معرفي", "تقييم دوائي"] },
          { min: 29, max: 63, label: "شديد", color: "#ef4444", description: "اكتئاب شديد", recommendations: ["تدخل علاجي فوري", "تقييم دوائي", "متابعة نفسية مكثفة"] },
        ],
      },
    ],
    reliability: [
      { method: "cronbach_alpha", value: 0.91, date: "2024-10-01", sampleSize: 320, notes: "عينة متنوعة من 5 دول عربية" },
    ],
    settings: {
      allowBacktracking: true,
      showProgressBar: true,
      randomizeItems: false,
      showResultsImmediately: false,
      requireAllAnswers: true,
      adaptiveTesting: false,
    },
    translations: [
      {
        language: "ar",
        adaptedBy: "د. فاطمة الزهراء",
        adaptationDate: "2024-03-20",
        backTranslated: true,
        culturalNotes: "تم تكييف العبارات لتجنب التعارض الثقافي (مثل: 'الشعور بالذنب' تم صياغته بعناية)",
      },
    ],
    researchStudies: [],
    version: 1,
    status: "published",
    authorId: "clin-001",
    authorName: "د. سارة محمود",
    license: "academic",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
    publishedAt: "2025-04-01T00:00:00Z",
  },
];

const DEMO_STUDIES: StudyDesign[] = [
  {
    id: "study-001",
    title: "فعالية العلاج السلوكي المعرفي في علاج القلق الاجتماعي",
    researcherId: "clin-001",
    researcherName: "د. سارة محمود",
    type: "experimental",
    hypothesis: "العلاج السلوكي المعرفي يقلل من مستوى القلق الاجتماعي بشكل كبير مقارنة بالقائمة الانتظار",
    variables: {
      independent: ["نوع العلاج (CBT vs. قائمة انتظار)"],
      dependent: ["درجة القلق الاجتماعي", "جودة الحياة"],
      controlled: ["العمر", "الجنس", "شدة القلق الأولية"],
    },
    methodology: "تصميم تجريبي مع مجموعات عشوائية. المجموعة التجريبية: 12 جلسة CBT. المجموعة الضابطة: قائمة انتظار.",
    sampleSize: 60,
    samplingMethod: "convenience",
    inclusionCriteria: ["عمر 18-35", "تشخيص القلق الاجتماعي", "الموافقة المستنيرة"],
    exclusionCriteria: ["علاج دوائي حالي", "اضطرابات نفسية أخرى شديدة"],
    tests: ["test-001"],
    status: "active",
    shortCode: "CBT-ANX",
    invitationCode: "PSY-1234",
    ethicsApproval: {
      institution: "جامعة القاهرة",
      approvalNumber: "IRB-2024-156",
      date: "2024-09-01",
    },
    participants: [],
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-04-01T00:00:00Z",
  },
];

const DEMO_TEMPLATES: TestTemplate[] = [
  {
    id: "template-001",
    name: "مقياس القلق العام (GAD-7)",
    description: "مقياس قصير للقلق العام — 7 أسئلة",
    category: "clinical",
    itemCount: 7,
    estimatedTime: 5,
    structure: { hasScales: true, scaleCount: 1, hasNorms: true, hasInterpretation: true },
    preview: { title: "GAD-7 Arabic", category: "clinical", estimatedTime: 5 },
  },
  {
    id: "template-002",
    name: "مقياس الاكتئاب (PHQ-9)",
    description: "مقياس صحة المريض — 9 أسئلة",
    category: "clinical",
    itemCount: 9,
    estimatedTime: 5,
    structure: { hasScales: true, scaleCount: 1, hasNorms: true, hasInterpretation: true },
    preview: { title: "PHQ-9 Arabic", category: "clinical", estimatedTime: 5 },
  },
  {
    id: "template-003",
    name: "مقياس الرضا الوظيفي",
    description: "يقيس الرضا عن العمل والبيئة المهنية",
    category: "occupational",
    itemCount: 15,
    estimatedTime: 10,
    structure: { hasScales: true, scaleCount: 3, hasNorms: false, hasInterpretation: true },
    preview: { title: "Job Satisfaction Scale", category: "occupational", estimatedTime: 10 },
  },
];

// ============================================
// 4. CRUD OPERATIONS
// ============================================

export function getTests(): PsychTest[] { return getAll<PsychTest>(LAB_KEYS.TESTS); }
export function saveTest(test: PsychTest): PsychTest {
  const tests = getTests();
  const idx = tests.findIndex(t => t.id === test.id);
  if (idx >= 0) { tests[idx] = test; } else { tests.push(test); }
  saveAll(LAB_KEYS.TESTS, tests);
  return test;
}
export function getTestById(id: string): PsychTest | null {
  return getTests().find(t => t.id === id) || null;
}
export function deleteTest(id: string): boolean {
  const tests = getTests().filter(t => t.id !== id);
  saveAll(LAB_KEYS.TESTS, tests);
  return true;
}

export function getItems(): TestItem[] { return getAll<TestItem>(LAB_KEYS.ITEMS); }
export function saveItem(item: TestItem): TestItem {
  const items = getItems();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) { items[idx] = item; } else { items.push(item); }
  saveAll(LAB_KEYS.ITEMS, items);
  return item;
}
export function getItemsByTest(testId: string): TestItem[] {
  return getItems().filter(i => i.testId === testId).sort((a, b) => a.orderIndex - b.orderIndex);
}
export function deleteItem(id: string): boolean {
  const items = getItems().filter(i => i.id !== id);
  saveAll(LAB_KEYS.ITEMS, items);
  return true;
}

export function getScales(): TestScale[] { return getAll<TestScale>(LAB_KEYS.SCALES); }
export function saveScale(scale: TestScale): TestScale {
  const scales = getScales();
  const idx = scales.findIndex(s => s.id === scale.id);
  if (idx >= 0) { scales[idx] = scale; } else { scales.push(scale); }
  saveAll(LAB_KEYS.SCALES, scales);
  return scale;
}
export function getScalesByTest(testId: string): TestScale[] {
  return getScales().filter(s => s.testId === testId);
}

export function getSessions(): TestSession[] { return getAll<TestSession>(LAB_KEYS.SESSIONS); }
export function saveSession(session: TestSession): TestSession {
  const sessions = getSessions();
  sessions.push(session);
  saveAll(LAB_KEYS.SESSIONS, sessions);
  return session;
}
export function getSessionsByTest(testId: string): TestSession[] {
  return getSessions().filter(s => s.testId === testId);
}

export function getStudies(): StudyDesign[] { return getAll<StudyDesign>(LAB_KEYS.STUDIES); }
export function saveStudy(study: StudyDesign): StudyDesign {
  const studies = getStudies();
  const idx = studies.findIndex(s => s.id === study.id);
  if (idx >= 0) { studies[idx] = study; } else { studies.push(study); }
  saveAll(LAB_KEYS.STUDIES, studies);
  return study;
}

export function getNorms(): NormData[] { return getAll<NormData>(LAB_KEYS.NORMS); }
export function saveNorm(norm: NormData): NormData {
  const norms = getNorms();
  norms.push(norm);
  saveAll(LAB_KEYS.NORMS, norms);
  return norm;
}

export function getTemplates(): TestTemplate[] { return getAll<TestTemplate>(LAB_KEYS.TEMPLATES); }

export const joinLabProject = (code: string): PsychTest | undefined => {
  const tests = getTests();
  return tests.find(t => t.labCode === code);
};

export const getLabDashboardStats = () => {
  const tests = getTests();
  return {
    activeProjects: tests.filter(t => t.status === 'draft' || t.status === 'under_review').length,
    totalSamples: tests.reduce((acc, t) => acc + (t.methodology?.statisticalData?.responsesCount || 0), 0),
    validatedTools: tests.filter(t => t.status === 'published').length
  };
};

// ============================================
// 5. PSYCHOMETRIC ENGINE — المحرك السيكومتري
// ============================================

export function calculateCronbachAlpha(items: TestItem[], responses: number[][]): number {
  // α = (k / (k-1)) * (1 - (Σσ²i / σ²total))
  const k = items.length;
  if (k < 2) return 0;
  
  // حساب تباين كل سؤال
  const itemVariances = items.map((item, idx) => {
    const scores = responses.map(r => r[idx]);
    if (scores.length === 0) return 0;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    return variance;
  });
  
  // حساب تباين المجموع
  const totalScores = responses.map(r => r.reduce((a, b) => a + b, 0));
  if (totalScores.length === 0) return 0;
  const totalMean = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
  const totalVariance = totalScores.reduce((sum, s) => sum + Math.pow(s - totalMean, 2), 0) / totalScores.length;
  
  const sumItemVariances = itemVariances.reduce((a, b) => a + b, 0);
  
  const alpha = (k / (k - 1)) * (1 - (sumItemVariances / totalVariance));
  return Math.max(0, Math.min(1, alpha)); // 0-1
}

export function interpretAlpha(alpha: number): { label: string; quality: string } {
  if (alpha >= 0.9) return { label: "ممتاز", quality: "excellent" };
  if (alpha >= 0.8) return { label: "جيد جداً", quality: "very-good" };
  if (alpha >= 0.7) return { label: "جيد", quality: "good" };
  if (alpha >= 0.6) return { label: "مقبول", quality: "acceptable" };
  return { label: "ضعيف", quality: "poor" };
}

export function calculateItemStatistics(item: TestItem, responses: number[]): {
  mean: number;
  sd: number;
  difficulty: number;
  discrimination: number;
} {
  if (responses.length === 0) return { mean: 0, sd: 0, difficulty: 0, discrimination: 0 };
  const mean = responses.reduce((a, b) => a + b, 0) / responses.length;
  const variance = responses.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / responses.length;
  const sd = Math.sqrt(variance);
  
  // الصعوبة: نسبة الإجابات الصحيحة (للمعرفة) أو المتوسط (للمواقف)
  const maxValue = item.options ? Math.max(...item.options.map(o => o.value)) : 5;
  const difficulty = mean / maxValue;
  
  // التمييز: ارتباط السؤال بالمجموع (placeholder — يحتاج بيانات كاملة)
  const discrimination = 0.5; // placeholder
  
  return { mean, sd, difficulty, discrimination };
}

export function calculateScaleScore(
  scale: TestScale,
  responses: Record<string, number>
): {
  rawScore: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
  color: string;
  recommendations: string[];
} {
  let rawScore = 0;
  let maxScore = 0;
  
  scale.items.forEach(itemId => {
    const score = responses[itemId] || 0;
    const weight = scale.weights?.[itemId] || 1;
    rawScore += score * weight;
    
    // حساب الدرجة القصوى لهذا السؤال
    const item = getItems().find(i => i.id === itemId);
    if (item?.options) {
      const maxOption = Math.max(...item.options.map(o => o.value));
      maxScore += maxOption * weight;
    }
  });
  
  const percentage = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;
  
  // إيجاد التفسير
  const range = scale.interpretationRanges.find(
    r => rawScore >= r.min && rawScore <= r.max
  );
  
  return {
    rawScore,
    maxScore,
    percentage,
    interpretation: range?.label || "غير محدد",
    color: range?.color || "#999",
    recommendations: range?.recommendations || [],
  };
}

export function validateTest(test: PsychTest): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // التحقق من الأساسيات
  if (!test.title.trim()) errors.push("العنوان مطلوب");
  if (!test.description.trim()) errors.push("الوصف مطلوب");
  if (!test.instructions.trim()) errors.push("التعليمات مطلوبة");
  if (test.items.length === 0) errors.push("يجب إضافة سؤال واحد على الأقل");
  
  // التحقق من الأسئلة
  test.items.forEach((item, idx) => {
    if (!item.questionText.trim()) errors.push(`السؤال ${idx + 1}: النص مطلوب`);
    if (item.questionType !== "open_text" && (!item.options || item.options.length < 2)) {
      errors.push(`السؤال ${idx + 1}: يجب إضافة خيارين على الأقل`);
    }
  });
  
  // التحقق من المقاييس
  if (test.scales.length === 0) warnings.push("لا توجد مقاييس — لن يتم حساب درجات فرعية");
  test.scales.forEach((scale, idx) => {
    const coveredItems = new Set(scale.items);
    const allItems = new Set(test.items.map(i => i.id));
    const missing = [...allItems].filter(id => !coveredItems.has(id));
    if (missing.length > 0) {
      warnings.push(`المقياس ${scale.name}: ${missing.length} أسئلة غير مرتبطة`);
    }
    
    // التحقق من نطاقات التفسير
    let lastMax = -1;
    scale.interpretationRanges.forEach((range, rIdx) => {
      if (range.min !== lastMax + 1 && rIdx > 0) {
        errors.push(`نطاق ${range.label}: فجوة في النطاقات`);
      }
      lastMax = range.max;
    });
  });
  
  return { isValid: errors.length === 0, errors, warnings };
}

export function detectResponsePattern(responses: { itemId: string; responseTime: number; answer: any }[]): TestSession["responsePattern"] {
  if (responses.length === 0) return { averageTime: 0, fastestItem: "", slowestItem: "", patternType: "normal" };
  const times = responses.map(r => r.responseTime);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const fastest = Math.min(...times);
  const slowest = Math.max(...times);
  
  // كشف الأنماط
  let patternType: TestSession["responsePattern"]["patternType"] = "normal";
  
  // Straightlining: نفس الإجابة
  const uniqueAnswers = new Set(responses.map(r => r.answer));
  if (uniqueAnswers.size === 1) patternType = "straightlining";
  
  // سريع جداً
  else if (avg < 2000) patternType = "fast";
  
  // بطيء جداً
  else if (avg > 30000) patternType = "slow";
  
  // عشوائي (تباين كبير)
  else if (Math.max(...times) - Math.min(...times) > 60000) patternType = "random";
  
  return {
    averageTime: avg,
    fastestItem: responses.find(r => r.responseTime === fastest)?.itemId || "",
    slowestItem: responses.find(r => r.responseTime === slowest)?.itemId || "",
    patternType,
  };
}

// ============================================
// 6. TEST ENGINE — محرك الاختبارات
// ============================================

export function createTest(data: Partial<PsychTest> & { authorId: string; authorName: string }): PsychTest {
  const now = new Date().toISOString();
  const test: PsychTest = {
    id: generateId(),
    title: data.title || "اختبار جديد",
    subtitle: data.subtitle,
    description: data.description || "",
    instructions: data.instructions || "",
    category: data.category || "custom",
    targetPopulation: data.targetPopulation || {
      ageRange: "18-65",
      gender: "both",
      languages: ["ar"],
      culturalContext: "العالم العربي",
    },
    estimatedTime: data.estimatedTime || 10,
    items: [],
    scales: [],
    reliability: [],
    validity: [],
    settings: data.settings || {
      allowBacktracking: false,
      showProgressBar: true,
      randomizeItems: false,
      showResultsImmediately: false,
      requireAllAnswers: true,
      adaptiveTesting: false,
    },
    translations: [],
    researchStudies: [],
    version: 1,
    status: "draft",
    authorId: data.authorId,
    authorName: data.authorName,
    license: data.license || "free",
    createdAt: now,
    updatedAt: now,
  };
  saveTest(test);
  return test;
}

export function addItemToTest(testId: string, itemData: Partial<TestItem>): TestItem | null {
  const test = getTestById(testId);
  if (!test) return null;
  
  const items = getItemsByTest(testId);
  const item: TestItem = {
    id: generateId(),
    testId,
    orderIndex: items.length,
    questionText: itemData.questionText || "",
    questionType: itemData.questionType || QuestionType.LIKERT_5,
    options: itemData.options,
    scaleMin: itemData.scaleMin,
    scaleMax: itemData.scaleMax,
    scaleStep: itemData.scaleStep,
    scaleLabels: itemData.scaleLabels,
    maxLength: itemData.maxLength,
    minLength: itemData.minLength,
    placeholder: itemData.placeholder,
    isRequired: itemData.isRequired ?? true,
    reverseScored: itemData.reverseScored ?? false,
    timeLimit: itemData.timeLimit,
    tags: itemData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveItem(item);
  
  // تحديث الاختبار
  test.items.push(item);
  test.updatedAt = new Date().toISOString();
  saveTest(test);
  
  return item;
}

export function reorderItems(testId: string, itemIds: string[]): void {
  const items = getItemsByTest(testId);
  itemIds.forEach((id, idx) => {
    const item = items.find(i => i.id === id);
    if (item) {
      item.orderIndex = idx;
      saveItem(item);
    }
  });
}

export function addScaleToTest(testId: string, scaleData: Partial<TestScale>): TestScale | null {
  const test = getTestById(testId);
  if (!test) return null;
  
  const scale: TestScale = {
    id: generateId(),
    testId,
    name: scaleData.name || "مقياس جديد",
    description: scaleData.description || "",
    items: scaleData.items || [],
    scoringMethod: scaleData.scoringMethod || "sum",
    weights: scaleData.weights,
    norms: scaleData.norms,
    interpretationRanges: scaleData.interpretationRanges || [],
  };
  saveScale(scale);
  
  test.scales.push(scale);
  test.updatedAt = new Date().toISOString();
  saveTest(test);
  
  return scale;
}

export function publishTest(testId: string): { success: boolean; test?: PsychTest; errors?: string[] } {
  const test = getTestById(testId);
  if (!test) return { success: false, errors: ["الاختبار غير موجود"] };
  
  const validation = validateTest(test);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }
  
  test.status = "published";
  test.publishedAt = new Date().toISOString();
  test.version += 1;
  saveTest(test);
  
  return { success: true, test };
}

export function startTestSession(testId: string, userId: string, userName: string): TestSession {
  const test = getTestById(testId);
  if (!test) throw new Error("الاختبار غير موجود");
  
  const session: TestSession = {
    id: generateId(),
    testId,
    testTitle: test.title,
    userId,
    userName,
    responses: [],
    scores: {},
    interpretations: [],
    startedAt: new Date().toISOString(),
    completedAt: "",
    totalTime: 0,
    device: typeof window !== "undefined" ? navigator.userAgent : "unknown",
    browser: typeof window !== "undefined" ? navigator.userAgent : "unknown",
    responsePattern: {
      averageTime: 0,
      fastestItem: "",
      slowestItem: "",
      patternType: "normal",
    },
  };
  
  return session;
}

export function submitResponse(
  session: TestSession,
  itemId: string,
  answer: any,
  responseTime: number
): TestSession {
  const filtered = (session.responses || []).filter(r => r.itemId !== itemId);
  const newResponses = [
    ...filtered,
    {
      itemId,
      answer,
      responseTime,
      timestamp: new Date().toISOString(),
    },
  ];
  return {
    ...session,
    responses: newResponses,
  };
}

export function completeSession(session: TestSession): TestSession {
  const test = getTestById(session.testId);
  if (!test) throw new Error("الاختبار غير موجود");
  
  // حساب الدرجات
  const responses: Record<string, number> = {};
  session.responses.forEach(r => {
    responses[r.itemId] = typeof r.answer === "number" ? r.answer : 0;
  });
  
  test.scales.forEach(scale => {
    const result = calculateScaleScore(scale, responses);
    session.scores[scale.id] = {
      score: result.rawScore,
      maxScore: result.maxScore,
      percentage: result.percentage,
    };
    session.interpretations.push({
      scaleId: scale.id,
      scaleName: scale.name,
      score: result.rawScore,
      percentage: result.percentage,
      label: result.interpretation,
      color: result.color,
      description: result.interpretation,
      recommendations: result.recommendations,
    });
  });
  
  // المجموع الكلي
  const totalScore = Object.values(session.scores).reduce((sum, s) => sum + s.score, 0);
  const maxTotalScore = Object.values(session.scores).reduce((sum, s) => sum + s.maxScore, 0);
  session.totalScore = totalScore;
  session.maxTotalScore = maxTotalScore;
  session.totalPercentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
  
  // أشد تفسير
  const severities = session.interpretations.map(i => {
    const range = test.scales.find(s => s.id === i.scaleId)?.interpretationRanges.find(
      r => i.score >= r.min && i.score <= r.max
    );
    return range ? ["none", "mild", "moderate", "severe", "extreme"].indexOf(
      ["طبيعي", "خفيف", "متوسط", "شديد", "خطير"].indexOf(range.label) >= 0 
        ? ["none", "mild", "moderate", "severe", "extreme"][
            ["طبيعي", "خفيف", "متوسط", "شديد", "خطير"].indexOf(range.label)
          ] 
        : "none"
    ) : 0;
  });
  const maxSeverityIndex = Math.max(...severities);
  session.severity = ["none", "mild", "moderate", "severe", "extreme"][maxSeverityIndex] as any;
  
  // التحليل السلوكي
  session.responsePattern = detectResponsePattern(session.responses);
  
  session.completedAt = new Date().toISOString();
  session.totalTime = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime();
  
  saveSession(session);
  return session;
}

// ============================================
// 7. STUDY ENGINE — محرك الدراسات
// ============================================

export function createStudy(data: Partial<StudyDesign> & { researcherId: string; researcherName: string }): StudyDesign {
  const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const invitationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const study: StudyDesign = {
    id: generateId(),
    shortCode,
    invitationCode,
    title: data.title || "دراسة جديدة",
    researchTopic: data.researchTopic || "",
    researchGoal: data.researchGoal || "",
    sampleDescription: data.sampleDescription || "",
    psychometricConcept: data.psychometricConcept || "",
    researcherId: data.researcherId,
    researcherName: data.researcherName,
    type: data.type || "descriptive",
    hypothesis: data.hypothesis || "",
    variables: data.variables || { independent: [], dependent: [], controlled: [] },
    methodology: data.methodology || "",
    sampleSize: data.sampleSize || 0,
    samplingMethod: data.samplingMethod || "convenience",
    inclusionCriteria: data.inclusionCriteria || [],
    exclusionCriteria: data.exclusionCriteria || [],
    tests: data.tests || [],
    status: "planning",
    participants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveStudy(study);
  return study;
}

export function addParticipantToStudy(studyId: string, participantData: Omit<StudyDesign["participants"][0], "id" | "completedTests">): StudyDesign | null {
  const study = getStudies().find(s => s.id === studyId);
  if (!study) return null;
  
  const participant = {
    id: generateId(),
    ...participantData,
    completedTests: [],
  };
  study.participants.push(participant);
  study.updatedAt = new Date().toISOString();
  saveStudy(study);
  return study;
}

export function recordTestCompletion(studyId: string, participantId: string, testResultId: string): void {
  const study = getStudies().find(s => s.id === studyId);
  if (!study) return;
  
  const participant = study.participants.find(p => p.id === participantId);
  if (participant) {
    participant.completedTests.push(testResultId);
    study.updatedAt = new Date().toISOString();
    saveStudy(study);
  }
}

// ============================================
// 8. INITIALIZATION
// ============================================

export function initLabData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(LAB_KEYS.INITIALIZED)) return;
  
  DEMO_TESTS.forEach(t => saveTest(t));
  DEMO_TESTS.forEach(t => {
    t.items.forEach(i => saveItem(i));
    t.scales.forEach(s => saveScale(s));
  });
  DEMO_STUDIES.forEach(s => saveStudy(s));
  DEMO_TEMPLATES.forEach(t => {
    const templates = getTemplates();
    templates.push(t);
    saveAll(LAB_KEYS.TEMPLATES, templates);
  });
  
  localStorage.setItem(LAB_KEYS.INITIALIZED, "true");
}

// ============================================
// 9. EXPORT/IMPORT
// ============================================

export function exportLabData(): string {
  const data = {
    tests: getTests(),
    items: getItems(),
    scales: getScales(),
    sessions: getSessions(),
    studies: getStudies(),
    norms: getNorms(),
  };
  return JSON.stringify(data, null, 2);
}

export function importLabData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.tests) saveAll(LAB_KEYS.TESTS, data.tests);
    if (data.items) saveAll(LAB_KEYS.ITEMS, data.items);
    if (data.scales) saveAll(LAB_KEYS.SCALES, data.scales);
    if (data.sessions) saveAll(LAB_KEYS.SESSIONS, data.sessions);
    if (data.studies) saveAll(LAB_KEYS.STUDIES, data.studies);
    if (data.norms) saveAll(LAB_KEYS.NORMS, data.norms);
    return true;
  } catch {
    return false;
  }
}

export function clearLabData(): void {
  Object.values(LAB_KEYS).forEach(key => {
    if (key !== LAB_KEYS.INITIALIZED) localStorage.removeItem(key);
  });
  localStorage.removeItem(LAB_KEYS.INITIALIZED);
}

// ============================================
// 10. STATS & ANALYTICS
// ============================================

export function getLabStats(authorId: string): {
  totalTests: number;
  publishedTests: number;
  totalSessions: number;
  activeStudies: number;
  averageReliability: number;
} {
  const tests = getTests().filter(t => t.authorId === authorId);
  const sessions = getSessions();
  const studies = getStudies().filter(s => s.researcherId === authorId);
  
  const reliabilities = tests.map(t => t.reliability?.[0]?.value || 0).filter(v => v > 0);
  const avgReliability = reliabilities.length > 0 
    ? reliabilities.reduce((a, b) => a + b, 0) / reliabilities.length 
    : 0;
  
  return {
    totalTests: tests.length,
    publishedTests: tests.filter(t => t.status === "published").length,
    totalSessions: sessions.length,
    activeStudies: studies.filter(s => s.status === "active" || s.status === "data_collection").length,
    averageReliability: Math.round(avgReliability * 100) / 100,
  };
}

// ============================================
// END OF MODULE
// ============================================
