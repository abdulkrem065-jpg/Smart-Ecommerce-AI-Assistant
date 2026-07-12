const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
code = code.replace(/\{t\('salesInvoices\.title', lang\)\}/g, "{t('salesInvoices.title')}");
code = code.replace(/\{t\('purchaseInvoices\.title', lang\)\}/g, "{t('purchaseInvoices.title')}");
code = code.replace(/\{t\('cashAccounts\.title', lang\)\}/g, "{t('cashAccounts.title')}");
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
