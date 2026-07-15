const fs = require('fs');

let code = fs.readFileSync('src/components/Admin/GlobalSidebar.tsx', 'utf8');

code = `import React, { useState } from 'react';
import { Image as ImageIcon, Package, Landmark, BarChart3, Settings, Menu, X, FileText, ShoppingCart, Undo2, ArrowDownCircle, Users, Truck, Wallet, Building2, AlignVerticalSpaceAround, UserCircle, Target, Briefcase, FileSignature, Receipt, Database } from 'lucide-react';
import { t } from '../../core/translations';

interface GlobalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function GlobalSidebar({ activeTab, setActiveTab, lang, isOpen, setIsOpen }: GlobalSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    inventory: true,
    finance: false,
    reports: false,
    settings: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const menuSections = [
    {
      id: 'inventory',
      title: lang === 'en' ? 'Inventory & Sales' : 'المخزون والمبيعات',
      icon: Package,
      items: [
        { id: 'inventory', label: t('inventory', lang), icon: Package },
        { id: 'categories', label: lang === 'en' ? 'Categories' : 'الأقسام', icon: Package },
        { id: 'orders', label: lang === 'en' ? 'Received Orders' : 'الطلبات المستلمة', icon: ShoppingCart },
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
        { id: 'slides', label: lang === 'en' ? 'Slider Ads' : 'إعلانات السلايدر', icon: ImageIcon },
        { id: 'configuration', label: t('settings', lang), icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div 
        className={\`fixed top-0 \${lang === 'en' ? 'left-0' : 'right-0'} h-full w-72 bg-[#0b1329] border-\${lang === 'en' ? 'r' : 'l'} border-blue-900/40 z-50 transform transition-transform duration-300 ease-in-out flex flex-col \${
          isOpen ? 'translate-x-0' : lang === 'en' ? '-translate-x-full' : 'translate-x-full'
        }\`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-900/40 shrink-0">
          <h2 className="text-lg font-black text-white">{lang === 'en' ? 'Main Menu' : 'القائمة الرئيسية'}</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-2.5 text-sm font-bold text-slate-300 hover:bg-[#111a2f] hover:text-white rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                    <section.icon className="w-4 h-4" />
                  </div>
                  <span>{section.title}</span>
                </div>
              </button>
              {openSections[section.id] && (
                <div className={\`\${lang === 'en' ? 'pl-11 pr-2' : 'pr-11 pl-2'} space-y-1 mt-1\`}>
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={\`w-full flex items-center gap-2.5 p-2 text-xs font-bold rounded-lg transition-colors \${
                        activeTab === item.id 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'text-slate-400 hover:bg-[#111a2f] hover:text-white'
                      }\`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="truncate w-full text-start">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
`;

fs.writeFileSync('src/components/Admin/GlobalSidebar.tsx', code);
