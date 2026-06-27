import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  History, 
  Download, 
  RefreshCw, 
  FileJson, 
  UserCheck, 
  Key, 
  Clock, 
  Filter, 
  Trash2, 
  AlertCircle
} from 'lucide-react';
import { 
  getAuditLogs, 
  createAuditLog, 
  getCases, 
  getSessions, 
  getTasks, 
  getJournals,
  getCurrentUser,
  ClinicalLog 
} from '../../lib/clinic';
import { GlassCard } from '../../components/clinic/GlassCard';
import { GoldButton } from '../../components/clinic/GoldButton';
import { BackButton } from '../../components/clinic/BackButton';
import { motion } from 'motion/react';

export const ClinicAudits: React.FC = () => {
  const [logs, setLogs] = useState<ClinicalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<'all' | 'clinical' | 'research' | 'financial' | 'system'>('all');
  
  // Data counts
  const [activeTab, setActiveTab] = useState<'logs' | 'relations' | 'security'>('logs');
  const [selectedLog, setSelectedLog] = useState<ClinicalLog | null>(null);
  
  // Relational Entities state
  const [casesList, setCasesList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [journalsList, setJournalsList] = useState<any[]>([]);

  const user = getCurrentUser();

  const loadData = () => {
    setLogs(getAuditLogs());
    setCasesList(getCases());
    setSessionsList(getSessions());
    setTasksList(getTasks());
    setJournalsList(getJournals());
  };

  useEffect(() => {
    loadData();
    
    // Create a system trace log that audit opened has been performed
    createAuditLog(
      'فحص السجل المعلوماتي المترابط',
      'قام الأخصائي بالدخول لغرفة تدقيق سجل المعالجة وفحص مرونة قاعدة البيانات وإجراء الفحص الأمني للأدوار.',
      'system'
    );
    
    // Refresh to read the new audit log we just wrote
    setLogs(getAuditLogs());
  }, []);

  const handleResetLogs = () => {
    if (confirm('هل أنت متأكد من رغبتك في تصفير سجل عمليات النظام المترابط؟ لا يمكن التراجع عن هذا الإجراء.')) {
      localStorage.removeItem('clinic_audit_logs');
      createAuditLog('تصفير قاعدة البيانات والمعلومات', 'تم بنجاح تصفير سجلات العمليات وإعادة تشغيل البنية التحتية بنجاح.', 'system');
      loadData();
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      schemaVersion: '1.4.2',
      operator: user?.fullName || 'سامي الأحمد',
      role: user?.role || 'owner',
      database: {
        cases: casesList,
        sessions: sessionsList,
        tasks: tasksList,
        journals: journalsList,
        auditLogs: logs
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `psytech_database_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    createAuditLog(
      'تصدير نسخة احتياطية إلكترونية',
      `تم استخراج وحفظ أرشيف النسخ الاحتياطي الكامل لجميع الأطراف المعنية بترميز JSON القياسي لحماية البيانات الفائقة.`,
      'financial'
    );
    loadData();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = logTypeFilter === 'all' || log.type === logTypeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <BackButton />
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white flex items-center gap-3">
            <Database size={36} className="text-[#D4B483] animate-pulse" />
            النظام المعلوماتي وسجل التدقيق المترابط
          </h1>
          <p className="text-sm text-[#E8DCC4]/60 max-w-2xl leading-relaxed">
            محرك الاستعلام الإكلينيكي الموحّد (Integrated Digital Psychological Ecosystem). هنا يتم توثيق وأرشفة وتتبع كل تفاعل، حالة، واجب علاجي، وجلسة فور حدوثها بالتفصيل الزمني الدقيق.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <GoldButton variant="secondary" onClick={loadData} className="flex items-center gap-2">
            <RefreshCw size={14} /> تحديث المزامنة
          </GoldButton>
          <GoldButton onClick={handleDownloadBackup} className="flex items-center gap-2 shadow-lg shadow-[#D4B483]/10">
            <Download size={14} /> تصدير نسخة احتياطية (JSON)
          </GoldButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3.5 text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all outline-none border-b-2 ${
            activeTab === 'logs' 
              ? 'border-[#D4B483] text-[#D4B483] bg-[#D4B483]/5' 
              : 'border-transparent text-white/40 hover:text-white/80'
          }`}
        >
          <History size={16} />
          سجل الأحداث والعمليات التفصيلي ({filteredLogs.length})
        </button>
        <button 
          onClick={() => setActiveTab('relations')}
          className={`px-6 py-3.5 text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all outline-none border-b-2 ${
            activeTab === 'relations' 
              ? 'border-[#D4B483] text-[#D4B483] bg-[#D4B483]/5' 
              : 'border-transparent text-white/40 hover:text-white/80'
          }`}
        >
          <FileJson size={16} />
          مستعرض الكيانات المترابطة (ER Engine)
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3.5 text-xs md:text-sm font-bold flex items-center gap-2.5 transition-all outline-none border-b-2 ${
            activeTab === 'security' 
              ? 'border-[#D4B483] text-[#D4B483] bg-[#D4B483]/5' 
              : 'border-transparent text-white/40 hover:text-white/80'
          }`}
        >
          <ShieldCheck size={16} />
          تدقيق الصلاحيات والوصول (RBAC Matrix)
        </button>
      </div>

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* Filters & Actions bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالنص، المستخدم، أو نوع الإجراء الإكلينيكي..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-sm outline-none focus:border-[#D4B483] text-white transition-all placeholder:text-white/20"
              />
            </div>
            
            <div className="lg:col-span-4 flex items-center gap-2">
              <span className="text-white/40 text-xs font-bold shrink-0">تصنيف العمليات:</span>
              <select 
                value={logTypeFilter}
                onChange={(e: any) => setLogTypeFilter(e.target.value)}
                className="w-full bg-[#181816]/60 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-[#D4B483] text-white"
              >
                <option value="all">كل الأحداث والمحاور</option>
                <option value="clinical">العمليات الإكلينيكية (الملفات والواجبات والجلسات)</option>
                <option value="research">الأبحاث والمقاييس والتحكيم</option>
                <option value="financial">الإحصاءات والمالية ومخرجات النسخ</option>
                <option value="system">إجراءات النظام ومراقبة الأداء السيادي</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex justify-end">
              <button 
                onClick={handleResetLogs}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Trash2 size={14} /> تصفير الأرشيف
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Logs List - Left part */}
            <div className="xl:col-span-2 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {filteredLogs.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                  <AlertCircle className="mx-auto mb-4 text-[#D4B483] opacity-40 animate-bounce" size={40} />
                  <p className="text-sm text-white/50 font-bold">لا توجد سجلات مطابقة لمعايير الاستعلام في هذه الجولة.</p>
                  <p className="text-xs text-white/30 mt-2">يرجى تبديل الفلاتر أو تنشيط إجراءات النظام (مثل إدراج حالة جديدة).</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                      selectedLog?.id === log.id 
                        ? 'bg-[#1e1c18] border-[#D4B483] shadow-md shadow-[#D4B483]/5' 
                        : 'bg-[#0e0e0f]/80 border-white/5 hover:border-white/10 hover:bg-[#151417]/80'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-between">
                      <div className={`p-3 rounded-xl ${
                        log.type === 'clinical' ? 'bg-blue-500/10 text-blue-400' :
                        log.type === 'research' ? 'bg-purple-500/10 text-purple-400' :
                        log.type === 'financial' ? 'bg-emerald-500/10 text-[#D4B483]' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        <Database size={18} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider py-1 font-mono text-white/20">
                        {log.type}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1 text-right">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[15px] font-black text-white">{log.action}</h4>
                        <span className="text-[10px] text-white/40 flex items-center gap-1 font-mono">
                          <Clock size={12} />
                          {new Date(log.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 font-light leading-relaxed truncate">{log.details}</p>
                      
                      <div className="flex items-center gap-4 text-[10px] text-white/30 pt-1.5 border-t border-white/5 mt-2">
                        <span>المنفّذ: <strong className="text-white/60">{log.userName}</strong> ({log.userRole})</span>
                        {log.relationalId && (
                          <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-[#D4B483]/80">ID المرجع: {log.relationalId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Log Inspector - Right part */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-[#D4B483] uppercase">تفاصيل الكيان المسجّل في الجدول (Inspector)</h3>
              
              {selectedLog ? (
                <GlassCard className="p-6 space-y-6 border border-[#D4B483]/30">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#D4B483] bg-[#D4B483]/10 px-3 py-1 rounded-full uppercase font-mono">
                      {selectedLog.type.toUpperCase()}_TRANSACTION
                    </span>
                    <h3 className="text-lg font-black text-white">{selectedLog.action}</h3>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed bg-[#121213] p-4 rounded-xl border border-white/5 font-light">
                    {selectedLog.details}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-white/40">توقيت العملية دقيق</span>
                      <span className="text-white/80">{new Date(selectedLog.timestamp).toLocaleString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">رمز تعريف السجل</span>
                      <span className="text-white/80 font-mono text-[11px]">{selectedLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">المستخدم المنفذ للطلب</span>
                      <span className="text-white/80">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">رتبته وصلاحية النظام</span>
                      <span className="text-white/80 font-bold text-[#D4B483]">{selectedLog.userRole}</span>
                    </div>
                    {selectedLog.relationalId && (
                      <div className="flex justify-between">
                        <span className="text-white/40">رابط المفتاح الخارجي</span>
                        <span className="text-[#D4B483] font-bold font-mono">{selectedLog.relationalId}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <pre className="bg-[#09090a] p-4 rounded-2xl overflow-x-auto text-[9px] text-[#D4B483]/80 font-mono text-left" dir="ltr">
                      {JSON.stringify(selectedLog, null, 2)}
                    </pre>
                  </div>
                </GlassCard>
              ) : (
                <div className="p-12 text-center rounded-3xl border border-white/5 bg-[#09090c]/40 text-white/30 italic text-xs leading-relaxed">
                  انقر على أي عملية مسجلة لعرض مخطط الكائن الإكلينيكي الكامل والتحقق من سلامة البيانات في المفتش الفرعي.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Relations */}
      {activeTab === 'relations' && (
        <div className="space-y-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database size={18} className="text-[#D4B483]" strokeWidth={2.5} />
              بنية البيانات الإكلينيكية والبحثية المترابطة (ER Graph)
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              يفرز محرك psyTech العلاقات كروابط ديناميكية مبسطة: يتم تعيين رمز سري لكل حالة مريض كملف طبي (Case)، وترتبط به تدوينات اليوميات الذاتية (Journals)، وواجبات سلوكية مرئية (Tasks)، وسجلات المتابعة والدردشة الطبية (Messages).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RelationalSchemaCard 
              count={casesList.length} 
              title="الحالات النشطة (Cases)" 
              fields={['id', 'patientCode', 'ageGroup', 'gender', 'severityLevel', 'clinicianId']} 
              description="أعلى الكيانات رتبة في النظام الطبي وتتبع المرضى."
            />
            <RelationalSchemaCard 
              count={sessionsList.length} 
              title="الجلسات (Sessions)" 
              fields={['id', 'caseId', 'sessionNumber', 'moodRating', 'topics', 'homework', 'notes']} 
              description="تتراكم كملحقات تابعة للحالة لتراقب التطور الإكلينيكي عبر الوقت."
            />
            <RelationalSchemaCard 
              count={tasksList.length} 
              title="الواجبات السلوكية (Tasks)" 
              fields={['id', 'caseId', 'title', 'taskType', 'dueDate', 'difficulty', 'status']} 
              description="خطوات تفاعلية تخدم الخطة العلاجية المقررة لمتابعة تقدم المريض."
            />
            <RelationalSchemaCard 
              count={journalsList.length} 
              title="اليوميات السلوكية (Journals)" 
              fields={['id', 'caseId', 'title', 'moodRating', 'isSharedWithClinician', 'createdAt']} 
              description="المقاييس الذاتية والنفسية وسجلات الطمأنينة التي يطرحها العميل."
            />
          </div>

          {/* Connected Data view list */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white tracking-wide uppercase">قائمة الحالات ومفاتيح العلاقة الحالية</h3>
            
            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0e0e0f]">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/50">
                    <th className="p-4 font-bold">كود الحالة (ملف المريض)</th>
                    <th className="p-4 font-bold">مستوى الخطورة</th>
                    <th className="p-4 font-bold font-mono">الجلسات المترابطة (Sessions)</th>
                    <th className="p-4 font-bold">المهام الواجبة (Tasks)</th>
                    <th className="p-4 font-bold font-mono">اليوميات الذاتية (Journals)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {casesList.map(c => {
                    const linkedSess = sessionsList.filter(s => s.caseId === c.id || s.caseId === c.patientCode);
                    const linkedTasks = tasksList.filter(t => t.caseId === c.id || t.caseId === c.patientCode);
                    const linkedJournals = journalsList.filter(j => j.caseId === c.id || j.caseId === c.patientCode);
                    
                    return (
                      <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#D4B483] font-mono tracking-wider">{c.patientCode}</div>
                          <div className="text-[10px] text-white/30">ID الحالة: {c.id}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.severityLevel >= 3 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            Severity {c.severityLevel}/4
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[#D4B483] font-bold">{linkedSess.length} جلسات مؤرشفة</td>
                        <td className="p-4 text-white/60">{linkedTasks.length} مهام مبرمجة</td>
                        <td className="p-4 font-mono text-white/60">{linkedJournals.length} تدوينات مفعلة</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-8 bg-[#09090a]/80 border border-[#D4B483]/30 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-mono text-[#D4B483] tracking-widest font-black uppercase bg-[#D4B483]/10 px-3.5 py-1.5 rounded-full">
                ROLE-BASED ACCESS CONTROL (RBAC) ACTIVE
              </span>
              <h3 className="text-xl font-bold text-white">السياسات الأمنية للتراخيص وصلاحيات الاستعلام</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                لتطبيق أعلى معايير أمن المعلومات الطبية وحماية خصوصية المرضى، يتم عزل البيانات إلكترونياً. لا يمكن للمستفيد العادي الاطلاع على الملاحظات الإكلينيكية الذاتية للمعالجين، كما لا يحق للأخصائي الخارجي تجاوز الصلاحيات والوصول إلى سجل النزاهة دون توثيق مسبق لمفتاح الأمن.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <ShieldCheck size={32} className="shrink-0" />
                <div className="text-right">
                  <div className="font-bold text-xs">حالة الجدار الأمني</div>
                  <div className="text-[10px] text-emerald-400/80">مفعل ويعمل بكفاءة فائقة وموثق</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Key size={16} className="text-[#D4B483]" />
                مستويات الوصول والأدوار في المنصة
              </h3>
              
              <div className="space-y-3">
                <RoleSecureItem 
                  role="بيانات المريض (Patient)" 
                  desc="صلاحية قراءة مهامه الخاصة وكتابة التدوينات الذاتية والمراسلة مع الطبيب. يمنع من تصفح التقارير المشركة أو تعديل كود الحالة." 
                  status="restricted" 
                />
                <RoleSecureItem 
                  role="الأخصائي السريري (Clinician)" 
                  desc="الحق في قراءة وكتابة جميع الحالات والتقارير وتحليل الجلسات واليوميات والواجبات الخاصة بمرضاه." 
                  status="allowed" 
                />
                <RoleSecureItem 
                  role="الباحث العلمي (Researcher)" 
                  desc="صلاحية إنشاء المقاييس وتصحيح العينات وتحميل الإحصائيات مع تعتيم الهوية الصارم لبيانات المستفيدين الطبية." 
                  status="blinded" 
                />
                <RoleSecureItem 
                  role="إدارة النظام السيادي (Owner / Admin)" 
                  desc="الحق في مراقبة حركة الاقتصاد والأداء وتغيير الطاقم ومراجعة سجلات التدقيق المعلوماتية المتطابقة." 
                  status="root" 
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <UserCheck size={16} className="text-[#D4B483]" />
                أمن الهوية النشطة
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
                  <div className="text-xs text-white/40">الهوية المصرح بها حالياً:</div>
                  <div className="text-sm font-bold text-[#D4B483]">{user?.fullName || 'د. سامي الأحمد (معالج)'}</div>
                  <div className="text-[10px] text-white/30 font-mono">البريد الإلكتروني: {user?.email || 'sami@psytech.app'}</div>
                  <div className="text-[10px] text-white/30 font-mono">الصلاحية: {user?.role || 'owner'}</div>
                </div>

                <div className="p-4 bg-yellow-500/5 text-yellow-300 border border-yellow-500/10 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    تم تخزين الصفقات والعمليات السابقة في السجل لضمان الحوكمة وتلبية رغبة الباحثين في تعزيز الجودة المنهجية الموجهة علمياً. يقر نظام psyTech بربط الهويات آليا بالوقت.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

const RelationalSchemaCard = ({ count, title, fields, description }: any) => (
  <GlassCard className="p-5 flex flex-col justify-between h-full border border-white/5 text-right">
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xl font-mono text-[#D4B483] font-black">{count}</span>
        <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded">SCHEMA</span>
      </div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="text-[11px] text-white/40 leading-relaxed font-light">{description}</p>
    </div>

    <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
      <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">Fields defined:</div>
      <div className="flex flex-wrap gap-1">
        {fields.map((f: string) => (
          <span key={f} className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/70">{f}</span>
        ))}
      </div>
    </div>
  </GlassCard>
);

const RoleSecureItem = ({ role, desc, status }: any) => (
  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-start justify-between gap-4 text-right">
    <div className="space-y-1 flex-1">
      <h5 className="text-xs font-bold text-white">{role}</h5>
      <p className="text-[10px] text-white/40 leading-relaxed font-light">{desc}</p>
    </div>
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider ${
      status === 'root' ? 'bg-red-500/20 text-red-400' :
      status === 'allowed' ? 'bg-emerald-500/20 text-emerald-400' :
      status === 'restricted' ? 'bg-yellow-500/20 text-yellow-400' :
      'bg-purple-500/20 text-purple-400'
    }`}>
      {status === 'root' ? 'ROOT_ACCESS' :
       status === 'allowed' ? 'WRITE_PERMIT' :
       status === 'restricted' ? 'READ_SELF_ONLY' :
       'BLIND_RESEARCH'}
    </span>
  </div>
);
