const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const oldTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff'>(() => {`;
const newTabsType = `const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting'>(() => {`;
code = code.replace(oldTabsType, newTabsType);

const oldImports = `import CategoriesTab from "./Admin/tabs/CategoriesTab";`;
const newImports = `import CategoriesTab from "./Admin/tabs/CategoriesTab";
import AccountsTab from "./Admin/tabs/AccountsTab";`;
code = code.replace(oldImports, newImports);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
