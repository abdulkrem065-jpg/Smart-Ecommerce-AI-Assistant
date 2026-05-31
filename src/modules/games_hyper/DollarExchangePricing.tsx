import React from 'react';

interface DollarExchangePricingProps {
  productCostUsd: number | '';
  setProductCostUsd: (val: number | '') => void;
  productProfitMarginUsd: number | '';
  setProductProfitMarginUsd: (val: number | '') => void;
  inputUsdToSar: number;
  setInputUsdToSar: (val: number) => void;
  inputUsdToYer: number;
  setInputUsdToYer: (val: number) => void;
}

export const DollarExchangePricing: React.FC<DollarExchangePricingProps> = ({
  productCostUsd,
  setProductCostUsd,
  productProfitMarginUsd,
  setProductProfitMarginUsd,
  inputUsdToSar,
  setInputUsdToSar,
  inputUsdToYer,
  setInputUsdToYer,
}) => {
  return (
    <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-blue-900/30 animate-fade-in text-right" dir="rtl" id="dollar-pricing-isolated-card">
      <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1">
        <span>💵 تسعير وهوامش الدولار المقفلة</span>
      </h4>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        قم بتحديد التكلفة بالدولار الأمريكي وهامش الربح المطلوب ليقوم النظام بتحديث السعر المحلي آلياً حسب سعر الصرف.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-300">التكلفة ($ USD):</label>
          <input
            type="number"
            step="0.01"
            placeholder="مثال: 5.2"
            value={productCostUsd}
            onChange={(e) => setProductCostUsd(e.target.value !== '' ? Number(e.target.value) : '')}
            className="w-full px-2.5 py-1.5 bg-[#060b18] border border-blue-900/40 rounded-xl text-xs text-white focus:border-cyan-500 outline-none text-center font-mono"
            id="cost-usd-input"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-300">هامش الربح ($ USD):</label>
          <input
            type="number"
            step="0.01"
            placeholder="مثال: 1.5"
            value={productProfitMarginUsd}
            onChange={(e) => setProductProfitMarginUsd(e.target.value !== '' ? Number(e.target.value) : '')}
            className="w-full px-2.5 py-1.5 bg-[#060b18] border border-blue-900/40 rounded-xl text-xs text-white focus:border-cyan-500 outline-none text-center font-mono"
            id="profit-margin-usd-input"
          />
        </div>
      </div>

      <div className="border-t border-blue-900/20 pt-3">
        <h5 className="text-[10px] font-bold text-slate-400 mb-2">تحديث معدلات تحويل صرف الدولار ($):</h5>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-450">الدولار مقابل السعودي (SAR):</label>
            <input
              type="number"
              step="0.01"
              value={inputUsdToSar}
              onChange={(e) => setInputUsdToSar(Number(e.target.value))}
              className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-xs text-white text-center font-mono"
              id="usd-to-sar-input"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-450">الدولار مقابل اليمني (YER):</label>
            <input
              type="number"
              value={inputUsdToYer}
              onChange={(e) => setInputUsdToYer(Number(e.target.value))}
              className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-xs text-white text-center font-mono"
              id="usd-to-yer-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
