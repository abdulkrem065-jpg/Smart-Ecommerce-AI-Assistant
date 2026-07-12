const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const navStatsButton = `          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('accounting')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'accounting' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              دليل الحسابات 📓
            </button>
          )}`;

const newNavButtons = navStatsButton + `

          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('trial_balance')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative \${
                activeTab === 'trial_balance' ? 'bg-[#111a2f] text-rose-400 shadow-lg font-black border border-rose-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              ميزان المراجعة الذكي ⚖️
            </button>
          )}`;

code = code.replace(navStatsButton, newNavButtons);


const importLine = `import AccountsTab from "./Admin/tabs/AccountsTab";`;
const newImportLine = `import AccountsTab from "./Admin/tabs/AccountsTab";
import TrialBalanceView from "./Admin/tabs/TrialBalanceView";`;
code = code.replace(importLine, newImportLine);

const accountsTabRender = `{activeTab === 'accounting' && hasFinancePermission && (
        <AccountsTab />
      )}`;

const newTabRenders = accountsTabRender + `
      {activeTab === 'trial_balance' && hasFinancePermission && (
        <TrialBalanceView />
      )}`;

code = code.replace(accountsTabRender, newTabRenders);

const oldTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting'>(() => {`;
const newTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance'>(() => {`;
code = code.replace(oldTabsType, newTabsType);


fs.writeFileSync('src/components/AdminDashboard.tsx', code);
