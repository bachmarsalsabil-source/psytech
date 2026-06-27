import React, { useState } from 'react';
import { TemplateCard } from '../../components/lab/TemplateCard';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { Search, Filter } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const templates = [
    { name: 'مقياس ليكرت الخماسي الأساسي', description: 'قالب جاهز بـ 20 بنداً لقياس الاتجاهات النفسية.', category: 'عام', itemCount: 20, duration: '10 دقائق' },
    { name: 'اختبار الشخصية السريع', description: 'نموذج مبسط لقياس السمات الخمس الكبرى.', category: 'شخصية', itemCount: 15, duration: '8 دقائق' },
    { name: 'استبيان الصحة النفسية', description: 'أداة مسحية شاملة للاضطرابات الشائعة.', category: 'إكلينيكي', itemCount: 45, duration: '20 دقيقة' },
    { name: 'مقياس القلق والاكتئاب (HADS)', description: 'أداة قياس للحالات الانفعالية في السياقات الطبية والعامة.', category: 'إكلينيكي', itemCount: 14, duration: '5 دقائق' },
    { name: 'مقياس الرضا الوظيفي', description: 'أداة للباحثين في علم النفس التنظيمي والصناعي.', category: 'تنظيمي', itemCount: 25, duration: '12 دقيقة' },
  ];

  const categories = ['الكل', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-2">
              <h1 className="text-3xl font-black">قوالب المختبر الرقمي</h1>
              <p className="text-psy-text/40 font-medium">ابدأ من حيث انتهى الآخرون. قوالب علمية جاهزة للتعديل والنشر الفوري.</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في القوالب الجاهزة..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 pr-12 outline-none focus:border-psy-gold transition-all"
              />
           </div>
           <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-psy-gold text-psy-bg' : 'text-psy-text/40 hover:text-psy-text'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredTemplates.map(tmp => <TemplateCard key={tmp.name} {...tmp} />)}
           {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-[40px] space-y-4">
                 <p className="text-psy-text/20 italic">لا توجد قوالب تطابق بحثك حالياً</p>
                 <button className="text-psy-gold font-bold hover:underline" onClick={() => { setSearchTerm(''); setSelectedCategory('الكل'); }}>عرض كل القوالب</button>
              </div>
           )}
        </div>
      </div>
    </>
  );
};
