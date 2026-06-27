import React from "react";
import { Calendar, Clock, MapPin, Video, User, Sparkles } from "lucide-react";
import { getCurrentUser, getCases, getAppointments } from "../../lib/clinic";
import { BackButton } from "../../components/clinic/BackButton";
import { GlassCard } from "../../components/clinic/GlassCard";
import { EmptyState } from "../../components/clinic/EmptyState";

export const PatientAppointments: React.FC = () => {
  const user = getCurrentUser();
  const patientCase = getCases().find(c => c.patientCode === user?.patientCode);
  const appointments = getAppointments()
    .filter(a => a.caseId === patientCase?.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-700" dir="rtl">

      {/* Hero Section */}
      <div
        className="relative min-h-[200px] md:h-56 rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col md:flex-row items-center gap-6 px-8 py-8 md:px-12"
        style={{ background: "linear-gradient(135deg, rgba(212,180,131,0.18) 0%, rgba(212,180,131,0.04) 60%, rgba(28,28,26,0) 100%)" }}
      >
        <div className="absolute inset-0 rounded-[32px] md:rounded-[48px] border border-psy-gold/10 pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-psy-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-32 h-32 rounded-full bg-psy-gold/8 blur-2xl pointer-events-none" />

        <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[24px] bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center shadow-xl shadow-psy-gold/10">
          <Calendar size={40} className="text-psy-gold" />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-right">
          <BackButton />
          <h1 className="text-3xl md:text-4xl font-serif font-black text-psy-text tracking-tight">
            جدول مواعيدي
          </h1>
          <p className="text-psy-text/50 text-base font-light">
            مواعيد جلسات المتابعة والتقييم القادمة
          </p>
          {appointments.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-psy-gold/10 border border-psy-gold/20 text-psy-gold text-xs font-bold mt-2">
              <Sparkles size={12} />
              {appointments.length} موعد مجدول
            </div>
          )}
        </div>
      </div>

      {/* Appointments Grid */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((app) => (
            <GlassCard
              key={app.id}
              className="rounded-[32px] p-6 md:p-8 border-r-4 border-psy-gold/60 space-y-5 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border ${
                    app.type === "أونلاين"
                      ? "bg-blue-500/10 text-blue-400 border-blue-400/20"
                      : "bg-psy-gold/10 text-psy-gold border-psy-gold/20"
                  }`}
                >
                  {app.type}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-psy-gold/8 flex items-center justify-center">
                  {app.type === "أونلاين"
                    ? <Video className="text-blue-400" size={18} />
                    : <MapPin className="text-psy-gold" size={18} />}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-black text-psy-gold font-mono leading-none">
                  {app.time}
                </div>
                <div className="text-sm font-semibold text-psy-text/80">
                  {new Date(app.date).toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1">
                <h4 className="text-sm font-bold text-psy-text">{app.title}</h4>
                <p className="text-xs text-psy-text/40 leading-relaxed line-clamp-2">
                  {app.notes || "لا توجد ملاحظات إضافية"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs text-psy-text/50">
                  <Clock size={12} />
                  <span>{app.duration} دقيقة</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-psy-text/50">
                  <User size={12} />
                  <span>د. سامي الأحمد</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="glass rounded-[32px] p-12 md:p-20">
          <EmptyState
            icon={Calendar}
            title="لا توجد مواعيد محجوزة"
            description="سيقوم المعالج بجدولة جلساتك القادمة وستظهر هنا فور حجزها."
          />
        </div>
      )}
    </div>
  );
};
