const fs = require('fs');

// CustomersTab
let ct = fs.readFileSync('src/components/Admin/tabs/CustomersTab.tsx', 'utf8');
ct = ct.replace(/c\.currentBalance/g, 'c.balance');
ct = ct.replace(/viewCustomer\.currentBalance/g, 'viewCustomer.balance');
fs.writeFileSync('src/components/Admin/tabs/CustomersTab.tsx', ct);

// SuppliersTab
let st = fs.readFileSync('src/components/Admin/tabs/SuppliersTab.tsx', 'utf8');
st = st.replace(/s\.currentBalance/g, 's.balance');
st = st.replace(/viewSupplier\.currentBalance/g, 'viewSupplier.balance');
fs.writeFileSync('src/components/Admin/tabs/SuppliersTab.tsx', st);

// SalesReturnsTab
let srt = fs.readFileSync('src/components/Admin/tabs/SalesReturnsTab.tsx', 'utf8');
srt = srt.replace(/r\.refundAmount/g, 'r.totalRefund');
srt = srt.replace(/viewReturn\.refundAmount/g, 'viewReturn.totalRefund');
// Fix createSalesReturn call
srt = srt.replace(/createSalesReturn\(\{\s*orderId: formData.orderId,\s*reason: formData.reason,\s*items: formData.items\s*\}\)/, 
  "createSalesReturn({ orderId: formData.orderId, customerName: selectedOrder?.customerName || 'عميل نقدي', totalRefund: formData.items.reduce((s, i) => s + i.totalPrice, 0), reason: formData.reason, items: formData.items })");
fs.writeFileSync('src/components/Admin/tabs/SalesReturnsTab.tsx', srt);

// PurchaseReturnsTab
let prt = fs.readFileSync('src/components/Admin/tabs/PurchaseReturnsTab.tsx', 'utf8');
prt = prt.replace(/r\.refundAmount/g, 'r.totalRefund');
prt = prt.replace(/viewReturn\.refundAmount/g, 'viewReturn.totalRefund');
// Fix createPurchaseReturn call
prt = prt.replace(/createPurchaseReturn\(\{\s*invoiceId: formData.invoiceId,\s*reason: formData.reason,\s*items: formData.items\s*\}\)/, 
  "createPurchaseReturn({ invoiceId: formData.invoiceId, supplierId: selectedInvoice?.supplierId || '', supplierName: selectedInvoice?.supplierName || '', totalRefund: formData.items.reduce((s, i) => s + i.totalCost, 0), reason: formData.reason, items: formData.items })");
fs.writeFileSync('src/components/Admin/tabs/PurchaseReturnsTab.tsx', prt);

