
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale' | 'payment';
  amount: number;
  description: string;
  date: string;
  category: 'clinic' | 'lab' | 'library' | 'system';
}

export interface Wallet {
  balance: number;
  currency: 'PTC'; // psyTech Credits
  transactions: Transaction[];
}

// Simulated persistence
const STORAGE_KEY = 'psytech_economy';

export const getWallet = (): Wallet => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  // Default wallet
  const defaultWallet: Wallet = {
    balance: 2500,
    currency: 'PTC',
    transactions: [
      {
        id: '1',
        type: 'deposit',
        amount: 2500,
        description: 'رصيد ترحيبي للمنصة',
        date: new Date().toISOString(),
        category: 'system'
      }
    ]
  };
  saveWallet(defaultWallet);
  return defaultWallet;
};

export const saveWallet = (wallet: Wallet) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
  const wallet = getWallet();
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString()
  };
  
  wallet.transactions.unshift(newTransaction);
  
  if (transaction.type === 'deposit' || transaction.type === 'sale') {
    wallet.balance += transaction.amount;
  } else {
    wallet.balance -= transaction.amount;
  }
  
  saveWallet(wallet);
  return wallet;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-DZ', { style: 'decimal' }).format(amount) + ' د.ج';
};
