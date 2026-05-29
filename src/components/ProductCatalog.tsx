import React, { useState } from 'react';
import { Product, StoreCategory, CartSubOption } from '../types';
import { Search, ShoppingBag, ShoppingCart, X, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  categories: StoreCategory[];
  onAddToCart: (product: Product, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: CartSubOption[], playerId?: string) => void;
  formatPrice?: (price: number) => string;
  currency?: 'SAR' | 'YER';
  exchangeRate?: number;
}

const highlightText = (text: string, highlight: string) => {
  if (!highlight || !highlight.trim()) return <span>{text}</span>;
  const cleanHighlight = highlight.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${cleanHighlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-500/30 text-yellow-350 font-black rounded px-1 py-0.5 mx-0.5 inline-block">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

function ProductCard({ 
  product, 
  onAddToCart, 
  getProductDisplay, 
  currency, 
  exchangeRate,
  searchQuery = ''
}: { 
  product: Product; 
  onAddToCart: (product: Product, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: CartSubOption[], playerId?: string) => void; 
  getProductDisplay: (p: Product) => { mainText: string; subText: string }; 
  currency?: 'SAR' | 'YER'; 
  exchangeRate?: number; 
  key?: React.Key;
  searchQuery?: string;
}) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedSubOptions, setSelectedSubOptions] = useState<{ [name: string]: number }>({});
  const [activeImage, setActiveImage] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

  const stockVal = product.stock !== undefined ? product.stock : 99;
  const isOutOfStock = stockVal === 0;
  const isLowStock = stockVal > 0 && stockVal <= 3;

  React.useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  React.useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor('');
    }
  }, [product.colors]);

  React.useEffect(() => {
    if (product.flavors && product.flavors.length > 0) {
      setSelectedFlavor(product.flavors[0]);
    } else {
      setSelectedFlavor('');
    }
  }, [product.flavors]);

  return (
    <div
      className="bg-[#0b1329] rounded-3xl border border-blue-900/35 overflow-hidden flex flex-col hover:border-yellow-450/45 group transition-all duration-300 shadow-xl"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Component */}
      <div className="relative aspect-video w-full bg-[#060b18] overflow-hidden border-b border-blue-900/25">
        <img
          src={activeImage || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-100 transition-all duration-500 opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none">
          <span className="px-2.5 py-0.5 bg-blue-950/85 backdrop-blur-md shadow-sm text-[9px] font-bold text-yellow-400 border border-yellow-500/15 rounded-full">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 bg-rose-600/90 shadow-sm text-[9px] font-bold text-white rounded-full">
              منتهي حالياً
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 bg-amber-500 shadow-sm text-[9px] font-bold text-white rounded-full">
              متبقي {stockVal} قطع فقط!
            </span>
          ) : null}
        </div>

        {product.code && (
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-[9px] font-mono text-slate-455 rounded-md border border-slate-800/10 dark:border-blue-900/20">
              كود: {product.code}
            </span>
          </div>
        )}
      </div>

      {/* Optional Gallery Slider under main photo */}
      {product.images && product.images.filter(Boolean).length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2.5 bg-[#060b18]/60 border-b border-blue-900/15 scrollbar-thin scrollbar-thumb-blue-900/30" dir="rtl">
          {[product.image, ...product.images.filter(Boolean)].map((imgUrl, idx) => (
            <button
              type="button"
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(imgUrl);
              }}
              className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all border cursor-pointer ${
                (activeImage || product.image) === imgUrl ? 'border-yellow-450 scale-105 ring-2 ring-yellow-450/20' : 'border-blue-900/35 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-white group-hover:text-yellow-400 transition-colors text-xs md:text-sm line-clamp-1">
            {highlightText(product.name, searchQuery)}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-[36px]" title={product.description || product.name}>
            {product.description ? highlightText(product.description, searchQuery) : 'صنف فاخر بجودة معتمدة ومواصفات مناسبة مجهز للتحميل فوري.'}
          </p>
        </div>

        {/* Variations Dropdowns if any exist */}
        {((product.colors && product.colors.length > 0) || (product.flavors && product.flavors.length > 0)) && (
          <div className="grid grid-cols-2 gap-2 bg-[#060b18]/45 p-2 rounded-xl border border-blue-900/25">
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-slate-450">اللون المفضل:</span>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-[10px] text-white outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  {product.colors.filter(Boolean).map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            {product.flavors && product.flavors.length > 0 && (
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-slate-450">النكهة المفضلة:</span>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-[10px] text-white outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  {product.flavors.filter(Boolean).map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {product.subOptions && product.subOptions.length > 0 && (
          <div className="space-y-2 bg-[#060b18]/45 p-3 rounded-xl border border-blue-900/25">
            <span className="block text-[9px] font-black text-slate-400">خيارات وتفضيلات فرعية (مثل البهارات):</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]" dir="rtl">
              {product.subOptions.filter(Boolean).map((sub, i) => {
                const qty = selectedSubOptions[sub] || 0;
                return (
                  <div key={i} className="flex items-center justify-between text-[10px] text-white bg-slate-900/40 px-2 py-1 rounded-lg border border-blue-900/10">
                    <span className="font-semibold">{sub}</span>
                    <div className="flex items-center gap-1.5 leading-none">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubOptions(prev => {
                            const current = prev[sub] || 0;
                            if (current <= 0) return prev;
                            const next = { ...prev };
                            if (current === 1) {
                              delete next[sub];
                            } else {
                              next[sub] = current - 1;
                            }
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded bg-[#0b1329] text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-800 font-extrabold"
                      >
                        -
                      </button>
                      <span className="font-bold text-yellow-400 w-3 text-center">{qty}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubOptions(prev => ({
                            ...prev,
                            [sub]: (prev[sub] || 0) + 1
                          }));
                        }}
                        className="w-4 h-4 rounded bg-[#0b1329] text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-800 font-extrabold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Game ID Player Charge API inputs if it is an API product */}
        {product.isApiProduct && (
          <div className="space-y-1.5 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 p-3 rounded-2xl border border-yellow-500/15">
            <label className="block text-[10px] font-bold text-yellow-405 flex items-center gap-1.5 justify-between">
              <span>🎮 {product.apiRequiredField || "معرف اللاعب (Player ID):"}</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="أدخل المعرّف هنا (مثال: 54682012)..."
              value={playerId}
              onChange={(e) => {
                setPlayerId(e.target.value);
                if (e.target.value.trim()) setInputError('');
              }}
              className="w-full px-3 py-2 bg-[#060b18] border border-yellow-500/30 rounded-xl text-xs text-white focus:border-yellow-550 focus:ring-1 focus:ring-yellow-500/20 outline-none font-mono text-center tracking-wider transition-all"
            />
            {inputError && (
              <span className="block text-[9px] text-red-400 font-bold animate-pulse text-right">
                ⚠️ {inputError}
              </span>
            )}
          </div>
        )}

        {/* Price & Add Section */}
        <div className="flex items-center justify-between pt-2.5 border-t border-blue-900/20">
          <div>
            <span className="text-[9px] text-slate-500 block font-semibold">سعر الصنف النقدي</span>
            <span className="text-sm font-black text-white">{getProductDisplay(product).mainText}</span>
            {currency && exchangeRate && (
              <span className="text-[10px] text-slate-450 block mt-0.5">
                {getProductDisplay(product).subText}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (product.isApiProduct && !playerId.trim()) {
                setInputError('يرجى كتابة الحقل المطلوب للشحن الفوري!');
                return;
              }
              setInputError('');
              const subOptsArray = Object.entries(selectedSubOptions)
                .filter(([_, q]) => (q as number) > 0)
                .map(([name, quantity]) => ({ name, quantity: quantity as number }));
              
              onAddToCart(
                product, 
                selectedColor || undefined, 
                selectedFlavor || undefined, 
                subOptsArray.length > 0 ? subOptsArray : undefined,
                product.isApiProduct ? playerId.trim() : undefined
              );
              // Clean ID on success
              setPlayerId('');
            }}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center ${
              isOutOfStock 
                ? 'bg-[#121c33] text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-450 hover:to-amber-450 text-blue-950 hover:shadow-yellow-500/15 hover:shadow-lg'
            }`}
            title={isOutOfStock ? "عذراً انتهت الكمية" : "إضافة إلى سلتك"}
            id={`add-to-cart-btn-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4 text-blue-950 font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog({ products, categories, onAddToCart, formatPrice, currency, exchangeRate }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resolvePrice = (price: number) => {
    if (formatPrice) return formatPrice(price);
    return `${price.toFixed(1)} ريال`;
  };

  const getProductDisplay = (p: Product) => {
    const rate = exchangeRate || 400;
    const prodCurr = p.currency || 'SAR';
    
    let mainPrice = p.price;
    let mainUnit = 'ر.س';
    let subPrice = p.price * rate;
    let subUnit = 'ر.ي';

    if (prodCurr === 'YER') {
      if (currency === 'SAR') {
        mainPrice = p.price / rate;
        mainUnit = 'ر.س';
        subPrice = p.price;
        subUnit = 'ر.ي';
      } else {
        mainPrice = p.price;
        mainUnit = 'ر.ي';
        subPrice = p.price / rate;
        subUnit = 'ر.س';
      }
    } else {
      if (currency === 'YER') {
        mainPrice = p.price * rate;
        mainUnit = 'ر.ي';
        subPrice = p.price;
        subUnit = 'ر.س';
      } else {
        mainPrice = p.price;
        mainUnit = 'ر.س';
        subPrice = p.price * rate;
        subUnit = 'ر.ي';
      }
    }

    return {
      mainText: `${mainPrice.toLocaleString('ar-YE', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ${mainUnit}`,
      subText: `يعادل: ${subPrice.toLocaleString('ar-YE', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ${subUnit}`
    };
  };

  // Filter products safely for optionals
  const filteredProducts = products.filter(p => {
    const desc = p.description || '';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8" dir="rtl" id="product-catalog-root">
      
      {/* SEARCH AND FILTER CRITERIA */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between" id="catalog-controls">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-xl flex flex-col gap-1.5">
          <div className="relative w-full">
            <span className="absolute right-4 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="ابحث عن شدات ببجي، تفعيل ألعاب، بهارات أو إلكترونيات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-11 py-2.5 bg-[#0b1329] border border-blue-900/60 rounded-xl text-base md:text-xs text-white placeholder:text-slate-550 outline-none focus:border-yellow-500/50 transition-all font-sans"
              id="catalog-search-input"
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 250);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                id="clear-search-btn"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <div className="flex items-center justify-between text-[10px] text-yellow-405 bg-yellow-500/5 px-3 py-1.5 rounded-lg border border-yellow-500/15 animate-fade-in font-sans">
              <span className="flex items-center gap-1 font-extrabold text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <span>تصفية فورية تلقائية نشطة</span>
              </span>
              <strong className="text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/10">وجدنا ({filteredProducts.length}) صنف مطابق</strong>
            </div>
          )}
        </div>

        {/* Categories Tab Pill Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none" id="catalog-categories-bar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-md font-extrabold'
                : 'bg-[#0b1329] hover:bg-[#111a2f] text-slate-350 border border-blue-900/40'
            }`}
            id="cat-pill-all"
          >
            جميع بضائع المستودع
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-md font-extrabold'
                  : 'bg-[#0b1329] hover:bg-[#111a2f] text-slate-350 border border-blue-900/40'
              }`}
              id={`cat-pill-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6" id="catalog-products-grid">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-[#0b1329] p-16 rounded-3xl border border-blue-900/40 text-center text-slate-500 space-y-3" id="catalog-empty-state">
            <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-yellow-500" />
            <h4 className="text-sm font-bold text-slate-350">لا تتوفر أصناف حالياً</h4>
            <p className="text-xs text-slate-500">جرب مراجعة البحث أو اختيار فئة بضائع أخرى للاطلاع عليها.</p>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              getProductDisplay={getProductDisplay}
              currency={currency}
              exchangeRate={exchangeRate}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>

    </div>
  );
}
