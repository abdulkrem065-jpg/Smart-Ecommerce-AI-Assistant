const fs = require('fs');
let code = fs.readFileSync('src/store/slices/accountingSlice.ts', 'utf8');
code = code.replace("setRef(ref(db, \\`niche_\\${activeNicheId}/accounting/accounts/\\${activeCategory}/\\${accountId}\\`), cleanUndefined(targetAccount))", 
"set(ref(db, \\`niche_\\${activeNicheId}/accounting/accounts/\\${activeCategory}/\\${accountId}\\`), cleanUndefined(targetAccount))");
fs.writeFileSync('src/store/slices/accountingSlice.ts', code);
