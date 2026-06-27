import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Brain, Shield, Stethoscope, FlaskConical, BookOpen, Users,
  ArrowLeft, ChevronDown, Play, Pause, Volume2, VolumeX,
  Sparkles, Heart, Award, GraduationCap, Building2,
  MessageSquare, Activity, Star, Search, Info
} from 'lucide-react';
import { Logo } from '../components/clinic/Logo';

// ─── Theme detection ───────────────────────────────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('light-mode')
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsLight(document.body.classList.contains('light-mode'))
    );
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isLight;
}

// ─── Color palette constants ───────────────────────────────────────────────
const DARK = {
  bg:        '#030712', // Deep space black
  surface:   '#0d0c15',
  surface2:  '#131221',
  text:      '#F0E6D3',
  textDim:   'rgba(240,230,211,0.6)',
  gold:      '#D4AF37',
  goldDim:   'rgba(212,175,55,0.22)',
  goldGlow:  'rgba(212,175,55,0.18)',
  border:    'rgba(212,175,55,0.14)',
  card:      'rgba(13,12,21,0.75)',
};

const LIGHT = {
  bg:        '#fdfaf7', // Warm sandy ivory
  surface:   '#ffffff',
  surface2:  '#f5efe4',
  text:      '#000000',
  textDim:   'rgba(0,0,0,0.65)',
  gold:      '#8A6000',
  goldDim:   'rgba(138,96,0,0.15)',
  goldGlow:  'rgba(138,96,0,0.1)',
  border:    'rgba(138,96,0,0.18)',
  card:      'rgba(255,255,255,0.85)',
};

// ─── Interactive Particles Canvas ──────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rgb: string;
  twinkleSpeed: number;
  phase: number;
}

const ParticlesCanvas: React.FC<{ isLight: boolean }> = React.memo(({ isLight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = isMobile ? 35 : 60;

    const setSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      initParticles();
    };

    const colors = isLight
      ? [
          '138, 96, 0',    // Gold/Bronze
          '196, 149, 106',  // Copper
          '91, 33, 182',   // Violet
          '20, 184, 166'    // Teal
        ]
      : [
          '212, 175, 55',   // Bright Gold
          '196, 149, 106',  // Copper
          '124, 58, 237',  // Violet
          '20, 184, 166'    // Teal
        ];

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(Math.random() * 0.35 + 0.1),
          size: Math.random() * 2.5 + 0.8,
          rgb: colors[i % colors.length],
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    setSize();
    window.addEventListener('resize', setSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) * window.devicePixelRatio;
      mouse.current.y = (e.clientY - rect.top) * window.devicePixelRatio;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      time += 0.5;

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const alpha = (Math.sin(time * p.twinkleSpeed + p.phase) * 0.35 + 0.65) * (isLight ? 0.45 : 0.8);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb}, ${alpha})`;
        
        if (!isLight) {
          ctx.shadowColor = `rgba(${p.rgb}, ${alpha})`;
          ctx.shadowBlur = p.size * 3;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            const twinkle1 = Math.sin(time * particles[i].twinkleSpeed + particles[i].phase) * 0.35 + 0.65;
            const twinkle2 = Math.sin(time * particles[j].twinkleSpeed + particles[j].phase) * 0.35 + 0.65;
            const avgTwinkle = (twinkle1 + twinkle2) / 2;
            
            const alpha = (1 - dist / 150) * (isLight ? 0.12 : 0.22) * avgTwinkle;
            ctx.strokeStyle = `rgba(${particles[i].rgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLight]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
});

// ─── Glassmorphism Container with Dynamic Styles ───────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  isLight: boolean;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', isLight, glowColor, style }) => {
  const c = isLight ? LIGHT : DARK;
  const glow = glowColor 
    ? { boxShadow: isLight ? `0 8px 30px ${glowColor}15` : `0 12px 40px ${glowColor}25` }
    : {};

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-500 border ${className}`}
      style={{
        background: isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(13, 12, 21, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: isLight ? 'rgba(138, 96, 0, 0.18)' : 'rgba(212, 175, 55, 0.15)',
        ...glow,
        ...style
      }}
    >
      {/* Inner glow shine */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background: isLight
            ? 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ─── Section title chip ─────────────────────────────────────────────────────
const Chip: React.FC<{ label: string; isLight: boolean }> = ({ label, isLight }) => {
  const c = isLight ? LIGHT : DARK;
  return (
    <div
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
      style={{
        background: isLight ? 'rgba(138,96,0,0.08)' : 'rgba(212,175,55,0.08)',
        border: `1.5px solid ${c.border}`,
      }}
    >
      <Sparkles size={13} style={{ color: c.gold }} className="animate-pulse" />
      <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: c.gold }}>
        {label}
      </span>
    </div>
  );
};



// ─── Asymmetrical Portals drift offset definitions ────────────────────────
const driftVectors = [
  // If Portal 0 is hovered (Top Left):
  [
    { dx: 0, dy: -25 },  // Card 0 (hovered)
    { dx: 30, dy: -5 },  // Card 1
    { dx: -15, dy: 30 }, // Card 2
    { dx: 25, dy: 25 }   // Card 3
  ],
  // If Portal 1 is hovered (Top Right):
  [
    { dx: -30, dy: -5 }, // Card 0
    { dx: 0, dy: -25 },  // Card 1 (hovered)
    { dx: -25, dy: 25 }, // Card 2
    { dx: 15, dy: 30 }   // Card 3
  ],
  // If Portal 2 is hovered (Bottom Left):
  [
    { dx: -15, dy: -30 }, // Card 0
    { dx: 25, dy: -25 },  // Card 1
    { dx: 0, dy: -25 },   // Card 2 (hovered)
    { dx: 30, dy: 10 }    // Card 3
  ],
  // If Portal 3 is hovered (Bottom Right):
  [
    { dx: -25, dy: -25 }, // Card 0
    { dx: 15, dy: -30 },  // Card 1
    { dx: -30, dy: 10 },  // Card 2
    { dx: 0, dy: -25 }    // Card 3 (hovered)
  ]
];

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export const LandingPage: React.FC = () => {
  const isLight = useTheme();
  const c = isLight ? LIGHT : DARK;
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'clinician' || user.role === 'owner') return '/clinic/dashboard';
    if (user.role === 'researcher') return '/lab/dashboard';
    if (user.role === 'patient') return '/patient/dashboard';
    return '/dashboard';
  };
  const dashboardPath = getDashboardPath();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);

  const searchCategories = {
    patients: {
      title: 'الحالات والتعافي',
      color: '#14b8a6',
      items: [
        { text: 'مقياس القلق العام (GAD-7) - تقييم فوري للتوتر', badge: 'فحص ذاتي', link: user ? (user.role === 'patient' ? '/patient/tasks' : '/clinic/dashboard') : '/auth' },
        { text: 'مقياس الاكتئاب (PHQ-9) - فحص وتتبع المزاج الشخصي', badge: 'فحص ذاتي', link: user ? (user.role === 'patient' ? '/patient/tasks' : '/clinic/dashboard') : '/auth' },
        { text: 'جلسات اليقظة الذهنية والتنفس الموجه للتعافي', badge: 'تمارين', link: user ? (user.role === 'patient' ? '/patient/dashboard' : '/clinic/dashboard') : '/auth' },
        { text: 'دليل البحث عن أخصائي نفسي مرخص وملائم لحالتك', badge: 'دليل عيادات', link: user ? (user.role === 'patient' ? '/patient/appointments' : '/clinic/dashboard') : '/auth' }
      ]
    },
    specialists: {
      title: 'الأخصائيون والمعالجون',
      color: '#6366f1',
      items: [
        { text: 'دليل التشخيص الإحصائي للاضطرابات النفسية (DSM-5)', badge: 'مرجع سريري', link: '/library' },
        { text: 'لوحة إدارة الجلسات السريرية والملفات الطبية الآمنة', badge: 'لوحة التحكم', link: user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/dashboard' : '/dashboard') : '/auth' },
        { text: 'أداة التحليل الذكي للخطط العلاجية وتتبع تطور الحالة', badge: 'أداة سريرية', link: user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/plans' : '/dashboard') : '/auth' },
        { text: 'قنوات التواصل المشفرة بالفيديو والتقارير الطبية', badge: 'تواصل آمن', link: user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/messages' : '/dashboard') : '/auth' }
      ]
    },
    researchers: {
      title: 'الباحثون والأكاديميون',
      color: '#a855f7',
      items: [
        // { text: 'منشئ الاستبيانات السيكومترية المتقدمة والمقاييس', badge: 'أداة بناء', link: user ? (user.role === 'researcher' ? '/lab/builder' : ((user.role === 'clinician' || user.role === 'owner') ? '/lab/dashboard' : '/dashboard')) : '/auth' },
        { text: 'محرك التحليل التلوي (Meta-Analysis) لتجميع نتائج الدراسات', badge: 'تحليلات', link: user ? (user.role === 'researcher' ? '/lab/analysis' : ((user.role === 'clinician' || user.role === 'owner') ? '/lab/dashboard' : '/dashboard')) : '/auth' },
        { text: 'أداة حساب الصدق والثبات ومعامل ألفا كرونباخ إلكترونياً', badge: 'إحصاء سيكومتري', link: user ? (user.role === 'researcher' ? '/lab/analysis' : ((user.role === 'clinician' || user.role === 'owner') ? '/lab/dashboard' : '/dashboard')) : '/auth' },
        { text: 'دراسة سيكومترية: أثر الدعم النفسي الرقمي في العالم العربي', badge: 'ورقة بحثية', link: '/library' }
      ]
    },
    students: {
      title: 'الطلاب والمتعلمون',
      color: '#f59e0b',
      items: [
        { text: 'محاضرة مرئية: مقدمة في علم النفس العصبي والتشابكات', badge: 'محاضرة', link: '/academy' },
        { text: 'أرشيف دراسات الحالة السريرية الموثقة للأغراض التعليمية', badge: 'دراسة حالة', link: '/library' },
        { text: 'كتاب مصادر علم النفس السلوكي المعتمد للمناهج العربية', badge: 'مقرر دراسي', link: '/library' },
        { text: 'منصة التدريب العملي والمحاكاة لتقييم المقاييس النفسية', badge: 'تدريب', link: '/academy' }
      ]
    }
  };

  // State and constants
  const gravity = 0.25; // Constant gravity for stars physics
  const [time, setTime] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [hoveredPortalIndex, setHoveredPortalIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2) * -15;
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2) * -15;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Physics animation tick
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(prev => prev + 0.02);
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Filter query results
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) {
      // Show default recommended mix
      return [
        { ...searchCategories.patients.items[0], category: 'patients', catTitle: 'الحالات' },
        { ...searchCategories.specialists.items[1], category: 'specialists', catTitle: 'الأخصائيون' },
        { ...searchCategories.researchers.items[2], category: 'researchers', catTitle: 'الباحثون' },
        { ...searchCategories.students.items[0], category: 'students', catTitle: 'الطلاب' }
      ];
    }
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    Object.entries(searchCategories).forEach(([key, cat]) => {
      cat.items.forEach(item => {
        if (item.text.toLowerCase().includes(query) || item.badge.toLowerCase().includes(query)) {
          results.push({ ...item, category: key, catTitle: cat.title });
        }
      });
    });
    return results.slice(0, 6);
  };

  // Drifting style calculator for any element
  const getDriftStyle = (indexMultiplier: number, speed = 1) => {
    if ((gravity as number) === 1) return {};
    const amplitude = 12 * (1 - gravity) * speed;
    const dy = Math.sin(time * speed + indexMultiplier) * amplitude;
    const dx = Math.cos(time * 0.7 * speed + indexMultiplier) * (amplitude * 0.4);
    return {
      transform: `translate3d(${dx}px, ${dy}px, 0px)`,
      transition: 'transform 0.1s linear'
    };
  };

  // Portal motion values
  const getPortalMotion = (idx: number) => {
    if (isMobile) {
      if (hoveredPortalIndex === idx) {
        return { x: 0, y: -8, scale: 1.02 };
      }
      return { x: 0, y: 0, scale: 0.98 };
    }
    if (hoveredPortalIndex === null) {
      return { x: 0, y: 0, scale: 1 };
    }
    if (hoveredPortalIndex === idx) {
      return { x: 0, y: -28 * (1 - gravity), scale: 1.05 };
    }
    const vec = driftVectors[hoveredPortalIndex][idx];
    return {
      x: vec.dx * (1 - gravity),
      y: vec.dy * (1 - gravity),
      scale: 0.96
    };
  };

  return (
    <div dir="rtl" className="w-full relative overflow-hidden transition-colors duration-500 landing-page-font-override" style={{ background: c.bg, minHeight: '100vh' }}>
      
      {/* ─── Particles Canvas Twinkling Starfield ─── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <ParticlesCanvas isLight={isLight} />
      </div>

      {/* ─── Immersive Neural Pathway Background ─── */}
      <div 
        className="absolute left-1/2 top-[45%] w-[650px] md:w-[750px] h-[1300px] md:h-[1500px] pointer-events-none z-0 transition-all duration-700 select-none opacity-40 animate-pulse-slow"
        style={{
          transform: `translate3d(calc(-50% + ${mouseOffset.x}px), calc(-50% + ${mouseOffset.y}px), 0px)`,
          backgroundImage: 'url(/assets/neural-pathway.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: isLight ? 'multiply' : 'screen',
          filter: isLight ? 'invert(1) contrast(1.05)' : 'drop-shadow(0 0 50px rgba(212,175,55,0.25))',
          opacity: isLight ? 0.18 : 0.38
        }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-44 pb-28 md:pt-48 md:pb-36 z-10 px-6 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Floating Title / Logo Container */}
        <div 
          className="text-center space-y-6 mb-12 select-none"
          style={getDriftStyle(0, 0.8)}
        >
          {/* ─── Platform Logo ─── */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative"
              style={{ filter: isLight ? 'none' : 'drop-shadow(0 0 40px rgba(212,175,55,0.35))' }}
            >
              <Logo size={72} showText={true} />
            </div>
          </div>

          <Chip label="المنصة المتكاملة للصحة النفسية والبحث العلمي" isLight={isLight} />
          
          <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight text-psy-text leading-[1.1] m-0">
            أيقظ طاقتك <br className="md:hidden" />
            <span className="gold-text-gradient italic font-normal ml-3">الداخلية</span>
          </h1>
          
          <p 
            className="max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-light text-center"
            style={{ color: c.textDim }}
          >
            ندمج دقة القياسات السيكومترية مع تصميم تفاعلي متفرد. فضاء عابر للجاذبية يربط الحالات بالأطباء، الباحثين بالدراسات، والطلاب بالمعرفة.
          </p>
        </div>

        {/* ─── OMNI-SEARCH CENTER ─── */}
        <div 
          className="w-full max-w-2xl relative mb-16 z-30 px-2"
          style={getDriftStyle(1, 1.2)}
        >
          <div 
            className="relative rounded-2xl overflow-hidden border transition-all duration-305 shadow-xl"
            style={{
              borderColor: isSearchFocused 
                ? (isLight ? '#8A6000' : '#D4AF37') 
                : (isLight ? 'rgba(138, 96, 0, 0.2)' : 'rgba(212, 175, 55, 0.2)'),
              boxShadow: isSearchFocused 
                ? (isLight ? '0 10px 30px rgba(138, 96, 0, 0.15)' : '0 10px 40px rgba(212, 175, 55, 0.25)') 
                : 'none'
            }}
          >
            {/* Input Wrapper */}
            <div 
              className="flex items-center px-4 py-3 md:py-4 gap-3 transition-colors"
              style={{ background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(13, 12, 21, 0.85)' }}
            >
              <Search className="text-psy-gold/70" size={22} />
              <input
                type="text"
                placeholder="ابحث عن: مقياس القلق، دراسات، محاضرات، أو أخصائيين..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-transparent border-none outline-none text-psy-text placeholder-psy-text/40 text-sm md:text-base pr-0 focus:ring-0"
                style={{ minHeight: 'auto', border: 'none' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-psy-text/40 hover:text-psy-gold"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="border-t max-h-96 overflow-y-auto"
                  style={{
                    background: isLight ? '#ffffff' : '#0d0c15',
                    borderColor: isLight ? 'rgba(138, 96, 0, 0.15)' : 'rgba(212, 175, 55, 0.15)'
                  }}
                >
                  <div className="p-3 text-[11px] font-bold tracking-wider opacity-40 text-right">
                    {searchQuery ? 'نتائج مطابقة في البوابات' : 'خدمات موصى بها سريعة'}
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {getFilteredSuggestions().map((item, idx) => {
                      const catColors: any = {
                        patients: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
                        specialists: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                        researchers: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                        students: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                      };
                      const themeStyle = catColors[item.category] || catColors.patients;

                      return (
                        <Link
                          key={idx}
                          to={item.link}
                          className="flex items-center justify-between p-3.5 hover:bg-psy-gold/5 transition-colors cursor-pointer text-right"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs md:text-sm font-bold text-psy-text">{item.text}</span>
                            <span className="text-[10px] text-psy-text/45 mt-1">{item.catTitle}</span>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full border ${themeStyle.text} ${themeStyle.bg} ${themeStyle.border} font-bold`}>
                            {item.badge}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 z-10">
          <Link
            to={user ? dashboardPath : "/auth?tab=register"}
            className="px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, #8A6000, #C4956A)'
                : 'linear-gradient(135deg, #D4AF37, #C4956A)',
              color: isLight ? '#fdfaf7' : '#030712'
            }}
          >
            ابدأ رحلتك مجاناً
            <ArrowLeft size={16} />
          </Link>
          <Link
            to="/#portals"
            className="px-8 py-4 rounded-2xl font-black text-sm border hover:bg-psy-gold/5 transition-all flex items-center justify-center"
            style={{
              borderColor: c.border,
              color: isLight ? '#8A6000' : '#D4AF37'
            }}
          >
            بوابات النظام
          </Link>
        </div>
      </section>

      {/* ─── QUAD-PORTAL GATEWAY (4 USER GROUPS) ─── */}
      <section id="portals" className="relative py-28 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <Chip label="شبكة البوابات الرباعية" isLight={isLight} />
          <h2 className="text-3xl md:text-5xl font-black leading-tight text-psy-text mt-2 mb-4">
            بوابات تفاعلية غير متماثلة
          </h2>
          <p className="max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed" style={{ color: c.textDim }}>
            عناصر طافية تمثل البوابات الأربع للمنصة. تفاعل مادي يدفع البوابات المجاورة لتشعر بتأثير انعدام الجاذبية.
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-5xl mx-auto relative px-4">
          
          {/* Portal 1: الحالات (Recovery Portal) */}
          <motion.div
            animate={getPortalMotion(0)}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            onMouseEnter={() => setHoveredPortalIndex(0)}
            onMouseLeave={() => setHoveredPortalIndex(null)}
            className="md:-translate-y-6"
          >
            <GlassCard 
              isLight={isLight} 
              glowColor="#14b8a6"
              className="p-8 cursor-pointer h-full group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                    <Heart size={26} />
                  </div>
                  <span className="text-[10px] font-bold text-teal-400/80 tracking-widest uppercase border border-teal-500/20 px-3 py-1 rounded-full bg-teal-500/5">
                    بوابة التعافي
                  </span>
                </div>
                <h3 className="text-2xl font-black text-teal-400 mb-4 group-hover:text-teal-300 transition-colors">
                  الحالات والمرضى
                </h3>
                <p className="text-sm font-light leading-relaxed mb-8" style={{ color: c.textDim }}>
                  تتبع مزاجك اليومي بأدوات ذكية، وثق مشاعرك، واحصل على استشارات آمنة ومشفرة تماماً مع معالجك المهني بخصوصية بالغة.
                </p>
              </div>
              <div className="space-y-3.5">
                <Link to={user ? (user.role === 'patient' ? '/patient/journal' : dashboardPath) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/10 text-teal-400 text-xs font-black transition-all">
                  <span>فحص مؤشر المزاج الفوري</span>
                  <ArrowLeft size={14} />
                </Link>
                <Link to={user ? (user.role === 'patient' ? '/patient/appointments' : dashboardPath) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/10 text-teal-400 text-xs font-black transition-all">
                  <span>ابحث عن معالج نفسي ملائم</span>
                  <ArrowLeft size={14} />
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Portal 2: الأخصائيون (Clinical Portal) */}
          <motion.div
            animate={getPortalMotion(1)}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            onMouseEnter={() => setHoveredPortalIndex(1)}
            onMouseLeave={() => setHoveredPortalIndex(null)}
            className="md:translate-y-6"
          >
            <GlassCard 
              isLight={isLight} 
              glowColor="#6366f1"
              className="p-8 cursor-pointer h-full group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Stethoscope size={26} />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400/80 tracking-widest uppercase border border-indigo-500/20 px-3 py-1 rounded-full bg-indigo-500/5">
                    البوابة الإكلينيكية
                  </span>
                </div>
                <h3 className="text-2xl font-black text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors">
                  المعالجون والأخصائيون
                </h3>
                <p className="text-sm font-light leading-relaxed mb-8" style={{ color: c.textDim }}>
                  أدوات عيادة متطورة لإدارة الممارسة السريرية: السجلات الطبية للمرضى، تخطيط الجلسات، المهام والتقارير الذكية مع أمان مطلق.
                </p>
              </div>
              <div className="space-y-3.5">
                <Link to={user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/patients' : dashboardPath) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 text-xs font-black transition-all">
                  <span>لوحة متابعة الحالات النشطة</span>
                  <ArrowLeft size={14} />
                </Link>
                <Link to={user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/plans' : dashboardPath) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 text-xs font-black transition-all">
                  <span>تخصيص الأدوات والخطط العلاجية</span>
                  <ArrowLeft size={14} />
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Portal 3: الباحثون (Analytical Portal) */}
          <motion.div
            animate={getPortalMotion(2)}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            onMouseEnter={() => setHoveredPortalIndex(2)}
            onMouseLeave={() => setHoveredPortalIndex(null)}
            className="md:-translate-y-2 md:-translate-x-4"
          >
            <GlassCard 
              isLight={isLight} 
              glowColor="#a855f7"
              className="p-8 cursor-pointer h-full group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                    <FlaskConical size={26} />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400/80 tracking-widest uppercase border border-purple-500/20 px-3 py-1 rounded-full bg-purple-500/5">
                    البوابة التحليلية
                  </span>
                </div>
                <h3 className="text-2xl font-black text-purple-400 mb-4 group-hover:text-purple-300 transition-colors">
                  الأكاديميون والباحثون
                </h3>
                <p className="text-sm font-light leading-relaxed mb-8" style={{ color: c.textDim }}>
                  صمم المقاييس السيكومترية المتقدمة، واحسب الصدق والثبات، ونفذ تحليلات سيكومترية معقدة عبر خوادم آمنة لإدارة عيناتك ودراساتك.
                </p>
              </div>
              <div className="space-y-3.5">
                {/* <Link to={user ? (user.role === 'researcher' ? '/lab/builder' : ((user.role === 'clinician' || user.role === 'owner') ? '/lab/dashboard' : dashboardPath)) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 text-purple-400 text-xs font-black transition-all">
                  <span>منشئ المقاييس والاستمارات</span>
                  <ArrowLeft size={14} />
                </Link> */}
                <Link to={user ? (user.role === 'researcher' ? '/lab/analysis' : ((user.role === 'clinician' || user.role === 'owner') ? '/lab/dashboard' : dashboardPath)) : '/auth'} className="flex items-center justify-between p-3.5 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 text-purple-400 text-xs font-black transition-all">
                  <span>تشغيل محرك التحليل التلوي</span>
                  <ArrowLeft size={14} />
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Portal 4: الطلاب (Academic Portal) */}
          <motion.div
            animate={getPortalMotion(3)}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            onMouseEnter={() => setHoveredPortalIndex(3)}
            onMouseLeave={() => setHoveredPortalIndex(null)}
            className="md:translate-y-12 md:translate-x-4"
          >
            <GlassCard 
              isLight={isLight} 
              glowColor="#f59e0b"
              className="p-8 cursor-pointer h-full group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <GraduationCap size={26} />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400/80 tracking-widest uppercase border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/5">
                    البوابة الأكاديمية
                  </span>
                </div>
                <h3 className="text-2xl font-black text-amber-400 mb-4 group-hover:text-amber-300 transition-colors">
                  الطلاب والمتعلمون
                </h3>
                <p className="text-sm font-light leading-relaxed mb-8" style={{ color: c.textDim }}>
                  أرشيف علمي ثري لطلاب علم النفس. استمع للمحاضرات مرئية، استكشف دراسات الحالة الموثقة واقرأ الكتب والمناهج المعتمدة.
                </p>
              </div>
              <div className="space-y-3.5">
                <Link to="/academy" className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 text-amber-400 text-xs font-black transition-all">
                  <span>مكتبة المحاضرات والمقررات</span>
                  <ArrowLeft size={14} />
                </Link>
                <Link to="/library" className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 text-amber-400 text-xs font-black transition-all">
                  <span>تصفح أرشيف الحالات السريرية</span>
                  <ArrowLeft size={14} />
                </Link>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </section>

      {/* ─── LIVE PLATFORM MATRIX (STATS & CHARTS) ─── */}
      <section id="vision" className="relative py-28 px-6 z-10" style={{ background: isLight ? 'rgba(138, 96, 0, 0.02)' : 'rgba(0,0,0,0.15)' }}>
        
        {/* Connections Graphic Overlay (Background Pulse Paths) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0 hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path
              d="M 250 350 C 400 300, 500 400, 600 350 S 800 250, 950 350"
              stroke={isLight ? 'rgba(138, 96, 0, 0.18)' : 'rgba(212, 175, 55, 0.15)'}
              strokeWidth="2"
              className="pulse-line"
              style={{
                strokeDasharray: '8, 12',
                animation: 'dash 2.5s linear infinite'
              }}
            />
            <path
              d="M 250 350 Q 600 150, 950 350"
              stroke={isLight ? 'rgba(91, 33, 182, 0.15)' : 'rgba(124, 58, 237, 0.12)'}
              strokeWidth="1.5"
              className="pulse-line"
              style={{
                strokeDasharray: '6, 15',
                animation: 'dash 4s linear infinite'
              }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Chip label="مصفوفة المنصة الفورية" isLight={isLight} />
            <h2 className="text-3xl md:text-5xl font-black text-psy-text mt-2 mb-4">
              إحصائيات متصلة حية
            </h2>
            <p className="max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed" style={{ color: c.textDim }}>
              مصفوفة تفاعلية متصلة بخيوط ضوئية تعكس البيانات السيكومترية والبحثية الجارية حالياً في المنصة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: مختبر البيانات */}
            <div style={getDriftStyle(0.2, 0.6)}>
              <GlassCard isLight={isLight} className="p-7">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] font-bold tracking-wider text-psy-gold/80 bg-psy-gold/5 px-2.5 py-1 rounded-md border border-psy-gold/15">
                    سيكومتريا رقمية
                  </span>
                  <Activity size={18} className="text-psy-gold" />
                </div>
                <div className="text-4xl font-serif font-black text-psy-text mb-2">42</div>
                <div className="text-sm font-bold text-psy-text mb-4">دراسة بحثية قائمة</div>
                <p className="text-xs font-light leading-relaxed mb-6" style={{ color: c.textDim }}>
                  أبحاث جارية لقياس التباين والاتساق الداخلي للمقاييس السلوكية بالوطن العربي.
                </p>
                {/* SVG Mini Chart */}
                <svg className="w-full h-16 mt-4" viewBox="0 0 100 30" fill="none">
                  <defs>
                    <linearGradient id="gradient-gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isLight ? '#8A6000' : '#D4AF37'} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={isLight ? '#8A6000' : '#D4AF37'} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,25 Q15,10 30,22 T60,5 T90,14 T100,2" stroke={isLight ? '#8A6000' : '#D4AF37'} strokeWidth="1.5" fill="none" />
                  <path d="M0,25 Q15,10 30,22 T60,5 T90,14 T100,2 L100,30 L0,30 Z" fill="url(#gradient-gold)" />
                </svg>
              </GlassCard>
            </div>

            {/* Card 2: الجلسات النشطة */}
            <div style={getDriftStyle(0.5, 0.8)}>
              <GlassCard isLight={isLight} className="p-7">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] font-bold tracking-wider text-teal-400 bg-teal-500/5 px-2.5 py-1 rounded-md border border-teal-500/15">
                    جلسات مشفرة
                  </span>
                  <MessageSquare size={18} className="text-teal-400" />
                </div>
                <div className="text-4xl font-serif font-black text-psy-text mb-2">189</div>
                <div className="text-sm font-bold text-psy-text mb-4">جلسة استشارية حية</div>
                <p className="text-xs font-light leading-relaxed mb-6" style={{ color: c.textDim }}>
                  جلسات علاجية واستشارات نفسية قائمة حالياً بأمان تام وتشفير بين الطرفين.
                </p>
                {/* SVG Mini Chart */}
                <svg className="w-full h-16 mt-4" viewBox="0 0 100 30" fill="none">
                  <defs>
                    <linearGradient id="gradient-teal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,28 Q12,14 28,26 T55,8 T80,20 T100,4" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
                  <path d="M0,28 Q12,14 28,26 T55,8 T80,20 T100,4 L100,30 L0,30 Z" fill="url(#gradient-teal)" />
                </svg>
              </GlassCard>
            </div>

            {/* Card 3: المقاييس المعتمدة */}
            <div style={getDriftStyle(0.8, 0.7)}>
              <GlassCard isLight={isLight} className="p-7">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] font-bold tracking-wider text-purple-400 bg-purple-500/5 px-2.5 py-1 rounded-md border border-purple-500/15">
                    التحليل المعرفي
                  </span>
                  <Brain size={18} className="text-purple-400" />
                </div>
                <div className="text-4xl font-serif font-black text-psy-text mb-2">340</div>
                <div className="text-sm font-bold text-psy-text mb-4">مقياس سيكومتري نشط</div>
                <p className="text-xs font-light leading-relaxed mb-6" style={{ color: c.textDim }}>
                  مقاييس DSM-5 واختبارات نفسية مقننة بالكامل للبيئة الثقافية العربية.
                </p>
                {/* SVG Mini Chart */}
                <svg className="w-full h-16 mt-4" viewBox="0 0 100 30" fill="none">
                  <defs>
                    <linearGradient id="gradient-violet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isLight ? '#5B21B6' : '#7C3AED'} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={isLight ? '#5B21B6' : '#7C3AED'} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,18 C12,24 32,8 52,20 C72,28 85,12 100,4" stroke={isLight ? '#5B21B6' : '#7C3AED'} strokeWidth="1.5" fill="none" />
                  <path d="M0,18 C12,24 32,8 52,20 C72,28 85,12 100,4 L100,30 L0,30 Z" fill="url(#gradient-violet)" />
                </svg>
              </GlassCard>
            </div>

          </div>
        </div>
      </section>

      {/* ─── DYNAMIC DOCUMENT FLOW (3D HORIZONTAL MARQUEE) ─── */}
      <section className="relative py-28 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <Chip label="تدفق المستندات الرقمية" isLight={isLight} />
          <h2 className="text-3xl md:text-5xl font-black text-psy-text mt-2 mb-4">
            الأوراق العلمية والمقررات الجارية
          </h2>
          <p className="max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed" style={{ color: c.textDim }}>
            تصفح أفقي ثلاثي الأبعاد للأبحاث الأكاديمية والمقررات الدراسية تسبح بارتفاعات متفاوتة وعمق بصري.
          </p>
        </div>

        {/* Scrolling Track Container */}
        <div className="flex gap-8 overflow-x-auto py-12 px-8 no-scrollbar cursor-grab active:cursor-grabbing select-none relative z-10">
          
          {[
            { title: 'أثر التكيف الرقمي على اضطرابات المزاج', cat: 'دراسة سيكومترية', author: 'د. يوسف سليم', z: 12, height: -18, scale: 0.96 },
            { title: 'دليل المقاييس النفسية في البيئة العربية', cat: 'دليل سريري', author: 'أ. د. سميرة فؤاد', z: 24, height: 15, scale: 1.02 },
            { title: 'مقدمة في تشخيص وعلاج القلق المعرفي', cat: 'مقرر دراسي', author: 'جامعة سايتك الأكاديمية', z: 15, height: -10, scale: 0.98 },
            { title: 'تحليل الصدق البنيوي لـ DSM-5 في المجتمعات', cat: 'دراسة تحليلية', author: 'مختبر الإحصاء النفسي', z: 28, height: 22, scale: 1.04 },
            { title: 'علم النفس العصبي والذاكرة العاملة الرقمية', cat: 'كتاب أكاديمي', author: 'د. مازن الحامد', z: 18, height: -14, scale: 0.97 },
            { title: 'بروتوكول اليقظة الذهنية وعلاج الاحتراق المهني', cat: 'دليل إرشادي', author: 'أخصائيون بلا حدود', z: 22, height: 12, scale: 1.01 },
            { title: 'مقياس المرونة النفسية للأطفال واليافعين', cat: 'أداة قياس', author: 'أ. ليلى الشافعي', z: 10, height: -22, scale: 0.95 }
          ].map((doc, idx) => {
            
            // Calculate height and scroll speed dynamic factors
            const floatAmp = doc.height * (1 - gravity);
            const dynamicTransform = `translate3d(0px, ${Math.sin(time + idx) * floatAmp}px, 0px) scale(${doc.scale})`;

            return (
              <div
                key={idx}
                className="flex-shrink-0 w-80 transition-all duration-300"
                style={{
                  zIndex: doc.z,
                  transform: dynamicTransform
                }}
              >
                <GlassCard 
                  isLight={isLight} 
                  className="p-6 h-64 flex flex-col justify-between hover:scale-[1.03] hover:border-psy-gold/45 duration-300 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-psy-gold/80 bg-psy-gold/5 px-2.5 py-1 rounded border border-psy-gold/15">
                        {doc.cat}
                      </span>
                      <BookOpen size={15} className="text-psy-text/40" />
                    </div>
                    <h4 className="text-base font-bold text-psy-text leading-relaxed line-clamp-3 mb-3">
                      {doc.title}
                    </h4>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[11px]" style={{ color: c.textDim }}>
                    <span>الكاتب: {doc.author}</span>
                    <span className="font-mono text-psy-gold hover:underline cursor-pointer">تحميل PDF</span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── VIDEO SHOWCASE SECTION (HIGH QUALITY POSTERS) ─── */}
      <section className="relative py-28 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Chip label="شاهد المنصة في دقيقة" isLight={isLight} />
            <h2 className="text-3xl md:text-5xl font-black text-psy-text mt-2 mb-4">
              دورة حياة البيانات والتعافي
            </h2>
            <p className="max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed" style={{ color: c.textDim }}>
              شاهد كيف تعمل محاكاة تدفق البيانات السيكومترية والمتابعة العلاجية حياً داخل النظام البيئي لسايتك.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Video Box 1 */}
            <GlassCard isLight={isLight} className="overflow-hidden p-1 shadow-2xl">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                <video
                  ref={videoRef}
                  src="/assets/consciousness-flow.mp4"
                  loop
                  muted={isVideoMuted}
                  autoPlay={isVideoPlaying}
                  playsInline
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Control Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (isVideoPlaying) {
                          videoRef.current.pause();
                        } else {
                          videoRef.current.play();
                        }
                        setIsVideoPlaying(!isVideoPlaying);
                      }
                    }}
                    className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-psy-gold/30 text-psy-gold hover:scale-110 transition-transform"
                  >
                    {isVideoPlaying ? <Pause size={20} /> : <Play size={20} className="mr-1" />}
                  </button>
                </div>

                {/* Mute toggle button */}
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-4 left-4 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-psy-gold transition-colors z-20"
                >
                  {isVideoMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>

                <div className="absolute bottom-4 right-4 text-right z-10 pointer-events-none">
                  <span className="text-[10px] font-bold text-psy-gold uppercase tracking-wider">سلسلة تدفق المعطيات</span>
                  <h4 className="text-sm font-bold text-white mt-1 m-0">محاكاة التشابكات العصبية وتجميع البيانات</h4>
                </div>
              </div>
            </GlassCard>

            {/* Video Box 2 */}
            <GlassCard isLight={isLight} className="overflow-hidden p-1 shadow-2xl">
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
                <video
                  src="/assets/video-liquid-metal.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 right-4 text-right z-10 pointer-events-none">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">دورة الحياة العضوية</span>
                  <h4 className="text-sm font-bold text-white mt-1 m-0">تأثير الهرمونات والترابط العضوي النفسي للتعافي</h4>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="relative py-28 px-6 z-10">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Chip label="آراء علمية رائدة" isLight={isLight} />
            <h2 className="text-3xl md:text-5xl font-black text-psy-text mt-2 mb-4">
              كلمات ملهمة من شركائنا
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <GlassCard isLight={isLight} className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 justify-end mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={c.gold} color={c.gold} />
                  ))}
                </div>
                <p className="text-sm font-light leading-relaxed mb-8 italic" style={{ color: c.textDim }}>
                  "غيرت PsyTech منهجية العمل في عيادتي بالكامل. استطعت تتبع مؤشر القلق والاكتئاب للحالات وإعطاء واجبات معرفية سلوكية بسلاسة وأمان لم أشهده في أي منصة أخرى."
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-right">
                <h5 className="text-sm font-black text-psy-text m-0">د. سامي الأحمد</h5>
                <span className="text-[11px] mt-1 block" style={{ color: c.textDim }}>أخصائي نفساني إكلينيكي وعضو الجمعية السلوكية</span>
              </div>
            </GlassCard>

            <GlassCard isLight={isLight} className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 justify-end mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={c.gold} color={c.gold} />
                  ))}
                </div>
                <p className="text-sm font-light leading-relaxed mb-8 italic" style={{ color: c.textDim }}>
                  "الأدوات السيكومترية المتاحة مثل التحليل العاملي وحساب معامل ألفا كرونباخ إلكترونياً وفرت علينا في مركز البحوث مئات الساعات من التحليلات الإحصائية الطويلة."
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-right">
                <h5 className="text-sm font-black text-psy-text m-0">أ. د. فاطمة الزهراء</h5>
                <span className="text-[11px] mt-1 block" style={{ color: c.textDim }}>رئيسة قسم القياس النفسي والتربوي بالجامعة</span>
              </div>
            </GlassCard>

            <GlassCard isLight={isLight} className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 justify-end mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={c.gold} color={c.gold} />
                  ))}
                </div>
                <p className="text-sm font-light leading-relaxed mb-8 italic" style={{ color: c.textDim }}>
                  "كمستخدمة تتابع مزاجها، أشعر بالامتنان لوجود بيئة آمنة تمنحني القدرة على كتابة يومياتي ومشاركتها مع معالجتي المباشرة فورياً، مما جعل رحلة تعافي واعية للغاية."
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-right">
                <h5 className="text-sm font-black text-psy-text m-0">نهى اليماني</h5>
                <span className="text-[11px] mt-1 block" style={{ color: c.textDim }}>مستخدمة نشطة - بوابة التعافي</span>
              </div>
            </GlassCard>

          </div>
        </div>
      </section>

      {/* ─── CTA FINAL SECTION (Ψ SYMBOL BACKGROUND) ─── */}
      <section className="relative py-28 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Large Luxurious Greek Psi (Ψ) Symbol */}
          <div
            className="text-8xl md:text-9xl font-serif font-black mb-8 select-none leading-none animate-bounce-slow"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(138, 96, 0, 0.25), rgba(196, 149, 106, 0.25))'
                : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(124, 58, 237, 0.15))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 35px ${c.gold}25)`
            }}
          >
            Ψ
          </div>

          <Chip label="انضم إلى البيئة الأكاديمية والسريرية" isLight={isLight} />
          
          <h2 className="text-3xl md:text-6xl font-black text-psy-text mt-3 mb-6">
            مستقبل الصحة النفسية <br />
            <span style={{ color: c.gold }}>يبدأ معك اليوم</span>
          </h2>
          
          <p className="max-w-lg mx-auto font-light text-sm md:text-base leading-relaxed mb-10" style={{ color: c.textDim }}>
            تكامل رقمي غير مسبوق في قياس الوعي البشري وتيسير العلاج. ابدأ رحلتك الأكاديمية أو السريرية أو الشخصية الآن.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to={user ? dashboardPath : "/auth?tab=register"}
              className="px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
              style={{
                background: isLight
                  ? 'linear-gradient(135deg, #8A6000, #C4956A)'
                  : 'linear-gradient(135deg, #D4AF37, #C4956A)',
                color: isLight ? '#fdfaf7' : '#030712'
              }}
            >
              سجل حسابك مجاناً
              <ArrowLeft size={16} />
            </Link>
            <Link
              to={user ? dashboardPath : "/auth?tab=login"}
              className="px-8 py-4 rounded-2xl font-black text-sm border hover:bg-psy-gold/5 transition-all flex items-center justify-center"
              style={{
                borderColor: c.border,
                color: isLight ? '#8A6000' : '#D4AF37'
              }}
            >
              تسجيل دخول
            </Link>
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="relative py-16 px-6 md:px-16 border-t z-10"
        style={{
          background: isLight ? '#ffffff' : '#08080f',
          borderColor: c.border
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 text-right space-y-4">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-2xl font-serif font-black gold-text-gradient">psyTech</span>
                <div className="w-9 h-9 rounded-full bg-psy-gold/10 flex items-center justify-center border border-psy-gold/20 text-psy-gold font-serif font-bold text-xl">
                  Ψ
                </div>
              </div>
              <p className="text-xs md:text-sm font-light leading-relaxed max-w-sm" style={{ color: c.textDim }}>
                المنصة الرقمية المتكاملة لعلوم الصحة النفسية والقياسات السيكومترية. نسعى لتأسيس البنية التحتية الرقمية الرائدة في العيادات والمراكز البحثية العربية.
              </p>
              <div className="text-sm font-serif italic opacity-60" style={{ color: c.gold }}>
                "نحو وعي أعمق... لحياة أفضل"
              </div>
            </div>

            {/* Column 2: Portals Links */}
            <div className="text-right">
              <h5 className="font-black text-sm text-psy-text mb-4">بواباتنا</h5>
              <ul className="space-y-2.5 text-xs font-light" style={{ color: c.textDim }}>
                <li><Link to={user ? (user.role === 'patient' ? '/patient/dashboard' : dashboardPath) : '/auth'} className="hover:text-psy-gold transition-colors">بوابة الحالات والتعافي</Link></li>
                <li><Link to={user ? ((user.role === 'clinician' || user.role === 'owner') ? '/clinic/dashboard' : dashboardPath) : '/auth'} className="hover:text-psy-gold transition-colors">بوابة الأخصائيين والعيادة</Link></li>
                <li><Link to={user ? (user.role === 'researcher' ? '/lab/dashboard' : dashboardPath) : '/auth'} className="hover:text-psy-gold transition-colors">بوابة الأكاديميين والبحث</Link></li>
                <li><Link to="/academy" className="hover:text-psy-gold transition-colors">بوابة الطلاب والتعليم</Link></li>
              </ul>
            </div>

            {/* Column 3: Site Info */}
            <div className="text-right">
              <h5 className="font-black text-sm text-psy-text mb-4">معلومات</h5>
              <ul className="space-y-2.5 text-xs font-light" style={{ color: c.textDim }}>
                <li><Link to="/#portals" className="hover:text-psy-gold transition-colors">عن المنصة</Link></li>
                <li><Link to="#" className="hover:text-psy-gold transition-colors">شروط الاستخدام والاتفاقيات</Link></li>
                <li><Link to="#" className="hover:text-psy-gold transition-colors">اتفاقية السرية والأمان</Link></li>
                <li><Link to="#" className="hover:text-psy-gold transition-colors">فريق العمل والاتصال</Link></li>
              </ul>
            </div>

          </div>

          <div 
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
            style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
          >
            <p className="text-xs" style={{ color: c.textDim }}>© 2026 PsyTech — جميع الحقوق محفوظة للمنصة</p>
            <p className="text-xs font-mono" style={{ color: c.textDim }}>Ψ — منظومة رقمية متكاملة للعلوم النفسية</p>
          </div>
        </div>
      </footer>

      {/* Connection Dash & Custom Parallax / Twinkle Styles */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -50;
          }
        }
        .pulse-line {
          animation: dash 5s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: ${isLight ? 0.15 : 0.32}; 
            filter: ${isLight ? 'invert(1) contrast(1.02)' : 'drop-shadow(0 0 40px rgba(212,175,55,0.2))'}; 
          }
          50% { 
            opacity: ${isLight ? 0.23 : 0.48}; 
            filter: ${isLight ? 'invert(1) contrast(1.12)' : 'drop-shadow(0 0 70px rgba(212,175,55,0.38))'}; 
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export { LandingPage as default };
