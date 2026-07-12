const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAICoPilot.ts', 'utf8');

code = code.replace(/total: args\.total \|\| 0,/g, 'totalPrice: args.total || 0, currency: "YER", address: "AI Assited",');
code = code.replace(/tax: 0,/g, '');

fs.writeFileSync('src/hooks/useAICoPilot.ts', code);
