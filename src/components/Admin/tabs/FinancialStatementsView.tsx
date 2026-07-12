import React, { useEffect } from 'react';
import { useStore } from '../../../store';
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FinancialStatementsView() {
  const { 
    incomeStatement, 
    balanceSheet, 
    generateIncomeStatement, 
    generateBalanceSheet,
    accounts 
  } = useStore() as any; // Cast to any to avoid type complaints during dev if index.ts isn't fully synced in memory

  useEffect(() => {
    // We assume accounts are already loaded by the dashboard or we can trigger fetch if needed.
    // For now we just generate based on current accounts in store.
    if (generateIncomeStatement && generateBalanceSheet) {
      generateIncomeStatement();
      generateBalanceSheet();
    }
  }, [accounts, generateIncomeStatement, generateBalanceSheet]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4" dir="rtl">
      
      {/* Income Statement Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">قائمة الدخل (Income Statement)</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
            <span className="text-slate-300 font-bold">إجمالي الإيرادات (Revenues)</span>
            <span className="text-emerald-400 font-mono text-xl">{incomeStatement?.revenues.toLocaleString() || '0'}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
            <span className="text-slate-300 font-bold">تكلفة المبيعات (COGS)</span>
            <span className="text-rose-400 font-mono text-xl">{incomeStatement?.cogs.toLocaleString() || '0'}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
            <span className="text-slate-300 font-bold">المصروفات التشغيلية (Expenses)</span>
            <span className="text-rose-400 font-mono text-xl">{incomeStatement?.expenses.toLocaleString() || '0'}</span>
          </div>

          <div className={`flex justify-between items-center p-6 rounded-2xl border ${incomeStatement?.netIncome >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <span className={`font-black text-xl ${incomeStatement?.netIncome >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {incomeStatement?.netIncome >= 0 ? 'صافي الربح (Net Income)' : 'صافي الخسارة (Net Loss)'}
            </span>
            <span className={`font-mono font-black text-2xl ${incomeStatement?.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {Math.abs(incomeStatement?.netIncome || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Sheet Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">الميزانية العمومية (Balance Sheet)</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Assets */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-300 border-b border-slate-700 pb-2">الأصول (Assets)</h3>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-slate-400">إجمالي الأصول المتداولة والثابتة</span>
              <span className="text-white font-mono text-lg">{balanceSheet?.assets.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <span className="text-emerald-400 font-bold">إجمالي الأصول</span>
              <span className="text-emerald-400 font-mono font-bold text-xl">{balanceSheet?.assets.toLocaleString() || '0'}</span>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-300 border-b border-slate-700 pb-2">الخصوم وحقوق الملكية</h3>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-slate-400">الالتزامات (Liabilities)</span>
              <span className="text-white font-mono text-lg">{balanceSheet?.liabilities.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-slate-400">حقوق الملكية (Equity)</span>
              <span className="text-white font-mono text-lg">{balanceSheet?.equity.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <span className="text-amber-400 font-bold">إجمالي الخصوم والملكية</span>
              <span className="text-amber-400 font-mono font-bold text-xl">
                {((balanceSheet?.liabilities || 0) + (balanceSheet?.equity || 0)).toLocaleString()}
              </span>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
