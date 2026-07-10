import React, { useState } from 'react';
import { useStore } from '../../../store';
import { Package, Plus, Sparkles, Image as ImageIcon, Trash2, Edit2, UploadCloud, CheckIcon, Smartphone, Zap } from 'lucide-react';
import { Product } from '../../../types';
import { DollarExchangePricing } from '../../../modules/games_hyper/DollarExchangePricing';

export default function InventoryTab({ formatPrice }: { formatPrice: (p: number) => string }) {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  
  const exchangeRate = useStore((state) => state.tenantConfig.exchangeRate);
  const currency = useStore((state) => state.tenantConfig.currency);
  const usdToSar = 3.75; // Approximation

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productPriceSar, setProductPriceSar] = useState<number | ''>('');
  const [productPriceYer, setProductPriceYer] = useState<number | ''>('');
  const [productCurrency, setProductCurrency] = useState<'SAR' | 'YER'>('SAR');
  const [productColors, setProductColors] = useState('');
  const [productFlavors, setProductFlavors] = useState('');
  const [productStock, setProductStock] = useState<number>(99);
  const [productImage, setProductImage] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productImages, setProductImages] = useState('');

  const [productCostUsd, setProductCostUsd] = useState<number | ''>('');
  const [productProfitMarginUsd, setProductProfitMarginUsd] = useState<number | ''>('');
  const [productIsDigitalService, setProductIsDigitalService] = useState<boolean>(false);
  const [productDigitalServiceType, setProductDigitalServiceType] = useState<'direct' | 'card'>('direct');
  const [productDigitalCategory, setProductDigitalCategory] = useState<'game' | 'balance' | 'cards'>('game');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productCat) return;

    let finalSarPrice = Number(productPriceSar) || 0;
    let finalYerPrice = Number(productPriceYer) || 0;

    if (productCostUsd !== '' && productCostUsd > 0) {
      const pUsd = Number(productCostUsd);
      const mUsd = Number(productProfitMarginUsd) || 0;
      finalSarPrice = (pUsd + mUsd) * usdToSar;
      finalYerPrice = (pUsd + mUsd) * (exchangeRate || 400) / usdToSar; 
    }

    const legacyPrice = productCurrency === 'SAR' ? finalSarPrice : finalYerPrice;

    const newProduct: Partial<Product> = {
      name: productName,
      description: productDesc,
      category: productCat,
      price: legacyPrice,
      price_sar: finalSarPrice,
      price_yer: finalYerPrice,
      currency: productCurrency,
      image: productImage,
      colors: productColors ? productColors.split(',').map(c => c.trim()) : undefined,
      flavors: productFlavors ? productFlavors.split(',').map(f => f.trim()) : undefined,
      stock: productStock,
      code: productCode,
      images: productImages ? productImages.split(',').map(i => i.trim()) : undefined,
      cost_usd: productCostUsd !== '' ? Number(productCostUsd) : undefined,
      profit_margin_usd: productProfitMarginUsd !== '' ? Number(productProfitMarginUsd) : undefined,
      is_digital_service: productIsDigitalService,
      digital_service_type: productDigitalServiceType,
      digital_category: productDigitalCategory
    };

    if (editingProductId) {
      updateProduct(editingProductId, newProduct);
      setEditingProductId(null);
    } else {
      addProduct(newProduct as Omit<Product, 'id'>);
    }

    setProductName('');
    setProductDesc('');
    setProductCat('');
    setProductPrice(0);
    setProductPriceSar('');
    setProductPriceYer('');
    setProductColors('');
    setProductFlavors('');
    setProductStock(99);
    setProductImage('');
    setProductCode('');
    setProductImages('');
    setProductCostUsd('');
    setProductProfitMarginUsd('');
    setProductIsDigitalService(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductName(p.name);
    setProductDesc(p.description || '');
    setProductCat(p.category);
    setProductPrice(p.price);
    setProductPriceSar(p.price_sar || (p.currency === 'SAR' ? p.price : ''));
    setProductPriceYer(p.price_yer || (p.currency === 'YER' ? p.price : ''));
    setProductCurrency(p.currency || 'SAR');
    setProductColors(p.colors?.join(', ') || '');
    setProductFlavors(p.flavors?.join(', ') || '');
    setProductStock(p.stock || 0);
    setProductImage(p.image || '');
    setProductCode(p.code || '');
    setProductImages(p.images?.join(', ') || '');
    setProductCostUsd(p.cost_usd || '');
    setProductProfitMarginUsd(p.profit_margin_usd || '');
    setProductIsDigitalService(p.is_digital_service || false);
    setProductDigitalServiceType(p.digital_service_type || 'direct');
    setProductDigitalCategory(p.digital_category || 'game');
    document.getElementById('inventory-tab-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="inventory-tab-section">
      <div className="lg:col-span-1 bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-sm h-fit sticky top-6">
        <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2">
          {editingProductId ? <Edit2 className="w-4 h-4 text-yellow-400" /> : <Plus className="w-4 h-4 text-blue-400" />}
          {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
        </h3>
        
        <form onSubmit={submitProduct} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5">اسم المنتج / الخدمة</label>
            <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50" placeholder="مثال: شدات ببجي 325UC" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5">القسم التابع له</label>
            <select required value={productCat} onChange={(e) => setProductCat(e.target.value)} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50">
              <option value="">-- اختر القسم المناسب --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <DollarExchangePricing 
            usdCost={productCostUsd} 
            setUsdCost={setProductCostUsd}
            usdMargin={productProfitMarginUsd}
            setUsdMargin={setProductProfitMarginUsd}
            exchangeRate={exchangeRate || 400} 
            baseSarRate={usdToSar}
          />
          
          {(!productCostUsd) && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">عملة التسعير الأساسية</label>
                <div className="flex bg-[#060b18] rounded-xl p-1 border border-blue-900/40">
                  <button type="button" onClick={() => setProductCurrency('SAR')} className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${productCurrency === 'SAR' ? 'bg-yellow-500 text-black' : 'text-slate-400 hover:text-white'}`}>سعودي (SAR)</button>
                  <button type="button" onClick={() => setProductCurrency('YER')} className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${productCurrency === 'YER' ? 'bg-yellow-500 text-black' : 'text-slate-400 hover:text-white'}`}>يمني (YER)</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">السعر بالريال السعودي</label>
                <input type="number" required={productCurrency === 'SAR'} value={productPriceSar} onChange={(e) => setProductPriceSar(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono" placeholder="0" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">السعر بالريال اليمني</label>
                <input type="number" required={productCurrency === 'YER'} value={productPriceYer} onChange={(e) => setProductPriceYer(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono" placeholder="0" />
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-emerald-950/30 to-blue-950/20 p-3 rounded-xl border border-emerald-900/30">
             <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" id="is_digital_service" checked={productIsDigitalService} onChange={(e) => setProductIsDigitalService(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500" />
                <label htmlFor="is_digital_service" className="text-xs font-bold text-emerald-400 cursor-pointer">هل هذا المنتج خدمة رقمية؟ (شحن/بطاقات)</label>
             </div>
             {productIsDigitalService && (
                <div className="space-y-3 pl-6 border-r-2 border-emerald-900/50 pr-2">
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">نوع الخدمة الرقمية</label>
                      <select value={productDigitalServiceType} onChange={(e) => setProductDigitalServiceType(e.target.value as any)} className="w-full px-2 py-1.5 bg-[#060b18] border border-blue-900/60 rounded-lg text-xs text-white outline-none">
                         <option value="direct">شحن مباشر (عبر الايدي/الرقم)</option>
                         <option value="card">بطاقة كود (يستلم كود التفعيل)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">تصنيف الخدمة</label>
                      <select value={productDigitalCategory} onChange={(e) => setProductDigitalCategory(e.target.value as any)} className="w-full px-2 py-1.5 bg-[#060b18] border border-blue-900/60 rounded-lg text-xs text-white outline-none">
                         <option value="game">ألعاب (شحن جواهر، شدات...)</option>
                         <option value="balance">أرصدة (رصيد اتصال، محافظ...)</option>
                         <option value="cards">بطاقات (ستور، ايتونز، نتفلكس...)</option>
                      </select>
                   </div>
                   {productDigitalServiceType === 'direct' && (
                     <div className="text-[9px] text-emerald-500/80 font-medium">💡 سيُطلب من العميل إدخال المُعرف (ID) أو رقم الجوال عند الطلب.</div>
                   )}
                </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5">صورة رئيسية (رابط)</label>
              <input type="url" value={productImage} onChange={(e) => setProductImage(e.target.value)} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5">أو رفع صورة من الجهاز</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <div className="w-full px-3 py-2 bg-blue-950/40 border border-blue-900/60 rounded-xl text-[10px] text-blue-400 flex items-center justify-center gap-1 hover:bg-blue-900/40 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" /> استعراض...
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5">رقم المنتج (اختياري)</label>
              <input type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono" placeholder="SKU-123" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5">المخزون المتوفر</label>
              <input type="number" value={productStock} onChange={(e) => setProductStock(Number(e.target.value))} className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono" />
            </div>
          </div>

          <button type="submit" className={`w-full font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${editingProductId ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-900/20'}`}>
            {editingProductId ? <CheckIcon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingProductId ? 'حفظ التعديلات الجوهرية' : 'إضافة المنتج للمعرض'}
          </button>
          
          {editingProductId && (
            <button type="button" onClick={() => {
              setEditingProductId(null);
              setProductName(''); setProductCat(''); setProductPrice(0); setProductImage('');
            }} className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors">إلغاء التعديل والعودة</button>
          )}
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#0b1329] p-5 rounded-3xl border border-blue-900/40 shadow-sm">
          <div className="flex justify-between items-center border-b border-blue-900/25 pb-3 mb-4">
            <h3 className="text-sm font-black text-white">المنتجات المعروضة بالمخزن ({products.length})</h3>
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {products.map((p) => {
               const pCat = categories.find(c => c.id === p.category);
               const effectiveSar = p.price_sar || (p.currency === 'SAR' ? p.price : 0);
               const effectiveYer = p.price_yer || (p.currency === 'YER' ? p.price : 0);

              return (
              <div key={p.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-[#060b18] border border-blue-900/30 rounded-2xl hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-blue-950 flex items-center justify-center overflow-hidden border border-blue-900/50 flex-shrink-0">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{p.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[9px]">
                      <span className="text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">{pCat?.name || 'بدون قسم'}</span>
                      {p.is_digital_service && (
                         <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30 flex items-center gap-0.5">
                           <Zap className="w-3 h-3" /> {p.digital_service_type === 'direct' ? 'شحن' : 'بطاقة'}
                         </span>
                      )}
                      <span className="text-slate-400">مخزون: <span className="font-bold text-yellow-500">{p.stock || 0}</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                    {p.cost_usd ? (
                       <div className="text-[10px] text-green-400 font-bold mb-0.5" dir="ltr">${p.cost_usd.toFixed(2)} + ${p.profit_margin_usd?.toFixed(2)}</div>
                    ) : (
                       <div className="text-[9px] text-slate-500 font-bold mb-0.5 text-right">{p.currency || 'SAR'} السعر الأساسي</div>
                    )}
                    <div className="font-black text-sm text-yellow-400 font-mono" dir="ltr">
                       {formatPrice ? formatPrice(p.price) : p.price.toLocaleString()} {currency}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => startEditProduct(p)} className="p-1.5 bg-blue-900/20 hover:bg-blue-600/40 rounded border border-blue-900/40 text-blue-400 hover:text-white transition-colors cursor-pointer" title="تعديل هذا الصنف">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => {
                        if (window.confirm('هل تريد فعلاً حذف هذا المنتج نهائياً من قاعدة البيانات؟')) {
                          deleteProduct(p.id);
                        }
                      }} className="p-1.5 hover:bg-red-950/40 rounded text-slate-400 hover:text-red-450 transition-colors cursor-pointer" title="حذف هذا الصنف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
