const fs = require('fs');
let code = fs.readFileSync('src/store/slices/accountingSlice.ts', 'utf8');

const addTx = `  addTransactionToAccount: (accountId, transactionBase) => {`;
const newAddTx = `  addTransactionToAccount: (accountId, transactionBase) => {
    const isLocked = (get() as any).isPeriodLocked;
    if (isLocked) {
      console.warn("Fiscal period is locked. Cannot add transaction.");
      return;
    }`;
code = code.replace(addTx, newAddTx);

fs.writeFileSync('src/store/slices/accountingSlice.ts', code);
