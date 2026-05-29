import React, { useState, useEffect } from "react";
import { Lock, Keyboard, ArrowLeft, RefreshCw, AlertTriangle, Play } from "lucide-react";

interface AdminLoginGateProps {
  correctPassword?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLoginGate({ correctPassword = "1122", onSuccess, onCancel }: AdminLoginGateProps) {
  const [pin, setPin] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [shake, setShake] = useState(false);

  // Keyboard binding for quick hard enter or physical digits input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleVerify();
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
  }, [pin]);

  const handleKeyPress = (num: string) => {
    setErrorStatus(false);
    if (pin.length < 8) {
      setPin((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setPin("");
    setErrorStatus(false);
  };

  const handleVerify = () => {
    if (pin === correctPassword) {
      onSuccess();
    } else {
      setErrorStatus(true);
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#0b1329] border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden" dir="rtl" id="login-gate-card">
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Badge */}
      <div className="text-center space-y-3 mb-6 relative">
        <div className="inline-flex items-center justify-center p-3.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-500 mb-1">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400">
          بوابة الإدارة والدخول الآمن 🔐
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          هذه المنطقة مقيدة وآمنة بالكامل للكادر والمشرفين المعتمدين فقط. الرجاء كتابة الرمز السري للمستودع.
        </p>
      </div>

      {/* Secret Password input indicators */}
      <div className={`space-y-4 ${shake ? "animate-bounce" : ""}`}>
        <div className="bg-[#060b18] p-4.5 rounded-2xl border border-blue-900/60 flex items-center justify-between shadow-inner relative">
          <div className="flex-1 text-center font-mono tracking-[0.4em] text-xl font-bold text-yellow-400">
            {pin ? pin.split("").map(() => "●").join(" ") : <span className="text-xs font-sans tracking-normal text-slate-550 select-none">اكتب رمز الحماية...</span>}
          </div>
          <button 
            type="button" 
            onClick={handleClear} 
            className="text-[10px] font-black hover:text-red-450 text-slate-500 hover:bg-red-500/10 transition-colors px-2 py-1 rounded-lg cursor-pointer flex-shrink-0"
            title="مسح الخانات"
          >
            مسح (C)
          </button>
        </div>

        {/* Incorrect entry flag alert */}
        {errorStatus && (
          <div className="bg-red-950/20 border border-red-500/20 px-4 py-2.5 rounded-xl text-[10px] text-red-400 flex items-center gap-2 animate-pulse justify-center">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="font-bold">عذراً، الرمز السري المدخل غير صحيح! يرجى إعادة المحاولة.</span>
          </div>
        )}

        {/* Numpad Block grid representing VIP secure layout */}
        <div className="grid grid-cols-3 gap-3 pt-2" id="login-numpad-grid">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="py-3.5 bg-[#060b18] hover:bg-yellow-500/10 active:scale-95 border border-blue-900/40 hover:border-yellow-500/20 rounded-2xl text-base font-black font-mono text-white transition-all cursor-pointer shadow-sm select-none"
            >
              {num}
            </button>
          ))}
          
          {/* Back Action button */}
          <button
            type="button"
            onClick={onCancel}
            className="py-3.5 bg-slate-800/45 hover:bg-slate-800 active:scale-95 rounded-2xl text-[11px] font-black text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1 select-none"
            title="الرجوع لمعرض البضائع"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>المعرض</span>
          </button>

          {/* Zero key representation */}
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="py-3.5 bg-[#060b18] hover:bg-yellow-500/10 active:scale-95 border border-blue-900/40 rounded-2xl text-base font-black font-mono text-white transition-all cursor-pointer select-none"
          >
            0
          </button>

          {/* Confirm key */}
          <button
            type="button"
            onClick={handleVerify}
            className="py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center shadow-lg hover:shadow-yellow-500/15 group select-none"
          >
            <span>موافق</span>
            <Play className="w-3 h-3 fill-current transform rotate-180 ml-1" />
          </button>
        </div>
      </div>

      {/* Safety info guidelines footer of the gated layout */}
      <div className="mt-6 pt-4.5 border-t border-blue-900/40 text-[9px] text-slate-505 leading-relaxed text-center space-y-1 select-none">
        <div className="flex items-center justify-center gap-1">
          <Keyboard className="w-3 h-3" />
          <span>يدعم الدخول المباشر الكيبورد الفيزيائي بجوالك أو لابتوبك كذلك</span>
        </div>
        <p>الرمز السري الافتراضي للمستودع مثبت بجميع قواعد البيانات كـ (<strong>1122</strong>).</p>
      </div>
    </div>
  );
}
