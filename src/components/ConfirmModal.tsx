import React from 'react';
import { X } from 'lucide-react';

import { t } from '../core/translations';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  const lang = localStorage.getItem('store_lang') || 'ar';
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-[#0f172a] border border-blue-900/40 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-blue-900/40 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6">
          <p className="text-slate-300">{message}</p>
        </div>
        <div className="p-4 border-t border-blue-900/40 flex justify-end gap-2 bg-[#0b1329]">
          <button onClick={onCancel} className="px-4 py-2 text-slate-300 hover:text-white border border-blue-900/40 rounded-lg">{t('cancel', lang)}</button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{t('delete', lang)}</button>
        </div>
      </div>
    </div>
  );
}
