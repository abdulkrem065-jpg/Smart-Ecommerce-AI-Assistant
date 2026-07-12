const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');

code = code.replace(
  `currency: 'SAR',
      isActive: true
    }, parseFloat(newAccBalance) || 0);`,
  `currency: 'SAR'
    }, parseFloat(newAccBalance) || 0);`
);

fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', code);
