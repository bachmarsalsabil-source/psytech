import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Heart,
  Plus, 
  Tag, 
  Trash2, 
  Upload, 
  Bookmark, 
  ClipboardCheck, 
  GraduationCap,
  X,
  FileDown,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { Modal } from '../../components/clinic/Modal';
import { 
  getLockerItems, 
  addLockerItem, 
  deleteLockerItem, 
  toggleLockerItemFavorite, 
  updateLockerItemNotes, 
  LockerItem 
} from '../../lib/clinic';
import { toast } from 'react-hot-toast';

export const SpecialistLocker: React.FC = () => {
  const [items, setItems] = useState<LockerItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'tests' | 'favorites' | 'uploaded' | 'library'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modals / forms state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LockerItem | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Add Item form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newType, setNewType] = useState<'book' | 'test' | 'packet' | 'guide'>('book');
  const [newCategory, setNewCategory] = useState('');
  const [newSource, setNewSource] = useState<'library' | 'uploaded'>('uploaded');
  const [newTagsStr, setNewTagsStr] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newQuestions, setNewQuestions] = useState<{ id: string; text: string; type: string }[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');

  // Fetch items
  const reloadLocker = () => {
    setItems(getLockerItems());
  };

  useEffect(() => {
    reloadLocker();
  }, []);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavNow = toggleLockerItemFavorite(id);
    toast.success(isFavNow ? 'تمت الإضافة للمفضلة' : 'تم الإزالة من المفضلة');
    reloadLocker();
    if (selectedItem?.id === id) {
      setSelectedItem(prev => prev ? { ...prev, isFavorite: isFavNow } : null);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المورد من مخزنك الخاص؟')) {
      deleteLockerItem(id);
      toast.success('تم حذف المورد بنجاح');
      reloadLocker();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleUpdateNotes = (id: string) => {
    updateLockerItemNotes(id, editingNotes);
    toast.success('تم حفظ ملاحظاتك وإرشاداتك المخصصة');
    reloadLocker();
    setSelectedItem(prev => prev ? { ...prev, notes: editingNotes } : null);
  };

  const handleAddQuestion = () => {
    if (!currentQuestionText.trim()) return;
    setNewQuestions([
      ...newQuestions, 
      { id: `q-${Date.now()}`, text: currentQuestionText, type: 'likert' }
    ]);
    setCurrentQuestionText('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setNewQuestions(newQuestions.filter((_, i) => i !== idx));
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('يرجى تحديد عنوان المورد');
      return;
    }

    const tags = newTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addLockerItem({
      title: newTitle,
      author: newAuthor || 'أخصائي العيادة',
      type: newType,
      category: newCategory || 'عام',
      source: newSource,
      tags: tags.length > 0 ? tags : ['مخصص'],
      isFavorite: false,
      notes: newNotes,
      customQuestions: newType === 'test' ? newQuestions : undefined
    });

    toast.success('تمت إضافة المادة بنجاح وتنظيمها في مخزنك الخاص');
    reloadLocker();
    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewAuthor('');
    setNewType('book');
    setNewCategory('');
    setNewSource('uploaded');
    setNewTagsStr('');
    setNewNotes('');
    setNewQuestions([]);
    setCurrentQuestionText('');
  };

  // Filter items
  const allTags = Array.from(new Set(items.flatMap(i => i.tags)));

  const filteredItems = items.filter(item => {
    // Search
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tab
    let matchesTab = true;
    if (activeTab === 'books') matchesTab = item.type === 'book' || item.type === 'packet';
    else if (activeTab === 'tests') matchesTab = item.type === 'test' || item.type === 'guide';
    else if (activeTab === 'favorites') matchesTab = item.isFavorite;
    else if (activeTab === 'uploaded') matchesTab = item.source === 'uploaded';
    else if (activeTab === 'library') matchesTab = item.source === 'library';

    // Tag filter
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTab && matchesTag;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 min-h-screen text-right" dir="rtl">
      
      {/* Banner Component */}
      <div className="relative min-h-[14rem] sm:h-64 rounded-3xl sm:rounded-[40px] overflow-hidden mb-8 border border-white/5 shadow-2xl p-6 sm:p-8 flex flex-col justify-end">
        <img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200" 
          alt="Locker Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-psy-bg via-psy-bg/40 to-transparent" />
        <div className="relative z-10 space-y-2">
          <BackButton />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 px-2.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                  <Sparkles size={11} /> مساحتك السيكومترية المنسقة
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-psy-text tracking-tighter">مخزني الخاص</h1>
              <p className="text-psy-text/60 max-w-lg font-light text-sm sm:text-lg">مستودع مصادق ومقنن لمقتنياتك من المكتبة أو اختباراتك وكتبك العلاجية المرفوعة ذاتياً.</p>
            </div>
            
            <GoldButton 
              onClick={() => setIsAddModalOpen(true)}
              className="sm:self-end h-13 px-6 shadow-[0_4px_20px_rgba(214,180,131,0.2)]"
            >
              <Plus size={18} className="ml-2" />
              أضف / ارفع مادة جديدة
            </GoldButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left pane: Filter and Tags */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 space-y-6 border-white/[0.05]">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-psy-gold flex items-center gap-2">
                <Filter size={16} className="text-[#D4AF37]" /> تنقية المستودع
              </h3>
              
              <div className="flex flex-col gap-1.5">
                {[
                  { tag: 'all', label: 'جميع المحتويات' },
                  { tag: 'books', label: 'المراجع والكتب العلاجية' },
                  { tag: 'tests', label: 'الاختبارات والمقاييس' },
                  { tag: 'favorites', label: 'المفضلة الخاصة (النجمة)' },
                  { tag: 'library', label: 'المقتناة من المكتبة' },
                  { tag: 'uploaded', label: 'المرفوعة يدوياً' }
                ].map(tab => (
                  <button 
                    key={tab.tag}
                    onClick={() => { setActiveTab(tab.tag as any); setSelectedTag(null); }}
                    className={`text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeTab === tab.tag 
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-r-3 border-[#D4AF37]' 
                      : 'text-psy-text/50 hover:bg-white/5 hover:text-psy-text'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-4">
                <h3 className="font-bold text-sm text-psy-gold flex items-center gap-2">
                  <Tag size={15} /> فرز بالوسوم المخصصة
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedTag(null)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all ${
                      selectedTag === null 
                      ? 'bg-psy-text text-psy-bg' 
                      : 'bg-white/5 text-psy-text/40 hover:bg-white/10'
                    }`}
                  >
                    الكل
                  </button>
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all flex items-center gap-1 ${
                        selectedTag === tag 
                        ? 'bg-[#D4AF37] text-psy-bg' 
                        : 'bg-white/5 text-psy-text/60 hover:bg-white/10'
                      }`}
                    >
                      <span>#{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right pane: Grid of Items */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
            <input 
              type="text"
              placeholder="ابحث داخل مخزنك بالأبواب، العناوين، المقاييس، أو الكلمات المفتاحية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4AF37] text-right"
            />
          </div>

          {filteredItems.length === 0 ? (
            <GlassCard className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-white/[0.02] border border-[#D4AF37]/25 rounded-full flex items-center justify-center text-[#D4AF37]/60">
                <Archive size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-psy-text">المخزن لا يحتوي على مواد مطابقة</h3>
                <p className="text-xs text-psy-text/40 max-w-sm mx-auto mt-2 leading-relaxed">
                  بإمكانك اقتناء مراجع ومقاييس معتمدة من المكتبة العامة للمنصة، أو النقر على "أضف / ارفع مادة جديدة" للبدء بالبناء اليدوي.
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <GlassCard 
                  key={item.id} 
                  onClick={() => { setSelectedItem(item); setEditingNotes(item.notes || ''); }}
                  className="p-5 flex flex-col justify-between group hover:border-[#D4AF37]/35 cursor-pointer relative transition-all duration-300 border-white/[0.04]"
                >
                  <div className="absolute top-4 left-4 flex items-center gap-1">
                    <button 
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                      className={`p-1.5 rounded-lg transition-colors bg-white/5 border border-white/15 ${
                        item.isFavorite ? 'text-psy-gold' : 'text-psy-text/20 hover:text-psy-gold/80'
                      }`}
                    >
                      <Heart size={14} fill={item.isFavorite ? '#D4AF37' : 'none'} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 rounded-lg transition-colors bg-white/5 border border-white/15 text-psy-text/20 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg text-psy-bg font-black ${
                        item.type === 'book' || item.type === 'packet'
                          ? 'bg-[#D4AF37]'
                          : 'bg-indigo-300'
                      }`}>
                        {item.type === 'book' && <BookOpen size={16} />}
                        {item.type === 'packet' && <FileText size={16} />}
                        {item.type === 'test' && <ClipboardCheck size={16} />}
                        {item.type === 'guide' && <GraduationCap size={16} />}
                      </span>
                      <span className="text-[10px] font-bold text-psy-text/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                        item.source === 'library'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {item.source === 'library' ? 'مقتنى' : 'مرفوع يدوياً'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">{item.title}</h3>
                      <p className="text-[10px] text-psy-text/40 mt-1">بواسطة: {item.author}</p>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-psy-text/50 line-clamp-2 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-1 items-center justify-between">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-mono text-psy-text/30 bg-white/5 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-[10px] text-[#D4AF37] font-bold flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                      تعديل الملاحظات ورؤية المادة <ChevronRight size={12} className="rotate-180" />
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Details and Manual Notes Modification Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <Modal 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)} 
            title={selectedItem.title}
          >
            <div className="space-y-6">
              
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                <div className={`p-4 rounded-xl text-psy-bg ${
                  selectedItem.type === 'book' || selectedItem.type === 'packet'
                    ? 'bg-[#D4AF37]'
                    : 'bg-indigo-300'
                }`}>
                  {selectedItem.type === 'book' && <BookOpen size={24} />}
                  {selectedItem.type === 'packet' && <FileText size={24} />}
                  {selectedItem.type === 'test' && <ClipboardCheck size={24} />}
                  {selectedItem.type === 'guide' && <GraduationCap size={24} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full">{selectedItem.category}</span>
                    <span className="text-[9px] text-psy-text/40 bg-white/5 px-2 py-0.5 rounded-full">المصدر: {selectedItem.source === 'library' ? 'مكتبة النظام' : 'مرفوع ذاتي'}</span>
                  </div>
                  <p className="text-xs text-psy-text/40">بواسطة: {selectedItem.author}</p>
                </div>
              </div>

              {selectedItem.customQuestions && selectedItem.customQuestions.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-psy-gold">الأسئلة والبنود السيكومترية المدرجة:</h4>
                  <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                    {selectedItem.customQuestions.map((q, i) => (
                      <div key={q.id} className="text-xs text-psy-text/70 flex items-start gap-2 border-b border-white/[0.03] pb-1.5 last:border-b-0">
                        <span className="font-mono text-[#D4AF37]">{i + 1}.</span>
                        <span>{q.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-psy-text/60">ملاحظات ومرئيات الأخصائي للاستخدام:</label>
                  <span className="text-[10px] text-psy-gold font-mono">تحديث ذاتي ومتاح أثناء صياغة الخطط</span>
                </div>
                <textarea 
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="اكتب توجيهاتك السريرية الخاصة عند تكليف الحالات بهذا المعيار أو الواجب، كعدد المرات ونسب الالتزام..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37] h-28 resize-none text-right"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <GoldButton 
                  onClick={() => handleUpdateNotes(selectedItem.id)}
                  className="flex-1"
                >
                  حفظ التحديثات وملاحظاتي
                </GoldButton>
                <GoldButton 
                  onClick={() => setSelectedItem(null)}
                  variant="secondary"
                  className="flex-1"
                >
                  إغلاق النافذة
                </GoldButton>
              </div>

            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add New Locker Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <Modal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            title="تنظيم وإدراج مادة جديدة بالمخزن الخاص"
          >
            <form onSubmit={handleCreateItemSubmit} className="space-y-5 text-right">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">عنوان المورد</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="مثال: مقياس القلق المرتفع للتجربة الفردية"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">المؤلف / المصدر الإكلينيكي</label>
                  <input 
                    type="text" 
                    value={newAuthor} 
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder="مثال: د. سامي الأحمد، أو عيادة الفردوس"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">التصنيف أو الفئة</label>
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="مثال: CBT, الاكتئاب، السلوكي، اليقظة الوجدانية"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">نوع المورد</label>
                  <select 
                    value={newType} 
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37] h-[42px] appearance-none"
                  >
                    <option value="book">كتاب أو مرجع علمي</option>
                    <option value="test">مقياس / اختبار سيكومتري تفاعلي</option>
                    <option value="packet">حقيبة علاجية / منشور مدرج</option>
                    <option value="guide">دليل تمرين موجه</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">أصل المادة</label>
                  <select 
                    value={newSource} 
                    onChange={e => setNewSource(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37] h-[42px] appearance-none"
                  >
                    <option value="uploaded">مجهود ورفع محلي ذاتي</option>
                    <option value="library">مقتناة وموثقة من المكتبة المشتركة</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-psy-text/60">الوسوم مفرقة بفواصل (,)</label>
                  <input 
                    type="text" 
                    value={newTagsStr} 
                    onChange={e => setNewTagsStr(e.target.value)}
                    placeholder="مثال: أفكار, قلق, علاج, مراهقين"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Upload File Mockup design system */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">المرفق الفني (تحميل ملف كتاب / تصميم المقياس)</label>
                <div className="border border-dashed border-white/15 rounded-2xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <Upload size={24} className="text-[#D4AF37]" />
                  <span className="text-xs font-black text-white">اسحب المرجع PDF أو صورة المقياس أو انقر للرفع</span>
                  <span className="text-[9px] text-psy-text/30">يدعم PDF, Word, PNG حتى 50 ميجابايت</span>
                </div>
              </div>

              {/* Conditional Test Questions Builder */}
              {newType === 'test' && (
                <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles size={14} /> بناء أسئلة وبنود الاختبار (تفاعلية):
                  </h4>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={currentQuestionText}
                      onChange={e => setCurrentQuestionText(e.target.value)}
                      placeholder="اكتب البند الإحصائي المقيّم هنا..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs outline-none focus:border-[#D4AF37]"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddQuestion}
                      className="bg-[#D4AF37] text-psy-bg px-4 rounded-xl text-xs font-bold"
                    >
                      إضافة بند
                    </button>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {newQuestions.map((q, idx) => (
                      <div key={q.id} className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs flex justify-between items-center">
                        <span className="text-psy-text/80">{idx + 1}. {q.text}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-red-400 font-bold px-1.5 py-0.5 hover:bg-red-500/10 rounded"
                        >
                          إزالة
                        </button>
                      </div>
                    ))}
                    {newQuestions.length === 0 && (
                      <p className="text-[10px] text-psy-text/30 text-center">لم تضف أسئلة بعد. سيتم بناء بنود افتراضية للمقياس.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-psy-text/60">ملاحظات توجيهية للأخصائي عند التدريس المنزلي</label>
                <textarea 
                  value={newNotes} 
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="تعليمات خاصة بك لتذكر كيف ومتى يوظف هذا المرجع..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-[#D4AF37] h-20 resize-none text-right"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <GoldButton type="submit" className="flex-1">
                  تثبيت وتنظيم المادة في مستودعي
                </GoldButton>
                <GoldButton 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  إلغاء الأمر
                </GoldButton>
              </div>

            </form>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};
