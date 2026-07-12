const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf8');

const imports = `import { FinancialReportSlice, createFinancialReportSlice } from './slices/financialReportSlice';`;
const newImports = `import { FinancialReportSlice, createFinancialReportSlice } from './slices/financialReportSlice';
import { CustomerSlice, createCustomerSlice } from './slices/customerSlice';
import { SalesReturnSlice, createSalesReturnSlice } from './slices/salesReturnSlice';`;

code = code.replace(imports, newImports);

const storeDef = `export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice & AccountingSlice & JournalEngineSlice & FinancialReportSlice>()((...a) => ({`;
const newStoreDef = `export const useStore = create<AuthSlice & TenantSlice & OrderSlice & InventorySlice & AccountingSlice & JournalEngineSlice & FinancialReportSlice & CustomerSlice & SalesReturnSlice>()((...a) => ({`;

code = code.replace(storeDef, newStoreDef);

const storeInit = `  ...createFinancialReportSlice(...a)
}));`;
const newStoreInit = `  ...createFinancialReportSlice(...a),
  ...createCustomerSlice(...a),
  ...createSalesReturnSlice(...a)
}));`;

code = code.replace(storeInit, newStoreInit);

fs.writeFileSync('src/store/index.ts', code);
