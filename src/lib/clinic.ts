import { PsychologicalScale } from '../types';

export type UserRole = 'clinician' | 'patient' | 'arbitrator' | 'researcher' | 'owner';

export interface ClinicUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  specialization?: string;
  avatarUrl?: string;
  patientCode?: string; // For patients
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
}

export type CaseStatus = 'active' | 'closed' | 'on-hold';

export interface PatientCase {
  id: string;
  patientCode: string;
  ageGroup: string;
  gender: 'male' | 'female';
  reasonForVisit: string;
  psychologicalHistory: string;
  currentSymptoms: string[];
  severityLevel: number; // 1-4
  riskLevel?: 'low' | 'moderate' | 'medium' | 'high' | 'critical';
  status: CaseStatus;
  createdAt: string;
  clinicianId: string;
  lastSessionDate?: string;
  totalSessions: number;
}

export interface Session {
  id: string;
  caseId: string;
  clinicianId: string;
  sessionNumber: number;
  sessionDate: string;
  durationMinutes: number;
  moodRating: number; // 1-10
  anxietyRating: number;
  sleepRating: number;
  topics: string[];
  notes: string;
  homework: string;
  linkedTaskIds: string[];
  linkedScaleIds: string[];
}

export type TaskType = 'behavioral' | 'cognitive' | 'expressive' | 'mindfulness' | 'exposure';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface TherapeuticTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  taskType: TaskType;
  instructions: string;
  startDate: string;
  dueDate: string;
  difficulty: number; // 1-5
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  patientFeedback?: string;
}

export interface JournalEntry {
  id: string;
  caseId: string;
  title: string;
  content: string;
  entryType: string;
  moodRating: number;
  isSharedWithClinician: boolean;
  drawingData?: string;
  audioData?: string;
  imageAttachments: string[];
  clinicianComment?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clinicianId: string;
  caseId: string;
  patientName: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes: string;
}

export interface TreatmentPlan {
  id: string;
  caseId: string;
  title: string;
  progress: number;
  phases: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
  }[];
}

export interface ClinicNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId: string | null;
}

// --- Local Storage Management ---

const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- MOCK DATA INITIALIZATION ---

const INITIAL_USER: ClinicUser = {
  id: 'clinician-1',
  fullName: 'د. سامي الأحمد',
  email: 'sami@psytech.app',
  role: 'clinician',
  specialization: 'معالج نفسي سلوكي معرفي',
};

const INITIAL_CASES: PatientCase[] = [
  {
    id: 'case-1',
    patientCode: 'X92J-K12L',
    ageGroup: '25-30',
    gender: 'male',
    reasonForVisit: 'قلق مزمن وصعوبات في التوافق الاجتماعي',
    psychologicalHistory: 'بدأت الأعراض منذ عامين بعد تغير وظيفي...',
    currentSymptoms: ['خفقان', 'أرق', 'تجنب اجتماعي'],
    severityLevel: 3,
    status: 'active',
    createdAt: '2024-01-15',
    clinicianId: 'clinician-1',
    lastSessionDate: '2024-04-20',
    totalSessions: 8,
  }
];

const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sess-1',
    caseId: 'case-1',
    clinicianId: 'clinician-1',
    sessionNumber: 8,
    sessionDate: '2024-04-20',
    durationMinutes: 50,
    moodRating: 6,
    anxietyRating: 4,
    sleepRating: 7,
    topics: ['مواجهة الأفكار الكارثية', 'تقنيات الاسترخاء'],
    notes: 'تحسن ملحوظ في التحكم في نوبات الذعر.',
    homework: 'تمرين التنفس المربع مرتين يومياً.',
    linkedTaskIds: [],
    linkedScaleIds: []
  }
];

const INITIAL_NOTIFICATIONS: ClinicNotification[] = [
  {
    id: 'notif-1',
    userId: 'clinician-1',
    title: 'تحديث من مريض',
    message: 'قام المريض X92J بإضافة يومية جديدة ومشاركتها معك.',
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedId: 'case-1'
  }
];

export interface AssessmentAssignment {
  id: string;
  caseId: string;
  scaleId?: string; // If using an existing scale
  customScale?: Partial<PsychologicalScale>; // If building custom items
  title: string;
  instructions: string;
  deadline: string;
  condition?: string; // Conditions for completion
  status: 'pending' | 'completed';
  assignedAt: string;
  completedAt?: string;
  results?: {
    score: number;
    answers: { questionId: string; value: number }[];
    clinicianNotes?: string;
  };
}

// --- APP FUNCTIONS ---

export const getAssignments = (caseId?: string): AssessmentAssignment[] => {
  const assignments = getStorage<AssessmentAssignment[]>('clinic_assignments_new', []);
  return caseId ? assignments.filter(a => a.caseId === caseId) : assignments;
};

export const createAssignment = (data: Partial<AssessmentAssignment>): AssessmentAssignment => {
  const assignments = getAssignments();
  const newAssignment: AssessmentAssignment = {
    id: Date.now().toString(),
    caseId: data.caseId || '',
    title: data.title || '',
    instructions: data.instructions || '',
    deadline: data.deadline || '',
    condition: data.condition || '',
    status: 'pending',
    assignedAt: new Date().toISOString(),
    ...data
  };
  setStorage('clinic_assignments_new', [...assignments, newAssignment]);
  return newAssignment;
};

export const updateAssignment = (id: string, data: Partial<AssessmentAssignment>) => {
  const assignments = getAssignments();
  const updated = assignments.map(a => a.id === id ? { ...a, ...data } : a);
  setStorage('clinic_assignments_new', updated);
};

export const getScales = (): PsychologicalScale[] => {
  const defaultScales: PsychologicalScale[] = [
    {
      id: 'scale-1',
      title: 'مقياس بيك للاكتئاب (BDI-II)',
      description: 'أداة للتقييم الذاتي لشدة الاكتئاب.',
      instructions: 'يرجى اختيار العبارة التي تصف شعورك بدقة خلال الأسبوعين الماضيين.',
      questions: [
        { id: 'q1', text: 'أشعر بالحزن أغلب الوقت', type: 'likert' },
        { id: 'q2', text: 'أشعر بالتشاؤم تجاه المستقبل', type: 'likert' },
        { id: 'q3', text: 'أشعر بالفشل أكثر من الشخص العادي', type: 'likert' }
      ],
      authorId: 'system',
      category: 'Depression',
      isPublished: true
    },
    {
      id: 'scale-2',
      title: 'مقياس القلق العام (GAD-7)',
      description: 'أداة فحص سريعة لاضطراب القلق العام.',
      instructions: 'كم مرة شعرت بالانزعاج من المشكلات التالية خلال الأسبوعين الماضيين؟',
      questions: [
        { id: 'q1', text: 'الشعور بالعصبية أو التوتر', type: 'likert' },
        { id: 'q2', text: 'عدم القدرة على التوقف عن القلق', type: 'likert' },
        { id: 'q3', text: 'القلق الكثير بشأن أشياء مختلفة', type: 'likert' }
      ],
      authorId: 'system',
      category: 'Anxiety',
      isPublished: true
    }
  ];
  const stored = getStorage<PsychologicalScale[]>('psychological_scales', []);
  return stored.length > 0 ? stored : defaultScales;
};

export const getCurrentUser = (): ClinicUser | null => {
  const user = localStorage.getItem('clinic_user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('clinic_user');
  // Also clear any other session-specific keys if they exist
  localStorage.removeItem('current_patient_code'); 
};

export const loginUser = (user: ClinicUser) => {
  setStorage('clinic_user', user);
};

export const updateUserProfile = (data: Partial<ClinicUser>) => {
  const user = getCurrentUser();
  if (user) {
    const updated = { ...user, ...data };
    setStorage('clinic_user', updated);
    window.dispatchEvent(new CustomEvent('psytech:user-updated'));
    return updated;
  }
  return null;
};

// --- REAL-TIME CLINICAL INFORMATION SYSTEM & RELATIONAL AUDIT LOGS ---

export interface ClinicalLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  relationalId?: string;
  timestamp: string;
  type: 'clinical' | 'research' | 'financial' | 'system';
}

export const getAuditLogs = (): ClinicalLog[] => {
  return getStorage<ClinicalLog[]>('clinic_audit_logs', [
    {
      id: 'log-init',
      userId: 'system',
      userName: 'النظام السلوكي الآلي',
      userRole: 'owner',
      action: 'إطلاق النظام المعلوماتي السيكومتري الموفر',
      details: 'تم بنجاح تشغيل بنية البيانات المترابطة (Relational Database Core) وحزمة التتبع الطبي والنفسي للباحثين والأخصائيين.',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      type: 'system'
    },
    {
      id: 'log-seed-1',
      userId: 'clinician-1',
      userName: 'د. سامي الأحمد',
      userRole: 'clinician',
      action: 'تفعيل بروتوكول العلاج السلوكي المعرفي',
      details: 'تم ربط ملف الحالة النشطة X92J بخطة علاج الاكتئاب المعتمدة ومقياس بيك للاكتئاب.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: 'clinical',
      relationalId: 'case-1'
    }
  ]);
};

export const createAuditLog = (
  action: string, 
  details: string, 
  type: 'clinical' | 'research' | 'financial' | 'system', 
  relationalId?: string
): ClinicalLog => {
  const logs = getAuditLogs();
  const user = getCurrentUser() || { id: 'clinician-1', fullName: 'د. سامي الأحمد', role: 'clinician' };
  const newLog: ClinicalLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    userId: user.id || 'system',
    userName: user.fullName || 'مستخدم النظام',
    userRole: user.role,
    action,
    details,
    relationalId,
    timestamp: new Date().toISOString(),
    type
  };
  setStorage('clinic_audit_logs', [newLog, ...logs]);
  return newLog;
};

export const getCases = (): PatientCase[] => getStorage('clinic_cases', INITIAL_CASES);

export const createCase = (data: Partial<PatientCase>): PatientCase => {
  const cases = getCases();
  const newCase: PatientCase = {
    id: Date.now().toString(),
    patientCode: data.patientCode || '',
    ageGroup: data.ageGroup || '',
    gender: data.gender || 'male',
    reasonForVisit: data.reasonForVisit || '',
    psychologicalHistory: data.psychologicalHistory || '',
    currentSymptoms: data.currentSymptoms || [],
    severityLevel: data.severityLevel || 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    clinicianId: 'clinician-1',
    totalSessions: 0,
    ...data
  };
  setStorage('clinic_cases', [...cases, newCase]);
  
  createAuditLog(
    'إنشاء ملف طبي نفسي جديد',
    `تم تسجيل حالة مريض جديدة بالرمز السري ${newCase.patientCode}، مستوى الخطورة: ${newCase.severityLevel}، الأعراض: ${newCase.currentSymptoms.join('، ') || 'غير محددة'}`,
    'clinical',
    newCase.id
  );
  
  return newCase;
};

export const updateCase = (id: string, data: Partial<PatientCase>) => {
  const cases = getCases();
  const updated = cases.map(c => c.id === id ? { ...c, ...data } : c);
  setStorage('clinic_cases', updated);
  
  createAuditLog(
    'تعديل ملف الحالة الإكلينيكية',
    `تم إجراء تحديث طبي لمعطيات المريض رقم المعرف: ${id}`,
    'clinical',
    id
  );
};

export const getSessions = (caseId?: string): Session[] => {
  const sess = getStorage<Session[]>('clinic_sessions', INITIAL_SESSIONS);
  return caseId ? sess.filter(s => s.caseId === caseId) : sess;
};

export const createSession = (data: Partial<Session>): Session => {
  const sessions = getSessions();
  const newSession: Session = {
    id: Date.now().toString(),
    caseId: data.caseId || '',
    clinicianId: 'clinician-1',
    sessionNumber: sessions.filter(s => s.caseId === data.caseId).length + 1,
    sessionDate: data.sessionDate || new Date().toISOString(),
    durationMinutes: data.durationMinutes || 45,
    moodRating: data.moodRating || 5,
    anxietyRating: data.anxietyRating || 5,
    sleepRating: data.sleepRating || 5,
    topics: data.topics || [],
    notes: data.notes || '',
    homework: data.homework || '',
    linkedTaskIds: data.linkedTaskIds || [],
    linkedScaleIds: data.linkedScaleIds || [],
    ...data
  };
  setStorage('clinic_sessions', [...sessions, newSession]);
  
  // Update case last session date
  updateCase(newSession.caseId, { 
    lastSessionDate: newSession.sessionDate,
    totalSessions: sessions.filter(s => s.caseId === data.caseId).length + 1
  });

  createAuditLog(
    'جدولة وتوثيق جلسة علاجية رقمية',
    `أرشفة وقائع الجلسة رقم ${newSession.sessionNumber} للمريض. الملاحظات: ${newSession.notes || 'لا يوجد'} • الواجب: ${newSession.homework || 'لا يوجد'} • تقييم المزاج الحالي: ${newSession.moodRating}/10`,
    'clinical',
    newSession.caseId
  );
  
  return newSession;
};

export const getTasks = (caseId?: string): TherapeuticTask[] => {
  const tasks = getStorage<TherapeuticTask[]>('clinic_tasks', []);
  return caseId ? tasks.filter(t => t.caseId === caseId) : tasks;
};

export const createTask = (data: Partial<TherapeuticTask>): TherapeuticTask => {
  const tasks = getTasks();
  const newTask: TherapeuticTask = {
    id: Date.now().toString(),
    caseId: data.caseId || '',
    title: data.title || '',
    description: data.description || '',
    taskType: data.taskType || 'behavioral',
    instructions: data.instructions || '',
    startDate: data.startDate || new Date().toISOString(),
    dueDate: data.dueDate || '',
    difficulty: data.difficulty || 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...data
  };
  setStorage('clinic_tasks', [...tasks, newTask]);

  createAuditLog(
    'تكليف بواجب علاجي سلوكي ومعرفي',
    `تم إملاء واجب نفسي جديد للمريض بعنوان: ${newTask.title} • نوع المهمة: ${newTask.taskType} • التعليمات: ${newTask.instructions}`,
    'clinical',
    newTask.caseId
  );

  return newTask;
};

export const updateTask = (id: string, data: Partial<TherapeuticTask>) => {
  const tasks = getTasks();
  const originalTask = tasks.find(t => t.id === id);
  const updated = tasks.map(t => t.id === id ? { ...t, ...data } : t);
  setStorage('clinic_tasks', updated);
  
  if (originalTask) {
    createAuditLog(
      'تحديث حالة الواجب العلاجي',
      `تم نقل حالة المهمة "${originalTask.title}" إلى: ${data.status} • الملاحظات/التغذية الراجعة: ${data.patientFeedback || 'لم تسجل بعد'}`,
      'clinical',
      originalTask.caseId
    );
  }
};

export const getJournals = (caseId?: string): JournalEntry[] => {
  const journals = getStorage<JournalEntry[]>('clinic_journals', []);
  return caseId ? journals.filter(j => j.caseId === caseId) : journals;
};

export const saveJournal = (entry: JournalEntry) => {
  const journals = getJournals();
  const exists = journals.find(j => j.id === entry.id);
  if (exists) {
    setStorage('clinic_journals', journals.map(j => j.id === entry.id ? entry : j));
  } else {
    setStorage('clinic_journals', [...journals, entry]);
  }

  createAuditLog(
    'توثيق ومشاركة يومية مريض أوتوماتيكية',
    `تم قيد تدوينة يومية جديدة في السجل السلوكي تتبع الحالة: ${entry.title} • تقييم المزاج الذاتي: ${entry.moodRating}/10 • مشاركتها مع المعالج: ${entry.isSharedWithClinician ? 'مفعلة' : 'معطلة'}`,
    'clinical',
    entry.caseId
  );
};

export const getMessages = (caseId: string): Message[] => {
  const msgs = getStorage<Message[]>('clinic_messages', []);
  return msgs.filter(m => m.caseId === caseId);
};

export const sendMessage = (data: Partial<Message>): Message => {
  const msgs = getStorage<Message[]>('clinic_messages', []);
  const newMsg: Message = {
    id: Date.now().toString(),
    caseId: data.caseId || '',
    senderId: data.senderId || '',
    senderName: data.senderName || '',
    senderRole: data.senderRole || 'clinician',
    content: data.content || '',
    createdAt: new Date().toISOString(),
  };
  setStorage('clinic_messages', [...msgs, newMsg]);

  createAuditLog(
    'إرسال مراسلة مريض-أخصائي مشفرة',
    `إرسال رسالة توجيهية آمنة في غرفة التتبع رقم ${newMsg.caseId} • المحتوى: ${newMsg.content.slice(0, 40)}...`,
    'clinical',
    newMsg.caseId
  );

  return newMsg;
};

export const getAppointments = (): Appointment[] => getStorage('clinic_appointments', []);

export const createAppointment = (data: Partial<Appointment>): Appointment => {
  const apps = getAppointments();
  const newApp: Appointment = {
    id: Date.now().toString(),
    clinicianId: 'clinician-1',
    caseId: data.caseId || '',
    patientName: data.patientName || '',
    title: data.title || '',
    date: data.date || '',
    time: data.time || '',
    duration: data.duration || 45,
    type: data.type || 'حضوري',
    notes: data.notes || '',
  };
  setStorage('clinic_appointments', [...apps, newApp]);

  createAuditLog(
    'جدولة وتوثيق موعد جلسة علاجية مستقلة',
    `تم تسجيل موعد مسبق للمريض ${newApp.patientName} في ${newApp.date} على الساعة ${newApp.time} • نوع الجلسة: ${newApp.type}`,
    'clinical',
    newApp.caseId
  );

  return newApp;
};

export const getNotificationsByUser = (userId: string): ClinicNotification[] => {
  const all = getStorage<ClinicNotification[]>('clinic_notifications', INITIAL_NOTIFICATIONS);
  return all.filter(n => n.userId === userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
};

export const markNotificationAsRead = (id: string) => {
  const all = getStorage<ClinicNotification[]>('clinic_notifications', []);
  setStorage('clinic_notifications', all.map(n => n.id === id ? { ...n, isRead: true } : n));
};

export const getUnreadCount = (userId: string): number => {
  return getNotificationsByUser(userId).filter(n => !n.isRead).length;
};

export const getClinicStats = (clinicianId: string) => {
  const cases = getCases().filter(c => c.clinicianId === clinicianId);
  const activeCases = cases.filter(c => c.status === 'active').length;
  const sessions = getSessions().filter(s => s.clinicianId === clinicianId);
  const tasks = getTasks();
  const unreadCount = getUnreadCount(clinicianId);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return {
    activeCases,
    thisMonthSessions: sessions.filter(s => s.sessionDate.startsWith(currentMonth)).length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    unreadNotifications: unreadCount
  };
};

export const getCasesByClinician = (id: string) => getCases().filter(c => c.clinicianId === id);

const REGISTERED_USERS_KEY = 'clinic_registered_users';

export interface RegisteredUser extends ClinicUser {
  passwordHash: string;
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `psytech_${Math.abs(hash).toString(36)}`;
}

export const getRegisteredUsers = (): RegisteredUser[] =>
  getStorage<RegisteredUser[]>(REGISTERED_USERS_KEY, []);

export const registerUser = (user: ClinicUser, password: string): { ok: true } | { ok: false; error: string } => {
  if (password.length < 6) {
    return { ok: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' };
  }

  const users = getRegisteredUsers();
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: 'البريد الإلكتروني مسجل مسبقاً.' };
  }

  setStorage(REGISTERED_USERS_KEY, [...users, { ...user, passwordHash: hashPassword(password) }]);
  return { ok: true };
};

export const authenticateUser = (emailOrCode: string, password: string): ClinicUser | null => {
  const normalized = emailOrCode.trim().toLowerCase();
  const users = getRegisteredUsers();
  const match = users.find(
    u => u.email.toLowerCase() === normalized || u.patientCode?.toLowerCase() === normalized
  );

  if (match && match.passwordHash === hashPassword(password)) {
    const { passwordHash: _, ...user } = match;
    return user;
  }

  return null;
};

export const initClinicData = () => {
  const legacyUser = localStorage.getItem('clinic_current_user');
  if (legacyUser && !localStorage.getItem('clinic_user')) {
    localStorage.setItem('clinic_user', legacyUser);
    localStorage.removeItem('clinic_current_user');
  }

  if (!localStorage.getItem('clinic_cases')) {
    setStorage('clinic_cases', INITIAL_CASES);
  }
  if (!localStorage.getItem('clinic_sessions')) {
    setStorage('clinic_sessions', INITIAL_SESSIONS);
  }
  if (!localStorage.getItem('clinic_notifications')) {
    setStorage('clinic_notifications', INITIAL_NOTIFICATIONS);
  }
};
export const getCaseById = (id: string) => getCases().find(c => c.id === id);
export const getSessionsByCase = (id: string) => getSessions(id);
export const getTasksByCase = (id: string) => getTasks(id);
export const getTasksByPatient = (id: string) => getTasks().filter(t => t.caseId === id);
export const getJournalsByPatient = (id: string) => getJournals().filter(j => j.caseId === id);
export const getAppointmentsByPatient = (id: string) => getAppointments().filter(a => a.caseId === id);

export const getTreatmentPlan = (caseId: string): TreatmentPlan | null => {
  const plans = getStorage<TreatmentPlan[]>('clinic_plans', []);
  return plans.find(p => p.caseId === caseId) || null;
};

export const saveTreatmentPlan = (plan: TreatmentPlan) => {
  const plans = getStorage<TreatmentPlan[]>('clinic_plans', []);
  const index = plans.findIndex(p => p.caseId === plan.caseId);
  if (index > -1) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  setStorage('clinic_plans', plans);
};

// --- Clinic Economics ---

export interface ReferralRequest {
  id: string;
  patientName: string;
  source: string;
  specialty: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
  fee: number;
}

export interface EconomicTransaction {
  id: string;
  type: 'income' | 'expense';
  category: 'session' | 'tool' | 'referral' | 'overhead';
  amount: number;
  description: string;
  date: string;
}

export const getReferrals = (): ReferralRequest[] => {
  return getStorage<ReferralRequest[]>('clinic_referrals', [
    { id: 'ref-1', patientName: 'أحمد محمود', source: 'العيادة الجامعية', specialty: 'طب نفسي عام', status: 'pending', date: new Date().toISOString(), fee: 5000 },
    { id: 'ref-2', patientName: 'سارة خالد', source: 'تطبيق صحة', specialty: 'علاج سلوكي', status: 'accepted', date: new Date().toISOString(), fee: 3500 }
  ]);
};

export const getClinicTransactions = (): EconomicTransaction[] => {
  return getStorage<EconomicTransaction[]>('clinic_transactions', [
    { id: 'ctx-1', type: 'income', category: 'session', amount: 8000, description: 'جلسة علاجية - كود M102', date: new Date().toISOString() },
    { id: 'ctx-2', type: 'expense', category: 'tool', amount: 1500, description: 'استخدام مقياس الذكاء', date: new Date().toISOString() },
    { id: 'ctx-3', type: 'income', category: 'referral', amount: 3500, description: 'عمولة إحالة - سارة خالد', date: new Date().toISOString() }
  ]);
};

// --- Specialist Personal Locker (المخزن الخاص للأخصائي) ---

export interface LockerItem {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'test' | 'packet' | 'guide';
  category: string;
  source: 'library' | 'uploaded';
  url?: string;
  tags: string[];
  isFavorite: boolean;
  notes?: string;
  customQuestions?: { id: string; text: string; type: string }[]; // For diagnostic prefilled items
  createdAt: string;
}

export const getLockerItems = (): LockerItem[] => {
  const defaultItems: LockerItem[] = [
    {
      id: 'locker-1',
      title: 'مقدمة في العلاج السلوكي المعرفي (CBT)',
      author: 'د. سامي محمود',
      type: 'book',
      category: 'تعليمي',
      source: 'library',
      tags: ['CBT', 'علاج سلوكي معرفي', 'دليل المعالج'],
      isFavorite: true,
      notes: 'دليل مرجعي ممتاز لشرح العلاقة الذاتية بين الأفكار والانفعالات والسلوكيات ومخطط بيك المعرفي.',
      createdAt: '2024-04-16T10:00:00Z',
    },
    {
      id: 'locker-2',
      title: 'مقياس رصد الأفكار التلقائية السلبية (NATs)',
      author: 'مختبر PsyTech للأبحاث',
      type: 'test',
      category: 'تقييم نفسي',
      source: 'uploaded',
      tags: ['أفكار سلبية', 'تشوهات معرفية', 'تقييم يومي'],
      isFavorite: true,
      notes: 'يُستخدم لرصد الأفكار المشوهة كالتفكير الكارثي والكل أو لا شيء خلال الأسبوع الأول من الجلسات.',
      customQuestions: [
        { id: 'nq1', text: 'أشعر أن أسوأ الاحتمالات سيحدث لي دائماً', type: 'likert' },
        { id: 'nq2', text: 'أقوم بجلد ذاتي عندما أرتكب خطأً بسيطاً', type: 'likert' },
        { id: 'nq3', text: 'أعتقد أن الناس يقيمونني بشكل سلبي ومقلق', type: 'likert' }
      ],
      createdAt: '2024-04-18T14:30:00Z',
    },
    {
      id: 'locker-3',
      title: 'أجندة التيقظ والتركيز التنفسي الموجه',
      author: 'مكتبة الصحة الاستشفائية',
      type: 'packet',
      category: 'يقظة ذهنية',
      source: 'library',
      tags: ['استرخاء', 'تنفس', 'تأمل'],
      isFavorite: false,
      notes: 'بروتوكول واجب منزلي متميز للمرضى الذين يعانون من القلق والتوتر الجسدي المعمم.',
      createdAt: '2024-04-20T11:15:00Z',
    },
    {
      id: 'locker-4',
      title: 'بروتوكول المواجهة التدريجية لحالات رهاب الساح (Agoraphobia)',
      author: 'أ.د. منى زكي',
      type: 'guide',
      category: 'تعرض ممنهج',
      source: 'library',
      tags: ['فوبيا', 'تعرض', 'سلوك'],
      isFavorite: false,
      notes: 'خطة تعرض مدرجة ومقرونة بتقييم دوري لشدة استجابة الهلع لتخفيف تجنب الأماكن العامة المفتوحة.',
      createdAt: '2024-04-22T09:00:00Z',
    }
  ];
  
  const stored = getStorage<LockerItem[]>('clinic_locker_items', []);
  return stored.length > 0 ? stored : defaultItems;
};

export const saveLockerItems = (items: LockerItem[]) => {
  setStorage('clinic_locker_items', items);
};

export const addLockerItem = (item: Omit<LockerItem, 'id' | 'createdAt'>): LockerItem => {
  const items = getLockerItems();
  const newItem: LockerItem = {
    ...item,
    id: `locker-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  saveLockerItems([...items, newItem]);
  
  createAuditLog(
    'إضافة مادة للمخزن الخاص للأخصائي',
    `تمت إضافة مادة جديدة للمخزن الخاص بعنوان: ${newItem.title} • النوع: ${newItem.type}`,
    'clinical'
  );
  
  return newItem;
};

export const deleteLockerItem = (id: string) => {
  const items = getLockerItems();
  const filtered = items.filter(i => i.id !== id);
  saveLockerItems(filtered);
};

export const toggleLockerItemFavorite = (id: string): boolean => {
  const items = getLockerItems();
  let nextState = false;
  const updated = items.map(i => {
    if (i.id === id) {
      nextState = !i.isFavorite;
      return { ...i, isFavorite: nextState };
    }
    return i;
  });
  saveLockerItems(updated);
  return nextState;
};

export const updateLockerItemNotes = (id: string, notes: string) => {
  const items = getLockerItems();
  const updated = items.map(i => i.id === id ? { ...i, notes } : i);
  saveLockerItems(updated);
};

