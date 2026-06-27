import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabBackButton } from '../../components/lab/LabBackButton';
import { LabTestPlayer } from '../../components/lab/LabTestPlayer';
import { getTestById, PsychTest } from '../../lib/lab';
import { GlassCard } from '../../components/clinic/GlassCard';
import { AlertCircle } from 'lucide-react';

export const TestPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<PsychTest | null>(null);

  useEffect(() => {
    if (id) {
      const t = getTestById(id);
      if (t) setTest(t);
    }
  }, [id]);

  if (!test) {
    return (
      <>
        <div className="text-center py-20 font-bold text-psy-text/40 italic">جاري تحميل المعاينة...</div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-between items-center bg-psy-gold/5 p-4 rounded-2xl border border-psy-gold/20">
           <LabBackButton to="/lab/tests" label="العودة لبنك الاختبارات" />
           <div className="flex items-center gap-2 text-psy-gold text-xs font-bold">
              <AlertCircle size={14} />
              <span>وضع المعاينة: النتائج لن تُحفظ في قاعدة البيانات</span>
           </div>
        </div>

        <LabTestPlayer 
          test={test} 
          mode="preview" 
          onClose={() => navigate('/lab/tests')} 
          onComplete={() => {
            // In preview mode just show a message or redirect
          }}
        />
      </div>
    </>
  );
};
