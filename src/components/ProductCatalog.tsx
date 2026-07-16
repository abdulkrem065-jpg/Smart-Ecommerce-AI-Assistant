import React, { useState } from 'react';
import { Product, StoreCategory, CartSubOption } from '../core/types';
import { Search, ShoppingBag, ShoppingCart, X, Sparkles, Check as CheckIcon, Plus as PlusIcon, Mic, Languages } from 'lucide-react';
import { isModuleEnabled } from '../core/moduleLoader';
import { GameIdFeature } from '../modules/games_hyper/GameIdFeature';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCatalogProps {
  products: Product[];
  categories: StoreCategory[];
  onAddToCart: (product: Product, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: CartSubOption[], playerId?: string) => void;
  formatPrice?: (price: number) => string;
  currency?: string;
  exchangeRate?: number;
  customCurrencyEnabled?: boolean;
  customCurrencyCode?: string;
  customCurrencySymbol?: string;
  customCurrencyRateToYer?: number;
  lang?: 'ar' | 'en';
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

const translateVariation = (val: string, lang?: string) => {
  if (lang !== 'en') return val;
  const m: Record<string, string> = {
    'أحمر': 'Red',
    'أزرق': 'Blue',
    'أسود': 'Black',
    'ذهبي': 'Gold',
    'فضي': 'Silver',
    'أبيض': 'White',
    'صيفي': 'Summer',
    'شتوي': 'Winter',
    'حار': 'Spicy',
    'بارد': 'Mild',
    'ملكي': 'Royal',
    'بصل حامض': 'Sour Onion',
    'ثوم مكثف': 'Extra Garlic',
    'خلطة حارة سبيشال': 'Special Spicy Mix',
    'بدون إضافات': 'Pure Plain',
    'بدون فلفل': 'No Pepper',
    'نص بهار': 'Half Spice',
    'بهار كامل': 'Full Spice'
  };
  return m[val.trim()] || val;
};

function ProductCard({ 
  product, 
  onAddToCart, 
  getProductDisplay, 
  currency, 
  exchangeRate,
  searchQuery = '',
  lang = 'ar',
  onViewDetails
}: { 
  product: Product; 
  onAddToCart: (product: Product, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: CartSubOption[], playerId?: string) => void; 
  getProductDisplay: (p: Product) => { mainText: string; subText: string }; 
  currency?: string; 
  exchangeRate?: number; 
  key?: React.Key;
  searchQuery?: string;
  lang?: 'ar' | 'en';
  onViewDetails?: (product: Product) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedSubOptions, setSelectedSubOptions] = useState<{ [name: string]: number }>({});
  const [activeImage, setActiveImage] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipTimeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

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
      className="bg-[#0b1329] rounded-3xl border border-blue-900/35 flex flex-col hover:border-yellow-450/45 group transition-all duration-300 shadow-xl relative"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Component */}
      <div 
        className="relative aspect-video w-full bg-[#060b18] overflow-hidden border-b border-blue-900/25 rounded-t-3xl cursor-pointer group/img"
        onClick={() => onViewDetails?.(product)}
      >
        <img
          src={activeImage || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover/img:scale-105 group-hover/img:opacity-100 transition-all duration-500 opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
          }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-[#060b18]/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-blue-950/80 backdrop-blur-md rounded-xl text-yellow-400 font-bold text-xs border border-yellow-500/20 flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-all duration-300">
            <Search className="w-3.5 h-3.5" />
            {lang === 'en' ? 'Quick View' : 'نظرة سريعة'}
          </span>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none">
          <span className="px-2.5 py-0.5 bg-blue-950/85 backdrop-blur-md shadow-sm text-[9px] font-bold text-yellow-400 border border-yellow-500/15 rounded-full">
            {lang === 'en' && product.category === 'شحن فوري بالمعرّف 🎮' ? 'Instant Top-up 🎮' :
             lang === 'en' && product.category === 'بطاقات الهدايا الرقمية 💳' ? 'Digital Gift Cards 💳' :
             lang === 'en' && product.category === 'مستلزمات وإكسسوارات الجيمنج ⚡' ? 'Gaming Accessories ⚡' :
             lang === 'en' && product.category === 'أدوية ووصفات علاجية 💊' ? 'Medications 💊' :
             lang === 'en' && product.category === 'فيتامينات ومكملات غذائية ✨' ? 'Vitamins ✨' :
             lang === 'en' && product.category === 'أجهزة فحص ومعدات منزلية 🌡️' ? 'Medical Devices 🌡️' :
             lang === 'en' && product.category === 'تفصيل وخياطة أثواب مخصصة 🧵' ? 'Bespoke Tailoring 🧵' :
             lang === 'en' && product.category === 'طاقات وقماش فخم مستورد 🥻' ? 'Fine Fabrics 🥻' :
             lang === 'en' && product.category === 'مستلزمات وأزرار ملكية فاخرة 🎖️' ? 'Royal Buttons 🎖️' :
             lang === 'en' && product.category === 'مواد تموينية أساسية 🌾' ? 'Staples 🌾' :
             lang === 'en' && product.category === 'البان وأجبان ومبردات 🧀' ? 'Dairy 🧀' :
             lang === 'en' && product.category === 'خضار فواكه ولحوم طازجة 🥩' ? 'Fresh Food & Meats 🥩' :
             product.category}
          </span>
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 bg-rose-600/90 shadow-sm text-[9px] font-bold text-white rounded-full">
              {lang === 'en' ? 'Out of Stock' : 'منتهي حالياً'}
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 bg-amber-500 shadow-sm text-[9px] font-bold text-white rounded-full">
              {lang === 'en' ? `Only ${stockVal} left!` : `متبقي ${stockVal} قطع فقط!`}
            </span>
          ) : null}
        </div>

        {product.code && (
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-[9px] font-mono text-slate-455 rounded-md border border-slate-800/10 dark:border-blue-900/20">
              {lang === 'en' ? 'Code:' : 'كود:'} {product.code}
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
          <h3 
            className="font-extrabold text-white group-hover:text-yellow-400 transition-colors text-xs md:text-sm line-clamp-1 cursor-pointer"
            onClick={() => onViewDetails?.(product)}
            title={product.name}
          >
            {highlightText(product.name, searchQuery)}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-[36px]" title={product.description || product.name}>
            {product.description ? highlightText(product.description, searchQuery) : (lang === 'en' ? 'Premium hand-picked warehouse item with certified specifications.' : 'صنف فاخر بجودة معتمدة ومواصفات مناسبة مجهز للتحميل فوري.')}
          </p>
        </div>

        {/* Variations Dropdowns if any exist */}
        {((product.colors && product.colors.length > 0) || (product.flavors && product.flavors.length > 0)) && (
          <div className="grid grid-cols-2 gap-2 bg-[#060b18]/45 p-2 rounded-xl border border-blue-900/25">
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-slate-450">{lang === 'en' ? 'Favorite Color:' : 'اللون المفضل:'}</span>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-[10px] text-white outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  {product.colors.filter(Boolean).map((c, i) => (
                    <option key={i} value={c}>{translateVariation(c, lang)}</option>
                  ))}
                </select>
              </div>
            )}
            {product.flavors && product.flavors.length > 0 && (
              <div className="space-y-1">
                <span className="block text-[8px] font-black text-slate-450">{lang === 'en' ? 'Favorite Flavor:' : 'النكهة المفضلة:'}</span>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full px-2 py-1 bg-[#060b18] border border-blue-900/40 rounded-lg text-[10px] text-white outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  {product.flavors.filter(Boolean).map((f, i) => (
                    <option key={i} value={f}>{translateVariation(f, lang)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {product.subOptions && product.subOptions.length > 0 && (
          <div className="space-y-2 bg-[#060b18]/45 p-3 rounded-xl border border-blue-900/25">
            <span className="block text-[9px] font-black text-slate-400">{lang === 'en' ? 'Sub-options & Preferences:' : 'خيارات وتفضيلات فرعية (مثل البهارات):'}</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]" dir="rtl">
              {product.subOptions.filter(Boolean).map((sub, i) => {
                const qty = selectedSubOptions[sub] || 0;
                return (
                  <div key={i} className="flex items-center justify-between text-[10px] text-white bg-slate-900/40 px-2 py-1 rounded-lg border border-blue-900/10">
                    <span className="font-semibold">{translateVariation(sub, lang)}</span>
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

        {/* Game ID Player Charge API inputs (Isolated modular feature) */}
        {(() => {
          const isGamingProduct = product.isApiProduct || 
            product.category?.includes('🎮') || 
            product.category?.includes('ألعاب') || 
            product.category?.includes('شحن') ||
            product.name?.toLowerCase().includes('pubg') ||
            product.name?.toLowerCase().includes('شحن');
          
          return isGamingProduct && (
            <GameIdFeature
              product={{ ...product, isApiProduct: true, apiRequiredField: "الآيدي ID أو الحساب المراد شحنه" }}
              playerId={playerId}
              setPlayerId={setPlayerId}
              inputError={inputError}
              setInputError={setInputError}
              lang={lang}
            />
          );
        })()}

        {/* Price & Add Section */}
        <div className="flex items-center justify-between pt-2.5 border-t border-blue-900/20">
          <div>
            <span className="text-[9px] text-slate-500 block font-semibold">{lang === 'en' ? 'Cash Unit Price' : 'سعر الصنف النقدي'}</span>
            <span className="text-sm font-black text-white">{getProductDisplay(product).mainText}</span>
            {currency && exchangeRate && getProductDisplay(product).subText && (
              <span className="text-[10px] text-slate-450 block mt-0.5">
                {getProductDisplay(product).subText}
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                const isGamingProduct = product.isApiProduct || 
                  product.category?.includes('🎮') || 
                  product.category?.includes('ألعاب') || 
                  product.category?.includes('شحن') ||
                  product.name?.toLowerCase().includes('pubg') ||
                  product.name?.toLowerCase().includes('شحن');

                if (isGamingProduct && !playerId.trim()) {
                  setInputError(lang === 'en' ? 'Please enter a valid Player ID / account first! 🎮' : 'يرجى إدخال رقم الآيدي ID أو الحساب المراد شحنه أولاً! 🎮');
                  return;
                }
                setInputError('');
                const subOptsArray = Object.entries(selectedSubOptions)
                  .filter(([_, q]) => (q as number) > 0)
                  .map(([name, quantity]) => ({ name, quantity: quantity as number }));
                
                if (tooltipTimeoutRef.current) {
                  clearTimeout(tooltipTimeoutRef.current);
                }

                onAddToCart(
                  product, 
                  selectedColor || undefined, 
                  selectedFlavor || undefined, 
                  subOptsArray.length > 0 ? subOptsArray : undefined,
                  isGamingProduct ? playerId.trim() : undefined
                );
                // Clean ID on success
                setPlayerId('');
                
                // Animated checkmark and tooltip trigger
                setIsAdded(true);
                setShowTooltip(true);
                setTimeout(() => setIsAdded(false), 1500);

                tooltipTimeoutRef.current = setTimeout(() => {
                  setShowTooltip(false);
                }, 3500);
              }}
              disabled={isOutOfStock}
              className={`p-2.5 rounded-xl cursor-pointer shadow-md flex items-center justify-center btn-add-pulse ${
                isOutOfStock 
                  ? 'bg-[#121c33] text-slate-500 cursor-not-allowed' 
                  : isAdded
                    ? 'bg-emerald-500 text-white select-none ring-2 ring-emerald-400/55 animate-bounce'
                    : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-450 hover:to-amber-450 text-blue-950 hover:shadow-yellow-500/15 hover:shadow-lg'
              }`}
              title={isOutOfStock ? (lang === 'en' ? "Sorry, Out of Stock" : "عذراً انتهت الكمية") : (lang === 'en' ? "Add to active basket" : "إضافة إلى سلتك")}
              id={`add-to-cart-btn-${product.id}`}
            >
              {isAdded ? (
                <CheckIcon className="w-4 h-4 text-white font-black animate-scaleIn" />
              ) : (
                <PlusIcon className="w-4 h-4 text-blue-950 font-black" />
              )}
            </button>

            {/* Interactive Tooltip (Micro-modal Card) */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className="absolute bottom-full right-0 mb-4 z-40 w-64 bg-[#080d21]/95 backdrop-blur-md border border-yellow-500/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)]"
                  dir={lang === 'en' ? 'ltr' : 'rtl'}
                  style={{ transformOrigin: "bottom right" }}
                >
                  {/* Arrow Pointing Down */}
                  <div className={`absolute -bottom-1.5 w-3 h-3 bg-[#080d21] border-r border-b border-yellow-500/40 rotate-45 ${lang === 'en' ? 'left-4' : 'right-4'}`} />

                  {/* Icon & Confirmation Header */}
                  <div className={`flex items-center gap-2 font-black text-[11px] text-emerald-400 ${lang === 'en' ? 'justify-start' : 'justify-start'}`}>
                    <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'en' ? 'Added Successfully! 🛒' : 'تم إضافة الصنف للسلة بنجاح! 🛒'}</span>
                  </div>

                  <div className="border-t border-slate-800/60 my-2" />

                  {/* Thumbnail and Title */}
                  <div className="flex items-center gap-2">
                    <img 
                      src={activeImage || product.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 text-right">
                      <h5 className="text-[11px] font-extrabold text-white truncate text-right">
                        {product.name}
                      </h5>
                      <span className="text-[10px] font-mono text-yellow-400 font-bold block mt-0.5 text-right">
                        {getProductDisplay(product).mainText}
                      </span>
                    </div>
                  </div>

                  {/* Product options checklist if added / relevant */}
                  {(selectedColor || selectedFlavor || (selectedSubOptions && Object.values(selectedSubOptions).some(q => (q as number) > 0)) || playerId) && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/40 space-y-0.5 text-[9px] text-slate-400 text-right">
                      {selectedColor && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">{lang === 'en' ? 'Color:' : 'اللون:'}</span>
                          <span className="text-slate-300 font-extrabold">{translateVariation(selectedColor, lang)}</span>
                        </div>
                      )}
                      {selectedFlavor && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500">{lang === 'en' ? 'Flavor:' : 'النكهة:'}</span>
                          <span className="text-slate-300 font-extrabold">{translateVariation(selectedFlavor, lang)}</span>
                        </div>
                      )}
                      {playerId && (
                        <div className="flex items-center gap-1 truncate">
                          <span className="text-slate-500">{lang === 'en' ? 'ID:' : 'المعرّف:'}</span>
                          <span className="text-blue-450 font-mono font-extrabold">{playerId}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2.5 pt-1 border-t border-slate-800/20 text-[8px] text-slate-500 font-extrabold text-left block select-none">
                    {lang === 'en' ? '✓ Click outside to keep browsing' : '✓ انقر خارج الصفحة للمتابعة'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog({ 
  products, 
  categories, 
  onAddToCart, 
  formatPrice, 
  currency, 
  exchangeRate,
  customCurrencyEnabled,
  customCurrencyCode,
  customCurrencySymbol,
  customCurrencyRateToYer,
  lang = 'ar'
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Voice Search / Speech Recognition States & Logic ---
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<'ar' | 'en'>(lang);

  React.useEffect(() => {
    setVoiceLang(lang);
  }, [lang]);

  const handleVoiceSearch = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus(lang === 'en' 
        ? "Voice search is not supported in this browser. Please use Chrome/Edge." 
        : "البحث الصوتي غير مدعوم في هذا المتصفح. يرجى استخدام متصفح كروم أو إيدج."
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang === 'en' ? 'en-US' : 'ar-YE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus(voiceLang === 'en' 
        ? "Listening... Speak in English now 🎙️" 
        : "جاري الاستماع... تحدث باللغة العربية الآن 🎙️"
      );
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setSearchQuery(transcript);
        setVoiceStatus(voiceLang === 'en' 
          ? `Searching for: "${transcript}"` 
          : `تم التعرف على: "${transcript}"`
        );
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error", event.error);
      if (event.error === 'not-allowed') {
        setVoiceStatus(lang === 'en' 
          ? "Microphone access denied. Please enable microphone permission in your browser." 
          : "لم يتم السماح بالوصول للميكروفون. يرجى تفعيل إذن استخدام الميكروفون من إعدادات المتصفح."
        );
      } else if (event.error === 'no-speech') {
        setVoiceStatus(lang === 'en' 
          ? "No speech detected. Please try speaking again." 
          : "لم يتم الكشف عن صوت بوضوح. يرجى المحاولة مرة أخرى."
        );
      } else {
        setVoiceStatus(lang === 'en' 
          ? `Speech error: ${event.error}` 
          : `قناة الصوت: ${event.error}`
        );
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const resolvePrice = (price: number) => {
    if (formatPrice) return formatPrice(price);
    return `${price.toFixed(1)} ريال`;
  };

  const getProductDisplay = (p: Product) => {
    const rate = exchangeRate || 400;
    
    if (customCurrencyEnabled && currency === customCurrencyCode) {
      // Custom currency calculation
      const codeStr = customCurrencyCode ? customCurrencyCode.toLowerCase() : 'usd';
      const customPriceField = `price_${codeStr}` as any;
      
      let mainPrice = 0;
      if (p[customPriceField] !== undefined && p[customPriceField] !== null && p[customPriceField] !== 0) {
        mainPrice = p[customPriceField];
      } else {
        // Fallback: convert from YER
        const priceInYer = p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0
          ? p.price_yer
          : (p.price_sar ?? p.price ?? 0) * rate;
        mainPrice = priceInYer / (customCurrencyRateToYer || 1500);
      }
      
      const subPriceInYer = p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0
        ? p.price_yer
        : (p.price_sar ?? p.price ?? 0) * rate;
        
      return {
        mainText: lang === 'en'
          ? `${mainPrice.toFixed(2)} ${customCurrencySymbol || customCurrencyCode} (${Math.round(subPriceInYer).toLocaleString('en-US')} YER)`
          : `${mainPrice.toFixed(2)} ${customCurrencySymbol || customCurrencyCode} (${Math.round(subPriceInYer).toLocaleString('en-US')} ريال يمني)`,
        subText: ""
      };
    } else if (currency === 'YER') {
      // YER Direct/Manual pricing mode to absolutely terminate discrepancy and overflow
      const mainPrice = p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0 ? p.price_yer : (p.price_sar ?? p.price ?? 0) * rate;
      const subPrice = p.price_sar !== undefined && p.price_sar !== null && p.price_sar !== 0 ? p.price_sar : mainPrice / rate;
      
      return {
        mainText: lang === 'en'
          ? `${Math.round(mainPrice).toLocaleString('en-US')} YER (${subPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} SAR)`
          : `${Math.round(mainPrice).toLocaleString('en-US')} ريال يمني (${subPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ر.س)`,
        subText: ""
      };
    } else {
      // SAR Direct/Manual pricing mode
      const mainPrice = p.price_sar !== undefined && p.price_sar !== null && p.price_sar !== 0 ? p.price_sar : (p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0 ? p.price_yer / rate : p.price ?? 0);
      const subPrice = p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0 ? p.price_yer : mainPrice * rate;
      
      return {
        mainText: lang === 'en'
          ? `${mainPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} SAR (${Math.round(subPrice).toLocaleString('en-US')} YER)`
          : `${mainPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ر.س (${Math.round(subPrice).toLocaleString('en-US')} ريال يمني)`,
        subText: ""
      };
    }
  };

  // Filter products safely for optionals
  const filteredProducts = products.filter(p => {
    const desc = p.description || '';
    const code = p.code || '';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8" dir={lang === 'en' ? "ltr" : "rtl"} id="product-catalog-root">
      
      {/* SEARCH AND FILTER CRITERIA */}
      <div className={`flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between ${lang === 'en' ? 'text-left' : 'text-right'}`} id="catalog-controls">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-xl flex flex-col gap-1.5" ref={searchContainerRef}>
          <div className="relative w-full flex items-center">
            <span className={`absolute ${lang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 z-10`}>
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={lang === 'en' ? "Search for instant gaming top-ups, cards, spices or accessories..." : "ابحث عن شدات ببجي، تفعيل ألعاب، بهارات أو إلكترونيات..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                if (voiceStatus && !e.target.value) {
                  setVoiceStatus(null);
                }
              }}
              className={`w-full ${lang === 'en' ? 'pl-11 pr-28' : 'pl-28 pr-11'} py-2.5 bg-[#0b1329] border border-blue-900/60 rounded-xl text-base md:text-xs text-white placeholder:text-slate-550 outline-none focus:border-yellow-500/50 transition-all font-sans`}
              id="catalog-search-input"
              onFocus={(e) => {
                setShowSuggestions(true);
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 250);
              }}
            />
            {/* Absolute Controls inside Search (Clear and Mic Control) */}
            <div className={`absolute ${lang === 'en' ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-20`}>
              {/* Language change indicator */}
              <button
                type="button"
                onClick={() => {
                  setVoiceLang(prev => prev === 'ar' ? 'en' : 'ar');
                  setVoiceStatus(null);
                }}
                className="bg-blue-950/60 text-[10px] font-black text-slate-350 border border-blue-900/40 px-2 py-1 rounded-lg hover:text-white hover:bg-blue-900/60 transition-all cursor-pointer"
                title={lang === 'en' ? "Change speech input language" : "تغيير لغة البحث الصوتي"}
              >
                {voiceLang === 'ar' ? 'العربية 🇸🇦' : 'English 🇺🇸'}
              </button>

              {/* Mic Icon Trigger */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`relative p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  isListening
                    ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse scale-105 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "bg-[#050917] hover:bg-blue-900/30 text-slate-350 border-blue-900/40 hover:text-white"
                }`}
                id="mic-search-btn"
                title={lang === 'en' ? "Voice Search (Arabic/English)" : "البحث الصوتي (عربي/إنجليزي)"}
              >
                {isListening ? (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <Mic className="w-4 h-4 text-red-400 animate-bounce" />
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Clear field button if exists */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setVoiceStatus(null);
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  id="clear-search-btn"
                  title={lang === 'en' ? "Clear Search" : "مسح البحث"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchQuery.trim() && filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full z-50 bg-[#060b18] border border-blue-900/50 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
              >
                {filteredProducts.slice(0, 5).map(product => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-blue-900/20 last:border-b-0"
                    onClick={() => {
                      setSearchQuery(product.name);
                      setShowSuggestions(false);
                      setSelectedProductForDetails(product);
                    }}
                  >
                    <img 
                      src={product.image} 
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900" 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
                      }}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-white text-xs font-bold truncate">{highlightText(product.name, searchQuery)}</h4>
                      {product.code && (
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {lang === 'en' ? 'Code:' : 'الكود:'} {highlightText(product.code, searchQuery)}
                        </span>
                      )}
                    </div>
                    <div className="text-yellow-400 font-bold text-xs whitespace-nowrap">
                      {getProductDisplay(product).mainText}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice Prompt Status Banner */}
          {voiceStatus && (
            <div className={`p-2 text-xs rounded-lg border flex items-center justify-between gap-2.5 animate-slide-in font-sans ${
              isListening 
                ? "bg-red-500/5 text-red-400 border-red-500/10" 
                : "bg-blue-950/30 text-slate-300 border-blue-900/20"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-405 animate-pulse' : 'bg-blue-400'}`} />
                <span className="font-extrabold text-[10px]">{voiceStatus}</span>
              </div>
              <button 
                onClick={() => setVoiceStatus(null)}
                className="text-[9px] text-slate-400 hover:text-white font-bold underline"
              >
                {lang === 'en' ? 'Close' : 'إغلاق'}
              </button>
            </div>
          )}

          {searchQuery.trim() && (
            <div className="flex items-center justify-between text-[10px] text-yellow-405 bg-yellow-500/5 px-3 py-1.5 rounded-lg border border-yellow-500/15 animate-fade-in font-sans">
              <span className="flex items-center gap-1 font-extrabold text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <span>{lang === 'en' ? "Active Live Auto Filter" : "تصفية فورية تلقائية نشطة"}</span>
              </span>
              <strong className="text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/10">
                {lang === 'en' ? `Found (${filteredProducts.length}) matching items` : `وجدنا (${filteredProducts.length}) صنف مطابق`}
              </strong>
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
            {lang === 'en' ? "All Warehouse Goods" : "جميع بضائع المستودع"}
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
              {lang === 'en' && cat.englishName ? cat.englishName : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6" id="catalog-products-grid">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-[#0b1329] p-16 rounded-3xl border border-blue-900/40 text-center text-slate-500 space-y-3" id="catalog-empty-state">
            <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-yellow-500" />
            <h4 className="text-sm font-bold text-slate-350">{lang === 'en' ? "No items available now" : "لا تتوفر أصناف حالياً"}</h4>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? "Try checking your query or select a different category option." : "جرب مراجعة البحث أو اختيار فئة بضائع أخرى للاطلاع عليها."}
            </p>
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
              lang={lang}
              onViewDetails={setSelectedProductForDetails}
            />
          ))
        )}
      </div>

      {/* PRODUCT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProductForDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedProductForDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b1329] border border-blue-900/50 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedProductForDetails(null)}
                className="absolute top-4 right-4 z-10 bg-slate-900/50 hover:bg-slate-900 p-2 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-1/2 bg-[#060b18] relative h-64 md:h-auto">
                <img 
                  src={selectedProductForDetails.image} 
                  alt={selectedProductForDetails.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
                  }}
                />
              </div>
              
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                <div className="mb-4 space-y-2">
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-450 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {selectedProductForDetails.category}
                  </span>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {selectedProductForDetails.name}
                  </h2>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {selectedProductForDetails.description || (lang === 'en' ? 'Premium hand-picked warehouse item with certified specifications.' : 'صنف فاخر بجودة معتمدة ومواصفات مناسبة مجهز للتحميل فوري.')}
                </p>

                <div className="mt-auto space-y-6">
                  <div className="bg-[#060b18] p-4 rounded-2xl border border-blue-900/30">
                    <span className="text-xs text-slate-500 block mb-1 font-semibold">{lang === 'en' ? 'Price' : 'السعر'}</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                      {getProductDisplay(selectedProductForDetails).mainText}
                    </span>
                  </div>
                  
                  <div className="[&>div:first-child]:hidden [&>div]:border-none [&>div]:shadow-none [&>div]:bg-transparent [&>div]:p-0">
                    <ProductCard
                      product={selectedProductForDetails}
                      onAddToCart={(p, c, f, s, id) => {
                        onAddToCart(p, c, f, s, id);
                        setSelectedProductForDetails(null);
                      }}
                      getProductDisplay={getProductDisplay}
                      currency={currency}
                      exchangeRate={exchangeRate}
                      searchQuery={searchQuery}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
