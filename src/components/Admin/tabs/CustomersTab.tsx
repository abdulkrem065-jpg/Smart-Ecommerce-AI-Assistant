import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Users, Search, Plus, Trash2, Edit, FileText, X } from 'lucide-react';
import { Customer } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';

export default function CustomersTab() {
  const lang = localStorage.getItem('store_lang') || 'ar';
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: 0
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleSave = async () => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await addCustomer(formData);
      }
      setShowAddModal(false);
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '', address: '', creditLimit: 0 });
    } catch (error) {
      console.error(error);
      alert('Error saving customer');
    }
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      address: c.address || '',
      creditLimit: c.creditLimit || 0
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteMsg', lang))) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          {t('customers.title', lang)}
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`w-4 h-4 absolute ${lang === 'en' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-slate-400`} />
            <input
              type="text"
              placeholder={t('search', lang) + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:w-64 bg-[#060b18] text-white ${lang === 'en' ? 'pl-9 pr-4' : 'pr-9 pl-4'} py-2 border border-blue-900/40 rounded-lg text-sm focus:outline-none focus:border-blue-500`}
            />
          </div>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setFormData({ name: '', phone: '', email: '', address: '', creditLimit: 0 });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addCustomer', lang)}</span>
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
                <th className="p-4 font-bold text-slate-400">{t('creditLimit', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('totalPurchases', lang)}</th>
                <th className="p-4 font-bold text-slate-400">{t('actions', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20">
              
              {(!customers) ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8">
                    <EmptyState title={t('noData', lang)} />
                  </td>
                </tr>
              ) : filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-[#0f172a]/5 transition-colors">
                  <td className="p-4 text-sm font-medium text-white">{c.name}</td>
                  <td className="p-4 text-sm text-slate-300" dir="ltr">{c.phone}</td>
                  <td className="p-4 text-sm font-bold text-emerald-400">{c.balance}</td>
                  <td className="p-4 text-sm text-slate-300">{c.creditLimit}</td>
                  <td className="p-4 text-sm text-blue-400 font-bold">{c.totalPurchases}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setViewCustomer(c)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40" title={t('details', lang)}>
                      <FileText className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(c)} className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/40" title={t('edit', lang)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setItemToDelete(c.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40" title={t('delete', lang)}>
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
                {editingCustomer ? t('editCustomer', lang) : t('addCustomer', lang)}
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
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('phone', lang)}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('email', lang)}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('address', lang)}</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1">{t('creditLimit', lang)}</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  className="w-full bg-[#060b18] text-white border border-blue-900/40 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
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

      {viewCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/40 bg-[#060b18]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                {t('accountStatement', lang)} - {viewCustomer.name}
              </h3>
              <button onClick={() => setViewCustomer(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('balance', lang)}</p>
                    <p className="font-bold text-emerald-400">{viewCustomer.balance}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('totalPurchases', lang)}</p>
                    <p className="font-bold text-blue-400">{viewCustomer.totalPurchases}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('creditLimit', lang)}</p>
                    <p className="font-bold text-white">{viewCustomer.creditLimit}</p>
                  </div>
                  <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40">
                    <p className="text-xs text-slate-400 mb-1">{t('phone', lang)}</p>
                    <p className="font-bold text-white" dir="ltr">{viewCustomer.phone}</p>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-blue-900/40 bg-[#060b18] flex justify-end gap-2">
              <button onClick={() => setViewCustomer(null)} className="px-4 py-2 bg-[#0f172a]/5 text-white rounded-lg hover:bg-[#0f172a]/10 transition-colors font-bold text-sm">
                {t('close', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={t('confirmDelete', lang)}
        message={t('confirmDeleteMsg', lang)}
        onConfirm={() => {
          if (itemToDelete) deleteCustomer(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}