import { useState } from 'react';
import { useStore } from '../store';
import { Message, Order } from '../core/types';

export function useAICoPilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const addOrder = useStore(state => state.addOrder);
  const updateProduct = useStore(state => state.updateProduct);
  
  const sendMessage = async (text: string, activeNicheId: string, customConfig?: any) => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      const state = useStore.getState();
      const products = state.products;
      const tenantConfig = state.tenantConfig;

      const userMsg: Message = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);

      const chatHistory = messages.map(m => ({ sender: m.sender, text: m.text })).slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory,
          products,
          tenantConfig,
          niche: activeNicheId,
          projectTitle: customConfig?.name,
          projectAiBehavior: customConfig?.aiBehavior
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();

      if (data.functionCall && data.functionCall.name === 'createCustomerOrder') {
        const args = data.functionCall.args;
        
        // Execute the function
        const newOrder: Order = {
          id: `ORD-AI-${Date.now().toString().slice(-6)}`,
          customerName: args.customerName,
          phone: args.customerPhone || "AI-Assisted",
          date: new Date().toISOString(),
          status: 'قيد المعالجة',
          items: args.items || [], 
          totalPrice: args.total || 0, currency: "YER", address: "AI Assited",
          // subtotalPrice: args.total || 0, currency: "YER", address: "AI Assited",
          
          paymentMethod: 'AI Order'
        };
        
        addOrder(newOrder);
        
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

        const aiMsg: Message = { id: `ai-${Date.now()}`, sender: 'ai', text: data.text || "لقد تم إنشاء طلبك بنجاح عبر المساعد الذكي! شكراً لثقتك بنا.", timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = { id: `ai-${Date.now()}`, sender: 'ai', text: data.text, timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('تأخر رد المساعد الذكي. يرجى المتابعة لاحقاً.');
    } finally {
      setIsSending(false);
    }
  };

  return { messages, setMessages, sendMessage, isSending, errorMessage, setErrorMessage };
}
