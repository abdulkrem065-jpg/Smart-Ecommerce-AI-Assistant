import React, { useState } from 'react';
import { useStore } from '../../../store';
import { FileText, Search, Eye, Filter, X, Download, Plus } from 'lucide-react';
import { Order, CartItem } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';
import { formatDate, formatCurrency } from '../../../core/utils';

export function SalesInvoicesTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { addOrder } = useStore();
  const [formData, setFormData] = useState({ customerName: '', phone: '', totalAmount: '', status: 'تم التسليم 🟢' as any });
  const handleSave = () => {
    if (!formData.customerName || !formData.totalAmount) return;
    addOrder({
      id: 'INV-' + Date.now().toString().slice(-6),
      customerName: formData.customerName,
      phone: formData.phone,
      address: 'إدخال يدوي',
      paymentMethod: 'نقدي',
      totalPrice: parseFloat(formData.totalAmount),
      currency: 'SAR',
      date: new Date().toISOString(),
      status: formData.status,
      items: [{
        product: { id: 'manual', name: 'إدخال يدوي', price: parseFloat(formData.totalAmount), category: 'other', image: '', description: '' },
        quantity: 1,
        selectedSubOptions: {}
      }]
    } as Order);
    setShowAddModal(false);
    setFormData({ customerName: '', phone: '', totalAmount: '', status: 'تم التسليم 🟢' });
  };

  const filteredOrders = orders.filter((o: Order) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex justify-between items-center bg-[#0b1329] p-4 rounded-xl shadow-lg border border-blue-900/40">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          {t('salesInvoices.title', lang)}
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <input 
              type="text"
              placeholder={t('searchByIdOrCustomer', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64`}
            />
          </div>
          <div className="relative">
            <Filter className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-emerald-500 appearance-none`}
            >
              <option value="الكل">{t('allStatuses', lang)}</option>
              <option value="تم التسليم 🟢">{t('delivered', lang)}</option>
              <option value="قيد المعالجة">{t('processing', lang)}</option>
              <option value="مرفوض 🔴">{t('rejected', lang)}</option>
            </select>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> 
            {lang === 'en' ? 'Add Invoice' : 'إضافة فاتورة'}
          </button>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('invoiceId', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('customer', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('paymentMethod', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('totalAmount', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('status', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-[#0f172a]/5 transition-colors">
                    <td className="p-4 text-sm font-medium text-white">{order.id}</td>
                    <td className="p-4 text-sm text-slate-300">{order.customerName}</td>
                    <td className="p-4 text-sm text-slate-300">{formatDate(order.date, lang)}</td>
                    <td className="p-4 text-sm text-slate-300">{lang === 'en' && order.paymentMethod === 'نقدي' ? 'Cash' : order.paymentMethod}</td>
                    <td className="p-4 text-sm font-bold text-emerald-400">{order.totalPrice} {lang === 'en' ? (order.currency === 'SAR' ? 'SAR' : 'YER') : order.currency}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        order.status === 'تم التسليم 🟢' ? 'bg-emerald-500/20 text-emerald-400' :
                        order.status === 'مرفوض 🔴' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {lang === 'en' && order.status === 'تم التسليم 🟢' ? 'Delivered 🟢' : 
                         lang === 'en' && order.status === 'مرفوض 🔴' ? 'Rejected 🔴' : 
                         lang === 'en' && order.status === 'قيد المعالجة' ? 'Processing' : order.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(order)}
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors"
                        title={t('viewDetails', lang)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
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
                <FileText className="w-5 h-5 text-emerald-400" />
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
                  <p className="text-xs text-slate-400 mb-1">{t('customerName', lang)}</p>
                  <p className="font-bold text-white">{selectedInvoice.customerName}</p>
                </div>
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{t('phone', lang)}</p>
                  <p className="font-bold text-white" dir="ltr">{selectedInvoice.customerPhone}</p>
                </div>
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{t('invoiceDate', lang)}</p>
                  <p className="font-bold text-white">{formatDate(selectedInvoice.date, lang)}</p>
                </div>
                <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                  <p className="text-xs text-slate-400 mb-1">{t('paymentMethod', lang)}</p>
                  <p className="font-bold text-emerald-400">{lang === 'en' && selectedInvoice.paymentMethod === 'نقدي' ? 'Cash' : selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-[#060b18] rounded-xl border border-blue-900/40 overflow-hidden">
                <h4 className="p-4 font-bold text-white border-b border-blue-900/40">{t('items', lang)}</h4>
                <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                  <thead className="bg-[#0b1329]">
                    <tr>
                      <th className="p-3 text-xs text-slate-400">{t('product', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('quantity', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('unitPrice', lang)}</th>
                      <th className="p-3 text-xs text-slate-400">{t('total', lang)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {selectedInvoice.items.map((item: CartItem, idx: number) => (
                      <tr key={idx} className="hover:bg-[#0f172a]/5">
                        <td className="p-3 text-sm text-white">{item.product.name}</td>
                        <td className="p-3 text-sm text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-sm text-slate-300">{item.product.price} {selectedInvoice.currency}</td>
                        <td className="p-3 text-sm font-bold text-emerald-400">
                          {item.quantity * item.product.price} {selectedInvoice.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                <span className="text-slate-400 font-bold">{t('finalTotal', lang)}</span>
                <span className="text-2xl font-black text-emerald-400">{formatCurrency(selectedInvoice.totalPrice, selectedInvoice.currency, lang)}</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] flex justify-end gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition-colors font-bold text-sm">
                <Download className="w-4 h-4" />
                {t('downloadPdf', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">
                {lang === 'en' ? 'Add Sales Invoice' : 'إضافة فاتورة مبيعات'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('customerName', lang)}</label>
                <input 
                  type="text" 
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('customerName', lang)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('phone', lang)}</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('phone', lang)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('totalAmount', lang)}</label>
                <input 
                  type="number" 
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('status', lang)}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="تم التسليم 🟢">{t('delivered', lang)}</option>
                  <option value="قيد المعالجة">{t('processing', lang)}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-blue-900/40">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  {t('save', lang)}
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  {t('cancel', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={t('confirmDelete', lang)}
        message={t('confirmDeleteMsg', lang)}
        onConfirm={() => {
          if (itemToDelete) deleteOrder(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}