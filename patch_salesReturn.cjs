const fs = require('fs');
let code = fs.readFileSync('src/store/slices/salesReturnSlice.ts', 'utf8');

code = code.replace(/\\`/g, '\`').replace(/\\\$/g, '$');
fs.writeFileSync('src/store/slices/salesReturnSlice.ts', code);
