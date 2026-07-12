const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Add imports
const imports = `import { CostCentersTab } from "./Admin/tabs/CostCentersTab";
import { AdvancedReportsTab } from "./Admin/tabs/AdvancedReportsTab";
import { RolesTab } from "./Admin/tabs/RolesTab";\n`;
content = content.replace('import FixedAssetsTab from "./Admin/tabs/FixedAssetsTab";', 'import FixedAssetsTab from "./Admin/tabs/FixedAssetsTab";\n' + imports);

// 2. Add variables for new permissions
// We can just rely on the existing boolean variables to check permission if we want, or define new ones.
// I'll define them right after `const hasFinancePermission`
const permissionVars = `  const { checkPermission } = useStore();
  const canViewCostCenters = checkPermission('cost_centers', 'canView');
  const canViewReports = checkPermission('reports', 'canView');
  const canViewUsers = checkPermission('users', 'canView');\n`;

content = content.replace('const hasFinancePermission = ', permissionVars + '  const hasFinancePermission = ');

// 3. Add Tab Buttons
const tabButtons = `
          {canViewCostCenters && (
            <button
              onClick={() => setActiveTab('cost_centers')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'cost_centers' ? 'bg-[#111a2f] text-teal-400 shadow-lg font-black border border-teal-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <PieChart className="w-3.5 h-3.5" /> {t('costCenters.title')}
            </button>
          )}
          {canViewReports && (
            <button
              onClick={() => setActiveTab('advanced_reports')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'advanced_reports' ? 'bg-[#111a2f] text-fuchsia-400 shadow-lg font-black border border-fuchsia-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> {t('advancedReports.title')}
            </button>
          )}
          {canViewUsers && (
            <button
              onClick={() => setActiveTab('roles_permissions')}
              className={\`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer \${
                activeTab === 'roles_permissions' ? 'bg-[#111a2f] text-cyan-400 shadow-lg font-black border border-cyan-500/10' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Shield className="w-3.5 h-3.5" /> {t('roles.title')}
            </button>
          )}
`;
// find where fixed_assets button ends
content = content.replace("              <Building className=\"w-3.5 h-3.5\" /> {t('fixedAssets.title')}\n            </button>\n          )}", "              <Building className=\"w-3.5 h-3.5\" /> {t('fixedAssets.title')}\n            </button>\n          )}" + tabButtons);

// 4. Add components rendering
const renderedTabs = `
      {activeTab === 'cost_centers' && canViewCostCenters && (
        <CostCentersTab />
      )}
      {activeTab === 'advanced_reports' && canViewReports && (
        <AdvancedReportsTab />
      )}
      {activeTab === 'roles_permissions' && canViewUsers && (
        <RolesTab />
      )}
`;
content = content.replace("{activeTab === 'fixed_assets' && hasFinancePermission && (\n        <FixedAssetsTab />\n      )}", "{activeTab === 'fixed_assets' && hasFinancePermission && (\n        <FixedAssetsTab />\n      )}" + renderedTabs);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
