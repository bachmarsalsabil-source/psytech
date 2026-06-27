// @ts-nocheck
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, ClinicUser, getCases, UserRole, getCurrentUser, registerUser, authenticateUser } from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { Shield, Users, Microscope, Lock, Mail, Key } from 'lucide-react';
import { ImageUploader } from '../../components/clinic/ImageUploader';
import { AuthContext } from '../../context/AuthContext';

import { Logo } from '../../components/clinic/Logo';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.role === 'clinician' || user.role === 'owner') navigate('/clinic/dashboard');
      else if (user.role === 'researcher') navigate('/lab/dashboard');
      else if (user.role === 'patient') navigate('/patient/dashboard');
      else navigate('/');
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'register') {
      return 'register';
    }
    return 'login';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [location.search]);

  const [role, setRole] = useState<UserRole>('patient');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [accessCode, setAccessCode] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo Logic for Different Roles
    const demoAccounts: Record<string, ClinicUser> = {
      'sami@psytech.app': {
        id: 'clinician-1',
        fullName: 'د. سامي الأحمد',
        email: 'sami@psytech.app',
        role: 'clinician',
        specialization: 'معالج نفسي سلوكي معرفي'
      },
      'researcher@psytech.app': {
        id: 'researcher-1',
        fullName: 'أ. ليلى الباحثة',
        email: 'researcher@psytech.app',
        role: 'researcher',
        specialization: 'إحصاء حيوي'
      },
      'manager@psytech.app': {
        id: 'manager-1',
        fullName: 'أحمد كمال',
        email: 'manager@psytech.app',
        role: 'owner'
      }
    };

    if (demoAccounts[email] && password === 'demo123') {
      const user = demoAccounts[email];
      login(user);
      if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'researcher') {
        navigate('/lab/dashboard');
      } else {
        navigate('/clinic/dashboard');
      }
    } else {
      const registered = authenticateUser(email, password);
      if (registered) {
        login(registered);
        if (registered.role === 'patient') navigate('/patient/dashboard');
        else if (registered.role === 'researcher') navigate('/lab/dashboard');
        else if (registered.role === 'clinician' || registered.role === 'owner') navigate('/clinic/dashboard');
        else navigate('/');
        setIsLoading(false);
        return;
      }

      // Check for patient code (legacy demo flow)
      const cases = getCases();
      const found = cases.find(c => c.patientCode.toLowerCase() === email.trim().toLowerCase());
      if (found && password === 'demo123') {
        const user: ClinicUser = {
          id: 'patient-' + found.id,
          fullName: 'الحالة: ' + found.patientCode,
          email: 'patient@psytech.app',
          role: 'patient',
          patientCode: found.patientCode
        };
        login(user);
        navigate('/patient/dashboard');
      } else {
        setError('بيانات الدخول غير صحيحة. استخدم الحسابات التجريبية الموضحة بالأسفل.');
      }
    }
    setIsLoading(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      setIsLoading(false);
      return;
    }

    const newUser: ClinicUser = {
      id: Date.now().toString(),
      fullName,
      email,
      role,
      specialization: (role === 'clinician' || role === 'researcher') ? specialization : undefined,
      patientCode: role === 'patient' && accessCode ? accessCode : undefined,
    };

    const result = registerUser(newUser, password);
    if (!result.ok) {
      setError('error' in result ? result.error : 'فشل التسجيل.');
      setIsLoading(false);
      return;
    }

    login(newUser);

    if (role === 'researcher') {
      navigate('/lab/dashboard');
    } else if (role === 'clinician' || role === 'owner') {
      navigate('/clinic/dashboard');
    } else if (role === 'patient') {
      navigate('/patient/dashboard');
    } else {
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-psy-bg flex items-center justify-center p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      <div className="max-w-[1480px] w-full min-h-fit md:min-h-[800px] grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 mobile-auth-promo md:block">
          <Logo size={64} showText className="items-start" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-psy-text leading-tight">أيقظ طاقتك <br /><span className="text-psy-gold">الداخلية</span></h2>
            <p className="text-base md:text-lg text-psy-text/60 leading-relaxed font-light">
              الجيل القادم من منصات التحليل النفسي والعيادي الرقمي.
              احترافية، خصوصية، وابتكار في رحلتك نحو التوزان.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <div className="flex items-center gap-2 p-3 glass rounded-xl text-xs text-psy-text/40">
                <Shield size={16} className="text-psy-gold" /> بيانات مشفرة
              </div>
              <div className="flex items-center gap-2 p-3 glass rounded-xl text-xs text-psy-text/40">
                <Users size={16} className="text-psy-gold" /> دعم مجتمعي
              </div>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-left-10 duration-700 h-full">
          <GlassCard className="p-0 border-psy-gold/20 overflow-hidden shadow-[0_0_100px_rgba(212,180,131,0.1)] h-full flex flex-col">
            <div className="flex border-b border-white/5" role="tablist" aria-label="نوع الحساب">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`flex-1 p-5 font-bold text-sm transition-all ${activeTab === 'login' ? 'bg-psy-gold text-psy-bg' : 'text-psy-text/40 hover:bg-white/5'}`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                onClick={() => { setActiveTab('register'); setError(''); }}
                className={`flex-1 p-5 font-bold text-sm transition-all ${activeTab === 'register' ? 'bg-psy-gold-dim text-psy-bg' : 'text-psy-text/40 hover:bg-white/5'}`}
              >
                إنشاء حساب جديد
              </button>
            </div>

            <div className="p-4 md:p-8 space-y-6 flex-1">
              {error && (
                <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3 animate-shake">
                  <Lock size={16} aria-hidden="true" /> {error}
                </div>
              )}

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6 h-full flex flex-col">
                  <div className="space-y-4">
                    <FormGroup label="البريد الإلكتروني أو كود الحالة">
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={18} />
                        <input
                          type="text" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          placeholder="البريد أو الكود" className="form-input pr-12"
                        />
                      </div>
                    </FormGroup>
                    <FormGroup label="كلمة المرور">
                      <div className="relative">
                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={18} />
                        <input
                          type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                          placeholder="••••••••" className="form-input pr-12"
                        />
                      </div>
                    </FormGroup>
                  </div>
                  <GoldButton type="submit" className="w-full h-14" disabled={isLoading} isLoading={isLoading} aria-busy={isLoading}>
                    دخول المنصة
                  </GoldButton>

                  <div className="space-y-6 pt-8 border-t border-white/5 flex-1 min-h-fit">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-psy-gold/20" />
                      <p className="text-xs text-psy-gold/40 font-serif font-bold uppercase tracking-widest">
                        بيانات الوصول التجريبي
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-psy-gold/20" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'أخصائي', value: 'sami@psytech.app' },
                        { label: 'باحث', value: 'researcher@psytech.app' },
                        { label: 'المدير', value: 'manager@psytech.app' },
                        { label: 'حالة / مستخدم', value: 'X92J-K12L' }
                      ].map((acc, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setEmail(acc.value);
                            setPassword('demo123');
                          }}
                          className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-psy-gold/60 hover:bg-white/[0.12] active:scale-95 transition-all duration-300 cursor-pointer select-none shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[14px] font-serif font-bold text-psy-gold">{acc.label}</span>
                            <div className="w-1 h-1 rounded-full bg-psy-gold/30 group-hover:scale-150 transition-transform" />
                          </div>
                          <div className="text-[12px] text-psy-text/50 font-amiri truncate group-hover:text-psy-text/80 transition-colors">
                            {acc.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-psy-text/30 text-center font-serif italic">
                      كلمة المرور لجميع الحسابات: <span className="text-psy-gold/60 font-bold">demo123</span>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <RoleButton icon={Shield} label="أخصائي" active={role === 'clinician'} onClick={() => setRole('clinician')} />
                    <RoleButton icon={Microscope} label="باحث" active={role === 'researcher'} onClick={() => setRole('researcher')} />
                    <RoleButton icon={Users} label="حالة / مستخدم" active={role === 'patient'} onClick={() => setRole('patient')} />
                  </div>

                  <div className="space-y-4 min-h-fit">
                    <FormGroup label="الاسم الكامل">
                      <input type="text" className="form-input" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
                    </FormGroup>
                    <FormGroup label="البريد الإلكتروني">
                      <input type="email" className="form-input" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    </FormGroup>

                    {(role === 'clinician' || role === 'researcher') && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <FormGroup label="التخصص الدقيق">
                          <input type="text" className="form-input" placeholder="مثال: تحليل نفسي سلوكي" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialization(e.target.value)} />
                        </FormGroup>
                        <FormGroup label="إثبات الهوية / الشهادة المهنية">
                          <ImageUploader onImagesChange={setDocuments} />
                          <p className="text-[10px] text-psy-text/30 mt-2 italic">يرجى رفع صورة واضحة لبطاقة مزاولة المهنة أو الهوية الأكاديمية</p>
                        </FormGroup>
                      </div>
                    )}

                    {role === 'patient' && (
                      <FormGroup label="كود الإحالة (اختياري)">
                        <input type="text" className="form-input" placeholder="إذا كان لديك كود من طبيب" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value)} />
                      </FormGroup>
                    )}

                    <FormGroup label="كلمة المرور">
                      <input type="password" title="password" className="form-input" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    </FormGroup>

                    <FormGroup label="الملفات اللازمة">
                      <ImageUploader onImagesChange={() => { }} />
                      <p className="text-[10px] text-psy-text/30 mt-2 italic">ارفع أي ملفات أو مستندات تدعم طلبك</p>
                    </FormGroup>

                    <FormGroup label="معلومات إضافية / نبذة">
                      <textarea
                        className="form-input h-24"
                        placeholder="أدخل أي معلومات تشعر أنها مهمة..."
                      />
                    </FormGroup>
                  </div>

                  <GoldButton type="submit" className="w-full h-14" disabled={isLoading} isLoading={isLoading} aria-busy={isLoading}>
                    بدء الرحلة الآن
                  </GoldButton>
                </form>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const FormGroup = ({ label, children, labelClassName }: any) => (
  <div className="space-y-2">
    <label className={`text-xs font-bold text-psy-text/40 mr-2 ${labelClassName || ''}`}>{label}</label>
    {children}
  </div>
);

const RoleButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${active
      ? 'bg-psy-gold/10 border-psy-gold text-psy-gold'
      : 'border-white/5 bg-white/5 text-psy-text/40 hover:border-white/20'
      }`}
  >
    <Icon size={20} className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
