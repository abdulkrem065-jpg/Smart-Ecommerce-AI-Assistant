const fs = require('fs');
const path = require('path');

const dir = 'src/components/Admin/tabs/';
const filesToProcess = ['SalesInvoicesTab.tsx', 'PurchaseInvoicesTab.tsx', 'CashAccountsTab.tsx', 'SalesReturnsTab.tsx', 'PurchaseReturnsTab.tsx'];

for (const file of filesToProcess) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Make sure formatCurrency is imported
  if (!code.includes('formatCurrency')) {
    code = code.replace(/import \{ formatDate \} from '\.\.\/\.\.\/\.\.\/core\/utils';/, "import { formatDate, formatCurrency } from '../../../core/utils';");
    if (!code.includes('formatCurrency')) {
        code = code.replace(`import { t } from '../../../core/translations';`, `import { t } from '../../../core/translations';\nimport { formatCurrency } from '../../../core/utils';`);
    }
  }

  // Common replacements for {amount} {currency}
  const regex1 = /\{([a-zA-Z0-9_]+\.(?:totalPrice|totalAmount|balance|amount|price|totalCost|unitCost|totalRefund))\}\s*\{([a-zA-Z0-9_]+\.currency)\}/g;
  if (regex1.test(code)) {
    code = code.replace(regex1, '{formatCurrency($1, $2, lang)}');
    changed = true;
  }
  
  // Replacements for {amount} without {currency} next to it
  const regex2 = /<td([^>]*)>\{([a-zA-Z0-9_]+\.(?:totalPrice|totalAmount|balance|amount|price|totalCost|unitCost|totalRefund))\}<\/td>/g;
  if (regex2.test(code)) {
    code = code.replace(regex2, '<td$1>{formatCurrency($2, "SAR", lang)}</td>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, code);
    console.log(`Updated currencies in ${file}`);
  }
}
