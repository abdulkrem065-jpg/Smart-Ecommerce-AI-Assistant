const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

if (!code.includes("import { t }")) {
  code = code.replace("import OrdersTab from \"./Admin/tabs/OrdersTab\";", "import OrdersTab from \"./Admin/tabs/OrdersTab\";\nimport { t } from '../core/translations';");
}

code = code.replace(/فواتير المبيعات/g, "{t('salesInvoices.title', lang)}");
code = code.replace(/فواتير المشتريات/g, "{t('purchaseInvoices.title', lang)}");
code = code.replace(/الخزينة والبنوك/g, "{t('cashAccounts.title', lang)}");

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
