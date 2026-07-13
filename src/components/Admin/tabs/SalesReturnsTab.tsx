import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Undo2, Search, Plus, FileText, X } from 'lucide-react';
import { SalesReturn, Order } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';

export default function SalesReturnsTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { salesReturns, orders, createSalesReturn } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewReturn, setViewReturn] = useState<SalesReturn | null>(null);

  const [formData, setFormData] = useState({
    orderId: '',
    reason: '',
    items: [] as any[]
  });

  const filteredReturns = salesReturns.filter((r: SalesReturn) =>
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOrder = orders.find(o => o.id === formData.orderId);

  const handleSave = async () => {
    if (!formData.orderId || formData.items.length === 0) return;
    try {
      await createSalesReturn({ orderId: formData.orderId, customerName: selectedOrder?.customerName || 'عميل نقدي', totalRefund: formData.items.reduce((s, i) => s + i.totalPrice, 0), reason: formData.reason, items: formData.items });
      setShowAddModal(false);
      setFormData({ orderId: '', reason: '', items: [] });
    } catch (error) {
      console.error(error);
      alert('Error saving return');
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Undo2 className="w-6 h-6 text-red-400" />
          {t('salesReturns.title', lang)}
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <input
              type="text"
              placeholder={t('search', lang) + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:w-64 bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-red-500`}
            />
          </div>
          <button
            onClick={() => {
              setFormData({ orderId: '', reason: '', items: [] });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addSalesReturn', lang)}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('invoiceId', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('originalOrder', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('customer', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('refundAmount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('status', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredReturns.map((r: SalesReturn) => (
                <tr key={r.id} className="hover:bg-[#0f172a]/5 transition-colors">
                  <td className="p-4 text-sm font-medium text-white">{r.id}</td>
                  <td className="p-4 text-sm text-slate-300">{r.orderId}</td>
                  <td className="p-4 text-sm text-slate-300">{r.customerName}</td>
                  <td className="p-4 text-sm text-slate-300">{new Date(r.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA')}</td>
                  <td className="p-4 text-sm font-bold text-red-400">{r.totalRefund}</td>
                  <td className="p-4 text-sm">
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setViewReturn(r)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40" title={t('details', lang)}>
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {t('addSalesReturn', lang)}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('originalOrder', lang)}</label>
                <select
                  value={formData.orderId}
                  onChange={e => {
                    setFormData({ orderId: e.target.value, reason: '', items: [] });
                  }}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-red-500 appearance-none"
                >
                  <option value="">-- Select Order --</option>
                  {orders.map((o: Order) => (
                    <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>
                  ))}
                </select>
              </div>
              
              {selectedOrder && (
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <h4 className="font-bold text-white mb-3">{t('items', lang)}</h4>
                  {selectedOrder.items.map((item, idx) => {
                    const selectedItem = formData.items.find(i => i.productId === item.product.id);
                    const isSelected = !!selectedItem;
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-blue-900/20 last:border-0">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  items: [...formData.items, {
                                    productId: item.product.id,
                                    productName: item.product.name,
                                    quantity: item.quantity,
                                    unitPrice: item.product.price,
                                    totalPrice: item.quantity * item.product.price
                                  }]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  items: formData.items.filter(i => i.productId !== item.product.id)
                                });
                              }
                            }}
                            className="w-4 h-4 rounded text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 bg-gray-700 border-gray-600"
                          />
                          <div>
                            <p className="text-white text-sm">{item.product.name}</p>
                            <p className="text-xs text-slate-400">{item.product.price} x {item.quantity}</p>
                          </div>
                        </div>
                        {isSelected && (
                           <div className="flex items-center gap-2">
                             <input 
                               type="number"
                               min="1"
                               max={item.quantity}
                               value={selectedItem.quantity}
                               onChange={(e) => {
                                 const val = Number(e.target.value);
                                 if(val > 0 && val <= item.quantity) {
                                   setFormData({
                                      ...formData,
                                      items: formData.items.map(i => i.productId === item.product.id ? {
                                        ...i, quantity: val, totalPrice: val * item.product.price
                                      } : i)
                                   })
                                 }
                               }}
                               className="w-16 bg-[#0b1329] text-white border border-blue-900/40 rounded p-1 text-center"
                             />
                           </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('returnReason', lang)}</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  disabled={formData.items.length === 0}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {t('save', lang)}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#0f172a]/5 text-white py-3 rounded-lg font-bold hover:bg-[#0f172a]/10 transition-colors"
                >
                  {t('cancel', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewReturn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/40 bg-[#060b18]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                {t('details', lang)} - {viewReturn.id}
              </h3>
              <button onClick={() => setViewReturn(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('originalOrder', lang)}</p>
                    <p className="font-bold text-white">{viewReturn.orderId}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('customer', lang)}</p>
                    <p className="font-bold text-white">{viewReturn.customerName}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('refundAmount', lang)}</p>
                    <p className="font-bold text-red-400">{viewReturn.totalRefund}</p>
                  </div>
               </div>
               
               <div className="bg-[#060b18] rounded-xl border border-blue-900/40 p-4">
                  <p className="text-xs text-slate-400 mb-1">{t('returnReason', lang)}</p>
                  <p className="font-bold text-white">{viewReturn.reason}</p>
               </div>

               <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                  <thead className="bg-[#0b1329]">
                    <tr>
                      <th className="p-3 text-xs text-slate-400">{t('product', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('quantity', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('total', lang)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {viewReturn.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-3 text-sm text-white">{item.productName}</td>
                        <td className="p-3 text-sm text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-sm font-bold text-emerald-400">
                          {item.totalPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] flex justify-end gap-2">
              <button onClick={() => setViewReturn(null)} className="px-4 py-2 bg-[#0f172a]/5 text-white rounded-lg hover:bg-[#0f172a]/10 transition-colors font-bold text-sm">
                {t('close', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
