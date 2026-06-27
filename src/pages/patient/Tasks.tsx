import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Calendar,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { getCurrentUser, getTasks, getCases, TaskStatus, getAssignments, AssessmentAssignment } from '../../lib/clinic';
import { TaskCard } from '../../components/clinic/TaskCard';
import { BackButton } from '../../components/clinic/BackButton';
import { EmptyState } from '../../components/clinic/EmptyState';
import { AssessmentPlayer } from '../../components/clinic/AssessmentPlayer';
import { GoldButton } from '../../components/clinic/GoldButton';

export const PatientTasks: React.FC = () => {
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all' | 'assessments'>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentAssignment | null>(null);
  
  const allTasks = getTasks(patientCase?.id);
  const assessments = getAssignments(patientCase?.id);

  const filteredTasks = allTasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || t.status === activeTab;
    return matchesSearch && (activeTab !== 'assessments' && matchesTab);
  }).sort((a,b) => b.createdAt.localeCompare(a.createdAt));

  const filteredAssessments = assessments.filter(a => {
    return (a.title || '').toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a,b) => b.assignedAt.localeCompare(a.assignedAt));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">قائمة مهامي</h1>
          <p className="text-psy-text/40">لديك {allTasks.filter(t => t.status !== 'completed').length + assessments.filter(a => a.status !== 'completed').length} مهام وتقييمات نشطة</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
          <input 
            type="text"
            placeholder="البحث في قائمة المهام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4B483] transition-all"
          />
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 self-stretch overflow-x-auto no-scrollbar">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>الكل</TabButton>
          <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>مهام معلقة</TabButton>
          <TabButton active={activeTab === 'assessments'} onClick={() => setActiveTab('assessments')}>الاختبارات</TabButton>
          <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>مكتملة</TabButton>
        </div>
      </div>

      {activeTab === 'assessments' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.length > 0 ? filteredAssessments.map(a => (
            <div key={a.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4B483]/30 transition-all space-y-4">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                  a.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {a.status === 'completed' ? 'تم الإكمال' : 'نشط حالياً'}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-psy-text/40">
                  <Calendar size={12} />
                  <span>الموعد: {a.deadline}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base">{a.title}</h4>
                <p className="text-xs text-psy-text/40 line-clamp-2 leading-relaxed">{a.instructions}</p>
              </div>
              <div className="flex justify-end pt-2">
                <GoldButton 
                  variant={a.status === 'completed' ? 'secondary' : 'primary'} 
                  size="sm" 
                  className="text-xs"
                  disabled={a.status === 'completed'}
                  onClick={() => setSelectedAssessment(a)}
                >
                  {a.status === 'completed' ? 'تم تقديم الإجابات' : 'ابدأ التقييم الآان'}
                  <ArrowLeft size={14} />
                </GoldButton>
              </div>
            </div>
          )) : (
            <div className="col-span-3 glass p-20 rounded-3xl">
              <EmptyState icon={FileText} title="لا توجد اختبارات" description="ليس لديك أي مقاييس نفسية معلقة حالياً." />
            </div>
          )}
        </div>
      ) : (
        filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} isPatient={true} />
            ))}
          </div>
        ) : (
          <div className="glass p-20 rounded-3xl">
            <EmptyState 
              icon={ClipboardCheck} 
              title="لا توجد مهام" 
              description="حاول تغيير مرشح البحث أو استمتع بيومك الهادئ!"
            />
          </div>
        )
      )}

      {selectedAssessment && (
        <AssessmentPlayer 
          assignment={selectedAssessment}
          onCancel={() => setSelectedAssessment(null)}
          onComplete={() => {
            setSelectedAssessment(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

const TabButton = ({ children, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
      active 
        ? 'bg-[#181816] text-[#D4B483] shadow-lg border border-[#D4B483]/20' 
        : 'text-psy-text/40 hover:text-psy-text'
    }`}
  >
    {children}
  </button>
);
