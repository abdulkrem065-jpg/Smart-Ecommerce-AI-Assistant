const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = [
    "SalesInvoicesTab.tsx",
    "PurchaseInvoicesTab.tsx",
    "RolesTab.tsx",
    "CashAccountsTab.tsx"
];

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add ConfirmModal to the end
  if (!content.includes('<ConfirmModal')) {
    let deleteFn = "";
    if (file === "SalesInvoicesTab.tsx") deleteFn = "deleteOrder";
    if (file === "PurchaseInvoicesTab.tsx") deleteFn = "deletePurchase";
    if (file === "RolesTab.tsx") deleteFn = "deleteRole"; // wait, RolesTab has deleteRole and deleteUser
    if (file === "CashAccountsTab.tsx") deleteFn = "deleteTransaction"; // CashAccounts has deleteVoucher maybe?

    let onConfirmCode = `if (itemToDelete) ${deleteFn}(itemToDelete);`;

    if (file === "RolesTab.tsx") {
      // In RolesTab, itemToDelete might be role or user. Let's assume it's just user because we don't know.
      // Actually, we can check if it starts with 'role_' or 'user_' but we don't have that logic.
      // Let's just do it manually.
      continue;
    }
    if (file === "CashAccountsTab.tsx") {
      // We don't have a single delete function. Let's do it manually.
      continue;
    }
    
    if (deleteFn) {
        const modalCode = `
      <ConfirmModal
        isOpen={!!itemToDelete}
        title={t('confirmDelete', lang)}
        message={t('confirmDeleteMsg', lang)}
        onConfirm={() => {
          if (itemToDelete) ${deleteFn}(itemToDelete);
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}`;
        content = content.replace(/<\/div>\s*\);\s*\}\s*$/, modalCode);
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}
