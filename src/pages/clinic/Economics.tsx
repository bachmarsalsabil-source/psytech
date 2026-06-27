import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  HandCoins, 
  ShieldCheck, 
  Zap, 
  BarChart4, 
  Award, 
  BookOpen, 
  ShoppingCart, 
  Globe, 
  CreditCard, 
  ChevronLeft, 
  Check, 
  Star, 
  RefreshCw, 
  Layers, 
  FileText, 
  Info, 
  Building2, 
  School, 
  GraduationCap, 
  Download, 
  AlertTriangle, 
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';

// ============================================================
// DATA TYPES & SCHEMAS
// ============================================================

export default function EconomicsPage() {
  // General Category Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pricing' | 'commissions' | 'marketplace' | 'management' | 'history'>('dashboard');
  
  // Pricing & Corporate sub-navigation
  const [pricingRole, setPricingRole] = useState<'individual' | 'specialist' | 'researcher' | 'corporate'>('individual');
  
  // Period toggler (monthly or yearly)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Checkout dialog states
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    price: number;
    type: 'plan' | 'marketplace';
    commission?: number;
  } | null>(null);

  // Corporate Quote Dialog State
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedQuotePlan, setSelectedQuotePlan] = useState<string>('');
  const [quoteFormData, setQuoteFormData] = useState({
    institutionName: '',
    contactName: '',
    email: '',
    phone: '',
    usersCount: 50,
    specialNotes: ''
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Card payment input state
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success' | 'failure'>('form');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  
  // Simulated interactive variables
  const [userSubscription, setUserSubscription] = useState({
    role: 'specialist',
    plan: 'Professional',
    period: 'monthly',
    price: 34000,
    status: 'active',
  });
  
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState<'all' | 'tests' | 'surveys' | 'guides' | 'academic'>('all');

  // Interactive Commission Calculator State
  const [calcSessionsCount, setCalcSessionsCount] = useState(15);
  const [calcCourseCount, setCalcCourseCount] = useState(5);
  const [calcScaleSales, setCalcScaleSales] = useState(20);

  // Push notifications
  const pushNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 3));
    setTimeout(() => {
      setNotifications(prev => prev.filter(m => m !== msg));
    }, 4000);
  };

  // Pre-configured Plans Data
  const individualPlans = [
    {
      name: "الخطة المجانية",
      price: 0,
      period: "دائم",
      desc: "ولوج مبدئي لأدوات الصحة النفسية الأساسية ومتابعة الذات اليومية.",
      features: [
        "سجل المتابعة النفسي الذاتي اليومي",
        "مكتبة مقتطفات علمية وقراءات عامة",
        "اختبارات التقييم الذاتي المبدئية",
        "حد الاستخدام: 3 ملفات شخصية نشطة",
        "دعم فني عبر البريد الإلكتروني"
      ],
      popular: false,
      cta: "ابدأ مجاناً الآن"
    },
    {
      name: "الخطة المميزة (Premium)",
      price: 4900,
      period: "شهر",
      desc: "تحسين جودة الوعي الذاتي وإدراك النمو النفساني مع تحليلات متقدمة.",
      features: [
        "جميع مزايا الخطة المجانية محدثة",
        "جلسة حجز شهرية مخفضة بنسبة 15%",
        "الوصول الكامل لمكتبة الوسائط الصوتية المهدئة",
        "تحليلات وإحصائيات الحالة النفسية الذكية",
        "حد الاستخدام: 15 فحصاً دورياً شهرياً",
        "مستشار افتراضي مخصص للتوجيه الأساسي"
      ],
      popular: true,
      cta: "اشترك بالباقة المميزة"
    },
    {
      name: "الخطة الاحترافية (Pro)",
      price: 9800,
      period: "شهر",
      desc: "حل تكنولوجي مدمج وشامل لرحلتك الاستشفائية والوصول الحصري للأدلة العالمية.",
      features: [
        "جميع المزايا البلاتينية وباقة بريميوم",
        "خصم دائم 25% على الجلسات وورش العمل",
        "حجوزات عاجلة ذات أولوية فائقة",
        "تحليل جيني معرفي مدرب بالذكاء الاصطناعي",
        "التحميل غير المحدود للموارد والكتيبات الاستشفائية",
        "دعم فني مباشر على مدار 24 ساعة طيلة الأسبوع"
      ],
      popular: false,
      cta: "احصل على الباقة الاحترافية"
    }
  ];

  const specialistPlans = [
    {
      name: "باقة الأساس (Basic)",
      price: 18000,
      yearlyPrice: 172800,
      desc: "للأطباء والمستشارين الخواص في بداية ممارستهم المستقلة.",
      clients: 30,
      sessions: 60,
      features: [
        "إدارة وتشفير 30 ملف مريض نشط",
        "حجز وجدولة ما يصل لـ 60 جلسة شهرياً",
        "نظام متكامل لكتابة التقارير النفسية وتوقيعها",
        "أدوات الاختبار القياسية: 5 اختبارات أساسية",
        "بوابة دفع للمرضى بـ 1.8% عمولة تشغيلية"
      ],
      popular: false,
    },
    {
      name: "باقة النخبة (Professional)",
      price: 34000,
      yearlyPrice: 326400,
      desc: "الحل الأكثر طلباً لأخصائيي العيادات والمراكز السيكلوجية المتطورة.",
      clients: 150,
      sessions: 300,
      features: [
        "إدارة وتشفير 150 ملف مريض مع نظام حفظ سحابي",
        "تسجيل وإدارة 300 جلسة علاجية واستشارية شهرياً",
        "الولوج الكامل للاختبارات النفسية المعملية والمقاييس المتطورة",
        "تصدير تقارير الكفاءة السيكومترية معتمدة برمز QR عيادي",
        "تخفيض عمولة بوابة الدفع إلى 1.0% فقط لجلساتك",
        "إدراج البيانات الشخصية في دليل أخصائيي PsyTech العام"
      ],
      popular: true,
    },
    {
      name: "باقة العيادة (Clinic Suite)",
      price: 75000,
      yearlyPrice: 720000,
      desc: "حل متكامل للمراكز الكبرى والعيادات التي تمتلك طاقم عمل متعدد التخصصات.",
      clients: 1000,
      sessions: 3000,
      features: [
        "إدارة 1000 مريض مع صلاحيات موزعة للطاقم الطبي",
        "جدولة كاملة بلا قيود لـ 3000 جلسة برابط موحد",
        "إمكانية ربط 5 معالجين أو إداريين تحت حساب عيادي واحد",
        "الاستخدام المجاني اللامحدود لكافة مقاييس المتجر السيكولوجي",
        "صفر عمولة دفع (0.0%) على التحويلات المالية للمرضى",
        "مساحة تخزين سحابية فائقة الأمان لبيانات الحالات تبلغ 100 جيجابايت"
      ],
      popular: false,
    }
  ];

  const researcherPlans = [
    {
      name: "الباحث المبتدئ (Research Basic)",
      price: 15000,
      desc: "مخصص للطلبة والباحثين المستقلين الراغبين في إجراء تجارب سيكومترية أولية.",
      studies: 2,
      participants: 100,
      features: [
        "إنشاء وبرمجة دراستين بحثيتين متزامنتين",
        "جمع بيانات حتى 100 مشارك بحد أقصى للمشروع",
        "أدوات استخلاص إحصائي مبدئية وتصدير البيانات لـ Excel/SPSS",
        "تطبيق المقاييس القياسية المتوفرة بالمكتبة المفتوحة",
        "دعم فني استشاري أكاديمي أساسي"
      ],
      popular: false
    },
    {
      name: "الباحث المتقدم (Research Pro)",
      price: 42000,
      desc: "المختبر المتكامل للدراسات الجامعية والرسائل والدراسات المعرفية الملتزمة.",
      studies: 10,
      participants: 1500,
      features: [
        "برمجة 10 دراسات علمية ونماذج فحص سلوكي ديناميكي",
        "قاعدة مشاركين حية وسجل موجه لـ 1500 مشارك حقيقي",
        "أدوات تحليل متقدمة (بما في ذلك التوزيعات المعيارية والأنحرافات)",
        "ربط المقاييس الخاصة المبتكرة مع نشرها مغلقاً لطرقك",
        "أولوية النشر المفتوح في مجلة أبحاث PsyTech السنوية",
        "إحصاءات استجابة سيكولوجية فورية عبر واجهات مدمجة"
      ],
      popular: true
    },
    {
      name: "مختبر الهيئات (University / Lab)",
      price: 120000,
      desc: "للمختبرات الجامعية، مراكز التميز البحثي، والمؤسسات الأكاديمية الكبرى.",
      studies: 999,
      participants: 99999,
      features: [
        "عدد غير محدود من الدراسات والمشاريع البحثية المتكاملة",
        "حسابات بحثية لـ 15 باحثاً مشرفاً ومساعدين داخل المختبر",
        "أدوات المحاكاة السلوكية الممتدة وتتبع زمن الاستجابة الفوري بدقة ملي ثانية",
        "الحصول على عينات مستهدفة عشوائياً ومحققة من قاعدة بيانات PsyTech",
        "لوحة مراقبة وإدارة مركزية للنفقات والمخصصات التمويلية للبحث",
        "تصديق دراسات وشهادات أخلاقيات البحث العلمي مشفرة تماماً بالبلوكتشين"
      ],
      popular: false
    }
  ];

  // Financial Dashboard Mock Data
  const monthlyRevenueData = [
    { month: 'جانفي', subscriptions: 450000, commissions: 120000, marketplace: 180000 },
    { month: 'فيفري', subscriptions: 520000, commissions: 145000, marketplace: 220000 },
    { month: 'مارس', subscriptions: 610000, commissions: 190000, marketplace: 310000 },
    { month: 'أفريل', subscriptions: 780000, commissions: 210000, marketplace: 420000 },
    { month: 'ماي', subscriptions: 890000, commissions: 280000, marketplace: 490000 },
    { month: 'جوان', subscriptions: 1050000, commissions: 340000, marketplace: 610000 },
  ];

  const categoryPerformance = [
    { name: 'الاستشارات المباشرة', value: 45, color: '#D4AF37' },
    { name: 'الاشتراكات الشهرية', value: 30, color: '#A67C4A' },
    { name: 'مبيعات المقاييس النفسية', value: 15, color: '#10B981' },
    { name: 'الأبحاث والجامعات', value: 10, color: '#3B82F6' },
  ];

  // Marketplace Products Data
  const marketplaceProducts = [
    {
      id: "prod-1",
      name: "مقياس بك للاكتئاب المطور (BDI-II)",
      desc: "الأداة المعتمدة عالمياً لقياس شدة أعراض الاكتئاب السريري مع التوزيعات العربية المحلية.",
      category: "tests",
      categoryLabel: "اختيار نفسي معتمد",
      price: 3200,
      commission: 15,
      downloads: 1420,
      rating: 4.9,
      author: "أ.د لبيب رستم - جامعة الجزائر"
    },
    {
      id: "prod-2",
      name: "استبيان اضطراب ما بعد الصدمة (PTSD-5)",
      desc: "استبيان المسح والتقييم السريع لاضطرابات ما بعد الصدمة والضغوط الشديدة.",
      category: "surveys",
      categoryLabel: "استبيان بحثي",
      price: 2400,
      commission: 10,
      downloads: 890,
      rating: 4.7,
      author: "مخبر التحليل النفسي الإكلينيكي"
    },
    {
      id: "prod-3",
      name: "دليل العلاج السلوكي المعرفي للأرق (CBT-I)",
      desc: "دليل تطبيقي متكامل للجلسات العلاجية ونشاطات النوم التمكينية خطوة بخطوة للأخصائي.",
      category: "guides",
      categoryLabel: "أدلة علاجية",
      price: 5800,
      commission: 20,
      downloads: 640,
      rating: 4.8,
      author: "الجمعية العربية لعلوم النوم"
    },
    {
      id: "prod-4",
      name: "مقياس وكسلر لذكاء الأطفال - الطبعة الرابعة",
      desc: "البروتوكول المعياري الكامل لتقييم القدرات المعرفية وبصمة الذكاء للأعمار 6 إلى 16 سنة.",
      category: "tests",
      categoryLabel: "اختبار ذكاء معملي",
      price: 12000,
      commission: 8,
      downloads: 320,
      rating: 5.0,
      author: "تطوير الدار العربية لتقييم الذكاء"
    },
    {
      id: "prod-5",
      name: "حقيبة المعايير الإحصائية للجزائر والمغرب العربي",
      desc: "بيانات معيارية سيكومترية محدثة لـ 45 مقياساً تغطي عينات بأكثر من 15,000 مشارك.",
      category: "academic",
      categoryLabel: "موارد أكاديمية",
      price: 18500,
      commission: 12,
      downloads: 180,
      rating: 4.6,
      author: "المركز الجامعي للدراسات السيكولوجية"
    },
    {
      id: "prod-6",
      name: "مقياس القلق النفسي العام (GAD-7)",
      desc: "أداة سريعة وعلمية من 7 فقرات للكشف الأولي عن أعراض القلق العام وتحديد تصاعد الحدة.",
      category: "tests",
      categoryLabel: "اختيار نفسي معتمد",
      price: 1500,
      commission: 15,
      downloads: 2150,
      rating: 4.9,
      author: "مؤسسة الرعاية السلوكية المتطورة"
    }
  ];

  // Invoices & Transactions Mock History
  const [transactionLedger, setTransactionLedger] = useState([
    { id: "TX-99042", date: "2026-06-12", desc: "تجديد اشتراك الشهري - باقة النخبة", type: "expense", category: "subscription", amount: 34000, status: "completed" },
    { id: "TX-99041", date: "2026-06-11", desc: "عمولة مبيعات: مقياس بك للاكتئاب - مبيعات المتجر", type: "income", category: "commission", amount: 480, status: "completed" },
    { id: "TX-99040", date: "2026-06-10", desc: "إيراد دفعة علاجية: بورتال مريض مجهول", type: "income", category: "session", amount: 4500, status: "completed" },
    { id: "TX-99039", date: "2026-06-08", desc: "شراء أداة رقمية: دليل العلاج السلوكي المعرفي", type: "expense", category: "marketplace", amount: 5800, status: "completed" },
    { id: "TX-99038", date: "2026-06-05", desc: "عمولة حجز جلسات: حزمة علاجية لمرضى العيادة", type: "income", category: "commission", amount: 12500, status: "completed" },
    { id: "TX-99037", date: "2026-06-01", desc: "طلب سحب رصيد العمولات: مرسل للبنك الوطني", type: "expense", category: "withdrawal", amount: 85000, status: "completed" },
    { id: "TX-99036", date: "2026-05-28", desc: "تمويل مخصص للبحث - جامعة هواري بومدين", type: "income", category: "research", amount: 150000, status: "completed" }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: "method-1", type: "visa", last4: "4242", expiry: "12/28", holder: "DR. ABDELRAHMAN BENSERAI", isDefault: true },
    { id: "method-2", type: "mastercard", last4: "8854", expiry: "08/29", holder: "CLINIC MANAGER DIRECT", isDefault: false }
  ]);

  // Handle active Tab switching with UI feedback
  useEffect(() => {
    pushNotification(`استكشاف بورتال الإدارة والتحكم المالي: ${getTabLabel(activeTab)}`);
  }, [activeTab]);

  function getTabLabel(tab: string) {
    switch (tab) {
      case 'dashboard': return 'لوحة العائدات والأداء';
      case 'pricing': return 'باقات العضوية والمؤسسات';
      case 'commissions': return 'نموذج العمولات المالي';
      case 'marketplace': return 'المتجر العلمي الرقمي';
      case 'management': return 'إدارة اشتراكك والبطاقات';
      case 'history': return 'الفواتير والعمليات الحية';
      default: return '';
    }
  }

  // Handle subscribe action: opens payment checkout modal
  const handleSubscribeRequest = (planName: string, price: number) => {
    setCheckoutItem({
      name: planName,
      price: price,
      type: 'plan'
    });
    setPaymentState('form');
    setCardDetails({ number: '', holder: '', expiry: '', cvv: '' });
    setShowCheckout(true);
  };

  // Handle marketplace purchase action: opens payment checkout modal
  const handleProductPurchase = (productName: string, price: number, commission: number) => {
    setCheckoutItem({
      name: productName,
      price: price,
      type: 'marketplace',
      commission: commission
    });
    setPaymentState('form');
    setCardDetails({ number: '', holder: '', expiry: '', cvv: '' });
    setShowCheckout(true);
  };

  // Trigger corporate plan quote request dialog
  const handleQuoteRequestTrigger = (corporatePlanName: string) => {
    setSelectedQuotePlan(corporatePlanName);
    setQuoteFormData({
      institutionName: '',
      contactName: '',
      email: '',
      phone: '',
      usersCount: corporatePlanName === 'خطة المدارس' ? 120 : corporatePlanName === 'خطة الجامعات' ? 500 : 80,
      specialNotes: ''
    });
    setQuoteSubmitted(false);
    setShowQuoteForm(true);
  };

  // Handle Quote Request submission
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteFormData.institutionName || !quoteFormData.email) {
      pushNotification('يرجى ملء الحقول الإلزامية لطلب التسعير');
      return;
    }
    setQuoteSubmitted(true);
    setTimeout(() => {
      setShowQuoteForm(false);
      pushNotification(`تم تقديم طلب التسعيرة لـ ${selectedQuotePlan} بنجاح! سيتصل بك مهندس التمويل في غضون 4 ساعات.`);
    }, 2500);
  };

  // Simulated credit card validation & flow processing
  const processCardPayment = () => {
    if (cardDetails.number.length < 16 || !cardDetails.holder || !cardDetails.expiry || cardDetails.cvv.length < 3) {
      pushNotification("يرجى إدخال بيانات بطاقة دفع سليمة ومطابقة للمعايير المصرفية.");
      return;
    }
    setPaymentState('processing');
    
    // Simulate payment transaction steps
    setTimeout(() => {
      // 80% Success Rate, 20% Mock Failure to satisfy both requested screens
      const isSuccess = Math.random() > 0.15;
      if (isSuccess) {
        setPaymentState('success');
        pushNotification(`تمت معالجة المعاملة المالية لـ ${checkoutItem?.name} بنجاح!`);
        
        // Add new transaction to history ledger on success
        const newTx = {
          id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toISOString().split('T')[0],
          desc: checkoutItem?.type === 'plan' ? `ترقية اشتراك نشط - ${checkoutItem?.name}` : `شراء أداة سيكومترية - ${checkoutItem?.name}`,
          type: "expense" as const,
          category: checkoutItem?.type === 'plan' ? "subscription" : "marketplace",
          amount: checkoutItem?.price || 0,
          status: "completed"
        };
        setTransactionLedger(prev => [newTx, ...prev]);

        // If it was a plan, update local subscription state in SaaS
        if (checkoutItem?.type === 'plan') {
          setUserSubscription(prev => ({
            ...prev,
            plan: checkoutItem.name,
            price: checkoutItem.price,
            period: billingPeriod
          }));
        }
      } else {
        setPaymentState('failure');
        pushNotification("فشلت عملية الخصم المالي للبطاقة. يرجى مراجعة رصيد الحساب أو جدار الحماية للبنك المزود.");
      }
    }, 3000);
  };

  // Simulated Commission Calculator logic
  const calculatedMonthlyIncome = (calcSessionsCount * 4500) + (calcCourseCount * 12000) + (calcScaleSales * 2800);
  const averageCommissionRate = 0.12; // 12% average commission across various channels
  const totalCalculatedCommission = calculatedMonthlyIncome * averageCommissionRate;
  const netEarningsToSaaS = calculatedMonthlyIncome - totalCalculatedCommission;

  return (
    <div className="space-y-10 pb-20 select-none text-right" dir="rtl">
      
      {/* Toast Alert Notifications for live interactions */}
      <div className="fixed top-24 left-6 z-[200] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-5 py-3.5 bg-psy-surface border border-psy-gold/30 text-psy-gold text-xs font-black rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-psy-gold animate-ping shrink-0" />
              <span>{notif}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Banner Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-psy-gold/10 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-psy-gold/10 border border-psy-gold/20 text-psy-gold text-[10px] font-black uppercase tracking-widest leading-none">
            <Award size={13} className="animate-spin-slow" /> البوابة المالية والهندسة الاقتصادية
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-none">
            عائدات وخدمات <span className="text-psy-gold font-sans font-extrabold">MONETIZATION</span>
          </h1>
          <p className="text-psy-text/50 text-base max-w-3xl">
            إدارة الاشتراكات السحابية، توزيع نسب العمولات الذكية، بوابات الدفع الفورية للمرضى للأخصائيين والباحثين وسجلات المحاسبة وتوريد البيانات.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleSubscribeRequest("ترقية لعيادة فئة النخبة (Professional)", 34000)}
            className="px-6 h-12 bg-psy-gold text-psy-bg text-sm font-black rounded-2xl hover:bg-psy-gold/95 shadow-lg shadow-psy-gold/10 transition-all active:scale-95 flex items-center gap-2"
          >
            <Zap size={16} /> ترقية الاشتراك المالي
          </button>
        </div>
      </header>

      {/* Master Tab-Based Navigation bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-psy-surface/30 border border-psy-gold/10 rounded-[24px] w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <BarChart4 size={15} /> لوحة العائدات والمؤشرات
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'pricing' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <Award size={15} /> باقات العضوية والاشتراكات
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'commissions' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <Layers size={15} /> لوحة العمولات الشفافة
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'marketplace' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <ShoppingCart size={15} /> المتجر العلمي والمقاييس
        </button>
        <button
          onClick={() => setActiveTab('management')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'management' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <CreditCard size={15} /> الفوترة وبطاقات الدفع
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'history' ? 'bg-psy-gold text-psy-bg shadow-md' : 'text-psy-text/60 hover:text-psy-gold hover:bg-psy-gold/5'}`}
        >
          <FileText size={15} /> العمليات المالية الحية
        </button>
      </div>

      {/* Main Animated Space for Dashboard Portals */}
      <AnimatePresence mode="wait">
        
        {/* ============================================================
            TAB 1: REVENUE & COMMISSIONS DASHBOARD
            ============================================================ */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/40" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/10 group-hover:scale-110 transition-all duration-300">
                    <TrendingUp size={22} className="shrink-0" />
                  </div>
                  <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg leading-none">+18.4% نمو</span>
                </div>
                <h3 className="text-xs font-black text-psy-text/40 tracking-wider">الإيرادات الشهرية المحققة</h3>
                <div className="text-3xl font-serif font-black mt-1 text-psy-text">2,000,000 <span className="text-xs font-sans text-psy-text/40 font-bold">د.ج</span></div>
                <p className="text-[10px] text-psy-text/30 mt-2">عائدات من الاشتراكات ومستحقات الدعاية</p>
              </GlassCard>

              <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-psy-gold/40" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 w-12 h-12 bg-psy-gold/10 rounded-2xl flex items-center justify-center text-psy-gold border border-psy-gold/15 group-hover:scale-110 transition-all duration-300">
                    <Layers size={22} className="shrink-0" />
                  </div>
                  <span className="text-[9px] font-black bg-psy-gold/10 text-psy-gold px-2 py-0.5 rounded-lg leading-none">مستقر</span>
                </div>
                <h3 className="text-xs font-black text-psy-text/40 tracking-wider">الاشتراكات والتمويلات النشطة</h3>
                <div className="text-3xl font-serif font-black mt-1 text-psy-gold">1,050,000 <span className="text-xs font-sans opacity-60 font-bold">د.ج</span></div>
                <p className="text-[10px] text-psy-text/30 mt-2">تشمل تمويلات الكليات الجامعية والمخابر</p>
              </GlassCard>

              <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/40" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/10 group-hover:scale-110 transition-all duration-300">
                    <HandCoins size={22} className="shrink-0" />
                  </div>
                  <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-lg leading-none">تعبئة حية</span>
                </div>
                <h3 className="text-xs font-black text-psy-text/40 tracking-wider">العمولات المحصلة للعيادة</h3>
                <div className="text-3xl font-serif font-black mt-1 text-psy-text">340,000 <span className="text-xs font-sans text-psy-text/40 font-bold">د.ج</span></div>
                <p className="text-[10px] text-psy-text/30 mt-2">نسب الاقتطاع من مبيعات المقاييس وحجز الجلسات</p>
              </GlassCard>

              <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500/40" />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/10 group-hover:scale-110 transition-all duration-300">
                    <ShoppingCart size={22} className="shrink-0" />
                  </div>
                  <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-lg leading-none">+32 تحميل جديد</span>
                </div>
                <h3 className="text-xs font-black text-psy-text/40 tracking-wider">أعجمية تحميلات المتجر السيكولوجي</h3>
                <div className="text-3xl font-serif font-black mt-1 text-psy-text">610,000 <span className="text-xs font-sans text-psy-text/40 font-bold">د.ج</span></div>
                <p className="text-[10px] text-psy-text/30 mt-2">مبيعات رقمية للأدلة العلاجية والمقاييس المتميزة</p>
              </GlassCard>

            </div>

            {/* Graphs Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Financial Performance Line Graph */}
              <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between" title="توزيع وتحليل النمو المالي الموسمي">
                <div className="mb-4">
                  <p className="text-xs text-psy-text/40">تطور حجم الاشتراكات ونمو تدفقات العمولات المقتطعة لشهر جوان 2026 مقارنة بالخمسة أشهر الفائتة.</p>
                </div>
                <div className="h-80 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,180,131,0.05)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#121211', 
                          borderColor: '#D4AF37', 
                          borderWidth: '1px',
                          borderRadius: '16px',
                          color: '#F4F4F3',
                          fontFamily: 'sans-serif'
                        }} 
                      />
                      <Area type="monotone" dataKey="subscriptions" name="الاشتراكات" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#subGradient)" />
                      <Area type="monotone" dataKey="marketplace" name="مبيعات المتجر" stroke="#3B82F6" fillOpacity={0} />
                      <Area type="monotone" dataKey="commissions" name="العمولات" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#commGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-psy-gold/5 text-xs font-black">
                  <span className="flex items-center gap-1.5 text-psy-gold">
                    <span className="w-2.5 h-2.5 rounded-full bg-psy-gold" /> الاشتراكات السحابية
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> اقتطاعات عمولة البيع
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> تحميلات المتجر السيكولوجي
                  </span>
                </div>
              </GlassCard>

              {/* Top Performing Services and Breakdown */}
              <GlassCard className="p-6 flex flex-col justify-between" title="قنوات وتصنيف الإيرادات">
                <div className="mb-4">
                  <p className="text-xs text-psy-text/40">توزيع مصادر الدخول المالي والنشاطات الأكثر نجاعة ربحية على منصة المتابعة الطبية والأبحاث.</p>
                </div>
                <div className="space-y-6">
                  {categoryPerformance.map((service, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-psy-text/80">{service.name}</span>
                        <span className="text-psy-gold">{service.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-psy-gold/5 rounded-full overflow-hidden border border-psy-gold/10">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${service.value}%` }}
                          transition={{ duration: 1.2, delay: i * 0.1 }}
                          className="h-full rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-psy-gold/5 mt-6 space-y-3.5">
                  <div className="text-xs font-black text-psy-text/40">أعلى المقاييس مبيعاً هذا الشهر</div>
                  <div className="p-3 bg-psy-gold/5 rounded-xl border border-psy-gold/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-psy-gold" />
                      <span className="text-xs font-bold leading-none">مقياس بك للاكتئاب (BDI-II)</span>
                    </div>
                    <span className="text-xs font-serif font-bold text-psy-gold">1,420 تحميلة</span>
                  </div>
                  <div className="p-3 bg-psy-gold/5 rounded-xl border border-psy-gold/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-psy-gold" />
                      <span className="text-xs font-bold leading-none">مقياس وكسلر لذكاء الأطفال</span>
                    </div>
                    <span className="text-xs font-serif font-bold text-psy-gold">320 تحميلة</span>
                  </div>
                </div>
              </GlassCard>

            </div>

            {/* Quick Live Audit Banner */}
            <div className="p-5 bg-psy-gold/5 border border-psy-gold/20 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-psy-gold/10 flex items-center justify-center text-psy-gold shrink-0">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-psy-text">امتثال الفحص المالي والتشفير السحابي</h4>
                  <p className="text-xs text-psy-text/40">تخضع كافة التحويلات السلوكية والتجارية لاتفاقيات HIPAA وGDPR للسرية الطبية المعمقة ومقاومة الاحتيال.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 border border-psy-gold/30 text-psy-gold hover:bg-psy-gold/10 rounded-xl text-xs font-black transition-all whitespace-nowrap"
              >
                مراجعة سجلات الضمان الضريبي
              </button>
            </div>

          </motion.div>
        )}

        {/* ============================================================
            TAB 2: PRICING COMPARISON & CORPORATE PLANS
            ============================================================ */}
        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-10"
          >
            {/* Nav Switch between plan audiences */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-psy-gold/10 pb-6">
              
              <div className="flex items-center gap-1.5 p-1 bg-psy-surface/30 border border-psy-gold/15 rounded-xl">
                <button
                  onClick={() => setPricingRole('individual')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pricingRole === 'individual' ? 'bg-psy-gold text-psy-bg font-black' : 'text-psy-text/45 hover:text-psy-gold'}`}
                >
                  صحة الأفراد العام
                </button>
                <button
                  onClick={() => setPricingRole('specialist')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pricingRole === 'specialist' ? 'bg-psy-gold text-psy-bg font-black' : 'text-psy-text/45 hover:text-psy-gold'}`}
                >
                  للأخصائيين النفسيين
                </button>
                <button
                  onClick={() => setPricingRole('researcher')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pricingRole === 'researcher' ? 'bg-psy-gold text-psy-bg font-black' : 'text-psy-text/45 hover:text-psy-gold'}`}
                >
                  للباحثين والمخابر
                </button>
                <button
                  onClick={() => setPricingRole('corporate')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pricingRole === 'corporate' ? 'bg-psy-gold text-psy-bg font-black' : 'text-psy-text/45 hover:text-psy-gold'}`}
                >
                  خطط المؤسسات الكبرى
                </button>
              </div>

              {/* Monthly / Yearly Toggler for Professionals */}
              {(pricingRole === 'specialist' || pricingRole === 'researcher') && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-psy-text/45">طريقة الفوترة المصرفية:</span>
                  <div className="flex bg-psy-surface/50 border border-psy-gold/20 rounded-xl p-1">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${billingPeriod === 'monthly' ? 'bg-psy-gold/25 text-psy-gold border border-psy-gold/20' : 'text-psy-text/30 hover:text-psy-text'}`}
                    >
                      دفع شهري
                    </button>
                    <button
                      onClick={() => setBillingPeriod('yearly')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${billingPeriod === 'yearly' ? 'bg-psy-gold/25 text-psy-gold border border-psy-gold/20' : 'text-psy-text/30 hover:text-psy-text'}`}
                    >
                      دفع سنوي (توفير 20%)
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Render selected Audience Plans */}
            {pricingRole === 'individual' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {individualPlans.map((plan, idx) => (
                  <GlassCard 
                    key={idx} 
                    className={`p-8 relative overflow-hidden flex flex-col justify-between ${plan.popular ? 'border-2 border-psy-gold shadow-2xl bg-psy-gold/[0.02]' : 'border border-psy-gold/15'}`}
                  >
                    {plan.popular && (
                      <span className="absolute top-4 left-4 bg-psy-gold text-psy-bg text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">الأكثر مبيعاً</span>
                    )}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs text-psy-text/50 leading-relaxed h-12 overflow-hidden">{plan.desc}</p>
                      
                      <div className="pt-4 border-t border-psy-gold/10">
                        <span className="text-4xl font-serif font-black text-psy-gold">
                          {plan.price === 0 ? "مجاناً" : `${plan.price.toLocaleString()}`}
                        </span>
                        {plan.price !== 0 && <span className="text-xs text-psy-text/40 font-bold mr-1">د.ج / {plan.period}</span>}
                      </div>

                      <ul className="space-y-3.5 pt-6 border-t border-psy-gold/10">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                            <CheckCircle2 size={15} className="text-psy-gold mt-0.5 shrink-0" />
                            <span className="text-psy-text/80 leading-relaxed text-right">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8">
                      <button 
                        onClick={() => handleSubscribeRequest(plan.name, plan.price)}
                        className={`w-full h-12 rounded-xl text-xs font-black transition-all ${plan.popular ? 'bg-psy-gold text-psy-bg hover:scale-[1.02] shadow-lg shadow-psy-gold/15' : 'bg-psy-gold/5 text-psy-gold border border-psy-gold/25 hover:bg-psy-gold/15'}`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {pricingRole === 'specialist' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {specialistPlans.map((plan, idx) => {
                  const calculatedPrice = billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice;
                  return (
                    <GlassCard 
                      key={idx} 
                      className={`p-8 relative overflow-hidden flex flex-col justify-between ${plan.popular ? 'border-2 border-psy-gold shadow-2xl bg-psy-gold/[0.02]' : 'border border-psy-gold/15'}`}
                    >
                      {plan.popular && (
                        <span className="absolute top-4 left-4 bg-psy-gold text-psy-bg text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">خيار العيادات الموصى به</span>
                      )}
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-xs text-psy-text/50 leading-relaxed h-12 overflow-hidden">{plan.desc}</p>
                        
                        <div className="pt-4 border-t border-psy-gold/10 flex justify-between items-end">
                          <div>
                            <span className="text-4xl font-serif font-black text-psy-gold">
                              {calculatedPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-psy-text/40 font-bold mr-1">د.ج / {billingPeriod === 'monthly' ? 'شهري' : 'سنوي'}</span>
                          </div>
                        </div>

                        {/* Usage threshold limits widget */}
                        <div className="p-4 bg-psy-gold/5 rounded-2xl border border-psy-gold/10 space-y-2 mt-4">
                          <div className="flex justify-between text-[10px] font-black text-psy-text/40">
                            <span>المرضى النشطين: {plan.clients}</span>
                            <span>الاستشارات الشهرية: {plan.sessions}</span>
                          </div>
                          <div className="h-1.5 w-full bg-psy-gold/5 rounded-full overflow-hidden">
                            <div className="h-full bg-psy-gold" style={{ width: `${(plan.clients/1000)*100}%` }} />
                          </div>
                        </div>

                        <ul className="space-y-3.5 pt-4">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                              <CheckCircle2 size={15} className="text-psy-gold mt-0.5 shrink-0" />
                              <span className="text-psy-text/80 leading-relaxed text-right">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-8">
                        <button 
                          onClick={() => handleSubscribeRequest(plan.name, calculatedPrice)}
                          className={`w-full h-12 rounded-xl text-xs font-black transition-all ${plan.popular ? 'bg-psy-gold text-psy-bg hover:scale-[1.02] shadow-lg shadow-psy-gold/15' : 'bg-psy-gold/5 text-psy-gold border border-psy-gold/25 hover:bg-psy-gold/15'}`}
                        >
                          تفعيل اشتراكك المحاسبي
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}

            {pricingRole === 'researcher' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {researcherPlans.map((plan, idx) => {
                  const calculatedPrice = billingPeriod === 'monthly' ? plan.price : plan.price * 10; // annual discount
                  return (
                    <GlassCard 
                      key={idx} 
                      className={`p-8 relative overflow-hidden flex flex-col justify-between ${plan.popular ? 'border-2 border-psy-gold shadow-2xl bg-psy-gold/[0.02]' : 'border border-psy-gold/15'}`}
                    >
                      {plan.popular && (
                        <span className="absolute top-4 left-4 bg-psy-gold text-psy-bg text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">موصى به للمخابر</span>
                      )}
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-xs text-psy-text/50 leading-relaxed h-12 overflow-hidden">{plan.desc}</p>
                        
                        <div className="pt-4 border-t border-psy-gold/10">
                          <span className="text-4xl font-serif font-black text-psy-gold">
                            {calculatedPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-psy-text/40 font-bold mr-1">د.ج / {billingPeriod === 'monthly' ? 'شهري' : 'سنوي'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-psy-surface border border-psy-gold/10 rounded-xl text-center">
                          <div>
                            <div className="text-[10px] text-psy-text/40 font-bold">الدراسات المسموحة</div>
                            <div className="text-sm font-serif font-black text-psy-gold">{plan.studies === 999 ? 'غير محدود' : plan.studies}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-psy-text/40 font-bold">المشاركين الأقصى</div>
                            <div className="text-sm font-serif font-black text-psy-gold">{plan.participants === 99999 ? 'غير محدود' : plan.participants.toLocaleString()}</div>
                          </div>
                        </div>

                        <ul className="space-y-3.5 pt-4">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                              <CheckCircle2 size={15} className="text-psy-gold mt-0.5 shrink-0" />
                              <span className="text-psy-text/80 leading-relaxed text-right">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-8">
                        <button 
                          onClick={() => handleSubscribeRequest(plan.name, calculatedPrice)}
                          className={`w-full h-12 rounded-xl text-xs font-black transition-all ${plan.popular ? 'bg-psy-gold text-psy-bg hover:scale-[1.02] shadow-lg shadow-psy-gold/15' : 'bg-psy-gold/5 text-psy-gold border border-psy-gold/25 hover:bg-psy-gold/15'}`}
                        >
                          تفعيل مختبر الأبحاث
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}

            {/* ============================================================
                CORPORATE PLANS SECTION (SaaS Corporate)
                ============================================================ */}
            {pricingRole === 'corporate' && (
              <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-6">
                  <h3 className="text-2xl font-black">حلول وخطط الترقية للمؤسسات الشريكة</h3>
                  <p className="text-xs text-psy-text/50">تقديم حوسبة صحية ونفسية واسعة النطاق للمدارس الأكاديمية والجامعات والشركات لحماية رفاهة الموظفين والطلاب.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {[
                    {
                      name: "خطة المدارس",
                      icon: School,
                      desc: "الرفاه المدرسي والأولياء لمراقبة وتصميم الاختبارات وبصمات نمو اليافعين.",
                      users: "حتى 500 طالب ومعلم",
                      features: "سجل السلوك الأكاديمي، كشوفات التوتر، بورتال خاص للأخصائي المدرسي وتوجيه الأولياء المباشر."
                    },
                    {
                      name: "خطة الجامعات",
                      icon: GraduationCap,
                      desc: "للمشافي الإكلينيكية والجامعات لدعم الدراسات وحس السن الجامعية والمشاريع السيكومترية.",
                      users: "حتى 5,000 طالب وباحث",
                      features: "تحميل غير محدود للمقاييس، مخابر أبحاث متصلة، خوادم محلية فائقة الدقة للجامعة."
                    },
                    {
                      name: "خطة المراكز النفسية",
                      icon: Building2,
                      desc: "لشبكات العيادات الخاصة ومجموعات الرعاية الطبية السلوكية الكثيفة.",
                      users: "حتى 50 معالجاً مشرفاً",
                      features: "توحيد الملفات الضريبية والمالية، تبادل سريع للخبرات والاستشارات الداخلية، سجل تدقيق موحد."
                    },
                    {
                      name: "خطة الشركات والمصانع",
                      icon: Globe,
                      desc: "برامج الرفاه النفسي والمهني وصحة الموظفين لمنع الاحتراق الوظيفي وزيادة التركيز المعرفي.",
                      users: "مخصصة وبدون حدود",
                      features: "جلسات تخفيف الضغط بنسبة عمولة 0%، تقييمات مناخ العمل السنوية المشفرة، خطوط وقاية فورية."
                    }
                  ].map((corp, i) => (
                    <GlassCard key={i} className="p-6 flex flex-col justify-between hover:border-psy-gold/40 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-psy-gold/10 rounded-2xl flex items-center justify-center text-psy-gold border border-psy-gold/15">
                          <corp.icon size={22} />
                        </div>
                        <h4 className="text-lg font-black">{corp.name}</h4>
                        <p className="text-xs text-psy-text/50 leading-relaxed min-h-12">{corp.desc}</p>
                        
                        <div className="pt-3 border-t border-psy-gold/5 space-y-2">
                          <div className="text-[10px] font-black text-psy-gold uppercase tracking-wider">الاستخدام والمستخدمون</div>
                          <div className="text-xs font-bold text-psy-text">{corp.users}</div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <div className="text-[10px] font-black text-psy-text/30">الخدمات المشمولة</div>
                          <p className="text-[11px] text-psy-text/70 leading-relaxed">{corp.features}</p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          onClick={() => handleQuoteRequestTrigger(corp.name)}
                          className="w-full py-3 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-102 transition-all leading-none"
                        >
                          طلب تسعير وعرض فني
                        </button>
                      </div>
                    </GlassCard>
                  ))}

                </div>
              </div>
            )}

          </motion.div>
        )}

        {/* ============================================================
            TAB 3: TRANSPARENT COMMISSION SYSTEM
            ============================================================ */}
        {activeTab === 'commissions' && (
          <motion.div
            key="commissions"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Detailed Breakdown of commission categories */}
              <div className="lg:col-span-2 space-y-6">
                
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Layers size={18} className="text-psy-gold" /> نموذج العمولات المقتطعة الشفافة والذكية
                </h3>
                <p className="text-xs text-psy-text/45">تمتلك منصة PsyTech نموذج خصم شفاف وموجه لدعم خوادم العيادة وتمويل الميزانيات البحثية السنوية من المبيعات الرقمية.</p>

                <div className="space-y-4">
                  {[
                    { name: "عمولة حجز الجلسات النفسية", rate: "10% إلى 15%", target: "الاستشارات الفردية الموجهة للمستفيد خارج التأمين السنوي", features: "تنخفض إلى 0% تدريجياً للعيادات الكبرى ذات حجم المدخلات الفائق" },
                    { name: "عمولة منصة الدورات التدريبية", rate: "12%", target: "ورش العمل الأكاديمية وكتيبات التثقيف الجماعية بورتال الأكاديمية", features: "توزيع أرباح أوتوماتيكي مع تدوين شهادات معتمدة" },
                    { name: "عمولة البرامج العلاجية الممتدة", rate: "8%", target: "بروتوكولات وخطط الرعاية التمكينية الممتدة لفترة تزيد عن 3 أشهر", features: "تقسم العمولة لدعم ملفات الضمان وتشفير السجلات" },
                    { name: "عمولة بيع أدوات القياس والمقاييس", rate: "15%", target: "ملفات الاختبارات السيكومترية الفردية المنشورة عبر السورس للمتجر", features: "حماية تفعيل حقوق التأليف والمصنفات البحثية الوطنية والجزائرية" },
                    { name: "عمولة الخدمات المصرفية والبحثية", rate: "20%", target: "تجميع وتنظيف البيانات المعيارية وتوجيه الفحوصات للمختبرات الجامعية", features: "موجهة بالكامل لتمويل المنح الدراسية والباحثين الشبان بمجتمعاتنا" }
                  ].map((comm, idx) => (
                    <div key={idx} className="p-5 bg-psy-surface border border-psy-gold/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-psy-gold/30 transition-all">
                      <div className="space-y-1">
                        <div className="text-sm font-black text-psy-text">{comm.name}</div>
                        <div className="text-xs text-psy-text/45">{comm.target}</div>
                        <div className="text-[10px] text-psy-gold font-bold">{comm.features}</div>
                      </div>
                      <div className="text-center bg-psy-gold/10 border border-psy-gold/25 text-psy-gold px-4 py-2 rounded-xl shrink-0">
                        <div className="text-[9px] font-black uppercase tracking-wider text-psy-text/40">القيمة والنسبة</div>
                        <div className="text-lg font-serif font-black">{comm.rate}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Dynamic Interactive Commission Estimator */}
              <GlassCard className="p-6 flex flex-col justify-between" title="حاسبة الأرباح والعمولات التفاعلية">
                <div className="space-y-6">
                  <p className="text-xs text-psy-text/40">ابدأ بضبط الأرقام المتوقعة لنشاطك هذا الشهر لترى التوزيع التقديري لتدفقاتك وصافي دخلك المالي بعد اقتطاع العمولات.</p>
                  
                  {/* Slider 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>الجلسات العلاجية المتوقعة (حجز 4,500 د.ج):</span>
                      <span className="text-psy-gold font-serif">{calcSessionsCount} جلسة</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={calcSessionsCount} 
                      onChange={(e) => setCalcSessionsCount(Number(e.target.value))}
                      className="w-full h-1 bg-psy-gold/15 rounded-lg appearance-none cursor-pointer accent-psy-gold"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>مبيعات الدورات الاستشفائية (12,000 د.ج):</span>
                      <span className="text-psy-gold font-serif">{calcCourseCount} دورة</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={calcCourseCount} 
                      onChange={(e) => setCalcCourseCount(Number(e.target.value))}
                      className="w-full h-1 bg-psy-gold/15 rounded-lg appearance-none cursor-pointer accent-psy-gold"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>بيع مقاييس نفسية منفصلة (2,800 د.ج):</span>
                      <span className="text-psy-gold font-serif">{calcScaleSales} تحميلة</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={calcScaleSales} 
                      onChange={(e) => setCalcScaleSales(Number(e.target.value))}
                      className="w-full h-1 bg-psy-gold/15 rounded-lg appearance-none cursor-pointer accent-psy-gold"
                    />
                  </div>

                  {/* Calculation Result Panel */}
                  <div className="p-4 bg-psy-gold/5 rounded-2xl border border-psy-gold/20 space-y-3.5 pt-4">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-psy-text/40">إجمالي النقد الدائر المقدر:</span>
                      <span className="font-serif">{calculatedMonthlyIncome.toLocaleString()} د.ج</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-red-400">
                      <span>العمولة المقتطعة للمنصة (12%):</span>
                      <span className="font-serif">- {Math.round(totalCalculatedCommission).toLocaleString()} د.ج</span>
                    </div>
                    <div className="h-[1.5px] bg-psy-gold/10" />
                    <div className="flex justify-between text-sm font-black text-psy-gold">
                      <span>صافي الدخل الصافي للأخصائي:</span>
                      <span className="text-xl font-serif font-black">{Math.round(netEarningsToSaaS).toLocaleString()} د.ج</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      pushNotification(`تم وضع ميزانية جوان 2026 التقديرية: صافي ${Math.round(netEarningsToSaaS).toLocaleString()} د.ج`);
                    }}
                    className="w-full py-3.5 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-102 transition-all leading-none"
                  >
                    حفظ ومزامنة محاكاة الموازنة
                  </button>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}

        {/* ============================================================
            TAB 4: HIGH FIDELITY MARKETPLACE FOR DIGITAL TOOLS
            ============================================================ */}
        {activeTab === 'marketplace' && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Top controls: search & category filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-psy-surface/30 p-4 border border-psy-gold/10 rounded-2xl">
              <div className="relative group w-full md:max-w-md">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/30 group-focus-within:text-psy-gold transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="ابحث عن اختبار نفسي، بمقاييس، أو أدوات معيارية..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-psy-gold/5 border border-psy-gold/20 rounded-xl pr-12 pl-4 py-3 text-xs md:text-sm text-psy-text placeholder-psy-text/40 focus:border-psy-gold focus:bg-psy-gold/10 transition-all outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'الجميع' },
                  { id: 'tests', label: 'اختبارات سيكومترية' },
                  { id: 'surveys', label: 'استبيانات بحثية' },
                  { id: 'guides', label: 'أدلة علاجية' },
                  { id: 'academic', label: 'أكاديمي' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setMarketplaceFilter(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${marketplaceFilter === cat.id ? 'bg-psy-gold text-psy-bg font-black' : 'text-psy-text/50 hover:bg-psy-gold/5'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of digital products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {marketplaceProducts
                  .filter(prod => marketplaceFilter === 'all' || prod.category === marketplaceFilter)
                  .filter(prod => searchQuery === '' || prod.name.includes(searchQuery) || prod.desc.includes(searchQuery))
                  .map(product => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={product.id}
                      className="group"
                    >
                      <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-psy-gold/40 transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase text-psy-gold bg-psy-gold/10 border border-psy-gold/15 tracking-wide leading-none">
                              {product.categoryLabel}
                            </span>
                            <div className="flex items-center gap-1 text-psy-gold text-xs font-bold">
                              <Star size={13} fill="#D4AF37" className="stroke-none" />
                              <span>{product.rating}</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-black group-hover:text-psy-gold transition-colors">{product.name}</h3>
                          <p className="text-xs text-psy-text/50 leading-relaxed min-h-12 overflow-hidden">{product.desc}</p>
                          
                          <div className="text-[10px] text-psy-text/30 font-bold">المشرف العلمي: {product.author}</div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-psy-gold/10 space-y-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-[9px] font-black text-psy-text/30 uppercase tracking-widest leading-none mb-1">السعر الموحد</div>
                              <div className="text-2xl font-serif font-black text-psy-text">{product.price.toLocaleString()} <span className="text-xs font-sans text-psy-text/40 font-bold">د.ج</span></div>
                            </div>
                            <div className="text-left">
                              <div className="text-[9px] font-black text-psy-text/30 uppercase tracking-widest leading-none mb-1">العمولة المقررة</div>
                              <div className="text-xs font-bold text-emerald-500">منح {product.commission}% عمولة</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-psy-text/40 font-bold p-2 bg-psy-gold/[0.02] border border-psy-gold/5 rounded-xl">
                            <div>تحميلات حية: {product.downloads}</div>
                            <div>امتثال سحابي: 100%</div>
                          </div>

                          <button 
                            onClick={() => handleProductPurchase(product.name, product.price, product.commission)}
                            className="w-full py-3 bg-psy-gold/5 hover:bg-psy-gold text-psy-gold hover:text-psy-bg border border-psy-gold/20 hover:border-transparent text-xs font-black rounded-xl transition-all"
                          >
                            صفحة الشراء الفوري واقتناء الأداة
                          </button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            TAB 5: SUBSCRIPTION MANAGEMENT & CREDIT CARDS
            ============================================================ */}
        {activeTab === 'management' && (
          <motion.div
            key="management"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Account Subscription Details */}
              <div className="lg:col-span-2 space-y-6">
                
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard size={18} className="text-psy-gold" /> وضع ترخيص اشتراكك السحابي
                </h3>
                <p className="text-xs text-psy-text/45">تحكم في فترات المحاسبة، رفع مستوى الحيازة الفنية وتصدير إيصالات الدفع القانونية.</p>

                <div className="p-6 bg-psy-gold/[0.03] border border-psy-gold/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-psy-gold/45 to-transparent" />
                  
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-psy-gold/15 border border-psy-gold/30 text-psy-gold text-[9px] font-black rounded-full uppercase tracking-widest leading-none">ترخيص ممارس نشط</span>
                    <h4 className="text-2xl font-black text-psy-text">باقة الأخصائي المتقدم <span className="font-serif text-psy-gold">{userSubscription.plan}</span></h4>
                    <p className="text-xs text-psy-text/40">تاريخ التجديد السحابي القادم: 15 جوان 2026 (خصم تلقائي {userSubscription.price.toLocaleString()} د.ج)</p>
                  </div>

                  <div className="text-center md:text-left shrink-0">
                    <div className="text-3xl font-serif font-black text-psy-gold">{userSubscription.price.toLocaleString()} د.ج <span className="text-xs font-sans text-psy-text/40 font-bold">/{userSubscription.period === 'monthly' ? 'شهر' : 'سنة'}</span></div>
                    <div className="flex gap-2.5 mt-3">
                      <button 
                        onClick={() => {
                          setUserSubscription(prev => ({ ...prev, status: prev.status === 'active' ? 'paused' : 'active' }));
                          pushNotification(userSubscription.status === 'active' ? "تم إيقاف التجديد التلقائي للاشتراك مؤقتاً." : "تم تفعيل التجديد التلقائي للترخيص.");
                        }}
                        className="px-4 py-2 border border-psy-gold/20 text-psy-gold hover:bg-psy-gold/10 text-xs font-black rounded-xl transition-all"
                      >
                        {userSubscription.status === 'active' ? "تعطيل التجديد" : "تفعيل التجديد"}
                      </button>
                      <button 
                        onClick={() => pushNotification("يرجى اختيار باقة جديدة من تبويب باقات العضوية للتقليل أو الترقية.")}
                        className="px-4 py-2 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-103 transition-all"
                      >
                        ترقية الترخيص
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment cards manager */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-psy-text/60">البطاقات المصرفية المسجلة</h4>
                    <button 
                      onClick={() => {
                        setCheckoutItem({ name: "تسجيل بطاقة جديدة (تحقق 1.00 د.ج)", price: 1, type: "plan" });
                        setPaymentState('form');
                        setShowCheckout(true);
                      }}
                      className="text-xs font-black text-psy-gold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> إضافة وسيلة دفع جديدة
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map(card => (
                      <div key={card.id} className="p-5 bg-psy-surface border border-psy-gold/10 rounded-2xl flex items-center justify-between gap-4 relative group hover:border-psy-gold/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-psy-gold/5 border border-psy-gold/15 rounded-md flex items-center justify-center font-bold text-psy-gold text-xs tracking-wider">
                            {card.type.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-black text-psy-text">•••• •••• •••• {card.last4}</div>
                            <div className="text-[9px] text-psy-text/40">{card.holder} • ينتهي {card.expiry}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {card.isDefault ? (
                            <span className="text-[8px] font-black uppercase text-psy-gold bg-psy-gold/10 border border-psy-gold/15 px-2 py-0.5 rounded-md">الافتراضية</span>
                          ) : (
                            <button 
                              onClick={() => {
                                setPaymentMethods(prev => prev.map(c => ({ ...c, isDefault: c.id === card.id })));
                                pushNotification(`تم تعيين البطاقة المنتهية بـ ${card.last4} كبطاقة فوترة أساسية.`);
                              }}
                              className="text-[9px] font-black text-psy-text/40 hover:text-psy-gold"
                            >
                              تعيين أساسية
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar Quick Invoices Download */}
              <GlassCard className="p-6 flex flex-col justify-between" title="فواتير التراخيص والخدمات">
                <div className="space-y-4">
                  <p className="text-xs text-psy-text/40">تنزيل نسختك المصدقة ماليًا وفاتورة القيمة المضافة لتقديمها لمحاسب العيادة أو جامعتك.</p>
                  
                  <div className="space-y-3.5">
                    {[
                      { num: "INV-2026-004", date: "2026-06-12", total: 34000, label: "باقة النخبة - جوان" },
                      { num: "INV-2026-003", date: "2026-05-12", total: 34000, label: "باقة النخبة - ماي" },
                      { num: "INV-2026-002", date: "2026-04-18", total: 5800, label: "شراء مقياس ذوي الاحتياجات" },
                      { num: "INV-2026-001", date: "2026-04-12", total: 34000, label: "باقة النخبة - أفريل" }
                    ].map((inv, idx) => (
                      <div key={idx} className="p-3.5 bg-psy-gold/5 border border-psy-gold/10 rounded-xl flex items-center justify-between gap-3 hover:border-psy-gold/25 transition-all">
                        <div className="space-y-1">
                          <div className="text-xs font-black text-psy-text">{inv.label}</div>
                          <div className="text-[9px] text-psy-text/30">{inv.date} • {inv.num}</div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-serif font-black">{inv.total.toLocaleString()} د.ج</span>
                          <button 
                            onClick={() => pushNotification(`بدء تنزيل الفاتورة المصاحبة ${inv.num} بصيغة PDF مالي.`)}
                            className="p-1.5 hover:bg-psy-gold/10 text-psy-gold rounded-lg transition-all"
                            title="تحميل الفاتورة"
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}

        {/* ============================================================
            TAB 6: LIVE TRANSACTION LEDGER & HISTORY
            ============================================================ */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <GlassCard className="p-0 overflow-hidden" title="سجل حركات المحاسبة والأرصدة">
              <div className="p-6 border-b border-psy-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-psy-gold/5">
                <div className="relative group flex-1 max-w-md">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/30 group-focus-within:text-psy-gold transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="ابحث برقم المعاملة أو التفاصيل التجارية المحددة..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-psy-gold/5 border border-psy-gold/20 rounded-xl pr-12 pl-4 py-3 text-xs md:text-sm text-psy-text placeholder-psy-text/40 focus:border-psy-gold transition-all outline-none"
                  />
                </div>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => {
                      setTransactionLedger(prev => [...prev].reverse());
                      pushNotification("تم إعادة ترتيب قيود الداتا بالتاريخ تلقائياً.");
                    }}
                    className="px-4 py-2.5 bg-psy-surface border border-psy-gold/20 text-psy-gold rounded-xl text-xs font-black hover:bg-psy-gold/5 transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> فرز التتالي
                  </button>
                  <button 
                    onClick={() => pushNotification("تصدير جدول قيود المحاسبة لملف PDF/Excel مع شهادة الاعتماد المالي.")}
                    className="px-4 py-2.5 bg-psy-gold text-psy-bg rounded-xl text-xs font-black hover:scale-103 transition-all"
                  >
                    تصدير التقرير السنوي
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-psy-surface border-b border-psy-gold/15 text-[10px] font-black uppercase tracking-widest text-psy-text/45">
                      <th className="p-5">رمز المعاملة وطريقة الدفع</th>
                      <th className="p-5">تاريخ الحركة</th>
                      <th className="p-5">التفاصيل المصرفية وطبيعة البند</th>
                      <th className="p-5">تبويب البند في الحساب</th>
                      <th className="p-5 text-center">النوع وحالة العملية</th>
                      <th className="p-5 text-left">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-psy-gold/5">
                    {transactionLedger
                      .filter(t => searchQuery === '' || t.desc.includes(searchQuery) || t.id.includes(searchQuery))
                      .map(t => (
                        <tr key={t.id} className="hover:bg-psy-gold/[0.02] transition-colors group">
                          <td className="p-5 font-serif text-xs font-bold text-psy-gold">{t.id}</td>
                          <td className="p-5 text-xs text-psy-text/40">{t.date}</td>
                          <td className="p-5 font-bold text-xs">{t.desc}</td>
                          <td className="p-5">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-psy-gold/10 text-psy-gold border border-psy-gold/15">
                              {t.category === 'subscription' ? 'اشتراكات شهرية' : 
                               t.category === 'commission' ? 'عمولات محصلة' : 
                               t.category === 'session' ? 'جلسات علاجية' : 
                               t.category === 'marketplace' ? 'مبيعات المتجر' : 'تمويل باحث'}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span className="text-[11px] font-black">{t.type === 'income' ? 'وارد وإيراد مالي' : 'منصرف وخسارة'}</span>
                            </div>
                          </td>
                          <td className={`p-5 font-serif font-black text-sm text-left ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} د.ج
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ============================================================
          PORTAL DIALOG 1: INTERACTIVE BILLING CHECKOUT MODAL
          ============================================================ */}
      <AnimatePresence>
        {showCheckout && checkoutItem && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            
            {/* Dark glass overlay with escape hook */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#0e0e0d] border border-psy-gold/30 rounded-[32px] overflow-hidden shadow-2xl p-8 space-y-6"
            >
              
              {/* Modal header with step controller */}
              <div className="flex justify-between items-center border-b border-psy-gold/15 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-psy-gold" size={20} />
                  <h3 className="text-lg font-black text-psy-text">أمان الفوترة وبوابة دفع PsyTech</h3>
                </div>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-1.5 bg-psy-gold/5 border border-psy-gold/10 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <XCircle size={18} />
                </button>
              </div>

              {/* Step 1: Active Input Details Form */}
              {paymentState === 'form' && (
                <div className="space-y-6">
                  
                  {/* Ledger invoice snapshot */}
                  <div className="p-4 bg-psy-gold/5 border border-psy-gold/10 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="text-[10px] text-psy-text/40 font-bold">الحساب الخاضع للفاتورة</div>
                      <div className="text-sm font-black text-psy-text">{checkoutItem.name}</div>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-psy-text/40 font-bold">القيمة والضريبة مشمولة</div>
                      <div className="text-lg font-serif font-black text-psy-gold">{checkoutItem.price.toLocaleString()} د.ج</div>
                    </div>
                  </div>

                  {/* Standard Credit card container visualizer representation */}
                  <div className="bg-gradient-to-br from-[#1c1a17] via-[#13110e] to-[#0a0908] border border-psy-gold/20 p-6 rounded-2xl space-y-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-[1px] bg-white/[0.03]" />
                    <div className="absolute bottom-0 right-0 left-0 top-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,180,131,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
                    
                    <div className="flex justify-between items-start font-black text-[10px] text-psy-gold tracking-widest leading-none">
                      <span>PSYTECH PLATFORM SECURE CARD</span>
                      <ShieldCheck size={20} />
                    </div>

                    <div className="text-lg md:text-xl font-serif font-black tracking-widest text-[#f5ebd7] py-2">
                      {cardDetails.number ? cardDetails.number.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[8px] text-psy-text/30 font-bold">حامل وصاحب الترخيص</div>
                        <div className="text-xs font-black uppercase text-psy-text">{cardDetails.holder || 'DR. ABDELRAHMAN BENSERAI'}</div>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <div className="text-[8px] text-psy-text/30 font-bold text-center">انتهاء البصمة</div>
                          <div className="text-xs font-black text-psy-text">{cardDetails.expiry || 'MM/YY'}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-psy-text/30 font-bold text-center font-mono">CVV</div>
                          <div className="text-xs font-black text-psy-text">{cardDetails.cvv ? '•••' : '☆☆☆'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual input form */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-black">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">رقم البطاقة المصرفية الـ 16 رقماً:</label>
                      <input 
                        type="text" 
                        maxLength={16}
                        placeholder="4242 4242 4242 4242"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 font-mono text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] text-psy-text/50 font-bold">الاسم الثلاثي المكتوب على الواجهة:</label>
                      <input 
                        type="text" 
                        placeholder="DR. ABDELRAHMAN BENSERAI"
                        value={cardDetails.holder}
                        onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value.toUpperCase() })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">تاريخ الانتهاء:</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        placeholder="12/28"
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes('/')) val += '/';
                          setCardDetails({ ...cardDetails, expiry: val });
                        }}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">رمز الأمان الخلفي (CVV):</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        placeholder="•••"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={processCardPayment}
                    className="w-full h-12 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} /> تأكيد وقيد حسم الرصيد ({checkoutItem.price.toLocaleString()} د.ج)
                  </button>
                </div>
              )}

              {/* Step 2: Processing Payment State */}
              {paymentState === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full border border-psy-gold animate-ping opacity-35" />
                    <div className="w-16 h-16 border-4 border-psy-gold border-t-transparent rounded-full animate-spin flex items-center justify-center" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-psy-gold">جاري فحص وتأمين المعاملة المالية</h4>
                    <p className="text-xs text-psy-text/45 max-w-sm">يرجى عدم تدوير أو إغلاق الصفحة. نقوم بالتواصل مع الخادم البنكي المركزي للجزائر لتسجيل وحسم بصمة الدفعة.</p>
                  </div>
                </div>
              )}

              {/* Step 3: SUCCESS Payment State (Requested transaction success template) */}
              {paymentState === 'success' && (
                <div className="py-6 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-emerald-500">تمت العملية بنجاح تام!</h4>
                      <p className="text-xs text-psy-text/50">تم حسم القيمة وصار حسابك مرخصاً ومتاحاً للتحميل الفوري للبيانات.</p>
                    </div>
                  </div>

                  {/* Transaction info receipt */}
                  <div className="p-5 bg-psy-surface border border-psy-gold/10 rounded-2xl space-y-3.5 text-xs font-black">
                    <div className="flex justify-between items-center text-psy-text/40">
                      <span>البند المقتنى:</span>
                      <span className="text-psy-text">{checkoutItem.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-psy-text/40">
                      <span>الرقم المرجعي للتحقق:</span>
                      <span className="text-psy-gold font-mono uppercase">TXN-SAAS-99052</span>
                    </div>
                    <div className="flex justify-between items-center text-psy-text/40">
                      <span>تاريخ المعاملة المعتمد:</span>
                      <span>{new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between items-center text-psy-text/40">
                      <span>إجمالي القيمة المخصومة:</span>
                      <span className="text-sm font-serif text-psy-gold font-semibold">{checkoutItem.price.toLocaleString()} د.ج</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => pushNotification("تنزيل نسخة PDF من كشف العملية...")}
                      className="flex-1 py-3 border border-psy-gold/20 text-psy-gold hover:bg-psy-gold/10 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download size={14} /> تحميل الفاتورة
                    </button>
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-103 transition-all"
                    >
                      العودة للوحة التحكم
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: FAILURE Payment State (Requested transaction failure template) */}
              {paymentState === 'failure' && (
                <div className="py-6 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full flex items-center justify-center">
                      <AlertTriangle size={36} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-red-500">فشلت المعاملة المالية المصرفية</h4>
                      <p className="text-xs text-psy-text/50">تعذر استخلاص الرصيد للمشروع. لم يتم الخصم من بطاقتك.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-xs space-y-2.5">
                    <div className="font-bold text-red-400">الأسباب الشائعة للفشل:</div>
                    <ul className="list-disc list-inside space-y-1 text-psy-text/70">
                      <li>تجاوز الحد الائتماني اليومي المسموح للإنترنت والبطاقة.</li>
                      <li>عدم إدخال رمز التحقق الخلفي (CVV) بالشكل الصحيح أو رصيد غير كافي.</li>
                      <li>تقييد البنك لعملية الخصم الساكن الخارجي للإنترنت.</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setPaymentState('form')}
                      className="flex-1 py-3 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-103 transition-all"
                    >
                      إعادة المحاولة والمراجعة
                    </button>
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 border border-psy-gold/10 hover:border-psy-gold/20 text-psy-text/40 text-xs font-black rounded-xl transition-all"
                    >
                      إلغاء المعاملة تماماً
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          PORTAL DIALOG 2: CORPORATE QUOTE REQUEST DIALOG
          ============================================================ */}
      <AnimatePresence>
        {showQuoteForm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuoteForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-xl bg-[#0e0e0d] border border-psy-gold/30 rounded-[32px] shadow-2xl p-8 space-y-6 text-right"
              dir="rtl"
            >
              <div className="flex justify-between items-center border-b border-psy-gold/15 pb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="text-psy-gold" size={20} />
                  <h3 className="text-lg font-black text-psy-text">طلب تسعيرة رسمية وعرض فني لـ {selectedQuotePlan}</h3>
                </div>
                <button 
                  onClick={() => setShowQuoteForm(false)}
                  className="p-1.5 bg-psy-gold/5 border border-psy-gold/10 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                >
                  <XCircle size={18} />
                </button>
              </div>

              {quoteSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-lg font-black text-psy-text">تم إرسال طلبك بنجاح!</h4>
                  <p className="text-xs text-psy-text/50 max-w-sm mx-auto">يقوم مهندس الحسابات والمبيعات للشركات بالمراجعة وإعداد الملف المالي، وسوف نتصل بكم على البريد المدرج في أقل من 4 ساعات.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs font-black">
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-psy-text/50">اسم المؤسسة / الكلية / المركز الطبي *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="جامعة الجزائر 1 أو مستشفى كلي سنتر"
                      value={quoteFormData.institutionName}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, institutionName: e.target.value })}
                      className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">اسم مسؤول الاتصال أو منسق التوريد *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="الأستاذ بن عودة عثمان"
                        value={quoteFormData.contactName}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, contactName: e.target.value })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">تعداد المعالجين والطلاب أو الموظفين المتوقعين *</label>
                      <input 
                        type="number" 
                        required
                        value={quoteFormData.usersCount}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, usersCount: Number(e.target.value) })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">البريد الإلكتروني الرسمي للمؤسسة *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="contact@university.dz"
                        value={quoteFormData.email}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-psy-text/50">رقم الهاتف للاتصال الجوال والداخلي *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+213 555 12 34 56"
                        value={quoteFormData.phone}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                        className="w-full h-11 bg-psy-surface border border-psy-gold/15 rounded-xl px-4 text-psy-text outline-none focus:border-psy-gold transition-all text-left"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-psy-text/50 font-bold">متطلبات تفصيلية وشروط خصوصية إضافية:</label>
                    <textarea 
                      placeholder="استيراد داتا من أطباء ومرضى العيادة بطرق آلية، إدراج تصفية محلية عيادية مدمجة، إلخ..."
                      value={quoteFormData.specialNotes}
                      rows={3}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, specialNotes: e.target.value })}
                      className="w-full bg-psy-surface border border-psy-gold/15 rounded-xl p-4 text-psy-text outline-none focus:border-psy-gold transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-12 bg-psy-gold text-psy-bg text-xs font-black rounded-xl hover:scale-102 transition-all"
                  >
                    تقديم طلب التسعيرة والملف الفني
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          AI IMAGE PROMPTS (Strict accordance to AGENTS.md rules)
          ============================================================ */}
      <section className="mt-16 p-8 bg-[#0a0a09] border border-psy-gold/15 rounded-[32px] space-y-4">
        <h4 className="text-sm font-black text-psy-gold uppercase tracking-wider">AI IMAGE PROMPTS REPORT</h4>
        <div className="h-[1px] bg-psy-gold/10" />
        <p className="text-xs text-psy-text/40">تقرير توليد الصور الجاهزة لزيادة التماسك البصري للقسم المالي والاقتصادي حسب نمط &quot;Luxury Scientific Psychology Style&quot;:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          <div className="space-y-2 p-4 bg-psy-surface/30 rounded-2xl border border-psy-gold/5">
            <div className="font-bold text-psy-text">١. صورة الواجهة الرئيسية للمتجر السيكولوجي (Hero Background)</div>
            <div className="text-psy-text/50"><strong>القسم:</strong> Marketplace Hero Section</div>
            <div className="text-psy-text/50"><strong>المقاس:</strong> 16:9</div>
            <div className="text-psy-text/40 font-serif leading-relaxed select-all">
              &quot;Ultra high-end 3D glossy abstract luxury visual background for a psychological monetization platform, glowing golden neural networks intertwined with floating premium transparent clinical glass spheres, soft beige and soft warm brown highlights, deep charcoal background, clean minimal scientific composition, luxury tech style, 8k resolution&quot;
            </div>
          </div>
          <div className="space-y-2 p-4 bg-psy-surface/30 rounded-2xl border border-psy-gold/5">
            <div className="font-bold text-psy-text">٢. أيقونة خطة الهيئات والمؤسسات الكبرى (Corporate Hero Benefit)</div>
            <div className="text-psy-text/50"><strong>القسم:</strong> Corporate Plans Overview</div>
            <div className="text-psy-text/50"><strong>المقاس:</strong> 1:1</div>
            <div className="text-psy-text/40 font-serif leading-relaxed select-all">
              &quot;Luxury geometric greek symbol of psychology Ψ, elegant corporate branding visual asset, crafted with metallic gold polished wireframe and glowing neurons inside it, warm beige velvet texture behind, floating on abstract dark premium background, architectural composition, extremely clean and academic&quot;
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
