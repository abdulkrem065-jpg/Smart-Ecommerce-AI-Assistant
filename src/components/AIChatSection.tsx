import React, { useState, useRef, useEffect } from 'react';
import { Message, Product } from '../types';
import { Send, Bot, Sparkles, User, RefreshCw, Cpu, AlertCircle, Trash2 } from 'lucide-react';

interface AIChatSectionProps {
  products: Product[];
  activeNicheId?: string;
}

export default function AIChatSection({ products, activeNicheId = "game" }: AIChatSectionProps) {
  // Support fully customizable dynamic titles & behaviors from localStorage
  const [editableNiches, setEditableNiches] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem("store_editable_projects");
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });

  useEffect(() => {
    const handleNichesUpdate = () => {
      try {
        const saved = localStorage.getItem("store_editable_projects");
        if (saved) {
          setEditableNiches(JSON.parse(saved));
        }
      } catch (e) {}
    };

    window.addEventListener("niches-matrix-updated", handleNichesUpdate);
    return () => {
      window.removeEventListener("niches-matrix-updated", handleNichesUpdate);
    };
  }, []);

  const activeConf = editableNiches.find(n => n.id === activeNicheId);

  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem("customer_name") || "";
  });
  const [waitingForName, setWaitingForName] = useState<boolean>(() => {
    return !localStorage.getItem("customer_name");
  });

  const getInitialWelcomeMessage = (name: string, niche: string): string => {
    const displayName = name ? `يا *${name}*` : "غالينا العزيز";

    if (activeConf) {
      return `مرحباً بك ${displayName} في ${activeConf.name}! 👑 أنا مستشارك الذكي المخصص لـ [${activeConf.aiBehavior || 'أرقى الاستشارات والخدمات السحابية Interactive'}]. اسألني عن أي تفاصيل أو أي تساؤل علمي أو إداري أو استشاري عام - وسأجيبك فوراً وبكل ودية وسرور تليق بعميل VIP! ✨`;
    }

    switch (niche) {
      case 'pharmacy':
      case 'smart_pharmacy':
        return `مرحباً بك ${displayName} في الصيدلية ومخازن الرعاية الطبية! 💊🧪 أنا مستشارك الطبي والدوائي الذكي. اسألني عن استخدامات ووصفات الفيتامينات والمكملات والأجهزة الطبية المتوفرة، أو أي تساؤل صحي عام - وأنا دائماً في خدمتك بكفاءة ورعاية تامة. 🩺✨`;
      case 'tailor':
      case 'luxury_tailoring':
        return `مرحباً بك ${displayName} في دار الخياطة وتصميم الأزياء الراقية! 🪡🧵 أنا مستشارك الذكي المتخصص في تفصيل الملابس، اقتراح أحدث الموديلات، ونمذجة المقاسات المثالية لك. تفضل بطلب تصميم أو استشارة، وسأقوم بجدولتها لكم فوراً. 👑👕`;
      case 'game':
      case 'hyper_games':
        return `مرحباً بك دكتور ${displayName} في بوابة شحن الألعاب الفورية والاتصالات! 🎮⚡ أنا مستشارك التقني الذكي لشحن جواهر فري فاير، شدات ببجي، بطاقات الهدايا، وباقات الإنترنت. اسألني عن عروض الشحن التلقائي، أسعار البطاقات، أو كيفية تفعيل البوابة وسأجيبك فوراً! 🔫💳`;
      case 'school':
        return `مرحباً بك ${displayName} في المنظومة التعليمية والأكاديمية! 🏫📚 أنا موجهك الدراسي ومعلمك الذكي لمراجعة المواد وصياغة التحديات التفاعلية وبث الدافعية والنشاط. تفضل بطرح مسألتك أو طلب كويز سريع! 🎓✨`;
      default:
        return `مرحباً بك ${displayName} في منصة مستشاري الذكي لمجموعة الذيباني! 🌐✨ كيف يمكنني تقديم المساعدة الفورية أو الاستشارية في كافة الفروع اليوم؟`;
    }
  };

  const getDynamicSuggestions = (niche: string) => {
    if (activeConf) {
      const shortName = activeConf.name.replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/).slice(1, 4).join(' ');
      return [
        { 
          label: `❓ استشارة في ${shortName || 'أرقى الميزات'}`, 
          prompt: `بصفتي عميلاً يزور ${activeConf.name}، كيف يمكنني الاستفادة القصوى من توجيه الذكاء الاصطناعي كـ (${activeConf.aiBehavior}) وتحقيق تجربة VIP مخصصة؟` 
        },
        { 
          label: `📦 استفسار عن تصنيف ${activeConf.categories?.[0]?.name || 'بضائع المتجر'}`, 
          prompt: `مرحباً! ما هي أفضل المواصفات والأسعار ومستويات المخزون للمنتجات والحلول المتاحة بقسم "${activeConf.categories?.[0]?.name || 'عام'}"؟` 
        },
        { 
          label: `✨ توليد تفاعل ذكي مخصص للتخصص`, 
          prompt: `أريد منك توليد فكرة استشارية ذكية أو خطة يومية/أسبوعية تفاعلية تناسب تخصص ${activeConf.name} وبسّط لي المعلومات بمرح وطاقة!` 
        }
      ];
    }

    switch (niche) {
      case 'pharmacy':
      case 'smart_pharmacy':
        return [
          { label: '💊 استشارة بخصوص مكمل غذائي', prompt: 'ما هي أهم فوائد واستخدامات فيتامين C والزنك لتعزيز المناعة؟ ومنتجاته المتوفرة؟' },
          { label: '📑 كيفية قراءة الوصفة الطبية الطارئة', prompt: 'اعطني نصائح واحتياطات لقراءة الروشتات الطبية وفحص الصلاحية وترتيب مواعيد الجرعات بالتوجيه.' },
          { label: '❓ أسئلة صحية عامة وقائية', prompt: 'ما هي أفضل النصائح للمحافظة على الصحة اليومية والوقاية من نزلات البرد وتأثير السهر؟' }
        ];
      case 'tailor':
      case 'luxury_tailoring':
        return [
          { label: '🪡 أحدث موديلات الخياطة والأثواب', prompt: 'ما هي أحدث تصاميم وموديلات الأزياء والأقمشة الرجالية الرسمية الفخمة لهذا الموسم؟' },
          { label: '📐 نصائح للحصول على مقاسات دقيقة', prompt: 'كيف يمكنني قياس طول الثوب وعرض الكتف والكم بدقة في المنزل لنقلها للمشغل?' },
          { label: '❓ سؤال عام في أناقة اللباس', prompt: 'ما هي أفضل أنواع الأقمشة اليابانية الفاخرة للثوب الرسمي الصيفي والشتوي ومواصفاتها؟' }
        ];
      case 'game':
      case 'hyper_games':
        return [
          { label: '🎮 باقات شحن PUBG ومجوهرات فري فاير', prompt: 'تفصيل خدمات الشحن الفوري للألعاب (مثل PUBG/FreeFire) وباقات الاتصالات؟' },
          { label: '📱 استعلام عن رصيد المفاتيح والربط', prompt: 'كيف تعمل ميزة فحص رصيد البوابة وضبط واجهة API التلقائية في المتجر؟' },
          { label: '❓ الدعم الفني للاعبين', prompt: 'إذا واجهت تأخر في وصول الشحنة بالمعرف، ما هي الخطوات المعتمدة للدعم والمطابقة الفورية؟' }
        ];
      case 'school':
        return [
          { label: '📝 خطة لمراجعة مادة الرياضيات', prompt: 'أريد خطة أو طريقة ذكية وبسيطة لمطالعة وحل مسائل التفاضل والتكامل في الهندسة والضرب السريع.' },
          { label: '⚡ واجهني بكويز وتحدّي سريع', prompt: 'أنا مستعد! واجهني باختبار أو تحدي دراسي سريع (من ثلاثة أسئلة خيارات متعددة) واختبر تركيزي.' },
          { label: '❓ نصائح للتخلص من توتر الاختبارات', prompt: 'كيف يمكن للطالب التغلب على قلق الامتحانات وتنظيم النوم وزيادة الاستيعاب الذهني؟' }
        ];
      case 'legal':
      case 'legal_consulting':
        return [
          { label: '💼 خطوات تأسيس شركة تجارية', prompt: 'ما هي الخطوات النظامية والأوراق المطلوبة لتأسيس شركة محدودة المسؤولية رقمياً مع البلدية؟' },
          { label: '📜 صياغة بند سرية المعلومات (NDA)', prompt: 'هل يمكنك كتابة نموذج أو بند قانوني متكامل لحماية سرية المعلومات والتعاقدات مع الموظفين؟' },
          { label: '❓ استشارات مراجعة التراخيص والمحاكم', prompt: 'ما هي أهمية التحكيم التجاري في حل النزاعات بدلاً من اللجوء للمحاكم العامة؟' }
        ];
      case 'consulting':
        return [
          { label: '📊 طرق تقليص التكاليف وزيادة الربح', prompt: 'كيف يمكن لشركة ناشئة تقليل المصاريف الإدارية والتشغيلية المكررة وتحقيق نمو بمبيعات الويب؟' },
          { label: '📈 اقتراح مؤشرات أداء (KPIs) للفريق', prompt: 'ما هي أفضل مؤشرات الأداء الأساسية لقياس إنتاجية فريق المبيعات والمندوبين شهرياً؟' },
          { label: '🎯 كيفية صياغة نموذج العمل التجاري', prompt: 'ساعدني في تخطيط نموذج العمل التجاري (Business Model Canvas) لمشروعي التقني الجديد.' }
        ];
      default: // supermarket, hyper, etc.
        return [
          { label: '🌾 عروض البهارات ومخزون المواد', prompt: 'ما هي البهارات والتموينات والعروض المتاحة حالياً للتوصيل وهل توجد خلطات فخمة مجهزة بالاسم؟' },
          { label: '☕ فوائد قهوة الذيباني وطقوسها', prompt: 'ما هي الفوائد الصحية والمنشطة للقهوة والمعدل اليومي الموصى به؟ وكيف تفيد في زيادة التركيز؟' },
          { label: '❓ استفسار عام في العلوم والثقافة', prompt: 'اعطني معلومة غريبة ومفيدة في العلوم الطبيعية والفلك أو طرائف الثقافة العامة لزيادة معرفتي!' }
        ];
    }
  };

  const getThemeConfig = (niche: string) => {
    switch (niche) {
      case 'pharmacy':
        return {
          title: 'مستشار الرعاية والدواء الذكي 💊',
          subtitle: 'دمج الذكاء الاصطناعي مع الاستشارة الطبية والدوائية ومستلزمات الصيدلية',
          borderClass: 'border-emerald-500/30',
          accentColor: 'text-emerald-400',
          headerBg: 'bg-[#0a2015]',
          headerAccentText: 'text-emerald-400',
          accentSpan: 'bg-emerald-500',
          barGradient: 'from-emerald-400 via-teal-500 to-emerald-400',
          spinnerColor: 'text-emerald-400',
          bounceBall: 'bg-emerald-400',
          bgGradient: 'from-[#081f15] via-[#0b130e] to-[#081f15]',
          buttonBg: 'from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400',
          chatIconBg: 'bg-emerald-950/60 border-emerald-900/40 text-emerald-400',
          userIconBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950',
          userBubble: 'bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950',
          aiBubble: 'bg-[#0f231a] text-slate-100 border border-emerald-950/40',
          suggestionBg: 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-900/40 hover:border-emerald-500/30'
        };
      case 'tailor':
        return {
          title: 'مستشار الخياطة والأقمشة الذكي 🪡',
          subtitle: 'دمج الذكاء الاصطناعي مع تفصيل الأزياء الراقية وتصميم الموديلات والمقاسات',
          borderClass: 'border-purple-500/30',
          accentColor: 'text-purple-400',
          headerBg: 'bg-[#1a0c20]',
          headerAccentText: 'text-purple-400',
          accentSpan: 'bg-purple-500',
          barGradient: 'from-purple-400 via-fuchsia-500 to-purple-400',
          spinnerColor: 'text-purple-400',
          bounceBall: 'bg-purple-400',
          bgGradient: 'from-[#14081c] via-[#0d0910] to-[#14081c]',
          buttonBg: 'from-purple-500 to-fuchsia-500 text-white hover:from-purple-400 hover:to-fuchsia-400',
          chatIconBg: 'bg-purple-950/60 border-purple-900/40 text-purple-400',
          userIconBg: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white',
          userBubble: 'bg-gradient-to-l from-purple-500 to-fuchsia-500 text-white',
          aiBubble: 'bg-[#1b0d23] text-slate-100 border border-purple-950/40',
          suggestionBg: 'bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-900/40 hover:border-purple-500/30'
        };
      case 'game':
      case 'hyper_games':
        return {
          title: 'بوابة شحن الألعاب ومستشار VIP 🎮',
          subtitle: 'شحن فوري بالمعرف، بطاقات رقمية، وباقات الإنترنت والاتصالات التلقائية',
          borderClass: 'border-amber-500/30',
          accentColor: 'text-yellow-400',
          headerBg: 'bg-[#1c120a]',
          headerAccentText: 'text-yellow-400',
          accentSpan: 'bg-amber-500',
          barGradient: 'from-amber-400 via-orange-500 to-yellow-400',
          spinnerColor: 'text-yellow-400',
          bounceBall: 'bg-yellow-400',
          bgGradient: 'from-[#190f05] via-[#0b0a09] to-[#190f05]',
          buttonBg: 'from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400',
          chatIconBg: 'bg-amber-950/60 border-amber-900/40 text-yellow-400',
          userIconBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950',
          userBubble: 'bg-gradient-to-l from-amber-500 to-yellow-500 text-slate-950',
          aiBubble: 'bg-[#130b04] text-slate-100 border border-amber-950/40',
          suggestionBg: 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-900/40 hover:border-amber-500/30'
        };
      case 'school':
        return {
          title: 'المعلم والموجه الدراسي الذكي 🏫',
          subtitle: 'خطط مراجعة، اختبارات MCQ تشجيعية، وتبسيط للمفاهيم الرياضية والعلمية',
          borderClass: 'border-blue-500/30',
          accentColor: 'text-blue-400',
          headerBg: 'bg-[#0f1d2a]',
          headerAccentText: 'text-blue-400',
          accentSpan: 'bg-blue-500',
          barGradient: 'from-blue-400 via-indigo-500 to-blue-400',
          spinnerColor: 'text-blue-400',
          bounceBall: 'bg-blue-400',
          bgGradient: 'from-[#081522] via-[#0b0e13] to-[#081522]',
          buttonBg: 'from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400',
          chatIconBg: 'bg-blue-950/60 border-blue-900/40 text-blue-400',
          userIconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
          userBubble: 'bg-gradient-to-l from-blue-500 to-indigo-500 text-white',
          aiBubble: 'bg-[#0a111a] text-slate-100 border border-blue-950/40',
          suggestionBg: 'bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-900/40 hover:border-blue-500/30'
        };
      case 'legal':
        return {
          title: 'مستشار الأنظمة وصياغة العقود القانوني ⚖️',
          subtitle: 'تأسيس شركات، توثيق عقود الشراكة، وشرح الإجراءات الحكومية والبلدية',
          borderClass: 'border-cyan-500/30',
          accentColor: 'text-cyan-400',
          headerBg: 'bg-[#0f242a]',
          headerAccentText: 'text-cyan-400',
          accentSpan: 'bg-cyan-500',
          barGradient: 'from-cyan-400 via-sky-500 to-cyan-400',
          spinnerColor: 'text-cyan-400',
          bounceBall: 'bg-cyan-400',
          bgGradient: 'from-[#081b22] via-[#0b1013] to-[#081b22]',
          buttonBg: 'from-cyan-500 to-sky-500 text-slate-950 hover:from-cyan-400 hover:to-sky-400',
          chatIconBg: 'bg-cyan-950/60 border-cyan-900/40 text-cyan-400',
          userIconBg: 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950',
          userBubble: 'bg-gradient-to-l from-cyan-500 to-sky-500 text-slate-950',
          aiBubble: 'bg-[#081419] text-slate-100 border border-cyan-950/40',
          suggestionBg: 'bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-900/40 hover:border-cyan-500/30'
        };
      case 'consulting':
        return {
          title: 'الخبير الاستراتيجي ومستشار الأعمال 💼',
          subtitle: 'دراسات جدوى، تقليص تكاليف تشغيلية، أتمتة إدارية، وصياغة مؤشرات أداء',
          borderClass: 'border-slate-500/30',
          accentColor: 'text-slate-300',
          headerBg: 'bg-[#181e29]',
          headerAccentText: 'text-slate-300',
          accentSpan: 'bg-slate-400',
          barGradient: 'from-slate-400 via-slate-500 to-slate-400',
          spinnerColor: 'text-slate-300',
          bounceBall: 'bg-slate-300',
          bgGradient: 'from-[#0d121b] via-[#0a0c10] to-[#0d121b]',
          buttonBg: 'from-slate-600 to-slate-500 text-white hover:from-slate-500 hover:to-slate-400',
          chatIconBg: 'bg-slate-900/60 border-slate-800/40 text-slate-300',
          userIconBg: 'bg-gradient-to-r from-slate-600 to-slate-500 text-white',
          userBubble: 'bg-gradient-to-l from-slate-600 to-slate-500 text-white',
          aiBubble: 'bg-[#0b0e14] text-slate-100 border border-slate-900/40',
          suggestionBg: 'bg-[#0c1018]/50 hover:bg-[#121824]/60 text-slate-300 border border-[#121824]/40 hover:border-slate-500/30'
        };
      default: // general or supermarket/hyper
        return {
          title: 'مساعد الذيباني الذكي VIP 🤖',
          subtitle: 'دمج الذكاء الاصطناعي مع بضائع المتجر والمستودع والموسوعة المعرفية العامة',
          borderClass: 'border-yellow-500/30',
          accentColor: 'text-yellow-400',
          headerBg: 'bg-[#0f172a]',
          headerAccentText: 'text-yellow-400',
          accentSpan: 'bg-yellow-500',
          barGradient: 'from-yellow-400 via-amber-500 to-yellow-400',
          spinnerColor: 'text-yellow-400',
          bounceBall: 'bg-yellow-400',
          bgGradient: 'from-[#0b1329] via-[#0f172a] to-[#0b1329]',
          buttonBg: 'from-yellow-500 to-amber-500 text-blue-950 hover:from-yellow-400 hover:to-amber-400',
          chatIconBg: 'bg-[#0f172a] hover:bg-slate-800 text-slate-400', // for reset button
          userIconBg: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950',
          userBubble: 'bg-gradient-to-l from-yellow-500 to-amber-500 text-blue-950',
          aiBubble: 'bg-[#0b1329]/40 text-blue-50 border border-blue-900/30',
          suggestionBg: 'bg-blue-950/50 hover:bg-blue-900/60 text-blue-250 border border-blue-900/40 hover:border-yellow-500/30'
        };
    }
  };

  const rawTheme = getThemeConfig(activeNicheId);
  const theme = {
    ...rawTheme,
    title: activeConf?.name || rawTheme.title,
    subtitle: activeConf?.subtitle || rawTheme.subtitle
  };
  const suggestionPrompts = getDynamicSuggestions(activeNicheId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Initialize messages once name or activeNicheId is clarified
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: getInitialWelcomeMessage(customerName, activeNicheId),
        timestamp: new Date()
      }
    ]);
  }, [customerName, activeNicheId]);

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

  return (
    <div className={`rounded-3xl border overflow-hidden flex flex-col shadow-2xl relative transition-all duration-300 ${theme.borderClass} ${
      isFocused ? "h-[320px] sm:h-[480px] md:h-[580px]" : "h-[480px] sm:h-[540px] md:h-[580px]"
    }`} style={{ background: `linear-gradient(to bottom, ${activeNicheId === 'pharmacy' ? '#071610, #040907' : activeNicheId === 'tailor' ? '#130518, #07030a' : activeNicheId === 'school' ? '#05111b, #020508' : activeNicheId === 'legal' ? '#05151b, #020608' : activeNicheId === 'consulting' ? '#0f141c, #07090c' : activeNicheId === 'game' || activeNicheId === 'hyper_games' ? '#120b05, #050301' : '#0b1329, #0f172a'})` }} dir="rtl" id="ai-chat-root">
      
      {/* Decorative dynamic accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.barGradient}`} />

      {/* CHAT HEADER */}
      <div className={`${theme.headerBg} p-4 text-white flex items-center justify-between border-b ${theme.borderClass}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${theme.borderClass} bg-white/5`}>
            <Bot className={`w-5 h-5 ${theme.accentColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-sm ${theme.accentColor} tracking-wide`}>{theme.title}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.accentSpan}`}></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {theme.subtitle}
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: `linear-gradient(to bottom, #03071220, #00000040)` }} id="chat-messages-container">
        
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
              id={`message-block-${m.id}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                isUser ? theme.userIconBg : theme.chatIconBg
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1 font-sans text-right">
                <div className={`p-3 rounded-2xl whitespace-pre-wrap text-xs md:text-sm leading-relaxed shadow-sm transition-all ${
                  isUser 
                    ? `${theme.userBubble} rounded-tr-none font-semibold text-right` 
                    : `${theme.aiBubble} rounded-tl-none font-medium text-right`
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
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${theme.chatIconBg}`}>
              <Cpu className={`w-4 h-4 animate-spin ${theme.spinnerColor}`} />
            </div>
            <div className={`${theme.aiBubble} p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme.bounceBall}`} style={{ animationDelay: '0ms' }}></span>
              <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme.bounceBall}`} style={{ animationDelay: '150ms' }}></span>
              <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${theme.bounceBall}`} style={{ animationDelay: '300ms' }}></span>
              <span className="text-[10px] text-slate-400 mr-1.5 font-sans">يقوم المستشار بالتحليل والبحث الذكي...</span>
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
        <div className="px-4 py-2 bg-[#060b14] border-t border-slate-900 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth" id="chat-suggestions">
          {suggestionPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s.prompt)}
              disabled={isSending}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-all cursor-pointer flex items-center gap-1 flex-shrink-0 select-none ${theme.suggestionBg}`}
              id={`suggestion-${idx}`}
            >
              <Sparkles className="w-3 h-3 mt-0.5 text-yellow-500 animate-pulse" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* CHAT INPUT FORM */}
      <div className="p-3 bg-[#0c121e] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#03060a] border border-slate-800 rounded-xl px-3 py-1 focus-within:border-yellow-500/60 transition-all"
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
            className={`p-2 bg-gradient-to-r ${theme.buttonBg} disabled:from-slate-900 disabled:to-slate-950 disabled:text-slate-600 font-black rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center justify-center font-sans font-bold`}
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
