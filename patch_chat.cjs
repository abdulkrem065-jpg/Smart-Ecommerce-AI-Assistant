const fs = require('fs');
let code = fs.readFileSync('src/components/AIChatSection.tsx', 'utf8');

code = code.replace(/const \[isSending, setIsSending\] = useState\(false\);\n/g, '');
code = code.replace(/setIsSending\(true\);/g, '');
code = code.replace(/setIsSending\(false\);/g, '');

fs.writeFileSync('src/components/AIChatSection.tsx', code);
