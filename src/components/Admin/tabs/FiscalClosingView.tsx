import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useStore } from '../../../store';
import { Lock, Unlock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function FiscalClosingView() {
  const { 
    isPeriodLocked, 
    checkPeriodLock, 
    closeCurrentFiscalPeriod,
    incomeStatement
  } = useStore() as any;

  const [confirmClosing, setConfirmClosing] = useState(false);

  useEffect(() => {
    if (checkPeriodLock) checkPeriodLock();
  }, [checkPeriodLock]);

  const handleClosePeriod = () => {
    if (closeCurrentFiscalPeriod) {
      closeCurrentFiscalPeriod();
      setConfirmClosing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${isPeriodLocked ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
            {isPeriodLocked ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">إقفال الفترة المالية (Period Closing)</h2>
            <p className="text-slate-400 mt-1">
              {isPeriodLocked 
                ? 'الفترة المالية مغلقة حالياً. لا يمكن إضافة أو تعديل قيود جديدة.' 
                : 'الفترة المالية مفتوحة. يمكنك ترحيل الأرباح والخسائر وإقفال الفترة.'}
            </p>
          </div>
        </div>

        {isPeriodLocked ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-amber-500 font-bold text-lg">الفترة مغلقة بنجاح</h3>
              <p className="text-amber-400/80 text-sm mt-1">
                تم إنشاء قيود الإقفال الآلية وترحيل الأرباح/الخسائر إلى الأرباح المحتجزة. جميع القيود السابقة محمية ضد التعديل.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-slate-300 mb-4">ملخص قبل الإقفال:</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">صافي النتيجة المرحلة</p>
                  <p className={`text-xl font-bold font-mono ${incomeStatement?.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.abs(incomeStatement?.netIncome || 0).toLocaleString()} 
                    <span className="text-sm font-normal mr-2">
                      {incomeStatement?.netIncome >= 0 ? '(ربح)' : '(خسارة)'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {!confirmClosing ? (
              <button
                onClick={() => setConfirmClosing(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                <Lock className="w-5 h-5" />
                المبادرة بإقفال الفترة المالية
              </button>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/50 rounded-2xl p-6 animate-in zoom-in-95">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                  <h3 className="text-rose-500 font-bold text-lg">تأكيد الإقفال النهائي</h3>
                </div>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  هل أنت متأكد من رغبتك في إقفال الفترة المالية؟ <br/>
                  سيؤدي هذا الإجراء إلى ترحيل الإيرادات والمصروفات إلى حساب الأرباح المحتجزة وقفلهما. <br/>
                  <strong>لا يمكن التراجع عن هذا الإجراء ولن تتمكن من تعديل أو حذف القيود السابقة.</strong>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmClosing(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                  >
                    إلغاء الترحيل
                  </button>
                  <button
                    onClick={handleClosePeriod}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    تأكيد الإقفال والترحيل
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
