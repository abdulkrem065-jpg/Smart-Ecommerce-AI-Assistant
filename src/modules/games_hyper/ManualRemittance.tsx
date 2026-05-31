import React from 'react';

interface ManualRemittanceProps {
  remittanceNumber: string;
  setRemittanceNumber: (num: string) => void;
  remittanceImage: string;
  setRemittanceImage: (img: string) => void;
}

export const ManualRemittance: React.FC<ManualRemittanceProps> = ({
  remittanceNumber,
  setRemittanceNumber,
  remittanceImage,
  setRemittanceImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRemittanceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 bg-blue-950/20 p-4 rounded-2xl border border-yellow-500/10 mt-3 animate-fade-in text-right" dir="rtl" id="manual-remittance-isolated-container">
      <h4 className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 justify-end">
        <span>💵 تأكيد وتوثيق التحويل المالي اليدوي</span>
      </h4>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        يرجى إدخال تفاصيل التحويل المالي أو التقاط صورة واضحة لإشعار الإرسال لسرعة الموافقة السحابية على شحن حسابك.
      </p>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-300">رقم الحوالة أو المرجع (رقم الإشعار):</label>
        <input
          type="text"
          placeholder="اكتب رقم الحوالة المالية هنا (مثل: 7041595)..."
          value={remittanceNumber}
          onChange={(e) => setRemittanceNumber(e.target.value)}
          className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/40 rounded-xl text-xs text-white focus:border-yellow-500 outline-none text-center font-mono placeholder:text-slate-600"
          id="remittance-num-input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-300">صورة إشعار أو سند التحويل (اختياري):</label>
        <div className="flex flex-col items-center gap-2">
          <label className="w-full flex flex-col items-center justify-center py-3 bg-[#060b18] border border-dashed border-blue-900/60 rounded-xl cursor-pointer hover:border-yellow-500/40 transition-colors">
            <span className="text-[10px] font-bold text-yellow-500">📥 اختر صورة أو سند الإشعار</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          {remittanceImage && (
            <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border border-blue-900/30">
              <img src={remittanceImage} alt="سند التحويل" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setRemittanceImage('')}
                className="absolute top-1 right-1 bg-rose-600 p-1.5 rounded-full text-white hover:bg-rose-700 cursor-pointer"
                title="مسح الصورة"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
