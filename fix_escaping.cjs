const fs = require('fs');
let code = fs.readFileSync('src/store/slices/accountingSlice.ts', 'utf8');
code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/store/slices/accountingSlice.ts', code);
