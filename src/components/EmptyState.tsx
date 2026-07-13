import React from 'react';

import { t } from '../core/translations';
import { Inbox, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionButton?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, message, actionButton }: EmptyStateProps) {
  const lang = localStorage.getItem('store_lang') || 'ar';
  
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-blue-900/40 rounded-xl bg-white/5">
      <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center mb-4 border border-blue-900/40 shadow-inner">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title || t('noData', lang)}</h3>
      {message && <p className="text-slate-400 mb-6 max-w-sm mx-auto">{message}</p>}
      {actionButton && (
        <div className="mt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
}
