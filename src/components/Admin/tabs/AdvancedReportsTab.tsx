import React, { useState } from 'react';
import { useStore } from '../../../store';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';
import { BarChart3, Download, Printer } from 'lucide-react';

export const AdvancedReportsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'aging' | 'cashFlow' | 'products' | 'customers' | 'budget'>('aging');
  
  const { customers, orders, products, costCenters, accounts } = useStore();

  const handleExport = () => {
    // Basic CSV export logic
    alert(t('exportCsv') + " logic here");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BarChart3 className="text-purple-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">{t('advancedReports.title')}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 bg-[#0f172a] border border-blue-900/40 text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors">
            <Download size={18} />
            <span>{t('exportCsv')}</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0f172a] border border-blue-900/40 text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors">
            <Printer size={18} />
            <span>{t('print')}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 bg-[#0f172a] p-2 rounded-xl shadow-sm border border-blue-900/40">
        {[
          { id: 'aging', label: t('agingReport') },
          { id: 'cashFlow', label: t('cashFlowReport') },
          { id: 'products', label: t('productProfitability') },
          { id: 'customers', label: t('customerProfitability') },
          { id: 'budget', label: t('budgetComparison') }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === tab.id 
                ? 'bg-purple-100 text-purple-700 font-medium' 
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0f172a] rounded-xl shadow-sm border border-blue-900/40 p-6 overflow-x-auto">
        {activeSubTab === 'aging' && (
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-3">{t('customerName')}</th>
                  <th className="px-6 py-3 text-green-600">{t('aging.notDue')} (0-30)</th>
                  <th className="px-6 py-3 text-yellow-600">{t('aging.late')} (31-60)</th>
                  <th className="px-6 py-3 text-orange-600">{t('aging.veryLate')} (61-90)</th>
                  <th className="px-6 py-3 text-red-600">{t('aging.doubtful')} (+90)</th>
                  <th className="px-6 py-3 font-bold">{t('totalAmount')}</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map(c => (
                  <tr key={c.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4 text-red-600">0</td>
                    <td className="px-6 py-4 font-bold">{c.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'cashFlow' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-green-800 font-semibold mb-2">{t('cashIn')}</h3>
              <p className="text-3xl font-bold text-green-600">120,500</p>
            </div>
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-red-800 font-semibold mb-2">{t('cashOut')}</h3>
              <p className="text-3xl font-bold text-red-600">45,200</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-blue-800 font-semibold mb-2">{t('netCashFlow')}</h3>
              <p className="text-3xl font-bold text-blue-600">75,300</p>
            </div>
          </div>
        )}

        {activeSubTab === 'products' && (
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-3">{t('product')}</th>
                  <th className="px-6 py-3">{t('quantity')}</th>
                  <th className="px-6 py-3">{t('amount')}</th>
                  <th className="px-6 py-3">{t('profitMargin')}</th>
                </tr>
              </thead>
              <tbody>
                {products?.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4">{p.price * 10}</td>
                    <td className="px-6 py-4 text-green-600">25%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'customers' && (
           <div>
           <table className="w-full text-sm text-left rtl:text-right text-slate-400">
             <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
               <tr>
                 <th className="px-6 py-3">{t('customerName')}</th>
                 <th className="px-6 py-3">{t('totalPurchases')}</th>
                 <th className="px-6 py-3">{t('amount')}</th>
               </tr>
             </thead>
             <tbody>
               {customers?.map(c => (
                 <tr key={c.id} className="border-b">
                   <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                   <td className="px-6 py-4">5</td>
                   <td className="px-6 py-4">{c.totalPurchases}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
        )}

        {activeSubTab === 'budget' && (
           <div>
           <table className="w-full text-sm text-left rtl:text-right text-slate-400">
             <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
               <tr>
                 <th className="px-6 py-3">{t('name')}</th>
                 <th className="px-6 py-3">{t('budget')}</th>
                 <th className="px-6 py-3">{t('actualSpending')}</th>
                 <th className="px-6 py-3">{t('deviation')}</th>
               </tr>
             </thead>
             <tbody>
               {costCenters?.map(c => {
                 const dev = c.budget - c.actualSpending;
                 return (
                 <tr key={c.id} className="border-b">
                   <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                   <td className="px-6 py-4">{c.budget}</td>
                   <td className="px-6 py-4">{c.actualSpending}</td>
                   <td className={`px-6 py-4 font-bold ${dev < 0 ? 'text-red-600' : 'text-green-600'}`}>
                     {dev > 0 ? '+' : ''}{dev}
                   </td>
                 </tr>
               )})}
             </tbody>
           </table>
         </div>
        )}
      </div>
    </div>
  );
};
