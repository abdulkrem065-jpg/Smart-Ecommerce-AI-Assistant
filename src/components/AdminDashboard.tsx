import React, { useState } from 'react';
import { Product, StoreCategory, Order, CarouselSlide } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone, 
  Layers, 
  UploadCloud, 
  Image as ImageIcon,
  Coins,
  MessageSquare,
  Settings,
  Sliders,
  ClipboardList,
  CheckCircle2,
  Trash,
  Check as CheckIcon,
  X as XIcon,
  User,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: StoreCategory[];
  salesData: { totalRevenue: number; totalOrders: number };
  
  // New props for absolute control over everything!
  logoUrl?: string;
  onUpdateLogo: (newLogoUrl: string) => void;
  
  whatsappNumber: string;
  onUpdateWhatsapp: (newNumber: string) => void;
  
  tickerMessage: string;
  onUpdateTicker: (newTicker: string) => void;
  
  paymentMethods: string[];
  onUpdatePaymentMethods: (newMethods: string[]) => void;
  
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  
  carouselSlides: CarouselSlide[];
  onUpdateSlides: (newSlides: CarouselSlide[]) => void;
  
  // Custom store operation callbacks
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (id: string, updated: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onBulkConvertCurrency?: (target: 'SAR' | 'YER') => void;
  onAddCategory: (category: Omit<StoreCategory, 'id'>) => void;
  onDeleteCategory: (id: string) => void;

  // Security props for independent admin flow
  adminPassword?: string;
  onUpdateAdminPassword?: (newPassword: string) => void;
  onLogoutAdmin?: () => void;
  
  exchangeRate?: number;
  onUpdateExchangeRate?: (newRate: number) => void;
  formatPrice?: (price: number) => string;

  deliveryFeeEnabled?: boolean;
  onUpdateDeliveryFeeEnabled?: (enabled: boolean) => void;
  deliveryFeeValue?: number;
  onUpdateDeliveryFeeValue?: (newVal: number) => void;
  currency?: 'SAR' | 'YER';
  onUpdateCurrency?: (curr: 'SAR' | 'YER') => void;

  taxEnabled?: boolean;
  onUpdateTaxEnabled?: (enabled: boolean) => void;
  taxRate?: number;
  onUpdateTaxRate?: (rate: number) => void;
  taxInTotal?: boolean;
  onUpdateTaxInTotal?: (inTotal: boolean) => void;
  taxVisible?: boolean;
  onUpdateTaxVisible?: (visible: boolean) => void;
  deliveryInTotal?: boolean;
  onUpdateDeliveryInTotal?: (inTotal: boolean) => void;
  deliveryVisible?: boolean;
  onUpdateDeliveryVisible?: (visible: boolean) => void;
}

export default function AdminDashboard({
  products,
  categories,
  salesData,
  logoUrl = '',
  onUpdateLogo,
  whatsappNumber,
  onUpdateWhatsapp,
  tickerMessage,
  onUpdateTicker,
  paymentMethods,
  onUpdatePaymentMethods,
  orders = [],
  onUpdateOrderStatus,
  onDeleteOrder,
  carouselSlides = [],
  onUpdateSlides,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBulkConvertCurrency,
  onAddCategory,
  onDeleteCategory,
  adminPassword = '1122',
  onUpdateAdminPassword,
  onLogoutAdmin,
  exchangeRate = 400,
  onUpdateExchangeRate,
  formatPrice,
  deliveryFeeEnabled = true,
  onUpdateDeliveryFeeEnabled,
  deliveryFeeValue = 20,
  onUpdateDeliveryFeeValue,
  currency = 'SAR',
  onUpdateCurrency,

  taxEnabled = true,
  onUpdateTaxEnabled,
  taxRate = 15,
  onUpdateTaxRate,
  taxInTotal = true,
  onUpdateTaxInTotal,
  taxVisible = true,
  onUpdateTaxVisible,
  deliveryInTotal = true,
  onUpdateDeliveryInTotal,
  deliveryVisible = true,
  onUpdateDeliveryVisible
}: AdminDashboardProps) {
  // Main admin control panel navigation tabs
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats'>('products');
  
  const displayPrice = (val: number) => {
    if (formatPrice) return formatPrice(val);
    return `${val.toFixed(1)} ريال`;
  };
  
  // Local input references with fallback
  const [inputLogoUrl, setInputLogoUrl] = useState(logoUrl);
  const [inputWhatsapp, setInputWhatsapp] = useState(whatsappNumber);
  const [inputTicker, setInputTicker] = useState(tickerMessage);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [inputPassword, setInputPassword] = useState(adminPassword);
  const [inputExchangeRate, setInputExchangeRate] = useState(exchangeRate);
  const [inputDeliveryFeeEnabled, setInputDeliveryFeeEnabled] = useState(deliveryFeeEnabled);
  const [inputDeliveryFeeValue, setInputDeliveryFeeValue] = useState(deliveryFeeValue);
  const [inputCurrency, setInputCurrency] = useState<'SAR' | 'YER'>(currency);

  const [inputTaxEnabled, setInputTaxEnabled] = useState(taxEnabled);
  const [inputTaxRate, setInputTaxRate] = useState(taxRate);
  const [inputTaxInTotal, setInputTaxInTotal] = useState(taxInTotal);
  const [inputTaxVisible, setInputTaxVisible] = useState(taxVisible);
  const [inputDeliveryInTotal, setInputDeliveryInTotal] = useState(deliveryInTotal);
  const [inputDeliveryVisible, setInputDeliveryVisible] = useState(deliveryVisible);

  // Settle local states in sync when props loaded
  React.useEffect(() => {
    setInputLogoUrl(logoUrl);
  }, [logoUrl]);

  React.useEffect(() => {
    setInputWhatsapp(whatsappNumber);
  }, [whatsappNumber]);

  React.useEffect(() => {
    setInputTicker(tickerMessage);
  }, [tickerMessage]);

  React.useEffect(() => {
    setInputPassword(adminPassword);
  }, [adminPassword]);

  React.useEffect(() => {
    setInputExchangeRate(exchangeRate);
  }, [exchangeRate]);

  React.useEffect(() => {
    setInputDeliveryFeeEnabled(deliveryFeeEnabled);
  }, [deliveryFeeEnabled]);

  React.useEffect(() => {
    setInputDeliveryFeeValue(deliveryFeeValue);
  }, [deliveryFeeValue]);

  React.useEffect(() => {
    setInputCurrency(currency);
  }, [currency]);

  React.useEffect(() => {
    setInputTaxEnabled(taxEnabled);
  }, [taxEnabled]);

  React.useEffect(() => {
    setInputTaxRate(taxRate);
  }, [taxRate]);

  React.useEffect(() => {
    setInputTaxInTotal(taxInTotal);
  }, [taxInTotal]);

  React.useEffect(() => {
    setInputTaxVisible(taxVisible);
  }, [taxVisible]);

  React.useEffect(() => {
    setInputDeliveryInTotal(deliveryInTotal);
  }, [deliveryInTotal]);

  React.useEffect(() => {
    setInputDeliveryVisible(deliveryVisible);
  }, [deliveryVisible]);

  // Product CRUD inputs state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productCurrency, setProductCurrency] = useState<'SAR' | 'YER'>('SAR');
  const [applyCurrencyToAll, setApplyCurrencyToAll] = useState<boolean>(false);
  const [productColors, setProductColors] = useState('');
  const [productFlavors, setProductFlavors] = useState('');
  const [productStock, setProductStock] = useState<number>(99);
  const [productImage, setProductImage] = useState('');
  const [productCode, setProductCode] = useState('');

  // Category CRUD inputs state
  const [newCatArabic, setNewCatArabic] = useState('');
  const [newCatEnglish, setNewCatEnglish] = useState('');

  // Slides CRUD inputs state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideDesc, setSlideDesc] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideBadge, setSlideBadge] = useState('');
  const [slideActionText, setSlideActionText] = useState('');
  const [slideActionType, setSlideActionType] = useState<'store' | 'ai'>('store');

  // Interactive feedback alerts
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const triggerNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 1. Files Uploaders
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.2 * 1024 * 1024) {
        triggerNotification('ملف الشعار كبير جداً! يرجى اختيار ملف أصغر من 1.2 ميغابايت للحفظ السريع.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          onUpdateLogo(base64);
          triggerNotification('تم تحديث شعار المتجر وهويتك البصرية بنجاح 🐺🎨');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.2 * 1024 * 1024) {
        triggerNotification('ملف الصورة كبير جداً! يرجى اختيار ملف صورة مناسب.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setProductImage(base64);
          triggerNotification('تم رفع ومعاينة صورة الصنف بنجاح 📸');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.2 * 1024 * 1024) {
        triggerNotification('ملف الصورة كبير جداً! يرجى اختيار ملف إعلاني مضغوط.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setSlideImage(base64);
          triggerNotification('تم رفع ومعالجة صورة الإعلان بنجاح 🌌');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCleanDuplicates = () => {
    const seenNames = new Set<string>();
    const seenCodes = new Set<string>();
    const duplicatesToClean: Product[] = [];

    products.forEach((p) => {
      const pName = p.name ? p.name.trim().toLowerCase() : '';
      const pCode = p.code ? p.code.trim().toLowerCase() : '';

      let isDup = false;
      if (pName && seenNames.has(pName)) {
        isDup = true;
      } else if (pCode && seenCodes.has(pCode)) {
        isDup = true;
      }

      if (isDup) {
        duplicatesToClean.push(p);
      } else {
        if (pName) seenNames.add(pName);
        if (pCode) seenCodes.add(pCode);
      }
    });

    if (duplicatesToClean.length === 0) {
      triggerNotification('✅ مستودعك نقي! لا توجد حالياً أي أصناف مكررة.', 'success');
      return;
    }

    const confirmMsg = `🔍 تم العثور على (${duplicatesToClean.length}) أصناف مكررة بنفس الاسم أو الكود في قاعدة البيانات.

المواد المكررة المراد تنظيفها:
${duplicatesToClean.map(d => `- ${d.name} (${d.code || 'بدون كود'})`).join('\n')}

هل أنت متأكد من حذف هذه المكررات نهائياً للاحتفاظ بنسخة واحدة فريدة ومميزة لكل صنف؟`;

    if (confirm(confirmMsg)) {
      duplicatesToClean.forEach((d) => {
        onDeleteProduct(d.id);
      });
      triggerNotification(`🧹 تم تطهير وتصفية المستودع وحذف ${duplicatesToClean.length} صنف مكرر بنجاح!`, 'success');
    }
  };

  // 2. Submit Handlers
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productCat) {
      triggerNotification('الرجاء كتابة اسم الصنف المعتمد وتحديد الفئة التابعة له!', 'info');
      return;
    }

    const lowercaseName = productName.trim().toLowerCase();
    const cleanCode = productCode.trim().toLowerCase();

    const isDuplicate = products.some(p => {
      if (editingId && p.id === editingId) return false;
      const sameName = p.name && p.name.trim().toLowerCase() === lowercaseName;
      const sameCode = cleanCode && p.code && p.code.trim().toLowerCase() === cleanCode;
      return sameName || sameCode;
    });

    if (isDuplicate) {
      triggerNotification('🚫 خطأ: صنف بنفس الاسم أو الكود مضاف مسبقاً! يفضل تعديل الصنف بدلاً من تكرار إضافته للحد من العشوائية.', 'info');
      return;
    }

    const defaultImg = productImage.trim() || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80`;

    if (applyCurrencyToAll && onBulkConvertCurrency) {
      onBulkConvertCurrency(productCurrency);
    }

    if (editingId) {
      onEditProduct(editingId, {
        name: productName,
        description: productDesc,
        category: productCat,
        price: Number(productPrice),
        stock: Number(productStock),
        image: defaultImg,
        code: productCode.trim() || `PROD-${Date.now().toString().slice(-4)}`,
        currency: productCurrency,
        colors: productColors ? productColors.split(',').map(s => s.trim()).filter(Boolean) : [],
        flavors: productFlavors ? productFlavors.split(',').map(s => s.trim()).filter(Boolean) : []
      });
      triggerNotification('تم تحديث الصنف ومزامنته مع المخازن ✨');
      setEditingId(null);
    } else {
      onAddProduct({
        name: productName,
        description: productDesc,
        category: productCat,
        price: Number(productPrice),
        stock: Number(productStock),
        image: defaultImg,
        code: productCode.trim() || `PROD-${Date.now().toString().slice(-4)}`,
        currency: productCurrency,
        colors: productColors ? productColors.split(',').map(s => s.trim()).filter(Boolean) : [],
        flavors: productFlavors ? productFlavors.split(',').map(s => s.trim()).filter(Boolean) : []
      });
      triggerNotification('تم تفويض الصنف بنجاح وإضافته للمخزن 🌱');
    }

    // Reset fields
    setProductName('');
    setProductDesc('');
    setProductCat(categories[0]?.name || '');
    setProductPrice(0);
    setProductCurrency('SAR');
    setApplyCurrencyToAll(false);
    setProductColors('');
    setProductFlavors('');
    setProductStock(99);
    setProductImage('');
    setProductCode('');
  };

  const startEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProductName(p.name);
    setProductDesc(p.description || '');
    setProductCat(p.category);
    setProductPrice(p.price);
    setProductCurrency(p.currency || 'SAR');
    setApplyCurrencyToAll(false);
    setProductColors(p.colors ? p.colors.join(', ') : '');
    setProductFlavors(p.flavors ? p.flavors.join(', ') : '');
    setProductStock(p.stock !== undefined ? p.stock : 99);
    setProductImage(p.image);
    setProductCode(p.code || '');
    setActiveTab('products');
    triggerNotification('تم نسخ بيانات الصنف للتعديل الفوري', 'info');
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatArabic.trim() || !newCatEnglish.trim()) {
      triggerNotification('يرجى كتابة الاسم بالعربية والإنجليزية للمزامنة!', 'info');
      return;
    }
    if (categories.some(c => c.name === newCatArabic.trim() || c.englishName.toLowerCase() === newCatEnglish.trim().toLowerCase())) {
      triggerNotification('هذا القسم مسجل ومحفوظ بالفعل!', 'info');
      return;
    }

    onAddCategory({
      name: newCatArabic.trim(),
      englishName: newCatEnglish.trim().toLowerCase().replace(/\s+/g, '_')
    });
    triggerNotification('تم إنشاء صنف فيدرالي وتثبيته بالمعرض 🎉');
    setNewCatArabic('');
    setNewCatEnglish('');
  };

  // Slide Banner CRUD
  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideDesc.trim() || !slideBadge.trim()) {
      triggerNotification('الرجاء تعبئة بيانات الإعلان الأساسية (العنوان والوصف والشارح)!', 'info');
      return;
    }

    const defaultSlideImg = slideImage.trim() || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&q=80";
    const updatedSlide: CarouselSlide = {
      id: editingSlideId || `slide-${Date.now()}`,
      title: slideTitle.trim(),
      description: slideDesc.trim(),
      badge: slideBadge.trim(),
      image: defaultSlideImg,
      actionText: slideActionText.trim() || "تصفح فوراً 🌟",
      actionType: slideActionType
    };

    let newSlides = [...carouselSlides];
    if (editingSlideId) {
      newSlides = newSlides.map(s => s.id === editingSlideId ? updatedSlide : s);
      triggerNotification('تم تحديث الشريحة الإعلانية بنجاح 🎨');
      setEditingSlideId(null);
    } else {
      newSlides.push(updatedSlide);
      triggerNotification('تم تشييد الشريحة الإعلانية الجديدة بنجاح بالواجهة ✨');
    }

    onUpdateSlides(newSlides);
    
    // reset slide form
    setSlideTitle('');
    setSlideDesc('');
    setSlideImage('');
    setSlideBadge('');
    setSlideActionText('');
    setSlideActionType('store');
  };

  const startEditSlide = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setSlideTitle(slide.title);
    setSlideDesc(slide.description);
    setSlideImage(slide.image);
    setSlideBadge(slide.badge);
    setSlideActionText(slide.actionText);
    setSlideActionType(slide.actionType);
    triggerNotification('تم نسخ بيانات الإعلان للتعديل والتحرير المباشر', 'info');
  };

  const handleDeleteSlide = (slideId: string) => {
    const filtered = carouselSlides.filter(s => s.id !== slideId);
    onUpdateSlides(filtered);
    triggerNotification('تم إزالة الشريحة الإعلانية من واجهة المتجر!');
  };

  // General Config Saving
  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLogo(inputLogoUrl);
    onUpdateWhatsapp(inputWhatsapp.replace(/[^\d]/g, ''));
    onUpdateTicker(inputTicker.trim());
    if (onUpdateAdminPassword && inputPassword !== adminPassword) {
      onUpdateAdminPassword(inputPassword);
    }
    if (onUpdateExchangeRate) {
      onUpdateExchangeRate(Number(inputExchangeRate));
    }
    if (onUpdateDeliveryFeeEnabled) {
      onUpdateDeliveryFeeEnabled(inputDeliveryFeeEnabled);
    }
    if (onUpdateDeliveryFeeValue) {
      onUpdateDeliveryFeeValue(Number(inputDeliveryFeeValue));
    }
    if (onUpdateCurrency) {
      onUpdateCurrency(inputCurrency);
    }
    if (onUpdateTaxEnabled) {
      onUpdateTaxEnabled(inputTaxEnabled);
    }
    if (onUpdateTaxRate) {
      onUpdateTaxRate(Number(inputTaxRate));
    }
    if (onUpdateTaxInTotal) {
      onUpdateTaxInTotal(inputTaxInTotal);
    }
    if (onUpdateTaxVisible) {
      onUpdateTaxVisible(inputTaxVisible);
    }
    if (onUpdateDeliveryInTotal) {
      onUpdateDeliveryInTotal(inputDeliveryInTotal);
    }
    if (onUpdateDeliveryVisible) {
      onUpdateDeliveryVisible(inputDeliveryVisible);
    }
    triggerNotification('تم حفظ جميع الضوابط الأساسية وتزامن الإعلانات والهاتف بنجاح! ⚙️📲');
  };

  // Payment configuration helpers
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentMethod.trim()) return;
    if (paymentMethods.includes(newPaymentMethod.trim())) {
      triggerNotification('طريقة الدفع هذه موجودة بالفعل!', 'info');
      return;
    }
    const updated = [...paymentMethods, newPaymentMethod.trim()];
    onUpdatePaymentMethods(updated);
    setNewPaymentMethod('');
    triggerNotification('تم تثبيت وسيلة دفع وسداد جديدة بالسلة 💳');
  };

  const handleRemovePayment = (index: number) => {
    const updated = paymentMethods.filter((_, idx) => idx !== index);
    onUpdatePaymentMethods(updated);
    triggerNotification('تم إزالة وسيلة الدفع من صفحة الدفع والCheckout');
  };

  // Financial statistics analytics
  const totalRevenueOfRegisteredOrders = orders.reduce((sum, ord) => {
    if (ord.status !== 'ملغي ❌') {
      return sum + ord.totalPrice;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-8" dir="rtl" id="admin-dashboard-root">
      
      {/* Page Title & Navigation Tabs row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 tracking-tight" id="dashboard-title">
            لوحة الإدارة الفنية والتحكم المتكاملة VIP 🛠️
          </h2>
          <p className="text-xs text-slate-400 mt-1" id="dashboard-subtitle">
            لديك سيطرة مطلقة على المخزون والأقسام، الإشراف على طلبات عملائك، تعديل إعلانات الواجهة، وبناء هوية المتجر واللوجو فورياً.
          </p>
          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="mt-3.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>تسجيل خروج المشرف 🚪</span>
            </button>
          )}
        </div>

        {/* Dynamic Navigation Controllers */}
        <div className="flex bg-[#060b18] p-1.5 rounded-2xl border border-blue-900/50 w-full xl:w-auto flex-wrap gap-1" id="dashboard-navigation">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            المخزن والأصناف
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            الأقسام ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
              activeTab === 'orders' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>الطلبات المستلمة</span>
            {orders.length > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'slides' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            إعلانات السلايدر ({carouselSlides.length})
          </button>

          <button
            onClick={() => setActiveTab('configuration')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'configuration' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            إعدادات الضبط العام ⚙️
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'stats' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            البيانات والتقارير 📊
          </button>
        </div>
      </div>

      {/* Real-time Toast notices */}
      {notification && (
        <div id="notification-banner" className="p-4 rounded-2xl flex items-center gap-3 transition-opacity duration-300 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-yellow-400 animate-bounce" />
          <p className="text-xs font-bold leading-normal">{notification.text}</p>
        </div>
      )}

      {/* METRICS & OVERVIEWS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-stats-grid">
        <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/35 hover:border-yellow-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">العوائد الفعلية النشطة</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-emerald-400">
              {displayPrice(Math.max(salesData.totalRevenue, totalRevenueOfRegisteredOrders))}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">تستبعد طلبيات العملاء الملغية</p>
          </div>
        </div>

        <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/35 hover:border-yellow-505/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">إجمالي صفقات وحجوزات السلة</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-white">
              {Math.max(salesData.totalOrders, orders.length)} طلبات دفعت
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">مقسمة ومثبتة بالنظام وفي الـ Local</p>
          </div>
        </div>

        <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/35 hover:border-yellow-505/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">الأصناف المتوفرة بالمعرض</span>
            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-450">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-white">{products.length} أصناف</h3>
            <p className="text-[10px] text-slate-500 mt-1">تدعم الإضافة والتعديل والفلترة</p>
          </div>
        </div>

        <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/35 hover:border-yellow-505/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">الطلبيات الجديدة "قيد الانتظار"</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-black text-amber-400">
              {orders.filter(o => o.status === 'قيد المعالجة').length} معالجة فورية
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">بحاجة لنقرة تحويل شحن</p>
          </div>
        </div>
      </div>

      {/* PRODUCTS MANAGING TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="products-tab-section">
          
          {/* Form */}
          <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 lg:col-span-1 shadow-md h-fit">
            <div className="flex items-center gap-2 mb-5 border-b border-blue-900/25 pb-4">
              <Sparkles className="w-4.5 h-4.5 text-yellow-505 animate-spin duration-[5500ms]" />
              <h3 className="text-sm font-black text-white">
                {editingId ? 'تعديل الصنف المحدد حالياً ✍️' : 'مذكرة إضافة صنف جديد بالمستودع 📦'}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">اسم الصنف المعروض للبيع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شحن 660 شدة فوري"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">وصف الصنف وشرح الموثوقية</label>
                <textarea
                  rows={2}
                  placeholder="اشرح ميزات الشحن أو وزن التوابل والكبوس الفاخر لتسهيل الاختيار..."
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                />
              </div>

              <div className="space-y-3 p-3 bg-[#060b18]/50 border border-blue-900/40 rounded-2xl">
                <label className="block text-[11px] font-black text-slate-300">عملة تسعير المنتج وتكلفته *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProductCurrency('SAR')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all text-[11px] font-bold cursor-pointer ${
                      productCurrency === 'SAR'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-extrabold shadow-sm'
                        : 'border-blue-900/40 bg-[#060b18] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇸🇦 سعودي (SAR)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductCurrency('YER')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all text-[11px] font-bold cursor-pointer ${
                      productCurrency === 'YER'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-extrabold shadow-sm'
                        : 'border-blue-900/40 bg-[#060b18] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇾🇪 يمني (YER)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">القيمة المسعرة *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                      placeholder="السعر..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">رمز الكود (الفلترة)</label>
                    <input
                      type="text"
                      placeholder="مثال: PUBG660"
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <span className="text-[10px] text-yellow-550 font-bold block mt-1 leading-normal" dir="rtl">
                  {productCurrency === 'SAR' ? (
                    <>
                      💸 المالي: <span className="underline font-mono">{(productPrice || 0).toFixed(1)} ر.س</span> يعادل باليمني: <span className="underline font-mono text-emerald-400 font-extrabold">{Math.round((productPrice || 0) * exchangeRate).toLocaleString('ar-YE')} ر.ي</span> (صرف: {exchangeRate})
                    </>
                  ) : (
                    <>
                      💸 المالي: <span className="underline font-mono">{Math.round(productPrice || 0).toLocaleString('ar-YE')} ر.ي</span> يعادل بالسعودي: <span className="underline font-mono text-emerald-400 font-extrabold">{((productPrice || 0) / exchangeRate).toFixed(1)} ر.س</span> (صرف: {exchangeRate})
                    </>
                  )}
                </span>

                {/* Apply choice to all previous products choice! */}
                <div className="pt-2 border-t border-blue-900/20 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="apply-currency-all"
                    checked={applyCurrencyToAll}
                    onChange={(e) => setApplyCurrencyToAll(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500 cursor-pointer"
                  />
                  <label htmlFor="apply-currency-all" className="text-[10px] text-slate-400 font-bold cursor-pointer select-none">
                    ⚠️ هل تريد اعتماد هذا الاختيار (العملة) للمنتجات السابقة بالمتجر؟
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">القسم المعتمد *</label>
                  <select
                    value={productCat}
                    onChange={(e) => setProductCat(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                  >
                    <option value="" disabled>-- اختر القسم --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">مخزون القوابل المتوفر</label>
                  <input
                    type="number"
                    min="0"
                    value={productStock}
                    onChange={(e) => setProductStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#060b18]/40 border border-blue-900/20 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 mb-1">الألوان المتاحة (مفصولة بـ ,)</label>
                  <input
                    type="text"
                    placeholder="مثال: أحمر, أزرق, أسود"
                    value={productColors}
                    onChange={(e) => setProductColors(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/50 rounded-xl text-[10px] text-white focus:border-yellow-500/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 mb-1">النكهات المتاحة (مفصولة بـ ,)</label>
                  <input
                    type="text"
                    placeholder="مثال: فراولة, نعناع, ليمون"
                    value={productFlavors}
                    onChange={(e) => setProductFlavors(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/50 rounded-xl text-[10px] text-white focus:border-yellow-500/50 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Product Image Option: URL or local file upload */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-slate-400">صورة الصنف (رابط مباشر أو رفع ملف)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (رابط خارجي)"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono text-left placeholder:text-right placeholder:font-sans"
                />
                <div className="relative border border-dashed border-blue-905/60 rounded-xl p-3 flex flex-col items-center justify-center hover:border-yellow-500/40 transition-colors h-16 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>أو ارفع ملف صورة سريع مباشرة</span>
                  </span>
                </div>
              </div>

              {productImage && (
                <div className="bg-[#060b18] p-2.5 rounded-xl border border-blue-900/50 flex items-center gap-3.5">
                  <img src={productImage} alt="" className="w-12 h-12 object-cover rounded-lg border border-yellow-550/20" referrerPolicy="no-referrer" />
                  <p className="text-[10px] text-emerald-400 font-bold">✓ تمت تهيئة صورة المعاينة الفورية للأصناف!</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center active:scale-95"
                >
                  {editingId ? 'حفظ تعديل الصنف' : 'تضمين الصنف وبثه'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setProductName('');
                      setProductDesc('');
                      setProductPrice(0);
                      setProductStock(99);
                      setProductImage('');
                      setProductCode('');
                    }}
                    className="px-3 py-2.5 bg-red-950/40 border border-red-900/30 text-red-450 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List display */}
          <div className="lg:col-span-2 bg-[#0b1329] p-5 rounded-3xl border border-blue-900/40 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/25 pb-3">
              <div>
                <h3 className="text-sm font-black text-white">كل المواد والأصناف المدونة بالمستودع</h3>
                <p className="text-[10px] text-slate-550 mt-0.5">اضغط على زر (حذف المكررات) لشطب النسخ المكررة من قاعدة البيانات فوراً بكبسة واحدة.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCleanDuplicates}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 border border-red-900/30 text-red-400 rounded-xl text-[10px] font-black hover:bg-red-900/25 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="حذف جميع الأصناف المكررة تلقائياً والاحتفاظ بنسخة واحدة فقط لكل صنف"
                >
                  <span>🧹 حذف المكررات</span>
                </button>
                <span className="text-[10px] bg-yellow-455/10 text-yellow-400 font-black px-2.5 py-1 rounded-full border border-yellow-500/10">
                  {products.length} صنف متوفر
                </span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px] space-y-2.5 pr-1">
              {products.map((p) => (
                <div key={p.id} className="bg-[#060b18]/60 p-3 rounded-2xl border border-blue-900/30 hover:border-yellow-500/25 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-blue-900/45" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate leading-normal">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-sm mt-0.5">{p.description || "لا يوجد وصف مدون للصنف..."}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[9px] bg-[#111a2f] text-slate-400 px-2 py-0.5 rounded-md font-bold">{p.category}</span>
                        <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md font-mono">{p.code || p.id}</span>
                        <span className="text-[9px] text-slate-450">المخزن: {p.stock !== undefined ? p.stock : 99} حبة</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left" dir="rtl">
                      <span className="text-yellow-400 font-black text-xs block font-mono">{(p.price || 0).toFixed(1)} ر.س</span>
                      {exchangeRate && (
                        <span className="text-emerald-400 font-bold text-[10px] block font-mono">{Math.round((p.price || 0) * exchangeRate).toLocaleString('ar-YE')} ر.ي</span>
                      )}
                    </div>
                    <div className="flex items-center bg-[#0b1329] border border-blue-900/50 rounded-xl p-0.5">
                      <button
                        onClick={() => startEditProduct(p)}
                        className="p-1.5 hover:bg-slate-800 rounded text-slate-350 hover:text-white transition-colors cursor-pointer"
                        title="تعديل هذا الصنف"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف الصنف [${p.name}] من المستودع نهائياً؟`)) {
                            onDeleteProduct(p.id);
                            triggerNotification('تم مسح وإزالة الصنف من المخازن والموقع ✂️');
                          }
                        }}
                        className="p-1.5 hover:bg-red-950/40 rounded text-slate-400 hover:text-red-450 transition-colors cursor-pointer"
                        title="حذف هذا الصنف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CATEGORIES MANAGING TAB */}
      {activeTab === 'categories' && (
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
                <label className="block text-[11px] font-bold text-slate-400 mb-1">الاسم التعريفي بالإنجليزية (قالب) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: luxury_spices"
                  value={newCatEnglish}
                  onChange={(e) => setNewCatEnglish(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                تحديث قائمة الفئات بالمعرض
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-white border-b border-blue-900/25 pb-3">أقسام وفئات المعرض النشطة حالياً</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => {
                const isSystemSeed = ['cat-1', 'cat-2', 'cat-3', 'cat-4'].includes(c.id);
                return (
                  <div key={c.id} className="bg-[#060b18]/60 p-4 rounded-xl border border-blue-900/30 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{c.name}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-mono">{c.englishName}</p>
                    </div>

                    {!isSystemSeed ? (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من مسح تصنيف [${c.name}]؟ سيتم فقط حذف التصنيف من شاشات الفلترة بموقع الزوار.`)) {
                            onDeleteCategory(c.id);
                            triggerNotification('تم حذف التصنيف الخاص بالمعرض 🗑️');
                          }
                        }}
                        className="p-1 hover:bg-red-950/40 rounded text-slate-500 hover:text-red-450 transition-colors cursor-pointer"
                        title="حذف هذا القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[8px] bg-blue-950 text-blue-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase">أساسي</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CUSTOMER ORDERS MANAGING TAB */}
      {activeTab === 'orders' && (
        <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-sm space-y-4 animate-fade-in" id="orders-tab-section">
          <div className="flex justify-between items-center border-b border-blue-900/25 pb-4">
            <div>
              <h3 className="text-sm font-black text-white">سجل طلبات وحجوزات السلة المستلمة</h3>
              <p className="text-[10px] text-slate-400 mt-1">تتبع الطلبات الصادرة من الزبائن، غير حالات شحن الخدمة، واحذف الطلبيات المنتهية أو الملغية.</p>
            </div>
            
            <span className="text-[10px] bg-yellow-500/15 text-yellow-405 font-black border border-yellow-500/25 px-3 py-1 rounded-full">
              {orders.length} طلب سلة إجمالي
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-4">
              <ClipboardList className="w-14 h-14 mx-auto text-yellow-500/10 animate-pulse" />
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-slate-450">لا يوجد طلبيات مسجلة حالياً بنظام الكبينة</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  قم بوضع بعض المواد من المعرض في السلة الفاخرة ثم انقر فوق زر "إكمال وحجز المنتجات" لتجربة عملية الشحن الفوري ومشاهدة النتائج الرائعة هنا!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const getStatusStyle = (status: Order['status']) => {
                  switch (status) {
                    case 'قيد المعالجة':
                      return 'bg-amber-500/15 text-amber-500 border border-amber-500/30';
                    case 'تم التجهيز للشحن':
                      return 'bg-blue-500/15 text-blue-450 border border-blue-500/30';
                    case 'تم التسليم 🟢':
                      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
                    case 'ملغي ❌':
                      return 'bg-red-500/15 text-red-400 border border-red-500/30';
                    default:
                      return 'bg-slate-800 text-slate-300';
                  }
                };

                return (
                  <div key={order.id} className="bg-[#060b18]/65 p-5 sm:p-6 rounded-2xl border border-blue-900/40 hover:border-blue-800/40 transition-all space-y-4">
                    
                    {/* Header bar of order card */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-blue-900/25 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-yellow-400 font-mono">{order.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>تاريخ الطلب: {order.date}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status switches and delete buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-900/45 rounded-xl p-1 text-[10px]">
                          <span className="px-1.5 text-slate-400 font-bold">تغيير الحالة:</span>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'قيد المعالجة')}
                            className="px-2 py-0.5 rounded hover:bg-amber-600/10 text-amber-450 font-bold"
                          >
                            معالجة
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'تم التجهيز للشحن')}
                            className="px-2 py-0.5 rounded hover:bg-blue-600/10 text-blue-400 font-bold"
                          >
                            للشحن
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'تم التسليم 🟢')}
                            className="px-2 py-0.5 rounded hover:bg-emerald-600/15 text-emerald-400 font-bold"
                          >
                            تسليم ✅
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ملغي ❌')}
                            className="px-2 py-0.5 rounded hover:bg-red-605/10 text-red-400 font-bold"
                          >
                            إلغاء ❌
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(`هل ترغب في حذف وتنسيق الطلب رقم [${order.id}] نهائياً من سجلات الإدارة الفنية؟`)) {
                              onDeleteOrder(order.id);
                              triggerNotification('تم ترحيل وحذف الطلب بنجاح.');
                            }
                          }}
                          className="p-1.5 bg-red-950/20 text-red-400 hover:bg-red-900/20 rounded-xl transition-all cursor-pointer border border-red-900/20"
                          title="حذف الطلب نهائياً"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Details info block */}
                      <div className="bg-[#0b1329] p-4 rounded-xl space-y-1.5 border border-blue-900/25">
                        <h4 className="font-extrabold text-slate-300 border-b border-blue-900/20 pb-1 mb-2">معلومات العميل</h4>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span><strong>العميل:</strong> {order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          <span><strong>الجوال:</strong> <span className="font-mono">{order.phone}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span><strong>العنوان:</strong> {order.address}</span>
                        </div>
                      </div>

                      {/* Payment and Pricing details */}
                      <div className="bg-[#0b1329] p-4 rounded-xl space-y-1.5 border border-blue-900/25">
                        <h4 className="font-extrabold text-slate-300 border-b border-blue-900/20 pb-1 mb-2">تفاصيل الدفع وبث الفاتورة</h4>
                        <div>
                          <span><strong>طريقة التسوية:</strong> <span className="text-yellow-400 font-bold">{order.paymentMethod}</span></span>
                        </div>
                        <div>
                          <span><strong>حساب الإرجاع:</strong> واتساب الإدارة المباشر</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-xs bg-yellow-505/10 text-yellow-405 font-black px-2.5 py-1 rounded border border-yellow-500/10">
                            القيمة الإجمالية: {displayPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Ordered Products items list */}
                      <div className="bg-[#0b1329] p-4 rounded-xl border border-blue-900/25 md:col-span-1">
                        <h4 className="font-extrabold text-slate-300 border-b border-blue-900/20 pb-1 mb-2">العناصر المحجوزة ({order.items?.length || 0})</h4>
                        <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] bg-[#060b18]/45 p-1.5 rounded border border-blue-950">
                              <div className="flex flex-col min-w-0">
                                <span className="text-white font-bold truncate max-w-[130px]">{item.product.name}</span>
                                {(item.selectedColor || item.selectedFlavor) && (
                                  <div className="flex gap-1.5 mt-0.5 text-[8px] font-bold">
                                    {item.selectedColor && <span className="text-yellow-400">اللون: {item.selectedColor}</span>}
                                    {item.selectedFlavor && <span className="text-emerald-450">النكهة: {item.selectedFlavor}</span>}
                                  </div>
                                )}
                              </div>
                              <span className="text-slate-400 flex-shrink-0">({item.quantity} حبة) - <span className="text-yellow-500 font-bold font-mono">{displayPrice(item.product.price)}</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* PROMO ADS & SLIDES MANAGING TAB */}
      {activeTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="slides-tab-section">
          
          {/* Slide Builder form */}
          <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 h-fit">
            <div className="flex items-center gap-2 mb-4 border-b border-blue-900/25 pb-3">
              <Sliders className="w-4.5 h-4.5 text-yellow-400" />
              <h3 className="text-xs font-black text-white">
                {editingSlideId ? 'تعديل الشريحة الإعلانية المتاحة ✍️' : 'تضمين شريحة أو إعلان ترويجي جديد 🎨'}
              </h3>
            </div>

            <form onSubmit={handleSlideSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">العنوان الترويجي البارز *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خصم 20% على شحن ببجي الكبوس الفري"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">الوصف الفرعي للإعلان وشرح الامتياز *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: اشحن شدات ألعابك في ثواني بأرخص سعر ووفر وقتك وعقدة الشحن..."
                  value={slideDesc}
                  onChange={(e) => setSlideDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">الشارح البارز للزاوية *</label>
                  <input
                    type="text"
                    required
                    placeholder="شحن ألعاب فوري ⚡"
                    value={slideBadge}
                    onChange={(e) => setSlideBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">نص زر التوجيه وسحب انتباه</label>
                  <input
                    type="text"
                    placeholder="طلب الشحن الفوري"
                    value={slideActionText}
                    onChange={(e) => setSlideActionText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">اجراء وتوجيه الزر التبادلي</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-350 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="actionType"
                      checked={slideActionType === 'store'}
                      onChange={() => setSlideActionType('store')}
                      className="accent-yellow-400"
                    />
                    <span>تحويل لكتالوج المعروضات بالمتجر</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-350 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="actionType"
                      checked={slideActionType === 'ai'}
                      onChange={() => setSlideActionType('ai')}
                      className="accent-yellow-400"
                    />
                    <span>فتح نافذة مستشار الذكاء الاصطناعي</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400">رابط صورة شريحة الإعلان (أو رفع ملف)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (رابط الصورة)"
                  value={slideImage}
                  onChange={(e) => setSlideImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-left"
                />
                
                <div className="relative border border-dashed border-blue-905/60 rounded-xl p-3 flex flex-col items-center justify-center hover:border-yellow-500/40 transition-colors h-14 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlideImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>أو ارفع خلفية الإعلان فورياً من جوالك</span>
                  </span>
                </div>
              </div>

              {slideImage && (
                <div className="bg-[#060b18] p-2 rounded-xl border border-blue-900/50 flex items-center gap-3">
                  <img src={slideImage} alt="" className="w-14 h-9 object-cover rounded border border-yellow-550/20" referrerPolicy="no-referrer" />
                  <p className="text-[9px] text-emerald-400 font-bold">✓ تمت تعبئة صورة معاينة الإعلانات بالسلايدر!</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {editingSlideId ? 'حفظ تعديل الإعلان 💾' : 'تثبيت الإعلان فورياً بالمنزلقة 🚀'}
                </button>
                {editingSlideId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSlideId(null);
                      setSlideTitle('');
                      setSlideDesc('');
                      setSlideImage('');
                      setSlideBadge('');
                      setSlideActionText('');
                      setSlideActionType('store');
                    }}
                    className="px-3.5 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Active slides list */}
          <div className="lg:col-span-2 bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-white border-b border-blue-900/25 pb-3">تنسيق ومعاينة شرائح السلايدر النشطة بالواجهة</h3>
            
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {carouselSlides.map((slide) => (
                <div key={slide.id} className="bg-[#060b18]/60 p-4 rounded-xl border border-blue-900/35 hover:border-yellow-500/10 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <img src={slide.image} alt="" className="w-24 h-16 object-cover rounded-lg border border-blue-900/40" referrerPolicy="no-referrer" />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-yellow-405/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded font-black font-sans">{slide.badge}</span>
                      <h4 className="font-extrabold text-xs text-white truncate">{slide.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{slide.description}</p>
                    <p className="text-[9px] text-slate-500 font-bold">التوجيه: {slide.actionType === 'store' ? 'كتالوج البضائع' : 'استفسارات واتخاذ قرار الـ AI'} • نص الزر ({slide.actionText})</p>
                  </div>

                  <div className="flex gap-2 bg-[#0b1329] border border-blue-900/50 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => startEditSlide(slide)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-350 hover:text-white transition-colors cursor-pointer"
                      title="تحرير وتعديل بيانات الإعلان"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من حذف هذا الإعلان الترويجي؟ لن يعود ظاهراً للزوار بالسلايدر.')) {
                          handleDeleteSlide(slide.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-950/40 rounded text-slate-400 hover:text-red-450 transition-colors cursor-pointer"
                      title="مسح الإعلان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RE-ARCHITECTED CONFIGURATOR & IDENTITY PROFILE */}
      {activeTab === 'configuration' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" id="configs-tab-section">
          
          {/* Main system controls */}
          <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-black text-white">إعدادات هوية متجر ومستودع الذيباني VIP</h3>
              <p className="text-xs text-slate-400 mt-1">تحديث رقم هاتف إلاملاء، لوحة تحرك شريط الأخبار العلوي، وتخصيص طرق تحصيل السداد.</p>
            </div>

            <form onSubmit={handleSaveConfigs} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Whatsapp Active target support */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-355 mb-2 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>رقم هاتف واتساب المستلم للطلبيات والفواتير *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="967770493341"
                    value={inputWhatsapp}
                    onChange={(e) => setInputWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-left"
                  />
                  <p className="text-[9px] text-slate-500 mt-1">تكتب الأرقام بالصيغة الدولية مفتاح الدولة أولاً كامل وبدون الـ (+) أو (00).</p>
                </div>

                {/* Logo input URL mapping */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-355 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-yellow-400" />
                    <span>رابط شعار (لوجو) المتجر بديل الافتراضي</span>
                  </label>
                  <input
                    type="url"
                    placeholder="ضع رابط صورة الشعار هنا..."
                    value={inputLogoUrl}
                    onChange={(e) => setInputLogoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-left"
                  />
                  <p className="text-[9px] text-slate-500 mt-1">يحفظ رغبتك بالهيدر واللوحة الخلفية فورياً وبشكل دائم.</p>
                </div>
              </div>

              {/* Ticker marquee message */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-355 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-yellow-405" />
                  <span>رسالة شريط الإعلانات الفوقاني (Scrolling Marquee Announcement) *</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="مثال: خصومات حصرية لليوم فقط على شحن فري فاير وببجي بأقل الفواريق الممكنة..."
                  value={inputTicker}
                  onChange={(e) => setInputTicker(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none leading-relaxed"
                />
                <p className="text-[9px] text-slate-500">هذا النص يتم تمريره بشكل لامتناهي في أعلى الهيدر لجميع الزائرين والزبائن.</p>
              </div>

              {/* Security Admin Password Input */}
              <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-3">
                <label className="block text-xs font-bold text-yellow-405 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-yellow-450 animate-spin duration-[9000ms]" />
                  <span>رمز الحماية السري لتأمين لوحة الإدارة (Admin Password) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 1122"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-center tracking-widest text-base"
                />
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  هذا الرمز السري يحمي لوحة إدارة المستودع من دخول الزائرين العاديين، مما يضمن استقلالية وأمان تامين. (الرمز الافتراضي: <span className="text-yellow-450 font-black font-mono">1122</span>)
                </p>
              </div>

              {/* Currency Selection for Yemeni or Saudi */}
              <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-3">
                <label className="block text-xs font-bold text-yellow-405 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>العملة الافتراضية للمتجر (Default Currency) *</span>
                </label>
                <div className="grid grid-cols-2 gap-3" dir="rtl">
                  <button
                    type="button"
                    onClick={() => setInputCurrency('SAR')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-right ${
                      inputCurrency === 'SAR'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-extrabold shadow-sm'
                        : 'border-blue-900/60 bg-[#060b18] text-slate-400 hover:text-white hover:border-blue-900'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-black">ريال سعودي (SAR)</span>
                      <span className="text-[10px] opacity-70">ر.س - العملة السعودية</span>
                    </div>
                    {inputCurrency === 'SAR' && <CheckIcon className="w-4.5 h-4.5 text-yellow-500" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputCurrency('YER')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-right ${
                      inputCurrency === 'YER'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 font-extrabold shadow-sm'
                        : 'border-blue-900/60 bg-[#060b18] text-slate-400 hover:text-white hover:border-blue-900'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-black">ريال يمني (YER)</span>
                      <span className="text-[10px] opacity-70">ر.ي - العملة اليمنية</span>
                    </div>
                    {inputCurrency === 'YER' && <CheckIcon className="w-4.5 h-4.5 text-yellow-500" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  قم بتعيين العملة الرسمية للمتجر التي يتصفح ويشتري بها الزبائن بشكل تلقائي. يمكن للزبائن تغييرها يدوياً من واجهة المتجر إن لزم الأمر.
                </p>
              </div>

              {/* Currency Exchange Rate Input for Yemen Rials */}
              <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-3">
                <label className="block text-xs font-bold text-yellow-405 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span>سعر صرف 1 ريال سعودي مقابل الريال اليمني (Exchange Rate) *</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="400"
                  value={inputExchangeRate}
                  onChange={(e) => setInputExchangeRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-center text-base"
                />
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  هذه القيمة تستخدم لحساب وتحويل أسعار المنتجات والفواتير تلقائياً عند قيام العميل باختيار العملة اليمنية (ر.ي) بدلاً من العملة السعودية (ر.س). (القيمة الافتراضية الموصى بها: <span className="text-yellow-450 font-black font-mono">400</span>)
                </p>
              </div>

              {/* Delivery Fee settings control */}
              <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-yellow-405 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="deliveryFeeEnabledToggle">
                    <Sliders className="w-4 h-4 text-yellow-500" />
                    <span>تفعيل وإظهار عمولة التوصيل بالفواتير</span>
                  </label>
                  <input
                    type="checkbox"
                    id="deliveryFeeEnabledToggle"
                    checked={inputDeliveryFeeEnabled}
                    onChange={(e) => setInputDeliveryFeeEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                  />
                </div>
                
                {inputDeliveryFeeEnabled && (
                  <div className="space-y-4 pt-3 border-t border-blue-900/20">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400">قيمة عمولة التوصيل الافتراضية (ر.س) *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={inputDeliveryFeeValue}
                        onChange={(e) => setInputDeliveryFeeValue(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-center"
                      />
                      <p className="text-[9px] text-slate-500">
                        القيمة بالريال السعودي (سيتم تحويلها لليمني تلقائياً بسعر الصرف عند التفعيل).
                      </p>
                    </div>

                    {/* Advanced delivery total computation toggle */}
                    <div className="flex items-center justify-between bg-[#0b1329]/80 p-2.5 rounded-lg border border-blue-900/25">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="deliveryInTotalToggle">
                        <span>إضافة قيمة التوصيل إلى مجموع الفاتورة النهائي</span>
                      </label>
                      <input
                        type="checkbox"
                        id="deliveryInTotalToggle"
                        checked={inputDeliveryInTotal}
                        onChange={(e) => setInputDeliveryInTotal(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                      />
                    </div>

                    {/* Advanced delivery visibility toggles */}
                    <div className="flex items-center justify-between bg-[#0b1329]/80 p-2.5 rounded-lg border border-blue-900/25">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="deliveryVisibleToggle">
                        <span>إظهار رسام التوصيل للعميل بالمتجر وواتساب</span>
                      </label>
                      <input
                        type="checkbox"
                        id="deliveryVisibleToggle"
                        checked={inputDeliveryVisible}
                        onChange={(e) => setInputDeliveryVisible(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  يمكنك من هنا إخفاء عمولة التوصيل نهائياً من سلة المشتريات والفواتير وواتساب أو التحكم في قيمتها ونسبتها الافتراضية وهل تجمع في الفاتورة أم لا.
                </p>
              </div>

              {/* Tax / VAT dynamic settings panel */}
              <div className="bg-[#060b18] p-4.5 rounded-xl border border-yellow-500/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-yellow-405 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="taxEnabledToggle">
                    <Sliders className="w-4 h-4 text-yellow-500" />
                    <span>تفعيل حساب ضريبة القيمة المضافة (VAT)</span>
                  </label>
                  <input
                    type="checkbox"
                    id="taxEnabledToggle"
                    checked={inputTaxEnabled}
                    onChange={(e) => setInputTaxEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                  />
                </div>

                {inputTaxEnabled && (
                  <div className="space-y-4 pt-3 border-t border-blue-900/20">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400">نسبة الضريبة المضافة المعتمدة % *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={inputTaxRate}
                        onChange={(e) => setInputTaxRate(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none font-mono text-center"
                      />
                      <p className="text-[9px] text-slate-500">
                        النسبة المئوية الافتراضية لضريبة القيمة المضافة (مثال: 15 للضريبة بنسبة 15%).
                      </p>
                    </div>

                    {/* Tax inclusion toggle */}
                    <div className="flex items-center justify-between bg-[#0b1329]/80 p-2.5 rounded-lg border border-blue-900/25">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="taxInTotalToggle">
                        <span>إضافة قيمة الضريبة لمجمل الفاتورة المطلوب سدادها</span>
                      </label>
                      <input
                        type="checkbox"
                        id="taxInTotalToggle"
                        checked={inputTaxInTotal}
                        onChange={(e) => setInputTaxInTotal(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                      />
                    </div>

                    {/* Tax visibility toggle */}
                    <div className="flex items-center justify-between bg-[#0b1329]/80 p-2.5 rounded-lg border border-blue-900/25">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="taxVisibleToggle">
                        <span>إظهار بند الضريبة للعملاء بالمتجر وتفصيل الواتساب</span>
                      </label>
                      <input
                        type="checkbox"
                        id="taxVisibleToggle"
                        checked={inputTaxVisible}
                        onChange={(e) => setInputTaxVisible(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  يمكنك تخصيص وحساب ضريبة الـ VAT، مع التحكم برغبتك في إدراجها داخل المجموع الإجمالي الفعلي للطلب، أو إبرازها كبند مالي للعميل بالمتجر وإرسالات واتساب المعززة.
                </p>
              </div>

              {/* Upload logo block helper */}
              <div className="bg-[#060b18] p-4 rounded-xl border border-blue-900/40 space-y-3">
                <h4 className="text-[11px] font-black text-yellow-500 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" />
                  <span>ترقية وتغيير الشعار الفوري من جهازك</span>
                </h4>
                <div className="relative border border-dashed border-blue-805 rounded-xl p-4 flex flex-col items-center justify-center hover:border-yellow-550 transition-colors h-14 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>انقر لرفع ملف صورة كشعار للمتجر فورياً (أقل من 1.2 ميغابايت)</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center "
                >
                  حفظ الضبط الأساسي والإرشادات ⚙️
                </button>
              </div>

            </form>

            {/* Payment options management list */}
            <div className="bg-[#060b18] p-5 rounded-xl border border-blue-900/40 space-y-4">
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>تعديل وحذف خيارات السداد ووسائل الدفع بموقع الشراء</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">تتحكم بما يشاهده العميل في خطوة الدفع عند إنشاء السجل.</p>
              </div>

              <form onSubmit={handleAddPayment} className="flex gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="مثال: يمن كاش موبايل 💸"
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#0b1329] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-blue-950 px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer hover:bg-yellow-450 active:scale-95 transition-all text-center flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-1">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="bg-[#0b1329]/90 border border-blue-900/35 px-3 py-1.5 rounded-xl text-[10px] text-slate-250 flex items-center gap-1.5">
                    <span>{method}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePayment(index)}
                      className="text-red-400 hover:text-red-500 font-bold ml-1.5 text-xs focus:outline-none cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Current Live Preview Identity card */}
          <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 flex flex-col items-center justify-center space-y-6 md:col-span-1 h-fit">
            <h4 className="text-xs font-black text-slate-350 tracking-wide select-none">معاينة الهوية وشريط الأخبار</h4>
            
            <div className="w-full bg-[#060b18] border border-yellow-500/25 p-4 rounded-2xl text-center space-y-4">
              {/* Promo marquee preview simulated */}
              <div className="bg-gradient-to-r from-blue-950 via-[#0f172a] to-blue-950 text-[9px] text-yellow-400 py-1.5 px-3 rounded-lg border border-yellow-500/10 truncate font-semibold overflow-hidden">
                <marquee direction="right" scrollamount="3">{inputTicker || tickerMessage}</marquee>
              </div>

              {/* Logo preview */}
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-yellow-500 via-amber-500 to-yellow-600 p-1 shadow-2xl flex items-center justify-center overflow-hidden border border-yellow-405 mx-auto">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="الشعار النشط"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 select-none">
                    <span className="text-4xl text-blue-955">🐺</span>
                    <span className="text-[9px] text-blue-950 font-black mt-1">الافتراضي</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-white">مستودع ومتجر الذيباني VIP</p>
                <p className="text-[10px] text-slate-500 leading-normal">رقم الامتياز المعتمد: {inputWhatsapp || whatsappNumber}</p>
              </div>
            </div>

            <div className="p-4 bg-[#060b18]/40 border border-blue-900/25 rounded-xl text-[10px] text-slate-450 leading-relaxed space-y-1">
              <span className="font-bold text-slate-300 block mb-0.5">ℹ️ معلومات تخزين البيانات المدمجة</span>
              <p>
                يتم مزامنة الشعار وطرق الدفع والرسائل تلقائياً في قاعدة البيانات وتحديثها فورياً للعملاء للتجربة الكاملة.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* FULL DETAILED REPORTS AND METRICS */}
      {activeTab === 'stats' && (
        <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-sm space-y-6 animate-fade-in" id="stats-tab-section">
          <div>
            <h3 className="text-sm font-black text-white">البيانات المالية وتقارير التفاعلات الفنية</h3>
            <p className="text-xs text-slate-400 mt-1">مخططات ملخصة لنسب الأداء الفعلي المستوحاة من حجوزات السلة النشطة للتجربة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#060b18] p-5 rounded-2xl border border-blue-900/35 text-right">
              <h4 className="text-xs font-black text-slate-300 pb-3 border-b border-blue-900/15 mb-4">قوائم الإحصاء المتراكمة</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>إجمالي الطلبيات المسجلة:</span>
                  <span className="font-bold text-white font-mono">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>الطلبيات الناجحة (تم التسليم):</span>
                  <span className="font-bold text-emerald-400 font-mono">{orders.filter(o => o.status === 'تم التسليم 🟢').length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>الطلبيات الملغية التاركة:</span>
                  <span className="font-bold text-red-400 font-mono">{orders.filter(o => o.status === 'ملغي ❌').length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>طلبات قيد الشحن والتجهيز:</span>
                  <span className="font-bold text-blue-400 font-mono">{orders.filter(o => o.status === 'تم التجهيز للشحن').length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-3 border-t border-blue-900/15">
                  <span className="font-extrabold text-white">المبيعات الصافية:</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">{displayPrice(totalRevenueOfRegisteredOrders)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#060b18] p-5 rounded-2xl border border-blue-900/35 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 text-yellow-405 rounded-full flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-white">نسبة تحويل المبيعات للموقع</p>
                <p className="text-[10px] text-slate-450 leading-relaxed max-w-xs mx-auto">
                  جميع العمليات الفورية شفرت مسبقاً وتعتمد سياسة تشغيل واتساب المباشرة دون وسيط لضمان أقل عمولات بالدفع الداعم.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
