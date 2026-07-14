const fs = require('fs');

let cashAcc = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');
cashAcc = cashAcc.replace(`status: 'مفتوحة'`, `// status omitted`);
fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', cashAcc);

let accountsTab = fs.readFileSync('src/components/Admin/tabs/AccountsTab.tsx', 'utf8');
if (!accountsTab.includes('import { formatDate }')) {
  accountsTab = `import { formatDate } from '../../../core/utils';\n` + accountsTab;
  fs.writeFileSync('src/components/Admin/tabs/AccountsTab.tsx', accountsTab);
}

