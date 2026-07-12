const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace("Zap } ShoppingCart, Building2 }", "Zap, ShoppingCart, Building2 }");

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
