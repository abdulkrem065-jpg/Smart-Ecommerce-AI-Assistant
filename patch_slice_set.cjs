const fs = require('fs');
let code = fs.readFileSync('src/store/slices/fixedAssetSlice.ts', 'utf8');

code = code.replace(/import \{ ref, onValue, push, set, update, remove \} from 'firebase\/database';/, "import { ref, onValue, push, set as firebaseSet, update, remove } from 'firebase/database';");
code = code.replace(/await set\(newAssetRef, newAsset\);/, "await firebaseSet(newAssetRef, newAsset);");

fs.writeFileSync('src/store/slices/fixedAssetSlice.ts', code);
