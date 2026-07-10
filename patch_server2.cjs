const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update chat route
const oldChatRoute = `      const { message, chatHistory, products, niche = "game", projectTitle, projectAiBehavior } = req.body;`;
const newChatRoute = `      const { message, chatHistory, products, tenantConfig, niche = "game", projectTitle, projectAiBehavior } = req.body;`;
code = code.replace(oldChatRoute, newChatRoute);

const oldFormatProducts = `      // Format products summary in memory
      const productsContext = products && products.length > 0 
        ? products.map((p: any) => \`- الاسم: \${p.name}\\n  الوصف: \${p.description || 'متوفر بجودة ممتازة'}\\n  القسم: \${p.category || 'عام'}\\n  السعر بالريال السعودي: \${p.price_sar ?? p.price ?? 0} ر.س\\n  السعر بالريال اليمني: \${p.price_yer ?? (Math.round((p.price_sar ?? p.price ?? 0) * 400))} ر.ي\\n  المخزون المتوفر: \${p.stock ?? 'متوفر في المستودع'} قطع\`).join("\\n")
        : "لا توجد منتجات مضافة في المتجر حالياً.";`;

const newFormatProducts = `      // Format products summary in memory
      let productsContext = products && products.length > 0 
        ? products.map((p: any) => \`- الاسم: \${p.name}\\n  الوصف: \${p.description || 'متوفر بجودة ممتازة'}\\n  القسم: \${p.category || 'عام'}\\n  السعر بالريال السعودي: \${p.price_sar ?? p.price ?? 0} ر.س\\n  السعر بالريال اليمني: \${p.price_yer ?? (Math.round((p.price_sar ?? p.price ?? 0) * (tenantConfig?.exchangeRate || 400)))} ر.ي\\n  المخزون المتوفر: \${p.stock ?? 'متوفر في المستودع'} قطع\`).join("\\n")
        : "لا توجد منتجات مضافة في المتجر حالياً.";
        
      if (tenantConfig) {
        productsContext += \`\\n\\n---\\n**إعدادات المتجر الحالية:**
- اسم المتجر: \${tenantConfig.siteName || 'غير محدد'}
- رقم الواتساب للتواصل: \${tenantConfig.whatsappNumber || 'غير محدد'}
- رسالة الشريط الإخباري: \${tenantConfig.tickerMessage || 'غير محدد'}
- العملة الأساسية: \${tenantConfig.currency || 'SAR'}
- سعر الصرف: \${tenantConfig.exchangeRate || 400}
- التوصيل مفعل: \${tenantConfig.deliveryFeeEnabled ? 'نعم' : 'لا'}
- رسوم التوصيل: \${tenantConfig.deliveryFeeValue || 0}
- الضريبة مفعلة: \${tenantConfig.taxEnabled ? 'نعم' : 'لا'}
- نسبة الضريبة: \${tenantConfig.taxRate || 0}%\`;
      }`;
code = code.replace(oldFormatProducts, newFormatProducts);

fs.writeFileSync('server.ts', code);
