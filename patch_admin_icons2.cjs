const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace("from 'lucide-react';", "ShoppingCart, Building2 } from 'lucide-react';");

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
