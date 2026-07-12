const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Insert imports
const newImports = `
import CustomersTab from "./Admin/tabs/CustomersTab";
import SuppliersTab from "./Admin/tabs/SuppliersTab";
import SalesReturnsTab from "./Admin/tabs/SalesReturnsTab";
import PurchaseReturnsTab from "./Admin/tabs/PurchaseReturnsTab";
import FixedAssetsTab from "./Admin/tabs/FixedAssetsTab";
`;
code = code.replace(/(import { CashAccountsTab } from "\.\/Admin\/tabs\/CashAccountsTab";)/, "$1" + newImports);

// Fix lucide react imports (need Truck, Undo2, Users, Building)
code = code.replace(/import { Plus, Edit2, /, "import { Plus, Edit2, Truck, Undo2, ");

// Insert tabs to render
const renderBlock = `
      {activeTab === 'customers' && <CustomersTab />}
      {activeTab === 'suppliers' && <SuppliersTab />}
      {activeTab === 'sales_returns' && <SalesReturnsTab />}
      {activeTab === 'purchase_returns' && <PurchaseReturnsTab />}
      {activeTab === 'fixed_assets' && <FixedAssetsTab />}
`;
code = code.replace(/\{activeTab === 'settings' && <SettingsTab \/>\}/, "{activeTab === 'settings' && <SettingsTab />}\n" + renderBlock);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
