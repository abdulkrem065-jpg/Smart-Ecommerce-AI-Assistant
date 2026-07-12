const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf8');

const oldImports = `import { AccountingSlice, createAccountingSlice } from './slices/accountingSlice';`;
const newImports = `import { AccountingSlice, createAccountingSlice } from './slices/accountingSlice';
import { JournalEngineSlice, createJournalEngineSlice } from './slices/journalEngineSlice';
import { FinancialReportSlice, createFinancialReportSlice } from './slices/financialReportSlice';`;

code = code.replace(oldImports, newImports);

const oldStore = `export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice & AccountingSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createTenantSlice(...a),
  ...createOrderSlice(...a),
  ...createInventorySlice(...a),
  ...createAccountingSlice(...a)
}));`;

const newStore = `export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice & AccountingSlice & JournalEngineSlice & FinancialReportSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createTenantSlice(...a),
  ...createOrderSlice(...a),
  ...createInventorySlice(...a),
  ...createAccountingSlice(...a),
  ...createJournalEngineSlice(...a),
  ...createFinancialReportSlice(...a)
}));`;

code = code.replace(oldStore, newStore);
fs.writeFileSync('src/store/index.ts', code);
