const fs = require('fs');

const code = `import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Search, Plus, Eye, Trash2, X, Printer, Percent, Truck, Landmark } from 'lucide-react';
import { t } from '../../../core/translations';
import { PurchaseInvoice, PurchaseItem } from '../../../core/types';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { formatCurrency, formatDate } from '../../../core/utils';

export function PurchaseInvoicesTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { purchaseInvoices, products, suppliers, createPurchaseInvoice, deletePurchaseInvoice, tenantConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('نقدي');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [status, setStatus] = useState<any>('مفتوحة');

  // Toggles
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [discountValue, setDiscountValue] = useState(0);

  const [enableDelivery, setEnableDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [enableTax, setEnableTax] = useState(false);
  const [taxPercent, setTaxPercent] = useState(15);

  // Select Product logic
  const [selectedProductId, setSelectedProductId] = useState('');
  const [manualCost, setManualCost] = useState('');

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;
    
    const cost = manualCost ? parseFloat(manualCost) : prod.costPrice || prod.price;
    
    const existing = items.find(i => i.productId === selectedProductId);
    if (existing) {
      setItems(items.map(i => i.productId === selectedProductId ? { 
        ...i, 
        quantity: i.quantity + 1,
        totalCost: (i.quantity + 1) * cost
      } : i));
    } else {
      setItems([...items, { 
        productId: prod.id, 
        productName: prod.name, 
        quantity: 1,
        unitCost: cost,
        totalCost: cost
      }]);
    }
    setSelectedProductId('');
    setManualCost('');
  };

  const handleUpdateQuantity = (idx: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...items];
    newItems[idx].quantity = qty;
    newItems[idx].totalCost = qty * newItems[idx].unitCost;
    setItems(newItems);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const itemsTotal = items.reduce((sum, item) => sum + item.totalCost, 0);
  const discountAmount = enableDiscount ? (discountType === 'percentage' ? (itemsTotal * (discountValue / 100)) : discountValue) : 0;
  const deliveryAmount = enableDelivery ? deliveryFee : 0;
  const subtotalAfterDiscountAndDelivery = itemsTotal - discountAmount + deliveryAmount;
  const taxAmount = enableTax ? (subtotalAfterDiscountAndDelivery * (taxPercent / 100)) : 0;
  const finalTotal = subtotalAfterDiscountAndDelivery + taxAmount;

  const handleSave = () => {
    if (items.length === 0) return;
    const finalSupplierName = supplierId ? (suppliers.find(s => s.id === supplierId)?.name || supplierName) : (supplierName || 'مورد غير مسجل');

    const newInvoice = {
      id: 'PINV-' + Date.now().toString().slice(-6),
      supplierId: supplierId || 'manual',
      supplierName: finalSupplierName,
      paymentMethod,
      totalAmount: finalTotal,
      currency: tenantConfig?.currency || 'SAR',
      date: new Date().toISOString(),
      status,
      items: items,
      discountAmount,
      deliveryAmount,
      taxAmount,
      taxPercent: enableTax ? taxPercent : 0,
      subTotal: itemsTotal
    } as unknown as PurchaseInvoice;

    createPurchaseInvoice(newInvoice);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSupplierId('');
    setSupplierName('');
    setPaymentMethod('نقدي');
    setItems([]);
    setStatus('مفتوحة');
    setEnableDiscount(false);
    setDiscountValue(0);
    setEnableDelivery(false);
    setDeliveryFee(0);
    setEnableTax(false);
    setTaxPercent(15);
  };

  const filteredInvoices = purchaseInvoices.filter((o: PurchaseInvoice) => {
    return o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           o.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Search className="w-6 h-6" />
          </div>
          {t('purchaseInvoices.title', lang)}
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <Plus className="w-4 h-4" /> 
            {lang === 'en' ? 'Add Invoice' : 'فاتورة شراء جديدة'}
          </button>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={\`w-full \${lang === 'en' ? 'text-left' : 'text-right'}\`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400">{t('invoiceId', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('supplierName', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('invoiceDate', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('paymentMethod', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('totalAmount', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400">{t('status', lang)}</th>
                <th className="p-4 text-xs font-bold text-slate-400 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-[#0f172a]/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-white">{invoice.id}</td>
                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          {invoice.supplierName?.charAt(0) || 'S'}
                        </div>
                        {invoice.supplierName || 'مورد غير مسجل'}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300" dir="ltr">{formatDate(invoice.date, lang)}</td>
                    <td className="p-4 text-sm text-slate-300">{invoice.paymentMethod || 'نقدي'}</td>
                    <td className="p-4 text-sm font-bold text-indigo-400">
                      {formatCurrency(invoice.totalAmount, invoice.currency || 'SAR', lang)}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#060b18] border border-blue-900/40 text-slate-300">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedInvoice(invoice)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setItemToDelete(invoice.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {lang === 'en' ? 'No purchase invoices found.' : 'لم يتم العثور على فواتير شراء.'}
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
                <Plus className="w-5 h-5 text-indigo-400" />
                {lang === 'en' ? 'New Purchase Invoice' : 'فاتورة شراء جديدة'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Supplier Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t('supplierName', lang)}</label>
                  <select 
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                  >
                    <option value="">{lang === 'en' ? 'Select Supplier or Walk-in' : 'مورد جديد / نقدي'}</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {!supplierId && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">{lang === 'en' ? 'Supplier Name' : 'اسم المورد'}</label>
                    <input 
                      type="text" 
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                      placeholder={t('supplierName', lang)}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t('paymentMethod', lang)}</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                  >
                    <option value="نقدي">نقدي</option>
                    <option value="آجل">آجل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t('status', lang)}</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white"
                  >
                    <option value="مفتوحة">مفتوحة</option>
                    <option value="مدفوعة">مدفوعة</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-[#060b18] rounded-xl border border-blue-900/40 p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h4 className="font-bold text-white">{t('items', lang)}</h4>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full md:w-64 bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white text-sm"
                    >
                      <option value="">{lang === 'en' ? 'Select Product' : 'اختر منتج'}</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - {p.costPrice || p.price}</option>
                      ))}
                    </select>
                    <input 
                      type="number"
                      placeholder={lang === 'en' ? 'Cost' : 'التكلفة'}
                      value={manualCost}
                      onChange={(e) => setManualCost(e.target.value)}
                      className="w-24 bg-[#0b1329] border border-blue-900/40 rounded-lg p-2 text-white text-sm"
                    />
                    <button onClick={handleAddItem} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap">
                      {lang === 'en' ? 'Add' : 'إضافة'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0b1329] text-slate-400">
                      <tr>
                        <th className="p-2">{t('product', lang)}</th>
                        <th className="p-2 w-24">{t('quantity', lang)}</th>
                        <th className="p-2">{lang === 'en' ? 'Unit Cost' : 'تكلفة الوحدة'}</th>
                        <th className="p-2">{t('total', lang)}</th>
                        <th className="p-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/20 text-white">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2">{item.productName}</td>
                          <td className="p-2">
                            <input 
                              type="number" min="1" 
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(idx, parseInt(e.target.value) || 1)}
                              className="w-full bg-[#0b1329] border border-blue-900/40 rounded p-1 text-center"
                            />
                          </td>
                          <td className="p-2 text-center">{item.unitCost}</td>
                          <td className="p-2 text-center font-bold text-indigo-400">{item.totalCost}</td>
                          <td className="p-2 text-center">
                            <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500">
                            {lang === 'en' ? 'No items added' : 'لم يتم إضافة أصناف'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setEnableDiscount(!enableDiscount)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableDiscount ? 'bg-indigo-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Percent className="w-4 h-4" /> {lang === 'en' ? 'Discount' : 'خصم'}
                </button>
                <button 
                  onClick={() => setEnableDelivery(!enableDelivery)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableDelivery ? 'bg-blue-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Truck className="w-4 h-4" /> {lang === 'en' ? 'Delivery' : 'توصيل'}
                </button>
                <button 
                  onClick={() => setEnableTax(!enableTax)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all \${enableTax ? 'bg-orange-600 text-white' : 'bg-[#060b18] text-slate-400 border border-blue-900/40 hover:bg-[#0f172a]'}\`}
                >
                  <Landmark className="w-4 h-4" /> {lang === 'en' ? 'Tax' : 'ضريبة'}
                </button>
              </div>

              {/* Toggle Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enableDiscount && (
                  <div className="bg-[#060b18] p-4 rounded-xl border border-indigo-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-indigo-400">{lang === 'en' ? 'Discount' : 'قيمة الخصم'}</label>
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
                  <span>{lang === 'en' ? 'Subtotal' : 'إجمالي الأصناف'}:</span>
                  <span>{formatCurrency(itemsTotal, tenantConfig?.currency || 'SAR', lang)}</span>
                </div>
                {enableDiscount && (
                  <div className="flex justify-between text-sm text-indigo-400">
                    <span>{lang === 'en' ? 'Discount' : 'الخصم'} ({discountType === 'percentage' ? \`\${discountValue}%\` : formatCurrency(discountValue, tenantConfig?.currency || 'SAR', lang)}):</span>
                    <span>- {formatCurrency(discountAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                {enableDelivery && (
                  <div className="flex justify-between text-sm text-blue-400">
                    <span>{lang === 'en' ? 'Delivery' : 'مصاريف التوصيل'}:</span>
                    <span>+ {formatCurrency(deliveryAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                {enableTax && (
                  <div className="flex justify-between text-sm text-orange-400">
                    <span>{lang === 'en' ? 'Tax' : 'الضريبة'} ({taxPercent}%):</span>
                    <span>+ {formatCurrency(taxAmount, tenantConfig?.currency || 'SAR', lang)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-blue-900/40 flex justify-between items-center">
                  <span className="font-bold text-white">{lang === 'en' ? 'Net Total' : 'صافي الفاتورة'}:</span>
                  <span className="text-2xl font-black text-indigo-400">{formatCurrency(finalTotal, tenantConfig?.currency || 'SAR', lang)}</span>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] rounded-b-2xl flex gap-3 sticky bottom-0">
              <button 
                onClick={handleSave}
                disabled={items.length === 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0 print:bg-white overflow-y-auto">
          <div className="bg-white text-black w-full max-w-3xl rounded-xl shadow-2xl print:shadow-none print:w-full print:rounded-none relative my-8 print:my-0">
            
            <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
              <button onClick={printInvoice} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Printer className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 print:p-6" id="invoice-print-area" dir={lang === 'en' ? 'ltr' : 'rtl'}>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-800 mb-2">{tenantConfig?.name || 'اسم المتجر'}</h1>
                  <p className="text-sm text-slate-500">{lang === 'en' ? 'Tax No' : 'الرقم الضريبي'}: 1234567890</p>
                  <p className="text-sm text-slate-500">{lang === 'en' ? 'Purchase Invoice' : 'فاتورة شراء'}</p>
                </div>
                <div className="text-end">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedInvoice.id}</h2>
                  <p className="text-sm font-bold text-slate-600">{formatDate(selectedInvoice.date, lang)}</p>
                  <p className="text-sm text-slate-500 mt-1">{lang === 'en' ? 'Payment' : 'طريقة الدفع'}: {selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{lang === 'en' ? 'Supplier' : 'بيانات المورد'}</h3>
                <p className="font-bold text-lg text-slate-800">{selectedInvoice.supplierName}</p>
              </div>

              {/* Items */}
              <table className="w-full mb-8 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-start font-bold text-slate-700">{lang === 'en' ? 'Item' : 'الصنف'}</th>
                    <th className="p-3 text-center font-bold text-slate-700">{lang === 'en' ? 'Qty' : 'الكمية'}</th>
                    <th className="p-3 text-center font-bold text-slate-700">{lang === 'en' ? 'Unit Cost' : 'تكلفة الوحدة'}</th>
                    <th className="p-3 text-end font-bold text-slate-700">{lang === 'en' ? 'Total' : 'الإجمالي'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedInvoice.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 text-slate-800">{item.productName || item.name}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="p-3 text-center text-slate-600">{item.unitCost || item.price}</td>
                      <td className="p-3 text-end font-bold text-slate-800">{item.totalCost || (item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3 text-sm">
                  {selectedInvoice.subTotal !== undefined && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Subtotal' : 'إجمالي الأصناف'}:</span>
                      <span>{formatCurrency(selectedInvoice.subTotal, selectedInvoice.currency || 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedInvoice.discountAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Discount' : 'الخصم'}:</span>
                      <span>- {formatCurrency(selectedInvoice.discountAmount, selectedInvoice.currency || 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedInvoice.deliveryAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Delivery' : 'مصاريف التوصيل'}:</span>
                      <span>+ {formatCurrency(selectedInvoice.deliveryAmount, selectedInvoice.currency || 'SAR', lang)}</span>
                    </div>
                  )}
                  {!!selectedInvoice.taxAmount && (
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'en' ? 'Tax' : 'الضريبة'} ({selectedInvoice.taxPercent}%):</span>
                      <span>+ {formatCurrency(selectedInvoice.taxAmount, selectedInvoice.currency || 'SAR', lang)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800 font-black text-lg text-slate-800">
                    <span>{lang === 'en' ? 'Net Total' : 'صافي الفاتورة'}:</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount || selectedInvoice.totalPrice, selectedInvoice.currency || 'SAR', lang)}</span>
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

      <ConfirmModal
        isOpen={!!itemToDelete}
        title={t('confirmDelete', lang)}
        message={t('confirmDeleteMsg', lang)}
        onConfirm={() => {
          if (itemToDelete) deletePurchaseInvoice(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
`
fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', code);
