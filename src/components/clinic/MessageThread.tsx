import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { Message, UserRole } from '../../lib/clinic';
import './scrollbar.css';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      ref={scrollRef} 
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px] scroll-smooth custom-scrollbar"
    >
      {messages.map((msg) => {
        const isMe = msg.senderId === currentUserId;
        
        return (
          <div key={msg.id} className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}>
            <span className="text-[10px] text-psy-text/30 mb-1 px-2">
              {msg.senderName}
            </span>
            <div 
              className={`
                max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-lg
                ${isMe 
                  ? 'bg-[#D4B483] text-[#181816] rounded-2xl rounded-tr-none' 
                  : 'bg-[#2C2420] text-[#F5E9D6] rounded-2xl rounded-tl-none border border-[#D4B483]/20'}
              `}
            >
              {msg.content}
            </div>
            <span className="text-[9px] text-psy-text/20 mt-1 px-2">
              {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}

      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-psy-text/20">
          <MessageSquare size={48} strokeWidth={1} />
          <p className="mt-4 text-xs">لا توجد رسائل سابقة. ابدأ المحادثة الآن.</p>
        </div>
      )}
    </div>
  );
};
