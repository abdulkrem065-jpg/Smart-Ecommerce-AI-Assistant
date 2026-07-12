const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAICoPilot.ts', 'utf8');

const oldImport = `  const addOrder = useStore(state => state.addOrder);`;
const newImport = `  const addOrder = useStore(state => state.addOrder);
  const updateProduct = useStore(state => state.updateProduct);`;
code = code.replace(oldImport, newImport);

const oldFunctionHandling = `        addOrder(newOrder);

        const aiMsg: Message = { id: \`ai-\${Date.now()}\`, sender: 'ai', text: data.text || "لقد تم إنشاء طلبك بنجاح عبر المساعد الذكي! شكراً لثقتك بنا.", timestamp: new Date() };`;

const newFunctionHandling = `        addOrder(newOrder);
        
        // Decrement stock for ordered items
        if (args.items && Array.isArray(args.items)) {
          args.items.forEach((item: any) => {
            const product = state.products.find((p: any) => p.id === item.id || p.name === item.name);
            if (product) {
              const newStock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
              updateProduct(product.id, { stock: newStock });
            }
          });
        }

        const aiMsg: Message = { id: \`ai-\${Date.now()}\`, sender: 'ai', text: data.text || "لقد تم إنشاء طلبك بنجاح عبر المساعد الذكي! شكراً لثقتك بنا.", timestamp: new Date() };`;

code = code.replace(oldFunctionHandling, newFunctionHandling);
fs.writeFileSync('src/hooks/useAICoPilot.ts', code);
