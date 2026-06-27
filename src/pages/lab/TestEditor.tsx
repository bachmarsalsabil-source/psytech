import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTests, 
  saveTest, 
  PsychTest, 
  TestItem, 
  QuestionType,
  TestScale
} from '../../lib/lab';
import { getCurrentUser } from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Settings, 
  Save, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Scale,
  FileText
} from 'lucide-react';

export const TestEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [test, setTest] = useState<PsychTest>({
    id: id || `test-${Math.random().toString(36).substr(2, 9)}`,
    title: '',
    description: '',
    category: 'clinical',
    status: 'draft',
    authorId: user?.id || 'clin-001',
    authorName: user?.fullName || 'عضو غير مسجل',
    instructions: '',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [],
    scales: [],
    targetPopulation: { ageRange: '18-65', gender: 'both', languages: ['ar'], culturalContext: 'العالم العربي' },
    estimatedTime: 10,
    settings: {
      allowBacktracking: true,
      showProgressBar: true,
      randomizeItems: false,
      showResultsImmediately: true,
      requireAllAnswers: true,
      adaptiveTesting: false
    },
    translations: [],
    researchStudies: []
  });

  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'scales' | 'settings'>('info');

  useEffect(() => {
    if (id && id !== 'new-test') {
      const existing = getTests().find(t => t.id === id);
      if (existing) setTest(existing);
    }
  }, [id]);

  const handleSave = () => {
    saveTest({ ...test, updatedAt: new Date().toISOString() });
    navigate('/lab/dashboard');
  };

  const addItem = () => {
    const newItem: any = {
      id: `item-${Date.now()}`,
      testId: test.id,
      questionText: 'نص بند جديد...',
      questionType: QuestionType.LIKERT_5,
      options: [
        { id: '1', label: 'أبداً', value: 0 },
        { id: '2', label: 'نادراً', value: 1 },
        { id: '3', label: 'أحياناً', value: 2 },
        { id: '4', label: 'غالباً', value: 3 },
        { id: '5', label: 'دائماً', value: 4 }
      ],
      isRequired: true,
      orderIndex: test.items.length,
      reverseScored: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTest({ ...test, items: [...test.items, newItem] });
  };

  const removeItem = (itemId: string) => {
    setTest({ ...test, items: test.items.filter(i => i.id !== itemId) });
  };

  const addScale = () => {
    const newScale: any = {
      id: `scale-${Date.now()}`,
      testId: test.id,
      name: 'بُعد جديد',
      description: '',
      itemIds: [],
      scoringMethod: 'sum',
      interpretationRanges: []
    };
    setTest({ ...test, scales: [...test.scales, newScale] });
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">{id === 'new-test' ? 'إنشاء مقياس جديد' : 'تعديل المقياس'}</h1>
          <p className="text-psy-text/40">{test.title || 'بدون عنوان'}</p>
        </div>
        <div className="flex gap-4">
           <GoldButton variant="secondary" onClick={() => navigate('/lab/dashboard')}>إلغاء</GoldButton>
           <GoldButton onClick={handleSave}>
              <Save size={20} /> حفظ التغييرات
           </GoldButton>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Navigation Sidebar */}
        <div className="w-64 space-y-2">
           <NavButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={FileText} label="المعلومات الأساسية" />
           <NavButton active={activeTab === 'items'} onClick={() => setActiveTab('items')} icon={Plus} label="بنود الاختبار" badge={test.items.length} />
           <NavButton active={activeTab === 'scales'} onClick={() => setActiveTab('scales')} icon={Scale} label="الأبعاد والمعايير" />
           <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="إعدادات المقياس" />
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
           {activeTab === 'info' && (
              <GlassCard className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-psy-text/60">عنوان المقياس</label>
                    <input 
                       type="text" 
                       value={test.title}
                       onChange={(e) => setTest({...test, title: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-psy-gold" 
                       placeholder="مثلاً: مقياس القلق الاجتماعي المختصر" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-psy-text/60">وصف المقياس والتعليمات للممتحن</label>
                    <textarea 
                       value={test.description}
                       onChange={(e) => setTest({...test, description: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-psy-gold h-32 resize-none" 
                       placeholder="اشرح الهدف من المقياس وكيفية الإجابة عليه..." 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-psy-text/60">الفئة</label>
                       <select 
                          value={test.category}
                          onChange={(e) => setTest({...test, category: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-psy-gold appearance-none"
                       >
                          <option value="clinical">إكلينيكي</option>
                          <option value="educational">تربوي</option>
                          <option value="organizational">مهني/تنظيمي</option>
                          <option value="personality">شخصية</option>
                          <option value="research">بحثي عام</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-psy-text/60">الإصدار</label>
                       <input 
                          type="text" 
                          value={test.version}
                          onChange={(e) => setTest({...test, version: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-psy-gold" 
                       />
                    </div>
                 </div>
              </GlassCard>
           )}

           {activeTab === 'items' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                    <div>
                       <h3 className="font-bold">بنود المقياس</h3>
                       <p className="text-xs text-psy-text/40">يرجى إضافة البنود وتحديد نوع الاستجابة لكل منها.</p>
                    </div>
                    <GoldButton size="sm" onClick={addItem}>
                       <Plus size={16} /> إضافة بند جديد
                    </GoldButton>
                 </div>

                 <div className="space-y-4">
                    {test.items.map((item, index) => (
                       <GlassCard key={item.id} className="p-6 relative group overflow-visible">
                          <div className="flex gap-6">
                             <div className="flex flex-col items-center gap-2 text-psy-text/20">
                                <span className="font-mono text-xl font-black">{index + 1}</span>
                                <button className="hover:text-psy-gold"><MoveUp size={16} /></button>
                                <button className="hover:text-psy-gold"><MoveDown size={16} /></button>
                             </div>
                             <div className="flex-1 space-y-4">
                                <input 
                                   type="text" 
                                   value={(item?.questionText) || (item as any)?.question || ''}
                                   onChange={(e) => {
                                      const newItems = [...test.items];
                                      (newItems[index] as any).questionText = e.target.value;
                                      setTest({...test, items: newItems});
                                    }}
                                   className="w-full bg-transparent border-b border-white/10 p-2 outline-none focus:border-psy-gold font-bold" 
                                />
                                <div className="grid grid-cols-3 gap-4">
                                   <div className="space-y-1">
                                      <label className="text-[10px] text-psy-text/40 uppercase">نوع الإجابة</label>
                                      <select className="w-full bg-white/5 p-2 rounded-lg text-xs outline-none">
                                         <option value="LIKERT_5">ليكرت خماسي</option>
                                         <option value="YES_NO">نعم/لا</option>
                                         <option value="OPEN">سؤال مفتوح</option>
                                      </select>
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] text-psy-text/40 uppercase">تصحيح عكسي</label>
                                      <div className="flex items-center h-8">
                                         <input type="checkbox" className="accent-psy-gold" />
                                      </div>
                                   </div>
                                   <div className="flex items-end justify-end">
                                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors">
                                         <Trash2 size={18} />
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </GlassCard>
                    ))}
                    {test.items.length === 0 && (
                       <div className="p-20 text-center glass rounded-3xl border-2 border-dashed border-white/5 text-psy-text/20">
                          ابدأ بإضافة أول بند للمقياس
                       </div>
                    )}
                 </div>
              </div>
           )}

           {activeTab === 'scales' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl">
                    <h3 className="font-bold">أبعاد المقياس (Sub-scales)</h3>
                    <GoldButton size="sm" onClick={addScale}><Plus size={16} /> إضافة بُعد</GoldButton>
                 </div>
                 <div className="space-y-6">
                    {test.scales.map((scale, sIdx) => (
                       <GlassCard key={scale.id} className="p-8">
                          <div className="flex justify-between mb-6">
                             <input 
                                type="text" 
                                value={scale.name}
                                onChange={(e) => {
                                   const newScales = [...test.scales];
                                   newScales[sIdx].name = e.target.value;
                                   setTest({...test, scales: newScales});
                                }}
                                className="bg-transparent border-b border-psy-gold/30 p-1 text-lg font-bold outline-none focus:border-psy-gold" 
                             />
                             <button className="text-red-400/50 hover:text-red-400 font-bold text-xs">حذف البعد</button>
                          </div>
                          <div className="space-y-4">
                             <div className="text-[10px] text-psy-text/40 font-bold mb-2 uppercase">البنود المرتبطة بهذا البعد</div>
                             <div className="flex flex-wrap gap-2">
                                {test.items.map(item => (
                                   <button 
                                      key={item.id}
                                      onClick={() => {
                                         const newScales = [...test.scales];
                                         const itemIds = newScales[sIdx].itemIds;
                                         if (itemIds.includes(item.id)) {
                                            newScales[sIdx].itemIds = itemIds.filter(id => id !== item.id);
                                         } else {
                                            newScales[sIdx].itemIds = [...itemIds, item.id];
                                         }
                                         setTest({...test, scales: newScales});
                                      }}
                                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                         scale.itemIds.includes(item.id) 
                                         ? 'bg-psy-gold/20 text-psy-gold border-psy-gold' 
                                         : 'bg-white/5 text-psy-text/30 border-white/10'
                                      }`}
                                   >
                                      بند {test.items.indexOf(item) + 1}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </GlassCard>
                    ))}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label, badge }: any) => (
   <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
         active ? 'bg-psy-gold/10 border-psy-gold/30 text-psy-gold' : 'border-transparent text-psy-text/40 hover:bg-white/5'
      }`}
   >
      <div className="flex items-center gap-3 font-bold text-sm">
         <Icon size={18} />
         {label}
      </div>
      {badge !== undefined && (
         <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-psy-gold text-psy-bg' : 'bg-white/10'}`}>
            {badge}
         </span>
      )}
   </button>
);
