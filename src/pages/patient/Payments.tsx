
import React, { useState } from 'react';
import { WalletWidget } from '../../components/shared/WalletWidget';
import { CreditCard, History, Plus, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { getWallet, formatCurrency, Transaction } from '../../lib/economy';
import { motion } from 'motion/react';

const Payments: React.FC = () => {
  const wallet = getWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  return (
    <div className="space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-psy-text tracking-tighter">الرصيد والمدفوعات</h1>
            <p className="text-psy-text/40 font-light text-lg">إدارة محفظتك الرقمية وتاريخ تعاملاتك المالية</p>
          </div>
          <button className="bg-psy-gold text-psy-bg px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-psy-gold/10">
            <Plus size={20} />
            شحن الرصيد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <WalletWidget variant="card" />
             
             <div className="mt-8 bg-psy-surface border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                   <CreditCard size={18} className="text-psy-gold" />
                   البطاقات المرتبطة
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-psy-gold/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-psy-gold/10 rounded-xl flex items-center justify-center text-psy-gold">
                            <CreditCard size={20} />
                         </div>
                         <div>
                            <div className="text-sm font-bold">مدى •••• 4492</div>
                            <div className="text-[10px] text-psy-text/40 uppercase font-black">EXP 12/28</div>
                         </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   </div>
                   <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-psy-text/40 font-bold text-xs hover:border-psy-gold/30 hover:text-psy-gold transition-all">
                      + إضافة بطاقة جديدة
                   </button>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-psy-gold text-psy-bg' : 'bg-white/5 text-psy-text/40 hover:bg-white/10'}`}
                >
                   نظرة عامة
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-psy-gold text-psy-bg' : 'bg-white/5 text-psy-text/40 hover:bg-white/10'}`}
                >
                   سجل العمليات
                </button>
             </div>

             <div className="bg-psy-surface border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-psy-gold/5">
                   <h3 className="text-xl font-bold">آخر الحركات المالية</h3>
                </div>
                <div className="divide-y divide-white/5">
                   {wallet.transactions.length === 0 ? (
                      <div className="p-20 text-center text-psy-text/20">لا توجد عمليات حالياً</div>
                   ) : (
                      wallet.transactions.map((tx) => (
                        <div key={tx.id} className="p-6 hover:bg-white/5 transition-all flex items-center justify-between group">
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                 {tx.type === 'deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                              </div>
                              <div>
                                 <div className="font-bold text-lg">{tx.description}</div>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-psy-text/40">{new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-psy-gold/60">{tx.category}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className={`text-2xl font-black font-mono ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-psy-text'}`}>
                                 {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </div>
                              <button className="mt-2 text-[10px] font-bold text-psy-gold flex items-center gap-1 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                 <FileText size={12} />
                                 عرض الفاتورة
                              </button>
                           </div>
                        </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
  );
};

export default Payments;
