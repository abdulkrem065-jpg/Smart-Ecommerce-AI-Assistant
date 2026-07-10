import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import { Zap, Smartphone, ImageIcon, MessageSquare, Settings, Coins, Sliders, Check as CheckIcon, Save, CreditCard, ShieldCheck } from 'lucide-react';
import { NICHES } from '../../../data';

export default function SettingsTab() {
  const tenantConfig = useStore((state) => state.tenantConfig);
  const setTenantConfig = useStore((state) => state.setTenantConfig);

  const [localConfig, setLocalConfig] = useState(tenantConfig);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    setLocalConfig(tenantConfig);
  }, [tenantConfig]);

  const handleChange = (key: keyof typeof tenantConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setTenantConfig(localConfig);
    setSaveStatus('تم الحفظ بنجاح! تم تحديث الحالة المركزية (Zustand).');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" id="configs-tab-section">
      <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm md:col-span-2 space-y-6">
        <div className="p-5 bg-gradient-to-r from-blue-950/70 to-blue-900/40 border border-blue-500/30 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
            <h4 className="text-xs font-black text-white">منصة سحابية مستقلة (Zustand Managed)</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal" dir="rtl">
            تم تخصيص المنصة لصالح نشاط: <strong className="text-yellow-400">[{NICHES?.find(n => n.id === localConfig.niche)?.name || 'مخصص'}]</strong>.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black text-white">إعدادات المتجر الأساسية</h3>
        </div>

        <form onSubmit={handleSaveConfigs} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-2">رقم الواتساب</label>
              <input
                type="text"
                required
                value={localConfig.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-2">رابط الشعار (Logo)</label>
              <input
                type="url"
                value={localConfig.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400">رسالة شريط الإعلانات الفوقاني</label>
            <textarea
              rows={2}
              required
              value={localConfig.tickerMessage}
              onChange={(e) => handleChange('tickerMessage', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#060b18] p-4 rounded-xl border border-yellow-500/20">
              <label className="block text-xs font-bold text-yellow-400 mb-2">رمز مدير النظام (Admin Password)</label>
              <input
                type="text"
                value={localConfig.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white font-mono text-center"
              />
            </div>
            
            <div className="bg-[#060b18] p-4 rounded-xl border border-yellow-500/20">
               <label className="block text-xs font-bold text-yellow-400 mb-2">سعر صرف الريال اليمني</label>
               <input
                 type="number"
                 value={localConfig.exchangeRate}
                 onChange={(e) => handleChange('exchangeRate', Number(e.target.value))}
                 className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white font-mono text-center"
               />
            </div>
          </div>

          {/* Delivery & Tax Settings */}
          <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>تفعيل عمولة التوصيل</span>
                </label>
                <input
                  type="checkbox"
                  checked={localConfig.deliveryFeeEnabled}
                  onChange={(e) => handleChange('deliveryFeeEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-yellow-500"
                />
             </div>
             {localConfig.deliveryFeeEnabled && (
                <div className="pt-3 border-t border-blue-900/20">
                   <label className="block text-[10px] font-bold text-slate-400">قيمة التوصيل (ر.س)</label>
                   <input
                     type="number"
                     value={localConfig.deliveryFeeValue}
                     onChange={(e) => handleChange('deliveryFeeValue', Number(e.target.value))}
                     className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white font-mono"
                   />
                </div>
             )}
          </div>
          
          <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>تفعيل الضريبة المضافة</span>
                </label>
                <input
                  type="checkbox"
                  checked={localConfig.taxEnabled}
                  onChange={(e) => handleChange('taxEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-yellow-500"
                />
             </div>
             {localConfig.taxEnabled && (
                <div className="pt-3 border-t border-blue-900/20">
                   <label className="block text-[10px] font-bold text-slate-400">نسبة الضريبة %</label>
                   <input
                     type="number"
                     value={localConfig.taxRate}
                     onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                     className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white font-mono"
                   />
                </div>
             )}
          </div>

          {/* Payment Gateways Config */}
          <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>تفعيل بوابة الدفع الإلكتروني (Online Payment)</span>
                </label>
                <input
                  type="checkbox"
                  checked={localConfig.payApiEnabled}
                  onChange={(e) => handleChange('payApiEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
             </div>
             {localConfig.payApiEnabled && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-emerald-900/20">
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400">مزود الخدمة</label>
                     <select
                       value={localConfig.payApiProvider}
                       onChange={(e) => handleChange('payApiProvider', e.target.value)}
                       className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white text-xs"
                     >
                       <option value="simulated">محاكي (Simulated)</option>
                       <option value="moyasar">Moyasar (Live)</option>
                       <option value="tap">Tap Payments (Live)</option>
                       <option value="myfatoorah">MyFatoorah (Live)</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400">Merchant ID</label>
                     <input
                       type="text"
                       value={localConfig.payApiMerchantId}
                       onChange={(e) => handleChange('payApiMerchantId', e.target.value)}
                       className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-white font-mono"
                     />
                   </div>
                </div>
             )}
          </div>

          <div className="pt-4 border-t border-blue-900/40">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#0b1329] font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              حفظ جميع الإعدادات عبر Zustand
            </button>
            {saveStatus && (
              <p className="text-center text-emerald-400 text-xs font-bold mt-2 animate-fade-in">{saveStatus}</p>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm h-fit">
        <h3 className="text-sm font-black text-white mb-4">معلومات وتوجيهات</h3>
        <ul className="text-xs text-slate-400 space-y-3 list-disc list-inside">
           <li>هذه اللوحة تعمل الآن عبر مكتبة Zustand بشكل كامل.</li>
           <li>التغييرات يتم مزامنتها مع LocalStorage كاحتياطي.</li>
           <li>يمكنك تفعيل ضريبة القيمة المضافة لتعمل كعنصر تلقائي بالفاتورة.</li>
        </ul>
      </div>
    </div>
  );
}
