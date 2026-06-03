import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Lock, 
  RefreshCw, 
  Coins, 
  Globe, 
  Activity, 
  Terminal, 
  Key, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowLeft, 
  Cpu, 
  Radio, 
  ExternalLink, 
  Sparkles,
  Volume2,
  Languages,
  Zap,
  Plus,
  Trash2,
  Calendar,
  Settings,
  ArrowRight,
  User,
  Phone,
  Sliders,
  Layers,
  Server,
  Wifi,
  CheckSquare,
  Square,
  ChevronDown,
  Save,
  Play,
  Code,
  ToggleLeft,
  ToggleRight,
  Cloud,
  CornerDownLeft,
  Search,
  ShoppingBag,
  Eye,
  MessageSquare,
  CheckCircle2
} from "lucide-react";

interface MasterDeveloperControlProps {
  siteName: string;
  onUpdateSiteName: (name: string) => void;
  adminPassword: string;
  onResetAdminPassword: () => void;
  onUpdateAdminPassword?: (newPass: string) => void;
  gameApiUrl: string;
  gameApiKey: string;
  gameApiProvider: string;
  payApiUrl: string;
  payApiToken: string;
  payApiProvider: string;
  payApiMerchantId: string;
  addToast: (text: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onClose: () => void;
  activeNicheId: string;
  onApplyNicheTemplate: (id: string) => void;
}

// Comprehensive SaaS Translations Dictionary
const translations = {
  ar: {
    title: "منصة المطور المطلق السحابية AL-DHIBANI SaaS Console v3",
    subtitle: "نظام السيطرة المركزي وتوليد المتاجر الفورية وإدارتها سحابياً لآل ذيبان",
    login_title: "لوحة المطور السيبراني المطلق",
    login_desc: "قناة أمان مشفرة ومحمية بالبروتوكولات المطلقة لمنصة الألعاب والخدمات الفاخرة VIP.",
    login_key_label: "مفتاح الأمان الخلفي (Secret Key)",
    login_placeholder: "أدخل الرمز السري من نيتليفاي للتخطي المباشر...",
    login_btn: "تأكيد الإذن وفك التشفير",
    session_timer: "عداد الأمان وجلسة الساموراي المضيء",
    session_extend: "تجديد الجلسة",
    one_click_backup: "نسخ احتياطي سحابي",
    global_hot_fix: "تحديث إجباري شامل",
    projects_tab: "السلسلة ومراقبة الفروع والمشاريع 📊",
    wizard_tab: "معالج التوليد السحابي الفوري ⚡",
    currency_tab: "محرك العملات وأسعار الصرف 💱",
    current_operating_rate: "سعر الصرف النشط",
    active_subscribers: "المشتركون والفروع الحية",
    no_subscribers: "لا يوجد فروع مسجلة لهذا المشروع",
    sub_name: "اسم المشترك / الفرع",
    sub_phone: "الرقم المعتمد",
    sub_role: "الصلاحية",
    sub_features: "الميزات النشطة",
    sub_expiry: "تاريخ انتهاء الترخيص",
    sub_control: "التحكم الليزري المستقل",
    sub_active: "نشط وحي",
    sub_blocked: "محجوب مؤقتاً",
    sub_action_suspend: "🚫 إيقاف الخدمة فوراً",
    sub_action_activate: "⚡ تفعيل الخدمة الآن",
    expiry_locked: "اشتراك منتهي - تم القفل تلقائياً ⚠️",
    test_connection: "فحص الاتصال اللاسلكي والـ API",
    server_logs: "مراقبة الأداء ومفاتيح الـ API المعتمدة",
    add_new_currency: "إضافة عملة سستم جديدة",
    currency_rate_placeholder: "سعر الصرف لـ 1 ريال يمني",
    profit_margin: "ربح العميل المئوي (%)",
    exchange_rate: "سعر الصرف المعتمد داخل السستم",
    wizard_step_1: "الخطوة ١: البيانات الأساسية للعميل والعملة",
    wizard_step_2: "الخطوة ٢: ميزات الفرع والربط الذكي والـ API",
    wizard_step_3: "الخطوة ٣: محطة الإطلاق والرفع السحابي المعزول",
    client_name: "الاسم الكامل للعميل أو الفرع الجديد *",
    client_phone: "رقم جوال العميل المعتمد (واتساب الشحن) *",
    role_selector: "الصفة والصلاحية القانونية بالنظام",
    select_default_lang: "لغة الواجهة الافتراضية للمتجر المولد",
    custom_domain: "ربط نطاق خاص واختياري (Custom Domain Mapping)",
    enable_gaming: "🎮 بوابة شحن ألعاب وثيمات الجيمنج المباشر",
    enable_api: "🔌 بوابات الأكواد وتأمين مخدم الـ API",
    enable_branches: "🏬 منظومة تعدد الفروع ومزامنة جرد المستودعات",
    enable_grocery: "🛒 سلة التموين، البقالة، والأوزان الغذائية لآل ذيبان",
    enable_prescription: "⚕️ منظومة الروشتات، الوصفات الطبية الذكية والأدوية الحية",
    enable_consulting: "🎫 منصة حجز ومبيعات تذاكر الاستشارات القانونية والرقمية",
    smart_markup_title: "محرك التسعير التلقائي وذكاء هامش الربح",
    test_api_btn: "فحص بوابات الـ API الآن",
    generate_btn: "🚀 بناء وتوليد المتجر والموقع الفوري (AI Webhook)",
    terminal_logs_title: "شاشة الإقلاع العميقة (Glowing Terminal Console)",
    go_to_storefront: "👁️ استعراض الواجهة أمام العميل (Preview Store)",
    custom_brand_typography: "محرك توليد الشعار النصي الفاخر (Dynamic Typography Logo)"
  },
  en: {
    title: "AL-DHIBANI Ultimate Developer SaaS Console v3",
    subtitle: "Central Control, Instant Multi-Tenant Generation & Cloud Management",
    login_title: "Absolute Cyber Developer Lock",
    login_desc: "Lush encrypted channel protected by system-level armor and protocols for VIP operations.",
    login_key_label: "Master Developer Security Key",
    login_placeholder: "Enter secret pass from Netlify environment...",
    login_btn: "Verify Identity & Unlock Console",
    session_timer: "Neon Safety Token Timer",
    session_extend: "Extend Session",
    one_click_backup: "One-Click Encrypted Cloud Backup",
    global_hot_fix: "Global Hot-Fix Update",
    projects_tab: "Control Matrix & Project Monitor 📊",
    wizard_tab: "Step-by-Step AI Generator Pipeline ⚡",
    currency_tab: "Currencies & Exchange Normalization 💱",
    current_operating_rate: "Active Exchange Rate Settings",
    active_subscribers: "Active Tenants & Managed Branches",
    no_subscribers: "No branches registered yet",
    sub_name: "Tenant / Branch Name",
    sub_phone: "Approved WhatsApp",
    sub_role: "Role & Privileges",
    sub_features: "Active Features",
    sub_expiry: "License Expiry Date",
    sub_control: "Independent Laser Controls",
    sub_active: "Active & Live",
    sub_blocked: "Blocked Temporarily",
    sub_action_suspend: "🚫 Suspend Service",
    sub_action_activate: "⚡ Activate Tenant",
    expiry_locked: "License Expired - Automatic Lockout ⚠️",
    test_connection: "Validate Wireless Connection & API",
    server_logs: "Security Console Logs & API Monitors",
    add_new_currency: "Add Dynamic System Currency",
    currency_rate_placeholder: "Exchange rate for 1 YER",
    profit_margin: "Client Profit Margin (%)",
    exchange_rate: "Active System Exchange Rate Ratio",
    wizard_step_1: "Step 1: Tenant Core Metadata",
    wizard_step_2: "Step 2: Service Matrix & API Integrations",
    wizard_step_3: "Step 3: Edge Launchpad & Cloud Pipeline",
    client_name: "Client Full Name / Branch Identifier *",
    client_phone: "Approved WhatsApp Phone Number *",
    role_selector: "Assigned Privilege Level & Authority",
    select_default_lang: "Default Display Language for Spawned Site",
    custom_domain: "Custom Domain Address Configuration (Optional)",
    enable_gaming: "🎮 Gaming In-App Top-Up Channels & Diamonds",
    enable_api: "🔌 External Codes APIs & YemenMobile SMS Gateways",
    enable_branches: "🏬 Multi-Warehouse Sync & Cloud Inventory Tools",
    enable_grocery: "🛒 Food Hypermarket, Spices & Cart Calculations",
    enable_prescription: "⚕️ Scientific Rx Prescription & Medicine Ledger",
    enable_consulting: "🎫 Professional Booking & Consulting Tickets Hub",
    smart_markup_title: "AI Margin Estimator & Exchange Normalization",
    test_api_btn: "Assert API Target Connection",
    generate_btn: "🚀 Launch Tenant Netlify Build Hook (AI Deploy)",
    terminal_logs_title: "Deep Engine Terminal Logs (Neon Monospace Grid)",
    go_to_storefront: "👁️ Preview Active Client Storefront",
    custom_brand_typography: "Sophisticated Font Logo Engine (Dynamic Typography Logo)"
  }
};

export const MasterDeveloperControl: React.FC<MasterDeveloperControlProps> = ({
  siteName,
  onUpdateSiteName,
  adminPassword,
  onResetAdminPassword,
  onUpdateAdminPassword,
  addToast,
  onClose,
}) => {
  // Configured translation context
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem("saas_console_lang") as 'ar' | 'en') || "ar";
  });

  const t = (key: keyof typeof translations['ar']) => {
    return translations[lang][key] || translations['ar'][key] || "";
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem("saas_console_lang", nextLang);
    addToast(nextLang === 'ar' ? "✓ تفعيل اللغة العربية للواجهات" : "✓ English Interface Enabled", "info");
    playLaserBeep('click');
  };

  // Sound Synthesizers (Futuristic Laser effects & Vocal Robotic Speech TTS)
  const playLaserBeep = (type: 'success' | 'click' | 'alert' | 'login') => {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.35);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
          osc.start();
          osc.stop(ctx.currentTime + 0.37);
        } else if (type === 'click') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(550, ctx.currentTime);
          osc.frequency.setValueAtTime(320, ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.07, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
          osc.start();
          osc.stop(ctx.currentTime + 0.09);
        } else if (type === 'alert') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.45);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);
          osc.start();
          osc.stop(ctx.currentTime + 0.46);
        } else if (type === 'login') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.5);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.52);
          osc.start();
          osc.stop(ctx.currentTime + 0.55);
        }
      } catch (e) {
        console.warn("Web Audio engine blocked. Require gesture.");
      }
    }
  };

  const triggerVoiceResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch (speechErr) {
        console.warn(speechErr);
      }
    }
  };

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("is_master_developer_verified") === "true";
  });
  const [developerEmail, setDeveloperEmail] = useState("abdulkrem065@gmail.com");
  const [securityKey, setSecurityKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // --- Broadcaster States & Settings Configurator ---
  const [broadcasterTarget, setBroadcasterTarget] = useState("");
  const [broadcasterTemplate, setBroadcasterTemplate] = useState("welcome");
  const [broadcasterCustomMsg, setBroadcasterCustomMsg] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // --- Brand & Password Editing States ---
  const [editingSiteName, setEditingSiteName] = useState(siteName);
  const [editingAdminPassword, setEditingAdminPassword] = useState(adminPassword);
  
  useEffect(() => {
    setEditingSiteName(siteName);
  }, [siteName]);

  useEffect(() => {
    setEditingAdminPassword(adminPassword);
  }, [adminPassword]);

  // Dynamic Currencies State
  const [currencies, setCurrencies] = useState(() => {
    const saved = localStorage.getItem("saas_currencies_v3");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { code: "YER", symbol: "YR", rate: 1, active: true },
      { code: "SAR", symbol: "SR", rate: 140, active: true },
      { code: "USD", symbol: "$", rate: 530, active: true },
      { code: "AED", symbol: "DH", rate: 144, active: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem("saas_currencies_v3", JSON.stringify(currencies));
  }, [currencies]);

  const [newCurrCode, setNewCurrCode] = useState("");
  const [newCurrSymbol, setNewCurrSymbol] = useState("");
  const [newCurrRate, setNewCurrRate] = useState("");

  const handleAddCurrency = () => {
    if (!newCurrCode.trim() || !newCurrRate.trim()) {
      addToast(lang === 'ar' ? "يرجى تعبئة رمز العملة وسعر الصرف" : "Please fill symbol and exchange rate", "warning");
      return;
    }
    const rateNum = Number(newCurrRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      addToast(lang === 'ar' ? "معدل الصرف غير صحيح" : "Invalid conversion rate", "error");
      return;
    }
    const codeUpper = newCurrCode.trim().toUpperCase();
    if (currencies.some(c => c.code === codeUpper)) {
      addToast(lang === 'ar' ? "هذه العملة منشأة ومسجلة مسبقاً!" : "This currency is already registered!", "error");
      return;
    }
    const newCurr = {
      code: codeUpper,
      symbol: newCurrSymbol.trim() || codeUpper,
      rate: rateNum,
      active: true
    };
    setCurrencies([...currencies, newCurr]);
    setNewCurrCode("");
    setNewCurrSymbol("");
    setNewCurrRate("");
    addToast(lang === 'ar' ? "✓ تم إدخال العملة الجديدة بنجاح للمنظومة!" : "✓ Currency logged successfully in SaaS matrix!", "success");
    playLaserBeep('success');
  };

  const deleteCurrency = (code: string) => {
    if (code === "YER") {
      addToast(lang === 'ar' ? "لا يمكن حذف العملة الأساسية للنظام YER" : "Cannot delete master base YER currency", "error");
      return;
    }
    setCurrencies(currencies.filter(c => c.code !== code));
    addToast(lang === 'ar' ? "تم إزالة عملة السستم بسلام" : "Currency purged safely from backend", "info");
    playLaserBeep('click');
  };

  // SaaS Master Live Projects & Tenants List State
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("saas_projects_v3");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("saas_projects_v3", JSON.stringify(projects));
  }, [projects]);

  // Settings & Tabbing
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wizard' | 'currencies'>('dashboard');
  const [expandedProject, setExpandedProject] = useState<string | null>("p-supermarket");
  const [errorLogs, setErrorLogs] = useState([
    { time: "18:49:15", type: "success", msg: "API connection asserted: SMM Server Response 200 OK." },
    { time: "18:50:33", type: "info", msg: "Currency matrix loaded. Active exchange rules locked: YER YER base." },
    { time: "18:52:10", type: "error", msg: "Warn API Check: SMM Provider token verification timed out of gateway." }
  ]);

  const addLog = (msg: string, type: string = "info") => {
    const freshLog = {
      time: new Date().toLocaleTimeString("en-GB"),
      type,
      msg
    };
    setErrorLogs(prev => [freshLog, ...prev.slice(0, 39)]);
  };

  // العداد الدائري النيوني وجلسة الأمان (Neon Session Countdown)
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsAuthenticated(false);
            sessionStorage.removeItem("is_master_developer_verified");
            addToast(lang === 'ar' ? "🚨 الخاطر! انتهت مهلة جلسة الأمان المضيئة. يرجى الدخول مجدداً." : "🚨 Session timeout! System auto-locked.", "error");
            playLaserBeep('alert');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuthenticated]);

  const extendSession = () => {
    setTimeLeft(300);
    addToast(lang === 'ar' ? "✓ تم تجديد رمز مهلة الحماية" : "✓ Timer Token Extended safely", "success");
    playLaserBeep('success');
  };

  // Authentication execution
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    playLaserBeep('click');

    setTimeout(() => {
      if (securityKey === "abdulkrem065@gmail.com" || securityKey === "dev-master-access-2026" || securityKey === "1122") {
        setIsAuthenticated(true);
        sessionStorage.setItem("is_master_developer_verified", "true");
        setTimeLeft(300);
        addToast(lang === 'ar' ? "🔑 أهلاً بك يا عبدالكريم! تم إقرار هويتك كمطور مطلق بنجاح" : "🔑 Identity Approved Master Dev! Welcome.", "success");
        playLaserBeep('login');
        triggerVoiceResponse(lang === 'ar' ? "مرحبا بك يا عبد الكريم" : "Welcome developer");
      } else {
        addToast(lang === 'ar' ? "❌ مفتاح الأمان للتخطي السحابي غير صحيح!" : "❌ Invalid security key!", "error");
        playLaserBeep('alert');
      }
      setIsVerifying(false);
    }, 700);
  };

  // Handlers for Project & Subscribers suspension / features injection
  const toggleProjectStatus = (pId: string) => {
    playLaserBeep('click');
    setProjects(prev => prev.map(p => {
      if (p.id === pId) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active';
        addLog(`⚡ تم تغيير مصفوفة [${p.name}] إلى: ${nextStatus === 'active' ? 'نشط وحي' : 'معطل ومغلق'}`, "success");
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const toggleSubscriberActive = (pId: string, sId: string) => {
    playLaserBeep('click');
    setProjects(prev => prev.map(p => {
      if (p.id === pId) {
        return {
          ...p,
          subscribers: p.subscribers.map((s: any) => {
            if (s.id === sId) {
              const nextVal = !s.active;
              addLog(`⚡ تم ${nextVal ? 'تفعيل وتشغيل' : 'حظر وإيقاف'} المشترك الفردي [${s.name}].`, "info");
              addToast(
                lang === 'ar' 
                  ? `تم ${nextVal ? 'فتح حظر' : 'حظر'} العميل ${s.name} مستقلّاً!` 
                  : `Subscription for ${s.name} is now: ${nextVal ? 'Live' : 'Banned'}`, 
                nextVal ? "success" : "warning"
              );
              return { ...s, active: nextVal };
            }
            return s;
          })
        };
      }
      return p;
    }));
  };

  const toggleSubscriberFeature = (pId: string, sId: string, featureKey: string) => {
    playLaserBeep('click');
    setProjects(prev => prev.map(p => {
      if (p.id === pId) {
        return {
          ...p,
          subscribers: p.subscribers.map((s: any) => {
            if (s.id === sId) {
              let updated = [...s.features];
              if (updated.includes(featureKey)) {
                updated = updated.filter(f => f !== featureKey);
                addLog(`⚙️ تم حجب ميزة [${featureKey}] عن العميل [${s.name}]`, "warning");
              } else {
                updated.push(featureKey);
                addLog(`⚙️ تم حقن وتفعيل ميزة [${featureKey}] للعميل [${s.name}]`, "success");
              }
              return { ...s, features: updated };
            }
            return s;
          })
        };
      }
      return p;
    }));
  };

  // --- Step-By-Step Pipeline Wizard States ---
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    clientName: "",
    clientPhone: "",
    role: "مالك متجر",
    defaultLang: "ar",
    currency: "YER",
    customExchangeRate: "1",
    expiryDate: "2027-12-31",
    customDomain: "",
    
    // Feature parameters
    featGaming: false,
    featAPI: false,
    featBranches: false,
    featGrocery: false,
    featPrescription: false,
    featConsulting: false,

    gamingApiUrl: "https://api.likecard.com/v1",
    gamingApiKey: "",
    smsGatewayUrl: "https://yemenmobile.services/api",
    smsToken: "",
    branchesMerchantId: "MCH-8840",
    groceryTerminalId: "TERM-2234",
    prescriptionDoctorId: "Rx-90023",
    consultingAgentId: "LAW-1033",
    
    smartMarkupEnabled: true,
    markupPercent: "12"
  });

  const [apiTestingStatus, setApiTestingStatus] = useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({});

  const testFeatureApi = (featureKey: string) => {
    playLaserBeep('click');
    setApiTestingStatus(prev => ({ ...prev, [featureKey]: 'testing' }));
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15; // 85% success simulation mock
      setApiTestingStatus(prev => ({ ...prev, [featureKey]: isSuccess ? 'success' : 'error' }));
      if (isSuccess) {
        addToast(
          lang === 'ar' 
            ? `✓ تم فحص الاتصال وتأمين الـ API بنجاح للخدمة!` 
            : `✓ API connectivity validated safely for feature!`, 
          "success"
        );
      } else {
        addToast(
          lang === 'ar' 
            ? `🔴 فشل الاتصال بمزود الخدمة! الرجاء التحقق من الرموز والروابط.` 
            : `🔴 Connection validation failed! Assert API nodes.`, 
          "error"
        );
      }
    }, 1200);
  };

  // Deploys Core Monospace Terminal Engine variables
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardConsoleLogs, setWizardConsoleLogs] = useState<string[]>([]);
  const [generatedSiteUrl, setGeneratedSiteUrl] = useState("");

  const executeSaaSGeneration = () => {
    if (!wizardData.clientName.trim() || !wizardData.clientPhone.trim()) {
      addToast(lang === 'ar' ? "يرجى تعبئة الاسم ورقم الجوال أولاً" : "Please fill Name and Phone identifier", "error");
      return;
    }
    setIsGenerating(true);
    setWizardConsoleLogs([]);
    setGeneratedSiteUrl("");
    playLaserBeep('login');

    const lines = [
      "🔄 [SaaS Core] Init: Absolute Developer pipeline bootstrap sequence aligned...",
      "📦 GitHub endpoint matched: Repositories (abdulkrem065-jpg/al-dhibani-store-v2)",
      "🧬 Allocating isolated container stack memory blocks...",
      `⚙️ Configuring interface translation maps default: [${wizardData.defaultLang.toUpperCase()}]`,
      `🧮 Binding primary transaction financial model: [${wizardData.currency}] at system exchange conversion limit YER: ${wizardData.customExchangeRate}`,
      `📈 Smart markup profit-margin calculations model: +${wizardData.markupPercent}% registered in microservices...`,
      wizardData.featGaming ? "🎮 Compiling Node: Hyper Games API diamond & points dispenser modules..." : "❄️ Skipping modules: Gaming dispenses",
      wizardData.featAPI ? "🔌 Compiling Node: SMS YemenMobile cellular card gateway APIs..." : "❄️ Skipping modules: Code gateways",
      wizardData.featPrescription ? "⚕️ Compiling Node: Primary Scientific Rx Medical Prescriptions Ledger..." : "❄️ Skipping modules: Rx Medical Ledger",
      wizardData.featConsulting ? "🎫 Compiling Node: Corporate digital advisory booking and tickets..." : "❄️ Skipping modules: Digital law booking",
      "📡 Pushing encrypted variables payload to API route gateway filters...",
      "☁️ Triggering live secure Netlify Webhook deploy hook (deployment_ID)...",
      "⚡ Running production bundling process inside isolated sandbox server...",
      "⏱️ Securing DNS mappings, generating SSL licenses and subdomain hashes...",
      "✨ SUCCESS: Spawning completed smoothly! Dynamic Typography logo rendered correctly."
    ];

    lines.forEach((msg, idx) => {
      setTimeout(() => {
        setWizardConsoleLogs(prev => [...prev, msg]);
        if (idx === lines.length - 1) {
          setIsGenerating(false);
          const namePart = (wizardData.clientName || "dhibani-store").toLowerCase().replace(/[^a-z0-9]/g, "-");
          const destinationUrl = `https://${namePart}.al-dhibani-store-v2.netlify.app`;
          setGeneratedSiteUrl(destinationUrl);
          
          addToast(lang === 'ar' ? "✓ تم توليد وإطلاق متجرك السحابي بسلام!" : "✓ Tenant Cloud Store spawned safely as individual project!", "success");
          triggerVoiceResponse(
            lang === 'ar' ? "تم التقديم بنجاح" : "Successfully Submitted"
          );

          // Append newly generated project
          const enabledFeats = [
            wizardData.featGaming && "gaming",
            wizardData.featAPI && "api",
            wizardData.featBranches && "branches",
            wizardData.featGrocery && "grocery",
            wizardData.featPrescription && "prescription",
            wizardData.featConsulting && "consulting"
          ].filter(Boolean) as string[];

          const newProjObj = {
            id: `p-${Date.now()}`,
            name: `${wizardData.clientName} السحابي المتكامل`,
            englishName: `${wizardData.clientName} Cloud Tenant Panel`,
            currency: wizardData.currency,
            rate: Number(wizardData.customExchangeRate) || 1,
            margin: Number(wizardData.markupPercent) || 10,
            status: "active",
            logoType: "text",
            logoCustom: "⭐",
            phone: wizardData.clientPhone,
            subscribers: [
              {
                id: `s-${Date.now()}`,
                name: `الفرع الرئيسي لـ ${wizardData.clientName}`,
                phone: wizardData.clientPhone,
                role: wizardData.role,
                expiry: wizardData.expiryDate,
                active: true,
                features: enabledFeats
              }
            ]
          };
          setProjects(prev => [newProjObj, ...prev]);
        }
      }, (idx + 1) * 550);
    });
  };

  // Systems Actions Backup & Hot-Fixes
  const triggerOneClickBackup = () => {
    playLaserBeep('success');
    addToast(lang === 'ar' ? "🔒 تم تشفير وحفظ نسخة احتياطية سحابية كاملة لقاعدة البيانات!" : "🔒 Entire SaaS server memory state compiled into encrypted backup file safely!", "success");
    addLog("✓ BACKUP COMPILED: Projects count (" + projects.length + ") compiled to secure blob.", "success");
    triggerVoiceResponse(lang === 'ar' ? "تم النسخ الاحتياطي بنجاح" : "Cloud backup accomplished successfully");
  };

  const triggerGlobalHotFix = () => {
    playLaserBeep('login');
    addToast(lang === 'ar' ? "🚀 تم حقن وتعميم التحديث البرمجي الشامل لكافة الفروع والمشتركين بدقيقة واحدة!" : "🚀 Dynamic Hot-Fix injected context inside 100% of live branches actively!", "success");
    addLog("🚨 GLOBAL HOT-FIX BROADCASTED: Patched standard currency normalization modules globally.", "error");
    triggerVoiceResponse(lang === 'ar' ? "تم التحديث بنجاح" : "Hot fix applied database node");
  };

  const handleSendBroadcast = () => {
    if (!broadcasterTarget) {
      addToast(lang === 'ar' ? "يرجى تحديد العميل أو الفرع المستهدف للبث" : "Please select target branch recipient", "warning");
      playLaserBeep('alert');
      return;
    }
    
    // Find recipient details
    const recipient = projects.flatMap(p => p.subscribers).find((s: any) => s.phone === broadcasterTarget);
    const clientName = recipient ? recipient.name : "العميل";

    let msgText = "";
    if (broadcasterTemplate === "custom") {
      msgText = broadcasterCustomMsg;
    } else if (broadcasterTemplate === "welcome") {
      msgText = lang === 'ar' 
        ? `مرحباً أستاذ ${clientName}، تم تفعيل المتجر المطور ذكياً وتدشين بوابات الشحن الفوري بنجاح. مجموعة آل ذيبان السحابية.`
        : `Greetings ${clientName}, your dynamic storefront was successfully spawned & LikeCard topup APIs activated. Al-Dhibani Group.`;
    } else if (broadcasterTemplate === "reminder") {
      msgText = lang === 'ar'
        ? `تنبيه سحابي: نرجو من الأستاذ ${clientName} الوفاء بمستحقات تجديد ترخيص المتجر لتجنب إيقاف الخدمة تلقائياً.`
        : `Security Alert: Dear ${clientName}, please notice that your core subscription is nearing its licensing expiration. Dhibani SaaS.`;
    } else if (broadcasterTemplate === "update") {
      msgText = lang === 'ar'
        ? `خط ساخن: تم حقن تحديث أمني عالي الاستقرار وتجاوز تذبب أسعار الصرف في اليمن وتعميمه لمتجركم.`
        : `System Update: High-stability normalizer patches deployed successfully across your branch gateways.`;
    }

    if (!msgText.trim()) {
      addToast(lang === 'ar' ? "يرجى صياغة نص الرسالة قبل الإرسال" : "Message text cannot be blank", "warning");
      return;
    }

    setIsBroadcasting(true);
    playLaserBeep('click');
    addLog(`💬 [Broadcast] Initializing Whatsapp secure tunnel connection to ${broadcasterTarget}...`, "info");

    setTimeout(() => {
      addLog(`📡 [Broadcast] Syncing handshake packets. Text payload size: ${msgText.length} bytes.`, "info");
      
      setTimeout(() => {
        setIsBroadcasting(false);
        addLog(`✓ BROADCAST SENT: Msg successfully delivered to +967 ${broadcasterTarget}! Status: 200 Delivered.`, "success");
        addToast(
          lang === 'ar' 
            ? `✓ تم إرسال وبث إشعار الواتساب بسلام إلى: ${clientName}` 
            : `✓ WhatsApp broadcast safely dispatched to ${clientName}!`, 
          "success"
        );
        playLaserBeep('success');
        triggerVoiceResponse(
          lang === 'ar' ? "تم الإرسال الهوائي" : "Message delivered"
        );
        setBroadcasterCustomMsg("");
      }, 900);

    }, 850);
  };

  // Glowing Dynamic Countdown Timer Color Mapping
  const getTimerStrokeColor = () => {
    if (timeLeft > 150) return "#00f3ff"; // neon turquoise
    if (timeLeft > 60) return "#f59e0b";  // neon glowing orange
    return "#ff0055";                     // alert neon red
  };

  // Screen 1: Master Lock Screen Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#040409] text-slate-100 flex items-center justify-center font-sans p-6 relative overflow-hidden" id="saas-lockscreen-container">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-[20%] left-[20%] w-96 h-96 rounded-full bg-[#bd00ff]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full bg-[#00f3ff]/5 blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#0b0c16]/90 border-2 border-purple-500/25 rounded-3xl p-8 shadow-[0_0_50px_rgba(189,0,255,0.15)] relative z-10 backdrop-blur-md text-right"
          dir="rtl"
        >
          {/* Top selection for Language in Auth screen */}
          <div className="absolute top-4 left-4 z-40">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 bg-[#151726] hover:bg-[#20233c] text-[10px] text-slate-300 rounded-xl border border-slate-800 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'ar' ? "English" : "العربية"}</span>
            </button>
          </div>

          <div className="text-center space-y-4 mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border-2 border-purple-400/40 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Shield className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-black bg-gradient-to-l from-purple-300 via-white to-blue-300 bg-clip-text text-transparent">
              {t('login_title')}
            </h2>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              {t('login_desc')}
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-5">
            <div className="space-y-1.5 text-right">
              <label className="text-[10px] text-slate-400 font-bold block">
                📧 {lang === 'ar' ? "بريد المطور المعتمد" : "Authorized Developer Email"}
              </label>
              <input 
                type="email"
                required
                value={developerEmail}
                onChange={(e) => setDeveloperEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#030409] border border-purple-900/40 rounded-xl text-xs text-slate-300 tracking-wide focus:border-purple-400 outline-none transition-all font-mono text-left"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <div className="flex justify-between items-center bg-transparent">
                <span className="text-[9px] text-yellow-500 font-bold font-mono">dev-master-access-2026</span>
                <label className="text-[10px] text-slate-400 font-bold block">
                  🔑 {t('login_key_label')}
                </label>
              </div>
              <input 
                type="password"
                required
                placeholder={t('login_placeholder')}
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                className="w-full px-4 py-3 bg-[#030409] border border-purple-900/40 rounded-xl text-xs text-purple-400 focus:border-purple-400 outline-none transition-all font-mono text-center"
              />
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-right space-y-1.5">
              <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1 leading-none">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'ar' ? "حماية آل ذيبان للأمان الشامل:" : "Dhibani Absolute Firewalls:"}</span>
              </span>
              <p className="text-[9px] text-slate-400 leading-normal">
                {lang === 'ar' 
                  ? "تتم المزامنة البرمجية لتأكيد تراخيصك السحابية. يمكنك استخدام مفتاح التخطي السريع المعتمد 'dev-master-access-2026' أو '1122' للدخول المباشر والتفعيل."
                  : "Sync is handled automatically. Utilize developer fast-pass bypass code 'dev-master-access-2026' or '1122' to authorize instant panel entry."}
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-500/10 cursor-pointer transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ar' ? "فك التشفير وقراءة الدروع..." : "Unlocking digital vaults..."}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-purple-300" />
                  <span>{t('login_btn')}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Screen 2: Master SaaS Management Center V3
  return (
    <div className="min-h-screen bg-[#040409] text-slate-100 font-sans selection:bg-purple-500/30 text-right pb-12" id="saas-console-v3-workspace">
      
      {/* 1. Header with dynamic languages toggles, ticking circular neon timer */}
      <header className="border-b border-[#1b1c31] bg-[#090a16] sticky top-0 z-50 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-slate-100 text-xl shadow-[0_0_20px_rgba(189,0,255,0.35)]">
              🦅
            </div>
            <div className="text-right">
              <h1 className="text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-white via-slate-150 to-purple-300 flex items-center gap-2 flex-wrap">
                AL-DHIBANI <span className="bg-purple-500/10 text-purple-300 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30 font-mono tracking-widest uppercase">Master SaaS Console V3</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Dynamic Multi-Tenant Gateway & Absolute Automation Pipeline</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* View client storefront button to toggle visual view */}
            <button 
              onClick={onClose}
              className="bg-[#121327]/80 hover:bg-[#1f203d] text-emerald-400 border border-emerald-500/40 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>{t('go_to_storefront')}</span>
            </button>

            {/* Language Toggle Button */}
            <button 
              onClick={toggleLanguage}
              className="bg-[#121327]/80 hover:bg-[#1f203d] text-purple-400 border border-purple-500/40 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'ar' ? "English" : "العربية"}</span>
            </button>

            {/* Backups & Hotfixes actions */}
            <button 
              onClick={triggerOneClickBackup}
              className="bg-[#121327] hover:bg-[#1a1c35] text-slate-300 border border-slate-800 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all hover:border-slate-700 cursor-pointer"
            >
              📦 {t('one_click_backup')}
            </button>

            <button 
              onClick={triggerGlobalHotFix}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              ⚡ {t('global_hot_fix')}
            </button>

            {/* Neon Ticking Session Expiry circular count timer */}
            <div className="flex items-center gap-2 bg-[#0d0e1b] px-3 py-1 rounded-xl border border-slate-800" title={t('session_timer')}>
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="14" cy="14" r="11" stroke="#1c1d2c" strokeWidth="2.5" fill="transparent" />
                  <circle 
                    cx="14" 
                    cy="14" 
                    r="11" 
                    stroke={getTimerStrokeColor()} 
                    strokeWidth="2.5" 
                    fill="transparent" 
                    strokeDasharray={69.1} 
                    strokeDashoffset={69.1 - (69.1 * timeLeft) / 300} 
                    className="transition-all duration-1000" 
                  />
                </svg>
                <span className="absolute text-[8px] font-mono font-black" style={{ color: getTimerStrokeColor() }}>
                  {timeLeft}s
                </span>
              </div>
              <button 
                onClick={extendSession}
                className="text-[9px] font-extrabold text-purple-300 underline hover:text-white shrink-0 cursor-pointer"
              >
                {t('session_extend')}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Intro subtitle */}
        <div className="bg-[#0b0c16] rounded-3xl p-6 border-b-2 border-purple-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.03)_0%,transparent_60%)] pointer-events-none" />
          <div className="space-y-1 relative z-10 text-right">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin duration-[10000ms]" />
              <span>{t('title')}</span>
            </h2>
            <p className="text-xs text-slate-400">{t('subtitle')}</p>
          </div>

          <div className="flex gap-2 relative z-10">
            <button 
              onClick={() => { playLaserBeep('click'); setActiveTab('dashboard'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#15172b] text-slate-350 hover:text-white'}`}
            >
              {t('projects_tab')}
            </button>
            <button 
              onClick={() => { playLaserBeep('click'); setActiveTab('wizard'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'wizard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#15172b] text-slate-350 hover:text-white'}`}
            >
              {t('wizard_tab')}
            </button>
            <button 
              onClick={() => { playLaserBeep('click'); setActiveTab('currencies'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'currencies' ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#15172b] text-slate-350 hover:text-white'}`}
            >
              {t('currency_tab')}
            </button>
          </div>
        </div>

        {/* Tab 1: Control Matrix & Live Projects Panel */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Global Al-Dhibani Quick brand settings & KPI statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-right">
              
              {/* Box 1: Brand Quick Config */}
              <div className="bg-[#0b0c16]/90 border border-purple-500/15 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4 bg-slate-950">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-[#1b1c31] pb-2.5">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'ar' ? "إعدادات منصة آل ذيبان الحية" : "Live Brand Configuration"}</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "عنوان وهوية المنصة الرئيسية:" : "Main Platform Title Identity:"}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingSiteName}
                        onChange={(e) => setEditingSiteName(e.target.value)}
                        className="flex-1 bg-[#030409] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-bold outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={() => {
                          onUpdateSiteName(editingSiteName);
                          addToast(lang === 'ar' ? "✓ تغير اسم منصة آل ذيبان الحية!" : "✓ Brand Identity updated live!", "success");
                          playLaserBeep('success');
                        }}
                        className="bg-purple-600 hover:bg-purple-500 p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                        title={lang === 'ar' ? "حفظ الاسم" : "Save Name"}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block flex justify-between">
                      <span className="text-yellow-500/85 font-mono">1122 default</span>
                      <span>{lang === 'ar' ? "الرمز السري العام للوحة الإدارة:" : "Master Admin General Passcode:"}</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingAdminPassword}
                        onChange={(e) => setEditingAdminPassword(e.target.value)}
                        className="flex-1 bg-[#030409] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-purple-400 font-mono text-center outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={() => {
                          if (onUpdateAdminPassword) {
                            onUpdateAdminPassword(editingAdminPassword);
                            addToast(lang === 'ar' ? "✓ تم تحديث الرمز السري العام بنجاح!" : "✓ General admin passcode updated!", "success");
                            playLaserBeep('success');
                          } else {
                            addToast(lang === 'ar' ? "ميزة التعديل معطلة" : "Feature locked", "error");
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-500 p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                        title={lang === 'ar' ? "حفظ الرمز" : "Save Passcode"}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Platforms KPI Stats */}
              <div className="bg-[#0b0c16]/90 border border-purple-500/15 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between bg-slate-950">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                
                <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-[#1b1c31] pb-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? "مؤشرات حيوية ومبيعات سحابية" : "Cloud Metrics & Gross Volume"}</span>
                </h3>

                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="bg-[#060710] p-2.5 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] text-slate-400 font-bold block mb-1">{lang === 'ar' ? "المشروعات الكلية" : "Cloud Tenants"}</span>
                    <span className="text-base font-black text-purple-400 font-mono">{projects.length}</span>
                  </div>
                  <div className="bg-[#060710] p-2.5 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] text-slate-400 font-bold block mb-1">{lang === 'ar' ? "إجمالي الفروع النشطة" : "Active Branches"}</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {projects.reduce((acc, p) => acc + p.subscribers.filter((s:any) => s.active).length, 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#030409] p-2 rounded-xl border border-slate-900 text-center flex items-center justify-between px-3">
                  <span className="text-[9px] text-slate-400 font-extrabold">{lang === 'ar' ? "حجم مبيعات اليوم الكلي:" : "Estimated Daily Volume:"}</span>
                  <span className="text-xs font-black text-purple-300 font-mono">
                    {(projects.reduce((acc, p) => acc + (p.subscribers.length * 125 * p.rate), 48500)).toLocaleString()} YER
                  </span>
                </div>
              </div>

              {/* Box 3: Market Dominance visualizer SVG */}
              <div className="bg-[#0b0c16]/90 border border-purple-500/15 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between bg-slate-950">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-[#1b1c31] pb-2.5">
                  <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>{lang === 'ar' ? "الحصة السوقية والسيادة الكلية لمجموعة آل ذيبان" : "AL-DHIBANI Market Share Dominance"}</span>
                </h3>

                <div className="flex items-center gap-4 py-2 flex-1">
                  {/* Circular visual gauge SVG */}
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="#15172b" strokeWidth="5" fill="none" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        stroke="url(#bluePurpleGrad)" 
                        strokeWidth="5" 
                        fill="none" 
                        strokeDasharray={175.92} 
                        strokeDashoffset={175.92 - (175.92 * 94.6) / 100}
                        strokeLinecap="round" 
                      />
                      <defs>
                        <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white font-mono">94.6%</span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "استحواذ بوابة درع الذيباني المالي باليمن" : "Secure Gateways Yemen Coverage"}</span>
                    <div className="w-full bg-[#15172b] h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-[94.6%]" />
                    </div>
                    <span className="text-[9px] text-slate-500 leading-none block">{lang === 'ar' ? "* مؤشر محسوب من أصل 668 فرع مرخص." : "* Stats computed out of 668 active licenses."}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Main project grid list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
              
              {/* Project List Accordion (Left spans 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0b0c16] rounded-2xl border border-purple-500/10 overflow-hidden shadow-2xl">
                
                <div className="p-4 bg-[#111327] border-b border-[#1b1c31] flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300">{lang === 'ar' ? "مصفوفة فحص وجرد الفروع السحابية النشطة" : "Active Multitasking Tenant Gateways"}</span>
                  <span className="text-[10px] text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded font-bold">Total: {projects.length} Nodes</span>
                </div>

                <div className="divide-y divide-[#1b1c31]">
                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center space-y-6" id="empty-projects-slate">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl animate-pulse" />
                        <Sparkles className="w-12 h-12 text-purple-400 relative z-10 animate-spin" style={{ animationDuration: '8s' }} />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-white px-4">
                          {lang === 'ar' ? "لا توجد مشاريع نشطة حالياً، ابدأ بإطلاق مشروعك الأول الآن" : "No active projects currently. Start by launching your first project now."}
                        </h4>
                        <p className="text-[10px] text-slate-400 max-w-md mx-auto leading-relaxed px-6">
                          {lang === 'ar' 
                            ? "اكتشف القوة الكاملة لآل ذيبان في توليد وإدارة فروع الصيدليات، سلال التموين والمواد الغذائية المعزولة، أو منصات شحن الألعاب التلقائية من الصفر."
                            : "Explore the full power of Al-Dhibani to build, update, and deploy completely isolated pharmacy nodes, food supply systems, or automated gaming storefronts from scratch."}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          playLaserBeep('success');
                          setActiveTab('wizard');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.73)] cursor-pointer active:scale-95 flex items-center gap-2"
                        id="launch-first-project-btn"
                      >
                        <Zap className="w-4 h-4 text-yellow-350 fill-yellow-350 shrink-0" />
                        <span>{lang === 'ar' ? "إطلاق أول مشروع ذكي" : "Initialize Absolute Target Store Now"}</span>
                      </button>
                    </div>
                  ) : (
                    projects.map(proj => (
                      <div key={proj.id} className="transition-all">
                        
                        {/* Accordion Head */}
                        <div 
                          onClick={() => {
                            playLaserBeep('click');
                            setExpandedProject(expandedProject === proj.id ? null : proj.id);
                          }}
                          className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#14162e] transition-all cursor-pointer ${expandedProject === proj.id ? 'bg-[#111329]' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Typography Logo Auto Generator */}
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center justify-center font-black text-purple-400 shadow-inner">
                              {proj.logoCustom ? proj.logoCustom : (proj.name.slice(0, 2))}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2 flex-wrap">
                                <span>{lang === 'ar' ? proj.name : proj.englishName}</span>
                                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-1.5 py-0.5 rounded border border-purple-500/30">{proj.currency}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">{lang === 'ar' ? `رقم الإدارة: ${proj.phone}` : `System Manager: ${proj.phone}`}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-transparent">
                              {/* Pulse laser light */}
                              <span className="relative flex h-2.5 w-2.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${proj.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${proj.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              </span>
                              <span className={`text-[10px] font-black ${proj.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {proj.status === 'active' 
                                  ? (lang === 'ar' ? "متصل ومستقر ✔" : "Active & Stable ✔") 
                                  : (lang === 'ar' ? "معطل ومحجوب 🔴" : "Suspended Node 🔴")}
                              </span>
                            </div>

                            <div className="text-xs font-black text-purple-300 hover:text-white transition-colors font-mono">
                              {expandedProject === proj.id ? "▲" : "▼"}
                            </div>
                          </div>
                        </div>

                        {/* Accordion Body details */}
                        {expandedProject === proj.id && (
                          <div className="bg-[#070810] p-5 border-t border-[#1a1b30] space-y-4 animate-fade-in overflow-x-auto">
                            
                            {/* Top controls of the project */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/10">
                              <div className="flex items-center gap-4 text-xs font-bold">
                                <span className="text-slate-400">{lang === 'ar' ? "هامش الربح المعتمد:" : "Mark-up margin ratio:"}</span>
                                <span className="text-purple-400">{proj.margin}%</span>
                                <span className="h-3 w-[1px] bg-slate-800" />
                                <span className="text-slate-400">{lang === 'ar' ? "سعر الصرف الداخلي:" : "Exchange Rate:"}</span>
                                <span className="text-purple-400">{proj.rate} YR</span>
                              </div>
                              
                              <button 
                                onClick={() => toggleProjectStatus(proj.id)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all ${proj.status === 'active' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}
                              >
                                {proj.status === 'active' 
                                  ? (lang === 'ar' ? "🚫 قفل المشروع بالكامل ودراسته" : "🚫 Block Project Totally") 
                                  : (lang === 'ar' ? "⚡ تفعيل المشروع واستقبال المكالمات" : "⚡ Unblock Store & Resume")}
                              </button>
                            </div>

                            {/* Dynamic Subscribers Table */}
                            <table className="w-full text-right text-xs">
                              <thead>
                                <tr className="text-slate-500 border-b border-slate-900 font-bold">
                                  <th className="pb-2 text-right">{t('sub_name')}</th>
                                  <th className="pb-2 text-right">{t('sub_phone')}</th>
                                  <th className="pb-2 text-right">{t('sub_role')}</th>
                                  <th className="pb-2 text-right">{t('sub_features')}</th>
                                  <th className="pb-2 text-right">{t('sub_expiry')}</th>
                                  <th className="pb-2 text-center">{t('sub_control')}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-950">
                                {proj.subscribers.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="py-4 text-center text-slate-500">{t('no_subscribers')}</td>
                                  </tr>
                                ) : (
                                  proj.subscribers.map((sub: any) => {
                                    const isExpired = new Date(sub.expiry) < new Date();
                                    return (
                                      <tr 
                                        key={sub.id} 
                                        className={`hover:bg-slate-900/30 transform transition-all ${(!sub.active || isExpired) ? 'bg-red-950/5' : ''}`}
                                      >
                                        {/* Subscriber Name & Expiry locked warning indicator */}
                                        <td className="py-3 font-bold text-slate-200">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span>{sub.name}</span>
                                            {isExpired && (
                                              <span className="text-[8px] bg-red-500/20 text-red-300 border border-red-500/40 px-1 py-0.5 rounded font-black animate-pulse">
                                                {t('expiry_locked')}
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-3 font-mono text-slate-400">{sub.phone}</td>
                                        <td className="py-3">
                                          <span className="bg-[#121326] px-2 py-0.5 rounded text-[10px] text-purple-300 border border-purple-500/10">{sub.role}</span>
                                        </td>
                                        <td className="py-3">
                                          <div className="flex flex-wrap gap-1">
                                            {/* Muted feature controllers toggler inside accordion */}
                                            {['gaming', 'api', 'branches', 'grocery', 'prescription', 'consulting'].map(featKey => {
                                              const active = sub.features.includes(featKey);
                                              return (
                                                <button
                                                  key={featKey}
                                                  onClick={() => {
                                                    if (!sub.active) return;
                                                    toggleSubscriberFeature(proj.id, sub.id, featKey);
                                                  }}
                                                  disabled={!sub.active}
                                                  className={`text-[9px] px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                                                    active 
                                                      ? 'bg-purple-600/15 text-purple-400 border-purple-500/30 font-bold' 
                                                      : 'bg-[#0f101d] text-slate-600 border-slate-900 hover:text-slate-400 hover:border-slate-800'
                                                  }`}
                                                  title={lang === 'ar' ? `انقر لتعديل ميزة ${featKey}` : `Toggle feature ${featKey}`}
                                                >
                                                  {featKey === 'gaming' && "🎮 Gaming"}
                                                  {featKey === 'api' && "🔌 API"}
                                                  {featKey === 'branches' && "🏬 Warehouse"}
                                                  {featKey === 'grocery' && "🛒 Grocery"}
                                                  {featKey === 'prescription' && "⚕️ Rx Pharma"}
                                                  {featKey === 'consulting' && "🎫 Consult"}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </td>
                                        <td className="py-3 font-mono text-slate-350">{sub.expiry}</td>
                                        <td className="py-3 text-center">
                                          <button 
                                            onClick={() => toggleSubscriberActive(proj.id, sub.id)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all ${sub.active ? 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'}`}
                                          >
                                            {sub.active ? t('sub_action_suspend') : t('sub_action_activate')}
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>

                          </div>
                        )}

                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

            {/* Dashboard Right Sidebar (1 col): Server logs and API connection checks */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-[#0b0c16] rounded-2xl p-5 border border-purple-500/10 shadow-xl space-y-4">
                <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-[#1b1c31] pb-3">
                  <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>{t('server_logs')}</span>
                </h3>

                <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl font-mono text-[10px] space-y-2 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 text-left" dir="ltr">
                  {errorLogs.map((log, idx) => (
                    <div key={idx} className="space-y-0.5 border-b border-slate-900/50 pb-1">
                      <div className="flex items-center justify-between text-[8px] text-slate-500">
                        <span>Time: {log.time}</span>
                        <span className={`px-1 rounded ${
                          log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                          log.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-normal">{log.msg}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    playLaserBeep('click');
                    addToast(lang === 'ar' ? "✓ تم إعادة استجواب قنوات الربط بجميع الفروع بنجاح!" : "✓ Polled and asserted connectivity for all nodes safely!", "success");
                    addLog("✓ Active gateways query finalized. Network packets latency: 45ms.", "success");
                  }}
                  className="w-full bg-[#121327]/80 hover:bg-[#1a1c35] border border-slate-800 text-slate-300 font-extrabold py-2.5 rounded-xl text-[10px] cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Wifi className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{t('test_connection')}</span>
                </button>
              </div>

              {/* WhatsApp Broadcast Center */}
              <div className="bg-[#0b0c16] rounded-2xl p-5 border border-purple-500/10 shadow-xl space-y-4 bg-slate-950">
                <h3 className="text-xs font-black text-slate-200 flex items-center gap-1.5 border-b border-[#1b1c31] pb-3">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'ar' ? "مذياع وبث إشعارات الواتساب الحيوية" : "Direct WhatsApp Broadcast Feed"}</span>
                </h3>

                <div className="space-y-3 font-sans">
                  {/* Select Recipient */}
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "اختيار الفرع أو العميل المتلقي:" : "Select Branch/Subscriber:"}</label>
                    <select
                      value={broadcasterTarget}
                      onChange={(e) => {
                        setBroadcasterTarget(e.target.value);
                        playLaserBeep('click');
                      }}
                      className="w-full bg-[#030409] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none text-right appearance-none"
                    >
                      <option value="">-- {lang === 'ar' ? "اختر العميل من النظام" : "Select Client tenant"} --</option>
                      {projects.flatMap(p => p.subscribers.map((s:any) => (
                        <option key={s.id} value={s.phone}>{s.name} ({s.phone})</option>
                      )))}
                    </select>
                  </div>

                  {/* Message Template Select */}
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "قالب الرسالة المعتمد:" : "Notification Template:"}</label>
                    <select
                      value={broadcasterTemplate}
                      onChange={(e) => {
                        setBroadcasterTemplate(e.target.value);
                        playLaserBeep('click');
                      }}
                      className="w-full bg-[#030409] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none font-bold text-right appearance-none"
                    >
                      <option value="welcome">🎉 {lang === 'ar' ? "إشعار الترحيب والتهيئة" : "Welcome onboarding message"}</option>
                      <option value="reminder">⏳ {lang === 'ar' ? "إشعار التنبيه بسداد الاشتراك" : "Payment and license reminder"}</option>
                      <option value="update">🚀 {lang === 'ar' ? "إشعار حقن الترقية والتحديت" : "Upgrade and normal patch memo"}</option>
                      <option value="custom">✍️ {lang === 'ar' ? "صياغة رسالة حرة مخصصة" : "Write custom message text"}</option>
                    </select>
                  </div>

                  {/* Custom message text-area */}
                  {broadcasterTemplate === 'custom' && (
                    <div className="space-y-1.5 animate-slide-in text-right">
                      <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "الرسالة الحرة المفتوحة:" : "Custom Payload Body:"}</label>
                      <textarea
                        rows={3}
                        value={broadcasterCustomMsg}
                        onChange={(e) => setBroadcasterCustomMsg(e.target.value)}
                        placeholder="...اكتب النص هنا"
                        className="w-full bg-[#030409] border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-purple-500 resize-none text-right"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleSendBroadcast}
                    disabled={isBroadcasting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold py-2.5 rounded-xl text-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isBroadcasting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-300 shrink-0" />
                        <span>{lang === 'ar' ? "جاري تعبيد القنوات وبث الرسالة..." : "Broadcasting dynamic packages..."}</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-purple-350 shrink-0 animate-pulse" />
                        <span>{lang === 'ar' ? "بث الإشعار اللاسلكي الفوري" : "Dispatch WhatsApp Broadcast"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
          </div>
        )}

        {/* Tab 2: SaaS Step-by-Step Production Wizard Pipeline */}
        {activeTab === 'wizard' && (
          <div className="bg-[#0b0c16] rounded-3xl p-6 md:p-8 border-2 border-purple-500/10 shadow-2xl relative overflow-hidden animate-fade-in text-right">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.03)_0%,transparent_50%)] pointer-events-none" />
            
            {/* Steps Tracking Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8 max-w-xl mx-auto">
              <div 
                onClick={() => { playLaserBeep('click'); setWizardStep(1); }}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs cursor-pointer border ${wizardStep >= 1 ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-slate-850 text-slate-500'}`}
              >
                1
              </div>
              <div className={`h-[2px] flex-1 ${wizardStep >= 2 ? 'bg-purple-600' : 'bg-slate-800'}`}></div>
              <div 
                onClick={() => { playLaserBeep('click'); if(wizardData.clientName) setWizardStep(2); }}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs cursor-pointer border ${wizardStep >= 2 ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-slate-850 text-slate-500'}`}
              >
                2
              </div>
              <div className={`h-[2px] flex-1 ${wizardStep >= 3 ? 'bg-purple-600' : 'bg-slate-800'}`}></div>
              <div 
                onClick={() => { playLaserBeep('click'); if(wizardData.clientName) setWizardStep(3); }}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs cursor-pointer border ${wizardStep >= 3 ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-slate-850 text-slate-500'}`}
              >
                3
              </div>
            </div>

            {/* STEP 1: Basic Information Parameters */}
            {wizardStep === 1 && (
              <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-right">
                <h3 className="text-sm font-black text-purple-400 border-b border-[#1b1c31] pb-3">📦 {t('wizard_step_1')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{t('client_name')}</label>
                    <input 
                      type="text"
                      required
                      placeholder="مثال: هايبرماركت آل ذيبان - فرع المكلا"
                      value={wizardData.clientName}
                      onChange={(e) => setWizardData({ ...wizardData, clientName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{t('client_phone')}</label>
                    <input 
                      type="text"
                      required
                      placeholder="770000000"
                      value={wizardData.clientPhone}
                      onChange={(e) => setWizardData({ ...wizardData, clientPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-mono text-left"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{t('role_selector')}</label>
                    <select 
                      value={wizardData.role}
                      onChange={(e) => setWizardData({ ...wizardData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-bold appearance-none"
                    >
                      <option value="مالك متجر">{lang === 'ar' ? "مالك متجر مستقل" : "Independent Tenant Owner"}</option>
                      <option value="مشرف">{lang === 'ar' ? "مشرف مستودعات المبيعات" : "Supervisor"}</option>
                      <option value="موظف">{lang === 'ar' ? "موظف مبيعات ونقطة بيع" : "Employee Cashier"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{t('select_default_lang')}</label>
                    <select 
                      value={wizardData.defaultLang}
                      onChange={(e) => setWizardData({ ...wizardData, defaultLang: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-bold appearance-none"
                    >
                      <option value="ar">{lang === 'ar' ? "العربية الفصحى (AR)" : "Arabic Layout"}</option>
                      <option value="en">{lang === 'ar' ? "English (EN)" : "English Layout"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "العملة الرئيسية للفرع المولد" : "Branch Native Currency Reference"}</label>
                    <select 
                      value={wizardData.currency}
                      onChange={(e) => setWizardData({ ...wizardData, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-purple-400 outline-none focus:border-purple-500 font-black appearance-none"
                    >
                      {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "معدل تحويل الصرف لـ 1 ريال يمني" : "Custom Conversion factor for 1 YER"}</label>
                    <input 
                      type="number"
                      value={wizardData.customExchangeRate}
                      onChange={(e) => setWizardData({ ...wizardData, customExchangeRate: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-mono text-left"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "تاريخ انتهاء الترخيص والاشتراك" : "License Expiration Date"}</label>
                    <input 
                      type="date"
                      value={wizardData.expiryDate}
                      onChange={(e) => setWizardData({ ...wizardData, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">{t('custom_domain')}</label>
                    <input 
                      type="text"
                      placeholder="dhibani-branch-ten.com"
                      value={wizardData.customDomain}
                      onChange={(e) => setWizardData({ ...wizardData, customDomain: e.target.value })}
                      className="w-full px-4 py-3 bg-[#030409] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-purple-500 font-mono text-left"
                    />
                  </div>

                </div>

                <div className="pt-6 flex justify-end border-t border-[#1b1c31]">
                  <button 
                    onClick={() => {
                      if (!wizardData.clientName.trim() || !wizardData.clientPhone.trim()) {
                        addToast(lang === 'ar' ? "يرجى ملء البيانات المطلوبة للمشروع!" : "Fields marked with (*) are mandatory!", "error");
                        return;
                      }
                      setWizardStep(2);
                      playLaserBeep('click');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    <span>{lang === 'ar' ? "الاستمرار لتفعيل ميزات الفرع" : "Proceed to Feature Matrix"}</span>
                    <ArrowRight className="w-4 h-4 turn-on-rtl shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Feature Matrix Activation and API connections */}
            {wizardStep === 2 && (
              <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-right">
                <h3 className="text-sm font-black text-purple-400 border-b border-[#1b1c31] pb-3">🔌 {t('wizard_step_2')}</h3>

                {/* Grid of features togglers */}
                <div className="space-y-4 bg-[#060710] p-5 rounded-2xl border border-slate-900">
                  
                  {/* Feature 1: Gaming */}
                  <div className="space-y-3 pb-3 border-b border-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-200 block">{t('enable_gaming')}</span>
                        <span className="text-[10px] text-slate-400">{lang === 'ar' ? "تنشيط شحن الجواهر والشدات وربط API التلقائي لمخزن لايكارد" : "Activate Game diamonds top-ups synced to LikeCard APIs"}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={wizardData.featGaming}
                        onChange={(e) => setWizardData({ ...wizardData, featGaming: e.target.checked })}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </div>
                    {wizardData.featGaming && (
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-in">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">Base API Route URL</label>
                          <input 
                            type="text" 
                            value={wizardData.gamingApiUrl}
                            onChange={(e) => setWizardData({ ...wizardData, gamingApiUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-left"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">Secret Access API Key</label>
                          <input 
                            type="password"
                            placeholder="LikeCard Client Secret Key"
                            value={wizardData.gamingApiKey}
                            onChange={(e) => setWizardData({ ...wizardData, gamingApiKey: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-center"
                          />
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                          <button 
                            onClick={() => testFeatureApi('gaming')}
                            disabled={apiTestingStatus['gaming'] === 'testing'}
                            className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            {apiTestingStatus['gaming'] === 'testing' ? (lang === 'ar' ? "جاري التأمين..." : "Asserting...") : t('test_api_btn')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature 2: SMS API Codes */}
                  <div className="space-y-3 pb-3 border-b border-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-200 block">{t('enable_api')}</span>
                        <span className="text-[10px] text-slate-400">{lang === 'ar' ? "شحن باقات اتصالات يمن موبايل وسبأفون والرسائل النصية" : "In-app code dispenser linked to YemenMobile SMS gateway"}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={wizardData.featAPI}
                        onChange={(e) => setWizardData({ ...wizardData, featAPI: e.target.checked })}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </div>
                    {wizardData.featAPI && (
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-in">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">SMS Gateway URL Reference</label>
                          <input 
                            type="text" 
                            value={wizardData.smsGatewayUrl}
                            onChange={(e) => setWizardData({ ...wizardData, smsGatewayUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-left"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">Gateway Verification Token</label>
                          <input 
                            type="password"
                            placeholder="System token key"
                            value={wizardData.smsToken}
                            onChange={(e) => setWizardData({ ...wizardData, smsToken: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-center"
                          />
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                          <button 
                            onClick={() => testFeatureApi('sms')}
                            disabled={apiTestingStatus['sms'] === 'testing'}
                            className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[9px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            {apiTestingStatus['sms'] === 'testing' ? (lang === 'ar' ? "جاري التأمين..." : "Asserting...") : t('test_api_btn')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature 3: Warehouses */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <div>
                      <span className="text-xs font-black text-slate-200 block">{t('enable_branches')}</span>
                      <span className="text-[10px] text-slate-400">{lang === 'ar' ? "منظومة مزامنة جرد وتوزيع فروع آل ذيبان وتعدد المنافذ" : "Enable Multi-branch database inventory syncing algorithms"}</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={wizardData.featBranches}
                      onChange={(e) => setWizardData({ ...wizardData, featBranches: e.target.checked })}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Feature 4: Grocery */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <div>
                      <span className="text-xs font-black text-slate-200 block">{t('enable_grocery')}</span>
                      <span className="text-[10px] text-slate-400">{lang === 'ar' ? "سلة التموين الغذائي والمواد الأساسية وبهارات الذيباني" : "Food supply basket, weights calculations & spice recipes tools"}</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={wizardData.featGrocery}
                      onChange={(e) => setWizardData({ ...wizardData, featGrocery: e.target.checked })}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Feature 5: Prescription Medicine */}
                  <div className="space-y-3 pb-3 border-b border-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-200 block">{t('enable_prescription')}</span>
                        <span className="text-[10px] text-slate-400">{lang === 'ar' ? "تأكيد الروشتات الطبية ذكياً وصحياً من مخدم الصيدليات" : "Verify Medical Rx scientific prescriptions automatically via Pharmacy core"}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={wizardData.featPrescription}
                        onChange={(e) => setWizardData({ ...wizardData, featPrescription: e.target.checked })}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </div>
                    {wizardData.featPrescription && (
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-purple-500/20 grid grid-cols-1 gap-4 animate-slide-in">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">Ministry of Health Authorized Dr/Pharma ID Code</label>
                          <input 
                            type="text" 
                            value={wizardData.prescriptionDoctorId}
                            onChange={(e) => setWizardData({ ...wizardData, prescriptionDoctorId: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-left"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature 6: Consulting Platform */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-200 block">{t('enable_consulting')}</span>
                        <span className="text-[10px] text-slate-400">{lang === 'ar' ? "استشارات قضائية وحجز تذاكر تمثيل المحاماة وصياغة العقود" : "Booking consultation calendars, generating legal files & tickets"}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={wizardData.featConsulting}
                        onChange={(e) => setWizardData({ ...wizardData, featConsulting: e.target.checked })}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </div>
                    {wizardData.featConsulting && (
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-purple-500/20 grid grid-cols-1 gap-4 animate-slide-in">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold block">Assigned Licensing Legal Agent Reference ID</label>
                          <input 
                            type="text" 
                            value={wizardData.consultingAgentId}
                            onChange={(e) => setWizardData({ ...wizardData, consultingAgentId: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono text-left"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Intelligent Margin and Math Exchange rates normalizer panel */}
                <div className="bg-purple-950/10 border border-purple-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-400 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>{t('smart_markup_title')}</span>
                    </span>
                    <input 
                      type="checkbox"
                      checked={wizardData.smartMarkupEnabled}
                      onChange={(e) => setWizardData({ ...wizardData, smartMarkupEnabled: e.target.checked })}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {wizardData.smartMarkupEnabled && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>{lang === 'ar' ? "نسبة هامش الربح المعتمدة بالعملة المستهدفة:" : "Profit margin markup ratio:"}</span>
                        <span className="text-white font-mono font-bold">{wizardData.markupPercent}%</span>
                      </div>
                      <input 
                        type="range"
                        min="2"
                        max="35"
                        step="1"
                        value={wizardData.markupPercent}
                        onChange={(e) => setWizardData({ ...wizardData, markupPercent: e.target.value })}
                        className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                      />
                      <p className="text-[9px] text-slate-500 leading-normal">
                        {lang === 'ar'
                          ? "* يحسب النظام برمجياً قيمة الصنف في جدول أسعار العملات ويضيف هامش الربح تلقائياً عند طلب السلة لضمان عدم وجود رصيد معلق أو خسارة الصرف."
                          : "* Dynamically normalizes global wholesale prices, auto-marking target customer prices on checkout loops to secure exchange stability."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between border-t border-[#1b1c31]">
                  <button 
                    onClick={() => { setWizardStep(1); playLaserBeep('click'); }}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 font-black px-5 py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    {lang === 'ar' ? "السابق" : "Go Back"}
                  </button>
                  <button 
                    onClick={() => { setWizardStep(3); playLaserBeep('click'); }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    <span>{lang === 'ar' ? "الاستمرار لمحطة الإقلاع السحابي" : "Lift-off Deploy Room"}</span>
                    <ArrowRight className="w-4 h-4 turn-on-rtl shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Lift-off Node Webhook Compile stream */}
            {wizardStep === 3 && (
              <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-right">
                <h3 className="text-sm font-black text-purple-400 border-b border-[#1b1c31] pb-3">🚀 {t('wizard_step_3')}</h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar' 
                    ? "الكبسة على زر الإعمار بالأسفل ستدفع بالـ AI لتكوين السيرفر المولد مع الشارات وميزات الحرق المعقودة بمخدمات نيتليفاي سحابياً في أقل من دقيقة:"
                    : "Executing the launcher below injects custom system variables, triggering clean Netlify webhook compilation hooks dynamically to host the tenant storefront secure edge:"}
                </p>

                {/* Green Glowing Interactive Terminal Box */}
                <div className="bg-[#020206] border-2 border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.02)] relative">
                  <div className="absolute top-2 right-4 flex gap-1">
                    <span className="w-2.5 h-2.5 bg-red-500/50 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-500/50 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-emerald-500/50 rounded-full" />
                  </div>
                  
                  <div className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-900 pb-2 mb-3">
                    {t('terminal_logs_title')}
                  </div>

                  <div className="bg-transparent font-mono text-[10px] text-emerald-400 space-y-2 h-56 overflow-y-auto w-full text-left scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-slate-950" dir="ltr">
                    <div>&gt; Absolute System Pipeline Idle... Awake signal detected.</div>
                    {wizardConsoleLogs.map((log, idx) => (
                      <div key={idx} className="animate-slide-in leading-relaxed">&gt; {log}</div>
                    ))}
                    {isGenerating && (
                      <div className="text-emerald-300 font-bold animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                        <span>Compiling project bundle assets dynamically... Please hold...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-[#1b1c31]">
                  <button 
                    onClick={() => { setWizardStep(2); playLaserBeep('click'); }}
                    disabled={isGenerating}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {lang === 'ar' ? "السابق" : "Go Back"}
                  </button>

                  {!isGenerating && generatedSiteUrl ? (
                    <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-2xl text-right animate-slide-in w-full sm:w-auto">
                      <span className="text-[9px] text-slate-400 font-bold block mb-1">{lang === 'ar' ? "تم إطلاق وتفعيل متجرك المشترك بسلام!:" : "SaaS Spawn Successful! Launch subdomain link below:"}</span>
                      <a 
                        href={generatedSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-purple-400 hover:text-white underline font-mono tracking-wide flex items-center gap-1.5"
                      >
                        <span>{generatedSiteUrl}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <button 
                      onClick={executeSaaSGeneration}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Play className="w-4 h-4 shrink-0 fill-slate-950" />
                      <span>{t('generate_btn')}</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* Tab 3: Dynamic Multi-Currency Normalizations Matrix */}
        {activeTab === 'currencies' && (
          <div className="bg-[#0b0c16] rounded-3xl p-6 border border-purple-500/10 shadow-xl animate-fade-in text-right max-w-3xl mx-auto space-y-6">
            
            <div className="border-b border-[#1b1c31] pb-3 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-200">{t('add_new_currency')}</h3>
              <Coins className="w-5 h-5 text-purple-400" />
            </div>

            {/* Currency adder form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#060710] p-4 rounded-2xl border border-slate-900">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "رمز العملة (مثل AED):" : "Currency Code (e.g., AED):"}</label>
                <input 
                  type="text"
                  placeholder="AED"
                  value={newCurrCode}
                  onChange={(e) => setNewCurrCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none uppercase font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">{lang === 'ar' ? "شعار العملة الرمزى:" : "Currency Visual Symbol:"}</label>
                <input 
                  type="text"
                  placeholder="DH"
                  value={newCurrSymbol}
                  onChange={(e) => setNewCurrSymbol(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">{t('currency_rate_placeholder')}:</label>
                <input 
                  type="number"
                  placeholder="144"
                  value={newCurrRate}
                  onChange={(e) => setNewCurrRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 outline-none font-mono text-left"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end pt-2">
                <button 
                  onClick={handleAddCurrency}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black px-5 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1 shadow-lg shadow-purple-500/10"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>{lang === 'ar' ? "إضافة عملة جديدة" : "Add Currency Code"}</span>
                </button>
              </div>
            </div>

            {/* Currencies active list */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-slate-300">{lang === 'ar' ? "قائمة أسعار الصرف المتفاعلة حالياً بالسستم:" : "Current Active system Normalization rates:"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currencies.map(c => (
                  <div key={c.code} className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white">{c.code} ({c.symbol})</span>
                      <p className="text-[10px] text-slate-500 mt-1">{lang === 'ar' ? `يعادل مقابل الـ YER:` : `Equivalent YER conversion:`} {c.rate} YER</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => deleteCurrency(c.code)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg cursor-pointer transition-colors"
                        title={lang === 'ar' ? "حذف" : "purge"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
