const fs = require('fs');
let code = fs.readFileSync('src/store/slices/fixedAssetSlice.ts', 'utf8');

code = code.replace(/import \{ collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, where, writeBatch \} from 'firebase\/firebase-firestore';/, "import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';");
code = code.replace(/import \{ StoreState \} from '\.\.\/types';/, "");

fs.writeFileSync('src/store/slices/fixedAssetSlice.ts', code);
