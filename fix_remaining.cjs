const fs = require('fs');

// 1. App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/from '\.\/types'/g, "from './core/types'");
fs.writeFileSync('src/App.tsx', appContent);

// 2. AdvancedReportsTab.tsx
let advContent = fs.readFileSync('src/components/Admin/tabs/AdvancedReportsTab.tsx', 'utf8');
advContent = advContent.replace(/p\.quantity/g, "p.stock");
fs.writeFileSync('src/components/Admin/tabs/AdvancedReportsTab.tsx', advContent);

// 3. SalesInvoicesTab.tsx
let salesContent = fs.readFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', 'utf8');
if (!salesContent.includes('deleteOrder } = useStore()')) {
  salesContent = salesContent.replace(/const \{ orders, updateOrderStatus \} = useStore\(\);/, "const { orders, updateOrderStatus, deleteOrder } = useStore();");
}
fs.writeFileSync('src/components/Admin/tabs/SalesInvoicesTab.tsx', salesContent);

// 4. AdminDashboard.tsx
let dashContent = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
// It has two `PieChart as PieChartIcon`
dashContent = dashContent.replace(/, PieChart as PieChartIcon, /g, ", ");
dashContent = dashContent.replace(/BarChart3, Shield/g, "BarChart3, PieChart as PieChartIcon, Shield"); // wait, let's just insert it safely
dashContent = dashContent.replace(/import \{ BarChart, Bar/g, "import { PieChart as PieChartIcon } from 'lucide-react';\nimport { BarChart, Bar");
fs.writeFileSync('src/components/AdminDashboard.tsx', dashContent);

// 5. AdminLoginGate.tsx
let gateContent = fs.readFileSync('src/components/AdminLoginGate.tsx', 'utf8');
gateContent = gateContent.replace(/from '\.\.\/types'/g, "from '../core/types'");
fs.writeFileSync('src/components/AdminLoginGate.tsx', gateContent);

// 6. PromoCarousel.tsx
let promoContent = fs.readFileSync('src/components/PromoCarousel.tsx', 'utf8');
promoContent = promoContent.replace(/from '\.\.\/types'/g, "from '../core/types'");
fs.writeFileSync('src/components/PromoCarousel.tsx', promoContent);
