import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { StoreCategory } from '../../../types';

export default function CategoriesTab() {
  const categories = useStore((state) => state.categories);
  const products = useStore((state) => state.products);
  const addCategory = useStore((state) => state.addCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);

  const [newCatArabic, setNewCatArabic] = useState('');
  const [newCatEnglish, setNewCatEnglish] = useState('');

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatArabic.trim()) return;
    
    addCategory({
      name: newCatArabic.trim(),
      nameEn: newCatEnglish.trim(),
      isDefault: false
    });
    
    setNewCatArabic('');
    setNewCatEnglish('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="categories-tab-section">
      <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-4 border-b border-blue-900/25 pb-3">
          <Layers className="w-4 h-4 text-yellow-400" />
          <h3 className="text-xs font-black text-white">إضافة تصنيف أو قسم بضائع جديد</h3>
        </div>
        
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">الاسم بالعربية المعروض للزبون *</label>
            <input
              type="text"
              required
              placeholder="مثال: البهارات الفاخرة"
              value={newCatArabic}
              onChange={(e) => setNewCatArabic(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">الاسم بالإنجليزي (اختياري)</label>
            <input
              type="text"
              placeholder="e.g: Premium Spices"
              value={newCatEnglish}
              onChange={(e) => setNewCatEnglish(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            حفظ وإنشاء قسم جديد بالمخزن
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/40 shadow-sm">
          <div className="flex justify-between items-center border-b border-blue-900/25 pb-3 mb-4">
            <h3 className="text-sm font-black text-white">الأقسام الحالية بالمتجر ({categories.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((c) => {
              const productsInCat = products.filter(p => p.category === c.id).length;
              return (
                <div key={c.id} className="flex items-center justify-between p-3 bg-[#060b18] border border-blue-900/30 rounded-xl hover:border-yellow-500/30 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{c.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{c.nameEn || 'N/A'}</span>
                      <span className="text-[9px] bg-blue-950/40 text-blue-400 border border-blue-900/40 px-1.5 py-0.5 rounded-md">
                        {productsInCat} منتج
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    {!c.isDefault ? (
                      <button
                        onClick={() => {
                          if (productsInCat > 0) {
                            alert('لا يمكنك حذف قسم يحتوي على منتجات! يرجى حذف أو نقل المنتجات أولاً.');
                            return;
                          }
                          if (window.confirm('تأكيد مسح القسم نهائياً؟')) {
                            deleteCategory(c.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-950/40 rounded text-slate-500 hover:text-red-450 transition-colors cursor-pointer"
                        title="حذف هذا القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[8px] bg-blue-950 text-blue-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase">أساسي</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
