import React, { useState } from 'react';
import { useStore } from '../../../store';
import { CostCenter } from '../../../core/types';
import { ConfirmModal } from '../../ConfirmModal';
import { EmptyState } from '../../EmptyState';
import { LoadingSpinner } from '../../LoadingSpinner';
import { t } from '../../../core/translations';
import { PieChart, Plus, Edit, Trash2, X } from 'lucide-react';

export const CostCentersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingCenter, setEditingCenter] = useState<CostCenter | null>(null);
  
  const { costCenters, addCostCenter, updateCostCenter, deleteCostCenter, getCentersTree } = useStore();
  const tree = getCentersTree();

  const [formData, setFormData] = useState<Partial<CostCenter>>({
    name: '',
    type: 'قسم',
    budget: 0,
    parentId: ''
  });

  const handleOpenModal = (center?: CostCenter) => {
    if (center) {
      setEditingCenter(center);
      setFormData({
        name: center.name,
        type: center.type,
        budget: center.budget,
        parentId: center.parentId || ''
      });
    } else {
      setEditingCenter(null);
      setFormData({ name: '', type: 'قسم', budget: 0, parentId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingCenter) {
      updateCostCenter(editingCenter.id, {
        name: formData.name,
        type: formData.type as any,
        budget: Number(formData.budget),
        parentId: formData.parentId || undefined
      });
    } else {
      addCostCenter({
        name: formData.name,
        type: formData.type as any,
        budget: Number(formData.budget),
        parentId: formData.parentId || undefined
      });
    }
    setIsModalOpen(false);
  };

  const renderTree = (centers: (CostCenter & { children: CostCenter[] })[], level: number = 0) => {
    return centers.map((center) => {
      const consumptionRate = center.budget > 0 ? (center.actualSpending / center.budget) * 100 : 0;
      let progressBarColor = 'bg-blue-500';
      if (consumptionRate >= 100) progressBarColor = 'bg-red-500';
      else if (consumptionRate >= 80) progressBarColor = 'bg-yellow-500';

      return (
        <div key={center.id} className={`flex flex-col mb-4 ${level > 0 ? 'ml-6 rtl:mr-6' : ''}`}>
          <div className="bg-[#0f172a] p-4 rounded-lg shadow-sm border border-blue-900/40 flex items-center justify-between">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{center.name}</span>
                <span className="text-xs bg-[#1e293b] text-slate-300 px-2 py-1 rounded-full">{center.type}</span>
              </div>
              <div className="mt-2 text-sm text-slate-400 flex gap-4">
                <span>{t('budget')}: {center.budget.toLocaleString()}</span>
                <span>{t('actualSpending')}: {center.actualSpending.toLocaleString()}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${Math.min(consumptionRate, 100)}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 mt-1">{t('consumptionRate')}: {consumptionRate.toFixed(1)}%</span>
            </div>
            
            <div className="flex items-center gap-2 ml-4 rtl:mr-4">
              <button onClick={() => handleOpenModal(center)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={18} />
              </button>
              <button onClick={() => deleteCostCenter(center.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          {center.children && center.children.length > 0 && (
            <div className="mt-4 border-l-2 border-blue-900/40 rtl:border-r-2 rtl:border-l-0 pl-4 rtl:pr-4">
              {renderTree(center.children as any, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <PieChart className="text-blue-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">{t('costCenters.title')}</h2>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>{t('addCostCenter')}</span>
        </button>
      </div>

      <div className="bg-[#1e293b] p-6 rounded-xl border border-blue-900/40">
        {tree.length > 0 ? renderTree(tree) : (
          <div className="text-center text-slate-400 py-10">
            {t('noAccountsAdded')}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-blue-900/40 flex justify-between items-center bg-[#1e293b]">
              <h3 className="font-semibold text-white">
                {editingCenter ? t('edit') : t('addCostCenter')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-900/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('type')}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-blue-900/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="قسم">قسم</option>
                  <option value="فرع">فرع</option>
                  <option value="مشروع">مشروع</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('budget')}</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-blue-900/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">المركز الأب (اختياري)</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-900/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">بدون</option>
                  {costCenters
                    .filter(c => c.id !== editingCenter?.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-blue-900/40 flex justify-end gap-2 bg-[#1e293b]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-300 bg-[#0f172a] border border-blue-900/40 rounded-lg hover:bg-[#1e293b]"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
