import React, { useState } from "react";
import { MessageSquare, Send, User, Shield } from "lucide-react";
import {
  getCurrentUser,
  getCases,
  getMessages,
  sendMessage,
  Message,
} from "../../lib/clinic";
import { GlassCard } from "../../components/clinic/GlassCard";
import { GoldButton } from "../../components/clinic/GoldButton";
import { MessageThread } from "../../components/clinic/MessageThread";
import { BackButton } from "../../components/clinic/BackButton";

export const PatientMessages: React.FC = () => {
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>(getMessages(patientCase?.id || ""));

  const handleSend = () => {
    if (!content.trim() || !patientCase) return;
    const newMsg = sendMessage({
      caseId: patientCase.id,
      senderId: user?.id,
      senderName: "المريض",
      senderRole: "patient",
      content,
    });
    setMessages([...messages, newMsg]);
    setContent("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col gap-6 animate-in fade-in duration-700" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 flex-shrink-0">
        <div className="space-y-1 text-right">
          <BackButton />
          <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-text tracking-tight">
            المحادثة مع المعالج
          </h1>
          <p className="text-psy-text/50 text-sm font-light">
            تواصل مباشر وآمن مع د. سامي الأحمد
          </p>
        </div>
        {/* Security badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs font-bold self-start sm:self-auto">
          <Shield size={14} />
          <span>محادثة مشفرة</span>
        </div>
      </div>

      {/* ── Chat Card ── */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 rounded-[32px] md:rounded-[40px] border border-psy-gold/10 min-h-0">

        {/* Therapist strip */}
        <div className="px-6 py-4 bg-psy-gold/5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center text-psy-gold flex-shrink-0">
              <User size={20} />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-psy-text">د. سامي الأحمد</div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                متصل الآن
              </div>
            </div>
          </div>
          <MessageSquare size={18} className="text-psy-gold/40" />
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-hidden min-h-0">
          <MessageThread messages={messages} currentUserId={user?.id || ""} />
        </div>

        {/* Input area */}
        <div className="p-4 md:p-6 border-t border-white/5 bg-psy-bg/60 backdrop-blur-xl flex gap-3 items-end flex-shrink-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
            }
            placeholder="اكتب رسالتك للمعالج..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-psy-text outline-none focus:border-psy-gold/60 resize-none min-h-[48px] max-h-32 transition-colors placeholder:text-psy-text/30"
            rows={1}
          />
          <GoldButton
            size="sm"
            className="h-12 w-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
            onClick={handleSend}
          >
            <Send size={18} />
          </GoldButton>
        </div>
      </GlassCard>
    </div>
  );
};
