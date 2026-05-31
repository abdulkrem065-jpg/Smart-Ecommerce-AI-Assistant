import React, { useState } from 'react';
import { Product, StoreCategory, Order, CarouselSlide, Staff, UserSession } from '../types';
import { NICHES } from '../data';
import { isModuleEnabled } from '../core/moduleLoader';
import { DollarExchangePricing } from '../modules/games_hyper/DollarExchangePricing';
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
  AlertCircle,
  Wallet,
  FileText,
  Award,
  Lightbulb,
  BarChart3,
  CreditCard,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';

const getProjectTypeNiche = (): 'game' | 'pharmacy' | 'supermarket' | 'school' | 'tailor' | 'legal' | 'consulting' | 'hyper' | null => {
  const envVal = (((import.meta as any).env?.VITE_PROJECT_TYPE) || "").toLowerCase().trim();
  if (!envVal) return null;
  if (envVal.includes("game") || envVal.includes("charge")) return "game";
  if (envVal.includes("pharmacy") || envVal.includes("medicine")) return "pharmacy";
  if (envVal.includes("supermarket") || envVal.includes("grocery")) return "supermarket";
  if (envVal.includes("school") || envVal.includes("education")) return "school";
  if (envVal.includes("tailor")) return "tailor";
  if (envVal.includes("legal") || envVal.includes("law")) return "legal";
  if (envVal.includes("consulting") || envVal.includes("corporate")) return "consulting";
  if (envVal.includes("hyper") || envVal.includes("multiproject")) return "hyper";
  return null;
};

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
  // Game charging gateway details
  siteName?: string;
  gameApiUrl?: string;
  gameApiKey?: string;
  gameApiProvider?: string;
  gameApiEnabled?: boolean;
  gameApiLocalServerUrl?: string;
  gameApiLocalAccountNumber?: string;
  gameApiLocalUsername?: string;
  gameApiLocalPassword?: string;
  gameApiLocalEmployeeId?: string;
  gameApiLocalSourceId?: string;
  onUpdateGameApiSettings?: (
    url: string, 
    key: string, 
    provider: string, 
    enabled: boolean,
    localUrl?: string,
    localAcc?: string,
    localUser?: string,
    localPass?: string,
    localEmp?: string,
    localSrc?: string
  ) => void;
  // Payment Gateway API details
  payApiUrl?: string;
  payApiToken?: string;
  payApiProvider?: string;
  payApiMerchantId?: string;
  payApiEnabled?: boolean;
  onUpdatePayApiSettings?: (url: string, token: string, provider: string, merchantId: string, enabled: boolean) => void;
  activeNicheId?: 'game' | 'pharmacy' | 'supermarket' | 'school' | 'tailor' | 'legal' | 'consulting' | 'hyper';
  onApplyNicheTemplate?: (nicheId: 'game' | 'pharmacy' | 'supermarket' | 'school' | 'tailor' | 'legal' | 'consulting' | 'hyper') => void;
  userSession?: UserSession;
  usdToSar?: number;
  onUpdateUsdToSar?: (rate: number) => void;
  usdToYer?: number;
  onUpdateUsdToYer?: (rate: number) => void;
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
  onUpdateDeliveryVisible,
  siteName = 'متجر ومستودع الذيباني VIP',
  gameApiUrl = '',
  gameApiKey = '',
  gameApiProvider = 'default',
  gameApiEnabled = false,
  gameApiLocalServerUrl = '',
  gameApiLocalAccountNumber = '',
  gameApiLocalUsername = '',
  gameApiLocalPassword = '',
  gameApiLocalEmployeeId = '',
  gameApiLocalSourceId = '',
  onUpdateGameApiSettings,
  payApiUrl = '',
  payApiToken = '',
  payApiProvider = 'simulated',
  payApiMerchantId = '',
  payApiEnabled = false,
  onUpdatePayApiSettings,
  activeNicheId = 'game',
  onApplyNicheTemplate,
  userSession,
  usdToSar = 3.75,
  onUpdateUsdToSar,
  usdToYer = 530,
  onUpdateUsdToYer
}: AdminDashboardProps) {
  // Main admin control panel navigation tabs
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff'>(() => {
    if (userSession?.role === 'staff') {
      if (userSession.permissions?.canEditInventory) return 'products';
      if (userSession.permissions?.canManageOrders) return 'orders';
      if (userSession.permissions?.canViewFinance) return 'stats';
      return 'orders';
    }
    return 'products';
  });
  
  // Advanced reporting & reconciliation states
  const [reportsSubTab, setReportsSubTab] = useState<'reconciliation' | 'analytics'>('reconciliation');
  const [selectedFund, setSelectedFund] = useState<string>('all');
  const [reconciliationStatusFilter, setReconciliationStatusFilter] = useState<'all' | 'ready' | 'pending'>('all');
  const [excludePastOrders, setExcludePastOrders] = useState<boolean>(true);
  const [reconciliationPeriod, setReconciliationPeriod] = useState<'all' | 'recent' | 'today'>('recent');
  const [locallyReconciledOrderIds, setLocallyReconciledOrderIds] = useState<string[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  // Strict Permission Helpers for RBAC
  const isDeveloper = userSession?.role === 'developer';
  const isOwner = userSession?.role === 'owner';
  const isStaff = userSession?.role === 'staff';
  
  const hasFinancePermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canViewFinance);
  const hasInventoryPermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canEditInventory);
  const hasOrdersPermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canManageOrders);
  const isSuperUser = isDeveloper || isOwner; // configuration and staff management are limited to owners and developers
  
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
  
  // Smart multi-currency input states
  const [inputUsdToSar, setInputUsdToSar] = useState<number>(usdToSar);
  const [inputUsdToYer, setInputUsdToYer] = useState<number>(usdToYer);

  // Digital Specific product fields
  const [productCostUsd, setProductCostUsd] = useState<number | ''>('');
  const [productProfitMarginUsd, setProductProfitMarginUsd] = useState<number | ''>('');
  const [productIsDigitalService, setProductIsDigitalService] = useState<boolean>(false);
  const [productDigitalServiceType, setProductDigitalServiceType] = useState<'direct' | 'card'>('direct');
  const [productDigitalCategory, setProductDigitalCategory] = useState<'game' | 'balance' | 'cards'>('game');

  const [inputTaxEnabled, setInputTaxEnabled] = useState(taxEnabled);
  const [inputTaxRate, setInputTaxRate] = useState(taxRate);
  const [inputTaxInTotal, setInputTaxInTotal] = useState(taxInTotal);
  const [inputTaxVisible, setInputTaxVisible] = useState(taxVisible);
  const [inputDeliveryInTotal, setInputDeliveryInTotal] = useState(deliveryInTotal);
  const [inputDeliveryVisible, setInputDeliveryVisible] = useState(deliveryVisible);

  // local game charging states
  const [inputGameApiEnabled, setInputGameApiEnabled] = useState(gameApiEnabled);
  const [inputGameApiUrl, setInputGameApiUrl] = useState(gameApiUrl);
  const [inputGameApiKey, setInputGameApiKey] = useState(gameApiKey);
  const [inputGameApiProvider, setInputGameApiProvider] = useState(gameApiProvider);
  const [inputGameApiLocalServerUrl, setInputGameApiLocalServerUrl] = useState(gameApiLocalServerUrl);
  const [inputGameApiLocalAccountNumber, setInputGameApiLocalAccountNumber] = useState(gameApiLocalAccountNumber);
  const [inputGameApiLocalUsername, setInputGameApiLocalUsername] = useState(gameApiLocalUsername);
  const [inputGameApiLocalPassword, setInputGameApiLocalPassword] = useState(gameApiLocalPassword);
  const [inputGameApiLocalEmployeeId, setInputGameApiLocalEmployeeId] = useState(gameApiLocalEmployeeId);
  const [inputGameApiLocalSourceId, setInputGameApiLocalSourceId] = useState(gameApiLocalSourceId);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [apiBalanceResult, setApiBalanceResult] = useState<{ success: boolean; msg: string; balance?: number; currency?: string } | null>(null);

  // local payment gateway charging/APIs states
  const [inputPayApiEnabled, setInputPayApiEnabled] = useState(payApiEnabled);
  const [inputPayApiUrl, setInputPayApiUrl] = useState(payApiUrl);
  const [inputPayApiToken, setInputPayApiToken] = useState(payApiToken);
  const [inputPayApiProvider, setInputPayApiProvider] = useState(payApiProvider);
  const [inputPayApiMerchantId, setInputPayApiMerchantId] = useState(payApiMerchantId);
  const [checkingPayStatus, setCheckingPayStatus] = useState(false);
  const [payStatusResult, setPayStatusResult] = useState<{ success: boolean; msg: string; balance?: number; currency?: string } | null>(null);

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
    setInputUsdToSar(usdToSar);
  }, [usdToSar]);

  React.useEffect(() => {
    setInputUsdToYer(usdToYer);
  }, [usdToYer]);

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

  React.useEffect(() => {
    setInputGameApiEnabled(gameApiEnabled);
  }, [gameApiEnabled]);

  React.useEffect(() => {
    setInputGameApiUrl(gameApiUrl);
  }, [gameApiUrl]);

  React.useEffect(() => {
    setInputGameApiKey(gameApiKey);
  }, [gameApiKey]);

  React.useEffect(() => {
    setInputGameApiProvider(gameApiProvider);
  }, [gameApiProvider]);

  React.useEffect(() => {
    setInputGameApiLocalServerUrl(gameApiLocalServerUrl);
  }, [gameApiLocalServerUrl]);

  React.useEffect(() => {
    setInputGameApiLocalAccountNumber(gameApiLocalAccountNumber);
  }, [gameApiLocalAccountNumber]);

  React.useEffect(() => {
    setInputGameApiLocalUsername(gameApiLocalUsername);
  }, [gameApiLocalUsername]);

  React.useEffect(() => {
    setInputGameApiLocalPassword(gameApiLocalPassword);
  }, [gameApiLocalPassword]);

  React.useEffect(() => {
    setInputGameApiLocalEmployeeId(gameApiLocalEmployeeId);
  }, [gameApiLocalEmployeeId]);

  React.useEffect(() => {
    setInputGameApiLocalSourceId(gameApiLocalSourceId);
  }, [gameApiLocalSourceId]);

  React.useEffect(() => {
    setInputPayApiEnabled(payApiEnabled);
  }, [payApiEnabled]);

  React.useEffect(() => {
    setInputPayApiUrl(payApiUrl);
  }, [payApiUrl]);

  React.useEffect(() => {
    setInputPayApiToken(payApiToken);
  }, [payApiToken]);

  React.useEffect(() => {
    setInputPayApiProvider(payApiProvider);
  }, [payApiProvider]);

  React.useEffect(() => {
    setInputPayApiMerchantId(payApiMerchantId);
  }, [payApiMerchantId]);

  // Product CRUD inputs state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productPriceSar, setProductPriceSar] = useState<number | ''>('');
  const [productPriceYer, setProductPriceYer] = useState<number | ''>('');
  const [productCurrency, setProductCurrency] = useState<'SAR' | 'YER'>('SAR');
  const [applyCurrencyToAll, setApplyCurrencyToAll] = useState<boolean>(false);
  const [productColors, setProductColors] = useState('');
  const [productFlavors, setProductFlavors] = useState('');
  const [productStock, setProductStock] = useState<number>(99);
  const [productImage, setProductImage] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productImages, setProductImages] = useState(''); // Comma-separated or multi-uploaded raw image urls

  // Category CRUD inputs state
  const [newCatArabic, setNewCatArabic] = useState('');
  const [newCatEnglish, setNewCatEnglish] = useState('');

  // Staff CRUD and RBAC states
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem("store_staff");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    // Deeply integrated, authentic default staff for the multi-niche platform
    return [
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
  });

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUser, setNewStaffUser] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'teacher' | 'tailor' | 'lawyer' | 'cashier'>('cashier');
  const [permFinance, setPermFinance] = useState(false);
  const [permInventory, setPermInventory] = useState(true);
  const [permOrders, setPermOrders] = useState(true);
  const [permAI, setPermAI] = useState(true);

  const saveStaffList = (list: Staff[]) => {
    setStaffList(list);
    localStorage.setItem("store_staff", JSON.stringify(list));
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffUser.trim()) {
      triggerNotification('الرجاء تعبئة اسم المستخدم والاسم الصريح للموظف لتجنب الأخطاء!', 'info');
      return;
    }
    const isDup = staffList.some(s => s.username.toLowerCase() === newStaffUser.trim().toLowerCase());
    if (isDup) {
      triggerNotification('⚠️ خطأ: اسم المستخدم هذا محجوز لموظف آخر بالفعل!', 'info');
      return;
    }
    const fresh: Staff = {
      id: `staff-${Date.now()}`,
      username: newStaffUser.trim().toLowerCase(),
      fullName: newStaffName.trim(),
      role: newStaffRole,
      permissions: {
        canViewFinance: permFinance,
        canEditInventory: permInventory,
        canManageOrders: permOrders,
        canUseAI: permAI
      }
    };
    const updated = [fresh, ...staffList];
    saveStaffList(updated);
    triggerNotification('تم تسجيل الموظف الجديد وتعميد تراخيصه السحابية 👥✨');
    
    // Reset Form
    setNewStaffName('');
    setNewStaffUser('');
    setNewStaffPass('');
  };

  const handleDeleteStaff = (id: string) => {
    if (id === 'staff-1') {
      triggerNotification('🚫 لا يمكنك إقصاء أو إلغاء تراخيص المدير التنفيذي الرئيسي!', 'info');
      return;
    }
    const updated = staffList.filter(s => s.id !== id);
    saveStaffList(updated);
    triggerNotification('تم شطب الموظف وسحب كافة تفويضاته السحابية 🔒');
  };

  const handleTogglePermission = (id: string, field: 'canViewFinance' | 'canEditInventory' | 'canManageOrders' | 'canUseAI') => {
    if (id === 'staff-1') {
      triggerNotification('🚫 غير نقدي أو مسموح بتعديل تراخيص صلاحيات المدير التنفيذي!', 'info');
      return;
    }
    const updated = staffList.map(s => {
      if (s.id === id) {
        return {
          ...s,
          permissions: {
            ...s.permissions,
            [field]: !s.permissions[field]
          }
        };
      }
      return s;
    });
    saveStaffList(updated);
    triggerNotification('تم تحديث وتعميد الصلاحية المنفصلة بنجاح 🔒✅');
  };

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

  const updateGalleryState = (newUrls: string[]) => {
    if (newUrls.length > 0) {
      setProductImages(prev => {
        const existing = prev.trim() ? prev.split(',').map(s => s.trim()).filter(Boolean) : [];
        const combined = [...existing, ...newUrls];
        return combined.join(', ');
      });
      triggerNotification(`تم رفع وإضافة (${newUrls.length}) صور إضافية للمعرض بنجاح 📸`);
    }
  };

  const handleGalleryImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      let loadedCount = 0;
      const uploadedUrls: string[] = [];

      fileList.forEach((file: any) => {
        if (file.size > 1.2 * 1024 * 1024) {
          triggerNotification(`الملف ${file.name} كبير جداً! تم تجاوزه حماية للذاكرة.`, 'info');
          loadedCount++;
          if (loadedCount === fileList.length) {
            updateGalleryState(uploadedUrls);
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (base64) {
            uploadedUrls.push(base64);
          }
          loadedCount++;
          if (loadedCount === fileList.length) {
            updateGalleryState(uploadedUrls);
          }
        };
        reader.readAsDataURL(file);
      });
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
        price: productPriceSar !== '' ? Number(productPriceSar) : Number(productPrice),
        price_sar: productPriceSar !== '' ? Number(productPriceSar) : Number(productPrice),
        price_yer: productPriceYer !== '' ? Number(productPriceYer) : Math.round(Number(productPrice) * (exchangeRate || 400)),
        stock: Number(productStock),
        image: defaultImg,
        code: productCode.trim() || `PROD-${Date.now().toString().slice(-4)}`,
        currency: productCurrency,
        colors: productColors ? productColors.split(',').map(s => s.trim()).filter(Boolean) : [],
        flavors: productFlavors ? productFlavors.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: productImages ? productImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        cost_usd: productCostUsd !== '' ? Number(productCostUsd) : undefined,
        profit_margin_usd: productProfitMarginUsd !== '' ? Number(productProfitMarginUsd) : undefined,
        is_digital_service: productIsDigitalService,
        digital_service_type: productIsDigitalService ? productDigitalServiceType : undefined,
        digital_category: productIsDigitalService ? productDigitalCategory : undefined,
        isApiProduct: productIsDigitalService && productDigitalServiceType === 'direct',
        apiRequiredField: productIsDigitalService && productDigitalServiceType === 'direct' ? 'معرف اللاعب (Player ID) / رقم الهاتف' : undefined
      });
      triggerNotification('تم تحديث الصنف ومزامنته مع المخازن ✨');
      setEditingId(null);
    } else {
      onAddProduct({
        name: productName,
        description: productDesc,
        category: productCat,
        price: productPriceSar !== '' ? Number(productPriceSar) : Number(productPrice),
        price_sar: productPriceSar !== '' ? Number(productPriceSar) : Number(productPrice),
        price_yer: productPriceYer !== '' ? Number(productPriceYer) : Math.round(Number(productPrice) * (exchangeRate || 400)),
        stock: Number(productStock),
        image: defaultImg,
        code: productCode.trim() || `PROD-${Date.now().toString().slice(-4)}`,
        currency: productCurrency,
        colors: productColors ? productColors.split(',').map(s => s.trim()).filter(Boolean) : [],
        flavors: productFlavors ? productFlavors.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: productImages ? productImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        cost_usd: productCostUsd !== '' ? Number(productCostUsd) : undefined,
        profit_margin_usd: productProfitMarginUsd !== '' ? Number(productProfitMarginUsd) : undefined,
        is_digital_service: productIsDigitalService,
        digital_service_type: productIsDigitalService ? productDigitalServiceType : undefined,
        digital_category: productIsDigitalService ? productDigitalCategory : undefined,
        isApiProduct: productIsDigitalService && productDigitalServiceType === 'direct',
        apiRequiredField: productIsDigitalService && productDigitalServiceType === 'direct' ? 'معرف اللاعب (Player ID) / رقم الهاتف' : undefined
      });
      triggerNotification('تم تفويض الصنف بنجاح وإضافته للمخزن 🌱');
    }

    // Reset fields
    setProductName('');
    setProductDesc('');
    setProductCat(categories[0]?.name || '');
    setProductPrice(0);
    setProductPriceSar('');
    setProductPriceYer('');
    setProductCurrency('SAR');
    setApplyCurrencyToAll(false);
    setProductColors('');
    setProductFlavors('');
    setProductStock(99);
    setProductImage('');
    setProductCode('');
    setProductImages('');
    setProductCostUsd('');
    setProductProfitMarginUsd('');
    setProductIsDigitalService(false);
    setProductDigitalServiceType('direct');
    setProductDigitalCategory('game');
  };

  const startEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProductName(p.name);
    setProductDesc(p.description || '');
    setProductCat(p.category);
    setProductPrice(p.price);
    setProductPriceSar(p.price_sar !== undefined && p.price_sar !== null ? p.price_sar : p.price);
    setProductPriceYer(p.price_yer !== undefined && p.price_yer !== null ? p.price_yer : Math.round(p.price * (exchangeRate || 400)));
    setProductCurrency(p.currency || 'SAR');
    setApplyCurrencyToAll(false);
    setProductColors(p.colors ? p.colors.join(', ') : '');
    setProductFlavors(p.flavors ? p.flavors.join(', ') : '');
    setProductStock(p.stock !== undefined ? p.stock : 99);
    setProductImage(p.image);
    setProductCode(p.code || '');
    setProductImages(p.images ? p.images.join(', ') : '');
    setProductCostUsd(p.cost_usd !== undefined && p.cost_usd !== null ? p.cost_usd : '');
    setProductProfitMarginUsd(p.profit_margin_usd !== undefined && p.profit_margin_usd !== null ? p.profit_margin_usd : '');
    setProductIsDigitalService(!!p.is_digital_service);
    setProductDigitalServiceType(p.digital_service_type || 'direct');
    setProductDigitalCategory(p.digital_category || 'game');
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

  const handleDownloadPDF = () => {
    const reportElem = document.getElementById("printable-report-area");
    if (!reportElem) {
      triggerNotification("خطأ: لم يتم العثور على منطقة التقرير القابلة للطباعة.", "info");
      return;
    }

    // Create a temporary hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-999";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      triggerNotification("تعذر إنشاء بيئة الطباعة المستقلة.", "info");
      return;
    }

    // Set document properties for beautiful clean layout
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>كشف حركة أرصدة الصناديق وجرد الخزينة - ${siteName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght=400;500;700&display=swap');
            body { 
              font-family: 'Inter', system-ui, -apple-system, sans-serif; 
              direction: rtl; 
              text-align: right;
              background: #ffffff !important;
              color: #0f172a !important;
              padding: 24px;
            }
            @media print {
              @page { size: A4 portrait; margin: 15mm; }
              body { padding: 0; }
              .no-print { display: none !important; }
            }
            /* Reset colors to guarantee flawless crisp contrast on standard laser print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-emerald-50 { background-color: #ecfdf5 !important; }
            .bg-emerald-900\\/20 { background-color: #ecfdf5 !important; }
            .bg-amber-50 { background-color: #fffbeb !important; }
            .bg-yellow-50 { background-color: #fefce8 !important; }
            .bg-red-50 { background-color: #fef2f2 !important; }
            .border { border-width: 1px !important; border-color: #e2e8f0 !important; }
            .text-emerald-800 { color: #065f46 !important; }
            .text-amber-800 { color: #92400e !important; }
            .text-yellow-850 { color: #854d0e !important; }
            /* Hiding standard browser print artifacts */
            header, footer, .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <div class="w-full">
            ${reportElem.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
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
    if (onUpdateGameApiSettings) {
      onUpdateGameApiSettings(
        inputGameApiUrl, 
        inputGameApiKey, 
        inputGameApiProvider, 
        inputGameApiEnabled,
        inputGameApiLocalServerUrl,
        inputGameApiLocalAccountNumber,
        inputGameApiLocalUsername,
        inputGameApiLocalPassword,
        inputGameApiLocalEmployeeId,
        inputGameApiLocalSourceId
      );
    }
    if (onUpdatePayApiSettings) {
      onUpdatePayApiSettings(inputPayApiUrl, inputPayApiToken, inputPayApiProvider, inputPayApiMerchantId, inputPayApiEnabled);
    }
    triggerNotification('تم حفظ جميع الضوابط وحسابات الربط ومكتسبات التفعيل وبوابات الدفع الإلكتروني بنجاح! ⚙️💳');
  };

  const handleCheckApiBalance = async () => {
    if (inputGameApiProvider !== 'etisalatonline' && !inputGameApiKey) {
      setApiBalanceResult({
        success: false,
        msg: 'الرجاء إدخال الرمز السري للربط API Key أولاً!'
      });
      return;
    }
    if (inputGameApiProvider === 'etisalatonline' && (!inputGameApiLocalServerUrl || !inputGameApiLocalAccountNumber || !inputGameApiLocalUsername || !inputGameApiLocalPassword)) {
      setApiBalanceResult({
        success: false,
        msg: 'الرجاء إدخال رابط سيرفر اتصالات، رقم الحساب، اسم المستخدم وكلمة المرور لإجراء الفحص!'
      });
      return;
    }
    setCheckingBalance(true);
    setApiBalanceResult(null);
    try {
      const res = await fetch('/api/topup/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: inputGameApiProvider,
          apiUrl: inputGameApiProvider === 'etisalatonline' ? inputGameApiLocalServerUrl : inputGameApiUrl,
          apiKey: inputGameApiKey,
          accountNumber: inputGameApiLocalAccountNumber,
          username: inputGameApiLocalUsername,
          password: inputGameApiLocalPassword,
          employeeId: inputGameApiLocalEmployeeId,
          sourceId: inputGameApiLocalSourceId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApiBalanceResult({
          success: true,
          msg: data.message || 'تم الاتصال بالبوابة بنجاح!',
          balance: data.balance,
          currency: data.currency || 'SAR'
        });
        triggerNotification('تم التحقق وتحديث رصيد محفظة الموزع بنجاح 💸', 'success');
      } else {
        setApiBalanceResult({
          success: false,
          msg: data.error || data.message || 'فشل الاتصال بخادم بوابة الشحن.'
        });
        triggerNotification('فشل الربط، تفضل بمراجعة المفاتيح وعنوان السيرفر', 'info');
      }
    } catch (err: any) {
      setApiBalanceResult({
        success: false,
        msg: err.message || 'خطأ غير متوقع أثناء الاتصال بالخادم.'
      });
      triggerNotification('خطأ بالوصول إلى بوابة الربط', 'info');
    } finally {
      setCheckingBalance(false);
    }
  };

  const handleCheckPayStatus = async () => {
    if (!inputPayApiToken) {
      setPayStatusResult({
        success: false,
        msg: 'الرجاء إدخال الرمز السري لبوابة الدفع (API Key / Auth Token) أولاً!'
      });
      return;
    }
    setCheckingPayStatus(true);
    setPayStatusResult(null);
    try {
      const res = await fetch('/api/payments/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: inputPayApiProvider,
          apiUrl: inputPayApiUrl,
          apiToken: inputPayApiToken,
          merchantId: inputPayApiMerchantId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPayStatusResult({
          success: true,
          msg: data.message || 'تم الربط ببوابة الدفع بنجاح!',
          balance: data.balance,
          currency: data.currency || 'SAR'
        });
        triggerNotification('تم اختبار اتصال بوابة الدفع بنجاح 🟢💳', 'success');
      } else {
        setPayStatusResult({
          success: false,
          msg: data.error || data.message || 'فشل الاتصال بخادم بوابة الدفع.'
        });
        triggerNotification('فشل الربط ببوابة الدفع، يرجى مراجعة بيانات الاعتماد', 'info');
      }
    } catch (err: any) {
      setPayStatusResult({
        success: false,
        msg: err.message || 'خطأ غير متوقع أثناء الاتصال بالخادم لمصادقة بوابة الدفع.'
      });
      triggerNotification('خطأ بالوصول إلى مزود بوابات الدفع', 'info');
    } finally {
      setCheckingPayStatus(false);
    }
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
          <div className="flex flex-wrap gap-2 items-center mt-2">
            <p className="text-xs text-slate-400" id="dashboard-subtitle">
              لديك سيطرة مطلقة على المخزون والأقسام، الإشراف على طلبات عملائك، تعديل إعلانات الواجهة، وبناء هوية المتجر واللوجو فورياً.
            </p>
            {userSession && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-purple-950/40 text-purple-400 border border-purple-500/20">
                الحساب النشط: {userSession.fullName} ({userSession.role === 'developer' ? 'المطور المطلق 🛠' : userSession.role === 'owner' ? 'المالك 👑' : `كادر المنشأة: ${userSession.staffRole}`})
              </span>
            )}
          </div>
          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="mt-3.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>تسجيل خروج المشرف 🚪</span>
            </button>
          )}
        </div>

        {/* Dynamic Navigation Controllers with strict RBAC */}
        <div className="flex bg-[#060b18] p-1.5 rounded-2xl border border-blue-900/50 w-full xl:w-auto flex-wrap gap-1" id="dashboard-navigation">
          {hasInventoryPermission && (
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              المخزن والأصناف
            </button>
          )}
          
          {hasInventoryPermission && (
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'categories' ? 'bg-[#111a2f] text-yellow-405 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              الأقسام ({categories.length})
            </button>
          )}

          {hasOrdersPermission && (
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
          )}

          {hasInventoryPermission && (
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'slides' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              إعلانات السلايدر ({carouselSlides.length})
            </button>
          )}

          {isSuperUser && (
            <button
              onClick={() => setActiveTab('configuration')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'configuration' ? 'bg-[#111a2f] text-yellow-500 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              إعدادات الضبط العام ⚙️
            </button>
          )}

          {hasFinancePermission && (
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'stats' ? 'bg-[#111a2f] text-yellow-400 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              البيانات والتقارير 📊
            </button>
          )}

          {isSuperUser && (
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 xl:flex-none px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'staff' ? 'bg-[#111a2f] text-yellow-500 shadow-lg font-black border border-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              إدارة الموظفين والامتيازات 👥🔑
            </button>
          )}
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
      {activeTab === 'products' && hasInventoryPermission && (
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

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 mb-1">🇸🇦 سعر سعودي (SAR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={productPriceSar}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setProductPriceSar('');
                          setProductPriceYer('');
                        } else {
                          const numSar = Number(val);
                          setProductPriceSar(numSar);
                          setProductPriceYer(Math.round(numSar * (exchangeRate || 400)));
                        }
                      }}
                      className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-amber-500/50 outline-none transition-colors font-mono"
                      placeholder="ر.س..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 mb-1">🇾🇪 سعر يمني (YER) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      value={productPriceYer}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setProductPriceYer('');
                          setProductPriceSar('');
                        } else {
                          const numYer = Number(val);
                          setProductPriceYer(numYer);
                          setProductPriceSar(Number((numYer / (exchangeRate || 400)).toFixed(2)));
                        }
                      }}
                      className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-emerald-500/50 outline-none transition-colors font-mono"
                      placeholder="ر.ي..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">كود/معرف الصنف</label>
                    <input
                      type="text"
                      placeholder="PUBG660"
                      value={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <span className="text-[10px] text-yellow-550 font-bold block mt-1 leading-normal" dir="rtl">
                  💸 تم الفصل الكامل لتجنب أي تداخل في العملات. القيمة الأساسية هي الثابتة للطلب في السلة بحسب عملة العميل النشطة. (معدل الصرف الافتراضي: {exchangeRate})
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

              {/* Product Gallery Options: Optional CSV or multi file uploads */}
              <div className="space-y-2 pt-2 bg-blue-950/20 p-3 rounded-2xl border border-blue-900/10">
                <label className="block text-[11px] font-bold text-slate-400">معرض الصور الإضافي - Gallery (اختياري)</label>
                <input
                  type="text"
                  placeholder="روابط الصور مفصولة بفاصلة , أو ارفع صوراً وسنقوم بتضمينها بالأسفل"
                  value={productImages}
                  onChange={(e) => setProductImages(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-[10px] text-white focus:border-yellow-500/50 outline-none transition-colors font-mono text-left placeholder:text-right placeholder:font-sans"
                />
                <div className="relative border border-dashed border-blue-905/60 rounded-xl p-3 flex flex-col items-center justify-center hover:border-yellow-500/40 transition-colors h-16 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>ارفع ملف أو عدة ملفات لضمها للمعرض مباشرة 📸</span>
                  </span>
                </div>

                {productImages.trim() ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-450 font-bold font-sans">معاينة صور المعرض المضافة ({productImages.split(',').filter(Boolean).length}):</span>
                      <button
                        type="button"
                        onClick={() => setProductImages('')}
                        className="text-[9px] text-red-400 hover:underline cursor-pointer font-sans"
                      >
                        مسح كافة المعرض
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 bg-[#060b18] rounded-xl border border-blue-900/25">
                      {productImages.split(',').map((imgUrl, idx) => {
                        const trimmed = imgUrl.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={idx} className="relative group w-10 h-10 rounded border border-blue-900/40 overflow-hidden bg-slate-950 flex-shrink-0">
                            <img src={trimmed} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => {
                                const activeList = productImages.split(',').map(s => s.trim()).filter(Boolean);
                                activeList.splice(idx, 1);
                                setProductImages(activeList.join(', '));
                              }}
                              className="absolute inset-0 bg-red-955/90 text-white font-bold text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-sans"
                              title="حذف هذه الصورة"
                            >
                              حذف
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] text-slate-500 font-sans">لا توجد صور معرض إضافية مضافة (سيتم الاكتفاء بالصورة الأساسية للكتالوج).</p>
                )}
              </div>

              {/* Dynamic isolated dollar pricing module layout */}
              {isModuleEnabled('games_hyper') && (
                <DollarExchangePricing
                  productCostUsd={productCostUsd}
                  setProductCostUsd={setProductCostUsd}
                  productProfitMarginUsd={productProfitMarginUsd}
                  setProductProfitMarginUsd={setProductProfitMarginUsd}
                  inputUsdToSar={inputUsdToSar}
                  setInputUsdToSar={setInputUsdToSar}
                  inputUsdToYer={inputUsdToYer}
                  setInputUsdToYer={setInputUsdToYer}
                />
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
                      setProductImages('');
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
                    <div className="text-left animate-fade-in" dir="rtl">
                      {(() => {
                        const isYemeni = p.currency === 'YER';
                        const nativePrice = p.price || 0;
                        const convertedPrice = isYemeni 
                          ? nativePrice / (exchangeRate || 400) 
                          : nativePrice * (exchangeRate || 400);
                        
                        return (
                          <>
                            <span className="text-yellow-400 font-extrabold text-xs block font-mono">
                              {isYemeni 
                                ? `${Math.round(nativePrice).toLocaleString('ar-YE')} ر.ي`
                                : `${nativePrice.toFixed(1)} ر.س`}
                            </span>
                            <span className="text-emerald-400 font-medium text-[9px] block font-mono mt-0.5">
                              يعادل: {isYemeni 
                                ? `${convertedPrice.toFixed(1)} ر.س`
                                : `${Math.round(convertedPrice).toLocaleString('ar-YE')} ر.ي`}
                            </span>
                          </>
                        );
                      })()}
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
      {activeTab === 'categories' && hasInventoryPermission && (
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
      {activeTab === 'orders' && hasOrdersPermission && (
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

                        {/* Quick WhatsApp Notification controls */}
                        <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-900/45 rounded-xl p-1 text-[10px]" dir="rtl">
                          <span className="px-1.5 text-slate-405 font-bold">📲 إشعار الواتساب:</span>
                          <button
                            onClick={() => {
                              let cleanPhone = order.phone.replace(/[^\d]/g, '');
                              if (cleanPhone.startsWith('7') && cleanPhone.length === 9) cleanPhone = '967' + cleanPhone;
                              else if (cleanPhone.startsWith('05') && cleanPhone.length === 10) cleanPhone = '966' + cleanPhone.slice(1);
                              else if (cleanPhone.startsWith('5') && cleanPhone.length === 9) cleanPhone = '966' + cleanPhone;
                              
                              const msg = `*📥 تحديث من ${siteName}* 🐺💎\n\nأهلاً بك عزيزنا العميل المحترم *${order.customerName}*،\nنسعد بإبلاغك بأن طلبك رقم *${order.id}* جاري تجهيزه وتحضيره الآن في المستودع بكل حب وعناية ⏳📦\n\nوسيقوم موظف التوصيل لدينا بالتواصل معك فور انطلاقه للتسليم.\n\nنشكرك على ثقتك الكبيرة بنا! 🌸✨`;
                              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/20 cursor-pointer"
                            title="إرسال إشعار قيد التجهيز عبر الواتساب"
                          >
                            تجهيز ⏳
                          </button>
                          <button
                            onClick={() => {
                              let cleanPhone = order.phone.replace(/[^\d]/g, '');
                              if (cleanPhone.startsWith('7') && cleanPhone.length === 9) cleanPhone = '967' + cleanPhone;
                              else if (cleanPhone.startsWith('05') && cleanPhone.length === 10) cleanPhone = '966' + cleanPhone.slice(1);
                              else if (cleanPhone.startsWith('5') && cleanPhone.length === 9) cleanPhone = '966' + cleanPhone;
                              
                              const msg = `*📥 تحديث من ${siteName}* 🐺💎\n\nعزيزنا العميل المحترم *${order.customerName}*،\n\nيسرنا إخطارك بأن طلبك رقم *${order.id}* قد تم تجهيزه بالكامل وتغليفه 🎁 وهو الآن في طريقه إليك مع مندوب الشحن والتوصيل 🚚💨\n\nالرجاء إبقاء هاتفك متاحاً لتسهيل عملية الاستلام والسداد المالي.\n\nطاب يومك بكل خير! 🌟`;
                              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 cursor-pointer"
                            title="إرسال إشعار للشحن عبر الواتساب"
                          >
                            للشحن 🚚
                          </button>
                          <button
                            onClick={() => {
                              let cleanPhone = order.phone.replace(/[^\d]/g, '');
                              if (cleanPhone.startsWith('7') && cleanPhone.length === 9) cleanPhone = '967' + cleanPhone;
                              else if (cleanPhone.startsWith('05') && cleanPhone.length === 10) cleanPhone = '966' + cleanPhone.slice(1);
                              else if (cleanPhone.startsWith('5') && cleanPhone.length === 9) cleanPhone = '966' + cleanPhone;
                              
                              const msg = `*📥 تحديث من ${siteName}* 🐺💎\n\nعزيزنا العميل المحترم *${order.customerName}*،\n\nالحمد لله، تم تسليم طلبك رقم *${order.id}* بنجاح تام 🟢\n\nسعدنا جداً بخدمتك ونتمنى أن تكون تجربتك معنا رائعة ومميزة. ننتظر تعاملكم القادم بإذن الله! 🥰🌹`;
                              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 cursor-pointer"
                            title="إرسال إشعار تم التسليم عبر الواتساب"
                          >
                            تسليم 🟢
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

                    {/* Manual Top-up Copy Console (Shown when Game API is disabled or when manual override is requested) */}
                    {order.items?.some(i => i.playerId) && (
                      <div className="mt-4 p-4 border border-blue-900/30 bg-blue-950/20 rounded-2xl animate-fade-in space-y-3" id={`copy-payload-${order.id}`}>
                        <div className="flex items-center justify-between border-b border-blue-900/25 pb-2">
                          <h5 className="text-[11px] font-black text-yellow-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                            <span>بوابة إمدادات المطور والشحن اليدوي (سلات الألعاب الرقمية)</span>
                          </h5>
                          <span className="text-[9px] bg-yellow-500/10 text-yellow-300 font-bold px-2 py-0.5 border border-yellow-500/20 rounded-lg">التحضير المباشر</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                          {order.items?.filter(item => item.playerId).map((chargeItem, cIdx) => (
                            <div key={cIdx} className="bg-[#03060c] border border-blue-950 p-3 rounded-xl space-y-2.5">
                              <div className="text-[10px] text-white font-extrabold truncate border-b border-slate-900 pb-1.5">
                                🎮 {chargeItem.product.name}
                              </div>

                              <div className="space-y-2">
                                {/* Player ID row */}
                                <div className="flex justify-between items-center gap-1.5">
                                  <span className="text-slate-400 text-[10px]">مُعرِّف اللاعب (Player ID):</span>
                                  <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-950 px-2 py-0.5 rounded-lg">
                                    <span className="font-mono text-yellow-400 font-bold selection:bg-yellow-500/30 select-all">{chargeItem.playerId}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(chargeItem.playerId || "");
                                        triggerNotification("📋 تم نسخ معرف اللاعب (Player ID) إلى الحافظة!");
                                      }}
                                      className="text-yellow-500 hover:text-yellow-400 mr-1.5 text-[9px] font-bold"
                                    >
                                      نسخ
                                    </button>
                                  </div>
                                </div>

                                {/* Quantity row */}
                                <div className="flex justify-between items-center gap-1.5">
                                  <span className="text-slate-400 text-[10px]">الكمية المطلوبة:</span>
                                  <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-950 px-2 py-0.5 rounded-lg">
                                    <span className="font-mono text-white font-bold">{chargeItem.quantity ?? 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(String(chargeItem.quantity ?? 1));
                                        triggerNotification("📋 تم نسخ الكمية إلى الحافظة!");
                                      }}
                                      className="text-blue-400 hover:text-blue-300 mr-1.5 text-[9px] font-bold"
                                    >
                                      نسخ
                                    </button>
                                  </div>
                                </div>

                                {/* Phone row */}
                                <div className="flex justify-between items-center gap-1.5">
                                  <span className="text-slate-400 text-[10px]">الهاتف للتأكيد:</span>
                                  <div className="flex items-center gap-1 bg-[#0b1329] border border-blue-950 px-2 py-0.5 rounded-lg">
                                    <span className="font-mono text-teal-405 font-bold">{order.phone}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.phone || "");
                                        triggerNotification("📋 تم نسخ رقم الهاتف إلى الحافظة!");
                                      }}
                                      className="text-teal-400 hover:text-teal-300 mr-1.5 text-[9px] font-bold"
                                    >
                                      نسخ
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="text-[9px] text-slate-450 leading-normal bg-black/20 p-2 border border-blue-950 rounded-xl">
                          💡 يمكنك نسخ هذه المعطيات بضغطة زر وتوريدها للعميل يدوياً من تطبيق الموزع الخاص بك، ثم الضغط على زر <strong>(تسليم ✅)</strong> بالأعلى لتأمين انتهاء العملية.
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* PROMO ADS & SLIDES MANAGING TAB */}
      {activeTab === 'slides' && hasInventoryPermission && (
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

      {/* STAFF & ROLE-BASED ACCESS CONTROL TAB (RBAC) */}
      {activeTab === 'staff' && isSuperUser && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="staff-tab-section">
          
          {/* Creator Form Panel */}
          <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 lg:col-span-1 shadow-md h-fit">
            <div className="flex items-center gap-2 mb-4 border-b border-blue-900/25 pb-4">
              <Users className="w-5 h-5 text-yellow-500 animate-pulse" />
              <h3 className="text-sm font-black text-white">إضافة موظف جديد وتخصيص صلاحيات 👤</h3>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">الاسم الكامل للموظف *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المهندس وائل الذيباني"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">اسم المستخدم (الدخول) *</label>
                  <input
                    type="text"
                    required
                    placeholder="wael_dhb"
                    value={newStaffUser}
                    onChange={(e) => setNewStaffUser(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">كلمة المرور المؤقتة</label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={newStaffPass}
                    onChange={(e) => setNewStaffPass(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المسمى الوظيفي / الدور</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => {
                    const r = e.target.value as any;
                    setNewStaffRole(r);
                    // Smart auto defaults
                    if (r === 'cashier') {
                      setPermFinance(false); setPermInventory(false); setPermOrders(true); setPermAI(false);
                    } else if (r === 'admin') {
                      setPermFinance(true); setPermInventory(true); setPermOrders(true); setPermAI(true);
                    } else {
                      setPermFinance(false); setPermInventory(true); setPermOrders(true); setPermAI(true);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                >
                  <option value="cashier">أمين صندوق / كاشير مبيعات (Cashier)</option>
                  {(!getProjectTypeNiche() || getProjectTypeNiche() === 'tailor' || getProjectTypeNiche() === 'hyper') && (
                    <option value="tailor">خياط ومدير أقمشة (Tailor Designer)</option>
                  )}
                  {(!getProjectTypeNiche() || getProjectTypeNiche() === 'legal' || getProjectTypeNiche() === 'hyper') && (
                    <option value="lawyer">مستشار قانوني ومراجع شركات (Legal Advisor)</option>
                  )}
                  {(!getProjectTypeNiche() || getProjectTypeNiche() === 'school' || getProjectTypeNiche() === 'hyper') && (
                    <option value="teacher">مدرس وموجه أكاديمي (Educational Coach)</option>
                  )}
                  <option value="admin">مشرف فرعي عام (Sub-Admin)</option>
                </select>
              </div>

              {/* Checkboxes layout */}
              <div className="bg-[#060b18]/50 p-4 border border-blue-900/20 rounded-2xl space-y-3.5" dir="rtl">
                <span className="text-[10px] text-slate-400 block font-bold border-b border-blue-900/20 pb-1.5">تحديد الصلاحيات والامتيازات المعينة لمنع وتفعيل الميزات:</span>
                
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPermFinance(!permFinance)}>
                  <span className="text-xs text-slate-300 font-medium select-none">💰 عرض المبيعات والبيانات المالية والتقارير</span>
                  <input
                    type="checkbox"
                    checked={permFinance}
                    onChange={() => {}} // handled by div click
                    className="w-4 h-4 rounded text-yellow-500 bg-[#060b18] border-blue-900 focus:ring-yellow-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPermInventory(!permInventory)}>
                  <span className="text-xs text-slate-300 font-medium select-none">📦 التحكم بالمستودع وإضافة/تعديل المنتجات</span>
                  <input
                    type="checkbox"
                    checked={permInventory}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-yellow-500 bg-[#060b18] border-blue-900 focus:ring-yellow-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPermOrders(!permOrders)}>
                  <span className="text-xs text-slate-300 font-medium select-none">📥 إدارة وتجهيز طلبات العملاء وتعديل حالتها</span>
                  <input
                    type="checkbox"
                    checked={permOrders}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-yellow-500 bg-[#060b18] border-blue-900 focus:ring-yellow-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between cursor-pointer" onClick={() => setPermAI(!permAI)}>
                  <span className="text-xs text-slate-300 font-medium select-none">🤖 استخدام خوارزميات الذكاء الاصطناعي والتوليد</span>
                  <input
                    type="checkbox"
                    checked={permAI}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-yellow-500 bg-[#060b18] border-blue-900 focus:ring-yellow-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-450 hover:to-amber-450 text-blue-950 font-black py-2.5 px-4 rounded-xl text-xs hover:shadow-yellow-500/15 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                حفظ وإضافة الموظف مع تفويض الصلاحيات 👤🔒
              </button>
            </form>
          </div>

          {/* List of Staff with permissions toggle */}
          <div className="lg:col-span-2 bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-md">
            <div className="flex items-center justify-between border-b border-blue-900/25 pb-4 mb-5" dir="rtl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-black text-white">جدول الموظفين النشطين والتحكم السحابي بالامتيازات 👥</h3>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/10">نشط {staffList.length} موظفين فرعيين</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.map((st) => (
                <div 
                  key={st.id} 
                  className="p-4 bg-[#060b18]/60 border border-blue-900/30 rounded-2xl flex flex-col justify-between hover:border-yellow-505/20 transition-all duration-150"
                  dir="rtl"
                >
                  <div>
                    {/* Header: avatar + title */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-500 text-blue-950 flex items-center justify-center font-black text-xs shadow-md">
                          {st.fullName.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{st.fullName}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">@{st.username}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/15 uppercase">
                          {st.role === 'admin' ? 'مشرف عام' : st.role === 'tailor' ? 'مصمم أزياء' : st.role === 'lawyer' ? 'مستشار' : st.role === 'teacher' ? 'مدرس' : 'كاشير مبيعات'}
                        </span>
                        {st.id !== 'staff-1' && (
                          <button
                            onClick={() => handleDeleteStaff(st.id)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="إلغاء وفصل الموظف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Permissions list toggle indicators */}
                    <div className="mt-4 space-y-2.5 border-t border-blue-900/15 pt-3">
                      <span className="text-[9px] text-slate-400 block font-bold leading-none">تخصيص الصلاحيات الفردية (انقر للتبديل الفوري لمنع أو سماح):</span>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(st.id, 'canViewFinance')}
                          className={`flex items-center justify-between text-[10px] p-2 rounded-lg border text-right font-black transition-all cursor-pointer ${
                            st.permissions.canViewFinance
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-blue-900/20 bg-slate-900/20 text-slate-500'
                          }`}
                        >
                          <span>💰 تقارير مبيعات</span>
                          <span className="font-extrabold">{st.permissions.canViewFinance ? 'نعم' : 'لا'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePermission(st.id, 'canEditInventory')}
                          className={`flex items-center justify-between text-[10px] p-2 rounded-lg border text-right font-black transition-all cursor-pointer ${
                            st.permissions.canEditInventory
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-blue-900/20 bg-slate-900/20 text-slate-500'
                          }`}
                        >
                          <span>📦 تحرير مخزن</span>
                          <span className="font-extrabold">{st.permissions.canEditInventory ? 'نعم' : 'لا'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePermission(st.id, 'canManageOrders')}
                          className={`flex items-center justify-between text-[10px] p-2 rounded-lg border text-right font-black transition-all cursor-pointer ${
                            st.permissions.canManageOrders
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-blue-900/20 bg-slate-900/20 text-slate-500'
                          }`}
                        >
                          <span>📥 معالجة طلبات</span>
                          <span className="font-extrabold">{st.permissions.canManageOrders ? 'نعم' : 'لا'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePermission(st.id, 'canUseAI')}
                          className={`flex items-center justify-between text-[10px] p-2 rounded-lg border text-right font-black transition-all cursor-pointer ${
                            st.permissions.canUseAI
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-blue-900/20 bg-slate-900/20 text-slate-500'
                          }`}
                        >
                          <span>🤖 ذكاء إصطناعي</span>
                          <span className="font-extrabold">{st.permissions.canUseAI ? 'نعم' : 'لا'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Warning label for admin */}
                  {st.id === 'staff-1' && (
                    <p className="text-[9px] text-yellow-500/80 font-bold mt-2.5 text-center bg-yellow-500/5 p-1 rounded-lg border border-yellow-500/13" dir="rtl">
                      👑 يمتلك هذا الحساب كافة تراخيص المسؤولية القانونية والمحاسبة والتشغيل السحابي بشكل كامل.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* RE-ARCHITECTED CONFIGURATOR & IDENTITY PROFILE */}
      {activeTab === 'configuration' && isSuperUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" id="configs-tab-section">
          
          {/* Main system controls */}
          <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40 shadow-sm md:col-span-2 space-y-6">
            
            {/* SaaS Multi-Niche Active Template Selector */}
            {getProjectTypeNiche() && !isDeveloper ? (
              <div className="p-5 bg-gradient-to-r from-blue-950/70 to-blue-900/40 border border-blue-500/30 rounded-2xl" id="locked-project-niche-panel">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
                  <h4 className="text-xs font-black text-white">منصة سحابية مستقلة ومخصصة 🔒 (Independent Dedicated Platform)</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal" dir="rtl">
                  تم قفل وترخيص لوحة العميل وتخصيص البوابات والمنتجات تلقائياً لهذا المشروع بالكامل لصالح نشاط: <strong className="text-yellow-400">[{NICHES.find(n => n.id === activeNicheId)?.name || 'النشاط المخصص'}]</strong>. تم إخفاء أي لوحات أو بوابات غير متطابقة من لوحة التحكم بنجاح لمظهر مستقل 100%.
                </p>
              </div>
            ) : (
              <div className="p-5 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-bounce" />
                  <h4 className="text-xs font-black text-white">نظام القوالب والأنشطة الشاملة (Universal SaaS Templates) 🚀</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal" dir="rtl">
                  هذه الميزة الجوهرية تتيح تفعيل قالب النشاط كاملاً مع الألوان المنسقة، والتصنيفات الجاهزة، وأصناف المنتجات الافتراضية المناسبة لكل نوع مشروع.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5">اختر قالب النشاط السحابي النشط حالياً:</label>
                    <select
                      value={activeNicheId}
                      onChange={(e) => {
                        const sel = e.target.value as any;
                        if (onApplyNicheTemplate) {
                          onApplyNicheTemplate(sel);
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white focus:border-yellow-500/50 outline-none transition-colors"
                    >
                      <option value="game">🎮 متجر شحن الألعاب والترفيه (Game Charge)</option>
                      <option value="pharmacy">🧪 صيدلية ومستلزمات رعاية صحية (Pharmacy)</option>
                      <option value="supermarket">🛒 سوبر ماركت ومبيعات بقالة (Supermarket)</option>
                      <option value="school">🏫 مدارس ومؤسسات تعليمية (Educational)</option>
                      <option value="tailor">🪡 محلات خياطة وتصميم أزياء (Tailoring)</option>
                      <option value="legal">⚖️ مكتب استشارات قانونية ومحاماة (Legal Office)</option>
                      <option value="consulting">💼 شركة استشارات إدارية (Corporate Consulting)</option>
                      <option value="hyper">✨ الهايبر ماركت الشامل (مواد غذائية + ألعاب + خدمات رقمية)</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="text-[10px] text-yellow-500 font-bold bg-yellow-500/5 border border-yellow-500/15 p-2 rounded-xl">
                       💡 القالب النشط حالياً: <span className="underline">{NICHES.find(n => n.id === activeNicheId)?.name || 'غير محدد'}</span>. نقرة واحدة في القائمة لتفعيل الهوية والمحتوى مباشرة.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black text-white">إعدادات هوية {siteName}</h3>
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
                <p className="text-[10px] text-slate-450 mt-0.5">تتحكم بما يشاهده العميل في خطوة الدفع عند إنشاء السجل.</p>
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
                <p className="text-xs font-black text-white">{siteName}</p>
                <p className="text-[10px] text-slate-500 leading-normal">رقم الامتياز المعتمد: {inputWhatsapp || whatsappNumber}</p>
              </div>
            </div>

            <div className="p-4 bg-[#060b18]/40 border border-blue-900/25 rounded-xl text-[10px] text-slate-450 leading-relaxed space-y-1">
              <span className="font-bold text-slate-300 block mb-0.5">ℹ️ معلومات تخزين البيانات المدمجة</span>
              <p>
                يتم مزامنة الشعار وطرق الدفع والرسائل تلقائياً في قاعدة البيانات وتحديثها فورياً للعملاء للتجربة الكاملة.
              </p>
            </div>

            {/* Game Charging API Integrations Card */}
            <div className="bg-[#0b1329] p-5 rounded-2xl border border-yellow-500/20 shadow-md space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <h4 className="text-xs font-black text-white">بوابة شحن الألعاب التلقائي (APIs)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400">تفعيل تلقائي</span>
                  <input
                    type="checkbox"
                    id="gameApiEnabledToggle"
                    checked={inputGameApiEnabled}
                    onChange={(e) => setInputGameApiEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-yellow-550 border-blue-900 bg-[#060b18] focus:ring-yellow-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Provider select */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">مزود الخدمة والشحن (APIs Provider)</label>
                  <select
                    value={inputGameApiProvider}
                    onChange={(e) => setInputGameApiProvider(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 cursor-pointer"
                  >
                    <option value="default">سيليكن /LikeCard الشحن الافتراضي التجريبي (Default Simulated)</option>
                    <option value="likecard">لايك كارد (LikeCard Cards API)</option>
                    <option value="smm">لوحات SMM القياسية (SMM Panels Standard API)</option>
                    <option value="etisalatonline">نظام اتصالات اليمني للتسديدات الفورية (Etisalat Yemen Local System)</option>
                  </select>
                </div>

                {inputGameApiProvider === "etisalatonline" ? (
                  // Local Yemeni provider inputs
                  <div className="space-y-3.5 border border-yellow-500/10 bg-yellow-500/5 p-3 rounded-2xl animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-bold text-yellow-300 mb-1">رابط سيرفر اتصالات اليمني</label>
                      <input
                        type="url"
                        placeholder="https://etisalatonline.yrbso.app/api or http://localhost/api"
                        value={inputGameApiLocalServerUrl}
                        onChange={(e) => setInputGameApiLocalServerUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">رقم الحساب الطرفي</label>
                      <input
                        type="text"
                        placeholder="أدخل رقم الحساب المعتمد"
                        value={inputGameApiLocalAccountNumber}
                        onChange={(e) => setInputGameApiLocalAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">اسم المستخدم</label>
                      <input
                        type="text"
                        placeholder="Username"
                        value={inputGameApiLocalUsername}
                        onChange={(e) => setInputGameApiLocalUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">كلمة المرور</label>
                      <input
                        type="password"
                        placeholder="Password"
                        value={inputGameApiLocalPassword}
                        onChange={(e) => setInputGameApiLocalPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">رقم الموظف</label>
                      <input
                        type="text"
                        placeholder="Employee Terminal ID"
                        value={inputGameApiLocalEmployeeId}
                        onChange={(e) => setInputGameApiLocalEmployeeId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">رقم المصدر</label>
                      <input
                        type="text"
                        placeholder="Source ID"
                        value={inputGameApiLocalSourceId}
                        onChange={(e) => setInputGameApiLocalSourceId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                ) : (
                  // Classic options
                  <>
                    {/* API Request Url */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">رابط بوابة المزود (API Base URL)</label>
                      <input
                        type="url"
                        placeholder="https://api.like4card.com/ or https://smm-panel.com/api/v2"
                        value={inputGameApiUrl}
                        onChange={(e) => setInputGameApiUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* API Token / Key */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">مفتاح الاتصال السري (API Key / Auth Token)</label>
                      <input
                        type="password"
                        placeholder="ضع كود التوكن أو الـ API Key السري هنا..."
                        value={inputGameApiKey}
                        onChange={(e) => setInputGameApiKey(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {/* Check balance button */}
                <button
                  type="button"
                  disabled={checkingBalance}
                  onClick={handleCheckApiBalance}
                  className="w-full bg-[#1e293b]/60 hover:bg-[#334155]/60 border border-blue-900/60 text-slate-200 font-bold py-2 px-3 rounded-xl text-[10px] transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  {checkingBalance ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-t-transparent border-yellow-500 rounded-full animate-spin"></div>
                      <span>جاري فحص رصيد المفاتيح...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                      <span>💳 فحص رصيد البوابة (Check Balance)</span>
                    </>
                  )}
                </button>

                {/* Balance results display */}
                {apiBalanceResult && (
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed animate-fade-in ${
                    apiBalanceResult.success 
                      ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-red-900/20 border-red-500/30 text-red-400'
                  }`}>
                    <div className="font-bold flex items-center gap-1 mb-0.5">
                      <span>{apiBalanceResult.success ? '✓ تم الربط والتحقق بنجاح!' : '⚠ فشل الاتصال:'}</span>
                    </div>
                    <p className="text-[10px] font-medium opacity-90">{apiBalanceResult.msg}</p>
                    {apiBalanceResult.success && apiBalanceResult.balance !== undefined && (
                      <div className="mt-1 pt-1 border-t border-emerald-500/10 font-mono font-black text-xs text-white flex items-center justify-between">
                        <span>الرصيد المتاح بالمحفظة:</span>
                        <span>{apiBalanceResult.balance.toLocaleString()} {apiBalanceResult.currency}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[9px] text-slate-500 leading-normal">
                  هذا الربط يُمكّن النظام من خصم وتجهيز المنتجات البرمجية تلقائياً فور تأكيد الطلب، مع عرض الرصيد المالي المتبقي بمزود الخدمة فورا.
                </p>
              </div>
            </div>

            {/* Direct Online Payment Gateways APIs Settings Card */}
            <div className="bg-[#0b1329] p-5 rounded-2xl border border-blue-900/40 shadow-lg space-y-4 w-full text-right" dir="rtl">
              <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <h4 className="text-xs font-black text-white">بوابات الدفع الإلكترونية المباشرة (APIs)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-400">تفعيل الدفع</span>
                  <input
                    type="checkbox"
                    id="payApiEnabledToggle"
                    checked={inputPayApiEnabled}
                    onChange={(e) => setInputPayApiEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-550 border-blue-900 bg-[#060b18] focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Provider select */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">مزود بوابة البيع الرقمي (Payment Gateway)</label>
                  <select
                    value={inputPayApiProvider}
                    onChange={(e) => setInputPayApiProvider(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50"
                  >
                    <option value="simulated">بوابة {siteName} التجريبية (Simulated Gateway ✓)</option>
                    <option value="myfatoorah">ماي فاتورة (MyFatoorah Global API)</option>
                    <option value="tap">تاب بايمنتس (Tap Payments Gate)</option>
                    <option value="moyasar">ميسر لخدمات الدفع (Moyasar KSA API)</option>
                  </select>
                </div>

                {/* API Request Url */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">رابط بوابة الـ API (Gateway URL / Base Endpoint)</label>
                  <input
                    type="url"
                    placeholder="https://api.myfatoorah.com/v2/ or https://api.tap.company/v2/"
                    value={inputPayApiUrl}
                    onChange={(e) => setInputPayApiUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                {/* Merchant Profile ID */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">رقم التاجر / الحساب (Merchant Profile ID)</label>
                  <input
                    type="text"
                    placeholder="مثال: MID-398242-VIP"
                    value={inputPayApiMerchantId}
                    onChange={(e) => setInputPayApiMerchantId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                {/* API Token / Key */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1 font-sans">مفتاح المصادقة السري (Bearer Token / API Key)</label>
                  <input
                    type="password"
                    placeholder="ضع كود التوكن أو الـ API Key السري للبوابة..."
                    value={inputPayApiToken}
                    onChange={(e) => setInputPayApiToken(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                {/* Check balance button */}
                <button
                  type="button"
                  disabled={checkingPayStatus}
                  onClick={handleCheckPayStatus}
                  className="w-full bg-[#1e293b]/60 hover:bg-[#334155]/60 border border-blue-900/60 text-slate-200 font-bold py-2 px-3 rounded-xl text-[10px] transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  {checkingPayStatus ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
                      <span>جاري اختبار اتصال بوابة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-550 animate-pulse" />
                      <span>💳 اختبار اتصال بوابة الدفع (Test Connection)</span>
                    </>
                  )}
                </button>

                {/* Balance results display */}
                {payStatusResult && (
                  <div className={`p-3 rounded-xl border text-[11px] leading-relaxed animate-fade-in ${
                    payStatusResult.success 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-red-950/20 border-red-500/30 text-red-400'
                  }`}>
                    <div className="font-bold flex items-center gap-1 mb-0.5">
                      <span>{payStatusResult.success ? '✓ تم الربط والتحقق بنجاح!' : '⚠ فشل الاتصال بالبوابة:'}</span>
                    </div>
                    <p className="text-[10px] font-medium opacity-90">{payStatusResult.msg}</p>
                    {payStatusResult.success && payStatusResult.balance !== undefined && (
                      <div className="mt-1 pt-1 border-t border-emerald-500/10 font-mono font-black text-xs text-white flex items-center justify-between">
                        <span>قيمة المبيعات المستلمة للبوابة اليوم:</span>
                        <span>{payStatusResult.balance.toLocaleString()} {payStatusResult.currency}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[9px] text-slate-500 leading-normal">
                  تسمح بوابات السداد للعملاء بدفع قيمة منتجاتهم فورياً بالمتجر عبر بطاقات مدى وفيزا وكي نت، ويتم المصادقة التلقائية وتحويل حالة المعاملات إلى تسليم فوري في الحال.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* FULL DETAILED REPORTS AND METRICS */}
      {activeTab === 'stats' && hasFinancePermission && (() => {
        // 1. Calculations for reconciliation Ledger
        const filteredReconciliationOrders = orders.filter(order => {
          // Fund Box filter
          if (selectedFund !== 'all' && order.paymentMethod !== selectedFund) {
            return false;
          }

          // Status filter
          if (reconciliationStatusFilter === 'ready' && order.status !== 'تم التسليم 🟢') {
            return false;
          }
          if (reconciliationStatusFilter === 'pending' && order.status !== 'قيد المعالجة' && order.status !== 'تم التجهيز للشحن') {
            return false;
          }
          if (order.status === 'ملغي ❌') {
            return false; // Skip cancelled
          }

          // Time filter "الماضي لا"
          if (excludePastOrders) {
            const cleanDate = (d: string) => d.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
            const todayLocale = new Date().toLocaleDateString("ar-YE");
            const todayStandard = new Date().toLocaleDateString();

            if (reconciliationPeriod === 'today') {
              const matchesToday = cleanDate(order.date).includes(cleanDate(todayLocale)) || order.date.includes(todayStandard);
              if (!matchesToday) return false;
            } else if (reconciliationPeriod === 'recent') {
              const matchesToday = cleanDate(order.date).includes(cleanDate(todayLocale)) || order.date.includes(todayStandard);
              const isPending = order.status === 'قيد المعالجة' || order.status === 'تم التجهيز للشحن';
              const isNotReconciled = !locallyReconciledOrderIds.includes(order.id);
              if (!matchesToday && !isPending && !isNotReconciled) {
                return false;
              }
            }
          }
          return true;
        });

        // 2. Financial totals of filtered reconciliation list
        const readyAmount = filteredReconciliationOrders
          .filter(o => o.status === 'تم التسليم 🟢')
          .reduce((sum, o) => sum + o.totalPrice, 0);

        const pendingAmount = filteredReconciliationOrders
          .filter(o => o.status === 'قيد المعالجة' || o.status === 'تم التجهيز للشحن')
          .reduce((sum, o) => sum + o.totalPrice, 0);

        // 3. Overall product statistics & recommendations
        const productSales: { [id: string]: { name: string; qty: number; revenue: number; category: string } } = {};
        orders.forEach(o => {
          if (o.status !== 'ملغي ❌') {
            o.items.forEach(it => {
              if (it.product) {
                const pid = it.product.id;
                if (!productSales[pid]) {
                  productSales[pid] = { name: it.product.name, qty: 0, revenue: 0, category: it.product.category };
                }
                productSales[pid].qty += it.quantity;
                productSales[pid].revenue += (it.product.price * it.quantity);
              }
            });
          }
        });

        const sortedSales = Object.entries(productSales).map(([id, val]) => ({ id, ...val })).sort((a,b) => b.qty - a.qty);
        const topProducts = sortedSales.slice(0, 5);

        const lowStockProds = products.filter(p => p.stock !== undefined && p.stock <= 4);

        const successfulOrders = orders.filter(o => o.status !== 'ملغي ❌');
        const totalRev = successfulOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const avgOrder = successfulOrders.length > 0 ? (totalRev / successfulOrders.length) : 0;

        return (
          <div className="bg-[#0b1329] p-5 sm:p-7 rounded-3xl border border-blue-900/40 shadow-sm space-y-6 animate-fade-in" id="advanced-reports-tab">
            {/* Tab Header with general instructions */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-blue-900/15 pb-5">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-yellow-450 animate-pulse" />
                  <span>منظومة الجرد المالي والتقارير الاستراتيجية VIP</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  قم بمطابقة ومقارنة أرصدة الحصالات، جرد صناديق الدفع (الماضي لا)، واطلع على مقترحات التطوير التشغيلية المدعومة ببيانات المخزون.
                </p>
              </div>

              {/* Sub-tab Switchers */}
              <div className="flex bg-[#060b18] p-1 rounded-xl border border-blue-900/40 w-full xl:w-auto" id="reports-subtab-switchers">
                <button
                  type="button"
                  onClick={() => setReportsSubTab('reconciliation')}
                  className={`flex-1 xl:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap gap-1.5 flex items-center justify-center ${
                    reportsSubTab === 'reconciliation'
                      ? 'bg-[#111a2f] text-yellow-405 shadow-md border border-yellow-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>جرد ومطابقة الصناديق 🏦</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportsSubTab('analytics')}
                  className={`flex-1 xl:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap gap-1.5 flex items-center justify-center ${
                    reportsSubTab === 'analytics'
                      ? 'bg-[#111a2f] text-yellow-405 shadow-md border border-yellow-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>تحليلات النمو والتطوير 📈</span>
                </button>
              </div>
            </div>

            {/* TAB 1: FUND RECONCILIATION & BALANCE MATCHING */}
            {reportsSubTab === 'reconciliation' && (
              <div className="space-y-6" id="fund-reconciliation-view">
                
                {/* Filter Configurations Panel */}
                <div className="bg-[#060b18]/75 p-5 rounded-2xl border border-blue-900/35 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400">تكوين فلاتر الجرد اليدوي لمطابقة الأرصدة ⚙️</span>
                    
                    {/* Quick toggle Exclude Past "الماضي لا" */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="exclude-past-checkbox"
                        checked={excludePastOrders}
                        onChange={(e) => setExcludePastOrders(e.target.checked)}
                        className="w-4 h-4 text-yellow-500 bg-blue-950 border-blue-900 rounded focus:ring-yellow-500/50"
                      />
                      <span className="text-[11px] sm:text-xs font-black text-rose-400 flex items-center gap-1">
                        <span>استبعاد الماضي المؤرشف (الماضي لا ⌛)</span>
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* 1. Select Cash register / Fund / Box ("تحديد الصندوق") */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-400">1. تحديد صندوق الدفع / المحفظة المالي (الصندوق)</label>
                      <select
                        value={selectedFund}
                        onChange={(e) => setSelectedFund(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-sans"
                        id="select-recon-fund"
                      >
                        <option value="all">🏦 كافة الصناديق وحصالات المتجر (الكل)</option>
                        {paymentMethods.map((method, idx) => (
                          <option key={idx} value={method}>💵 صندوق: {method}</option>
                        ))}
                        <option value="كاش ونقد يدوي">💵 نقد كاش / دفع مباشر</option>
                      </select>
                    </div>

                    {/* 2. Select Operation categories (العمليات الجاهزة vs المعلقة) */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-400">2. تصنيف حالة العمليات (جاهز ومكتمل / معلق)</label>
                      <div className="flex bg-[#060b18] p-1 border border-blue-900/40 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setReconciliationStatusFilter('all')}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                            reconciliationStatusFilter === 'all' ? 'bg-[#111a2f] text-yellow-405 border border-yellow-500/20' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          الكل
                        </button>
                        <button
                          type="button"
                          onClick={() => setReconciliationStatusFilter('ready')}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            reconciliationStatusFilter === 'ready' ? 'bg-[#111a2f] text-emerald-400 border border-emerald-500/20 font-bold' : 'text-slate-400 hover:text-emerald-400'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
                          <span>العمليات الجاهزة</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setReconciliationStatusFilter('pending')}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            reconciliationStatusFilter === 'pending' ? 'bg-[#111a2f] text-amber-500 border border-amber-500/20 font-bold' : 'text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>المعلّقة</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Reconcile period constraints (الماضي لا) */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-400">3. تحديد فترة الجرد (الماضي لا 🚫)</label>
                      <select
                        value={reconciliationPeriod}
                        onChange={(e) => setReconciliationPeriod(e.target.value as any)}
                        disabled={!excludePastOrders}
                        className="w-full px-3 py-2 bg-[#060b18] border border-blue-900/60 rounded-xl text-xs text-white outline-none focus:border-yellow-500/50 font-sans disabled:opacity-40"
                        id="select-recon-period"
                      >
                        <option value="recent">الوردية النشطة فقط (استبعاد الماضي المسوّى) ⌛</option>
                        <option value="today">اليوم الحالي (آخر 24 ساعة فقط)</option>
                        <option value="all">جميع السجلات التاريخية والأرشفة الفاشلة</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Funds Ledger Summary Metrics (رصيد الصندوق الحالي للجرد والمطابقة) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="ledger-balances-grid">
                  
                  {/* 1. Ready Settleable Cash (الصندوق الجاهز) */}
                  <div className="bg-[#060b18] p-4 rounded-2xl border border-emerald-950/40 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold font-sans">
                      <span>الرصيد الجاهز المستلم (🟢)</span>
                      <Wallet className="w-3.5 h-3.5 text-emerald-450" />
                    </div>
                    <div className="mt-2.5">
                      <p className="text-base sm:text-lg font-black text-emerald-400 font-mono tracking-tight">{displayPrice(readyAmount)}</p>
                      <p className="text-[9px] text-slate-450 mt-1">أموال جاهزة بالكامل للمطابقة والصندوق</p>
                    </div>
                  </div>

                  {/* 2. Pending In-Transit Cash (المعلقة) */}
                  <div className="bg-[#060b18] p-4 rounded-2xl border border-amber-950/40 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold font-sans">
                      <span>الأرصدة المعلقة بالتحويل (🟡)</span>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    </div>
                    <div className="mt-2.5">
                      <p className="text-base sm:text-lg font-black text-amber-500 font-mono tracking-tight">{displayPrice(pendingAmount)}</p>
                      <p className="text-[9px] text-slate-450 mt-1">حوالات قيد الانتظار لم تفعل بعد للعميل</p>
                    </div>
                  </div>

                  {/* 3. Total Cash Flow Checked (إجمالي جاري الجرد) */}
                  <div className="bg-[#060b18] p-4 rounded-2xl border border-blue-900/35 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold font-sans">
                      <span>إجمالي حساب الجرد المرشح</span>
                      <Coins className="w-3.5 h-3.5 text-yellow-405" />
                    </div>
                    <div className="mt-2.5">
                      <p className="text-base sm:text-lg font-black text-white font-mono tracking-tight">{displayPrice(readyAmount + pendingAmount)}</p>
                      <p className="text-[9px] text-slate-450 mt-1">من {filteredReconciliationOrders.length} معاملة في الفلاتر</p>
                    </div>
                  </div>

                  {/* 4. Locally Reconciled State (سجل المطابقة المؤكد) */}
                  <div className="bg-[#060b18] p-4 rounded-2xl border border-yellow-500/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl"></div>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold font-sans">
                      <span>رصيد تمت تسويته وتأكيده</span>
                      <CheckCircle className="w-3.5 h-3.5 text-yellow-405" />
                    </div>
                    <div className="mt-2.5">
                      {(() => {
                        const matchedTotal = filteredReconciliationOrders
                          .filter(o => locallyReconciledOrderIds.includes(o.id))
                          .reduce((sum, o) => sum + o.totalPrice, 0);
                        const matchedCount = filteredReconciliationOrders
                          .filter(o => locallyReconciledOrderIds.includes(o.id)).length;
                        return (
                          <>
                            <p className="text-base sm:text-lg font-black text-yellow-405 font-mono tracking-tight">{displayPrice(matchedTotal)}</p>
                            <p className="text-[9px] text-slate-450 mt-1">جرى مطابقتها يدوياً الخزنة اليوم ({matchedCount} طلبات)</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                </div>

                {/* Detailed Audit & Ledger Verification Table */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="text-xs font-black text-slate-250">مذكرة فحص وبطاقات المعاملات لحساب رصيد التجارة ({filteredReconciliationOrders.length} معاملة)</h4>
                    
                    <div className="flex gap-2">
                      {locallyReconciledOrderIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setLocallyReconciledOrderIds([])}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer font-bold"
                        >
                          إلغاء تسوية كل الصناديق في هذه الوردية
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsPrintModalOpen(true);
                        }}
                        className="px-3 py-1 bg-yellow-550/10 border border-yellow-500/25 text-yellow-500 rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                        id="print-recon-report-btn"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>تصدير وطباعة كشف الصندوق 🖨️</span>
                      </button>
                    </div>
                  </div>

                  {filteredReconciliationOrders.length === 0 ? (
                    <div className="bg-[#060b18]/45 border border-dashed border-blue-900/25 rounded-2xl p-10 text-center space-y-3">
                      <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">لا يوجد طلبيات تطابق فلاتر الجرد الحالية بالصندوق.</p>
                      <p className="text-[10px] text-slate-505 max-w-sm mx-auto leading-relaxed">
                        إذا كان وضع "استبعاد الماضي المؤرشف" مفعلاً، فهذا يعني أنك قد قمت بتسوية كل المعاملات الفائتة، أو لم تستلم طلبات جديدة في الوردية المفتوحة حالياً.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-blue-900/25 bg-[#060b18]/60">
                      <table className="w-full text-right text-xs" id="inventory-audit-table">
                        <thead>
                          <tr className="bg-[#060b18] text-slate-400 border-b border-blue-900/40 text-[10px] font-bold">
                            <th className="p-3">رقم الطلب</th>
                            <th className="p-3">صاحب الطلب والتاريخ</th>
                            <th className="p-3">طريقة السداد / الصندوق</th>
                            <th className="p-3 text-left">مبلغ الحساب المقابل</th>
                            <th className="p-3 text-center">أثر الحالة</th>
                            <th className="p-3 text-center">إجراء المطابقة الفوري</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-900/20">
                          {filteredReconciliationOrders.map((order) => {
                            const isReconciled = locallyReconciledOrderIds.includes(order.id);
                            return (
                              <tr key={order.id} className={`hover:bg-blue-950/15 transition-colors ${isReconciled ? 'bg-emerald-950/10 opacity-80' : ''}`}>
                                 
                                <td className="p-3 font-mono font-bold text-yellow-450 text-[10px] whitespace-nowrap">
                                  {order.id}
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  <div className="font-extrabold text-[11px] text-white">{order.customerName}</div>
                                  <div className="text-[9px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                    <span>{order.date}</span>
                                    <span>•</span>
                                    <span>{order.phone}</span>
                                  </div>
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  <span className="inline-block px-2 py-0.5 rounded bg-blue-950 text-slate-350 border border-blue-900/50 font-black text-[10px]">
                                    💵 {order.paymentMethod || 'نقد يدوي'}
                                  </span>
                                </td>

                                <td className="p-3 font-mono font-black text-left text-white whitespace-nowrap text-[11px]">
                                  {displayPrice(order.totalPrice)}
                                </td>

                                <td className="p-3 text-center whitespace-nowrap">
                                  {order.status === 'تم التسليم 🟢' ? (
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-405 border border-emerald-500/20">
                                      جاهز ومكتمل (رصيد حقيقي)
                                    </span>
                                  ) : (
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse">
                                      معلق (رصيد بالانتظار)
                                    </span>
                                  )}
                                </td>

                                <td className="p-3 text-center whitespace-nowrap">
                                  {isReconciled ? (
                                    <button
                                      type="button"
                                      onClick={() => setLocallyReconciledOrderIds(prev => prev.filter(id => id !== order.id))}
                                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-rose-500/10 text-emerald-400 hover:text-red-400 border border-emerald-500/25 hover:border-red-500/25 rounded-lg text-[9px] font-black transition-colors cursor-pointer"
                                    >
                                      ✓ مطابق ومسّوى (تراجع؟)
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setLocallyReconciledOrderIds(prev => [...prev, order.id])}
                                      className="px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-405 border border-yellow-500/25 hover:border-yellow-500/40 rounded-lg text-[9px] font-black transition-all cursor-pointer"
                                    >
                                      🎯 تأكيد مطابقة الرصيد بالبوابة
                                    </button>
                                  )}
                                </td>

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Re-assurance Cash Guide card */}
                <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/15 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-450 shrink-0 mt-0.5 animate-bounce" />
                  <div className="text-[11px] leading-relaxed text-slate-350 font-sans space-y-1">
                    <strong className="text-yellow-405 block">💡 دليل المطابقة الحسابية وجرد الصناديق:</strong>
                    <p>
                      المطابقة الدقيقة تتطلب مقارنة الحصيلة في الخزائن والبريد الإلكتروني للتحويل مع الأرقام المسردة أعلاه. اضغط على زر <b>"تأكيد مطابقة الرصيد بالبوابة"</b> لتأكيد تصفية كل معاملة ومطابقتها للتأكد من خلو الوردية الحالية من الفوارق المالية.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PERFORMANCE ANALYTICS & DEVELOPMENT INSIGHTS */}
            {reportsSubTab === 'analytics' && (
              <div className="space-y-6" id="performance-insights-view">
                
                {/* Dynamic growth and development suggestions compiled from active store figures */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 1. Low Stock & Out of Stock lifelines */}
                  <div className="bg-[#060b18] p-5 rounded-2xl border border-blue-900/35 space-y-3.5 text-right flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-300 pb-2 border-b border-blue-900/15 flex justify-between items-center">
                        <span>⚠️ منبه المخزون ونواقص المنتجات العاجلة</span>
                        <span className="text-[9px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded border border-red-500/20">تنبيه النواقص بالمتجر</span>
                      </h4>

                      {lowStockProds.length === 0 ? (
                        <p className="text-xs text-slate-500 py-10 text-center">كل مخزون المنتجات سليم ولا توجد نواقص في مستودعنا الفولاذي 🌟</p>
                      ) : (
                        <div className="space-y-2 h-60 overflow-y-auto pr-1 mt-2">
                          {lowStockProds.map((prod) => (
                            <div key={prod.id} className="p-3 rounded-lg bg-red-950/10 border border-red-950/20 flex items-center justify-between gap-3 text-xs">
                              <div className="space-y-1 text-right">
                                <span className="font-extrabold text-white block">{prod.name}</span>
                                <span className="text-[10px] text-slate-500 block">القسم: {prod.category} • الكود: {prod.code || 'مخفي'}</span>
                              </div>
                              <div className="text-left whitespace-nowrap">
                                {prod.stock === 0 ? (
                                  <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-rose-450 font-black text-[9px] rounded">نفد بالكامل ❌</span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-yellow-500/15 border border-yellow-500/30 text-yellow-455 font-black text-[9px] rounded">شبه نفد ({prod.stock} حبات) ⏳</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-blue-900/15 text-[10px] text-slate-450 mt-4 leading-relaxed">
                      💡 <b>توصية التطوير:</b> إعادة تأمين هذه النواقص تضمن استدامة الرصيد ومنع نفور العملاء المستعجلين لشحن الشدات والألعاب.
                    </div>
                  </div>

                  {/* 2. Top Selling products & stars */}
                  <div className="bg-[#060b18] p-5 rounded-2xl border border-blue-900/35 space-y-3.5 text-right flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-300 pb-2 border-b border-blue-900/15 flex justify-between items-center">
                        <span>🔥 الأصناف الأكثر مبيعاً ورواجاً (نجم المتجر الحالي)</span>
                        <span className="text-[9px] bg-yellow-500/15 text-yellow-405 px-2 py-0.5 rounded border border-yellow-500/20">الأفضل طلباً</span>
                      </h4>

                      {topProducts.length === 0 ? (
                        <p className="text-xs text-slate-500 py-10 text-center">لم تسجل طلبيات مبيعات ناجحة بعد لتحليل رغبات الزوار 🐺</p>
                      ) : (
                        <div className="space-y-2 h-60 overflow-y-auto pr-1 mt-2">
                          {topProducts.map((prod, idx) => (
                            <div key={prod.id} className="p-3 rounded-lg bg-[#00040a]/40 border border-blue-900/20 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black text-[10px] flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="space-y-0.5 text-right">
                                  <span className="font-extrabold text-white block line-clamp-1">{prod.name}</span>
                                  <span className="text-[10px] text-slate-450 block">مباع: {prod.qty} أصناف • الحصيلة: <span className="font-mono text-emerald-400 font-bold">{displayPrice(prod.revenue)}</span></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-blue-900/15 text-[10px] text-slate-450 mt-4 leading-relaxed">
                      💡 <b>توصية التطوير:</b> ننصح بزيادة تنويهات التسويق بوضع ويدجت "شائع الآن" لهذه الأصناف لزيادة التحويل.
                    </div>
                  </div>

                </div>

                {/* Strategic Development & Interactive Add-on Needs (تحليل المتجر لكيف التنمية والإضافات) */}
                <div className="bg-[#060b18] p-5 rounded-3xl border border-blue-900/30 space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-450 animate-bounce" />
                      <span>التوصيات الذكية والإضافات المقترحة لتطوير موقع {siteName} 💡</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">مقترحات مصممة آلياً لمتجركم {siteName} لرفع متوسط الربحية وتطوير رحلة مستخدم الذيباني.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Suggestion 1: Average basket and packages */}
                    <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/25 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-500/15 text-indigo-400 rounded-lg flex items-center justify-center font-black text-xs font-mono">AOV</div>
                        <strong className="text-xs text-white">ترقية الـ Average Order وطرح الحزم المدمجة</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        متوسط قيمة السلة الحالية بالمتجر هو <span className="font-bold text-yellow-405 font-mono">{displayPrice(avgOrder)}</span>. 
                        <b> نوصي بإطلاق "باقات مدمجة"</b> (مثل: شدات ببجي VIP مع اشتراك مساند، أو بهارات كبسة مدمجة مع أرز تايلندي فاخر) لرفع رغبة الشراء الفوري بنسبة 30%.
                      </p>
                    </div>

                    {/* Suggestion 2: Digital Loyalty coupons */}
                    <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/25 space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-455" />
                        <strong className="text-xs text-white">إضافة نظام "كوبونات الولاء والخصومات الرياضية"</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        يحتاج المتجر إلى طرح <b>منظومة كوبونات خصم ديناميكية</b>. إضافة خانة للكوبونات بالـ Checkout ستمنحكم القدرة على عمل تسويق بالعمولة وإطلاق مهرجانات خصم فوري في المناسبات لزيادة الأرصدة المستلمة بالصناديق.
                      </p>
                    </div>

                    {/* Suggestion 3: Reduce transit pending payments */}
                    <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/25 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-450 animate-pulse" />
                        <strong className="text-xs text-white">تقليل "التحويلات المعلقة" بدمج بوابة دفع فوري</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        لديك عمليات معلقة بالانتظار بقيمة <span className="text-amber-500 font-bold font-mono">{displayPrice(orders.filter(o => o.status === 'قيد المعالجة').reduce((s,o)=>s+o.totalPrice,0))}</span>. 
                        <b> الربط التلقائي عبر بوابات الكريمي وجوال بي الفورية</b> سيحول هذه الأرصدة إلى "جاهزة" تلقائياً دون تفتيش بشري!
                      </p>
                    </div>

                    {/* Suggestion 4: Customer recommendations and additions */}
                    <div className="p-4 rounded-xl bg-blue-950/15 border border-blue-900/25 space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-500 animate-pulse" />
                        <strong className="text-xs text-white">إطلاق قسم تقييم المنتجات وشهادات العملاء</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        أداء مبيعات متجركم VIP ممتاز! نقترح <b>توفير قسم "آراء الزبائن وشهادات الجودة المعززة بالصور"</b> لزرع طابع الطمأنينة الكاملة لمستخدمي متصفح الويب الجدد.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* PDF Statement Print Preview Modal */}
            {isPrintModalOpen && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-10 text-slate-900 flex justify-center items-start no-print">
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    #printable-report-area, #printable-report-area * {
                      visibility: visible !important;
                    }
                    #printable-report-area {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      right: 0 !important;
                      width: 100% !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 1.5cm !important;
                      background: white !important;
                      color: black !important;
                      box-shadow: none !important;
                      border: none !important;
                    }
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    #printable-report-area .flex {
                      display: flex !important;
                    }
                    #printable-report-area .grid {
                      display: grid !important;
                    }
                  }
                `}} />
                
                <div className="w-full max-w-4xl bg-[#0b1329] p-4 sm:p-6 rounded-3xl border border-blue-900/30 flex flex-col gap-4 animate-fade-in no-print text-white">
                  {/* Top Modal Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-blue-900/20 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-black text-slate-200">معاينة مستند تقرير كشف الصندوق والمطابقة كـ PDF جاهز للطباعة</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {/* Print Trigger Button */}
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-505 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-blue-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>تصدير كشف الصناديق كـ PDF 📄</span>
                      </button>
                      
                      {/* Close Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsPrintModalOpen(false)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                      >
                        إغلاق المعاينة ❌
                      </button>
                    </div>
                  </div>

                  {/* A4 Document Area */}
                  <div 
                    id="printable-report-area" 
                    className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 text-right leading-relaxed font-sans"
                    dir="rtl"
                  >
                    {/* Document Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6">
                      <div className="space-y-1">
                        <h1 className="text-base sm:text-lg font-black text-slate-900">{siteName}</h1>
                        <p className="text-[10px] text-slate-500 font-extrabold pb-0.5">بوابة الرقابة المالية والحسابات والمطابقة الفورية</p>
                        <p className="text-[10px] text-slate-500 font-bold">هاتف الدعم المعتمد: {whatsappNumber}</p>
                      </div>
                      
                      {/* Geometric Seal Vector Emblem */}
                      <div className="flex flex-col items-center gap-1">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt="Logo" 
                            className="w-14 h-14 object-contain rounded-lg border border-slate-200 p-1 bg-white"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center font-black text-slate-600 text-[10px]">
                            {siteName}
                          </div>
                        )}
                        <span className="text-[8px] tracking-widest text-slate-400 font-black uppercase font-mono">FINANCE SEAL</span>
                      </div>

                      <div className="text-left space-y-1 font-mono text-[10px] text-slate-600">
                        <p className="font-bold"><span className="font-sans">مرجع كود الجرد:</span> <span className="text-slate-950 font-black">RECON-{Date.now().toString().slice(-8)}</span></p>
                        <p><span>التاريخ:</span> <span>{new Date().toLocaleDateString('ar-YE', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span></p>
                        <p><span>الوقت:</span> <span>{new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}</span></p>
                        <p className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-sans font-bold mt-1 inline-block">المحاسبة الإدارية: مطابقة تامة ✓</p>
                      </div>
                    </div>

                    {/* Title Content */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center mb-6 space-y-1.5">
                      <h2 className="text-sm font-black text-slate-900">كشف حركة أرصدة الصناديق وحساب جرد الخزينة (الماضي لا 🚫)</h2>
                      <p className="text-[10px] text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
                        يحتوي هذا المستند الإداري على تفاصيل ومبالغ المعاملات المحجوزة بالمتجر ومطابقة الأرصدة المستلمة في المحافظ والصناديق بهدف كشف الفروقات وتصفية الوردية النشطة.
                      </p>
                    </div>

                    {/* Info Grid of Report Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-6 text-[10px] leading-relaxed">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block">🏦 الصندوق الخاضع للفحص:</span>
                        <strong className="text-slate-900 block font-extrabold">{selectedFund === 'all' ? 'كافة حصالات المتجر والصناديق (الكل)' : `صندوق: ${selectedFund}`}</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block">⌛ فلترة المعاملات المؤرشفة:</span>
                        <strong className="text-slate-900 block font-extrabold">{excludePastOrders ? 'استبعاد الماضي المؤرشف (الوردية النشطة)' : 'معاينة السجلات التاريخية كاملة'}</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block">⚙️ حالة التدقيق المعتمد:</span>
                        <strong className="text-slate-900 block font-extrabold">
                          {reconciliationStatusFilter === 'all' ? 'جميع الحالات والعمليات دون استثناء' : reconciliationStatusFilter === 'ready' ? 'العمليات الجاهزة والمستلمة فقط' : 'العمليات المعلقة بالانتظار'}
                        </strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-bold block">📅 نطاق فترة تقرير الجرد:</span>
                        <strong className="text-slate-900 block font-extrabold">
                          {reconciliationPeriod === 'all' ? 'كامل تاريخ المتجر' : reconciliationPeriod === 'today' ? 'آخر 24 ساعة فقط' : 'الوردية المفعلة (المعلقة والجديدة)'}
                        </strong>
                      </div>
                    </div>

                    {/* Metrics Grid Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-between">
                        <span className="text-emerald-700 text-[9px] font-black block">🟢 الرصيد الفعلي الجاهز</span>
                        <strong className="text-emerald-800 text-sm font-black font-mono tracking-tight block mt-1">{displayPrice(readyAmount)}</strong>
                        <span className="text-[8px] text-emerald-600 block mt-0.5 leading-normal">أموال مستلمة ومؤكدة بالخزنة</span>
                      </div>

                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex flex-col justify-between">
                        <span className="text-amber-700 text-[9px] font-black block">🟡 الأرصدة قيد الانتظار</span>
                        <strong className="text-amber-800 text-sm font-black font-mono tracking-tight block mt-1">{displayPrice(pendingAmount)}</strong>
                        <span className="text-[8px] text-amber-600 block mt-0.5 leading-normal">حوالات معلقة لم تصفى بالصناديق</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <span className="text-slate-700 text-[9px] font-black block">💰 مجموع حركة الحساب</span>
                        <strong className="text-slate-900 text-sm font-black font-mono tracking-tight block mt-1">{displayPrice(readyAmount + pendingAmount)}</strong>
                        <span className="text-[8px] text-slate-500 block mt-0.5 leading-normal">من واقع {filteredReconciliationOrders.length} معاملة بالتقرير</span>
                      </div>

                      {/* Settle status card */}
                      <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 flex flex-col justify-between">
                        <span className="text-yellow-850 text-[9px] font-black block">🎯 مبالغ صُفيت ومُطابقت</span>
                        {(() => {
                          const matchedTotal = filteredReconciliationOrders
                            .filter(o => locallyReconciledOrderIds.includes(o.id))
                            .reduce((sum, o) => sum + o.totalPrice, 0);
                          const matchedCount = filteredReconciliationOrders
                            .filter(o => locallyReconciledOrderIds.includes(o.id)).length;
                          return (
                            <>
                              <strong className="text-yellow-900 text-sm font-black font-mono tracking-tight block mt-1">{displayPrice(matchedTotal)}</strong>
                              <span className="text-[8px] text-yellow-750 block mt-0.5 leading-normal">جرى جرد ومطابقة {matchedCount} طلبات باليدي</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Ledger Statement Details Table */}
                    <div className="space-y-2 mb-8">
                      <h3 className="text-[11px] font-black text-slate-800">تفاصيل المعاملات وحركات المبيعات الفورية المدرجة بالجرد المالي:</h3>
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-right text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-extrabold text-[9px]">
                              <th className="p-2.5 border-r border-slate-200 text-center">رقم المرجع (ID)</th>
                              <th className="p-2.5 border-r border-slate-200">العميل والهاتف</th>
                              <th className="p-2.5 border-r border-slate-200 text-center">صندوق السداد كاش/بنكي</th>
                              <th className="p-2.5 border-r border-slate-200 text-left">مبلغ المعاملة</th>
                              <th className="p-2.5 border-r border-slate-200 text-center">أثر الحالة المالية</th>
                              <th className="p-2.5 text-center">مطابقة الصندوق الخزنة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 font-medium">
                            {filteredReconciliationOrders.map((order) => {
                              const isReconciled = locallyReconciledOrderIds.includes(order.id);
                              return (
                                <tr key={order.id} className="hover:bg-slate-50/50">
                                  <td className="p-2 font-mono text-[9px] text-slate-600 text-center border-r border-slate-200">{order.id}</td>
                                  <td className="p-2 border-r border-slate-200">
                                    <div className="font-extrabold text-slate-900">{order.customerName}</div>
                                    <div className="text-[8px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5" dir="ltr">
                                      <span>{order.phone}</span>
                                      <span>•</span>
                                      <span>{order.date}</span>
                                    </div>
                                  </td>
                                  <td className="p-2 text-center font-bold text-slate-700 border-r border-slate-200">
                                    💵 {order.paymentMethod || 'نقد يدوي'}
                                  </td>
                                  <td className="p-2 font-black text-slate-900 text-left font-mono text-[10px] border-r border-slate-200">{displayPrice(order.totalPrice)}</td>
                                  <td className="p-2 text-center border-r border-slate-200">
                                    {order.status === 'تم التسليم 🟢' ? (
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        جاهز ومستلم فعلآ (تأثير موجب)
                                      </span>
                                    ) : (
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-100">
                                        معلق بالانتظار (طلب نشط)
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2 text-center font-bold">
                                    {isReconciled ? (
                                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-black text-[9px] inline-flex items-center gap-1">
                                        ✓ تمت التسوية والمطابقة
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-150 font-bold text-[9px] inline-flex items-center gap-1">
                                        ⌛ غير مطابق يدوياً بالخزنة
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Authorized Signatures Section */}
                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-300 text-[10px] leading-relaxed">
                      <div className="space-y-8">
                        <div className="text-slate-800 font-extrabold">
                          <p className="border-b border-dashed border-slate-300 pb-1 inline-block w-40">توقيع واعتماد محاسب / أمين الصندوق:</p>
                        </div>
                        <div className="text-slate-400 font-bold">
                          <span>التوقيع: ............................................</span>
                          <p className="mt-1">التاريخ:     /    / 2026م</p>
                        </div>
                      </div>
                      <div className="space-y-8 text-left">
                        <div className="text-slate-800 font-extrabold">
                          <p className="border-b border-dashed border-slate-300 pb-1 inline-block w-40">توقيع ومصادقة المشرف العام للموقع:</p>
                        </div>
                        <div className="text-slate-400 font-bold">
                          <span>ختم واعتماد المنصة: ................................</span>
                          <p className="mt-1">التاريخ:     /    / 2026م</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer info for print */}
                    <div className="text-center text-[8px] text-slate-400 mt-12 bg-slate-50 p-2.5 rounded-lg border border-slate-150 flex items-center justify-between font-mono font-bold">
                      <span>صادر من النظام المالي الإلكتروني لمنصة {siteName}</span>
                      <span>صفحة 1 من 1</span>
                      <span>بإشراف قسم الحسابات العام</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
}
