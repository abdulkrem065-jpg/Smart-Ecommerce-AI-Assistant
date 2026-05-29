import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini client to dodge crash when key is loaded dynamically
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat features will fallback to offline/simulated mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Customer Support Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatHistory, products } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback simulated model response when API key is missing
        const lowerMsg = message.toLowerCase();
        let fallbackText = "مرحباً بك! أنا المساعد الذكي للمتجر. (ملاحظة: مفتاح API غير متوفر حالياً، أعمل بوضع المحاكاة). ";
        
        if (products && products.length > 0) {
          const matched = products.find((p: any) => 
            p.name.toLowerCase().includes(lowerMsg) || 
            p.description.toLowerCase().includes(lowerMsg) ||
            p.category.toLowerCase().includes(lowerMsg)
          );
          if (matched) {
            fallbackText += `نعم، لدينا المنتج "${matched.name}" في قسم ${matched.category}. سعره هو ${matched.price} ريال سعودي ومتوفر في المخزون (${matched.stock} قطع). هل تريد مساعدتك في شرائه؟`;
          } else {
            fallbackText += `لقد بحثت في متجرنا عن استفسارك، لدينا منتجات رائعة في أقسام مثل ${Array.from(new Set(products.map((p: any) => p.category))).join(', ')}. كيف يمكنني مساعدتك اليوم؟`;
          }
        } else {
          fallbackText += "متجرنا فارغ حالياً، يرجى إضافة بعض المنتجات من لوحة التحكم لتجربة ميزاتنا الكاملة!";
        }
        return res.json({ text: fallbackText });
      }

      // Compile current product catalog summarized for Gemini context
      const productsContext = products && products.length > 0 
        ? products.map((p: any) => `- الاسم: ${p.name}\n  الوصف: ${p.description || 'متوفر بجودة ممتازة'}\n  القسم: ${p.category || 'عام'}\n  السعر: ${p.price || 0} ريال\n  المخزون المتوفر: ${p.stock ?? 'متوفر في المستودع'} قطع`).join("\n")
        : "لا توجد منتجات مضافة في المتجر حالياً.";

      const systemInstruction = 
        `أنت المساعد المساعد الذكي التفاعلي لـ 'متجر ومستودع الذيباني VIP'. مهمتك الأولى والأهم هي مساعدة العملاء والإجابة على جميع استفساراتهم بذكاء وصبر، بلغة عربية فصحى مبسطة وودية للغاية ومحترمة.

إليك قائمة بجميع المنتجات المتوفرة حالياً في متجرنا لمساعدتك على الإجابة بدقة تامة عن الأسعار والتوفر والمواصفات:
${productsContext}

ملاحظات توجيهية لخدمة العملاء:
1. أنت تمثل متجر الذيباني الفاخر ببهاراته وإلكترونياته وخدماته الرقمية وشحنه الفوري.
2. إذا سأل العميل عن منتج متوفر، شجعه بلطف على إضافته للسلة وإرسال الطلب عبر واتساب.
3. إذا سأل عن منتج غير موجود، اعتذر بلطف وأخبره أنه غير متوفر حالياً، واقترح عليه بديلاً مشابهاً من الأجناس المتوفرة لدينا حالياً.
4. يمكنك الإجابة بذكاء عميق وتفصيل واسع عن أي سؤال آخر يجول بخاطر العميل حول الحياة، العلم، الجغرافيا، الطبخ، التاريخ، البرمجة، أو أي مجال في العالم، وبأحسن طريقة ممكنة وكأنك موسوعة ذكية شاملة.
5. حافظ على نبرة مبهجة وراقية كعلامة VIP، واجعل العميل يشعر بالترحيب دائماً. استخدم تعابير ودودة وتجنب الجمود.`;

      // Structure contents array with previous chat history
      const formattedContents: any[] = [];
      
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const turn of chatHistory) {
          formattedContents.push({
            role: turn.sender === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      }
      
      // Append current user turn
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Call Google GenAI SDK
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "عذراً، لم أستطع توليد إجابة مناسبة حالياً. هل يمكنك إعادة صياغة سؤالك؟";
      return res.json({ text: responseText });

    } catch (error: any) {
      console.error("Error communicating with Gemini SDK:", error);
      return res.status(500).json({ error: "فشل الاتصال بالمساعد الذكي: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
