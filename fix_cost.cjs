const fs = require('fs');
let pi = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');
pi = pi.replace(/prod\.costPrice \|\| /g, '');
fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', pi);
