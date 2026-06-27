import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, AlertCircle } from 'lucide-react';

interface FeedbackMessage {
  id: string;
  type: 'success' | 'info';
  title: string;
  description?: string;
}

interface FeedbackContextType {
  showFeedback: (title: string, description?: string, type?: 'success' | 'info') => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  const showFeedback = useCallback((title: string, description?: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    const newMessage: FeedbackMessage = { id, type, title, description };
    setMessages((prev) => [...prev, newMessage]);
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 4000);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showFeedback }}>
      {children}
      
      {/* Toast Portals Container */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto w-full"
            >
              <div className="relative overflow-hidden rounded-[32px] bg-[#181816]/95 border border-[#D4B483]/30 p-5 shadow-[0_20px_50px_rgba(212,180,131,0.15)] backdrop-blur-xl">
                {/* Luxury ambient gold glow line */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4B483] to-transparent shadow-[0_0_10px_#D4B483]" />
                
                {/* Glow sphere in background */}
                <div className="absolute -left-12 -top-12 w-24 h-24 bg-[#D4B483]/10 rounded-full blur-2xl" />

                <div className="flex gap-4 items-start relative z-10 text-right" dir="rtl">
                  {/* Succes Icon container with ripple feedback */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-[#D4B483]/10 scale-150"
                    />
                    <div className="w-12 h-12 rounded-full border border-[#D4B483]/30 bg-[#D4B483]/10 flex items-center justify-center text-[#D4B483]">
                      {msg.type === 'success' ? (
                        <Check size={20} className="stroke-[3]" />
                      ) : (
                        <AlertCircle size={20} className="stroke-[3]" />
                      )}
                    </div>
                  </div>

                  {/* Text Description */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-black text-psy-text text-base tracking-tight leading-tight">
                        {msg.title}
                      </h4>
                      {msg.type === 'success' && (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                          className="text-[#D4B483] opacity-80"
                        >
                          <Sparkles size={14} />
                        </motion.span>
                      )}
                    </div>
                    {msg.description && (
                      <p className="text-xs text-psy-text/60 leading-relaxed font-light">
                        {msg.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sparkling dots inside */}
                <span className="absolute bottom-2 left-6 w-1 h-1 bg-[#D4B483]/35 rounded-full animate-pulse" />
                <span className="absolute top-4 right-10 w-1.5 h-1.5 bg-[#D4B483]/20 rounded-full animate-ping" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FeedbackContext.Provider>
  );
};
