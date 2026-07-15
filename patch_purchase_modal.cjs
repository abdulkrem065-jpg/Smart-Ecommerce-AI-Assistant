const fs = require('fs');

let code = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');

const modalCode = `
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#060b18]">
              <h3 className="text-lg font-black text-white">
                {lang === 'en' ? 'Add Purchase Invoice' : 'إضافة فاتورة شراء'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t('supplierName', lang)}</label>
                <input 
                  type="text" 
                  value={formData.supplierName}
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                  className="w-full bg-[#060b18] border border-blue-900/40 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('supplierName', lang)}
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
                  <option value="مفتوحة">مفتوحة</option>
                  <option value="مدفوعة">مدفوعة</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-blue-900/40">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
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
`;

// Insert it right before the closing div and `);` 
code = code.replace(
  `    </div>\n  );\n}`,
  modalCode + `    </div>\n  );\n}`
);

fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', code);
