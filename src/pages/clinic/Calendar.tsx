import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin 
} from 'lucide-react';
import { 
  getAppointments, 
  getCases, 
  createAppointment, 
  Appointment, 
  PatientCase 
} from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { Modal } from '../../components/clinic/Modal';

export const ClinicCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const appointments = getAppointments();
  const cases = getCases();

  // Form State
  const [newApp, setNewApp] = useState({
    caseId: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: 50,
    type: 'حضوري',
    notes: ''
  });

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);
  const padding = Array.from({ length: (startDayOfMonth(currentDate) + 1) % 7 }, (_, i) => i); // Shifts for Arabic week start if needed

  const appointmentsOnSelectedDate = appointments.filter(app => {
    if (!selectedDate) return false;
    return app.date === selectedDate.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientCase = cases.find(c => c.id === newApp.caseId);
    createAppointment({
      ...newApp,
      patientName: patientCase?.patientCode || 'حالة غير محددة'
    });
    setIsModalOpen(false);
    setNewApp({ caseId: '', title: '', date: new Date().toISOString().split('T')[0], time: '12:00', duration: 50, type: 'حضوري', notes: '' });
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mobile-page-header">
        <div className="space-y-1 min-w-0">
          <BackButton />
          <h1 className="text-2xl md:text-3xl font-black text-psy-text">التقويم والمواعيد</h1>
          <p className="text-psy-text/40 text-sm">{currentDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</p>
        </div>
        <GoldButton onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus size={20} /> حجز موعد
        </GoldButton>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 md:gap-8 min-w-0">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <GlassCard className="p-0 overflow-hidden border-[#D4B483]/10">
            <div className="flex items-center justify-between p-4 md:p-6 bg-[#D4B483]/5 border-b border-white/5">
              <h3 className="font-bold text-base md:text-lg">{currentDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all btn-touch"><ChevronRight size={20} /></button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-xl transition-all btn-touch"><ChevronLeft size={20} /></button>
              </div>
            </div>

            <div className="overflow-x-auto table-scroll">
            <div className="grid grid-cols-7 text-center min-w-[280px] mobile-calendar-grid">
              {['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(d => (
                <div key={d} className="calendar-day-header p-4 text-[10px] font-bold text-psy-text/30 uppercase border-b border-white/5">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d.slice(0, 1)}</span>
                </div>
              ))}
              
              {padding.map(i => <div key={`p-${i}`} className="calendar-padding-cell p-8 border-b border-l border-white/5 bg-white/[0.01]" />)}
              
              {days.map(d => {
                const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0];
                const hasApp = appointments.some(a => a.date === dateString);
                const isSelected = selectedDate?.getDate() === d && selectedDate?.getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))}
                    className={`
                      calendar-day-cell p-8 border-b border-l border-white/5 flex flex-col items-center justify-center gap-1 relative transition-all group btn-touch
                      ${isSelected ? 'bg-[#D4B483]/10' : 'hover:bg-white/5'}
                    `}
                  >
                    <span className={`text-sm md:text-lg font-bold ${isSelected ? 'text-[#D4B483]' : 'text-psy-text/60 group-hover:text-psy-text'}`}>{d}</span>
                    {hasApp && <div className="w-1.5 h-1.5 rounded-full bg-[#D4B483] shadow-[0_0_10px_#D4B483]" />}
                  </button>
                );
              })}
            </div>
            </div>
          </GlassCard>
        </div>

        {/* Selected Day Agenda */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-[#D4B483]" size={20} />
            أجندة يوم {selectedDate?.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
          </h2>
          
          <div className="space-y-4">
            {appointmentsOnSelectedDate.length > 0 ? appointmentsOnSelectedDate.map(app => (
              <GlassCard key={app.id} className="p-6 border-r-4 border-[#D4B483] relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xl font-black text-[#D4B483]">{app.time}</div>
                  <span className="px-2 py-0.5 bg-[#D4B483]/10 text-[#D4B483] text-[9px] font-bold rounded-lg border border-[#D4B483]/20">
                    {app.type}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="font-bold flex items-center gap-2">
                    <User size={14} className="text-psy-text/40" /> {app.patientName}
                  </div>
                  <div className="text-sm text-psy-text/60">{app.title}</div>
                  <div className="flex items-center gap-2 text-[10px] text-psy-text/40">
                    <CalendarIcon size={12} /> {app.duration} دقيقة
                  </div>
                </div>
              </GlassCard>
            )) : (
              <div className="p-20 text-center glass rounded-3xl text-psy-text/20 italic">
                لا توجد مواعيد محجوزة في هذا اليوم
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="جدولة موعد جديد">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">الحالة / المستخدم</label>
            <select 
              value={newApp.caseId} 
              onChange={(e) => setNewApp({...newApp, caseId: e.target.value})}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
            >
              <option value="">اختر حالة...</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.patientCode} - {c.reasonForVisit.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">عنوان الموعد / الغرض</label>
            <input 
              value={newApp.title}
              onChange={(e) => setNewApp({...newApp, title: e.target.value})}
              placeholder="مثال: جلسة تقييم أولية"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">التاريخ</label>
                <input 
                  type="date"
                  value={newApp.date}
                  onChange={(e) => setNewApp({...newApp, date: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">الوقت</label>
                <input 
                  type="time"
                  value={newApp.time}
                  onChange={(e) => setNewApp({...newApp, time: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">المدة (دقيقة)</label>
                <input 
                  type="number"
                  value={newApp.duration}
                  onChange={(e) => setNewApp({...newApp, duration: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-psy-text/60">نوع الموعد</label>
                <select 
                  value={newApp.type}
                  onChange={(e) => setNewApp({...newApp, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#D4B483]"
                >
                  <option value="حضوري">حضوري في العيادة</option>
                  <option value="أونلاين">جلسة مرئية (أونلاين)</option>
                  <option value="منزلي">زيارة منزلية</option>
                </select>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-psy-text/60">ملاحظات إضافية</label>
            <textarea 
               value={newApp.notes}
               onChange={(e) => setNewApp({...newApp, notes: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm h-24 outline-none focus:border-[#D4B483]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <GoldButton type="submit" className="flex-1">تأكيد الحجز</GoldButton>
            <GoldButton type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>إلغاء</GoldButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
