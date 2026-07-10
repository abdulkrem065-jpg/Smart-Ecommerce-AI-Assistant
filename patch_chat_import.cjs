const fs = require('fs');
let code = fs.readFileSync('src/components/AIChatSection.tsx', 'utf8');

if (!code.includes('useAICoPilot')) {
    code = code.replace("import { Message, Product } from '../types';", "import { Message, Product } from '../types';\nimport { useAICoPilot } from '../hooks/useAICoPilot';");
    fs.writeFileSync('src/components/AIChatSection.tsx', code);
}
