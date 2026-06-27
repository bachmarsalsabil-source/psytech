
import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Download,
  Calendar,
  CreditCard,
  PieChart
} from 'lucide-react';
import { getWallet, formatCurrency } from '../../lib/economy';
import { GlassCard } from '../../components/clinic/GlassCard';

const Billing: React.FC = () => {
  const wallet = getWallet();
  const [filter, setFilter] = useState('all');

  const stats = [
    { label: 'إجمالي الدخل (الشهر)', value: 124500, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'جلسات مدفوعة', value: 48, icon: Calendar, color: 'text-psy-gold' },
    { label: 'مدفوعات معلقة', value: 3400, icon: DollarSign, color: 'text-red-400' },
    { label: 'متوسط قيمة الجلسة', value: 450, icon: Users, color: 'text-psy-text' },
  ];

  return (
    <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-psy-text tracking-tighter">المحاسبة والفوترة</h1>
            <p className="text-psy-text/40 font-light text-lg">إدارة الشؤون المالية للعيادة، عوائد الجلسات، والمصاريف التشغيلية</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/5 border border-white/10 text-psy-text px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                <Download size={18} />
                تصدير التقرير المالي
             </button>
             <button className="bg-psy-gold text-psy-bg px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-psy-gold/10">
                تسوية الحسابات
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat, i) => (
             <GlassCard key={i} className="space-y-4">
                <div className={`p-3 rounded-2xl bg-white/5 w-fit ${stat.color}`}>
                   <stat.icon size={24} />
                </div>
                <div>
                   <div className="text-psy-text/40 text-xs font-bold mb-1">{stat.label}</div>
                   <div className="text-2xl font-black font-mono">
                      {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                   </div>
                </div>
             </GlassCard>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-6">
            {/* WalletWidget removed as per request to focus on important elements */}
              
              <div className="bg-psy-surface border border-white/5 rounded-3xl p-6">
                 <h3 className="font-bold flex items-center gap-2 mb-6">
                    <PieChart size={18} className="text-psy-gold" />
                    توزيع الدخل
                 </h3>
                 <div className="space-y-4">
                    {[
                      { label: 'جلسات علاجية', value: '75%', color: 'bg-psy-gold' },
                      { label: 'اختبارات نفسية', value: '15%', color: 'bg-[#A67C4A]' },
                      { label: 'اشتراكات المكتبة', value: '10%', color: 'bg-emerald-400' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-psy-text/60">{item.label}</span>
                            <span>{item.value}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: item.value }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 bg-psy-surface border border-white/5 rounded-[40px] overflow-hidden flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-psy-gold/5">
                 <h3 className="text-xl font-bold text-psy-gold">السجل المالي للعيادة</h3>
                 <div className="flex gap-3">
                    <div className="flex bg-psy-bg rounded-xl p-1 border border-white/5">
                       <button className="px-4 py-1.5 text-[10px] font-bold bg-psy-gold text-psy-bg rounded-lg">الكل</button>
                       <button className="px-4 py-1.5 text-[10px] font-bold text-psy-text/40 hover:text-psy-text">الدخل</button>
                       <button className="px-4 py-1.5 text-[10px] font-bold text-psy-text/40 hover:text-psy-text">المصاريف</button>
                    </div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-white/5">
                 {/* Mock Transactions */}
                 {[
                   { id: 'TX001', desc: 'تحصيل قيمة جلسة - مريض: P-5392', amount: 450, type: 'credit', date: '2024-05-01' },
                   { id: 'TX002', desc: 'شراء رخصة "اختبار MMPI" الجديد', amount: -600, type: 'debit', date: '2024-05-01' },
                   { id: 'TX003', desc: 'تحصيل قيمة تقييم شامل - مريض: P-1204', amount: 1200, type: 'credit', date: '2024-04-30' },
                   { id: 'TX004', desc: 'صرف مستحقات موظف: د. سارة أحمد', amount: -8500, type: 'debit', date: '2024-04-28' },
                   { id: 'TX005', desc: 'تحصيل اشتراك سنوي للمكتبة (عيادي)', amount: 2500, type: 'credit', date: '2024-04-28' },
                 ].map((tx) => (
                   <div key={tx.id} className="p-6 hover:bg-white/5 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                         </div>
                         <div>
                            <div className="font-bold text-sm">{tx.desc}</div>
                            <div className="text-[10px] text-psy-text/40 mt-1 font-mono">{tx.id} • {tx.date}</div>
                         </div>
                      </div>
                      <div className={`text-xl font-black font-mono ${tx.type === 'credit' ? 'text-emerald-400' : 'text-psy-text'}`}>
                         {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                 <button className="text-psy-gold text-xs font-bold hover:underline">تحميل السجل الكامل لمدة سنة</button>
              </div>
           </div>
        </div>
      </div>
  );
};

export default Billing;
