const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = [
    "CustomersTab.tsx",
    "SuppliersTab.tsx",
    "SalesInvoicesTab.tsx",
    "PurchaseInvoicesTab.tsx",
    "FixedAssetsTab.tsx",
    "RolesTab.tsx",
    "CashAccountsTab.tsx"
];

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const maps = [
    { name: "filteredCustomers", check: "customers", cols: 7 },
    { name: "filteredSuppliers", check: "suppliers", cols: 7 },
    { name: "filteredInvoices", check: "invoices", cols: 8 },
    { name: "filteredAssets", check: "fixedAssets", cols: 9 },
    { name: "userRoles", check: "userRoles", cols: 5 }, 
    { name: "systemUsers", check: "systemUsers", cols: 7 },
    // CashAccountsTab has multiple lists, let's just do them individually
  ];

  for (const m of maps) {
    if (content.includes(`{${m.name}.map(`)) {
      const regex = new RegExp(`\\{${m.name}\\.map\\(`, 'g');
      content = content.replace(regex, `
              {(!${m.check}) ? (
                <tr>
                  <td colSpan={${m.cols}} className="p-8">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : ${m.name}.length === 0 ? (
                <tr>
                  <td colSpan={${m.cols}} className="p-8">
                    <EmptyState title={t('noData', lang)} />
                  </td>
                </tr>
              ) : ${m.name}.map(`);
      changed = true;
    }
  }

  // Also replace existing `length === 0` empty states in CashAccountsTab
  if (file === "CashAccountsTab.tsx") {
      content = content.replace(/\{(\w+)\.length === 0 && (<tr><td colSpan=\{\d+\} className="p-8 text-center text-slate-500">)\{t\('no\w+', lang\)\}(<\/td><\/tr>)\}/g, 
        (match, arrName, prefix, suffix) => {
          return `{!${arrName} ? (<tr><td colSpan={5} className="p-8"><LoadingSpinner /></td></tr>) : ${arrName}.length === 0 && (<tr><td colSpan={5} className="p-8"><EmptyState title={t('noData', lang)} /></td></tr>)}`;
        });
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}
