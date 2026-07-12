const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const newImports = `
import { EmployeesTab } from "./Admin/tabs/EmployeesTab";
import { NotificationBell } from "./Admin/NotificationBell";
`;

content = content.replace('import { RolesTab } from "./Admin/tabs/RolesTab";', 'import { RolesTab } from "./Admin/tabs/RolesTab";\n' + newImports);

// Add the tab active state type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance' | 'financial_statements' | 'fiscal_closing' | 'sales_invoices' | 'purchase_invoices' | 'cash_accounts'>(",
  "const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance' | 'financial_statements' | 'fiscal_closing' | 'sales_invoices' | 'purchase_invoices' | 'cash_accounts' | 'employees'>("
);

// Add Employees Tab Button
const navButtonTarget = `              المالية الختامية و الدليل\n            </button>\n          )}`;

const hrTabButton = `

          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('employees')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'employees' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              {t('employees.title')}
            </button>
          )}`;

content = content.replace(navButtonTarget, navButtonTarget + hrTabButton);

// Add EmployeesTab render block
const tabRenderTarget = `{activeTab === 'cash_accounts' && (
            <div className="bg-white rounded-3xl p-6 xl:p-8 shadow-2xl border border-blue-900/10 relative overflow-hidden">
              <CashAccountsTab />
            </div>
          )}`;

const hrTabRender = `
          {activeTab === 'employees' && (
            <div className="bg-white rounded-3xl p-6 xl:p-8 shadow-2xl border border-blue-900/10 relative overflow-hidden">
              <EmployeesTab />
            </div>
          )}`;

content = content.replace(tabRenderTarget, tabRenderTarget + hrTabRender);

// Add NotificationBell next to the logout button
const logoutButtonTarget = `          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="mt-3.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>تسجيل خروج المشرف 🚪</span>
            </button>
          )}`;

const notificationBellInject = `
          <div className="flex items-center gap-2 mt-3.5">
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>تسجيل خروج المشرف 🚪</span>
              </button>
            )}
            <NotificationBell />
          </div>`;

content = content.replace(logoutButtonTarget, notificationBellInject);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
