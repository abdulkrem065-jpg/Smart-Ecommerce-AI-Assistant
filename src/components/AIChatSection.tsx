import React, { useState, useRef, useEffect } from 'react';
import { Message, Product } from '../types';
import { Send, Bot, Sparkles, User, RefreshCw, Cpu, AlertCircle, Trash2 } from 'lucide-react';

interface AIChatSectionProps {
  products: Product[];
}

export default function AIChatSection({ products }: AIChatSectionProps) {
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem("customer_name") || "";
  });
  const [waitingForName, setWaitingForName] = useState<boolean>(() => {
    return !localStorage.getItem("customer_name");
  });

  const getInitialWelcomeMessage = (name: string): string => {
    if (name) {
      return `مرحباً بك مجدداً يا *${name}* في متجر الذيباني VIP! 👑 أنا مساعدك الذكي المدار بذكاء الـ Gemini المتقدم. اسألني عن أي شيء - خدمات الشحن السريع للألعاب، التموين، المشروبات، البهارات أو المعارف الكلية العامة - وسأخدمك فوراً. 🤖✨`;
    }
    return `أهلاً بك في متجر ومستودع الذيباني VIP! 🤖 أنا مساعدك الذكي. تفضل قولي وش اسمك الكريم؟`;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Initialize messages once name state is clarified
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: getInitialWelcomeMessage(customerName),
        timestamp: new Date()
      }
    ]);
  }, [customerName]);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isSending) return;

    // Create user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
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
        const cleanName = textToSend.replace(/[^\w\s\u0600-\u06FF]/gi, '').trim();
        localStorage.setItem("customer_name", cleanName);
        setCustomerName(cleanName);
        setWaitingForName(false);
        
        const aiMsg: Message = {
          id: `ai-name-${Date.now()}`,
          sender: 'ai',
          text: `تشرّفت بك وسعدت بحضورك يا ${cleanName}! 👑 تيجان الخدمة مفتوحة لك الآن. اسألني أي جزء مالي أو علمي أو عن المخزون وسأجيبك بامتياز.`,
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
          products
        })
      });

      if (!response.ok) {
        throw new Error('فشل الملقم في معالجة طلبك.');
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
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
  };

  // Standard interactive Al-Dhibani Suggestions
  const suggestionPrompts = [
    { label: 'ما هي عروض الألعاب والإنترنت؟ 🎮', prompt: 'تفصيل خدمات الشحن الفوري للألعاب (مثل PUBG/FreeFire) وباقات الاتصالات؟' },
    { label: 'خلطات بهارات الذيباني الفاخرة 🌾', prompt: 'ماذا يتوفر لديكم في قسم البهارات والمواد الغذائية التموينية؟' },
    { label: 'تواصل مباشر مع الدعم 🤝', prompt: 'كيف يمكنني التواصل مع إدارة متجر الذيباني VIP وموقع المستودع؟' },
    { label: 'سؤال عام: ما هي فوائد القهوة؟ ☕', prompt: 'سؤال عام وثقافي: ما هي الفوائد الصحية والمنشطة للقهوة والمعدل اليومي الموصى به؟' }
  ];

  return (
    <div className={`bg-[#0b1329] rounded-3xl border border-yellow-500/30 overflow-hidden flex flex-col shadow-2xl relative transition-all duration-300 ${
      isFocused ? "h-[320px] sm:h-[480px] md:h-[580px]" : "h-[480px] sm:h-[540px] md:h-[580px]"
    }`} dir="rtl" id="ai-chat-root">
      
      {/* Decorative golden accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

      {/* CHAT HEADER */}
      <div className="bg-[#0f172a] p-4 text-white flex items-center justify-between border-b border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <Bot className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-yellow-400 tracking-wide">مساعد الذيباني الذكي VIP</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              دمج الذكاء الاصطناعي مع بضائع المتجر والمستودع والموسوعة المعرفية العامة
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('هل ترغب في مسح المحادثة وسجل الاسم المسجل حالياً؟')) {
              localStorage.removeItem("customer_name");
              setCustomerName("");
              setWaitingForName(true);
              setErrorMessage(null);
            }
          }}
          className="text-slate-400 hover:text-red-400 p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          title="تغيير الاسم وإعادة ضبط المحادثة"
          id="reset-chat-history"
        >
          <Trash2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* MESSAGES CONSOLE */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#0b1329]" id="chat-messages-container">
        
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
              id={`message-block-${m.id}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                isUser ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-bold' : 'bg-blue-950/60 border border-blue-900/40 text-yellow-400'
              }`}>
                {isUser ? <User className="w-4 h-4 text-blue-950" /> : <Bot className="w-4 h-4 text-yellow-400" />}
              </div>

              <div className="space-y-1 font-sans">
                <div className={`p-3 rounded-2xl whitespace-pre-wrap text-xs md:text-sm leading-relaxed shadow-sm transition-all ${
                  isUser 
                    ? 'bg-gradient-to-l from-yellow-500 to-amber-500 text-blue-950 rounded-tr-none font-semibold' 
                    : 'bg-blue-950/40 text-blue-50 border border-blue-900/30 rounded-tl-none font-medium'
                }`}>
                  {m.text}
                </div>
                <div className={`text-[9px] text-slate-500 px-1 font-mono ${isUser ? 'text-left' : 'text-right'}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* LOADING */}
        {isSending && (
          <div className="flex gap-2.5 max-w-[80%] ml-auto" id="chat-loading-turn">
            <div className="w-8 h-8 rounded-xl bg-blue-950/60 border border-blue-900/40 text-yellow-400 flex items-center justify-center">
              <Cpu className="w-4 h-4 animate-spin text-yellow-400" />
            </div>
            <div className="bg-blue-950/30 p-3 rounded-2xl rounded-tl-none border border-blue-900/40 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="text-[10px] text-slate-400 mr-1.5 font-sans">يقوم مساعد الذيباني بالتحليل والبحث...</span>
            </div>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3.5 rounded-xl flex items-start gap-2 max-w-[90%] mx-auto" id="chat-error-alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
            <div className="text-[11px] space-y-1 text-right font-sans">
              <p className="font-bold text-red-400">حدث خطأ اتصالات</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* QUICK SUGGESTIONS */}
      {!waitingForName && (
        <div className="px-4 py-2 bg-[#0f172a] border-t border-blue-900/40 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none" id="chat-suggestions">
          {suggestionPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.prompt)}
              disabled={isSending}
              className="px-3 py-1.5 bg-blue-950/50 hover:bg-blue-900/60 text-blue-250 text-[10px] font-bold rounded-full border border-blue-900/40 hover:border-yellow-500/30 transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
              id={`suggestion-${idx}`}
            >
              <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* CHAT INPUT FORM */}
      <div className="p-3 bg-[#0f172a] border-t border-blue-900/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#0b1329] border border-blue-900/65 rounded-xl px-3 py-1 focus-within:border-yellow-500/60 transition-all"
          id="chat-input-form"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            placeholder={
              waitingForName 
                ? 'تفضل بكتابة اسمك الكريم غالينا العزيز وبدء المحاكاة...' 
                : isSending 
                  ? 'جاري التحضير...' 
                  : 'اسأل مساعد الذيباني الذكي عن أي شيء...'
            }
            className="flex-1 bg-transparent py-2 outline-none text-base md:text-sm text-white placeholder:text-slate-500 text-right font-sans"
            id="chat-text-input"
            onFocus={(e) => {
              setIsFocused(true);
              setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 250);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
              }, 220);
            }}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 disabled:from-blue-900 disabled:to-blue-950 disabled:text-slate-500 text-blue-950 font-black rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center justify-center font-sans font-bold"
            title="إرسال ومعالجة"
            id="chat-send-btn"
          >
            <Send className="w-3.5 h-3.5 transform rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
}
