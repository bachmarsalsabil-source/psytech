import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  RotateCcw, 
  Trash2, 
  Save, 
  Check,
  Send,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Clock,
  User,
  Activity,
  Maximize2
} from 'lucide-react';
import { GoldButton } from './GoldButton';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  journalContent?: string;
  setJournalContent?: (content: string | ((prev: string) => string)) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onSave, 
  journalContent = '', 
  setJournalContent 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'rect' | 'circle' | 'line'>('pencil');
  const [color, setColor] = useState('#D4B483'); // Start with the beautiful default theme gold
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Specialist projectives test states
  const [showDirective, setShowDirective] = useState(false);
  const [projectiveComment, setProjectiveComment] = useState('');
  const [isProjectiveSubmitted, setIsProjectiveSubmitted] = useState(false);
  const [isSubmittingProjective, setIsSubmittingProjective] = useState(false);

  const colors = [
    '#D4B483', // Case gold
    '#000000', // Deep black
    '#FFFFFF', // Blank white
    '#FF3B30', // Alert red
    '#34C759', // Satori green
    '#007AFF', // Calm blue
    '#AF52DE', // Insight purple
    '#FFCC00', // Clarity yellow
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Fill background with clean solid white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setHistory([canvas.toDataURL()]);
  }, []);

  const getCoord = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // High quality correction to deal with canvas responsive scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent default scrolling on mobile touch
    if (e.cancelable) {
      e.preventDefault();
    }

    setIsDrawing(true);
    const { x, y } = getCoord(e);
    startCoordsRef.current = { x, y };
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = lineWidth;
    
    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setIsSaved(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startCoordsRef.current || !snapshotRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const { x, y } = getCoord(e);
    const startX = startCoordsRef.current.x;
    const startY = startCoordsRef.current.y;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Live draft preview of geometric objects
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      
      if (tool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
      } else if (tool === 'rect') {
        ctx.rect(startX, startY, x - startX, y - startY);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    startCoordsRef.current = null;
    snapshotRef.current = null;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setHistory(prev => [...prev, dataUrl]);
      onSave(dataUrl);
    }
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    const lastState = newHistory[newHistory.length - 1];
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && lastState) {
      const img = new Image();
      img.src = lastState;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.drawImage(img, 0, 0);
        onSave(canvas!.toDataURL());
      };
      setHistory(newHistory);
    }
  };

  const clear = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في مسح اللوحة بالكامل والبدء من جديد؟")) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        setHistory([dataUrl]);
        onSave(dataUrl);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSendProjectiveToSpecialist = () => {
    if (!projectiveComment.trim()) return;

    setIsSubmittingProjective(true);
    
    setTimeout(() => {
      setIsSubmittingProjective(false);
      setIsProjectiveSubmitted(true);

      // Append clinical findings dynamically to parent Journal entry container
      if (setJournalContent) {
        setJournalContent(prev => {
          const signature = `\n\n\n----------------------------\n📝 [تقرير وربط الاختيار الإسقاطي بالأخصائي]:\n✍️ تداعي وحرية التفسير الذاتي للمريض:\n"${projectiveComment}"\n----------------------------`;
          if (prev.includes('[تقرير وربط الاختيار الإسقاطي بالأخصائي]')) {
            return prev.replace(/----------------------------\n📝 \[تقرير وربط الاختيار الإسقاطي بالأخصائي\]:[\s\S]*/, signature.trim());
          }
          return prev + signature;
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Clinician Notification Banner about Active Projective Test */}
      <div className="relative overflow-hidden bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/15 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_8px_32px_rgba(212,180,131,0.03)]">
        {/* Pulsing indicator background flare */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative shrink-0">
            <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400">إشعار سريري نشط</span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded-md tracking-wider">مطلوب للاستشارة</span>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5">اختبار رسم البيت والشجرة والشخص (Projective HTP Test)</h4>
            <p className="text-[10px] text-psy-text/40 mt-1 leading-relaxed">يرجى رسم المطلوب وكتابة تعليقك الذاتي المباشر للأخصائي د. سمير عبد الهادي</p>
          </div>
        </div>

        <button 
          onClick={() => setShowDirective(true)}
          className="relative z-10 px-5 py-2.5 bg-amber-500 text-psy-bg hover:bg-amber-400 active:scale-95 transition-all text-xs font-black rounded-xl shadow-lg shadow-amber-500/15 flex items-center gap-1.5 cursor-pointer leading-none"
        >
          <Sparkles size={14} />
          <span>فتح وتدوين تقرير الاختبار</span>
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main interactive drawing board section */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-[#151514] p-3.5 rounded-2xl border border-white/5">
            {/* Tools list */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/5">
               <ToolButton active={tool === 'pencil'} onClick={() => setTool('pencil')} icon={Pencil} title="قلم حر" />
               <ToolButton active={tool === 'eraser'} onClick={() => setTool('eraser')} icon={Eraser} title="ممحاة" />
               <ToolButton active={tool === 'line'} onClick={() => setTool('line')} icon={Minus} title="خط مستقيم" />
               <ToolButton active={tool === 'rect'} onClick={() => setTool('rect')} icon={Square} title="مربع/مستطيل" />
               <ToolButton active={tool === 'circle'} onClick={() => setTool('circle')} icon={Circle} title="دائرة" />
            </div>

            {/* Thickness controller custom previewer */}
            <div className="flex items-center gap-4 bg-white/[0.01] px-4 py-1.5 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] font-bold text-psy-text/40">السماكة:</span>
              <input 
                type="range" min="1" max="24" value={lineWidth} 
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-20 md:w-28 accent-psy-gold cursor-pointer"
              />
              {/* Dynamic size dot previewer */}
              <div className="w-8 h-8 rounded-lg bg-[#111110] border border-white/5 flex items-center justify-center shrink-0">
                <div 
                  className="rounded-full transition-all duration-75"
                  style={{ 
                    width: `${Math.min(lineWidth, 24)}px`, 
                    height: `${Math.min(lineWidth, 24)}px`, 
                    backgroundColor: tool === 'eraser' ? '#FFFFFF' : color 
                  }}
                />
              </div>
            </div>

            {/* Palette selection with borders */}
            <div className="flex items-center gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/5">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => {
                    setColor(c);
                    if (tool === 'eraser') setTool('pencil');
                  }}
                  className={`w-5.5 h-5.5 rounded-full border-2 transition-all cursor-pointer relative ${color === c && tool !== 'eraser' ? 'border-[#D4B483] scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}

              {/* Native color hex selector indicator */}
              <div className="relative w-6 h-6 rounded-full border border-white/10 overflow-hidden cursor-pointer">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    if (tool === 'eraser') setTool('pencil');
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div 
                  className="w-full h-full rounded-full" 
                  style={{ backgroundColor: color }} 
                  title="لون مخصص"
                />
              </div>
            </div>

            {/* Editing triggers */}
            <div className="flex gap-1.5">
              <GoldButton variant="ghost" size="sm" onClick={undo} disabled={history.length <= 1} title="تراجع خطوة">
                <RotateCcw size={14} /> 
                <span className="hidden leading-none md:inline">تراجع</span>
              </GoldButton>
              <GoldButton variant="danger" size="sm" onClick={clear} title="مسح كل شيء">
                <Trash2 size={14} /> 
                <span className="hidden leading-none md:inline">مسح</span>
              </GoldButton>
              <GoldButton variant={isSaved ? "secondary" : "primary"} size="sm" onClick={handleSave}>
                {isSaved ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />} 
                <span className="leading-none">{isSaved ? "تم الحفظ" : "حفظ الرسمة"}</span>
              </GoldButton>
            </div>
          </div>

          {/* Luxury Canvas Container */}
          <div className="relative aspect-video bg-[#131312] border border-white/5 rounded-3xl overflow-hidden cursor-crosshair touch-none shadow-2xl">
            {/* Grid styling to reflect high professional design environment */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

            <canvas
              ref={canvasRef}
              width={1200}
              height={675}
              className="w-full h-full object-contain relative z-10"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            />

            {/* Fine watermark indicators for surgical precision aesthetic */}
            <div className="absolute left-4 bottom-4 z-20 pointer-events-none flex items-center gap-2 text-[9px] font-mono text-psy-text/15 font-black uppercase tracking-widest">
              <Activity size={10} className="animate-pulse" />
              <span>Diagnostic Projective Environment</span>
              <span className="text-psy-gold/20">|</span>
              <span>1200 x 675 PX</span>
            </div>
          </div>
        </div>

        {/* Projective Directive Sheet Slider / Interactive Drawer */}
        {showDirective && (
          <div className="w-full xl:w-96 bg-[#161615] border border-amber-500/15 p-5 rounded-3xl flex flex-col justify-between shadow-[0_12px_48px_rgba(0,0,0,0.4)] animate-in fade-in-50 slide-in-from-left duration-300 relative">
            
            {/* Dismiss drawer button */}
            <button 
              onClick={() => setShowDirective(false)}
              className="absolute top-4 left-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-psy-text/40 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <Maximize2 size={12} className="rotate-45" />
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4.5">
                <Sparkles size={16} className="text-amber-400" />
                <h3 className="text-sm font-black text-amber-400 leading-none">توجيه الأخصائي والتحليل الإسقاطي</h3>
              </div>

              {/* Clinician Card */}
              <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <User size={18} />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-black text-white">د. سمير عبد الهادي</h4>
                  <p className="text-[9px] font-bold text-psy-text/30 mt-0.5 uppercase tracking-wider">الاستشاري السريري المشرف</p>
                </div>
              </div>

              {/* Diagnostic Task Details */}
              <div className="bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <AlertCircle size={14} />
                  <span className="text-[11px] font-black">هدف الإجراء الإسقاطي:</span>
                </div>
                <p className="text-xs font-bold text-psy-text/70 leading-relaxed text-right">
                  "يهدف اختبار <strong className="text-white">البيت والشجرة والشخص (HTP)</strong> للكشف عن تطلعاتك اللاواعية وعلاقتك بنفسك وبيئتك وأفراد عائلتك. يرجى التركيز في الرسمة المجاورة على رسم هذه المكونات الثلاثة بمساحة واحدة بكل عفوية وتلقائية وبدون تفكير مسبق."
                </p>
              </div>

              {/* Text Feedback Entry Form */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-psy-text/40 flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-amber-500" />
                  <span>اكتب تعليقك، انطباعك أو تفسيرك الذاتي لعناصر رسمتك:</span>
                </label>
                <textarea 
                  value={projectiveComment}
                  onChange={(e) => {
                    setProjectiveComment(e.target.value);
                    setIsProjectiveSubmitted(false);
                  }}
                  disabled={isProjectiveSubmitted}
                  placeholder="مثال: يمثل البيت دفء ذكرياتي، والشخص يعاني من شعور الوحدة، وشجرة باسقة لها جذور ممتدة تعبر عن رغبتي بالاستقرار والنمو..."
                  className="w-full bg-black/40 border border-white/15 focus:border-amber-500 rounded-2xl p-4 text-xs font-bold leading-relaxed text-white h-32 resize-none outline-none focus:ring-1 focus:ring-amber-500/15 disabled:opacity-40 transition-all dark-scrollbar"
                />
              </div>
            </div>

            {/* Action panel underneath */}
            <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
              {isProjectiveSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/15 p-3.5 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Check size={16} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-emerald-400">تم مزامنة التحليل بنجاح</h5>
                    <p className="text-[9px] text-psy-text/50 mt-1">تم توثيق تداعياتك الحرة وسيتم تضمينها للمعالج مع رسمتك.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSendProjectiveToSpecialist}
                  disabled={!projectiveComment.trim() || isSubmittingProjective}
                  className="w-full py-4.5 bg-gradient-to-l from-amber-500 to-amber-400 text-psy-bg font-black rounded-2xl text-xs hover:from-amber-400 hover:to-amber-300 disabled:from-white/5 disabled:to-white/5 disabled:text-psy-text/20 disabled:border-transparent transition-all border border-amber-500/10 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] outline-none"
                >
                  {isSubmittingProjective ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-psy-bg border-t-transparent animate-spin rounded-full" />
                      <span>جاري إرسال التقرير ومزامنة البيانات...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>إرسال ومزامنة التقرير الإسقاطي مع د. سمير</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-bold text-psy-text/20 uppercase tracking-widest leading-none">
                <Clock size={10} />
                <span>نظام نقل مشفر ومزامن حظياً (256-Bit SSL)</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const ToolButton = ({ active, onClick, icon: Icon, title }: any) => (
  <button 
    onClick={onClick}
    title={title}
    className={`p-2.5 rounded-lg transition-all cursor-pointer relative group ${active ? 'bg-[#D4B483] text-[#181816] shadow-md shadow-[#D4B483]/10 scale-105' : 'text-psy-text/40 hover:text-psy-text hover:bg-white/5'}`}
  >
    <Icon size={18} className="shrink-0" />
    
    {/* Microtooltip */}
    <span className="absolute bottom-[44px] left-1/2 -translate-x-1/2 bg-[#121211] text-psy-gold text-[9px] font-black px-2 py-1 rounded-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap leading-none">
      {title}
    </span>
  </button>
);
