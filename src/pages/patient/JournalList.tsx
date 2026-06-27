import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Star, 
  Share2, 
  PenTool, 
  Volume2, 
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getJournals, getCases } from '../../lib/clinic';
import { BackButton } from '../../components/clinic/BackButton';
import { GoldButton } from '../../components/clinic/GoldButton';
import { JournalEntry } from '../../components/clinic/JournalEntry';
import { EmptyState } from '../../components/clinic/EmptyState';

export const PatientJournals: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);
  const journals = getJournals(patientCase?.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">يومياتي الخاصة</h1>
          <p className="text-psy-text/40">سجّل أفكارك ومشاعرك في مساحة آمنة وخاصة</p>
        </div>
        <GoldButton size="lg" onClick={() => navigate('/patient/journal/new')}>
           <Plus size={20} /> يومية جديدة
        </GoldButton>
      </div>

      {journals.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {journals.map(journal => (
            <JournalEntry key={journal.id} entry={journal} isClinician={false} />
          ))}
        </div>
      ) : (
        <div className="glass p-20 rounded-3xl">
          <EmptyState 
            icon={BookOpen} 
            title="ابدأ رحلتك مع التدوين" 
            description="اليوميات تساعدك على فهم أنماط تفكيرك ومشاعرك بشكل أفضل. اكتب أول يومية الآن."
            actionText="كتابة أول يومية"
            onAction={() => navigate('/patient/journal/new')}
          />
        </div>
      )}
    </div>
  );
};
