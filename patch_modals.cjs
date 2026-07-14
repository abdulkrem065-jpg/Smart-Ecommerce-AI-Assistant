const fs = require('fs');

let purchaseContent = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');

// Add state for Purchase Modal
purchaseContent = purchaseContent.replace(
  `const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);`,
  `const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { createPurchaseInvoice } = useStore();
  const [formData, setFormData] = useState({ supplierName: '', totalAmount: '', status: 'مفتوحة' as 'مفتوحة' | 'مدفوعة' | 'ملغية' });
  const handleSave = () => {
    if (!formData.supplierName || !formData.totalAmount) return;
    createPurchaseInvoice({
      supplierId: 'manual',
      supplierName: formData.supplierName,
      totalAmount: parseFloat(formData.totalAmount),
      status: formData.status,
      items: [{
        productId: 'manual',
        productName: 'إدخال يدوي',
        quantity: 1,
        unitCost: parseFloat(formData.totalAmount),
        totalCost: parseFloat(formData.totalAmount)
      }]
    });
    setShowAddModal(false);
    setFormData({ supplierName: '', totalAmount: '', status: 'مفتوحة' });
  };`
);

purchaseContent = purchaseContent.replace(
  `onClick={() => {
              alert(lang === 'en' ? 'Opening Purchase entry form...' : 'جاري فتح شاشة إدخال مشتريات جديدة...');
            }}`,
  `onClick={() => setShowAddModal(true)}`
);

const modalContentPurchase = `
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'Add Purchase Invoice' : 'إضافة فاتورة مشتريات'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Supplier Name' : 'اسم المورد'}</label>
                <input type="text" value={formData.supplierName} onChange={e => setFormData({...formData, supplierName: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}</label>
                <input type="number" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Status' : 'الحالة'}</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg">
                  <option value="مفتوحة">{lang === 'en' ? 'Open' : 'مفتوحة'}</option>
                  <option value="مدفوعة">{lang === 'en' ? 'Paid' : 'مدفوعة'}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">{lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">{lang === 'en' ? 'Save' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}
`;

purchaseContent = purchaseContent.replace(
  `        </div>\n  );\n}`,
  `${modalContentPurchase}\n        </div>\n  );\n}`
);

fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', purchaseContent);


let salesContent = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');

salesContent = salesContent.replace(
  `const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);`,
  `const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
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
        selectedOptions: {}
      }]
    } as Order);
    setShowAddModal(false);
    setFormData({ customerName: '', phone: '', totalAmount: '', status: 'تم التسليم 🟢' });
  };`
);

salesContent = salesContent.replace(
  `onClick={() => {
              alert(lang === 'en' ? 'Opening Point of Sale (POS) / Add Invoice form...' : 'جاري فتح شاشة نقطة البيع (POS) / إضافة فاتورة...');
            }}`,
  `onClick={() => setShowAddModal(true)}`
);

const modalContentSales = `
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'Add Sales Invoice' : 'إضافة فاتورة بيع'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Customer Name' : 'اسم العميل'}</label>
                <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Phone' : 'رقم الهاتف'}</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}</label>
                <input type="number" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{lang === 'en' ? 'Status' : 'الحالة'}</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg">
                  <option value="تم التسليم 🟢">{lang === 'en' ? 'Delivered' : 'تم التسليم 🟢'}</option>
                  <option value="قيد المعالجة">{lang === 'en' ? 'Processing' : 'قيد المعالجة'}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">{lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">{lang === 'en' ? 'Save' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}
`;

salesContent = salesContent.replace(
  `        </div>\n  );\n}`,
  `${modalContentSales}\n        </div>\n  );\n}`
);

fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', salesContent);

