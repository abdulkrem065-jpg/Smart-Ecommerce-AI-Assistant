const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldGenerate = `      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "عذراً، لم أستطع توليد إجابة مناسبة حالياً. هل يمكنك إعادة صياغة سؤالك؟";

      return res.json({ text: responseText });`;

const newGenerate = `      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          tools: [
            {
              functionDeclarations: [
                {
                  name: "createCustomerOrder",
                  description: "Creates a new customer order when a customer confirms a purchase.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      customerName: {
                        type: "STRING",
                        description: "Name of the customer"
                      },
                      customerPhone: {
                        type: "STRING",
                        description: "Phone number of the customer"
                      },
                      items: {
                        type: "ARRAY",
                        description: "List of products the customer is purchasing",
                        items: {
                          type: "OBJECT",
                          properties: {
                            id: { type: "STRING" },
                            name: { type: "STRING" },
                            price: { type: "NUMBER" },
                            quantity: { type: "NUMBER" }
                          },
                          required: ["id", "name", "price", "quantity"]
                        }
                      },
                      total: {
                        type: "NUMBER",
                        description: "Total cost of the order"
                      }
                    },
                    required: ["customerName", "items", "total"]
                  }
                }
              ]
            }
          ]
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];
        return res.json({
          functionCall: {
            name: functionCall.name,
            args: functionCall.args
          }
        });
      }

      const responseText = response.text || "عذراً، لم أستطع توليد إجابة مناسبة حالياً. هل يمكنك إعادة صياغة سؤالك؟";

      return res.json({ text: responseText });`;

code = code.replace(oldGenerate, newGenerate);
fs.writeFileSync('server.ts', code);
