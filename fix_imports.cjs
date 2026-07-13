const fs = require('fs');
const path = require('path');

const tabsDir = 'src/components/Admin/tabs';
const files = fs.readdirSync(tabsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(tabsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes("import Reactimport { ConfirmModal }")) {
      content = content.replace("import Reactimport { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';,", 
        "import React,");
      
      content = content.replace("import React, {", "import React, {\nimport { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';\n{"); // wait, no that's wrong.

      // Just undo the damage
  }
  
  // A safer way:
  const damagedRegex = /import Reactimport \{ ConfirmModal \} from '\.\.\/\.\.\/ConfirmModal';\nimport \{ EmptyState \} from '\.\.\/\.\.\/EmptyState';\nimport \{ LoadingSpinner \} from '\.\.\/\.\.\/LoadingSpinner';(, { [^\n]*)/;
  if (damagedRegex.test(content)) {
      content = content.replace(damagedRegex, "import React$1\nimport { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';");
      changed = true;
  }

  // Check another pattern:
  const damagedRegex2 = /import React\nimport \{ ConfirmModal \} from '\.\.\/\.\.\/ConfirmModal';\nimport \{ EmptyState \} from '\.\.\/\.\.\/EmptyState';\nimport \{ LoadingSpinner \} from '\.\.\/\.\.\/LoadingSpinner';(, { [^\n]*)/;
  if (damagedRegex2.test(content)) {
      content = content.replace(damagedRegex2, "import React$1\nimport { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';");
      changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}
