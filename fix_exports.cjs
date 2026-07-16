const fs = require('fs');

let pi = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');
pi = pi.replace(/export default function PurchaseInvoicesTab/g, 'export function PurchaseInvoicesTab');
pi = pi.replace(/p\.costPrice \|\| /g, '');
fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', pi);

let si = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');
si = si.replace(/export default function SalesInvoicesTab/g, 'export function SalesInvoicesTab');
fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', si);

