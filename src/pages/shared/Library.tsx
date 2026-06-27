import React, { useState, useContext } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Bookmark,
  FileText,
  Video,
  Mic,
  ArrowRight,
  GraduationCap,
  Send,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { Modal } from '../../components/clinic/Modal';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { AuthContext } from '../../context/AuthContext';
import { formatCurrency, addTransaction } from '../../lib/economy';
import { ShoppingBag, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCases, createTask } from '../../lib/clinic';

interface Resource {
  id: string;
  title: string;
  author: string;
  category: string;
  type: 'article' | 'video' | 'podcast' | 'paper';
  date: string;
  description: string;
  imageUrl?: string;
  price?: number;
  isUnlocked?: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'مقدمة في العلاج السلوكي المعرفي (CBT)',
    author: 'د. سامي محمود',
    category: 'تعليمي',
    type: 'article',
    date: '2024-04-15',
    description: 'دليل شامل يشرح أساسيات العلاج السلوكي المعرفي وكيفية تطبيقه في الممارسة العيادية اليومية.',
    imageUrl: 'https://images.unsplash.com/photo-1617791160536-598cf2da88dd',
    price: 0
  },
  {
    id: '2',
    title: 'تطور القياس النفسي في العصر الرقمي',
    author: 'أ.د. منى زكي',
    category: 'بحث علمي',
    type: 'paper',
    date: '2024-03-20',
    description: 'دراسة حول تأثير التكنولوجيا على دقة وموثوقية الاختبارات النفسية المحوسبة.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc',
    price: 150
  },
  {
    id: '3',
    title: 'تقنيات التأمل الواعي (Mindfulness)',
    author: 'مركز الهدوء النفسي',
    category: 'مساعدة ذاتية',
    type: 'video',
    date: '2024-05-01',
    description: 'سلسلة فيديو تعليمية ترشدك خلال تمارين التأمل الواعي لتقليل التوتر اليومي.',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
    price: 0
  },
  {
    id: '4',
    title: 'بودكاست: مستقبل الطب النفسي التجديدي',
    author: 'د. يوسف إبراهيم',
    category: 'بودكاست',
    type: 'podcast',
    date: '2024-04-30',
    description: 'حلقة نقاشية حول الابتكارات الحديثة في علاج الاضطرابات النفسية المقاومة للعلاج.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    price: 85
  }
];

const mockPatients = [
  { id: 'case-1', code: 'X92J-K12L', name: 'الحالة الإفتراضية: X92J-K12L' },
  { id: '2', code: 'R5M8-C2V1', name: 'سارة خالد' },
  { id: '3', code: 'K9L2-M4N5', name: 'ياسين علي' }
];

export const Library: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Dynamic system cases list
  const systemCases = getCases();
  const patientsList = systemCases.map(c => ({
    id: c.id,
    code: c.patientCode,
    name: `الحالة المعالَجة: ${c.patientCode}`
  }));
  const activePatientsList = patientsList.length > 0 ? patientsList : mockPatients;

  const categories = ['الكل', 'تعليمي', 'بحث علمي', 'مساعدة ذاتية', 'تقنيات'];

  const handleAssignClicked = (res: Resource) => {
    setSelectedResource(res);
    setIsAssignModalOpen(true);
    setAssignSuccess(false);
    setSelectedPatientId('');
  };

  const handleSendToPatient = () => {
    if (!selectedPatientId || !selectedResource) return;
    
    // Create a real therapeutic task inside clinic module
    createTask({
      caseId: selectedPatientId,
      title: `قراءة ومطالعة: ${selectedResource.title}`,
      description: `يرجى مراجعة هذا الملف أو المقال التعليمي والتأمل فيه: ${selectedResource.description}`,
      taskType: selectedResource.type === 'video' ? 'mindfulness' : 'cognitive',
      instructions: `قراءة بتركيز وكتابة ملخص بسيط في الملاحظات اليومية.`,
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
      difficulty: 2
    });

    setAssignSuccess(true);
    setTimeout(() => {
      setIsAssignModalOpen(false);
      setAssignSuccess(false);
    }, 2000);
  };

  const handlePurchase = (res: Resource) => {
    if (confirm(`هل ترغب في شراء "${res.title}" مقابل ${formatCurrency(res.price || 0)}؟`)) {
      addTransaction({
        amount: res.price || 0,
        type: 'purchase',
        description: `شراء محتوى: ${res.title}`,
        category: 'library'
      });
      toast.success('تم شراء المحتوى بنجاح! يمكنك الآن الوصول إليه.');
      // In a real app we'd update state/DB
      res.isUnlocked = true;
      setActiveCategory(activeCategory); // trigger rerender
    }
  };

  const isProfessional = user?.role === 'clinician' || user?.role === 'owner';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative min-h-[14rem] sm:h-64 rounded-3xl sm:rounded-[40px] overflow-hidden mb-10 border border-white/5 shadow-2xl p-6 sm:p-8 flex flex-col justify-end">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
          alt="Library Banner"
          width={960}
          priority
          className="absolute inset-0 w-full h-full opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-psy-bg via-psy-bg/50 to-transparent" />
        <div className="relative z-10 space-y-2 text-right">
          <BackButton />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-psy-text tracking-tighter">المكتبة الرقمية</h1>
          <p className="text-psy-text/60 max-w-lg font-light text-sm sm:text-lg">اكتشف أحدث الأبحاث، المقالات، والوسائط التعليمية في عالم الصحة النفسية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-psy-gold flex items-center gap-2">
                <Filter size={16} /> التصنيفات
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-right px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat 
                      ? 'bg-[#D4B483] text-[#181816]' 
                      : 'text-psy-text/60 hover:bg-white/5 hover:text-psy-text'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-bold text-sm text-psy-gold">نوع المحتوى</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-white/5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-2 hover:bg-[#D4B483]/10 transition-all border border-transparent hover:border-[#D4B483]/30">
                  <FileText size={16} className="text-[#D4B483]" /> مقالات
                </button>
                <button className="p-3 bg-white/5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-2 hover:bg-[#D4B483]/10 transition-all border border-transparent hover:border-[#D4B483]/30">
                  <Video size={16} className="text-[#D4B483]" /> فيديوهات
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
            <input 
              type="text"
              placeholder="ابحث عن أوراق بحثية، مقالات أو وسائط..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4B483]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map(res => (
              <GlassCard key={res.id} className="p-0 overflow-hidden flex flex-col group hover:border-[#D4B483]/30 transition-all duration-500">
                <div className="h-32 p-0 relative overflow-hidden">
                   {res.imageUrl ? (
                     <OptimizedImage
                       src={res.imageUrl}
                       alt={res.title}
                       width={400}
                       className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                     />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-[#D4B483]/10 to-transparent" />
                   )}
                   <div className="absolute inset-0 bg-psy-bg/20 group-hover:bg-psy-bg/10 transition-colors" />
                   <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-lg text-[#D4B483]">
                      {res.type === 'article' && <FileText size={18} />}
                      {res.type === 'video' && <Video size={18} />}
                      {res.type === 'podcast' && <Mic size={18} />}
                      {res.type === 'paper' && <GraduationCap size={18} />}
                   </div>
                   <div className="absolute bottom-4 right-6 left-6">
                     <span className="text-[10px] font-black tracking-widest text-[#D4B483] uppercase bg-black/40 px-2 py-1 rounded backdrop-blur-sm">{res.category}</span>
                     <h3 className="font-bold text-base leading-tight mt-1 text-white drop-shadow-lg truncate">{res.title}</h3>
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                   <p className="text-xs text-psy-text/60 leading-relaxed line-clamp-3">
                      {res.description}
                   </p>
                   <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                      {isProfessional && (
                        <button 
                          onClick={() => handleAssignClicked(res)}
                          className="w-full py-2 bg-[#D4B483]/10 hover:bg-[#D4B483]/20 border border-[#D4B483]/10 text-[#D4B483] rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <Send size={14} /> إرسال كمهام للحالة
                        </button>
                      )}
                      
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <div className="space-y-0.5">
                          <div className="text-psy-text/40">بواسطة: {res.author}</div>
                          <div className="text-psy-text/20">{res.date}</div>
                        </div>
                        {res.price && res.price > 0 && !res.isUnlocked ? (
                          <button 
                            onClick={() => handlePurchase(res)}
                            className="bg-psy-gold text-psy-bg px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-all"
                          >
                             <ShoppingBag size={12} />
                             {formatCurrency(res.price)}
                          </button>
                        ) : (
                          <button className="flex items-center gap-1.5 text-[#D4B483] group-hover:gap-3 transition-all">
                             عرض {res.price && res.price > 0 && <Lock size={10} className="text-psy-gold" />} <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                   </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        title="تعيين مورد كمهمة علاجية"
      >
        <div className="space-y-6">
          {!assignSuccess ? (
            <>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="p-3 bg-[#D4B483]/10 rounded-xl text-[#D4B483]">
                  {selectedResource?.type === 'article' && <FileText size={24} />}
                  {selectedResource?.type === 'video' && <Video size={24} />}
                  {selectedResource?.type === 'podcast' && <Mic size={24} />}
                  {selectedResource?.type === 'paper' && <GraduationCap size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{selectedResource?.title}</h4>
                  <p className="text-[10px] text-psy-text/40">{selectedResource?.category}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-psy-text/60">اختر الحالة / المستخدم</label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {activePatientsList.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-right ${
                        selectedPatientId === p.id 
                        ? 'bg-[#D4B483]/10 border-[#D4B483] text-[#D4B483]' 
                        : 'bg-white/5 border-white/10 text-psy-text/60 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserPlus size={16} />
                        <div>
                          <div className="text-xs font-bold">{p.name}</div>
                          <div className="text-[10px] opacity-60">كود: {p.code}</div>
                        </div>
                      </div>
                      {selectedPatientId === p.id && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">ملاحظات إضافية (اختياري)</label>
                <textarea 
                  placeholder="مثال: يرجى مشاهدة الفيديو قبل جلستنا القادمة لمناقشة تقنيات التنفس..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4B483] h-20 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <GoldButton 
                  className="flex-1" 
                  size="lg" 
                  disabled={!selectedPatientId}
                  onClick={handleSendToPatient}
                >
                  تأكيد الإرسال
                </GoldButton>
                <GoldButton 
                  variant="secondary" 
                  className="flex-1" 
                  size="lg" 
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  إلغاء
                </GoldButton>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold">تم الإرسال بنجاح!</h3>
                <p className="text-xs text-psy-text/40 mt-1">تمت إضافة المورد كمهام جديدة في لوحة تحكم الحالة</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

