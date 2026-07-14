const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');

// Add to useStore import
code = code.replace(
  `const { cashAccounts, receiptVouchers, paymentVouchers, custodies, cashTransfers, addCashAccount } = useStore();`,
  `const { cashAccounts, receiptVouchers, paymentVouchers, custodies, cashTransfers, addCashAccount, createReceiptVoucher, createPaymentVoucher, createCustody } = useStore();`
);

// Add modal states
code = code.replace(
  `const [newAccBalance, setNewAccBalance] = useState('');`,
  `const [newAccBalance, setNewAccBalance] = useState('');
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  
  const [rvData, setRvData] = useState({ amount: '', fromParty: '', description: '', cashAccountId: '' });
  const [pvData, setPvData] = useState({ amount: '', toParty: '', description: '', cashAccountId: '' });
  const [custodyData, setCustodyData] = useState({ employeeName: '', amount: '', description: '' });

  const handleSaveReceipt = () => {
    if (!rvData.amount || !rvData.cashAccountId) return;
    const acc = cashAccounts.find((a: any) => a.id === rvData.cashAccountId);
    if (!acc) return;
    if (createReceiptVoucher) {
      createReceiptVoucher({
        amount: parseFloat(rvData.amount),
        fromParty: rvData.fromParty,
        description: rvData.description,
        cashAccountId: rvData.cashAccountId,
        cashAccountName: acc.name,
      });
    }
    setShowReceiptModal(false);
    setRvData({ amount: '', fromParty: '', description: '', cashAccountId: '' });
  };

  const handleSavePayment = () => {
    if (!pvData.amount || !pvData.cashAccountId) return;
    const acc = cashAccounts.find((a: any) => a.id === pvData.cashAccountId);
    if (!acc) return;
    if (createPaymentVoucher) {
      createPaymentVoucher({
        amount: parseFloat(pvData.amount),
        toParty: pvData.toParty,
        description: pvData.description,
        cashAccountId: pvData.cashAccountId,
        cashAccountName: acc.name,
      });
    }
    setShowPaymentModal(false);
    setPvData({ amount: '', toParty: '', description: '', cashAccountId: '' });
  };

  const handleSaveCustody = () => {
    if (!custodyData.amount || !custodyData.employeeName) return;
    if (createCustody) {
      createCustody({
        employeeName: custodyData.employeeName,
        amount: parseFloat(custodyData.amount),
        description: custodyData.description,
        status: 'مفتوحة'
      });
    }
    setShowCustodyModal(false);
    setCustodyData({ employeeName: '', amount: '', description: '' });
  };
`
);

// Add button to receipts header
code = code.replace(
  `{/* Receipts Content */}\n      {activeSubTab === 'receipts' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">`,
  `{/* Receipts Content */}\n      {activeSubTab === 'receipts' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">\n          <div className="p-4 border-b border-blue-900/40 flex justify-end">\n            <button onClick={() => setShowReceiptModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors text-sm">\n              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Receipt' : 'سند قبض جديد'}\n            </button>\n          </div>`
);

// Add button to payments header
code = code.replace(
  `{/* Payments Content */}\n      {activeSubTab === 'payments' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">`,
  `{/* Payments Content */}\n      {activeSubTab === 'payments' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">\n          <div className="p-4 border-b border-blue-900/40 flex justify-end">\n            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm">\n              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Payment' : 'سند صرف جديد'}\n            </button>\n          </div>`
);

// Add button to custodies header
code = code.replace(
  `{/* Custodies Content */}\n      {activeSubTab === 'custodies' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">`,
  `{/* Custodies Content */}\n      {activeSubTab === 'custodies' && (\n        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">\n          <div className="p-4 border-b border-blue-900/40 flex justify-end">\n            <button onClick={() => setShowCustodyModal(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors text-sm">\n              <Plus className="w-4 h-4" /> {lang === 'en' ? 'Add Custody' : 'عهدة جديدة'}\n            </button>\n          </div>`
);


const modalsStr = `
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'New Receipt Voucher' : 'سند قبض جديد'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('amount', lang)}</label>
                <input type="number" value={rvData.amount} onChange={e => setRvData({...rvData, amount: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('fromParty', lang)}</label>
                <input type="text" value={rvData.fromParty} onChange={e => setRvData({...rvData, fromParty: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('description', lang)}</label>
                <input type="text" value={rvData.description} onChange={e => setRvData({...rvData, description: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('depositedTo', lang)}</label>
                <select value={rvData.cashAccountId} onChange={e => setRvData({...rvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg">
                  <option value="">{t('selectAccount', lang) || '---'}</option>
                  {cashAccounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowReceiptModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">{t('cancel', lang) || 'إلغاء'}</button>
              <button onClick={handleSaveReceipt} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">{t('save', lang) || 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'New Payment Voucher' : 'سند صرف جديد'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('amount', lang)}</label>
                <input type="number" value={pvData.amount} onChange={e => setPvData({...pvData, amount: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('paidTo', lang)}</label>
                <input type="text" value={pvData.toParty} onChange={e => setPvData({...pvData, toParty: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('description', lang)}</label>
                <input type="text" value={pvData.description} onChange={e => setPvData({...pvData, description: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('paidFrom', lang)}</label>
                <select value={pvData.cashAccountId} onChange={e => setPvData({...pvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg">
                  <option value="">{t('selectAccount', lang) || '---'}</option>
                  {cashAccounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">{t('cancel', lang) || 'إلغاء'}</button>
              <button onClick={handleSavePayment} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{t('save', lang) || 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}

      {showCustodyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">{lang === 'en' ? 'New Custody' : 'عهدة جديدة'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('employee', lang) || 'الموظف'}</label>
                <input type="text" value={custodyData.employeeName} onChange={e => setCustodyData({...custodyData, employeeName: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('amount', lang)}</label>
                <input type="number" value={custodyData.amount} onChange={e => setCustodyData({...custodyData, amount: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">{t('description', lang)}</label>
                <input type="text" value={custodyData.description} onChange={e => setCustodyData({...custodyData, description: e.target.value})} className="w-full bg-[#060b18] text-white border border-blue-900/40 p-2 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCustodyModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">{t('cancel', lang) || 'إلغاء'}</button>
              <button onClick={handleSaveCustody} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{t('save', lang) || 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `        </div>\n  );\n}`,
  `${modalsStr}\n        </div>\n  );\n}`
);


fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', code);
