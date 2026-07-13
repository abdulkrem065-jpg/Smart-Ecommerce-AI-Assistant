const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = [
    "CustomersTab.tsx",
    "SuppliersTab.tsx",
    "FixedAssetsTab.tsx",
];

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Find the exact delete function
  let deleteFn = "";
  if (file === "CustomersTab.tsx") deleteFn = "deleteCustomer";
  if (file === "SuppliersTab.tsx") deleteFn = "deleteSupplier";
  if (file === "FixedAssetsTab.tsx") deleteFn = "deleteFixedAsset";

  // Append ConfirmModal
  if (!content.includes('<ConfirmModal')) {
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
  
  // Modals click outside logic
  const modalRegex = /className="fixed inset-0[^"]*"(\s*onClick=\{[^}]*\})?/g;
  content = content.replace(modalRegex, (match) => {
    // If it doesn't already have an onClick
    if (!match.includes('onClick')) {
      // Find what state controls it. Usually it's in the immediate child or we can just find standard setViewXXX(false).
      // Since it's too hard to guess the setter, we can just replace `<div className="fixed inset-0..."` with a general closing mechanism, or skip it.
      // The user just wants the Modal to close. Most modals are wrapped in `{showAddModal && ...}`.
      // But we can't reliably guess the state setter.
      // I'll skip automatic background click injection and do it manually.
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}
