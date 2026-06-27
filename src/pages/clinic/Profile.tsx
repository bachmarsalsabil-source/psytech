import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Camera, 
  Save, 
  Briefcase,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { getCurrentUser, updateUserProfile, ClinicUser } from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<ClinicUser | null>(null);
  const [formData, setFormData] = useState<Partial<ClinicUser>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData(currentUser);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const updated = updateUserProfile(formData);
    if (updated) {
      setUser(updated);
      setSaveMessage('تم حفظ التغييرات بنجاح');
      setTimeout(() => setSaveMessage(''), 3000);
    }
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20 min-w-0">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-0 md:px-4 mobile-page-header">
        <div className="space-y-3 md:space-y-4 min-w-0">
          <BackButton homePath="/clinic/dashboard" />
          <h1 className="text-3xl md:text-6xl font-serif font-black text-psy-text m-0">الملف الشخصي</h1>
          <p className="text-psy-text/40 text-base md:text-xl">إدارة معلوماتك المهنية وهويتك الرقمية</p>
        </div>
        <GoldButton 
          onClick={handleSave} 
          disabled={isSaving}
          className="h-14 md:h-16 px-6 md:px-10 rounded-2xl flex items-center justify-center gap-3 font-black text-base md:text-lg shadow-2xl shadow-psy-gold/20 w-full sm:w-auto"
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Save size={24} />
            </motion.div>
          ) : <Save size={24} />}
          حفظ التعديلات
        </GoldButton>
      </div>

      {saveMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-center font-bold"
        >
          {saveMessage}
        </motion.div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-4 md:grid-cols-12 gap-6 md:gap-10 min-w-0">
        
        {/* Left Side: Avatar & Core Info */}
        <div className="col-span-4 md:col-span-4 space-y-6 md:space-y-10 min-w-0">
          <GlassCard className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] text-center space-y-6 md:space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-psy-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-48 h-48 mx-auto group">
              <div className="w-full h-full rounded-[40px] overflow-hidden border-2 border-psy-gold/20 shadow-2xl group-hover:border-psy-gold transition-colors duration-500">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-psy-gold/10 flex items-center justify-center text-6xl font-serif font-black text-psy-gold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <button className="absolute -bottom-4 -right-4 w-12 h-12 bg-psy-gold text-psy-bg rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                <Camera size={20} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl font-serif font-black m-0">{formData.fullName}</h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-psy-gold/10 text-psy-gold text-[10px] font-black uppercase tracking-widest border border-psy-gold/20">
                {formData.specialization}
              </div>
              <p className="text-psy-text/40 text-sm italic">عضو معتمد منذ 2023</p>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-4 text-psy-text/60 hover:text-psy-gold transition-colors">
                  <Mail size={18} />
                  <span className="text-[15px] font-medium">{formData.email}</span>
               </div>
               <div className="flex items-center gap-4 text-psy-text/60 hover:text-psy-gold transition-colors">
                  <MapPin size={18} />
                  <span className="text-[15px] font-medium">{formData.location || 'الرياض، المملكة العربية السعودية'}</span>
               </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 rounded-[40px] bg-psy-gold/5 border-psy-gold/20">
            <h4 className="m-0 mb-6 flex items-center gap-3">
              <Award className="text-psy-gold" /> الإنجازات المهنية
            </h4>
            <div className="space-y-4">
              {[
                'أكثر من 500 جلسة ناجحة',
                'باحث معتمد في العلاج النفسي الرقمي',
                'مدرب دولي في مهارات التواصل السريري'
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium opacity-80">
                  <div className="w-1.5 h-1.5 rounded-full bg-psy-gold" />
                  {v}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Editable Details */}
        <div className="col-span-4 md:col-span-8 space-y-10">
          <GlassCard className="p-12 rounded-[48px] space-y-12">
            
            {/* Personal Info */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-r-4 border-psy-gold pr-6">
                <h3 className="text-3xl font-serif font-black m-0">المعلومات الأساسية</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">الاسم الكامل</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName || ''} 
                    onChange={handleChange}
                    className="w-full text-lg font-bold" 
                    placeholder="مثال: د. محمد العلي"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">التخصص المهني</label>
                  <input 
                    type="text" 
                    name="specialization"
                    value={formData.specialization || ''} 
                    onChange={handleChange}
                    className="w-full text-lg font-bold" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">البريد الإلكتروني المهني</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email || ''} 
                    onChange={handleChange}
                    className="w-full text-lg font-bold" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">المدينة / الموقع</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location || ''} 
                    onChange={handleChange}
                    className="w-full text-lg font-bold" 
                    placeholder="مثال: الرياض، السعودية"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">رابط الصورة (URL)</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-psy-gold/30" size={18} />
                    <input 
                      type="text" 
                      name="avatarUrl"
                      value={formData.avatarUrl || ''} 
                      onChange={handleChange}
                      className="w-full text-sm font-mono pl-12" 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 border-r-4 border-psy-gold pr-6">
                <h3 className="text-3xl font-serif font-black m-0">الخبرة المهنية</h3>
              </div>
              <div className="space-y-3">
                <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">نبذة عن حياتك المهنية وخبراتك</label>
                <textarea 
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={6}
                  className="w-full text-lg leading-relaxed p-6 bg-white/5 rounded-2xl border border-white/10 focus:border-psy-gold/50 transition-colors"
                  placeholder="اكتب هنا عن مسيرتك العلمية والعملية..."
                />
              </div>
            </section>

             {/* Contact Info Extra */}
             <section className="space-y-8">
              <div className="flex items-center gap-4 border-r-4 border-psy-gold pr-6">
                <h3 className="text-3xl font-serif font-black m-0">معلومات الاتصال</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-gold/30" size={18} />
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full pr-12 text-lg font-bold text-left" 
                      dir="ltr" 
                      placeholder="+966 50 000 0000" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase tracking-widest text-psy-text/40 ml-2">الموقع الإلكتروني / LinkedIn</label>
                  <div className="relative">
                    <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-gold/30" size={18} />
                    <input 
                      type="text" 
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      className="w-full pr-12 text-lg font-bold text-left" 
                      dir="ltr" 
                      placeholder="linkedin.com/in/..." 
                    />
                  </div>
                </div>
              </div>
            </section>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
