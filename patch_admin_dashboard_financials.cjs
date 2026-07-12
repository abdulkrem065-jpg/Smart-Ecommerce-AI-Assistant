const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Add new imports
const importLine = `import TrialBalanceView from "./Admin/tabs/TrialBalanceView";`;
const newImportLine = `import TrialBalanceView from "./Admin/tabs/TrialBalanceView";
import FinancialStatementsView from "./Admin/tabs/FinancialStatementsView";
import FiscalClosingView from "./Admin/tabs/FiscalClosingView";`;
code = code.replace(importLine, newImportLine);

// Update nav buttons
const oldNavButtons = `{hasFinancePermission && (
            <button
              onClick={() => setActiveTab('trial_balance')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative \${
                activeTab === 'trial_balance' ? 'bg-[#111a2f] text-rose-400 shadow-lg font-black border border-rose-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              ميزان المراجعة الذكي ⚖️
            </button>
          )}`;

const newNavButtons = `{hasFinancePermission && (
            <button
              onClick={() => setActiveTab('trial_balance')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative \${
                activeTab === 'trial_balance' ? 'bg-[#111a2f] text-rose-400 shadow-lg font-black border border-rose-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              ميزان المراجعة الذكي ⚖️
            </button>
          )}
          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('financial_statements')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative \${
                activeTab === 'financial_statements' ? 'bg-[#111a2f] text-emerald-400 shadow-lg font-black border border-emerald-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              القوائم المالية 📊
            </button>
          )}
          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('fiscal_closing')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative \${
                activeTab === 'fiscal_closing' ? 'bg-[#111a2f] text-amber-400 shadow-lg font-black border border-amber-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              إقفال الفترة 🔒
            </button>
          )}`;

code = code.replace(oldNavButtons, newNavButtons);

// Add renders
const oldTabRenders = `{activeTab === 'trial_balance' && hasFinancePermission && (
        <TrialBalanceView />
      )}`;

const newTabRenders = `{activeTab === 'trial_balance' && hasFinancePermission && (
        <TrialBalanceView />
      )}
      {activeTab === 'financial_statements' && hasFinancePermission && (
        <FinancialStatementsView />
      )}
      {activeTab === 'fiscal_closing' && hasFinancePermission && (
        <FiscalClosingView />
      )}`;

code = code.replace(oldTabRenders, newTabRenders);

// Update type
const oldTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance'>(() => {`;
const newTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance' | 'financial_statements' | 'fiscal_closing'>(() => {`;
code = code.replace(oldTabsType, newTabsType);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
