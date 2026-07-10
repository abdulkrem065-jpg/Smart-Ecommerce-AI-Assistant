const fs = require('fs');
let code = fs.readFileSync('src/components/AIChatSection.tsx', 'utf8');

const oldState = `  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);`;

const newState = `  const { messages, setMessages, sendMessage, isSending, errorMessage, setErrorMessage } = useAICoPilot();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);`;

code = code.replace(oldState, newState);

const oldHandleSendMessage = `  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isSending) return;

    // Create user message
    const userMsg: Message = {
      id: \`user-\${Date.now()}\`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsSending(true);
    setErrorMessage(null);

    // Context check for Name Registration Flow
    if (waitingForName) {
      setTimeout(() => {
        const cleanName = textToSend.replace(/[^\\w\\s\\u0600-\\u06FF]/gi, '').trim();
        localStorage.setItem("customer_name", cleanName);
        setCustomerName(cleanName);
        setWaitingForName(false);
        
        const aiMsg: Message = {
          id: \`ai-name-\${Date.now()}\`,
          sender: 'ai',
          text: \`تشرّفت بك وسعدت بحضورك يا \${cleanName}! 👑 تيجان الخدمة مفتوحة لك الآن. اسألني أي جزء مالي أو علمي أو عن المخزون وسأجيبك بامتياز.\`,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsSending(false);
      }, 600);
      return;
    }

    try {
      // Maintain session history (last 10 turns)
      const chatHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      })).slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory,
          products,
          niche: activeNicheId,
          projectTitle: activeConf?.name,
          projectAiBehavior: activeConf?.aiBehavior
        })
      });

      if (!response.ok) {
        throw new Error('فشل الملقم في معالجة طلبك.');
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: \`ai-\${Date.now()}\`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);
      setErrorMessage('تأخر رد المساعد الذكي. يرجى مراجعة مفتاح API الخاص بك في لوحة الإعدادات أو الإشارة لخطأ الاتصالات.');
    } finally {
      setIsSending(false);
    }
  };`;

const newHandleSendMessage = `  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isSending) return;

    if (!customText) setInputValue('');

    if (waitingForName) {
      const cleanName = textToSend.replace(/[^\\w\\s\\u0600-\\u06FF]/gi, '').trim();
      localStorage.setItem("customer_name", cleanName);
      setCustomerName(cleanName);
      setWaitingForName(false);
      
      const userMsg: Message = { id: \`user-\${Date.now()}\`, sender: 'user', text: textToSend, timestamp: new Date() };
      const aiMsg: Message = {
        id: \`ai-name-\${Date.now()}\`,
        sender: 'ai',
        text: \`تشرّفت بك وسعدت بحضورك يا \${cleanName}! 👑 تيجان الخدمة مفتوحة لك الآن. اسألني أي جزء مالي أو علمي أو عن المخزون وسأجيبك بامتياز.\`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
      return;
    }

    await sendMessage(textToSend, activeNicheId, activeConf);
  };`;

code = code.replace(oldHandleSendMessage, newHandleSendMessage);

fs.writeFileSync('src/components/AIChatSection.tsx', code);
