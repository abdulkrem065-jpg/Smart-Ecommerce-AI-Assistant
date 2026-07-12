import React, { useEffect, useState } from 'react';
import { useStore } from '../../../store';
import { AccountCategory, AccountingAccount, AccountingTransaction } from '../../../types';
import { Wallet, Users, Truck, Receipt, Building, Plus, ArrowUpRight, ArrowDownLeft, Search, ChevronRight } from 'lucide-react';

export default function AccountsTab() {
  const { 
    accounts, 
    activeCategory, 
    categoryTotals, 
    setActiveCategory, 
    fetchAccountsByCategory, 
    addAccount,
    addTransactionToAccount
  } = useStore();

  const [selectedAccount, setSelectedAccount] = useState<AccountingAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  
  const [showTxModal, setShowTxModal] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'debit' | 'credit'>('debit');

  useEffect(() => {
    fetchAccountsByCategory(activeCategory);
  }, [activeCategory, fetchAccountsByCategory]);

  const categories = [
    { id: 'customers' as AccountCategory, label: 'العملاء', icon: Users },
    { id: 'suppliers' as AccountCategory, label: 'الموردين', icon: Truck },
    { id: 'cash_boxes' as AccountCategory, label: 'الصناديق والبنوك', icon: Wallet },
    { id: 'revenues' as AccountCategory, label: 'الإيرادات', icon: Receipt },
    { id: 'cogs' as AccountCategory, label: 'تكلفة المبيعات', icon: Receipt },
    { id: 'expenses' as AccountCategory, label: 'المصروفات', icon: Receipt },
    { id: 'shareholders' as AccountCategory, label: 'الشركاء', icon: Building },
  ];

  const filteredAccounts = accounts.filter(a => a.name.includes(searchTerm));

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName) return;
    addAccount({ name: newAccName, category: activeCategory });
    setNewAccName('');
    setShowAddModal(false);
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !txAmount || !txDesc) return;
    const amount = Number(txAmount);
    addTransactionToAccount(selectedAccount.id, {
      date: new Date().toISOString(),
      description: txDesc,
      debit: txType === 'debit' ? amount : 0,
      credit: txType === 'credit' ? amount : 0
    });
    setTxAmount('');
    setTxDesc('');
    setShowTxModal(false);
    
    // Refresh selected account data from state
    const updated = useStore.getState().accounts.find(a => a.id === selectedAccount.id);
    if (updated) setSelectedAccount(updated);
  };

  if (selectedAccount) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" dir="rtl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedAccount(null)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-slate-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedAccount.name}</h2>
            <p className="text-slate-400 text-sm">كشف حساب - {categories.find(c => c.id === selectedAccount.category)?.label}</p>
          </div>
          <div className="mr-auto flex gap-3">
            <button 
              onClick={() => { setTxType('debit'); setShowTxModal(true); }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowDownLeft className="w-4 h-4" /> مدين (عليه)
            </button>
            <button 
              onClick={() => { setTxType('credit'); setShowTxModal(true); }}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" /> دائن (له)
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-right">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">البيان</th>
                <th className="p-4 font-medium">مدين</th>
                <th className="p-4 font-medium">دائن</th>
                <th className="p-4 font-medium">الرصيد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {selectedAccount.transactions && selectedAccount.transactions.map((tx) => (
                <tr key={tx.id} className="text-slate-300 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">{new Date(tx.date).toLocaleDateString('ar-SA')}</td>
                  <td className="p-4">{tx.description}</td>
                  <td className="p-4 text-emerald-400">{tx.debit > 0 ? tx.debit.toLocaleString() : '-'}</td>
                  <td className="p-4 text-rose-400">{tx.credit > 0 ? tx.credit.toLocaleString() : '-'}</td>
                  <td className="p-4 font-mono font-medium">{tx.balance.toLocaleString()}</td>
                </tr>
              ))}
              {(!selectedAccount.transactions || selectedAccount.transactions.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    لا توجد حركات مسجلة في هذا الحساب
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showTxModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">
                إضافة حركة {txType === 'debit' ? 'مدينة (عليه)' : 'دائنة (له)'}
              </h3>
              <form onSubmit={handleAddTx} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">المبلغ</label>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">البيان</label>
                  <input
                    type="text"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                    placeholder="وصف الحركة..."
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTxModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-3 text-white rounded-xl ${txType === 'debit' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
                  >
                    حفظ الحركة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث عن حساب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pr-12 pl-4 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-colors border border-slate-700"
        >
          <Plus className="w-5 h-5" />
          إضافة حساب
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
        {filteredAccounts.map((account) => (
          <div 
            key={account.id} 
            onClick={() => setSelectedAccount(account)}
            className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 hover:bg-slate-800 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-amber-500/50 transition-colors">
                {categories.find(c => c.id === activeCategory)?.icon({ className: "w-6 h-6 text-amber-500" })}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                account.currentBalance >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {account.currentBalance >= 0 ? 'رصيد مدين' : 'رصيد دائن'}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{account.name}</h3>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">إجمالي مدين:</span>
                <span className="text-emerald-400 font-mono">{account.totalDebit?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">إجمالي دائن:</span>
                <span className="text-rose-400 font-mono">{account.totalCredit?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span className="text-slate-300">الرصيد:</span>
                <span className="text-white font-mono">{account.currentBalance?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/20 border border-slate-700/30 rounded-3xl border-dashed">
            لا توجد حسابات مسجلة في هذا القسم
          </div>
        )}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 right-0 left-0 p-4 md:pl-72 z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">إجمالي مدين</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{categoryTotals.totalDebit.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">إجمالي دائن</p>
              <p className="text-2xl font-bold text-rose-400 font-mono">{categoryTotals.totalCredit.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
          <div className="flex-1 flex justify-end">
             <div className="text-left">
               <p className="text-slate-400 text-sm">الرصيد الصافي</p>
               <p className="text-2xl font-bold text-white font-mono">
                 {(categoryTotals.totalDebit - categoryTotals.totalCredit).toLocaleString()}
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              إضافة حساب جديد - {categories.find(c => c.id === activeCategory)?.label}
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">اسم الحساب</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="أدخل اسم الحساب..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                >
                  إضافة الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
