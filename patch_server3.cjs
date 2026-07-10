const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldBaseHeader = `      const baseHeader = \`
أنت المساعد الافتراضي الاستشاري فائق الذكاء والمصمم حصرياً لمجموعة الذيباني الذكية وشركائها.`;

const newBaseHeader = `      const baseHeader = \`
أنت المساعد الافتراضي الاستشاري فائق الذكاء والمصمم حصرياً لمجموعة الذيباني الذكية وشركائها.
مهم جداً (أوامر الشراء): عندما يقرر العميل شراء منتجات ويؤكد تفاصيل الطلب (أسماء المنتجات، الكميات، واسمه)، **يجب عليك فوراً استدعاء الدالة createCustomerOrder** لتسجيل الطلب في النظام وتمرير جميع البيانات بدقة. \`;`;

code = code.replace(oldBaseHeader, newBaseHeader);
fs.writeFileSync('server.ts', code);
