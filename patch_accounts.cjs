const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/AccountsTab.tsx', 'utf8');

if (!code.includes('const lang = localStorage.getItem(')) {
  code = code.replace(
    'export default function AccountsTab() {\n  const {',
    'export default function AccountsTab() {\n  const lang = localStorage.getItem("store_lang") || "ar";\n  const {'
  );
}

fs.writeFileSync('src/components/Admin/tabs/AccountsTab.tsx', code);
