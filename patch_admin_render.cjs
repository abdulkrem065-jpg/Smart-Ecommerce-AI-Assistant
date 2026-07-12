const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const navStatsButton = `          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('stats')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'stats' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              البيانات والتقارير 📊
            </button>
          )}`;

const newNavButtons = navStatsButton + `

          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('accounting')}
              className={\`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'accounting' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              دليل الحسابات 📓
            </button>
          )}`;

code = code.replace(navStatsButton, newNavButtons);

const statsTabRender = `{activeTab === 'stats' && hasFinancePermission && (() => {`;
const newTabRenders = `{activeTab === 'accounting' && hasFinancePermission && (
        <AccountsTab />
      )}
      ` + statsTabRender;

code = code.replace(statsTabRender, newTabRenders);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
