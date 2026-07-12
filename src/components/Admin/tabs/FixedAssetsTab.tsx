import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import { Building, Plus, Play, Trash2, Edit, Tag, X } from 'lucide-react';
import { FixedAsset, DepreciationEntry } from '../../../core/types';
import { t } from '../../../core/translations';

export default function FixedAssetsTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { fixedAssets, depreciationEntries, fetchFixedAssets, addFixedAsset, updateFixedAsset, deleteFixedAsset, runMonthlyDepreciation, sellAsset } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'history'>('assets');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'أثاث',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseValue: 0,
    salvageValue: 0,
    usefulLife: 12,
    depreciationMethod: 'قسط ثابت' as 'قسط ثابت' | 'متناقص',
    notes: ''
  });

  const [sellData, setSellData] = useState({
    sellPrice: 0,
    date: new Date().toISOString().split('T')[0],
    cashAccountId: 'cash_main'
  });

  useEffect(() => {
    fetchFixedAssets();
  }, [fetchFixedAssets]);

  const handleSave = async () => {
    try {
      await addFixedAsset(formData);
      setShowAddModal(false);
      setFormData({
        name: '', category: 'أثاث', purchaseDate: new Date().toISOString().split('T')[0],
        purchaseValue: 0, salvageValue: 0, usefulLife: 12, depreciationMethod: 'قسط ثابت', notes: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error saving asset');
    }
  };

  const handleRunDepreciation = async () => {
    const d = window.prompt('Enter date for depreciation (YYYY-MM-DD)', new Date().toISOString().split('T')[0]);
    if (d) {
      try {
        await runMonthlyDepreciation(d);
        alert('Depreciation calculated successfully');
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleSell = async () => {
    if(!selectedAssetId) return;
    try {
      await sellAsset(selectedAssetId, sellData.sellPrice, sellData.cashAccountId, sellData.date);
      setShowSellModal(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteMsg', lang))) {
      try {
        await deleteFixedAsset(id);
      } catch(e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Building className="w-6 h-6 text-purple-400" />
          {t('fixedAssets.title', lang)}
        </h2>
        <div className="flex gap-2">
           <button
             onClick={handleRunDepreciation}
             className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg font-bold hover:bg-emerald-600/40 transition-colors whitespace-nowrap"
           >
             <Play className="w-4 h-4" />
             <span className="hidden sm:inline">{t('runDepreciation', lang)}</span>
           </button>
           <button
             onClick={() => setShowAddModal(true)}
             className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors whitespace-nowrap"
           >
             <Plus className="w-4 h-4" />
             <span className="hidden sm:inline">{t('addAsset', lang)}</span>
           </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-blue-900/40">
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`pb-3 font-bold text-sm transition-colors ${activeSubTab === 'assets' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}
        >
          {t('fixedAssets.title', lang)}
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 font-bold text-sm transition-colors ${activeSubTab === 'history' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}
        >
          {t('depreciationHistory', lang)}
        </button>
      </div>

      {activeSubTab === 'assets' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
              <thead className="bg-[#060b18] border-b border-blue-900/40">
                <tr>
                  <th className="p-4 font-bold text-slate-400">{t('assetName', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('category', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('purchaseValue', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('bookValue', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('accumulatedDepreciation', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('monthlyDepreciation', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('status', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {fixedAssets.map((a: FixedAsset) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-medium text-white">{a.name}</td>
                    <td className="p-4 text-sm text-slate-300">
                      {a.category === 'أثاث' ? t('furniture', lang) :
                       a.category === 'أجهزة' ? t('equipment', lang) :
                       a.category === 'مركبات' ? t('vehicles', lang) : t('realEstate', lang)}
                    </td>
                    <td className="p-4 text-sm font-bold text-white">{a.purchaseValue.toFixed(2)}</td>
                    <td className="p-4 text-sm font-bold text-emerald-400">{a.bookValue.toFixed(2)}</td>
                    <td className="p-4 text-sm text-red-400 font-bold">{a.accumulatedDepreciation.toFixed(2)}</td>
                    <td className="p-4 text-sm text-slate-400">{a.monthlyDepreciation.toFixed(2)}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                         a.status === 'نشط' ? 'bg-emerald-500/20 text-emerald-400' : 
                         a.status === 'مباع' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {a.status === 'نشط' && (
                        <button 
                          onClick={() => { setSelectedAssetId(a.id); setShowSellModal(true); }}
                          className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/40" 
                          title={t('sellAsset', lang)}>
                          <Tag className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40" title={t('delete', lang)}>
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

      {activeSubTab === 'history' && (
        <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
              <thead className="bg-[#060b18] border-b border-blue-900/40">
                <tr>
                  <th className="p-4 font-bold text-slate-400">{t('assetName', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('date', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('monthlyDepreciation', lang)}</th>
                  <th className="p-4 font-bold text-slate-400">{t('accumulatedDepreciation', lang)} (قبل)</th>
                  <th className="p-4 font-bold text-slate-400">{t('accumulatedDepreciation', lang)} (بعد)</th>
                  <th className="p-4 font-bold text-slate-400">{t('bookValue', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {depreciationEntries.map((e: DepreciationEntry) => (
                  <tr key={e.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm font-medium text-white">{e.assetName}</td>
                    <td className="p-4 text-sm text-slate-300">{e.date}</td>
                    <td className="p-4 text-sm font-bold text-emerald-400">{e.amount.toFixed(2)}</td>
                    <td className="p-4 text-sm text-slate-400">{e.accumulatedBefore.toFixed(2)}</td>
                    <td className="p-4 text-sm text-red-400 font-bold">{e.accumulatedAfter.toFixed(2)}</td>
                    <td className="p-4 text-sm text-blue-400 font-bold">{e.bookValueAfter.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {t('addAsset', lang)}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('assetName', lang)}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('category', lang)}</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500 appearance-none"
                  >
                    <option value="أثاث">{t('furniture', lang)}</option>
                    <option value="أجهزة">{t('equipment', lang)}</option>
                    <option value="مركبات">{t('vehicles', lang)}</option>
                    <option value="عقارات">{t('realEstate', lang)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('date', lang)}</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('purchaseValue', lang)}</label>
                  <input
                    type="number"
                    value={formData.purchaseValue}
                    onChange={e => setFormData({ ...formData, purchaseValue: Number(e.target.value) })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('salvageValue', lang)}</label>
                  <input
                    type="number"
                    value={formData.salvageValue}
                    onChange={e => setFormData({ ...formData, salvageValue: Number(e.target.value) })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('usefulLife', lang)}</label>
                  <input
                    type="number"
                    value={formData.usefulLife}
                    onChange={e => setFormData({ ...formData, usefulLife: Number(e.target.value) })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('depreciationMethod', lang)}</label>
                  <select
                    value={formData.depreciationMethod}
                    onChange={e => setFormData({ ...formData, depreciationMethod: e.target.value as any })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-purple-500 appearance-none"
                  >
                    <option value="قسط ثابت">{t('straightLine', lang)}</option>
                    <option value="متناقص">{t('decliningBalance', lang)}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
                >
                  {t('save', lang)}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  {t('cancel', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSellModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {t('sellAsset', lang)}
              </h3>
              <button onClick={() => setShowSellModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">سعر البيع</label>
                  <input
                    type="number"
                    value={sellData.sellPrice}
                    onChange={e => setSellData({ ...sellData, sellPrice: Number(e.target.value) })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-amber-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">{t('date', lang)}</label>
                  <input
                    type="date"
                    value={sellData.date}
                    onChange={e => setSellData({ ...sellData, date: e.target.value })}
                    className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-amber-500"
                  />
               </div>
               <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSell}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  تأكيد البيع
                </button>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  {t('cancel', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
