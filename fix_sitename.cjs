const fs = require('fs');

const fixFile = (path) => {
    let code = fs.readFileSync(path, 'utf8');
    code = code.replace(/tenantConfig\?\.companyName/g, "tenantConfig?.siteName");
    fs.writeFileSync(path, code);
};

fixFile('src/components/Admin/tabs/SalesInvoicesTab.tsx');
fixFile('src/components/Admin/tabs/PurchaseInvoicesTab.tsx');
fixFile('src/components/Admin/tabs/SalesReturnsTab.tsx');
fixFile('src/components/Admin/tabs/PurchaseReturnsTab.tsx');
