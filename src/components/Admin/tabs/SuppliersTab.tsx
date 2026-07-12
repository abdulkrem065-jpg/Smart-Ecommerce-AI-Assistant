import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Truck, Search, Plus, Trash2, Edit, FileText, X } from 'lucide-react';
import { Supplier } from '../../../core/types';
import { t } from '../../../core/translations';

export default function SuppliersTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  const handleSave = async () => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
      } else {
        await addSupplier(formData);
      }
      setShowAddModal(false);
      setEditingSupplier(null);
      setFormData({ name: '', phone: '', email: '', address: '' });
    } catch (error) {
      console.error(error);
      alert('Error saving supplier');
    }
  };

  const openEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      phone: s.phone,
      email: s.email || '',
      address: s.address || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteMsg', lang))) {
      await deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-indigo-400" />
          {t('suppliers.title', lang)}
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <input
              type="text"
              placeholder={t('search', lang) + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:w-64 bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-indigo-500`}
            />
          </div>
          <button
            onClick={() => {
              setEditingSupplier(null);
              setFormData({ name: '', phone: '', email: '', address: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addSupplier', lang)}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0b1329] rounded-xl shadow-lg border border-blue-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full ${lang === 'en' ? 'text-left' : 'text-right'}`}>
            <thead className="bg-[#060b18] border-b border-blue-900/40">
              <tr>
                <th className="p-4 font-bold text-slate-400">{t('name', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('phone', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('balance', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('totalPurchases', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              {filteredSuppliers.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-medium text-white">{s.name}</td>
                  <td className="p-4 text-sm text-slate-300" dir="ltr">{s.phone}</td>
                  <td className="p-4 text-sm font-bold text-indigo-400">{s.balance}</td>
                  <td className="p-4 text-sm text-blue-400 font-bold">{s.totalPurchases}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setViewSupplier(s)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40" title={t('details', lang)}>
                      <FileText className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/40" title={t('edit', lang)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40" title={t('delete', lang)}>
                      <Trash2 className="w-4 h-4" />
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
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingSupplier ? t('editSupplier', lang) : t('addSupplier', lang)}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('name', lang)}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('phone', lang)}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('email', lang)}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('address', lang)}</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
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

      {viewSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/40 bg-[#060b18]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                {t('accountStatement', lang)} - {viewSupplier.name}
              </h3>
              <button onClick={() => setViewSupplier(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('balance', lang)}</p>
                    <p className="font-bold text-emerald-400">{viewSupplier.balance}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('totalPurchases', lang)}</p>
                    <p className="font-bold text-blue-400">{viewSupplier.totalPurchases}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('phone', lang)}</p>
                    <p className="font-bold text-white" dir="ltr">{viewSupplier.phone}</p>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] flex justify-end gap-2">
              <button onClick={() => setViewSupplier(null)} className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-bold text-sm">
                {t('close', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
