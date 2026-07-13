const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = fs.readdirSync(tabsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Let's replace any map block with a check
  // E.g. {filteredCustomers.map(c => ...)}
  // We want to insert LoadingSpinner and EmptyState
  
  // Actually, standard empty states:
  const maps = [
    { name: "filteredCustomers", check: "customers" },
    { name: "filteredSuppliers", check: "suppliers" },
    { name: "filteredInvoices", check: "invoices" },
    { name: "filteredAssets", check: "fixedAssets" },
    { name: "roles", check: "userRoles" }, // not sure, but RolesTab
  ];

  for (const m of maps) {
    if (content.includes(`{${m.name}.map(`)) {
      const regex = new RegExp(`\\{${m.name}\\.map\\(([^\\)]+)\\)\\s*=>\\s*\\(`, 'g');
      content = content.replace(regex, (match, param) => {
        return `{(!${m.check}) ? (
                <tr>
                  <td colSpan={10} className="p-8">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : ${m.name}.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8">
                    <EmptyState title={t('noData', lang)} />
                  </td>
                </tr>
              ) : ${m.name}.map(${param} => (`
      });
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}
