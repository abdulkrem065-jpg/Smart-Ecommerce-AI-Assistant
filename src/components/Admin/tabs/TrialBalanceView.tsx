import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useStore } from '../../../store';
import { AlertCircle, FileText, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';
import { JournalEntry } from '../../../core/types';

export default function TrialBalanceView() {
  const { journalEntries, fetchJournalEntries, runInstantTrialBalance, aiRadarLocator, trialBalance, radarAlerts, updateJournalEntry } = useStore();
  const [selectedBrokenEntry, setSelectedBrokenEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  useEffect(() => {
    runInstantTrialBalance(journalEntries);
    aiRadarLocator(journalEntries);
  }, [journalEntries, runInstantTrialBalance, aiRadarLocator]);

  const totalDebit = trialBalance.reduce((sum, row) => sum + row.totalDebit, 0);
  const totalCredit = trialBalance.reduce((sum, row) => sum + row.totalCredit, 0);
  const isBalanced = totalDebit === totalCredit && radarAlerts.length === 0;

  const fixEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrokenEntry) return;
    
    // Auto-balance by adjusting the first line
    const totalD = selectedBrokenEntry.lines.reduce((s, l) => s + l.debit, 0);
    const totalC = selectedBrokenEntry.lines.reduce((s, l) => s + l.credit, 0);
    
    const diff = totalD - totalC;
    
    const fixedLines = [...selectedBrokenEntry.lines];
    if (fixedLines.length > 0) {
       if (diff > 0) {
         fixedLines[0].credit += diff;
       } else {
         fixedLines[0].debit += Math.abs(diff);
       }
    }

    updateJournalEntry(selectedBrokenEntry.id, { lines: fixedLines, is_broken: false });
    setSelectedBrokenEntry(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* AI Radar Alert */}
      {radarAlerts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/20 rounded-full animate-pulse">
              <Zap className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h3 className="text-rose-500 font-bold text-lg flex items-center gap-2">
                ⚠️ Intelligent Radar Alert: Discrepancy found in ledger
              </h3>
              <p className="text-rose-400/80 text-sm">
                تم اكتشاف قيود غير متزنة (مدين لا يساوي دائن). يرجى مراجعتها فوراً.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {radarAlerts.map(alert => (
              <button
                key={alert.id}
                onClick={() => setSelectedBrokenEntry(alert)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-rose-500/20"
              >
                مراجعة القيد {alert.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trial Balance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="text-slate-400 font-bold">إجمالي المدين</h4>
          </div>
          <p className="text-3xl font-mono font-black text-white">{totalDebit.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="text-slate-400 font-bold">إجمالي الدائن</h4>
          </div>
          <p className="text-3xl font-mono font-black text-white">{totalCredit.toLocaleString()}</p>
        </div>
        <div className={`border rounded-3xl p-6 flex flex-col justify-center items-center text-center ${
          isBalanced ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          {isBalanced ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
              <h4 className="text-emerald-500 font-bold text-lg">ميزان المراجعة متزن</h4>
              <p className="text-emerald-400/70 text-sm">تم فحص جميع القيود بنجاح</p>
            </>
          ) : (
            <>
              <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
              <h4 className="text-rose-500 font-bold text-lg">يوجد خلل في الميزان</h4>
              <p className="text-rose-400/70 text-sm">المدين لا يساوي الدائن</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            ميزان المراجعة (Trial Balance)
          </h3>
        </div>
        <table className="w-full text-right">
          <thead className="bg-slate-800/50 text-slate-400">
            <tr>
              <th className="p-4 font-bold">الحساب</th>
              <th className="p-4 font-bold">إجمالي المدين</th>
              <th className="p-4 font-bold">إجمالي الدائن</th>
              <th className="p-4 font-bold">الرصيد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {trialBalance.map((row) => (
              <tr key={row.accountId} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium">{row.accountName}</td>
                <td className="p-4 font-mono text-emerald-400">{row.totalDebit > 0 ? row.totalDebit.toLocaleString() : '-'}</td>
                <td className="p-4 font-mono text-amber-400">{row.totalCredit > 0 ? row.totalCredit.toLocaleString() : '-'}</td>
                <td className="p-4 font-mono font-bold text-white">{row.balance.toLocaleString()}</td>
              </tr>
            ))}
            {trialBalance.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">لا توجد حركات مسجلة لتوليد الميزان</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Broken Entry Fix Modal */}
      {selectedBrokenEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-rose-500" />
                معالجة القيد غير المتزن
              </h3>
              <button onClick={() => setSelectedBrokenEntry(null)} className="text-slate-400 hover:text-white">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-400 text-sm">رقم القيد</p>
                  <p className="text-white font-mono">{selectedBrokenEntry.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">البيان</p>
                  <p className="text-white">{selectedBrokenEntry.description}</p>
                </div>
              </div>
              
              <table className="w-full text-right bg-slate-950 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-slate-400 text-sm">
                  <tr>
                    <th className="p-3">الحساب</th>
                    <th className="p-3 text-emerald-400">مدين</th>
                    <th className="p-3 text-amber-400">دائن</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedBrokenEntry.lines.map((line, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="p-3">{line.accountName}</td>
                      <td className="p-3 font-mono">{line.debit}</td>
                      <td className="p-3 font-mono">{line.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form onSubmit={fixEntry} className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedBrokenEntry(null)}
                className="flex-1 px-4 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
              >
                الموازنة التلقائية (Auto-Balance)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
