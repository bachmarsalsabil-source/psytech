import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Plus, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Printer,
  ChevronLeft,
  Clock,
  Star,
  Activity,
  AlertCircle,
  LayoutDashboard,
  Zap,
  Sparkles,
  RefreshCw,
  Archive
} from 'lucide-react';
import { 
  getCases, 
  getSessions, 
  getTasks, 
  getJournals, 
  getMessages, 
  PatientCase, 
  Session, 
  TherapeuticTask, 
  JournalEntry as JournalType, 
  Message,
  createSession,
  createTask,
  sendMessage,
  updateCase,
  getTreatmentPlan,
  saveTreatmentPlan,
  TreatmentPlan,
  getCurrentUser,
  getAssignments,
  AssessmentAssignment,
  getScales,
  createAssignment,
  getLockerItems
} from '../../lib/clinic';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { GlassCard } from '../../components/clinic/GlassCard';
import { Modal } from '../../components/clinic/Modal';
import { SessionTimeline } from '../../components/clinic/SessionTimeline';
import { TaskCard } from '../../components/clinic/TaskCard';
import { JournalEntry } from '../../components/clinic/JournalEntry';
import { MessageThread } from '../../components/clinic/MessageThread';
import { ProgressChart } from '../../components/clinic/ProgressChart';
import { useFeedback } from '../../components/clinic/FeedbackToast';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [patient, setPatient] = useState<PatientCase | undefined>(getCases().find(c => c.id === id));
  const [activeTab, setActiveTab] = useState('overview');

  // Data
  const [sessions, setSessions] = useState<Session[]>(getSessions(id));
  const [tasks, setTasks] = useState<TherapeuticTask[]>(getTasks(id));
  const [journals, setJournals] = useState<JournalType[]>(getJournals(id));
  const [messages, setMessages] = useState<Message[]>(getMessages(id || ''));
  const [plan, setPlan] = useState<TreatmentPlan | null>(getTreatmentPlan(id || ''));

  // Modals
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [assignments, setAssignments] = useState(getAssignments(id));

  useEffect(() => {
    if (!patient) navigate('/clinic/patients');
  }, [patient, navigate]);

  if (!patient) return null;

  const handleStatusChange = (status: 'active' | 'closed' | 'on-hold') => {
    updateCase(patient.id, { status });
    setPatient({ ...patient, status });
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'sessions', label: 'الجلسات', icon: Calendar },
    { id: 'tests', label: 'الاختبارات', icon: FileText },
    { id: 'plan', label: 'الخطة العلاجية', icon: Activity },
    { id: 'tasks', label: 'المهام', icon: ClipboardCheck },
    { id: 'journals', label: 'اليوميات', icon: BookOpen },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare },
    { id: 'progress', label: 'التقدم', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* Upper Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <BackButton />
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-[#D4B483] font-mono tracking-tighter">{patient.patientCode}</h1>
            <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
              patient.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
              patient.status === 'closed' ? 'bg-white/5 text-psy-text/40 border-white/10' : 
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {patient.status === 'active' ? 'حالة نشطة' : patient.status === 'closed' ? 'حالة مغلقة' : 'بانتظار المتابعة'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <GoldButton variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} /> تعديل البيانات
          </GoldButton>
          <GoldButton variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer size={16} /> طباعة التقرير
          </GoldButton>
          {patient.status !== 'closed' ? (
            <GoldButton variant="danger" size="sm" onClick={() => handleStatusChange('closed')}>
              <CheckCircle size={16} /> إغلاق الحالة
            </GoldButton>
          ) : (
            <GoldButton variant="primary" size="sm" onClick={() => handleStatusChange('active')}>
              <TrendingUp size={16} /> إعادة تفعيل
            </GoldButton>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto bg-white/5 p-1 rounded-2xl border border-white/5 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-[#D4B483] text-[#181816] shadow-xl' 
                : 'text-psy-text/40 hover:text-psy-text hover:bg-white/5'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            patient={patient} 
            sessions={sessions} 
            plan={plan} 
            onAddSession={() => setIsSessionModalOpen(true)}
            onAddTask={() => setIsTaskModalOpen(true)}
            onAddAssessment={() => setIsAssessmentModalOpen(true)} 
          />
        )}
        {activeTab === 'sessions' && <SessionsTab sessions={sessions} onAdd={() => setIsSessionModalOpen(true)} />}
        {activeTab === 'tests' && <TestsTab assignments={assignments} onAdd={() => setIsAssessmentModalOpen(true)} />}
        {activeTab === 'plan' && <PlanTab plan={plan} caseId={patient.id} onUpdate={setPlan} />}
        {activeTab === 'tasks' && <TasksTab tasks={tasks} onAdd={() => setIsTaskModalOpen(true)} />}
        {activeTab === 'journals' && <JournalsTab journals={journals} />}
        {activeTab === 'messages' && <MessagesTab messages={messages} caseId={patient.id} onSend={(m) => setMessages([...messages, m])} />}
        {activeTab === 'progress' && <ProgressTab sessions={sessions} />}
      </div>

      {/* Modals */}
      <AddSessionModal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)} 
        caseId={patient.id}
        onSuccess={(s) => {
          setSessions([s, ...sessions]);
          setPatient(getCases().find(c => c.id === patient.id));
        }}
      />

      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        caseId={patient.id}
        onSuccess={(t) => setTasks([t, ...tasks])}
      />
      
      <AddAssessmentModal 
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        caseId={patient.id}
        onSuccess={(a) => setAssignments([a, ...assignments])}
      />

      <EditPatientModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patient={patient}
        onSuccess={(p) => setPatient(p)}
      />
    </div>
  );
};

// --- Sub Tab Components ---

const OverviewTab = ({ 
  patient, 
  sessions, 
  plan, 
  onAddSession,
  onAddTask,
  onAddAssessment 
}: { 
  patient: PatientCase, 
  sessions: Session[], 
  plan: TreatmentPlan | null, 
  onAddSession: () => void,
  onAddTask: () => void,
  onAddAssessment: () => void 
}) => {
  const lastSession = sessions[0];
  
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <GlassCard className="space-y-6">
          <h3 className="font-bold text-xl border-r-4 border-[#D4B483] pr-4">بيانات الحالة</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <InfoItem label="العمر" value={patient.ageGroup} />
            <InfoItem label="الجنس" value={patient.gender === 'male' ? 'ذكر' : 'أنثى'} />
            <InfoItem label="تاريخ البدء" value={new Date(patient.createdAt).toLocaleDateString('ar-EG')} />
            <InfoItem label="المعالج" value="د. سامي الأحمد" />
            <InfoItem label="عدد الجلسات" value={`${patient.totalSessions} جلسات`} />
            <InfoItem label="مستوى الخطورة" value={patient.severityLevel === 4 ? 'حرج' : patient.severityLevel === 3 ? 'مرتفع' : 'متوسط'} />
          </div>
          
          <div className="space-y-4 pt-6 border-t border-white/5">
            <h4 className="font-bold text-psy-text/40 text-xs">سبب الزيارة</h4>
            <p className="text-sm leading-relaxed">{patient.reasonForVisit}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-psy-text/40 text-xs">الأعراض الحالية</h4>
            <div className="flex flex-wrap gap-2">
              {patient.currentSymptoms.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-[#D4B483]/10 text-[#D4B483] rounded-lg text-xs font-medium border border-[#D4B483]/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        {plan && (
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">الخطة النشطة: {plan.title}</h3>
              <span className="text-[#D4B483] font-bold">{plan.progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#D4B483]" style={{ width: `${plan.progress}%` }} />
            </div>
          </GlassCard>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <GlassCard className="p-6 bg-[#D4B483]/5 border-[#D4B483]/30">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Clock size={18} /> آخر جلسة
          </h3>
          {lastSession ? (
            <div className="space-y-4">
              <div className="text-4xl font-black text-[#D4B483]">
                {new Date(lastSession.sessionDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
              </div>
              <div className="text-xs text-psy-text/60">الجلسة رقم {lastSession.sessionNumber} • {lastSession.durationMinutes} دقيقة</div>
              <p className="text-sm italic text-psy-text/40 line-clamp-3 leading-relaxed">"{lastSession.notes}"</p>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-psy-text/20 italic">لا توجد جلسات سابقة</div>
          )}
        </GlassCard>

        <div className="grid gap-3">
          <GoldButton className="w-full justify-between h-14" variant="primary" onClick={onAddSession}>
            <Plus size={20} /> <span className="flex-1">إضافة جلسة جديدة</span>
          </GoldButton>
          <GoldButton className="w-full justify-between h-14" variant="secondary" onClick={onAddTask}>
            <ClipboardCheck size={20} /> <span className="flex-1">إرسال مهمة منزلية</span>
          </GoldButton>
          <GoldButton className="w-full justify-between h-14" variant="secondary" onClick={onAddAssessment}>
            <FileText size={20} /> <span className="flex-1">إرسال اختبار نفسي</span>
          </GoldButton>
        </div>
      </div>
    </div>
  );
};

const SessionsTab = ({ sessions, onAdd }: { sessions: Session[], onAdd: () => void }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">سجل الجلسات العلاجية</h3>
      <GoldButton onClick={onAdd}>
        <Plus size={18} /> جلسة جديدة
      </GoldButton>
    </div>
    <SessionTimeline sessions={sessions} />
  </div>
);

const TestsTab = ({ assignments, onAdd }: { assignments: AssessmentAssignment[], onAdd: () => void }) => {
  const [selectedResult, setSelectedResult] = useState<AssessmentAssignment | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">الاختبارات والمقاييس النفسية</h3>
        <GoldButton onClick={onAdd}>إرسال اختبار جديد</GoldButton>
      </div>
      
      <div className="glass overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#D4B483]/10 border-b border-white/5">
            <tr>
              <th className="p-4 text-xs font-bold">المقياس</th>
              <th className="p-4 text-xs font-bold">الحالة</th>
              <th className="p-4 text-xs font-bold">الدرجة</th>
              <th className="p-4 text-xs font-bold">تاريخ الإسناد</th>
              <th className="p-4 text-xs font-bold">الموعد النهائي</th>
              <th className="p-4 text-xs font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {assignments.length > 0 ? assignments.map((a) => (
              <tr key={a.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-sm">{a.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    a.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-yellow-400 bg-yellow-500/10'
                  }`}>
                    {a.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="p-4 text-psy-gold font-mono">{a.results ? a.results.score : '-'}</td>
                <td className="p-4 text-xs text-psy-text/40">{new Date(a.assignedAt).toLocaleDateString('ar-EG')}</td>
                <td className="p-4 text-xs text-psy-text/40">{a.deadline}</td>
                <td className="p-4">
                  {a.status === 'completed' ? (
                    <GoldButton variant="ghost" size="sm" onClick={() => setSelectedResult(a)}>عرض النتائج</GoldButton>
                  ) : (
                    <span className="text-xs text-psy-text/20">بانتظار الإجابة</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-psy-text/20 italic">لا توجد اختبارات مسندة حالياً.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedResult} onClose={() => setSelectedResult(null)} title="نتائج المقياس">
        {selectedResult && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-2xl font-black text-[#D4B483]">{selectedResult.title}</h4>
                <p className="text-xs text-psy-text/40 mt-1">تم الإكمال في: {new Date(selectedResult.completedAt!).toLocaleString('ar-EG')}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-psy-text/40 uppercase">الدرجة الكلية</div>
                <div className="text-4xl font-black text-[#D4B483]">{selectedResult.results?.score}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-sm border-b border-white/5 pb-2">تفاصيل الإجابات:</h5>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {selectedResult.results?.answers.map((ans, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-xs">{ans.questionId}</span>
                    <span className="font-bold text-psy-gold">{ans.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-sm">تفسير الدرجة / ملاحظات العيادي:</h5>
              <textarea 
                className="w-full bg-[#181816] border border-white/10 rounded-2xl p-4 text-sm min-h-32 outline-none focus:border-[#D4B483]"
                placeholder="أضف تعليقك العيادي على هذه النتائج..."
                defaultValue={selectedResult.results?.clinicianNotes}
              />
            </div>

            <GoldButton className="w-full" onClick={() => setSelectedResult(null)}>إغلاق</GoldButton>
          </div>
        )}
      </Modal>
    </div>
  );
};

const PlanTab = ({ plan, caseId, onUpdate }: { plan: TreatmentPlan | null, caseId: string, onUpdate: (p: TreatmentPlan) => void }) => {
  const { showFeedback } = useFeedback();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<TreatmentPlan>(plan || {
    id: 'plan-' + Date.now(),
    caseId,
    title: 'خطة علاج سلوكي معرفي',
    progress: 0,
    phases: [
      { id: 'p1', title: 'التقييم والصياغة', description: 'جمع المعلومات وبناء الصياغة العلاجية', isCompleted: true },
      { id: 'p2', title: 'التثقيف النفسي', description: 'شرح طبيعة القلق وأعراضه', isCompleted: false },
    ]
  });

  const handleSave = () => {
    saveTreatmentPlan(editedPlan);
    showFeedback(
      'تم تحديث الخطة العلاجية',
      `تمت إعادة صياغة وتحديث مسارات الخطة العلاجية للمريض بنجاح وفق رغبة الأخصائي.`,
      'success'
    );
    onUpdate(editedPlan);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">الخطة العلاجية</h3>
        {!isEditing ? (
          <GoldButton onClick={() => setIsEditing(true)}>تعديل الخطة</GoldButton>
        ) : (
          <div className="flex gap-2">
            <GoldButton variant="secondary" onClick={() => setIsEditing(false)}>إلغاء</GoldButton>
            <GoldButton onClick={handleSave}>حفظ التغييرات</GoldButton>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {editedPlan.phases.map((phase, i) => (
          <GlassCard key={phase.id} className={`border-r-8 ${phase.isCompleted ? 'border-emerald-500' : 'border-[#D4B483]/20'}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {phase.isCompleted ? <CheckCircle className="text-emerald-500" size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-psy-text/20" />}
                  <h4 className="font-bold">{phase.title}</h4>
                </div>
                <p className="text-sm text-psy-text/40">{phase.description}</p>
              </div>
              {isEditing && (
                <input 
                  type="checkbox" 
                  checked={phase.isCompleted} 
                  onChange={(e) => {
                    const newPhases = [...editedPlan.phases];
                    newPhases[i].isCompleted = e.target.checked;
                    setEditedPlan({ ...editedPlan, phases: newPhases, progress: Math.round((newPhases.filter(p => p.isCompleted).length / newPhases.length) * 100) });
                  }}
                  className="w-5 h-5 accent-[#D4B483]"
                />
              )}
            </div>
          </GlassCard>
        ))}
        {isEditing && (
          <button className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-psy-text/20 hover:border-[#D4B483]/20 hover:text-[#D4B483] transition-all flex items-center justify-center gap-2 font-bold">
            <Plus size={18} /> إضافة مرحلة جديدة
          </button>
        )}
      </div>
    </div>
  );
};

const TasksTab = ({ tasks, onAdd }: { tasks: TherapeuticTask[], onAdd: () => void }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">المهام والواجبات المنزلية</h3>
      <GoldButton onClick={onAdd}>
        <Plus size={18} /> إنشاء مهمة
      </GoldButton>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {tasks.length > 0 ? tasks.map(t => (
        <TaskCard key={t.id} task={t} />
      )) : (
        <div className="col-span-2 p-20 text-center glass rounded-3xl text-psy-text/20 italic">
          لم يتم تعيين أي مهام لهذه الحالة بعد.
        </div>
      )}
    </div>
  </div>
);

const JournalsTab = ({ journals }: { journals: JournalType[] }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">يوميات الحالة المشتركة</h3>
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      {journals.length > 0 ? journals.map(j => (
        <JournalEntry key={j.id} entry={j} isClinician={true} />
      )) : (
        <div className="lg:col-span-2 p-20 text-center glass rounded-3xl text-psy-text/20 italic">
          لا توجد يوميات تمت مشاركتها معك من قبل الحالة.
        </div>
      )}
    </div>
  </div>
);

const MessagesTab = ({ messages, caseId, onSend }: { messages: Message[], caseId: string, onSend: (m: Message) => void }) => {
  const [content, setContent] = useState('');
  const user = getCurrentUser();

  const handleSend = () => {
    if (!content.trim()) return;
    const msg = sendMessage({
      caseId,
      senderId: user?.id,
      senderName: user?.fullName,
      senderRole: 'clinician',
      content
    });
    onSend(msg);
    setContent('');
  };

  return (
    <GlassCard className="flex flex-col h-[600px] overflow-hidden p-0">
      <div className="p-4 border-b border-white/5 bg-[#D4B483]/5 font-bold flex items-center gap-2">
        <MessageSquare size={18} className="text-[#D4B483]" /> محادثة مع الحالة/المستخدم
      </div>
      <MessageThread messages={messages} currentUserId={user?.id || ''} />
      <div className="p-6 border-t border-white/5 flex gap-3">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483] resize-none h-14"
        />
        <GoldButton size="sm" onClick={handleSend} className="h-14 w-14 rounded-2xl">إرسال</GoldButton>
      </div>
    </GlassCard>
  );
};

const ProgressTab = ({ sessions }: { sessions: Session[] }) => {
  const chartData = useMemo(() => {
    return sessions.map(s => ({
      date: s.sessionDate,
      mood: s.moodRating,
      anxiety: s.anxietyRating,
      sleep: s.sleepRating
    })).reverse();
  }, [sessions]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">تحليل مؤشرات التقدم</h3>
        <GoldButton variant="secondary">تحميل تقرير PDF</GoldButton>
      </div>
      <ProgressChart data={chartData} />
    </div>
  );
};

// --- Modals implementation ---

const AddSessionModal = ({ isOpen, onClose, caseId, onSuccess }: any) => {
  const { showFeedback } = useFeedback();
  const [formData, setFormData] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    durationMinutes: 50,
    moodRating: 5,
    anxietyRating: 5,
    sleepRating: 5,
    notes: '',
    homework: '',
    topics: [] as string[]
  });
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = createSession({ ...formData, caseId });
    showFeedback(
      'تم تسجيل الجلسة بنجاح',
      `تم إدراج وقائع الجلسة السلوكية رقم ${session.sessionNumber} في السجل الطبي للتطبيق النفسي بنجاح.`,
      'success'
    );
    onSuccess(session);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة جلسة جديدة">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormGroup label="التاريخ">
            <input 
              type="date" value={formData.sessionDate}
              onChange={(e) => setFormData({...formData, sessionDate: e.target.value})}
              className="form-input" 
            />
          </FormGroup>
          <FormGroup label="المدة (دقيقة)">
            <input 
              type="number" value={formData.durationMinutes}
              onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
              className="form-input" 
            />
          </FormGroup>
        </div>

        <div className="space-y-4">
          <RatingSlider label="المزاج العام" value={formData.moodRating} onChange={(v) => setFormData({...formData, moodRating: v})} color="accent-[#D4B483]" />
          <RatingSlider label="مستوى القلق" value={formData.anxietyRating} onChange={(v) => setFormData({...formData, anxietyRating: v})} color="accent-red-400" />
          <RatingSlider label="جودة النوم" value={formData.sleepRating} onChange={(v) => setFormData({...formData, sleepRating: v})} color="accent-emerald-400" />
        </div>

        <FormGroup label="المواضيع التي تمت مناقشتها">
           <div className="flex gap-2">
            <input 
              value={topicInput} onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setFormData({...formData, topics: [...formData.topics, topicInput]}), setTopicInput(''))}
              className="flex-1 form-input" 
            />
            <GoldButton type="button" onClick={() => { if(topicInput) { setFormData({...formData, topics: [...formData.topics, topicInput]}); setTopicInput(''); } }}>إضافة</GoldButton>
           </div>
           <div className="flex flex-wrap gap-2 mt-2">
              {formData.topics.map(t => (
                <span key={t} className="px-2 py-1 bg-[#D4B483]/10 text-psy-gold text-[10px] rounded-md border border-[#D4B483]/20">
                  {t}
                </span>
              ))}
           </div>
        </FormGroup>

        <FormGroup label="ملاحظات الجلسة">
          <textarea 
            value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="form-input h-32 resize-none" 
          />
        </FormGroup>

        <FormGroup label="الواجب المنزلي">
          <textarea 
            value={formData.homework} onChange={(e) => setFormData({...formData, homework: e.target.value})}
            className="form-input h-20 resize-none border-dashed" 
          />
        </FormGroup>

        <div className="flex gap-4 pt-4">
          <GoldButton type="submit" className="flex-1">حفظ الجلسة</GoldButton>
          <GoldButton type="button" variant="secondary" onClick={onClose}>إلغاء</GoldButton>
        </div>
      </form>
    </Modal>
  );
};

const AddTaskModal = ({ isOpen, onClose, caseId, onSuccess }: any) => {
  const { showFeedback } = useFeedback();
  const [lockerItems] = useState(() => getLockerItems());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'behavioral' as any,
    instructions: '',
    dueDate: '',
    difficulty: 3
  });
  const [linkedLockerItemId, setLinkedLockerItemId] = useState('');

  const handleSelectLockerItem = (item: any) => {
    setFormData({
      title: item.title,
      description: item.category ? `مورد مستورد من مخزني الخاص: ${item.category}` : 'مورد علاجي مستورد من مخزني الخاص.',
      taskType: item.type === 'guide' ? 'exposure' : item.type === 'packet' ? 'mindfulness' : 'cognitive',
      instructions: item.notes || '',
      dueDate: formData.dueDate,
      difficulty: 3
    });
    setLinkedLockerItemId(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task = createTask({ 
      ...formData, 
      caseId,
      description: linkedLockerItemId 
        ? `${formData.description} (مربوط بالمخزن الخاص)` 
        : formData.description
    });
    showFeedback(
      'تم إرسال المهمة المنزلية',
      `تم تحديد وإرسال الواجب النفسي "${task.title}" للمريض بنجاح، وتحضيره للمتابعة المنزلية التفاعلية.`,
      'success'
    );
    onSuccess(task);
    onClose();
  };

  // filter any books, packets, or guides from locker
  const therapeuticLockerDocs = lockerItems.filter(i => i.type !== 'test');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إسناد مهمة جديدة">
      <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
        {therapeuticLockerDocs.length > 0 && (
          <div className="p-3.5 bg-[#D4B483]/10 border border-[#D4B483]/15 rounded-2xl space-y-2">
            <span className="text-[11px] font-black text-[#D4B483] flex items-center gap-1.5 justify-start">
              <Sparkles size={13} /> ربط واستيراد من مخزنك الخاص (الكتب والمراجع):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
              {therapeuticLockerDocs.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLockerItem(item)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold text-right border transition-all ${
                    linkedLockerItemId === item.id 
                      ? 'bg-[#D4B483] text-[#181816] border-[#D4B483]' 
                      : 'bg-white/5 text-psy-text/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <FormGroup label="عنوان المهمة">
          <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="form-input" required />
        </FormGroup>
        <FormGroup label="الوصف">
          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="form-input h-20" required />
        </FormGroup>
        <div className="grid grid-cols-2 gap-4">
           <FormGroup label="نوع المهمة">
              <select value={formData.taskType} onChange={(e) => setFormData({...formData, taskType: e.target.value})} className="form-input">
                <option value="behavioral">سلوكية</option>
                <option value="cognitive">معرفية</option>
                <option value="expressive">تعبيرية</option>
                <option value="mindfulness">يقظة ذهنية</option>
                <option value="exposure">تعرض</option>
              </select>
           </FormGroup>
           <FormGroup label="تاريخ التسليم">
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="form-input" required />
           </FormGroup>
        </div>
        <FormGroup label="تعليمات التنفيذ">
           <textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} className="form-input h-32" />
        </FormGroup>
        <RatingSlider label="مستوى الصعوبة" value={formData.difficulty} onChange={(v) => setFormData({...formData, difficulty: v})} color="accent-[#D4B483]" min={1} max={5} />
        
        <div className="flex gap-4">
          <GoldButton type="submit" className="flex-1">إرسال للحالة</GoldButton>
          <GoldButton type="button" variant="secondary" onClick={onClose}>إلغاء</GoldButton>
        </div>
      </form>
    </Modal>
  );
};

const AddAssessmentModal = ({ isOpen, onClose, caseId, onSuccess }: any) => {
  const { showFeedback } = useFeedback();
  const [step, setStep] = useState(1);
  const [scales] = useState(getScales());
  const [lockerItems] = useState(() => getLockerItems());
  const [formData, setFormData] = useState<Partial<AssessmentAssignment>>({
    title: '',
    instructions: '',
    deadline: '',
    condition: '',
    caseId
  });
  const [customItems, setCustomItems] = useState<{ id: string, text: string }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedLockerItemId, setSelectedLockerItemId] = useState('');

  // Filtering tests in high-quality specialist locker
  const lockerScales = lockerItems.filter(i => i.type === 'test');

  const handleSelectLockerScale = (item: any) => {
    setSelectedLockerItemId(item.id);
    setFormData({
      ...formData,
      title: item.title,
      instructions: item.notes || 'يرجى الإجابة بدقة وأمانة وفقاً للتعليمات السريرية.',
    });
    if (item.customQuestions) {
      setCustomItems(item.customQuestions.map((q: any) => ({
        id: q.id,
        text: q.text
      })));
    } else {
      setCustomItems([]);
    }
  };

  const handleSubmit = () => {
    const assignment = createAssignment({
      ...formData,
      customScale: customItems.length > 0 ? {
        title: formData.title,
        questions: customItems.map(item => ({
          id: item.id,
          text: item.text,
          type: 'likert'
        }))
      } : undefined
    });
    showFeedback(
      'تم إرسال المقياس النفسي',
      `تم إسناد التقييم السيكومتري بنجاح بعنوان "${assignment.title || 'مقياس جديد'}"، وتوفير المخرجات التفاعلية للحالة.`,
      'success'
    );
    onSuccess(assignment);
    onClose();
    setStep(1);
    setSelectedLockerItemId('');
    setCustomItems([]);
  };

  const addCustomItem = () => {
    if (!newItem.trim()) return;
    setCustomItems([...customItems, { id: 'q' + Date.now(), text: newItem }]);
    setNewItem('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إرسال تقييم نفسي">
      <div className="space-y-8 text-right" dir="rtl">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-[#D4B483]' : 'bg-white/5'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setStep(2)}
                className="p-6 glass rounded-3xl border border-white/5 hover:border-[#D4B483]/30 flex flex-col items-center gap-4 transition-all group text-right"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D4B483]/10 flex items-center justify-center text-[#D4B483] group-hover:scale-110 transition-transform">
                  <ClipboardCheck size={24} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm">مقياس موجود</h4>
                  <p className="text-[10px] text-psy-text/40 mt-1">المنشور والموجود بالنظام</p>
                </div>
              </button>

              <button 
                onClick={() => setStep(5)}
                className="p-6 glass rounded-3xl border border-white/5 hover:border-[#D4B483]/30 flex flex-col items-center gap-4 transition-all group text-right"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Archive size={24} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm">مخزنك الخاص</h4>
                  <p className="text-[10px] text-psy-text/40 mt-1">مقاييسك المقتناة أو المرفوعة</p>
                </div>
              </button>

              <button 
                onClick={() => setStep(3)}
                className="p-6 glass rounded-3xl border border-white/5 hover:border-[#D4B483]/30 flex flex-col items-center gap-4 transition-all group text-right"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Edit size={24} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm">بناء بنود جديدة</h4>
                  <p className="text-[10px] text-psy-text/40 mt-1">صيانة معيار جديد مخصص</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <FormGroup label="اختر المقياس المعتمد">
              <select 
                className="form-input text-right select-option h-[42px] bg-white/5 cursor-pointer appearance-none"
                onChange={(e) => {
                  const s = scales.find(sc => sc.id === e.target.value);
                  if (s) setFormData({ ...formData, scaleId: s.id, title: s.title });
                }}
              >
                <option value="">-- اختر من القائمة --</option>
                {scales.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </FormGroup>
            <GoldButton className="w-full h-11" onClick={() => setStep(4)}>المتابعة للشروط</GoldButton>
            <button className="w-full text-xs text-psy-text/40 font-bold" onClick={() => setStep(1)}>رجوع</button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <FormGroup label="اختر من مقاييس مخزنك الخاص">
              <select 
                className="form-input text-right select-option h-[42px] bg-white/5 cursor-pointer appearance-none"
                value={selectedLockerItemId}
                onChange={(e) => {
                  const s = lockerScales.find(sc => sc.id === e.target.value);
                  if (s) handleSelectLockerScale(s);
                }}
              >
                <option value="">-- اختر مقياس من Locker --</option>
                {lockerScales.map(scale => (
                  <option key={scale.id} value={scale.id}>{scale.title}</option>
                ))}
              </select>
            </FormGroup>

            {selectedLockerItemId && customItems.length > 0 && (
              <div className="p-3.5 bg-[#D4B483]/5 border border-[#D4B483]/10 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-psy-gold block">البنود المدرجة للاستيراد:</span>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {customItems.map((item, idx) => (
                    <div key={item.id} className="text-[11px] text-psy-text/60">
                      {idx + 1}. {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <GoldButton 
              className="w-full h-11" 
              onClick={() => setStep(4)}
              disabled={!selectedLockerItemId}
            >
              المتابعة للشروط
            </GoldButton>
            <button className="w-full text-xs text-psy-text/40 font-bold" onClick={() => setStep(1)}>رجوع</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <FormGroup label="عنوان المقياس المقترح">
              <input 
                className="form-input text-right" value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="مثال: رصد الأفكار التلقائية السلبية"
              />
            </FormGroup>
            <div className="space-y-3">
              <label className="text-xs font-bold text-psy-text/60">البنود الجديدة</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 form-input text-right placeholder:text-psy-text/20" value={newItem} 
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="اكتب البند هنا..."
                  onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                />
                <GoldButton onClick={addCustomItem} size="sm">إضافة</GoldButton>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                {customItems.map((item, i) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs">{item.text}</span>
                    <button onClick={() => setCustomItems(customItems.filter(it => it.id !== item.id))} className="text-red-400 p-1 hover:bg-red-500/10 rounded-lg">
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <GoldButton className="w-full h-11" onClick={() => setStep(4)} disabled={!formData.title || customItems.length === 0}>المتابعة للشروط</GoldButton>
            <button className="w-full text-xs text-psy-text/40 font-bold" onClick={() => setStep(1)}>رجوع</button>
          </div>
        )}

        {step === 4 && (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="الموعد النهائي">
                <input type="date" className="form-input text-right" required onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
              </FormGroup>
              <FormGroup label="شروط الإنجاز">
                <select className="form-input text-right appearance-none bg-white/5 h-[42px] cursor-pointer" onChange={(e) => setFormData({...formData, condition: e.target.value})}>
                  <option value="anytime">في أي وقت</option>
                  <option value="morning">صباحاً فقط</option>
                  <option value="vitals">بعد رصد النبض</option>
                  <option value="session">قبل الجلسة القادمة</option>
                </select>
              </FormGroup>
            </div>
            <FormGroup label="تعليمات إضافية للحالة">
              <textarea 
                className="form-input h-32 text-right" 
                placeholder="مثال: يرجى الإجابة في مكان هادئ وبصراحة تامة..."
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              />
            </FormGroup>
            <GoldButton className="w-full h-14" type="submit">إرسال للحالة الآن</GoldButton>
            <button className="w-full text-xs text-psy-text/40 font-bold" type="button" onClick={() => {
              if (selectedLockerItemId) setStep(5);
              else if (formData.scaleId) setStep(2);
              else setStep(3);
            }}>رجوع</button>
          </form>
        )}
      </div>
    </Modal>
  );
};

const EditPatientModal = ({ isOpen, onClose, patient, onSuccess }: any) => {
  const [formData, setFormData] = useState(patient);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCase(patient.id, formData);
    onSuccess(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تعديل بيانات الحالة">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormGroup label="سبب الزيارة">
          <textarea value={formData.reasonForVisit} onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})} className="form-input h-24" />
        </FormGroup>
        <FormGroup label="التاريخ النفسي">
          <textarea value={formData.psychologicalHistory} onChange={(e) => setFormData({...formData, psychologicalHistory: e.target.value})} className="form-input h-48" />
        </FormGroup>
        <div className="flex gap-4">
          <GoldButton type="submit" className="flex-1">حفظ التغييرات</GoldButton>
          <GoldButton type="button" variant="secondary" onClick={onClose}>إلغاء</GoldButton>
        </div>
      </form>
    </Modal>
  );
};

// --- Helpers ---

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <div className="text-[10px] text-psy-text/40 font-bold mb-1 uppercase tracking-wider">{label}</div>
    <div className="text-sm font-bold">{value}</div>
  </div>
);

const FormGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-psy-text/60 pr-1">{label}</label>
    {children}
  </div>
);

const RatingSlider = ({ label, value, onChange, color, min = 1, max = 10 }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-bold">
      <span className="text-psy-text/40">{label}</span>
      <span className={color.replace('accent-', 'text-')}>{value} / {max}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full ${color}`}
    />
  </div>
);
