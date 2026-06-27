import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { Message } from '../../types';
import { avatarUrl } from '../../lib/imageUtils';
import { OptimizedImage } from '../shared/OptimizedImage';

export const ChatWindow = memo(function ChatWindow() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id || !socket) return;

    const room = 'general-chat';
    socket.emit('join-room', room);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [user?.id, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || !user || !socket || trimmed.length > 2000) return;

    const msg: Message = {
      id: crypto.randomUUID(),
      room: 'general-chat',
      sender: user.fullName || user.name,
      senderId: user.id,
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send-message', msg);
    setInputText('');
  }, [inputText, user, socket]);

  if (!user) return null;

  const userAvatar = user.avatarUrl || avatarUrl(user.fullName || user.name, 64);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100] mobile-fab-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mobile-fab-panel w-[calc(100vw-2rem)] max-w-sm md:w-96 h-[min(70vh,500px)] md:h-[500px] glass flex flex-col shadow-2xl mb-4 overflow-hidden border border-psy-gold/20"
            role="dialog"
            aria-label="المحادثة الفورية"
          >
            <div className="p-4 bg-psy-gold text-psy-bg flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-psy-bg/20">
                  <OptimizedImage src={userAvatar} alt="" width={64} className="w-full h-full" />
                </div>
                <span className="font-bold">المحادثة الفورية</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-psy-bg/10 rounded-lg btn-touch min-h-0"
                aria-label="إغلاق المحادثة"
              >
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-psy-bg/50" aria-live="polite">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-psy-text/30 gap-2">
                  <MessageSquare size={32} aria-hidden="true" />
                  <p className="text-sm mb-0">ابدأ المحادثة الآن</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.senderId === user.id
                        ? 'bg-psy-gold text-psy-bg rounded-tl-none'
                        : 'glass rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-psy-text/40 mt-1">
                    {msg.sender} •{' '}
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 glass border-t border-white/5 flex gap-2 shrink-0">
              <label htmlFor="chat-input" className="sr-only">
                اكتب رسالتك
              </label>
              <input
                id="chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-psy-gold transition-all text-sm min-h-[44px]"
                maxLength={2000}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="btn-primary btn-icon min-w-[44px]"
                aria-label="إرسال الرسالة"
                disabled={!inputText.trim()}
              >
                <ChevronRight size={20} className="rotate-180" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 btn-touch ${
          isOpen ? 'bg-red-500 text-white' : 'bg-psy-gold text-psy-bg'
        }`}
        aria-label={isOpen ? 'إغلاق المحادثة' : 'فتح المحادثة الفورية'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
});
