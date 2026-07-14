const fs = require('fs');
const path = require('path');

const dir = 'src/components/Admin/tabs/';
const files = fs.readdirSync(dir);

const dateRegex = /new Date\((.*?)\)\.toLocaleDateString\((.*?)\)/g;

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (dateRegex.test(code)) {
    code = code.replace(dateRegex, 'formatDate($1, lang)');
    
    // add import if not there
    if (!code.includes('formatDate')) {
        code = `import { formatDate } from '../../../core/utils';\n` + code;
    } else if (!code.includes('from \'../../../core/utils\'')) {
        code = code.replace(`import { t } from '../../../core/translations';`, `import { t } from '../../../core/translations';\nimport { formatDate } from '../../../core/utils';`);
    }
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, code);
    console.log(`Updated dates in ${file}`);
  }
}
