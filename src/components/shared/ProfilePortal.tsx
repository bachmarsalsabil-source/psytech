import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Briefcase, 
  Image as ImageIcon, 
  CreditCard, 
  Save, 
  X, 
  Camera,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Upload,
  Trash2,
  Mail,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrentUser, updateUserProfile, ClinicUser, getClinicTransactions, EconomicTransaction } from '../../lib/clinic';
import { GlassCard } from '../clinic/GlassCard';
import { GoldButton } from '../clinic/GoldButton';
import { toast } from 'react-hot-toast';

interface ProfilePortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePortal: React.FC<ProfilePortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'financial'>('info');
  const [user, setUser] = useState<ClinicUser | null>(null);
  const [formData, setFormData] = useState<Partial<ClinicUser>>({});
  const [transactions, setTransactions] = useState<EconomicTransaction[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData(currentUser);
      }
      setTransactions(getClinicTransactions().slice(0, 10)); // Just a sample
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const updated = updateUserProfile(formData);
    if (updated) {
      setUser(updated);
      setSaveMessage('تم حفظ التغييرات بنجاح');
      setTimeout(() => setSaveMessage(''), 3000);
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-5xl h-full max-h-[850px] bg-[#121211] border border-psy-gold/20 rounded-[40px] shadow-[0_0_100px_rgba(212,180,131,0.15)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-psy-gold/[0.02]">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-psy-gold/50">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-psy-gold" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-serif font-black m-0 tracking-tight">{formData.fullName}</h2>
                <p className="text-psy-gold/60 text-xs font-black uppercase tracking-[0.2em]">{formData.specialization}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <GoldButton 
                onClick={handleSave} 
                size="sm"
                className="px-6 h-11 rounded-xl"
                disabled={isSaving}
              >
                {isSaving ? <Save size={18} className="animate-pulse" /> : <Save size={18} />}
                حفظ
              </GoldButton>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-xl transition-all text-psy-text/40 hover:text-psy-text"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-8 flex items-center gap-2 border-b border-white/5 bg-white/[0.01]">
            {[
              { id: 'info', label: 'المعلومات الشخصية', icon: User },
              { id: 'experience', label: 'الخبرة والمسيرة', icon: Briefcase, hide: user?.role === 'patient' },
              { id: 'financial', label: 'التعاملات المالية', icon: CreditCard },
            ].filter(t => !t.hide).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-6 px-6 relative flex items-center gap-3 text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'text-psy-gold' : 'text-psy-text/40 hover:text-psy-text'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-psy-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {saveMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center font-bold"
              >
                {saveMessage}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* inputs (7 Columns on large screens) */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[32px] space-y-6 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-4 mb-2">
                          <Sparkles size={16} className="text-psy-gold" />
                          <h3 className="text-sm font-black text-white leading-none">الملف التعريفي والبيانات المعتمدة</h3>
                        </div>

                        {/* Full Name Input */}
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-psy-gold/60 flex items-center gap-1.5 mr-1">
                            <User size={12} />
                            <span>الاسم بالكامل</span>
                          </label>
                          <div className="relative group">
                            <input 
                              type="text" 
                              name="fullName"
                              value={formData.fullName || ''} 
                              onChange={handleChange}
                              className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-sm font-bold text-white focus:border-psy-gold focus:ring-1 focus:ring-psy-gold/20 transition-all outline-none" 
                              placeholder="أدخل اسمك الثلاثي الكامل..."
                            />
                            <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/40 group-focus-within:text-psy-gold transition-colors pointer-events-none" />
                          </div>
                        </div>

                        {/* Specialization Input */}
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-psy-gold/60 flex items-center gap-1.5 mr-1">
                            <Briefcase size={12} />
                            <span>التخصص السريري والبحثي</span>
                          </label>
                          <div className="relative group">
                            <input 
                              type="text" 
                              name="specialization"
                              value={formData.specialization || ''} 
                              onChange={handleChange}
                              className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-sm font-bold text-white focus:border-psy-gold focus:ring-1 focus:ring-psy-gold/20 transition-all outline-none" 
                              placeholder="مثال: معالج سيكومتري، باحث سريري..."
                            />
                            <Briefcase size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/40 group-focus-within:text-psy-gold transition-colors pointer-events-none" />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2.5">
                          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-psy-gold/60 flex items-center gap-1.5 mr-1">
                            <Mail size={12} />
                            <span>البريد الإلكتروني المعتمد</span>
                          </label>
                          <div className="relative group">
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email || ''} 
                              onChange={handleChange}
                              className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-sm font-bold text-white text-left focus:border-psy-gold focus:ring-1 focus:ring-psy-gold/20 transition-all outline-none" 
                              placeholder="name@example.com"
                              dir="ltr"
                            />
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/40 group-focus-within:text-psy-gold transition-colors pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Profile Photo Uploader Card (5 Columns on large screens) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[32px] space-y-6 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-4 mb-2">
                          <ImageIcon size={16} className="text-psy-gold" />
                          <h3 className="text-sm font-black text-white leading-none">الصورة الشخصية والاعتمادية</h3>
                        </div>

                        {/* Interactive drag area */}
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all duration-300 ${
                            isDragging 
                              ? "border-psy-gold bg-psy-gold/10 scale-[0.98]" 
                              : formData.avatarUrl 
                                ? "border-white/10 bg-black/30 hover:border-psy-gold/30" 
                                : "border-white/10 hover:border-psy-gold/30 bg-black/15"
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            onChange={handleFileSelect} 
                            className="hidden" 
                          />

                          {formData.avatarUrl ? (
                            <div className="space-y-4 w-full flex flex-col items-center">
                              {/* Avatar Preview */}
                              <div className="relative group/preview w-24 h-24 rounded-2xl border-2 border-psy-gold/30 p-0.5 overflow-hidden shadow-2xl">
                                <img 
                                  src={formData.avatarUrl} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover rounded-xl" 
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                  <Camera size={18} className="text-white" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-white">تم رفع الصورة المعالجة</p>
                                <p className="text-[10px] text-psy-text/40">اسحب صورة أخرى أو انقر للتغيير</p>
                              </div>
                              {/* Remove image button */}
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage();
                                }}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-150 border border-red-500/15 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all outline-none"
                              >
                                <Trash2 size={12} />
                                <span>إزالة الصورة</span>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 py-4">
                              <div className="w-16 h-16 rounded-2xl bg-psy-gold/5 flex items-center justify-center border border-white/5 mx-auto text-psy-gold group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-black text-white">اسحب وأفلت صورتك هنا</p>
                                <p className="text-[10px] text-psy-text/40">أو اضغط لتصفح الملفات من جهازك</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* File criteria checklist */}
                        <div className="bg-black/25 rounded-2xl p-4 border border-white/5 space-y-2 text-right">
                          <span className="text-[9px] font-black text-psy-gold uppercase tracking-wider block mb-1">شروط ومعايير الصورة:</span>
                          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-psy-text/50">
                            <div className="flex items-center gap-1.5">
                              <Check size={10} className="text-psy-gold shrink-0" />
                              <span>PNG, JPG, WEBP</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check size={10} className="text-psy-gold shrink-0" />
                              <span>الحد الأقصى 4MB</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check size={10} className="text-psy-gold shrink-0" />
                              <span>أبعاد مربعة مثالية</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Check size={10} className="text-psy-gold shrink-0" />
                              <span>أمان وتشفير محمي</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div 
                  key="experience"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-psy-gold/60 mr-2">الخبرة المهنية والنبذة التعريفية</label>
                    <textarea 
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      rows={12}
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-lg leading-relaxed focus:border-psy-gold transition-all outline-none"
                      placeholder="صف مسيرتك العلمية والعملية وخبراتك في هذا الحقل..."
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div 
                  key="financial"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                       <div className="flex items-center gap-3 text-emerald-500 mb-2">
                         <TrendingUp size={24} />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">إجمالي الأرباح</span>
                       </div>
                       <div className="text-4xl font-serif font-black">45,200 <span className="text-sm font-sans opacity-20">د.ج</span></div>
                    </div>
                    <div className="p-8 rounded-[32px] bg-red-400/5 border border-red-400/10 space-y-2">
                       <div className="flex items-center gap-3 text-red-400 mb-2">
                         <TrendingDown size={24} />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">إجمالي المصاريف</span>
                       </div>
                       <div className="text-4xl font-serif font-black">12,800 <span className="text-sm font-sans opacity-20">د.ج</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-psy-gold/60 mb-6">سجل العمليات الأخيرة</h3>
                    {transactions.map(t => (
                      <div key={t.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-psy-gold/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-400/10 text-red-400'}`}>
                            {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                          </div>
                          <div>
                            <div className="font-bold group-hover:text-psy-gold transition-colors">{t.description}</div>
                            <div className="text-[10px] text-psy-text/30 mt-1">{new Date(t.date).toLocaleDateString('ar-SA')}</div>
                          </div>
                        </div>
                        <div className={`text-xl font-serif font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                          {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
