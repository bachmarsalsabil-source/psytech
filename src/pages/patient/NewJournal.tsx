import React, { useState } from 'react';
import { 
  PenTool, 
  Type, 
  Volume2, 
  Image as ImageIcon, 
  Share2, 
  Star,
  CheckCircle,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getCases, saveJournal, JournalEntry } from '../../lib/clinic';
import { BackButton } from '../../components/clinic/BackButton';
import { GoldButton } from '../../components/clinic/GoldButton';
import { GlassCard } from '../../components/clinic/GlassCard';
import { DrawingCanvas } from '../../components/clinic/DrawingCanvas';
import { AudioRecorder } from '../../components/clinic/AudioRecorder';
import { ImageUploader } from '../../components/clinic/ImageUploader';
import { useFeedback } from '../../components/clinic/FeedbackToast';

export const NewJournalEntry: React.FC = () => {
  const navigate = useNavigate();
  const { showFeedback } = useFeedback();
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [isShared, setIsShared] = useState(true);
  const [activeTab, setActiveTab] = useState<'text' | 'drawing' | 'audio' | 'images'>('text');
  
  // Extra data
  const [drawingData, setDrawingData] = useState<string | undefined>();
  const [audioData, setAudioData] = useState<string | undefined>();
  const [imageAttachments, setImageAttachments] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      caseId: patientCase?.id || '',
      title,
      content,
      entryType: activeTab,
      moodRating,
      isSharedWithClinician: isShared,
      drawingData,
      audioData,
      imageAttachments,
      createdAt: new Date().toISOString()
    };

    saveJournal(newEntry);
    showFeedback(
      'تم حفظ تدوينتك بنجاح',
      `تم إدراج التدوينة اليومية "${title}" في سجل المتابعة الذاتي المشفر بنجاح ونقله إلى المعالج.`,
      'success'
    );
    navigate('/patient/journal');
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const tabs = [
    { id: 'text', label: 'كتابة نصية', icon: Type },
    { id: 'drawing', label: 'تعبير بالرسم', icon: PenTool },
    { id: 'audio', label: 'تسجيل صوتي', icon: Volume2 },
    { id: 'images', label: 'إرفاق صور', icon: ImageIcon },
  ];

  return (
    <div className="space-y-10 pb-32">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">إضافة يومية جديدة</h1>
          <p className="text-psy-text/40">عبر عما يجول في خاطرك بأي وسيلة تفضلها</p>
        </div>
        <GoldButton size="lg" onClick={handleSave} disabled={!title.trim()}>
           حفظ اليومية
        </GoldButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <GlassCard className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-psy-text/40">عنوان اليومية</label>
                 <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: كيف شعرت اليوم؟"
                    className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl p-5 text-xl font-bold outline-none focus:border-[#D4B483] transition-all"
                 />
              </div>

              <div className="space-y-4">
                 <div className="flex overflow-x-auto bg-white/5 p-1 rounded-2xl border border-white/5 no-scrollbar">
                    {tabs.map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                          ${activeTab === tab.id ? 'bg-[#D4B483] text-[#181816]' : 'text-psy-text/40 hover:text-psy-text hover:bg-white/5'}
                        `}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                 </div>

                 <div className="min-h-[400px]">
                    {activeTab === 'text' && (
                       <textarea 
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="اكتب أفكارك ومشاعرك هنا بكل حرية..."
                          className="w-full bg-transparent border-none p-4 text-lg leading-relaxed outline-none resize-none h-[400px]"
                       />
                    )}
                    {activeTab === 'drawing' && <DrawingCanvas 
                        onSave={setDrawingData} 
                        journalContent={content}
                        setJournalContent={setContent}
                     />}
                    {activeTab === 'audio' && <AudioRecorder onSave={setAudioData} />}
                    {activeTab === 'images' && <ImageUploader onImagesChange={setImageAttachments} />}
                 </div>
              </div>
           </GlassCard>
        </div>

        <div className="space-y-8">
           <GlassCard className="p-8 space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">كيف تقيّم مزاجك؟</h4>
                    <span className="text-xl font-black text-psy-gold">{moodRating}</span>
                 </div>
                 <input 
                    type="range" min="1" max="10" value={moodRating}
                    onChange={(e) => setMoodRating(parseInt(e.target.value))}
                    className="w-full accent-psy-gold"
                 />
                 <div className="flex justify-between text-[10px] text-psy-text/40 font-bold uppercase tracking-wider">
                    <span>سيء جداً</span>
                    <span>ممتاز</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="font-bold text-sm flex items-center gap-2">
                   <Hash size={16} className="text-psy-gold" /> الوسوم (Tags)
                 </h4>
                 <div className="flex gap-2">
                    <input 
                       value={tagInput}
                       onChange={(e) => setTagInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && addTag()}
                       className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-psy-gold"
                       placeholder="مثال: قلق، إنجاز..."
                    />
                    <GoldButton size="sm" variant="secondary" onClick={addTag}>إضافة</GoldButton>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 text-psy-text/60 rounded-lg text-[10px] font-bold border border-white/10">
                        {t}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isShared ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-psy-text/40'}`}>
                      <Share2 size={16} />
                    </div>
                    <div>
                       <div className="text-xs font-bold">مشاركة مع المعالج</div>
                       <div className="text-[9px] text-psy-text/40">سيتمكن المعالج من رؤية التدوينة</div>
                    </div>
                 </div>
                 <button 
                    onClick={() => setIsShared(!isShared)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isShared ? 'bg-emerald-500' : 'bg-white/10'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isShared ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border-emerald-500/20 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                 <CheckCircle size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-bold mb-1">تدوين آمن</h4>
                 <p className="text-[10px] text-psy-text/40 leading-relaxed">جميع يومياتك مشفرة ولا يمكن لأحد سواك (والمعالج إذا اخترت ذلك) رؤيتها.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
