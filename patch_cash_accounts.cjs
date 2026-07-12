const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', 'utf8');

code = code.replace(
  `addCashAccount({
      name: newAccName,
      type: newAccType,
      balance: parseFloat(newAccBalance) || 0,
      currency: 'SAR',
      isActive: true
    });`,
  `addCashAccount({
      name: newAccName,
      type: newAccType,
      currency: 'SAR',
      isActive: true
    }, parseFloat(newAccBalance) || 0);`
);

code = code.replace(
  `{lang === 'en' && c.status === 'مسددة' ? 'Settled' : 
                       lang === 'en' && c.status === 'غير مسددة' ? 'Unsettled' : c.status}`,
  `{lang === 'en' && c.status === 'مسددة' ? 'Settled' : 
                       lang === 'en' && c.status === 'مفتوحة' ? 'Open' : c.status}`
);

fs.writeFileSync('src/components/Admin/tabs/CashAccountsTab.tsx', code);
