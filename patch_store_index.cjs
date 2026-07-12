const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf8');

if (!code.includes('fixedAssetSlice')) {
  code = "import { FixedAssetSlice, createFixedAssetSlice } from './slices/fixedAssetSlice';\n" + code;
  
  // replace Store type
  code = code.replace(/CashSlice>\(\)\(/, 'CashSlice & FixedAssetSlice>()(');
  // replace Store init
  code = code.replace(/\.\.\.createCashSlice\(\.\.\.a\)/, '...createCashSlice(...a),\n  ...createFixedAssetSlice(...a)');

  fs.writeFileSync('src/store/index.ts', code);
}
