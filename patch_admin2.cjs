const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const tabRenderString = "      {activeTab === 'cash_accounts' && hasFinancePermission && (\n        <CashAccountsTab />\n      )}";
const tabRenderAdd = "\n      {activeTab === 'employees' && hasFinancePermission && (\n        <EmployeesTab />\n      )}";
content = content.replace(tabRenderString, tabRenderString + tabRenderAdd);

const navBtnString = "              <Wallet className=\"w-3.5 h-3.5\" /> الخزائن\n            </button>\n          )}";
const navBtnAdd = "\n          {hasFinancePermission && (\n            <button\n              onClick={() => setActiveTab('employees')}\n              className={`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'employees' ? 'bg-[#111a2f] text-indigo-400 shadow-lg font-black border border-indigo-500/10' : 'text-slate-400 hover:text-white'}`}\n            >\n              <Users className=\"w-3.5 h-3.5\" /> الموارد البشرية\n            </button>\n          )}";
content = content.replace(navBtnString, navBtnString + navBtnAdd);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
