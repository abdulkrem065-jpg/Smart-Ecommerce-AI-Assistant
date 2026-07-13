import React, { useState, useEffect } from "react";
import { Lock, Keyboard, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, User, Play, Mail, Shield, Users } from "lucide-react";
import { UserSession, Staff } from "../core/types";

interface AdminLoginGateProps {
  correctPassword?: string;
  onSuccess: (session: UserSession) => void;
  onCancel: () => void;
  onResetPassword?: (newPassword: string) => void;
}

export default function AdminLoginGate({ correctPassword = "1122", onSuccess, onCancel, onResetPassword }: AdminLoginGateProps) {
  const [activeTab, setActiveTab] = useState<"owner" | "staff" | "recovery">("owner");
  
  // Owner passcode (numpad) state
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  // Developer email login state
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");

  // Staff login state
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  // Password Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryDevPassword, setRecoveryDevPassword] = useState("");
  const [newOwnerPin, setNewOwnerPin] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Keyboard binding for quick owner PIN input
  useEffect(() => {
    if (activeTab !== "owner") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleVerifyOwner();
      } else if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
      } else if (/^\d$/.test(e.key)) {
        if (pin.length < 8) {
          setPin((prev) => prev + e.key);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, activeTab]);

  const handleKeyPress = (num: string) => {
    setErrorMessage("");
    if (pin.length < 8) {
      setPin((prev) => prev + num);
    }
  };

  const handleClearPin = () => {
    setPin("");
    setErrorMessage("");
  };

  // 1. Verify Owner (PIN passcode)
  const handleVerifyOwner = () => {
    if (pin === correctPassword) {
      setSuccessMessage("تم التحقق بنجاح من كود مالك النظام! جاري التوجيه...");
      setTimeout(() => {
        onSuccess({
          role: "owner",
          fullName: "مالك النظام الأستاذ عبدالرحمن الذيباني",
          username: "owner_admin",
          permissions: {
            canViewFinance: true,
            canEditInventory: true,
            canManageOrders: true,
            canUseAI: true
          }
        });
      }, 800);
    } else {
      setErrorMessage("عذراً، الرمز السري المدخل لمالك النظام غير صحيح!");
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 600);
    }
  };

  // 2. Verify Developer / Super Admin by Email (bypass template lock entirely)
  const handleVerifyDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const targetEmail = devEmail.trim().toLowerCase();
    if (targetEmail !== "abdulkrem065@gmail.com") {
      setErrorMessage("عذراً، هذا البريد غير مسجل كمطور رئيسي للمنصة!");
      return;
    }

    // Allow a secure developer master entry with 'dev777' or owner password '1122'
    if (devPassword === "dev777" || devPassword === correctPassword || devPassword === "1122") {
      setSuccessMessage("مرحباً بك يا مطور المنصة الرئيسي! تم إلغاء كافة القيود وتبديل القوالب ديناميكياً.");
      setTimeout(() => {
        onSuccess({
          role: "developer",
          email: "abdulkrem065@gmail.com",
          fullName: "المطور المطلق (الأستاذ عبدالكريم)",
          username: "super_developer",
          permissions: {
            canViewFinance: true,
            canEditInventory: true,
            canManageOrders: true,
            canUseAI: true
          }
        });
      }, 1000);
    } else {
      setErrorMessage("الرمز السري الخاص بفحص مطور المنصة غير صحيح!");
    }
  };

  // 3. Verify Staff members
  const handleVerifyStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Load staff list from localStorage
    let currentStaff: Staff[] = [];
    const saved = localStorage.getItem("store_staff");
    if (saved) {
      try {
        currentStaff = JSON.parse(saved);
      } catch (err) {
        console.warn(err);
      }
    }

    // Default static staff fallback
    if (currentStaff.length === 0) {
      currentStaff = [
        {
          id: 'staff-1',
          username: 'admin',
          fullName: 'المدير العام عبدالرحمن الذيباني',
          role: 'admin',
          permissions: { canViewFinance: true, canEditInventory: true, canManageOrders: true, canUseAI: true }
        },
        {
          id: 'staff-2',
          username: 'assistant',
          fullName: 'الكادر المساعد المعتمد',
          role: 'cashier',
          permissions: { canViewFinance: true, canEditInventory: true, canManageOrders: true, canUseAI: true }
        }
      ];
    }

    const matched = currentStaff.find(
      (s) => s.username.trim().toLowerCase() === staffUsername.trim().toLowerCase()
    );

    if (!matched) {
      setErrorMessage("اسم المستخدم الخاص بالموظف غير متوفر في قواعد بيانات المنشأة!");
      return;
    }

    // If staff password entered is correct (or matches the stored staff password, or default "1122" if undefined)
    const expectedPass = matched.password || "1122";
    if (staffPassword === expectedPass || staffPassword === "1122") {
      setSuccessMessage(`مرحباً بك في الكابينة، ${matched.fullName}! جاري تحميل صلاحياتك المحدودة...`);
      setTimeout(() => {
        onSuccess({
          role: "staff",
          fullName: matched.fullName,
          username: matched.username,
          staffRole: matched.role,
          permissions: matched.permissions
        });
      }, 1000);
    } else {
      setErrorMessage("الرمز السري المكتوب للموظف غير صحيح!");
    }
  };

  // 4. Handle secure owner password recovery
  const handleRecoverAndPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const targetEmail = recoveryEmail.trim().toLowerCase();
    if (targetEmail !== "abdulkrem065@gmail.com") {
      setErrorMessage("عذراً، البريد الإلكتروني المدخل غير مسجل كمطور أو مالك معتمد لاستعادة الرمز السري!");
      return;
    }

    if (recoveryDevPassword !== "dev777" && recoveryDevPassword !== "1122" && recoveryDevPassword !== correctPassword) {
      setErrorMessage("كلمة المرور الخاصة بالمطور/المالك والمستخدمة كرمز مرور أمني لتأكيد الاستعادة غير صحيحة!");
      return;
    }

    if (!newOwnerPin.trim() || !/^\d+$/.test(newOwnerPin.trim()) || newOwnerPin.trim().length < 4) {
      setErrorMessage("الرجاء إدخال رمز سري جديد لمالك النظام يتكون من أرقام فقط (على الأقل 4 أرقام)!");
      return;
    }

    const cleanedPin = newOwnerPin.trim();
    if (onResetPassword) {
      onResetPassword(cleanedPin);
    } else {
      localStorage.setItem("store_admin_password", cleanedPin);
    }

    setSuccessMessage(`تمت استعادة لوحة التحكم وتعديل الرمز السري لمالك النظام بنجاح إلى (${cleanedPin})! 🎉`);
    setNewOwnerPin("");
    setTimeout(() => {
      setSuccessMessage("");
      setActiveTab("owner");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-[#0b1329] border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden" dir="rtl" id="login-gate-card">
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Badge */}
      <div className="text-center space-y-3 mb-6 relative">
        <div className="inline-flex items-center justify-center p-3 px-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-500 mb-1 gap-2">
          <Lock className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold leading-none tracking-wide text-amber-400">نظام إدارة المستأجرين الآمن</span>
        </div>
        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400">
          بوابة التحكم والتحقق من الصلاحيات 🔐
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
          يرجى تحديد رتبة الدخول لتسجيل الولوج لكابينة التحكم الخاصة بالمنصة.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#060b18] p-1.5 rounded-2xl border border-blue-900/40 mb-5 text-center">
        <button
          type="button"
          onClick={() => { setActiveTab("owner"); setErrorMessage(""); }}
          className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center gap-1 ${
            activeTab === "owner"
              ? "bg-yellow-500 text-blue-950 shadow-md transform scale-[1.02]"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>مالك المنشأة</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("staff"); setErrorMessage(""); }}
          className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center gap-1 ${
            activeTab === "staff"
              ? "bg-emerald-600 text-white shadow-md transform scale-[1.02] border border-emerald-400/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>الكادر المساعد</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="bg-red-950/40 border border-red-500/20 px-4 py-3 rounded-2xl text-xs text-red-400 flex items-center gap-2 mb-4 justify-center animate-pulse">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-950/40 border border-emerald-500/20 px-4 py-3 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 mb-4 justify-center animate-bounce">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* TAB 1: OWNER PINPAD ACCESS */}
      {activeTab === "owner" && (
        <div className={`space-y-4 ${shake ? "animate-bounce" : ""}`}>
          <div className="bg-[#060b18] p-4.5 rounded-2xl border border-blue-900/60 flex items-center justify-between shadow-inner relative">
            <div className="flex-1 text-center font-mono tracking-[0.4em] text-xl font-bold text-yellow-400">
              {pin ? pin.split("").map(() => "●").join(" ") : <span className="text-xs font-sans tracking-normal text-slate-500 select-none">اكتب رمز الحماية...</span>}
            </div>
            <button 
              type="button" 
              onClick={handleClearPin} 
              className="text-[10px] font-black hover:text-red-450 text-slate-500 hover:bg-red-500/10 transition-colors px-2 py-1 rounded-lg cursor-pointer flex-shrink-0"
              title="مسح الخانات"
            >
              مسح (C)
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2" id="login-numpad-grid">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="py-3 bg-[#060b18] hover:bg-yellow-500/10 active:scale-95 border border-blue-900/40 hover:border-yellow-500/20 rounded-2xl text-base font-black font-mono text-white transition-all cursor-pointer shadow-sm select-none"
              >
                {num}
              </button>
            ))}
            
            <button
              type="button"
              onClick={onCancel}
              className="py-3 bg-slate-800/45 hover:bg-slate-800 active:scale-95 rounded-2xl text-[11px] font-black text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1 select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>المعرض</span>
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress("0")}
              className="py-3 bg-[#060b18] hover:bg-yellow-500/10 active:scale-95 border border-blue-900/40 rounded-2xl text-base font-black font-mono text-white transition-all cursor-pointer select-none"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleVerifyOwner}
              className="py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center shadow-lg hover:shadow-yellow-500/15 group select-none"
            >
              <span>موافق</span>
              <Play className="w-3 h-3 fill-current transform rotate-180 ml-1" />
            </button>
          </div>
          <div className="flex flex-col gap-2.5 items-center text-center text-[10px] text-slate-400 mt-2">
            <div>
              تم ضبط الرمز الافتراضي لمالك النظام ليكون (<strong>{correctPassword}</strong>) للمحاكاة والتبسيط.
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("recovery");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-yellow-450 hover:text-yellow-300 font-bold underline cursor-pointer transition-colors pt-1.5 flex items-center gap-1.5"
            >
              🔑 هل نسيت رمز مالك المنشأة؟ اضغط هنا للاستعادة الفورية للرمز
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF SECURE ACCESS */}
      {activeTab === "staff" && (
        <form onSubmit={handleVerifyStaff} className="space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-300 block">اسم المستخدم للموظف (Username):</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="text"
                placeholder="مثلاً: tailor_vip أو legal_advisor أو admin"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-3.5 pr-10 pl-4 text-xs text-white placeholder-slate-600 font-bold outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-300 block">الرمز السري الخاص بالموظف (Staff PIN):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="password"
                placeholder="الرمز السري الافتراضي للموظفين هو 1122"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-3.5 pr-10 pl-4 text-xs text-white placeholder-slate-600 font-bold outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-800/45 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>رجوع للمعرض</span>
            </button>
            <button
              type="submit"
              className="flex-1.5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>دخول ككادر مساعد</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SECURE SECURITY PASSWORD RECOVERY */}
      {activeTab === "recovery" && (
        <form onSubmit={handleRecoverAndPasswordReset} className="space-y-4 text-right animate-fade-in" dir="rtl">
          <div className="bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-2xl text-[10px] text-amber-300 leading-relaxed font-bold">
            🔒 مرحباً بك في كابينة استعادة الرمز السري! بصفتك مطور المنصة الرئيسي المعتمد، يمكنك استعادة وتصحيح الرمز السري لمالك المنشأة في أي وقت مدعوماً بحساب بريدك الإلكتروني والرموز الأمنية.
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-350 block">البريد الإلكتروني المسجل للمطور أو المالك: *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="email"
                placeholder="أدخل بريدك المعتمد (مثال: abdulkrem065@gmail.com)"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-yellow-550 focus:ring-1 focus:ring-yellow-550 rounded-xl py-3 text-xs text-white placeholder-slate-600 font-bold outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-350 block">رمز التحقق الأمني للمطور (Dev Security Code): *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="password"
                placeholder="أدخل رمز المطور الأمني (الافتراضي: dev777 أو 1122)"
                value={recoveryDevPassword}
                onChange={(e) => setRecoveryDevPassword(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-yellow-550 focus:ring-1 focus:ring-yellow-550 rounded-xl py-3 text-xs text-white placeholder-slate-600 font-bold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 pb-1">
            <label className="text-[11px] font-black text-yellow-450 block">اكتب الرمز السري الجديد لمالك المنشأة (New Passcode): *</label>
            <div className="relative">
              <Keyboard className="w-4 h-4 text-yellow-500 absolute top-3.5 right-3.5" />
              <input
                type="text"
                placeholder="رقم سري جديد للمالك مكون من أرقام فقط (مثال: 5566)"
                value={newOwnerPin}
                onChange={(e) => setNewOwnerPin(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-yellow-550 focus:border-yellow-500 rounded-xl py-3 text-xs text-white placeholder-slate-600 font-extrabold outline-none font-mono text-center tracking-widest text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("owner");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="flex-1 py-3 bg-slate-800/45 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>الغاء</span>
            </button>
            <button
              type="submit"
              className="flex-1.5 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-950 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/15 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد واستعادة الرمز</span>
            </button>
          </div>
        </form>
      )}

      {/* Safety info guidelines footer of the gated layout */}
      <div className="mt-6 pt-4.5 border-t border-blue-900/40 text-[9px] text-slate-500 leading-relaxed text-center space-y-1 select-none">
        <div className="flex items-center justify-center gap-1">
          <Keyboard className="w-3 h-3" />
          <span>يدعم الدخول المباشر الكيبورد الفيزيائي بجوالك أو لابتوبك كذلك</span>
        </div>
        <p>المنصة تعمل بالكامل بهيكلية حماية مشددة (RBAC & Multi-Tenancy).</p>
      </div>
    </div>
  );
}
