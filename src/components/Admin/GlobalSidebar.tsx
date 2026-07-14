import React, { useState } from 'react';
import { Package, Landmark, BarChart3, Settings, Menu, X, FileText, ShoppingCart, Undo2, ArrowDownCircle, Users, Truck, Wallet, Building2, AlignVerticalSpaceAround, UserCircle, Target, Briefcase, FileSignature, Receipt, Database } from 'lucide-react';
import { t } from '../../core/translations';

interface GlobalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: string;
}

export function GlobalSidebar({ activeTab, setActiveTab, lang }: GlobalSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    inventory: true,
    finance: false,
    reports: false,
    settings: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuSections = [
    {
      id: 'inventory',
      title: lang === 'en' ? 'Inventory & Sales' : 'المخزون والمبيعات',
      icon: Package,
      items: [
        { id: 'inventory', label: t('inventory', lang), icon: Package },
        { id: 'sales_invoices', label: t('salesInvoices.title', lang), icon: FileText },
        { id: 'purchase_invoices', label: t('purchaseInvoices.title', lang), icon: ShoppingCart },
        { id: 'sales_returns', label: t('salesReturns.title', lang), icon: Undo2 },
        { id: 'purchase_returns', label: t('purchaseReturns.title', lang) || (lang === 'en' ? 'Purchase Returns' : 'مرتجعات المشتريات'), icon: Undo2 }
      ]
    },
    {
      id: 'finance',
      title: lang === 'en' ? 'Accounting & Finance' : 'الحسابات والمالية',
      icon: Landmark,
      items: [
        { id: 'accounts', label: t('accounts', lang), icon: Database },
        { id: 'accounting', label: t('accounting', lang), icon: FileSignature },
        { id: 'cash_accounts', label: t('cashAccounts.title', lang), icon: Wallet },
        { id: 'fixed_assets', label: t('fixedAssets.title', lang), icon: Building2 },
        { id: 'cost_centers', label: t('costCenters.title', lang), icon: Target }
      ]
    },
    {
      id: 'reports',
      title: lang === 'en' ? 'Reports & Closing' : 'التقارير والقوائم الختامية',
      icon: BarChart3,
      items: [
        { id: 'stats', label: t('dashboard', lang) || (lang === 'en' ? 'Dashboard' : 'لوحة القيادة'), icon: BarChart3 },
        { id: 'trial_balance', label: t('trialBalance', lang), icon: AlignVerticalSpaceAround },
        { id: 'financial_statements', label: t('financialStatements', lang), icon: Receipt },
        { id: 'advanced_reports', label: t('advancedReports', lang), icon: FileText },
        { id: 'fiscal_closing', label: t('fiscalClosing', lang), icon: FileSignature }
      ]
    },
    {
      id: 'settings',
      title: lang === 'en' ? 'Settings & HR' : 'الإعدادات والصلاحيات',
      icon: Settings,
      items: [
        { id: 'roles_permissions', label: t('roles_permissions', lang) || (lang === 'en' ? 'Roles & Permissions' : 'الصلاحيات'), icon: Users },
        { id: 'employees', label: t('employees', lang), icon: Briefcase },
        { id: 'customers', label: t('customers', lang), icon: UserCircle },
        { id: 'suppliers', label: t('suppliers', lang), icon: Truck },
        { id: 'configuration', label: t('settings', lang), icon: Settings }
      ]
    }
  ];

  if (!isOpen) {
    return (
      <div className="bg-[#0b1329] border-l border-blue-900/40 w-16 min-h-screen flex flex-col items-center py-4 transition-all z-20 sticky top-0 h-screen">
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-white mb-6">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1329] border-l border-blue-900/40 w-64 min-h-screen flex flex-col transition-all z-20 sticky top-0 h-screen overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between p-4 border-b border-blue-900/40 sticky top-0 bg-[#0b1329] z-10">
        <h2 className="text-lg font-black text-white">{lang === 'en' ? 'Main Menu' : 'القائمة الرئيسية'}</h2>
        <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-2 space-y-4 flex-1">
        {menuSections.map((section) => (
          <div key={section.id} className="space-y-1">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-2 text-sm font-bold text-slate-300 hover:bg-[#111a2f] hover:text-white rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4 text-blue-400" />
                <span>{section.title}</span>
              </div>
            </button>
            {openSections[section.id] && (
              <div className="pr-6 pl-2 space-y-1 mt-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 p-2 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-slate-400 hover:bg-[#111a2f] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="truncate text-right w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
