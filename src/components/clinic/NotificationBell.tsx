import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotificationsByUser, markNotificationAsRead, getUnreadCount, getCurrentUser } from '../../lib/clinic';
import { AnimatePresence, motion } from 'motion/react';

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(getNotificationsByUser(user?.id || ''));
  const unreadCount = getUnreadCount(user?.id || '');

  useEffect(() => {
    const check = setInterval(() => {
      setNotifications(getNotificationsByUser(user?.id || ''));
    }, 5000);
    return () => clearInterval(check);
  }, [user?.id]);

  const handleRead = (id: string, relatedId: string | null) => {
    markNotificationAsRead(id);
    setNotifications(getNotificationsByUser(user?.id || ''));
    if (relatedId) {
      // Example routing
      if (user?.role === 'clinician') navigate(`/clinic/patients/${relatedId}`);
      else navigate(`/patient/dashboard`);
    }
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    notifications.forEach(n => markNotificationAsRead(n.id));
    setNotifications(getNotificationsByUser(user?.id || ''));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white/5 rounded-xl text-psy-text/60 hover:text-[#D4B483] transition-all relative group"
      >
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-4 w-80 bg-[#181816] border border-[#D4B483]/30 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#D4B483]/5">
                <h4 className="font-bold text-sm text-[#D4B483]">الإشعارات</h4>
                <button onClick={markAllAsRead} className="text-[10px] text-psy-text/40 hover:text-[#D4B483] flex items-center gap-1">
                  <CheckCheck size={12} /> قراءة الكل
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-xs text-psy-text/20 italic">لا توجد تنبيهات جديدة</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleRead(n.id, n.relatedId)}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-[#D4B483]/5' : ''}`}
                    >
                      {!n.isRead && <div className="absolute top-4 right-1 w-1.5 h-1.5 bg-[#D4B483] rounded-full" />}
                      <div className="font-bold text-xs mb-1">{n.title}</div>
                      <p className="text-[10px] text-psy-text/60 line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-1 text-[8px] text-psy-text/30 mt-2">
                        <Clock size={8} />
                        <span>{new Date(n.createdAt).toLocaleTimeString('ar-EG')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
