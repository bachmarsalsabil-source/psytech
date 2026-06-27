
import React, { useState } from 'react';
import { GlassCard } from '../../components/clinic/GlassCard';
import {
  ShoppingBag,
  Search,
  Tag,
  FileText,
  Scale,
  Layers,
  Download,
  Star,
  Users,
  FlaskConical,
  CreditCard,
  Plus,
  TrendingUp,
  Award,
  Package
} from 'lucide-react';
import { formatCurrency, addTransaction } from '../../lib/economy';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: Package },
  { id: 'tests', label: 'الاختبارات', icon: FileText },
  { id: 'norms', label: 'المعايير', icon: Scale },
  { id: 'datasets', label: 'البيانات', icon: Layers },
];

const MARKETPLACE_STATS = [
  { label: 'منتج متاح', value: '120+', icon: Package, color: 'text-psy-gold' },
  { label: 'باحث نشط', value: '45', icon: Users, color: 'text-blue-400' },
  { label: 'عملية بيع ناجحة', value: '1,200', icon: TrendingUp, color: 'text-emerald-400' },
];

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tests' | 'norms' | 'datasets'>('all');
  const [search, setSearch] = useState('');

  const products = [
    {
      id: '1',
      title: 'قالب اختبار الذكاء المتعدد (Standard)',
      category: 'tests',
      author: 'مختبر برينتيك',
      rating: 4.8,
      sales: 154,
      price: 1200,
      description: 'قالب جاهز للاستخدام مع معايير عربية محدثة لعام 2024.',
    },
    {
      id: '2',
      title: 'معايير الشخصية الحدية (البحرين)',
      category: 'norms',
      author: 'د. يوسف منصور',
      rating: 5.0,
      sales: 42,
      price: 2500,
      description: 'داتا كاملة لمعايير اختبار الشخصية في بيئة دول الخليج.',
    },
    {
      id: '3',
      title: 'مجموعة بيانات اضطراب القلق (1000 حالة)',
      category: 'datasets',
      author: 'جامعة الملك فيصل',
      rating: 4.9,
      sales: 12,
      price: 5000,
      description: 'بيانات مجهولة الهوية للدراسات الإحصائية والمقارنة.',
    },
    {
      id: '4',
      title: 'بروتوكول تحليل الصدمات النفسية',
      category: 'tests',
      author: 'مؤسسة روان',
      rating: 4.7,
      sales: 89,
      price: 850,
      description: 'منهجية تحليل منظمة للعيادات المتخصصة.',
    },
  ];

  const handlePurchase = (p: typeof products[0]) => {
    if (confirm(`هل أنت متأكد من رغبتك في شراء ${p.title} مقابل ${formatCurrency(p.price)}؟`)) {
      addTransaction({
        amount: p.price,
        type: 'purchase',
        description: `شراء: ${p.title}`,
        category: 'lab',
      });
      toast.success('تمت عملية الشراء بنجاح! ستجد المنتج في قسم القوالب.');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'tests': return <FileText size={56} className="text-psy-gold/20" />;
      case 'norms': return <Scale size={56} className="text-psy-gold/20" />;
      case 'datasets': return <Layers size={56} className="text-psy-gold/20" />;
      default: return <Package size={56} className="text-psy-gold/20" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.label : cat;
  };

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => p.title.includes(search) || p.description.includes(search) || p.author.includes(search));

  return (
    <>
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">

        {/* ── Hero Header ─────────────────────────────────── */}
        <div className="relative glass rounded-[32px] md:rounded-[48px] p-8 md:p-12 overflow-hidden min-h-[200px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Decorative glows */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-psy-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-psy-gold/4 blur-2xl pointer-events-none" />

          <div className="relative space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-psy-gold/15 flex items-center justify-center text-psy-gold">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xs font-bold text-psy-gold/70 uppercase tracking-widest">سوق المختبر الرقمي</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-psy-text tracking-tight leading-tight">
              سوق الأصول البحثية
            </h1>
            <p className="text-psy-text/40 font-light text-base md:text-lg max-w-lg">
              تداول الاختبارات، المعايير، والبيانات البحثية مع الخبراء
            </p>
          </div>

          <div className="relative">
            <button className="h-14 px-8 bg-psy-gold text-psy-bg rounded-[24px] font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-psy-gold/20 text-sm">
              <Plus size={20} />
              بيع أصل بحثي
            </button>
          </div>
        </div>

        {/* ── Marketplace Stats ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {MARKETPLACE_STATS.map((s, i) => (
            <div key={i} className="glass rounded-2xl md:rounded-[28px] p-6 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-psy-text/40 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Category Filter ───────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-gold/50" size={18} />
            <input
              type="text"
              placeholder="ابحث عن اختبار، معايير، أو باحث معين..."
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pr-12 pl-6 text-sm outline-none focus:border-psy-gold/60 focus:bg-white/8 transition-all placeholder:text-psy-text/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/8 gap-1 overflow-x-auto no-scrollbar flex-shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 min-h-[40px] ${
                  activeCategory === cat.id
                    ? 'bg-psy-gold text-psy-bg shadow-md'
                    : 'text-psy-text/40 hover:text-psy-text hover:bg-white/5'
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-psy-text/30 font-medium px-1">
          {filtered.length} نتيجة في {getCategoryLabel(activeCategory)}
        </div>

        {/* ── Products Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group"
            >
              <GlassCard className="h-full flex flex-col p-0 overflow-hidden border border-psy-gold/10 group-hover:border-psy-gold/30 transition-all rounded-[32px]">
                {/* Product image / placeholder */}
                <div className="h-44 bg-gradient-to-br from-psy-gold/8 to-psy-gold/2 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-psy-gold/10 to-transparent" />
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                    {getCategoryIcon(product.category)}
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-psy-bg/80 backdrop-blur-md rounded-full text-[10px] font-black text-psy-gold uppercase tracking-widest border border-psy-gold/20">
                    {getCategoryLabel(product.category)}
                  </div>
                  {/* Rating badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 bg-psy-bg/80 backdrop-blur-md rounded-full border border-white/10">
                    <Star size={10} className="fill-psy-gold text-psy-gold" />
                    <span className="text-[10px] font-black text-psy-gold">{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold leading-snug group-hover:text-psy-gold transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-psy-text/40">
                      <Users size={11} />
                      <span>{product.author}</span>
                    </div>
                    <p className="text-xs text-psy-text/50 leading-relaxed line-clamp-2">{product.description}</p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/5">
                    {/* Price & sales */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-psy-text/30 font-medium">{product.sales} مبيعة</div>
                      <div className="text-xl font-black text-psy-gold">{formatCurrency(product.price)}</div>
                    </div>
                    {/* Buy button */}
                    <button
                      onClick={() => handlePurchase(product)}
                      className="w-full h-11 bg-psy-gold/15 hover:bg-psy-gold text-psy-gold hover:text-psy-bg rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-psy-gold/30 hover:border-psy-gold group/btn"
                    >
                      <ShoppingBag size={15} className="group-hover/btn:scale-110 transition-transform" />
                      شراء الآن
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center glass rounded-[32px] space-y-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-psy-gold/10 flex items-center justify-center text-psy-gold/30">
                <Package size={40} />
              </div>
              <p className="font-bold text-psy-text/30">لا توجد منتجات تطابق البحث</p>
              <p className="text-xs text-psy-text/20">جرّب تعديل الفلتر أو كلمة البحث</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
