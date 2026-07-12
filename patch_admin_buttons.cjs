const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const newButtons = `
          {hasOrdersPermission && (
            <button
              onClick={() => setActiveTab('customers')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'customers' ? 'bg-[#111a2f] text-blue-400 shadow-lg font-black border border-blue-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Users className="w-3.5 h-3.5" /> {t('customers.title')}
            </button>
          )}
          {hasOrdersPermission && (
            <button
              onClick={() => setActiveTab('suppliers')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'suppliers' ? 'bg-[#111a2f] text-indigo-400 shadow-lg font-black border border-indigo-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Truck className="w-3.5 h-3.5" /> {t('suppliers.title')}
            </button>
          )}
          {hasOrdersPermission && (
            <button
              onClick={() => setActiveTab('sales_returns')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'sales_returns' ? 'bg-[#111a2f] text-red-400 shadow-lg font-black border border-red-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Undo2 className="w-3.5 h-3.5" /> {t('salesReturns.title')}
            </button>
          )}
          {hasOrdersPermission && (
            <button
              onClick={() => setActiveTab('purchase_returns')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'purchase_returns' ? 'bg-[#111a2f] text-orange-400 shadow-lg font-black border border-orange-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Undo2 className="w-3.5 h-3.5" /> {t('purchaseReturns.title')}
            </button>
          )}
          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('fixed_assets')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'fixed_assets' ? 'bg-[#111a2f] text-purple-400 shadow-lg font-black border border-purple-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Building className="w-3.5 h-3.5" /> {t('fixedAssets.title')}
            </button>
          )}
`;

code = code.replace(/\{hasFinancePermission && \(\s*<button\s*onClick=\{\(\) => setActiveTab\('cash_accounts'\)\}([\s\S]*?)<\/button>\s*\)\}/, 
  "{hasFinancePermission && (\n            <button\n              onClick={() => setActiveTab('cash_accounts')}$1</button>\n          )}\n" + newButtons);

// Add Building to imports if not there
if(!code.includes('Building,')) {
  code = code.replace(/import { Plus, Edit2, /, "import { Plus, Edit2, Building, ");
}

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
