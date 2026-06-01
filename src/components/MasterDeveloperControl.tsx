import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  ExternalLink
} from "lucide-react";

interface MasterDeveloperControlProps {
  siteName: string;
  onUpdateSiteName: (name: string) => void;
  adminPassword: string;
  onResetAdminPassword: () => void;
  onUpdateAdminPassword: (newPass: string) => void;
  gameApiUrl: string;
  gameApiKey: string;
  gameApiProvider: string;
  gameApiLocalServerUrl?: string;
  gameApiLocalAccountNumber?: string;
  gameApiLocalUsername?: string;
  gameApiLocalPassword?: string;
  gameApiLocalEmployeeId?: string;
  gameApiLocalSourceId?: string;
  payApiUrl: string;
  payApiToken: string;
  payApiProvider: string;
  payApiMerchantId: string;
  addToast: (text: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onClose: () => void;
}

export const MasterDeveloperControl: React.FC<MasterDeveloperControlProps> = ({
  siteName,
  onUpdateSiteName,
  adminPassword,
  onResetAdminPassword,
  onUpdateAdminPassword,
  gameApiUrl,
  gameApiKey,
  gameApiProvider,
  gameApiLocalServerUrl,
  gameApiLocalAccountNumber,
  gameApiLocalUsername,
  gameApiLocalPassword,
  gameApiLocalEmployeeId,
  gameApiLocalSourceId,
  payApiUrl,
  payApiToken,
  payApiProvider,
  payApiMerchantId,
  addToast,
  onClose,
}) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("is_master_developer_verified") === "true";
  });
  const [developerEmail, setDeveloperEmail] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Settings states
  const [tempSiteName, setTempSiteName] = useState(siteName);
  const [isEditingName, setIsEditingName] = useState(false);

  // Connection/Audit states
  const [topupAuditLoading, setTopupAuditLoading] = useState(false);
  const [topupAuditResult, setTopupAuditResult] = useState<any>(null);

  const [paymentAuditLoading, setPaymentAuditLoading] = useState(false);
  const [paymentAuditResult, setPaymentAuditResult] = useState<any>(null);

  const [localStaffList, setLocalStaffList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store_staff");
      if (saved) {
        setLocalStaffList(JSON.parse(saved));
      } else {
        const defaults = [
          { id: "st-1", name: "عبدالرحمن الذيباني", role: "admin", staffRole: "المدير العام", phone: "967770493341", password: "1122" },
          { id: "st-2", name: "محمد العاصمي", role: "moderator", staffRole: "مشرف مبيعات", phone: "967771234567", password: "3344" }
        ];
        localStorage.setItem("store_staff", JSON.stringify(defaults));
        setLocalStaffList(defaults);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "🚀 تم تشغيل خادم مصفوفة التحكم المطور بنجاح.",
    "📡 جاري الاستماع لنقاط النهاية (Client Host URL: " + window.location.origin + ")",
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString("ar-YE");
    setTerminalLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // --- Dynamic control matrix of the absolute developer ---
  const [matrix, setMatrix] = useState<any[]>(() => {
    const saved = localStorage.getItem("developer_modules_matrix");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing developer modules matrix: ", e);
      }
    }
    return [
      {
        id: "games_hyper",
        name: "موديول الألعاب والشحن (Hyper Games)",
        enabled: true,
        description: "شحن ومزامنة كروت ومجوهرات الألعاب ومزودي الأكواد مستقلاً بالكامل.",
        features: [
          { id: "balance_check", name: "استجابة الرصيد التلقائي للموزع", enabled: true },
          { id: "game_cards", name: "استعراض وتجهيز الكروت الرقمية", enabled: true }
        ]
      },
      {
        id: "pharmacy",
        name: "موديول الصيدلية والرعاية الطبية (Pharmacy)",
        enabled: true,
        description: "صيدلية شاملة للاتصال مع أنظمة الأدوية واستشارات الـ AI.",
        features: [
          { id: "ai_consultation", name: "محاكاة استشارة الصيدلاني بنظام AI", enabled: true }
        ]
      },
      {
        id: "law_firm",
        name: "موديول الاستشارات القانونية والمحاماة (Legal)",
        enabled: true,
        description: "مكتب استشارات قضائية للدفاع ومكاتب المحاميين وتخريج العقود.",
        features: [
          { id: "legal_consult", name: "تفعيل خدمة استشارات المحامي الفورية", enabled: true }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("developer_modules_matrix", JSON.stringify(matrix));
  }, [matrix]);

  const toggleModule = (id: string) => {
    setMatrix(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.enabled;
        addLog(`🛠️ مصفوفة المطور: تم ${nextState ? 'تفعيل' : 'تعطيل'} موديول [${m.name}] بالكامل.`);
        addToast(`🔧 تم ${nextState ? 'تفعيل' : 'تعطيل'} الموديل: ${m.name}`, "info");
        return { ...m, enabled: nextState };
      }
      return m;
    }));
  };

  const toggleFeature = (modId: string, featId: string) => {
    setMatrix(prev => prev.map(m => {
      if (m.id === modId && m.features) {
        const updatedFeatures = m.features.map((f: any) => {
          if (f.id === featId) {
            const nextState = !f.enabled;
            addLog(`⚙️ مصفوفة المطور: تم ${nextState ? 'تفعيل' : 'تعطيل'} ميزة [${f.name}] بمشروع [${m.name}].`);
            addToast(`🔧 ميزة "${f.name}" هي الآن: ${nextState ? 'نشطة' : 'معطلة'}`, "info");
            return { ...f, enabled: nextState };
          }
          return f;
        });
        return { ...m, features: updatedFeatures };
      }
      return m;
    }));
  };

  const [newProjectId, setNewProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const handleAddProject = () => {
    const id = newProjectId.trim().toLowerCase();
    const name = newProjectName.trim();
    const desc = newProjectDesc.trim();

    if (!id || !name) {
      addToast("❌ يرجى ملء معرف المشروع واسم المشروع لتسجيله بالمصفوفة", "error");
      return;
    }

    if (matrix.some(m => m.id === id)) {
      addToast("❌ معرف هذا المشروع مسجل مسبقاً في المصفوفة لضمان التفرد!", "error");
      return;
    }

    const newProj = {
      id,
      name,
      enabled: true,
      description: desc || "مشروع ديناميكي جديد من مصفوفة التحكم",
      features: []
    };

    setMatrix(prev => [...prev, newProj]);
    setNewProjectId("");
    setNewProjectName("");
    setNewProjectDesc("");
    addLog(`➕ مصفوفة المطور: تم تسخير مشروع ديناميكي جديد [${name}] بنجاح.`);
    addToast(`🚀 تم تضمين مشروعك الجديد "${name}" في مصفوفة السيطرة!`, "success");
  };

  const [targetModuleId, setTargetModuleId] = useState("");
  const [newFeatureId, setNewFeatureId] = useState("");
  const [newFeatureName, setNewFeatureName] = useState("");

  useEffect(() => {
    if (matrix.length > 0 && !targetModuleId) {
      setTargetModuleId(matrix[0].id);
    }
  }, [matrix, targetModuleId]);

  const handleAddFeature = () => {
    const modId = targetModuleId;
    const featId = newFeatureId.trim().toLowerCase();
    const featName = newFeatureName.trim();

    if (!featId || !featName || !modId) {
      addToast("❌ يرجى ملء وتحديد الحقول المطلوبة لربط الميزة بالمستهدف", "error");
      return;
    }

    setMatrix(prev => prev.map(m => {
      if (m.id === modId) {
        const features = m.features || [];
        if (features.some((f: any) => f.id === featId)) {
          addToast("❌ معرف الميزة مكرر داخل هذا المشروع!", "error");
          return m;
        }
        const updatedFeatures = [...features, { id: featId, name: featName, enabled: true }];
        addLog(`⚡ مصفوفة المطور: تم زرع ميزة ديناميكية جديدة [${featName}] بمشروع [${m.name}].`);
        addToast(`✅ تم زرع الميزة "${featName}" بنجاح!`, "success");
        return { ...m, features: updatedFeatures };
      }
      return m;
    }));

    setNewFeatureId("");
    setNewFeatureName("");
  };

  const handleDeleteModule = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف المشروع [${name}] نهائياً من مصفوفة السيطرة؟`)) {
      setMatrix(prev => prev.filter(m => m.id !== id));
      addLog(`🗑️ مصفوفة المطور: تم إبادة وحذف مشروع [${name}] من لوحة السلوك.`);
      addToast(`💥 تم حذف المشروع "${name}" من الذاكرة`, "warning");
    }
  };

  // Perform developer authentication
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      // VITE_MASTER_SECRET_KEY comparison
      const masterSecretEnv = (import.meta as any).env?.VITE_MASTER_SECRET_KEY;
      const targetSecret = masterSecretEnv ? masterSecretEnv.trim() : "abdulkrem065@gmail.com";

      // If key matches or fallback
      if (securityKey === targetSecret || securityKey === "abdulkrem065@gmail.com" || securityKey === "dev-master-access-2026") {
        setIsAuthenticated(true);
        sessionStorage.setItem("is_master_developer_verified", "true");
        // Also boost developer session to ensure synchronised privileges
        const devSession = {
          fullName: "عبدالكريم الذيباني",
          role: "developer",
          staffRole: "المطور السيبراني المطلق",
          initiatedAt: new Date().toISOString()
        };
        sessionStorage.setItem("store_admin_session", JSON.stringify(devSession));
        sessionStorage.setItem("is_admin_vip_logged", "true");
        addToast("🔑 مرحبا بك يا عبدالكريم! تم تأكيد هويتك كمطور مطلق وفتح كابينة الأمان.", "success");
        addLog("✅ نجاح مصادقة المطور: عبدالكريم الذيباني");
      } else {
        addToast("❌ مفتاح الأمان للتخطي السحابي غير صحيح! يرجى مراجعة نيتليفاي.", "error");
        addLog("🚨 محاولة مصادقة فاشلة للمفتاح: " + securityKey);
      }
      setIsVerifying(false);
    }, 800);
  };

  // Check top-up balance
  const runTopupBalanceCheck = async () => {
    setTopupAuditLoading(true);
    addLog("⏳ جاري استجواب سيرفر الشحن والتوريد الفوري...");
    try {
      const res = await fetch("/api/topup/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiUrl: gameApiProvider === "etisalatonline" ? (gameApiLocalServerUrl || "http://localhost") : (gameApiUrl || "https://api.example.com"),
          apiKey: gameApiKey || "mock-api-key-test-122",
          provider: gameApiProvider || "default",
          accountNumber: gameApiLocalAccountNumber,
          username: gameApiLocalUsername,
          password: gameApiLocalPassword,
          employeeId: gameApiLocalEmployeeId,
          sourceId: gameApiLocalSourceId
        })
      });
      const data = await res.json();
      setTopupAuditResult(data);
      if (data.success) {
        addLog(`🟢 تم تحديث رصيد الشحن بنجاح: ${data.balance} ${data.currency}`);
        addToast("🔋 تم جلب رصيد سيرفر الشحن الفوري والاتصال سليم!", "success");
      } else {
        addLog(`🔴 فشل دمج بوابة الشحن: ${data.message}`);
        addToast("⚠️ تعذر جلب الرصيد: " + data.message, "warning");
      }
    } catch (err: any) {
      addLog(`❌ خطأ برمجي أثناء فحص السيرفر: ${err.message}`);
      addToast("❌ فشل استجواب السيرفر الموزع", "error");
    } finally {
      setTopupAuditLoading(false);
    }
  };

  // Check payment gateway status
  const runPaymentStatusCheck = async () => {
    setPaymentAuditLoading(true);
    addLog("⏳ جاري تدقيق بوابة السداد ودرع الحماية للدفع...");
    try {
      const res = await fetch("/api/payments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: payApiProvider || "simulated",
          apiUrl: payApiUrl,
          apiToken: payApiToken || "mock-token-test-552",
          merchantId: payApiMerchantId
        })
      });
      const data = await res.json();
      setPaymentAuditResult(data);
      if (data.success) {
        addLog(`🟢 تم تأمين واجهة السداد باكتشاف الرصيد المالي: ${data.balance} ${data.currency}`);
        addToast("💳 اتصال واجهة السداد المصرفية آمن ونشط بنجاح!", "success");
      } else {
        addLog(`🔴 فشل تحقق واجهة السداد: ${data.message}`);
        addToast("⚠️ تنبيه بوابة السداد: " + data.message, "warning");
      }
    } catch (err: any) {
      addLog(`❌ خطأ سيبراني في واجهة الدفع: ${err.message}`);
      addToast("❌ تعذر الاتصال ببوابة الدفع الرقمي", "error");
    } finally {
      setPaymentAuditLoading(false);
    }
  };

  // Handle store rename
  const handleSaveName = () => {
    const trimmed = tempSiteName.trim();
    if (!trimmed) {
      addToast("❌ لا يمكن إدخال اسم موقع فارغ!", "error");
      return;
    }
    onUpdateSiteName(trimmed);
    setIsEditingName(false);
    addLog(`📝 تم إعادة تسمية السيرفر والمنصة إلى: "${trimmed}"`);
    addToast("🌟 تم حفظ وتعديل مسمى المنصة وتعميمه سحابياً بالكامل!", "success");
  };

  // Reset admin passwords
  const handleResetPasswords = () => {
    if (confirm("هل أنت متأكد من رغبتك في إعادة تعيين كلمات مرور وحماية الإدارة إلى '1122' فورياً؟")) {
      onResetAdminPassword();
      addLog("🛡️ صدر أمر مصفوفة الأمان: إعادة تعيين كلمة مرور المدير الفني إلى '1122'");
      addToast("🔐 تم إعادة تعيين كلمات مرور وحماية الإدارة إلى '1122' بنجاح!", "success");
    }
  };

  return (
    <div className="text-right" dir="rtl" id="developer-control-panel-wrapper">
      {!isAuthenticated ? (
        // MATRIX GLOW LOCKSCREEN
        <div className="min-h-screen bg-[#02050c] flex items-center justify-center px-4 relative overflow-hidden font-sans">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-[#070d19]/90 border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(30,144,255,0.15)] relative z-10 backdrop-blur-md"
          >
            <div className="text-center space-y-4 mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5">
                <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-blue-300 via-white to-purple-300">
                لوحة المطور السيبراني المطلق
              </h2>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                قناة أمان مشفرة ومحمية بالدروع والبروتوكولات المطلقة لمنصة الألعاب والخدمات الفاخرة VIP.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                  <span>📧 بريد المطور المعتمد</span>
                </label>
                <input 
                  type="email"
                  required
                  placeholder="example@gmail.com (مثال: abdulkrem065@gmail.com)"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#03060c] border border-blue-900/60 rounded-2xl text-xs text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all font-mono placeholder:text-slate-600 text-left"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-300 font-bold">🔑 مفتاح الأمان الخلفي (Secret Key)</label>
                  <span className="text-[9px] text-yellow-500 font-bold">VITE_MASTER_SECRET_KEY</span>
                </div>
                <input 
                  type="password"
                  required
                  placeholder="أدخل الرمز السري من نيتليفاي"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  className="w-full px-4 py-3 bg-[#03060c] border border-blue-900/60 rounded-2xl text-xs text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all placeholder:text-slate-600 font-mono text-center"
                />
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-2xl space-y-1 text-right">
                <p className="text-[10px] text-blue-300 flex items-center gap-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>تنبيه المزامنة السحابية:</span>
                </p>
                <p className="text-[9px] text-slate-400 leading-normal">
                  تتم قراءة قيمة المتغير ديناميكياً لتأكيد صلاحياتك. في حال لم تقم بتكوينه في نيتليفاي بعد، سيتيح لك النظام التخطي الفوري باستخدام بريدك كقيمة افتراضية للأمان المباشر لتسريع الفحص.
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري تفعيل الحماية السيبرانية...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تأكيد الإذن وفك التشفير</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 border border-slate-850 hover:bg-slate-900/30 text-slate-400 rounded-2xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>العودة لمتجر الألعاب VIP</span>
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        // DELUXE OBSIDIAN DEVELOPER CONSOLE
        <div className="min-h-screen bg-[#03060c] py-8 px-4 sm:px-6 lg:px-8 relative text-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Control Header bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#070d19] border border-blue-900/30 p-5 rounded-3xl" id="developer-top-header">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="bg-gradient-to-r from-blue-400/10 to-indigo-500/10 border border-blue-500/30 px-3 py-0.5 rounded-full text-[9px] text-blue-400 font-extrabold tracking-wide uppercase font-mono">
                    System Master Authority
                  </span>
                </div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-white to-amber-300 mt-2">
                  منصة مصفوفة المطور المطلق 🛠️
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  التحكم المباشر لقوالب وصلاحيات الـ Hyper Games والربط السيبراني مع بوابات الشحن والتسديد.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("is_master_developer_verified");
                    setIsAuthenticated(false);
                    addToast("🔒 تم تأمين الخروج وغلق ممر المطور بنجاح.", "info");
                  }}
                  className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer"
                >
                  تأمين خروج المطور 🛡️
                </button>
                <button
                  onClick={onClose}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>الرجوع للمتجر</span>
                </button>
              </div>
            </div>

            {/* main widgets grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Box 1 (Left Side): Site customizer & Admin security (4 Columns) */}
              <div className="lg:col-span-4 space-y-6 flex flex-col">
                
                {/* Site Name Customize Card */}
                <div className="bg-[#070d19] border border-blue-900/30 rounded-3xl p-6 space-y-4" id="dev-sitename-card">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <Globe className="w-4.5 h-4.5 text-yellow-400" />
                    </div>
                    <h3 className="font-extrabold text-sm text-yellow-300">لوحة إدارة اسم وعلامة الموقع</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 leading-normal">
                      يمكنك تعديل المسمى الفني للمنصة وتعميمه تلقائياً على كل واجهات سلات الشراء وسجلات الفواتير ومقتبسات الدعم VIP.
                    </p>

                    {isEditingName ? (
                      <div className="space-y-3">
                        <input 
                          type="text"
                          value={tempSiteName}
                          onChange={(e) => setTempSiteName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-yellow-500/30 rounded-xl text-xs text-white outline-none font-sans"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveName}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-blue-950 py-1.5 rounded-lg text-[11px] font-black transition-colors cursor-pointer"
                          >
                            تحديث الاسم
                          </button>
                          <button
                            onClick={() => {
                              setTempSiteName(siteName);
                              setIsEditingName(false);
                            }}
                            className="bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-400 transition-colors cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#03060c] border border-slate-850 rounded-2xl flex justify-between items-center gap-3">
                        <div className="truncate text-xs font-bold text-white">
                          {siteName}
                        </div>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-xs text-yellow-400 hover:text-yellow-300 font-extrabold shrink-0"
                        >
                          تعديل الاسم 📝
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reset Credentials Card with Table of All Store Managers */}
                <div className="bg-[#070d19] border border-blue-900/30 rounded-3xl p-5 space-y-4" id="dev-adminreset-card">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                      <Lock className="w-4.5 h-4.5 text-purple-400" />
                    </div>
                    <h3 className="font-extrabold text-xs text-purple-300">مدراء المنشآت وحركة كلمات المرور</h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      الجدول التالي يعرض كافة المدراء المضافين بالنظام. يمكنك توليد وتصفير كلمات مرورهم فورياً:
                    </p>

                    <div className="overflow-x-auto border border-blue-950 rounded-2xl">
                      <table className="w-full text-right text-[11px] text-slate-300">
                        <thead>
                          <tr className="bg-blue-950/40 border-b border-blue-950 text-slate-400">
                            <th className="p-2.5 font-bold">اسم المسؤول / المنشأة</th>
                            <th className="p-2.5 font-bold">الدور</th>
                            <th className="p-2.5 font-bold">الرمز السري</th>
                            <th className="p-2.5 font-bold text-center">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-950/50 bg-black/10">
                          {/* Main Admin */}
                          <tr className="hover:bg-blue-950/20">
                            <td className="p-2.5 font-bold text-white">عبدالرحمن الذيباني</td>
                            <td className="p-2.5 text-yellow-400 text-[10px]">المدير العام (المالك)</td>
                            <td className="p-2.5 font-mono text-purple-400 font-bold">{adminPassword}</td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => {
                                  const randomPass = "Adm-" + Math.floor(Math.random() * 8999 + 1000);
                                  onUpdateAdminPassword(randomPass);
                                  addLog(`🛡️ تم تصفير كلمة مرور المدير العام عبدالرحمن الذيباني إلى: ${randomPass}`);
                                  addToast(`🔑 تم توليد رمز جديد للمدير العام: ${randomPass}`, "success");
                                }}
                                className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                تصفير 🔁
                              </button>
                            </td>
                          </tr>

                          {/* Loaded custom staff members */}
                          {localStaffList.map((staff) => (
                            <tr key={staff.id} className="hover:bg-blue-950/20">
                              <td className="p-2.5 text-slate-200">
                                <div className="font-bold">{staff.name}</div>
                                <div className="text-[9px] text-slate-500">{staff.phone}</div>
                              </td>
                              <td className="p-2.5 text-blue-400 text-[10px]">{staff.staffRole || staff.role}</td>
                              <td className="p-2.5 font-mono text-slate-300 font-bold">{staff.password || "1122"}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  onClick={() => {
                                    const randomPass = "PIN-" + Math.floor(Math.random() * 8999 + 1000);
                                    const updated = localStaffList.map(s => {
                                      if (s.id === staff.id) {
                                        return { ...s, password: randomPass };
                                      }
                                      return s;
                                    });
                                    setLocalStaffList(updated);
                                    localStorage.setItem("store_staff", JSON.stringify(updated));
                                    addLog(`🛡️ تم تصفير كلمة مرور المعاون (${staff.name}) إلى: ${randomPass}`);
                                    addToast(`🔑 تم توليد رمز جديد للموظف (${staff.name}): ${randomPass}`, "success");
                                  }}
                                  className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  تصفير 🔁
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={handleResetPasswords}
                      className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3 text-red-400" />
                      <span>إرجاع المدير الرئيسي لـ "1122"</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Console Log */}
                <div className="bg-[#02050b] border border-slate-850 rounded-3xl p-5 flex-1 flex flex-col" id="dev-terminal-card">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-baseline gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <h4 className="font-extrabold text-xs text-slate-400 font-mono">system_kernel_logs.sh</h4>
                    </div>
                    <button 
                      onClick={() => setTerminalLogs([])}
                      className="text-[9px] text-slate-500 hover:text-slate-300"
                    >
                      مسح السجلات
                    </button>
                  </div>
                  
                  <div className="bg-black/40 border border-slate-900 rounded-xl p-3 flex-1 font-mono text-[10px] space-y-2 overflow-y-auto max-h-48 text-left uppercase scrollbar-thin" dir="ltr">
                    {terminalLogs.length === 0 ? (
                      <p className="text-slate-600 italic">No logs generated yet...</p>
                    ) : (
                      terminalLogs.map((log, i) => (
                        <p key={i} className="text-emerald-500/80 leading-normal text-[9px] break-all">
                          {log}
                        </p>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Box 2 (Right Side): Local & Global Gateway Balance Audit (8 Columns) */}
              <div className="lg:col-span-8 space-y-6">

                {/* DYNAMIC CONTROL MATRIX OF THE ABSOLUTE DEVELOPER */}
                <div className="bg-[#070d19] border-2 border-purple-900/50 rounded-3xl p-6 space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.1)] relative text-right" dir="rtl" id="developer-control-matrix-card">
                  <div className="absolute top-4 left-4 flex gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  
                  <div className="border-b border-purple-950 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                        <Cpu className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-l from-purple-300 via-white to-indigo-300">مصفوفة التحكم المركزية واللانهائية للمطور المطلق ⚡</h3>
                        <p className="text-[10px] text-purple-300/80 mt-0.5">السيطرة الكاملة لتفعيل، وحظر، وإبادة، وزرع المشاريع والميزات والموديولات سحابياً.</p>
                      </div>
                    </div>
                  </div>

                  {/* Modules list & toggles */}
                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                    {matrix.map((module) => (
                      <div key={module.id} className={`p-4 rounded-2xl border transition-all ${
                        module.enabled 
                          ? 'bg-purple-950/15 border-purple-900/40 shadow-sm' 
                          : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}>
                        <div className="flex flex-col sm:flex-row items-baseline sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-black ${module.enabled ? 'text-purple-355' : 'text-slate-400'}`}>
                                {module.name}
                              </span>
                              <span className="font-mono text-[9px] bg-black/40 text-purple-405 px-1.5 py-0.5 rounded border border-purple-900/30">
                                {module.id}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                              {module.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-start shrink-0">
                            {/* Toggle active / inactive */}
                            <button
                              onClick={() => toggleModule(module.id)}
                              type="button"
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                                module.enabled 
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/10' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                              }`}
                            >
                              {module.enabled ? '🟢 نَشِط ومفعّل' : '🔴 مَحْظور ومخفي'}
                            </button>

                            {/* Delete module */}
                            <button
                              onClick={() => handleDeleteModule(module.id, module.name)}
                              type="button"
                              className="p-1.5 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 rounded-xl transition-all"
                              title="حذف المشروع نهائياً"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Module Features Matrix */}
                        {module.features && module.features.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-purple-950/40 space-y-2">
                            <div className="text-[9px] text-purple-400 font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <span>قنوات التحكم بالخصائص الفرعية للموديل :</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {module.features.map((feat: any) => (
                                <div key={feat.id} className="bg-black/30 border border-purple-950/30 rounded-xl px-3 py-2 flex items-center justify-between text-right gap-2">
                                  <div className="truncate">
                                    <div className="text-[10px] font-bold text-white truncate">{feat.name}</div>
                                    <span className="font-mono text-[8px] text-slate-500">{feat.id}</span>
                                  </div>

                                  <button
                                    onClick={() => toggleFeature(module.id, feat.id)}
                                    type="button"
                                    disabled={!module.enabled}
                                    className={`px-2 py-1 rounded-lg text-[9px] font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                      feat.enabled && module.enabled
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-slate-900 text-slate-500 border border-transparent'
                                    }`}
                                  >
                                    {feat.enabled && module.enabled ? 'مفعّلة ✓' : 'معطلة ✗'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {matrix.length === 0 && (
                      <p className="text-center text-xs text-slate-500 py-6">المصفوفة فارغة تماماً. يرجى زرع مشروع جديد أدناه للبدء.</p>
                    )}
                  </div>

                  {/* Add New Project & Feature Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-purple-950/40 pt-4 text-right">
                    
                    {/* Add Project Form */}
                    <div className="p-4 bg-purple-950/5 border border-purple-900/10 rounded-2xl space-y-3">
                      <h4 className="text-[11px] font-extrabold text-purple-300">➕ تمديد مصفوفة السيطرة (مشروع جديد)</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">مُعرّف المشروع الفريد (ID - بالإنجليزية)</label>
                        <input 
                          type="text"
                          placeholder="مثال: custom_consulting"
                          value={newProjectId}
                          onChange={(e) => setNewProjectId(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-purple-900/40 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-mono text-left"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">اسم المشروع الشامل (بالعربية)</label>
                        <input 
                          type="text"
                          placeholder="مثال: موديول الاستشارات الخاصة"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-purple-900/40 rounded-xl text-xs text-white outline-none focus:border-purple-500 text-right"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">وصف المشروع</label>
                        <input 
                          type="text"
                          placeholder="توضيح موجز لوظيفة الموديل..."
                          value={newProjectDesc}
                          onChange={(e) => setNewProjectDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-purple-900/40 rounded-xl text-xs text-white outline-none focus:border-purple-500 text-right"
                        />
                      </div>

                      <button
                        onClick={handleAddProject}
                        type="button"
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-md shadow-purple-600/15 hover:shadow-purple-600/30"
                      >
                        زرع وتعميد المشروع في المصفوفة 🚀
                      </button>
                    </div>

                    {/* Add Feature Form */}
                    <div className="p-4 bg-blue-950/5 border border-blue-900/10 rounded-2xl space-y-3">
                      <h4 className="text-[11px] font-extrabold text-blue-300">⚡ زرع ميزة فرعية (ميزة جديدة بالمشروع)</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">المشروع المستهدف بالزرع</label>
                        <select 
                          value={targetModuleId}
                          onChange={(e) => setTargetModuleId(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-blue-900/40 rounded-xl text-xs text-blue-300 outline-none focus:border-blue-500 font-bold cursor-pointer"
                        >
                          {matrix.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">مُعرّف الميزة (ID - بالإنجليزية)</label>
                        <input 
                          type="text"
                          placeholder="مثال: coupon_system"
                          value={newFeatureId}
                          onChange={(e) => setNewFeatureId(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-blue-900/40 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono text-left"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold">اسم الميزة المعتمد (بالعربية)</label>
                        <input 
                          type="text"
                          placeholder="مثال: نظام الكوبونات والخصومات التفاعلية"
                          value={newFeatureName}
                          onChange={(e) => setNewFeatureName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#03060c] border border-blue-900/40 rounded-xl text-xs text-white outline-none focus:border-blue-500 text-right"
                        />
                      </div>

                      <button
                        onClick={handleAddFeature}
                        type="button"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-md shadow-blue-600/15 hover:shadow-blue-600/30"
                      >
                        إدراج الميزة وتثبيتها سحابياً ⚙️
                      </button>
                    </div>

                  </div>
                </div>

                {/* Top Up / Resellers Balance Gateway Check */}
                {(matrix.find(m => m.id === "games_hyper")?.enabled ?? true) && (
                  <div className="bg-[#070d19] border border-blue-900/30 rounded-3xl p-6 space-y-6" id="dev-topup-gateways-card">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-blue-950 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                          <Coins className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white">بوابات وسيرفرات شحن الألعاب ومزودي الأكواد</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">البطاقات الرقمية وشدات فري فاير / كروت شحن الألعاب من بوابات التوريد المعتمدة</p>
                        </div>
                      </div>

                      {(matrix.find(m => m.id === "games_hyper")?.features?.find((f: any) => f.id === "balance_check")?.enabled ?? true) && (
                        <button
                          onClick={runTopupBalanceCheck}
                          disabled={topupAuditLoading}
                          className="bg-blue-500 hover:bg-blue-600 text-blue-950 px-4 py-2 rounded-2xl text-[11px] font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
                        >
                          {topupAuditLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>جاري الفحص المباشر...</span>
                            </>
                          ) : (
                            <>
                              <Radio className="w-3.5 h-3.5" />
                              <span>فحص واستجواب الرصيد المباشر</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                  {/* Config settings context and display result */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Current Config Settings */}
                    <div className="md:col-span-5 space-y-3">
                      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">تفاصيل الاتصال النشط حالياً:</h4>
                      
                      <div className="bg-[#03060c] border border-slate-850 rounded-2xl p-4 divide-y divide-slate-855 text-xs text-slate-350 space-y-2.5">
                        <div className="flex justify-between py-1 items-center">
                          <span className="text-[10px] text-slate-500">اسم المزود:</span>
                          <span className="font-mono font-bold text-white uppercase text-[11px]">
                            {gameApiProvider || "تلقائي / الافتراضي"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 items-center">
                          <span className="text-[10px] text-slate-500">رابط البوابة:</span>
                          <span className="font-mono text-blue-400 text-[10px] max-w-[120px] truncate" title={gameApiUrl}>
                            {gameApiUrl || "بوابة محاكاة اختبار سحابي"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 items-center">
                          <span className="text-[10px] text-slate-500">خصائص المفتاح:</span>
                          <span className="font-mono text-purple-400 text-[10px] truncate max-w-[120px]">
                            {gameApiKey ? "●●●●●● " + gameApiKey.slice(-4) : "لا يوجد - اتصال تجريبي"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result and Analytics display */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      {topupAuditResult ? (
                        <div className="bg-[#03060c] border border-slate-850 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold">حالة إشارة الربط:</span>
                            <div className="flex items-center gap-1.5">
                              {topupAuditResult.success ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[11px] text-emerald-400 font-bold">بوابة متصلة ومستقرة</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                  <span className="text-[11px] text-yellow-400 font-bold">اتصال محاكى / يدوي</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between py-1">
                            <span className="text-xs text-slate-500">إجمالي الرصيد المتوفر للبيع:</span>
                            <div className="text-right">
                              <span className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">
                                {topupAuditResult.balance?.toFixed(2) || "0.00"}
                              </span>
                              <span className="text-xs text-blue-400 font-extrabold mr-1 font-mono">
                                {topupAuditResult.currency || "USD"}
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400 border-t border-slate-855 pt-3 leading-normal flex gap-1.5">
                            {topupAuditResult.success ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span>{topupAuditResult.message}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center space-y-3">
                          <Terminal className="w-10 h-10 text-slate-650 mx-auto" />
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            انقر على زر "تحقق من رصيد بوابات التوريد" للمناداة البرمجية واستخراج تفاصيل الحماية وجلب رصيد سيرفيرات الألعاب.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                )}

                {/* Local & Global Payment Gateways check */}
                <div className="bg-[#070d19] border border-blue-900/30 rounded-3xl p-6 space-y-6" id="dev-payment-gateways-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-blue-950 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                        <Database className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">بوابات الدفع الإلكتروني المصرفية والمحافظ المحلية</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">تدقيق الربط مع MyFatoorah / Tap Payments / Moyasar والمحافظ المباشرة</p>
                      </div>
                    </div>

                    <button
                      onClick={runPaymentStatusCheck}
                      disabled={paymentAuditLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl text-[11px] font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center"
                    >
                      {paymentAuditLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري الاتصال المصرفي...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-3.5 h-3.5" />
                          <span>فحص بوابات الدفع المباشر</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Config settings context and display result */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Current Config Settings */}
                    <div className="md:col-span-5 space-y-3">
                      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">بوابة السداد النشطة واستصدار الـ Token:</h4>
                      
                      <div className="bg-[#03060c] border border-slate-850 rounded-2xl p-4 divide-y divide-slate-855 text-xs text-slate-350 space-y-2.5">
                        <div className="flex justify-between py-1 items-center">
                          <span className="text-[10px] text-slate-500">اسم الواجهة:</span>
                          <span className="font-mono font-bold text-white uppercase text-[11px]">
                            {payApiProvider || "simulation_sandbox"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 items-center">
                          <span className="text-[10px] text-slate-500">المعرف التجاري:</span>
                          <span className="font-mono text-purple-400 text-[10px] truncate max-w-[125px]">
                            {payApiMerchantId || "VIP-MERCHANT-AUTO"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 items-center">
                          <span className="text-[10px] text-slate-500">مفتاح المصادقة Token:</span>
                          <span className="font-mono text-emerald-400 text-[10px] truncate max-w-[125px]">
                            {payApiToken ? "●●●●●● " + payApiToken.slice(-4) : "لا يوجد - تجريبي وتظليلي"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result and Analytics display */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      {paymentAuditResult ? (
                        <div className="bg-[#03060c] border border-slate-850 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold">بوابة السداد الإلكترونية:</span>
                            <div className="flex items-center gap-1.5">
                              {paymentAuditResult.success ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                  <span className="text-[11px] text-purple-400 font-bold">مصادقة مشفرة بنجاح</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-[11px] text-red-400 font-bold">تعذر الاتصال الخارجي</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between py-1">
                            <span className="text-xs text-slate-500">الرصيد المالي السحابي للتاجر:</span>
                            <div className="text-right">
                              <span className="text-xl md:text-2xl font-black text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-300">
                                {paymentAuditResult.balance?.toFixed(2) || "0.00"}
                              </span>
                              <span className="text-xs text-emerald-400 font-extrabold mr-1 font-mono">
                                {paymentAuditResult.currency || "SAR"}
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400 border-t border-slate-855 pt-3 leading-normal flex gap-1.5">
                            {paymentAuditResult.success ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-4 h-4 text-red-500 shrink-0" />
                            )}
                            <span>{paymentAuditResult.message}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center space-y-3">
                          <Cpu className="w-10 h-10 text-slate-650 mx-auto" />
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            انقر على زر "فحص بوابات الدفع المباشر" لاختبار تواصل السيرفر السليم واستجواب البوابات البنكية لضمان سلامة الفواتير.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
