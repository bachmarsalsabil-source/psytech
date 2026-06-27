
import React, { useEffect, useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { getWallet, formatCurrency } from '../../lib/economy';
import { Link } from 'react-router-dom';

export const WalletWidget: React.FC<{ variant?: 'sidebar' | 'card', hideText?: boolean }> = ({ variant = 'sidebar', hideText = false }) => {
  const [wallet, setWallet] = useState(getWallet());

  useEffect(() => {
    const handleStorage = () => setWallet(getWallet());
    window.addEventListener('storage', handleStorage);
    // Poll for changes in same tab simulation
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (variant === 'card') {
    return (
      <div className="bg-psy-surface border border-psy-gold/20 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="p-3 bg-psy-gold/10 rounded-2xl text-psy-gold">
            <Wallet size={24} />
          </div>
          <span className="text-[10px] font-black text-psy-gold/40 uppercase tracking-widest leading-none">رصيد المحفظة</span>
        </div>
        <div className="space-y-1">
          <div className="text-4xl font-black text-psy-text font-mono tracking-tighter">
            {formatCurrency(wallet.balance)}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
             <ArrowUpRight size={14} />
             <span>+12% هذا الشهر</span>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
           <button className="flex-1 bg-psy-gold text-psy-bg py-3 rounded-xl font-bold text-xs hover:bg-psy-gold/90 transition-all">إيداع</button>
           <button className="flex-1 border border-psy-gold/30 text-psy-gold py-3 rounded-xl font-bold text-xs hover:bg-psy-gold/5 transition-all">سحب</button>
        </div>
      </div>
    );
  }

  if (hideText) {
    return (
      <div className="flex justify-center py-4">
        <Link to="/wallet" className="p-3 bg-psy-gold/10 rounded-xl text-psy-gold hover:bg-psy-gold/20 transition-all">
          <Wallet size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 mb-2">
       <Link to="/wallet" className="block group">
          <div className="bg-psy-gold/5 hover:bg-psy-gold/10 border border-psy-gold/10 rounded-2xl p-4 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <Wallet size={16} className="text-psy-gold" />
                <span className="text-[8px] font-black text-psy-gold uppercase tracking-[0.2em]">الرصيد</span>
            </div>
            <div className="text-lg font-black text-psy-text font-mono truncate">
              {formatCurrency(wallet.balance)}
            </div>
            <div className="mt-2 h-1 w-full bg-psy-gold/10 rounded-full overflow-hidden">
               <div className="h-full bg-psy-gold w-2/3" />
            </div>
          </div>
       </Link>
    </div>
  );
};
