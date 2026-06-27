import React, { useState, useMemo } from 'react';
import { Search, Filter, ClipboardCheck, User } from 'lucide-react';
import { getTasks, getCases, TherapeuticTask, TaskStatus, TaskType } from '../../lib/clinic';
import { TaskCard } from '../../components/clinic/TaskCard';
import { BackButton } from '../../components/clinic/BackButton';
import { EmptyState } from '../../components/clinic/EmptyState';

export const GlobalTasksList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const allTasks = getTasks();
  const cases = getCases();

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const patientCase = cases.find(c => c.id === t.caseId);
      const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase?.patientCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'all' || t.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [allTasks, searchTerm, activeTab, cases]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">إدارة المهام العلاجية</h1>
          <p className="text-psy-text/40">توزيع ومتابعة الواجبات الموكلة للمرضى</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
          <input 
            type="text"
            placeholder="بحث بالعنوان أو كود المريض..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4B483] transition-all"
          />
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 self-stretch">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>الكل</TabButton>
          <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>المعلقة</TabButton>
          <TabButton active={activeTab === 'in-progress'} onClick={() => setActiveTab('in-progress')}>قيد التنفيذ</TabButton>
          <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>المكتملة</TabButton>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => {
            const patientCase = cases.find(c => c.id === task.caseId);
            return (
              <div key={task.id} className="relative group">
                <div className="absolute -top-3 right-4 px-3 py-1 bg-[#181816] border border-[#D4B483]/30 rounded-full z-10 flex items-center gap-2 shadow-xl">
                  <User size={10} className="text-[#D4B483]" />
                  <span className="text-[9px] font-black text-[#D4B483] font-mono">{patientCase?.patientCode}</span>
                </div>
                <TaskCard task={task} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass p-20 rounded-3xl">
          <EmptyState 
            icon={ClipboardCheck} 
            title="لا توجد مهام حالياً" 
            description="جميع المرضى أكملوا مهامهم بنجاح أو لم يتم تعيين مهام جديدة بعد."
          />
        </div>
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
