const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/Admin/GlobalSidebar.tsx', 'utf8');

// Add categories and orders to inventory section
sidebarCode = sidebarCode.replace(
  `{ id: 'inventory', label: t('inventory', lang), icon: Package },`,
  `{ id: 'inventory', label: t('inventory', lang), icon: Package },
        { id: 'categories', label: lang === 'en' ? 'Categories' : 'الأقسام', icon: Package },
        { id: 'orders', label: lang === 'en' ? 'Received Orders' : 'الطلبات المستلمة', icon: ShoppingCart },`
);

// Add slides to settings section
sidebarCode = sidebarCode.replace(
  `{ id: 'configuration', label: t('settings', lang), icon: Settings }`,
  `{ id: 'slides', label: lang === 'en' ? 'Slider Ads' : 'إعلانات السلايدر', icon: ImageIcon },
        { id: 'configuration', label: t('settings', lang), icon: Settings }`
);

// Make sure ImageIcon is imported
if (!sidebarCode.includes('ImageIcon')) {
  sidebarCode = sidebarCode.replace(`import { Package, Landmark`, `import { Image as ImageIcon, Package, Landmark`);
}

fs.writeFileSync('src/components/Admin/GlobalSidebar.tsx', sidebarCode);
