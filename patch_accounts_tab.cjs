const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/tabs/AccountsTab.tsx', 'utf8');

const oldCategories = `  const categories = [
    { id: 'customers' as AccountCategory, label: 'العملاء', icon: Users },
    { id: 'suppliers' as AccountCategory, label: 'الموردين', icon: Truck },
    { id: 'cash_boxes' as AccountCategory, label: 'الصناديق والبنوك', icon: Wallet },
    { id: 'expenses' as AccountCategory, label: 'المصروفات', icon: Receipt },
    { id: 'shareholders' as AccountCategory, label: 'الشركاء', icon: Building },
  ];`;

const newCategories = `  const categories = [
    { id: 'customers' as AccountCategory, label: 'العملاء', icon: Users },
    { id: 'suppliers' as AccountCategory, label: 'الموردين', icon: Truck },
    { id: 'cash_boxes' as AccountCategory, label: 'الصناديق والبنوك', icon: Wallet },
    { id: 'revenues' as AccountCategory, label: 'الإيرادات', icon: Receipt },
    { id: 'cogs' as AccountCategory, label: 'تكلفة المبيعات', icon: Receipt },
    { id: 'expenses' as AccountCategory, label: 'المصروفات', icon: Receipt },
    { id: 'shareholders' as AccountCategory, label: 'الشركاء', icon: Building },
  ];`;

code = code.replace(oldCategories, newCategories);
fs.writeFileSync('src/components/Admin/tabs/AccountsTab.tsx', code);
