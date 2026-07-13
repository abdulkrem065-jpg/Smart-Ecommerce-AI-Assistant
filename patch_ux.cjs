const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = fs.readdirSync(tabsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Add imports
  if (!content.includes('ConfirmModal')) {
    content = content.replace("import { t }", "import { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';\nimport { t }");
    // Fallback if import { t } doesn't exist
    if (!content.includes('ConfirmModal')) {
       content = content.replace("import React", "import React\nimport { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';");
    }
    changed = true;
  }

  // 1. Delete Confirmation
  if (content.includes('Trash2') || content.includes('Trash') || content.includes('delete') || content.includes('handleDelete')) {
    if (!content.includes('const [itemToDelete, setItemToDelete] = useState')) {
      // Find the first useState and insert after it
      content = content.replace(/const \[.*?\] = useState.*?;\n/, match => match + "  const [itemToDelete, setItemToDelete] = useState<string | null>(null);\n");
      changed = true;
    }
  }

  // 2. Modals background click
  // Look for fixed inset-0
  const modalRegex = /className="fixed inset-0 ([^"]+)"/g;
  content = content.replace(modalRegex, (match) => {
    // We need to figure out what state controls this modal to close it, which is hard statically.
    // I'll manually handle this or skip auto-closing if too complex, but let's try.
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

