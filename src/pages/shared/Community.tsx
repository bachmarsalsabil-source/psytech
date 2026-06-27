import React, { useState, useContext } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  MoreVertical,
  Search,
  Hash,
  Award,
  Globe,
  Send,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Flame,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { AuthContext } from '../../context/AuthContext';
import { Logo } from '../../components/clinic/Logo';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  commentsList: Comment[];
  category: 'all' | 'research' | 'clinicians' | 'students' | 'support';
  isLiked?: boolean;
  tags: string[];
}

interface SurveyProject {
  id: string;
  title: string;
  researcher: string;
  targetCount: number;
  currentCount: number;
  description: string;
  status: 'active' | 'completed';
}

const mockSurveys: SurveyProject[] = [
  {
    id: 's-1',
    title: 'تقنين مقياس القلق السيبراني لدى طلبة الجامعات الجزائرية',
    researcher: 'أ. د. بلقاسم ساسي (جامعة قسنطينة)',
    targetCount: 300,
    currentCount: 242,
    description: 'دراسة سيكومترية تهدف لمعايرة بنود الصدمة الرقمية والضغوط الأكاديمية.',
    status: 'active'
  },
  {
    id: 's-2',
    title: 'أثر الضغط العيادي على دافعية الأخصائيين الممارسين بالجنوب الكبير',
    researcher: 'د. ليلى هلالي (معهد علم النفس)',
    targetCount: 150,
    currentCount: 139,
    description: 'دراسة مسحية لوصف مهددات الاحتراق النفسي المهني لدى ممارسي الصحة العمومية.',
    status: 'active'
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    authorName: 'أ.د. يحيى الرشيد',
    authorRole: 'researcher',
    authorInitials: 'ي ر',
    content: 'الزملاء الباحثين، تم الانتهاء من مواءمة الاستمارة الكلينيكية لتقدير الذات للمراهقين باللغة العربية الفصحى وتبسيطها للبيئة المغاربية. نحتاج لمشاركتكم في تغذية عينات المعايرة وإسقاط التفسير السلوكي لـ Z-Score. رابط الملف متاح في مخبر المنصة.',
    timestamp: 'منذ ساعتين',
    likes: 45,
    commentsCount: 3,
    category: 'research',
    isLiked: false,
    tags: ['#التقنين_السيكومتري', '#المعايرة_العربية', '#أبحاث_2026'],
    commentsList: [
      {
        id: 'c-1',
        authorName: 'أ. جلال حداد',
        authorRole: 'clinician',
        authorInitials: 'ج ح',
        content: 'قمت بالاطلاع على الفقرات ومستواها اللغوي ممتاز ومطابق لخصائص المراهق المحلي.',
        timestamp: 'منذ ساعة'
      },
      {
        id: 'c-2',
        authorName: 'سليمان (طالب ماستر)',
        authorRole: 'student',
        authorInitials: 'س م',
        content: 'هل يمكنني استخدام هذا المقياس في مذكرة التخرج الخاصة بي؟',
        timestamp: 'منذ 45 دقيقة'
      }
    ]
  },
  {
    id: '2',
    authorName: 'د. خالد العمري',
    authorRole: 'clinician',
    authorInitials: 'خ ع',
    content: 'عند علاج حالات نوبات الذعر واضطراب الهلع، نتبع بروتوكولاً مدمجاً بين إزالة الحساسية المنهجية والتعرض التدريجي الافتراضي. أجد أن التغلب على الخوف من فقدان السيطرة هو مفتاح الانعتاق من النوبة. ما هي تجاربكم في دمج الجلسات الرقمية وعيادات الواقع الافتراضي؟',
    timestamp: 'منذ 4 ساعات',
    likes: 38,
    commentsCount: 2,
    category: 'clinicians',
    isLiked: true,
    tags: ['#نوبات_الذعر', '#العلاج_المعرفي_السلوكي', '#عيادة_افتراضية'],
    commentsList: [
      {
        id: 'c-3',
        authorName: 'د. نادية فرحات',
        authorRole: 'clinician',
        authorInitials: 'ن ف',
        content: 'العيادات الرقمية وتتبع المزاج اليومي ساعدت حالتين لدي على تقليص فترات التفادي السلوكي بشكل أسرع.',
        timestamp: 'منذ ساعتين'
      }
    ]
  },
  {
    id: '3',
    authorName: 'أيمن بن ميرة',
    authorRole: 'student',
    authorInitials: 'أ م',
    content: 'طلبة علم النفس المتميزين: ما هي المصادر والمراجع الأكاديمية المقترحة لفهم الفروق الإحصائية المتقدمة وتطبيقات نماذج SPSS للتباين الأحادي ANOVA؟ أواجه صعوبة في مواءمة جداول التجانس لبياناتي الدراسية.',
    timestamp: 'منذ 6 ساعات',
    likes: 19,
    commentsCount: 1,
    category: 'students',
    isLiked: false,
    tags: ['#طلبة_علم_النفس', '#تحليل_إحصائي', '#SPSS_مساعدة'],
    commentsList: [
      {
        id: 'c-4',
        authorName: 'أ.د. يحيى الرشيد',
        authorRole: 'researcher',
        authorInitials: 'ي ر',
        content: 'أنصحك بزيارة قسم "حاسبة SPSS ومساعد التقنين" بمخبر المنصة، حيث يمكنك لصق بياناتك ومعاينة الاتساق مباشرة.',
        timestamp: 'منذ 5 ساعات'
      }
    ]
  },
  {
    id: '4',
    authorName: 'مشارك متعافي (هوية محمية)',
    authorRole: 'patient',
    authorInitials: 'م ع',
    content: 'أود أن أشارك الجميع الأمل: لقد تخطيت أخيراً حالة الاغتراب الاجتماعي الشديد المستمر منذ سنتين بفضل خطة السلوك المدروسة والدعم المنهجي الذي وفره طبيبي بالمنصة. الرحلة تبدأ بجرعة صراحة مع الذات.',
    timestamp: 'منذ يوم',
    likes: 54,
    commentsCount: 4,
    category: 'support',
    isLiked: false,
    tags: ['#قصص_التعافي', '#الأمل_النفسي', '#تضامن_الحالات'],
    commentsList: []
  }
];

const categoryLabels: Record<string, string> = {
  all: 'الكل',
  research: 'أبحاث ودراسات علمية',
  clinicians: 'مقهى الأخصائيين الممارسين',
  students: 'ملتقى الطلبة والباحثين',
  support: 'الدعم الآمن والمجتمعي'
};

const roleLabels: Record<string, string> = {
  clinician: 'أخصائي عيادي رئيسي',
  owner: 'المدير الأكاديمي',
  researcher: 'باحث أكاديمي مرجعي',
  patient: 'عضو / مستفيد',
  student: 'طالب علم النفس'
};

const roleColors: Record<string, string> = {
  clinician: 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20',
  owner: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  researcher: 'text-purple-400 bg-purple-500/10 border border-purple-500/20',
  patient: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
  student: 'text-blue-400 bg-blue-500/10 border border-blue-500/10'
};

export const Community: React.FC = () => {
  const { user } = useContext(AuthContext);
  
  // State
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [surveys, setSurveys] = useState<SurveyProject[]>(mockSurveys);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'research' | 'clinicians' | 'students' | 'support'>('all');
  
  // Creating Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'research' | 'clinicians' | 'students' | 'support'>('students');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [customTags, setCustomTags] = useState('');

  // Active commenting post state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !user) return;

    let authorName = user.fullName || user.email;
    let authorInitials = (user.fullName || 'أ م').split(' ').map(n => n[0]).join('');
    let authorRole = user.role;

    if (isAnonymous) {
      authorName = 'عضو مجهول (هوية محمية)';
      authorInitials = 'ع م';
      authorRole = 'patient';
    }

    // Process tag seeds
    const parsedTags = customTags.trim() 
      ? customTags.split(/[\s,，]+/).map(t => t.startsWith('#') ? t : `#${t}`) 
      : ['#مجتمع_سيكولوجي'];

    const newPost: Post = {
      id: Date.now().toString(),
      authorName,
      authorRole,
      authorInitials,
      content: newPostContent,
      timestamp: 'الآن',
      likes: 0,
      commentsCount: 0,
      commentsList: [],
      category: postCategory,
      isLiked: false,
      tags: parsedTags
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setCustomTags('');
    setIsAnonymous(false);
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  // Submit Comments in Local State
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim() || !user) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const freshComment: Comment = {
          id: Date.now().toString(),
          authorName: user.fullName || user.email,
          authorRole: user.role,
          authorInitials: (user.fullName || 'أ م').split(' ').map(n => n[0]).join(''),
          content: newCommentText,
          timestamp: 'الآن'
        };
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          commentsList: [...post.commentsList, freshComment]
        };
      }
      return post;
    }));

    setNewCommentText('');
  };

  // Participate in surveys (استطلاع العينة)
  const handleParticipateSurvey = (surveyId: string) => {
    setSurveys(prev => prev.map(s => {
      if (s.id === surveyId && s.currentCount < s.targetCount) {
        return {
          ...s,
          currentCount: s.currentCount + 1
        };
      }
      return s;
    }));
  };

  // Filter Posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-750" dir="rtl">
      
      {/* Premium Hero Banner (Luxury Scientific Psychology style matching AGENTS.md) */}
      <div className="relative min-h-[14rem] sm:h-72 rounded-[40px] overflow-hidden mb-10 border border-psy-gold/20 shadow-[0_20px_50px_rgba(212,175,55,0.08)] p-6 sm:p-10 flex flex-col justify-end">
        {/* Abstract golden neural networking visual background to reflect modern scholarly design */}
        <div className="absolute inset-0 bg-[#0e0e0d]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          {/* Scientific background glowing orbs */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-psy-gold/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-5 left-10 w-72 h-72 bg-psy-gold/5 rounded-full blur-3xl opacity-40" />
          
          <div className="absolute inset-0 flex justify-center items-center opacity-15">
            <svg width="100%" height="100%" className="text-psy-gold" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-20 space-y-3 text-right">
          <BackButton />
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              المجتمع <span className="text-psy-gold">الأكاديمي & السريري</span>
            </h1>
            <Sparkles className="text-psy-gold animate-pulse hidden sm:block" size={28} />
          </div>
          <p className="text-psy-text/60 max-w-2xl font-medium text-xs sm:text-base leading-relaxed">
            منبر تفاعلي راقٍ مشيد لتبادل الخبرات القياسية، وتنسيق الأبحاث، وتضامن الحالات بشكل آمن ومعمّق لتغطية احتياجات الوسط العشبي والجامعي.
          </p>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Right Sidebar - Navigation & Quick Filters */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Smart Search Card */}
          <GlassCard className="p-5 border-white/5">
            <label className="text-[10px] font-black text-psy-gold uppercase tracking-wider block mb-2 text-right">البحث السريع بالمجتمع:</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="ابحث عن باحث، تخصص، أو تاق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111110] border border-white/15 h-11 px-4 pr-10 rounded-xl text-xs font-semibold text-psy-text outline-none focus:border-psy-gold transition-all"
              />
              <Search className="absolute right-3.5 top-3.5 text-psy-text/30" size={14} />
            </div>
          </GlassCard>

          {/* Core Categories Selector */}
          <GlassCard className="p-6 border-white/5">
            <h3 className="font-black text-xs text-psy-gold mb-4 flex items-center gap-1.5 justify-start text-right">
              <Filter size={14} />
              <span>تصنيف مساحات النقاش</span>
            </h3>
            <div className="space-y-1">
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map(catKey => (
                <button 
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`w-full text-right px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${selectedCategory === catKey ? 'bg-psy-gold text-psy-bg font-extrabold shadow-lg shadow-psy-gold/5' : 'text-psy-text/50 hover:text-white hover:bg-white/5'}`}
                >
                  <span>{categoryLabels[catKey]}</span>
                  {selectedCategory === catKey && <CheckCircle size={12} className="text-psy-bg" />}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Scientific Trending Topics */}
          <GlassCard className="p-6 border-white/5 hidden md:block">
            <h3 className="font-black text-xs text-psy-gold mb-4 flex items-center gap-1.5 justify-start text-right">
              <Flame size={14} />
              <span>مواضيع علمية شائعة</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {['#التقنين_السيكومتري', '#الذكاء_الاصطناعي_النفسي', '#مقياس_ليكرت_الجزائري', '#إرشاد_الأزمات', '#العلاج_المعرفي', '#مذكرة_التخرج'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1.5 bg-white/5 border border-white/10 hover:border-psy-gold rounded-lg text-[10px] font-bold text-psy-text/60 hover:text-psy-gold transition-all text-right cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Central Feed - Posts & Live Interactions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Panel */}
          {user ? (
            <GlassCard className="p-6 space-y-5 border-psy-gold/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-psy-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center text-xs font-black text-psy-gold shrink-0">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'أ م'}
                </div>
                
                <div className="flex-1 space-y-3">
                  <textarea 
                    placeholder={`اكتب سؤالاً، شارك فكرة بحثية، أو مساهمة، يا دكتور ${user?.fullName?.split(' ')[0]}...`}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-[#111110]/50 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-psy-gold h-28 resize-none transition-all placeholder:text-psy-text/30 focus:bg-black text-psy-text leading-relaxed"
                  />

                  {/* Optional Tags input & Preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-psy-text/40 block">الوسوم والـ Tags (مفصولة بمسافة):</label>
                      <input 
                        type="text"
                        placeholder="مثال: #SPSS #أبحاث #صدمة"
                        value={customTags}
                        onChange={(e) => setCustomTags(e.target.value)}
                        className="w-full bg-[#111110] border border-white/10 rounded-xl px-3 py-2 text-[11px] text-psy-gold outline-none focus:border-psy-gold placeholder:text-psy-text/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-psy-text/40 block">المساحة أو المنبر المستهدف:</label>
                      <select 
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value as any)}
                        className="w-full bg-[#111110] border border-white/10 rounded-xl px-2 py-2 text-[11px] text-psy-text outline-none cursor-pointer focus:border-psy-gold font-bold"
                      >
                        <option value="research">أبحاث ودراسات علمية</option>
                        <option value="clinicians">مقهى الأخصائيين الممارسين</option>
                        <option value="students">ملتقى الطلبة والبحث العلمي</option>
                        <option value="support">مساحة الدعم والتعافي الآمن</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between pl-1">
                {/* Anonymous switch for patients safety */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded-lg bg-[#111110] border border-white/10 text-psy-gold focus:ring-0 checked:bg-psy-gold cursor-pointer"
                  />
                  <span className="text-[10px] font-black text-psy-text/50">النشر المجهول لحماية الخصوصية (Incognito)</span>
                </label>

                <GoldButton 
                  onClick={handleCreatePost} 
                  disabled={!newPostContent.trim()}
                  className="h-9 px-5 text-[10px] font-black"
                >
                  <Send size={12} className="ml-1" /> نشر المقال
                </GoldButton>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-6 text-center text-psy-text/40 border border-white/5">
              <p className="text-xs font-black">الرجاء تسجيل الدخول لتتمكن من النشر والمساهمة في الوسط الأكاديمي.</p>
            </GlassCard>
          )}

          {/* Interactive Feed Stream */}
          <div className="space-y-5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <GlassCard key={post.id} className="p-6 space-y-4 border-white/10 hover:border-psy-gold/30 transition-all shadow-md relative group">
                  
                  {/* Top card header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${roleColors[post.authorRole] || 'bg-white/5'}`}>
                        {post.authorInitials}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white group-hover:text-psy-gold transition-colors">{post.authorName}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight ${roleColors[post.authorRole] || 'bg-white/5'}`}>
                            {roleLabels[post.authorRole] || 'عضو مجتمعي'}
                          </span>
                        </div>
                        <p className="text-[10px] text-psy-text/40 mt-1 font-bold">
                          {post.timestamp} • {categoryLabels[post.category]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm leading-relaxed text-psy-text/90 text-justify font-normal pr-1 bg-gradient-to-l from-white/[0.01] p-3 rounded-xl border-r-2 border-psy-gold/20">
                    {post.content}
                  </p>

                  {/* Render Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1 pr-1">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-psy-gold bg-psy-gold/5 px-2 py-0.5 rounded border border-psy-gold/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Foot Actions Panel */}
                  <div className="pt-4 border-t border-white/5 flex items-center gap-6 sm:gap-8 justify-between pl-1">
                    <div className="flex gap-4">
                      {/* Like Action */}
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${post.isLiked ? 'text-red-400 font-extrabold' : 'text-psy-text/40 hover:text-red-400'}`}
                      >
                        <Heart size={14} fill={post.isLiked ? "currentColor" : "none"} className="transition-transform active:scale-125" /> 
                        <span className="font-mono tabular-nums">{post.likes}</span>
                      </button>

                      {/* Comments Action Trigger */}
                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className={`flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${activeCommentPostId === post.id ? 'text-psy-gold' : 'text-psy-text/40 hover:text-psy-gold'}`}
                      >
                        <MessageCircle size={14} /> 
                        <span className="font-mono tabular-nums">{post.commentsCount}</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(post.content);
                        alert("تم نسخ محتوى المنشور للحافظة للمشاركة الخارجية!");
                      }} 
                      className="flex items-center gap-1 text-[10px] font-bold text-psy-text/30 hover:text-white transition-all cursor-pointer"
                    >
                      <Share2 size={12} />
                      <span>مشاركة ونقل</span>
                    </button>
                  </div>

                  {/* Dynamic Accordion Comments Section */}
                  <AnimatePresence>
                    {activeCommentPostId === post.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-black/35 rounded-2xl p-4 mt-3 border border-white/5 space-y-4 text-right"
                      >
                        <h5 className="text-[10px] font-black text-psy-gold uppercase tracking-wider block border-b border-white/5 pb-2">سجل الردود والمساندة العلمية:</h5>
                        
                        {/* Comments Stream */}
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                          {post.commentsList.length > 0 ? (
                            post.commentsList.map(comment => (
                              <div key={comment.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5 text-right">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-psy-gold/10 text-psy-gold flex items-center justify-center text-[10px] font-black">
                                      {comment.authorInitials}
                                    </span>
                                    <span className="text-[11px] font-extrabold text-white">{comment.authorName}</span>
                                    <span className="text-[8px] text-psy-text/40">({roleLabels[comment.authorRole] || 'طالب'})</span>
                                  </div>
                                  <span className="text-[9px] text-psy-text/30 font-mono">{comment.timestamp}</span>
                                </div>
                                <p className="text-xs text-psy-text/80 leading-relaxed pr-1">{comment.content}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-psy-text/30 py-4 text-center font-bold">لا توجد ردود بعد. كن أول من يضيف رأياً علمياً أو كلمة مساندة!</p>
                          )}
                        </div>

                        {/* Leave a Comment form */}
                        {user ? (
                          <div className="flex gap-2.5 pt-2 border-t border-white/5">
                            <input 
                              type="text"
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="اكتب ردك أو نصيحتك السلوكية هنا..."
                              className="flex-grow bg-[#111110] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-psy-gold"
                            />
                            <button 
                              onClick={() => handleAddComment(post.id)}
                              className="bg-psy-gold hover:bg-psy-gold/95 text-psy-bg px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center transition-all cursor-pointer shrink-0"
                            >
                              رد
                            </button>
                          </div>
                        ) : (
                          <p className="text-[9px] text-psy-text/30 text-center font-bold">يرجى تسجيل الدخول للرد.</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </GlassCard>
              ))
            ) : (
              <div className="p-16 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                <Users size={48} className="mx-auto text-psy-text/10 mb-3 animate-pulse" />
                <p className="text-xs font-bold text-psy-text/30 leading-relaxed">لم نجد أي منشورات توافق معايير البحث الحالية.</p>
              </div>
            )}
          </div>

        </div>

        {/* Left Sidebar - Studies sample recruitment & Collaboration Hub */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Research Sample Call Card (عيّنة الدراسات والأبحاث الجارية) */}
          <GlassCard className="p-6 border-white/5 relative overflow-hidden bg-gradient-to-tr from-psy-gold/[0.02] to-transparent">
            <h3 className="font-extrabold text-xs text-psy-gold mb-3 flex items-center justify-start gap-1.5 border-b border-white/5 pb-2 text-right">
              <Award size={15} />
              <span>طلب عينات استبيان الأبحاث</span>
            </h3>
            <p className="text-[10px] text-psy-text/40 leading-relaxed font-bold mb-4 text-right">
              هل أنت طالب أو أكاديمي وتريد تجميع عينات المبحوثين لمذكرة التخرج؟ انقر على أي مشروع للمشاركة وسجل الدعم!
            </p>

            <div className="space-y-4 select-none">
              {surveys.map(survey => {
                const progress = (survey.currentCount / survey.targetCount) * 100;
                return (
                  <div key={survey.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2.5 text-right">
                    <div className="space-y-1">
                      <span className="text-[8px] text-psy-gold font-black uppercase tracking-wider block">{survey.researcher}</span>
                      <h4 className="text-[11px] font-extrabold text-white leading-normal">{survey.title}</h4>
                    </div>

                    <p className="text-[9px] text-psy-text/40 leading-normal">{survey.description}</p>

                    {/* Simple Progress bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-psy-gold shadow-[0_0_8px_#d4af37]" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[8px] font-bold text-psy-text/45 font-mono">
                        <span>الرتبة: {progress.toFixed(0)}% مكتمل</span>
                        <span>{survey.currentCount} / {survey.targetCount} عينة</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button 
                      onClick={() => handleParticipateSurvey(survey.id)}
                      disabled={survey.currentCount >= survey.targetCount}
                      className="w-full h-8 bg-psy-gold/10 hover:bg-psy-gold text-psy-gold hover:text-psy-bg border border-psy-gold/20 text-[9px] font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <UserPlus size={10} />
                      <span>{survey.currentCount >= survey.targetCount ? 'اكتملت العينة المطلوبة' : 'سجل استجابتك كـ عينة'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Academic Honor Cards */}
          <GlassCard className="p-6 border-white/5 bg-gradient-to-l from-psy-gold/[0.04] to-transparent">
            <h4 className="font-black text-xs text-white mb-2 flex items-center gap-1.5 justify-start text-right">
              <Award size={14} className="text-psy-gold" />
              <span>مساهمون النشر الأكاديمي</span>
            </h4>
            <p className="text-[10px] text-psy-text/40 leading-relaxed font-bold mb-4 text-justify">
              تُعطى الأوسمة المذهبة للعلماء والأطباء الذين أجابوا عن تساؤلات الطلبة بالمرجعية والضبط السيكومتري لخدمة البحث العلمي.
            </p>

            <div className="space-y-3">
              {[
                { name: 'أ. د. يحيى الرشيد', score: '89 مساهمة بحثية', badge: 'دكتور مرجعي' },
                { name: 'د. خالد العمري', score: '56 رأي عيادي محكم', badge: 'أخصائي متميز' },
                { name: 'د. نادية فرحات', score: '34 خطوة علاجية مساندة', badge: 'داعم رائد' }
              ].map((rec, i) => (
                <div key={i} className="flex items-center gap-2.5 text-right p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-psy-gold/10 text-psy-gold font-mono font-black flex items-center justify-center text-[10px]">
                     # {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-extrabold text-white truncate">{rec.name}</div>
                    <div className="text-[8px] text-psy-text/40">{rec.score}</div>
                  </div>
                  <span className="text-[8px] bg-psy-gold/20 text-psy-gold border border-psy-gold/20 px-1.5 py-0.5 rounded font-black shrink-0">
                    {rec.badge}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Guidelines Footer logo */}
          <div className="p-6 text-center space-y-3 opacity-30 select-none">
            <Logo size={28} className="mx-auto" />
            <div className="text-[8.5px] font-mono tracking-widest text-psy-text uppercase">PsyTech Platform Academic Hub • 2026</div>
          </div>

        </div>

      </div>

    </div>
  );
};
