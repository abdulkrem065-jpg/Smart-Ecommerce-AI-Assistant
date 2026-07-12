const fs = require('fs');
let code = fs.readFileSync('src/store/tenantSlice.ts', 'utf8');

code = code.replace(`payApiToken: string;`, `payApiToken: string;\n  is_period_locked?: boolean;`);
code = code.replace(`payApiToken: '',`, `payApiToken: '',\n  is_period_locked: false,`);

fs.writeFileSync('src/store/tenantSlice.ts', code);
