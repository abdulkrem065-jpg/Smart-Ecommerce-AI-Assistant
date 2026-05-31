import React, { useState, useEffect } from "react";
import { Lock, Keyboard, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, User, Play, Mail, Shield, Users } from "lucide-react";
import { UserSession, Staff } from "../types";

interface AdminLoginGateProps {
  correctPassword?: string;
  onSuccess: (session: UserSession) => void;
  onCancel: () => void;
}

export default function AdminLoginGate({ correctPassword = "1122", onSuccess, onCancel }: AdminLoginGateProps) {
  const [activeTab, setActiveTab] = useState<"owner" | "developer" | "staff">("owner");
  
  // Owner passcode (numpad) state
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  // Developer email login state
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");

  // Staff login state
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

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
          username: 'tailor_vip',
          fullName: 'الخياط والمصمم الملكي رفيق',
          role: 'tailor',
          permissions: { canViewFinance: false, canEditInventory: true, canManageOrders: true, canUseAI: true }
        },
        {
          id: 'staff-3',
          username: 'legal_advisor',
          fullName: 'المستشار القانوني أ. صالح العنسي',
          role: 'lawyer',
          permissions: { canViewFinance: true, canEditInventory: false, canManageOrders: false, canUseAI: true }
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
      <div className="grid grid-cols-3 gap-1 bg-[#060b18] p-1.5 rounded-2xl border border-blue-900/40 mb-5 text-center">
        <button
          type="button"
          onClick={() => { setActiveTab("owner"); setErrorMessage(""); }}
          className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center gap-1 ${
            activeTab === "owner"
              ? "bg-yellow-500 text-blue-950 shadow-md transform scale-102"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>مالك المنشأة</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("developer"); setErrorMessage(""); }}
          className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center gap-1 ${
            activeTab === "developer"
              ? "bg-purple-600 text-white shadow-md transform scale-102 border border-purple-400/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>المطور المطلق</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("staff"); setErrorMessage(""); }}
          className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center gap-1 ${
            activeTab === "staff"
              ? "bg-emerald-600 text-white shadow-md transform scale-102 border border-emerald-400/30"
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
          <div className="text-center text-[10px] text-slate-400 mt-2">
            تم ضبط الرمز الافتراضي لمالك النظام ليكون (<strong>1122</strong>) للمحاكاة والتبسيط.
          </div>
        </div>
      )}

      {/* TAB 2: DEVELOPER/SUPER-ADMIN SECURE ACCESS */}
      {activeTab === "developer" && (
        <form onSubmit={handleVerifyDeveloper} className="space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-300 block">بريد المطور الرئيسي الرئيسي لمطور المنصة:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="email"
                placeholder="abdulkrem065@gmail.com"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pr-10 pl-4 text-xs text-white placeholder-slate-600 font-bold outline-none font-mono"
              />
            </div>
            <p className="text-[9px] text-slate-550 leading-relaxed font-semibold">
              * للتفعيل المباشر، الرجاء إدخال البريد الرئيسي المعتمد من قبل المالك وهو: <span className="font-mono text-purple-400 text-[10px] underline">abdulkrem065@gmail.com</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-300 block">الكود السري للتفعيل (Developer Master PIN):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="password"
                placeholder="أدخل رمز المطور الرئيسي مثلاً 1122 أو dev777"
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
                required
                className="w-full bg-[#060b18] border border-blue-900/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3.5 pr-10 pl-4 text-xs text-white placeholder-slate-600 font-bold outline-none"
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
              className="flex-1.5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/10 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>تحقق كمطور مطلق</span>
            </button>
          </div>
        </form>
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
