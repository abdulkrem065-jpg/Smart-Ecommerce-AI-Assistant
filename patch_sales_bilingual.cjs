const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');
code = code.replace("export function SalesInvoicesTab() {", "export function SalesInvoicesTab() {\n  const lang = localStorage.getItem('store_lang') || 'ar';\n");
fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', code);
