const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');

const rvModal = `
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Receipt Voucher' : 'سند قبض جديد'}</h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={rvData.amount} onChange={e => setRvData({...rvData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{lang === 'en' ? 'Received From' : 'مستلم من'}</label>
                <input type="text" value={rvData.fromParty} onChange={e => setRvData({...rvData, fromParty: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('account', lang)}</label>
                <select value={rvData.cashAccountId} onChange={e => setRvData({...rvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white">
                  <option value="">{lang === 'en' ? 'Select Account' : 'اختر الحساب'}</option>
                  {cashAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('notes', lang)}</label>
                <input type="text" value={rvData.description} onChange={e => setRvData({...rvData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveReceipt} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowReceiptModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

const pvModal = `
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Payment Voucher' : 'سند صرف جديد'}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={pvData.amount} onChange={e => setPvData({...pvData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{lang === 'en' ? 'Paid To' : 'يصرف إلى'}</label>
                <input type="text" value={pvData.toParty} onChange={e => setPvData({...pvData, toParty: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('account', lang)}</label>
                <select value={pvData.cashAccountId} onChange={e => setPvData({...pvData, cashAccountId: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white">
                  <option value="">{lang === 'en' ? 'Select Account' : 'اختر الحساب'}</option>
                  {cashAccounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('notes', lang)}</label>
                <input type="text" value={pvData.description} onChange={e => setPvData({...pvData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSavePayment} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

const custodyModal = `
      {showCustodyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">{lang === 'en' ? 'Add Custody' : 'إضافة عهدة'}</h3>
              <button onClick={() => setShowCustodyModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('amount', lang)}</label>
                <input type="number" value={custodyData.amount} onChange={e => setCustodyData({...custodyData, amount: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('employee', lang)}</label>
                <input type="text" value={custodyData.employeeName} onChange={e => setCustodyData({...custodyData, employeeName: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('purpose', lang)}</label>
                <input type="text" value={custodyData.description} onChange={e => setCustodyData({...custodyData, description: e.target.value})} className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSaveCustody} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold">{t('save', lang)}</button>
                <button onClick={() => setShowCustodyModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold">{t('cancel', lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  `    </div>\n  );\n}`,
  rvModal + pvModal + custodyModal + `    </div>\n  );\n}`
);

fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', code);
