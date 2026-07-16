const fs = require('fs');

// PurchaseInvoicesTab
let pi = fs.readFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', 'utf8');
pi = pi.replace(/export function PurchaseInvoicesTab/g, 'export default function PurchaseInvoicesTab');
pi = pi.replace(/deletePurchaseInvoice, /g, '');
pi = pi.replace(/deletePurchaseInvoice\(itemToDelete\);/g, 'console.log("Delete not supported for PI");');
pi = pi.replace(/p\.costPrice \|\| /g, '');
pi = pi.replace(/tenantConfig\?\.name/g, "tenantConfig?.companyName");
fs.writeFileSync('src/components/Admin/tabs/PurchaseInvoicesTab.tsx', pi);

// SalesInvoicesTab
let si = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');
si = si.replace(/export function SalesInvoicesTab/g, 'export default function SalesInvoicesTab');
si = si.replace(/tenantConfig\?\.name/g, "tenantConfig?.companyName");
fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', si);

// PurchaseReturnsTab
let pr = fs.readFileSync('src/components/Admin/tabs/PurchaseReturnsTab.tsx', 'utf8');
pr = pr.replace(/export function PurchaseReturnsTab/g, 'export default function PurchaseReturnsTab');
pr = pr.replace(/tenantConfig\?\.name/g, "tenantConfig?.companyName");
fs.writeFileSync('src/components/Admin/tabs/PurchaseReturnsTab.tsx', pr);

// SalesReturnsTab
let sr = fs.readFileSync('src/components/Admin/tabs/SalesReturnsTab.tsx', 'utf8');
sr = sr.replace(/export function SalesReturnsTab/g, 'export default function SalesReturnsTab');
sr = sr.replace(/deleteSalesReturn, /g, '');
sr = sr.replace(/tenantConfig\?\.name/g, "tenantConfig?.companyName");
fs.writeFileSync('src/components/Admin/tabs/SalesReturnsTab.tsx', sr);

