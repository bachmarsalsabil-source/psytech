import React, { useState, useMemo } from 'react';
import { MessageSquare, Search, User, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCases, getMessages, PatientCase, Message, getCurrentUser, sendMessage } from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { MessageThread } from '../../components/clinic/MessageThread';
import { BackButton } from '../../components/clinic/BackButton';
import { GoldButton } from '../../components/clinic/GoldButton';

export const ClinicMessages: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [msgContent, setMsgContent] = useState('');
  
  const user = getCurrentUser();
  const cases = getCases();

  const filteredCases = useMemo(() => {
    return cases.filter(c => 
      c.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cases, searchTerm]);

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const messages = selectedCaseId ? getMessages(selectedCaseId) : [];

  const handleSend = () => {
    if (!selectedCaseId || !msgContent.trim()) return;
    sendMessage({
      caseId: selectedCaseId,
      senderId: user?.id,
      senderName: user?.fullName,
      senderRole: 'clinician',
      content: msgContent
    });
    setMsgContent('');
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <BackButton />
          <h1 className="text-3xl font-black text-psy-text">مركز الرسائل</h1>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Contacts Sidebar */}
        <div className={`
          flex-col w-full md:w-80 bg-white/5 border border-white/5 rounded-3xl overflow-hidden
          ${selectedCaseId ? 'hidden md:flex' : 'flex'}
        `}>
          <div className="p-6 border-b border-white/5 bg-[#D4B483]/5">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-psy-text/20" size={16} />
              <input 
                type="text" 
                placeholder="بحث عن حالة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#181816]/60 border border-white/10 rounded-xl py-2 pr-10 pl-3 text-xs outline-none focus:border-[#D4B483]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredCases.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`
                  w-full p-6 flex items-center gap-4 text-right transition-all border-b border-white/5
                  ${selectedCaseId === c.id ? 'bg-[#D4B483]/10 border-l-4 border-l-[#D4B483]' : 'hover:bg-white/5'}
                `}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#D4B483] font-bold">
                  {c.patientCode.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{c.patientCode}</div>
                  <div className="text-[10px] text-psy-text/40 truncate">{c.reasonForVisit}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`
          flex-1 flex-col bg-white/5 border border-white/5 rounded-3xl overflow-hidden
          ${!selectedCaseId ? 'hidden md:flex' : 'flex'}
        `}>
          {selectedCase ? (
            <>
              <div className="p-4 border-b border-white/5 bg-[#D4B483]/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedCaseId(null)} className="md:hidden p-2">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="font-bold text-[#D4B483] font-mono">{selectedCase.patientCode}</div>
                </div>
                <GoldButton variant="ghost" size="sm" onClick={() => navigate(`/clinic/patients/${selectedCase.id}`)}>
                  فتح الملف
                </GoldButton>
              </div>

              <MessageThread messages={messages} currentUserId={user?.id || ''} />

              <div className="p-6 border-t border-white/5 flex gap-4 bg-[#181816]/30">
                <textarea 
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483] resize-none h-14"
                />
                <GoldButton size="sm" onClick={handleSend} className="h-14 w-14 rounded-2xl">إرسال</GoldButton>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-psy-text/20">
              <MessageSquare size={64} strokeWidth={1} />
              <p className="mt-4 text-sm">اختر حالة لبدء المحادثة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
