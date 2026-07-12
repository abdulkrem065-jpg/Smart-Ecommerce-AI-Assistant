const fs = require('fs');
const path = require('path');

const slicesDir = 'src/store/slices';
const files = fs.readdirSync(slicesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

files.forEach(file => {
  const filePath = path.join(slicesDir, file);
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (code.includes('firebaseSet')) {
    code = code.replace(/\(set as firebaseSet,/g, '(set,');
    fs.writeFileSync(filePath, code);
  }
});
console.log("Done");
