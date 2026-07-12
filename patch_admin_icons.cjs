const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

if (!code.includes('ShoppingCart')) {
    code = code.replace(/import {([^}]*)} from 'lucide-react';/, "import { $1, ShoppingCart, Building2, FileText } from 'lucide-react';");
} else {
    // maybe it is imported but not all of them
    if(!code.includes('Building2')) {
        code = code.replace(/import {([^}]*)} from 'lucide-react';/, "import { $1, Building2 } from 'lucide-react';");
    }
}
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
