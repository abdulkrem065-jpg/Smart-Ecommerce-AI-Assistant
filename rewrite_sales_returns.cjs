const fs = require('fs');

const code = `import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Search, Plus, Eye, Trash2, X, Printer, Percent, Truck, Landmark } from 'lucide-react';
import { t } from '../../../core/translations';
import { SalesReturn, ReturnItem } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { formatCurrency, formatDate } from '../../../core/utils';

export function SalesReturnsTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { salesReturns, orders, createSalesReturn, deleteSalesReturn, tenantConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<ReturnItem[]>([]);

  // Toggles
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [discountValue, setDiscountValue] = useState(0);

  const [enableDelivery, setEnableDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [enableTax, setEnableTax] = useState(false);
  const [taxPercent, setTaxPercent] = useState(15);

  const handleOrderChange = (oId: string) => {
    setOrderId(oId);
    const order = orders.find(o => o.id === oId);
    if (order) {
      setItems(order.items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        refundAmount: i.quantity * i.product.price
      })));
    } else {
      setItems([]);
    }
  };

  const handleUpdateQuantity = (idx: number, qty: number) => {
    if (qty < 0) return;
    const newItems = [...items];
    const originalItem = orders.find(o => o.id === orderId)?.items.find(i => i.product.id === newItems[idx].productId);
    if (originalItem && qty > originalItem.quantity) return;

    newItems[idx].quantity = qty;
    newItems[idx].refundAmount = qty * newItems[idx].unitPrice;
    setItems(newItems);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const activeItems = items.filter(i => i.quantity > 0);
  const itemsTotal = activeItems.reduce((sum, item) => sum + item.refundAmount, 0);
  const discountAmount = enableDiscount ? (discountType === 'percentage' ? (itemsTotal * (discountValue / 100)) : discountValue) : 0;
  const deliveryAmount = enableDelivery ? deliveryFee : 0;
  const subtotalAfterDiscountAndDelivery = itemsTotal - discountAmount + deliveryAmount;
  const taxAmount = enableTax ? (subtotalAfterDiscountAndDelivery * (taxPercent / 100)) : 0;
  const finalTotal = subtotalAfterDiscountAndDelivery + taxAmount;

  const handleSave = () => {
    if (activeItems.length === 0 || !orderId) return;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newReturn = {
      orderId,
      customerId: order.customerId,
      customerName: order.customerName,
      items: activeItems,
      totalRefund: finalTotal,
      reason,
      date: new Date().toISOString(),
      status: 'معتمد',
      discountAmount,
      deliveryAmount,
      taxAmount,
      taxPercent: enableTax ? taxPercent : 0,
      subTotal: itemsTotal
    } as any;

    createSalesReturn(newReturn);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setOrderId('');
    setReason('');
    setItems([]);
    setEnableDiscount(false);
    setDiscountValue(0);
    setEnableDelivery(false);
    setDeliveryFee(0);
    setEnableTax(false);
    setTaxPercent(15);
  };

  const filteredReturns = salesReturns.filter((r: SalesReturn) => {
    return r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.orderId.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
            <Search className="w-6 h-6" />
          </div>
          {lang === 'en' ? 'Sales Returns' : 'مرتجعات المبيعات'}
        </h2>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('search', lang)}
              className="w-full bg-[#0b1329] border border-blue-900/40 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <Plus className="w-4 h-4" /> 
            {lang === 'en' ? 'Add Return' : 'مرتجع جديد'}
          </button>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={\`w-full \${lang === 'en' ? 'text-left' : 'text-right'}\`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400">{t('returnId', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('orderId', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('customerName', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('returnDate', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('totalRefund', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('status', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((ret: any) => (
                  <tr key={ret.id} className="hover:bg-[#0f172a]/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-white">{ret.id}</td>
                    <td className="p-4 text-sm font-bold text-blue-400">{ret.orderId}</td>
                    <td className="p-4 text-sm text-slate-300">{ret.customerName}</td>
                    <td className="p-4 text-sm text-slate-300" dir="ltr">{formatDate(ret.date, lang)}</td>
                    <td className="p-4 text-sm font-bold text-red-400">
                      {formatCurrency(ret.totalRefund, 'SAR', lang)}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#060b18] border border-blue-900/40 text-slate-300">
                        {ret.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedReturn(ret)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* <button onClick={() => setItemToDelete(ret.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {lang === 'en' ? 'No sales returns found.' : 'لم يتم العثور على مرتجعات مبيعات.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-4xl shadow-2xl my-8">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center sticky top-0 bg-[#060b18] rounded-t-2xl z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-400" />
                {lang === 'en' ? 'New Sales Return' : 'مرتجع مبيعات جديد'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t('orderId', lang)}</label>
                  <select 
                    value={orderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                  >
                    <option value="">{lang === 'en' ? 'Select Original Order' : 'اختر الطلب الأصلي'}</option>
                    {orders.filter(o => o.status !== 'ملغي ❌' && o.status !== 'مرتجع').map(o => (
                      <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t('returnReason', lang)}</label>
                  <input 
                    type="text" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                    placeholder={lang === 'en' ? 'Return Reason' : 'سبب الاسترجاع'}
                  />
                </div>
              </div>

              {/* Items Section */}
              {orderId && (
                <div className="bg-[#060b18] rounded-xl border border-blue-900/40 p-4 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="font-bold text-white">{t('items', lang)}</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0b1329] text-slate-400">
                        <tr>
                          <th className="p-2">{t('product', lang)}</th>
                          <th className="p-2 w-32">{lang === 'en' ? 'Return Qty' : 'الكمية المرتجعة'}</th>
                          <th className="p-2">{t('unitPrice', lang)}</th>
                          <th className="p-2">{t('totalRefund', lang)}</th>
                          <th className="p-2 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-900/20 text-white">
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2">{item.productName}</td>
                            <td className="p-2">
                              <input 
                                type="number" min="0" 
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(idx, parseInt(e.target.value) || 0)}
                                className="w-full bg-[#0b1329] border border-blue-900/40 rounded p-1 text-center"
                              />
                            </td>
                            <td className="p-2 text-center">{item.unitPrice}</td>
                            <td className="p-2 text-center font-bold text-red-400">{item.refundAmount}</td>
                            <td className="p-2 text-center">
                              <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setEnableDiscount(!enableDiscount)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableDiscount ? 'bg-red-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Percent className="w-4 h-4" /> {lang === 'en' ? 'Discount Deduction' : 'خصم'}
                </button>
                <button 
                  onClick={() => setEnableDelivery(!enableDelivery)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableDelivery ? 'bg-blue-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Truck className="w-4 h-4" /> {lang === 'en' ? 'Delivery Deduction' : 'توصيل'}
                </button>
                <button 
                  onClick={() => setEnableTax(!enableTax)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableTax ? 'bg-orange-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Landmark className="w-4 h-4" /> {lang === 'en' ? 'Tax Deduction' : 'ضريبة'}
                </button>
              </div>

              {/* Toggle Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enableDiscount && (
                  <div className="bg-[#060b18] p-4 rounded-xl border border-red-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-red-400">{lang === 'en' ? 'Discount' : 'قيمة الخصم المسترجع'}</label>
                      <button onClick={() => setEnableDiscount(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-2">
                      <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} className="bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white text-sm">
                        <option value="amount">{tenantConfig?.currency || 'SAR'}</option>
                        <option value="percentage">%</option>
                      </select>
                      <input type="number" value={discountValue} onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)} className="w-full bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white" />
                    </div>
                  </div>
                )}
                {enableDelivery && (
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-blue-400">{lang === 'en' ? 'Delivery Fee' : 'مصاريف التوصيل'}</label>
                      <button onClick={() => setEnableDelivery(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)} className="w-full bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white" />
                  </div>
                )}
                {enableTax && (
                  <div className="bg-[#060b18] p-4 rounded-xl border border-orange-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-orange-400">{lang === 'en' ? 'Tax (%)' : 'نسبة الضريبة (%)'}</label>
                      <button onClick={() => setEnableTax(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)} className="w-full bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white" />
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-[#060b18] p-6 rounded-xl border border-blue-900/40 space-y-3">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{lang === 'en' ? 'Subtotal' : 'إجمالي المرتجعات'}:</span>
                  <span>{formatCurrency(itemsTotal, tenantConfig?.currency || 'SAR', lang)}</span>
                </div>
                {enableDiscount && (
                  <div className="flex justify-between text-sm text-red-400">
                    <span>{lang === 'en' ? 'Discount Deduction' : 'خصم مسترجع'} ({discountType === 'percentage' ? \`\${discountValue}%\` : formatCurrency(discountValue, tenantConfig?.currency || 'SAR', lang)}):</span>
                    <span>- {formatCurrency(discountAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                {enableDelivery && (
                  <div className="flex justify-between text-sm text-blue-400">
                    <span>{lang === 'en' ? 'Delivery Deduction' : 'مصاريف التوصيل'}:</span>
                    <span>- {formatCurrency(deliveryAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                {enableTax && (
                  <div className="flex justify-between text-sm text-orange-400">
                    <span>{lang === 'en' ? 'Tax Deduction' : 'الضريبة'} ({taxPercent}%):</span>
                    <span>- {formatCurrency(taxAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-blue-900/40 flex justify-between items-center">
                  <span className="font-bold text-white">{lang === 'en' ? 'Net Refund' : 'صافي المبلغ المرتجع'}:</span>
                  <span className="text-2xl font-black text-red-400">{formatCurrency(finalTotal, tenantConfig?.currency || 'SAR', lang)}</span>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] rounded-b-2xl flex gap-3 sticky bottom-0">
              <button 
                onClick={handleSave}
                disabled={activeItems.length === 0}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
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
      )}

      {/* Preview Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0 print:bg-white overflow-y-auto">
          <div className="bg-white text-black w-full max-w-3xl rounded-xl shadow-2xl print:shadow-none print:w-full print:rounded-none relative my-8 print:my-0">
            
            <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
              <button onClick={printInvoice} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedReturn(null)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 print:p-6" id="invoice-print-area" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 mb-2">{tenantConfig?.name || 'اسم المتجر'}</h1>
                  <p className="text-sm text-slate-500">{lang === 'en' ? 'Tax No' : 'الرقم الضريبي'}: 1234567890</p>
                  <p className="text-sm text-slate-500">{lang === 'en' ? 'Sales Return' : 'مرتجع مبيعات'}</p>
                </div>
                <div className="text-end">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedReturn.id}</h2>
                  <p className="text-sm font-bold text-slate-600">{formatDate(selectedReturn.date, lang)}</p>
                  <p className="text-sm text-slate-500 mt-1">{lang === 'en' ? 'Original Order' : 'الطلب الأصلي'}: {selectedReturn.orderId}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'Customer' : 'العميل'}</h3>
                <p className="font-bold text-lg text-slate-800">{selectedReturn.customerName}</p>
                {selectedReturn.reason && (
                  <p className="text-slate-600 mt-2 text-sm"><span className="font-bold">{lang === 'en' ? 'Reason:' : 'السبب:'}</span> {selectedReturn.reason}</p>
                )}
              </div>

              {/* Items */}
              <table className="w-full mb-8 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-start font-bold text-slate-700">{lang === 'en' ? 'Item' : 'الصنف'}</th>
                    <th className="p-3 text-center font-bold text-slate-700">{lang === 'en' ? 'Qty' : 'الكمية'}</th>
                    <th className="p-3 text-center font-bold text-slate-700">{lang === 'en' ? 'Price' : 'السعر'}</th>
                    <th className="p-3 text-end font-bold text-slate-700">{lang === 'en' ? 'Total' : 'الإجمالي'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedReturn.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 text-slate-800">{item.productName || item.name}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="p-3 text-center text-slate-600">{item.unitPrice || item.price}</td>
                      <td className="p-3 text-end font-bold text-slate-800">{item.refundAmount || (item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3 text-sm">
                  {selectedReturn.subTotal !== undefined && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Subtotal' : 'إجمالي الأصناف'}:</span>
                      <span>{formatCurrency(selectedReturn.subTotal, 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedReturn.discountAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Discount Deduction' : 'خصم مسترجع'}:</span>
                      <span>- {formatCurrency(selectedReturn.discountAmount, 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedReturn.deliveryAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Delivery' : 'مصاريف التوصيل'}:</span>
                      <span>- {formatCurrency(selectedReturn.deliveryAmount, 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedReturn.taxAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Tax' : 'الضريبة'} ({selectedReturn.taxPercent}%):</span>
                      <span>- {formatCurrency(selectedReturn.taxAmount, 'SAR', lang)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800 font-black text-lg text-slate-800">
                    <span>{lang === 'en' ? 'Net Refund' : 'صافي المبلغ المرتجع'}:</span>
                    <span>{formatCurrency(selectedReturn.totalRefund, 'SAR', lang)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                <p>{lang === 'en' ? 'Thank you for your business!' : 'شكراً لتعاملكم معنا!'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <ConfirmModal
        isOpen={!!itemToDelete}
        title={t('confirmDelete', lang)}
        message={t('confirmDeleteMsg', lang)}
        onConfirm={() => {
          if (itemToDelete) deleteSalesReturn(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      /> */}
    </div>
  );
}
`
fs.writeFileSync('src/components/Admin/tabs/SalesReturnsTab.tsx', code);
