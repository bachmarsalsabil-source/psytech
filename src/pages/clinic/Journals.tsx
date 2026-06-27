import React, { useState, useMemo } from 'react';
import { Search, BookOpen, User, Share2 } from 'lucide-react';
import { getJournals, getCases, JournalEntry as JournalType } from '../../lib/clinic';
import { JournalEntry } from '../../components/clinic/JournalEntry';
import { BackButton } from '../../components/clinic/BackButton';
import { EmptyState } from '../../components/clinic/EmptyState';

export const GlobalJournalsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyShared, setShowOnlyShared] = useState(true);
  const allJournals = getJournals();
  const cases = getCases();

  const filteredJournals = useMemo(() => {
    return allJournals.filter(j => {
      const patientCase = cases.find(c => c.id === j.caseId);
      const matchesSearch = 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patientCase?.patientCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesShared = !showOnlyShared || j.isSharedWithClinician;
      
      return matchesSearch && matchesShared;
    }).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }, [allJournals, searchTerm, showOnlyShared, cases]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">بوابة اليوميات العلاجية</h1>
          <p className="text-psy-text/40">نافذة على العالم الداخلي لمرضاك</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/20" size={20} />
          <input 
            type="text"
            placeholder="بحث في اليوميات أو كود المريض..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm outline-none focus:border-[#D4B483] transition-all"
          />
        </div>

        <button 
          onClick={() => setShowOnlyShared(!showOnlyShared)}
          className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all border ${
            showOnlyShared 
              ? 'bg-[#D4B483]/10 text-[#D4B483] border-[#D4B483]/30' 
              : 'bg-white/5 text-psy-text/40 border-white/5'
          }`}
        >
          <Share2 size={18} />
          <span className="text-xs">{showOnlyShared ? 'عرض المشترك فقط' : 'عرض الكل'}</span>
        </button>
      </div>

      {filteredJournals.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredJournals.map(journal => {
            const patientCase = cases.find(c => c.id === journal.caseId);
            return (
              <div key={journal.id} className="relative">
                <div className="absolute top-2 left-6 px-3 py-1 bg-[#181816]/80 backdrop-blur-md border border-[#D4B483]/30 rounded-full z-10 flex items-center gap-2">
                  <User size={10} className="text-[#D4B483]" />
                  <span className="text-[9px] font-black text-[#D4B483] font-mono">{patientCase?.patientCode}</span>
                </div>
                <JournalEntry entry={journal} isClinician={true} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass p-20 rounded-3xl">
          <EmptyState 
            icon={BookOpen} 
            title="لا توجد يوميات" 
            description="اليوميات المشتركة ستظهر هنا بمجرد أن يقوم المرضى بكتابتها ومشاركتها معك."
          />
        </div>
      )}
    </div>
  );
};
