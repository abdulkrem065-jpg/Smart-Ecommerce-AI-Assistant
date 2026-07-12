import React, { useState } from 'react';
import { useStore } from '../../../store';
import { ShoppingCart, Search, Eye, Filter, CreditCard, X, CheckCircle } from 'lucide-react';
import { PurchaseInvoice, PurchaseItem } from '../../../core/types';
import { t } from '../../../core/translations';

export function PurchaseInvoicesTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { purchaseInvoices, paySupplierInvoice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  const filteredInvoices = purchaseInvoices.filter((inv: PurchaseInvoice) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePay = (id: string) => {
    const msg = t('payInvoiceConfirm', lang);
    if (confirm(msg)) {
      paySupplierInvoice(id, 'نقدي');
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex justify-between items-center bg-[#0b1329] p-4 rounded-xl shadow-lg border border-blue-900/40">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-indigo-400" />
          {t('purchaseInvoices.title', lang)}
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <input 
              type="text"
              placeholder={t('searchByIdOrSupplier', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-64`}
            />
          </div>
          <div className="relative">
            <Filter className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-indigo-500 appearance-none`}
            >
              <option value="الكل">{t('allStatuses', lang)}</option>
              <option value="مفتوحة">{t('open', lang)}</option>
              <option value="مدفوعة">{t('paid', lang)}</option>
              <option value="ملغية">{t('cancelled', lang)}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('invoiceId', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('supplier', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('totalAmount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('status', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv: PurchaseInvoice) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-medium text-white">{inv.id}</td>
                    <td className="p-4 text-sm text-slate-300">{inv.supplierName}</td>
                    <td className="p-4 text-sm text-slate-300">{new Date(inv.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA')}</td>
                    <td className="p-4 text-sm font-bold text-indigo-400">{inv.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        inv.status === 'مدفوعة' ? 'bg-emerald-500/20 text-emerald-400' :
                        inv.status === 'ملغية' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {lang === 'en' && inv.status === 'مدفوعة' ? 'Paid' :
                         lang === 'en' && inv.status === 'ملغية' ? 'Cancelled' :
                         lang === 'en' && inv.status === 'مفتوحة' ? 'Open' : inv.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors" 
                        title={t('viewDetails', lang)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.status === 'مفتوحة' && (
                        <button 
                          onClick={() => handlePay(inv.id)}
                          className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/40 transition-colors"
                          title={t('payInvoice', lang)}
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {t('noInvoicesMatch', lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/40 bg-[#060b18]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                {t('invoiceDetails', lang)} - {selectedInvoice.id}
              </h3>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{t('supplierName', lang)}</p>
                  <p className="font-bold text-white">{selectedInvoice.supplierName}</p>
                </div>
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{t('invoiceDate', lang)}</p>
                  <p className="font-bold text-white">{new Date(selectedInvoice.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA')}</p>
                </div>
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{lang === 'en' ? 'Status' : 'حالة الفاتورة'}</p>
                  <p className={`font-bold ${
                        selectedInvoice.status === 'مدفوعة' ? 'text-emerald-400' :
                        selectedInvoice.status === 'ملغية' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                     {lang === 'en' && selectedInvoice.status === 'مدفوعة' ? 'Paid' :
                      lang === 'en' && selectedInvoice.status === 'ملغية' ? 'Cancelled' :
                      lang === 'en' && selectedInvoice.status === 'مفتوحة' ? 'Open' : selectedInvoice.status}
                  </p>
                </div>
                {selectedInvoice.paymentDate && (
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('paymentDate', lang)}</p>
                    <p className="font-bold text-white">{new Date(selectedInvoice.paymentDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA')}</p>
                  </div>
                )}
              </div>

              <div className="bg-[#060b18] rounded-xl border border-blue-900/40 overflow-hidden">
                <h4 className="p-4 font-bold text-white border-b border-blue-900/40">{t('purchasedItems', lang)}</h4>
                <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                  <thead className="bg-[#0b1329]">
                    <tr>
                      <th className="p-3 text-xs text-slate-400">{t('product', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('quantity', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('unitCost', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('total', lang)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {selectedInvoice.items.map((item: PurchaseItem, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="p-3 text-sm text-white">{item.productName || item.productId}</td>
                        <td className="p-3 text-sm text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-sm text-slate-300">{item.unitCost}</td>
                        <td className="p-3 text-sm font-bold text-indigo-400">
                          {item.totalCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                <span className="text-slate-400 font-bold">{t('finalTotal', lang)}</span>
                <span className="text-2xl font-black text-indigo-400">{selectedInvoice.totalAmount}</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] flex justify-end gap-2">
              {selectedInvoice.status === 'مفتوحة' && (
                <button 
                  onClick={() => {
                    handlePay(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/40 transition-colors font-bold text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('markAsPaid', lang)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
