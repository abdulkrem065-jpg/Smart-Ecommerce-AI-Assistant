import React, { useState } from "react";
import { useStore } from '../store';
import SettingsTab from "./Admin/tabs/SettingsTab";
import OrdersTab from "./Admin/tabs/OrdersTab";
import { t } from '../core/translations';
import { GlobalSidebar } from "./Admin/GlobalSidebar";

import { SalesInvoicesTab } from "./Admin/tabs/SalesInvoicesTab";
import { PurchaseInvoicesTab } from "./Admin/tabs/PurchaseInvoicesTab";
import { CashAccountsTab } from "./Admin/tabs/CashAccountsTab";
import CustomersTab from "./Admin/tabs/CustomersTab";
import SuppliersTab from "./Admin/tabs/SuppliersTab";
import SalesReturnsTab from "./Admin/tabs/SalesReturnsTab";
import PurchaseReturnsTab from "./Admin/tabs/PurchaseReturnsTab";
import FixedAssetsTab from "./Admin/tabs/FixedAssetsTab";
import { CostCentersTab } from "./Admin/tabs/CostCentersTab";
import { AdvancedReportsTab } from "./Admin/tabs/AdvancedReportsTab";
import { RolesTab } from "./Admin/tabs/RolesTab";

import { EmployeesTab } from "./Admin/tabs/EmployeesTab";
import { NotificationBell } from "./Admin/NotificationBell";




import InventoryTab from "./Admin/tabs/InventoryTab";
import CategoriesTab from "./Admin/tabs/CategoriesTab";
import AccountsTab from "./Admin/tabs/AccountsTab";
import TrialBalanceView from "./Admin/tabs/TrialBalanceView";
import FinancialStatementsView from "./Admin/tabs/FinancialStatementsView";
import FiscalClosingView from "./Admin/tabs/FiscalClosingView";
import { Product, StoreCategory, Order, CarouselSlide, Staff, UserSession } from '../core/types';
import { NICHES } from '../data';
import { isModuleEnabled, isFeatureEnabled } from '../core/moduleLoader';
import { DollarExchangePricing } from '../modules/games_hyper/DollarExchangePricing';
import { exportOrdersToCSV, printOrder } from "../core/exportUtils";
import { Menu, Plus, Edit2, Building, Truck, Undo2, Trash2, Package, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Smartphone, Layers, UploadCloud, Image as ImageIcon, Coins, MessageSquare, Settings, Sliders, ClipboardList, CheckCircle2, Trash, Check as CheckIcon, X as XIcon, User, MapPin, Calendar, AlertCircle, Wallet, FileText, Award, Lightbulb, BarChart3, PieChart as PieChartIcon, Shield, CreditCard, Users, ShieldCheck, Zap, ShoppingCart, Building2 } from 'lucide-react';

import { PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, Pie } from 'recharts';

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
  currency?: string;
  onUpdateCurrency?: (curr: string) => void;

  customCurrencyEnabled?: boolean;
  onUpdateCustomCurrencyEnabled?: (enabled: boolean) => void;
  customCurrencyCode?: string;
  onUpdateCustomCurrencyCode?: (code: string) => void;
  customCurrencySymbol?: string;
  onUpdateCustomCurrencySymbol?: (symbol: string) => void;
  customCurrencyRateToYer?: number;
  onUpdateCustomCurrencyRateToYer?: (rate: number) => void;

  adminDiscountValue?: number;
  onUpdateAdminDiscountValue?: (val: number) => void;
  adminDiscountType?: 'fixed' | 'percent';
  onUpdateAdminDiscountType?: (type: 'fixed' | 'percent') => void;

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

  customCurrencyEnabled = false,
  onUpdateCustomCurrencyEnabled,
  customCurrencyCode = 'USD',
  onUpdateCustomCurrencyCode,
  customCurrencySymbol = '$',
  onUpdateCustomCurrencySymbol,
  customCurrencyRateToYer = 1500,
  onUpdateCustomCurrencyRateToYer,

  adminDiscountValue = 0,
  onUpdateAdminDiscountValue,
  adminDiscountType = 'fixed',
  onUpdateAdminDiscountType,

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
  const lang = localStorage.getItem('store_lang') || 'ar';
  // Main admin control panel navigation tabs
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'categories' | 'orders' | 'slides' | 'configuration' | 'stats' | 'staff' | 'accounting' | 'trial_balance' | 'financial_statements' | 'fiscal_closing' | 'sales_invoices' | 'purchase_invoices' | 'cash_accounts' | 'employees' | 'advanced_reports' | 'cost_centers' | 'fixed_assets' | 'customers' | 'suppliers' | 'sales_returns' | 'purchase_returns' | 'roles_permissions' | 'inventory'>(() => {
    return 'stats'; // Always default to stats for dashboard
    if (userSession?.role === 'staff') {
      if (userSession.permissions?.canEditInventory) return 'inventory';
      if (userSession.permissions?.canManageOrders) return 'orders';
      if (userSession.permissions?.canViewFinance) return 'stats';
      return 'orders';
    }
    return 'inventory';
  });
  
  // Advanced reporting & reconciliation states
  const [reportsSubTab, setReportsSubTab] = useState<'reconciliation' | 'analytics'>('reconciliation');
  const [reconciliationStatusFilter, setReconciliationStatusFilter] = useState<'all' | 'ready' | 'pending'>('all');
  const [excludePastOrders, setExcludePastOrders] = useState<boolean>(true);
  
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPriceSar, setProductPriceSar] = useState('');
  const [productPriceYer, setProductPriceYer] = useState('');
  const [productCurrency, setProductCurrency] = useState('SAR');
  const [applyCurrencyToAll, setApplyCurrencyToAll] = useState(false);
  const [productColors, setProductColors] = useState('');
  const [productFlavors, setProductFlavors] = useState('');
  const [productStock, setProductStock] = useState('10');
  const [productImage, setProductImage] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productImages, setProductImages] = useState('');
  const [productCostUsd, setProductCostUsd] = useState('');
  const [productProfitMarginUsd, setProductProfitMarginUsd] = useState('');
  const [productIsDigitalService, setProductIsDigitalService] = useState(false);
  const [productDigitalServiceType, setProductDigitalServiceType] = useState('direct');
  const [productDigitalCategory, setProductDigitalCategory] = useState('game');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCatArabic, setNewCatArabic] = useState('');
  const [newCatEnglish, setNewCatEnglish] = useState('');
  const [selectedFund, setSelectedFund] = useState('');

  const [reconciliationPeriod, setReconciliationPeriod] = useState<'all' | 'recent' | 'today'>('recent');
  const [locallyReconciledOrderIds, setLocallyReconciledOrderIds] = useState<string[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  
  // Strict Permission Helpers for RBAC
  const isDeveloper = userSession?.role === 'developer';
  const isOwner = userSession?.role === 'owner';
  const isStaff = userSession?.role === 'staff';
  
    const { checkPermission } = useStore();
  const canViewCostCenters = checkPermission('cost_centers', 'canView');
  const canViewReports = checkPermission('reports', 'canView');
  const canViewUsers = checkPermission('users', 'canView');
  const hasFinancePermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canViewFinance);
  const hasInventoryPermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canEditInventory);
  const hasOrdersPermission = isDeveloper || isOwner || (isStaff && !!userSession?.permissions?.canManageOrders);
  const isSuperUser = isDeveloper || isOwner; // configuration and staff management are limited to owners and developers
  
  const getProductPriceInSAR = (p: any) => {
    if (!p) return 0;
    const rate = exchangeRate || 400;
    if (currency === 'YER') {
      // If store currency is YER, prioritize the actual native YER price to prevent lossy conversions
      if (p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0) {
        return p.price_yer / rate;
      }
      if (p.currency === 'YER' && p.price !== undefined && p.price !== null && p.price !== 0) {
        return p.price / rate;
      }
      if (p.price_sar !== undefined && p.price_sar !== null && p.price_sar !== 0) {
        return p.price_sar;
      }
      return p.price ?? 0;
    } else {
      // If store currency is SAR, prioritize the actual native SAR price
      if (p.price_sar !== undefined && p.price_sar !== null && p.price_sar !== 0) {
        return p.price_sar;
      }
      if (p.currency === 'SAR' && p.price !== undefined && p.price !== null && p.price !== 0) {
        return p.price;
      }
      if (p.price_yer !== undefined && p.price_yer !== null && p.price_yer !== 0) {
        return p.price_yer / rate;
      }
      if (p.currency === 'YER' && p.price !== undefined && p.price !== null && p.price !== 0) {
        return p.price / rate;
      }
      return p.price ?? 0;
    }
  };

  const getOrderTotalPrice = (order: any) => {
    if (order.totalPrice && order.totalPrice > 0) {
      return order.totalPrice;
    }
    if (order.items && order.items.length > 0) {
      const itemsSum = order.items.reduce((sum: number, item: any) => {
        const pPrice = getProductPriceInSAR(item.product);
        return sum + pPrice * (item.quantity || 1);
      }, 0);
      return itemsSum;
    }
    return 0;
  };

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
  const [inputCurrency, setInputCurrency] = useState<string>(currency);

  const [inputCustomCurrencyEnabled, setInputCustomCurrencyEnabled] = useState<boolean>(customCurrencyEnabled);
  const [inputCustomCurrencyCode, setInputCustomCurrencyCode] = useState<string>(customCurrencyCode);
  const [inputCustomCurrencySymbol, setInputCustomCurrencySymbol] = useState<string>(customCurrencySymbol);
  const [inputCustomCurrencyRateToYer, setInputCustomCurrencyRateToYer] = useState<number>(customCurrencyRateToYer);

  const [inputAdminDiscountValue, setInputAdminDiscountValue] = useState<number>(adminDiscountValue);
  const [inputAdminDiscountType, setInputAdminDiscountType] = useState<'fixed' | 'percent'>(adminDiscountType);
  
  // Smart multi-currency input states
  const [inputUsdToSar, setInputUsdToSar] = useState<number>(usdToSar);
  const [inputUsdToYer, setInputUsdToYer] = useState<number>(usdToYer);

  // Digital Specific product fields

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

  // --- MULTI-PROVIDER & MULTI-GATEWAY API ROUTING STATE & SETTINGS (v5 SPEC) ---
  const [multiProviders, setMultiProviders] = useState(() => {
    const saved = localStorage.getItem("store_multi_providers_v5");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "ym_prov",
        name: "مزود يمن موبايل وسداد الباقات الرقمي",
        englishName: "Yemen Mobile Bundle API Provider",
        type: "yemen_mobile",
        url: "https://api.yemenmobile-gate.com/v3",
        token: "YM-SEC-849202-XVIP-KEY",
        settleMode: "auto_pay", // auto_pay | manual_audit
        pricingMode: "automated", // automated | manual
        margin: 10, // 10% defaults
        status: "connected", // connected | offline
        enabled: true
      },
      {
        id: "telecom_prov",
        name: "مزود باقات اتصالات سبأفون ويو واليمنية المحلية",
        englishName: "Telecom Cards & Scratch API Gate",
        type: "telecom_scratch",
        url: "https://api.sabafone-mtn.dhibani.net/v1",
        token: "TEL-SEC-581920-YVP-KEY",
        settleMode: "manual_audit",
        pricingMode: "manual", // start manually
        margin: 15,
        status: "connected",
        enabled: true
      },
      {
        id: "games_prov",
        name: "مزود شدات ببجي وجواهر الألعاب السلس الدولي",
        englishName: "Global Gaming & Diamonds API Hub",
        type: "gaming_gems",
        url: "https://api.globalgames-dhibani.net/v2",
        token: "GAME-SEC-402851-GIP-KEY",
        settleMode: "auto_pay",
        pricingMode: "automated",
        margin: 12,
        status: "connected",
        enabled: true
      }
    ];
  });

  const [paymentGateways, setPaymentGateways] = useState(() => {
    const saved = localStorage.getItem("store_payment_gateways_v5");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "amal_bank", name: "بوابة بنك الأمل للتمويل والخدمات 🏦", enabled: true, logo: "🏦", status: "active" },
      { id: "kuraimi_app", name: "الكريمي جوال للتحصيل والربط المباشر 💳", enabled: true, logo: "💳", status: "active" },
      { id: "jawwal_pay", name: "بوابة جوال باي للدفع الإلكتروني المتنقل 📱", enabled: true, logo: "📱", status: "active" },
      { id: "tadhamon_bank", name: "بنك التضامن الإسلامي الدولي (التضامن موبايل) 🏛️", enabled: false, logo: "🏛️", status: "active" },
      { id: "cash_manual", name: "سداد يدوي (حساب كاش الطرفي المباشر) 💵", enabled: true, logo: "💵", status: "active" },
      { id: "wallet_pocket", name: "محفظة كاش الرقمية الفردية السحابية 💼", enabled: true, logo: "💼", status: "active" }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("store_multi_providers_v5", JSON.stringify(multiProviders));
  }, [multiProviders]);

  React.useEffect(() => {
    localStorage.setItem("store_payment_gateways_v5", JSON.stringify(paymentGateways));
    // Synced with parent payment list
    const activeMethods = paymentGateways.filter(g => g.enabled).map(g => g.name);
    const isDifferent = activeMethods.length !== paymentMethods.length ||
      activeMethods.some((m, idx) => m !== paymentMethods[idx]);

    if (isDifferent && activeMethods.length > 0) {
      onUpdatePaymentMethods(activeMethods);
    }
  }, [paymentGateways, paymentMethods, onUpdatePaymentMethods]);

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
    setInputCustomCurrencyEnabled(customCurrencyEnabled);
  }, [customCurrencyEnabled]);

  React.useEffect(() => {
    setInputCustomCurrencyCode(customCurrencyCode);
  }, [customCurrencyCode]);

  React.useEffect(() => {
    setInputCustomCurrencySymbol(customCurrencySymbol);
  }, [customCurrencySymbol]);

  React.useEffect(() => {
    setInputCustomCurrencyRateToYer(customCurrencyRateToYer);
  }, [customCurrencyRateToYer]);

  React.useEffect(() => {
    setInputAdminDiscountValue(adminDiscountValue);
  }, [adminDiscountValue]);

  React.useEffect(() => {
    setInputAdminDiscountType(adminDiscountType);
  }, [adminDiscountType]);

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
    // Deeply integrated, authentic default staff for the multi-niche platform: Owner & Assistant Staff
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
        username: 'assistant',
        fullName: 'الكادر المساعد المعتمد',
        role: 'cashier',
        permissions: { canViewFinance: true, canEditInventory: true, canManageOrders: true, canUseAI: true }
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
    setActiveTab('inventory');
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
    <div className="flex bg-[#030712] min-h-screen text-white" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <GlobalSidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 overflow-x-hidden p-6 md:p-8 space-y-8" id="admin-dashboard-root">
      
      {/* Page Title & Navigation Tabs row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0b1329] text-slate-400 hover:text-white rounded-xl border border-blue-900/40 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 tracking-tight" id="dashboard-title">
              لوحة الإدارة الفنية والتحكم المتكاملة VIP 🛠️
            </h2>
          </div>
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

          <div className="flex items-center gap-2 mt-3.5">
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>تسجيل خروج المشرف 🚪</span>
              </button>
            )}
            <NotificationBell />
          </div>
        </div>

      </div>

      {/* Real-time Toast notices */}
      {notification && (
        <div id="notification-banner" className="p-4 rounded-2xl flex items-center gap-3 transition-opacity duration-300 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-yellow-400 animate-bounce" />
          <p className="text-xs font-bold leading-normal">{notification.text}</p>
        </div>
      )}

      {activeTab === 'stats' && (
      <div className="space-y-6">
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

      
        
        {/* Recent Activities / Orders Table */}
        <div className="bg-[#0b1329] p-6 rounded-2xl border border-blue-900/40">
          <h3 className="text-lg font-bold text-white mb-4">آخر النشاطات والطلبات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-[#1e293b]">
                <tr>
                  <th className="px-6 py-3">رقم الطلب</th>
                  <th className="px-6 py-3">العميل</th>
                  <th className="px-6 py-3">المبلغ</th>
                  <th className="px-6 py-3">الحالة</th>
                  <th className="px-6 py-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-blue-900/20 hover:bg-[#1e293b]/50">
                    <td className="px-6 py-4 font-medium text-white">{o.id}</td>
                    <td className="px-6 py-4 text-white">{o.customerName || 'غير مسجل'}</td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{formatPrice ? formatPrice(o.totalPrice) : o.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        o.status.includes('ملغي') ? 'bg-red-500/20 text-red-400' :
                        o.status.includes('مكتمل') || o.status.includes('تسليم') ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(o.date).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">لا توجد طلبات حديثة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
      {activeTab === "categories" && hasInventoryPermission && (
        <CategoriesTab />
      )}
      {activeTab === "orders" && hasOrdersPermission && (
        <OrdersTab formatPrice={formatPrice || ((p) => p.toLocaleString())} />
      )}
      {activeTab === 'sales_invoices' && hasOrdersPermission && (
        <SalesInvoicesTab />
      )}
      {activeTab === 'purchase_invoices' && hasOrdersPermission && (
        <PurchaseInvoicesTab />
      )}
      {activeTab === 'cash_accounts' && hasFinancePermission && (
        <CashAccountsTab />
      )}
      {activeTab === 'employees' && hasFinancePermission && (
        <EmployeesTab />
      )}
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
      {activeTab === "configuration" && isSuperUser && (
        <SettingsTab />
      )}
      {activeTab === 'accounting' && hasFinancePermission && (
        <AccountsTab />
      )}
      {activeTab === 'trial_balance' && hasFinancePermission && (
        <TrialBalanceView />
      )}
      {activeTab === 'financial_statements' && hasFinancePermission && (
        <FinancialStatementsView />
      )}
      {activeTab === 'fiscal_closing' && hasFinancePermission && (
        <FiscalClosingView />
      )}
      
      {activeTab === 'inventory' && hasInventoryPermission && (
        <InventoryTab formatPrice={formatPrice || ((p) => p.toLocaleString())} />
      )}
      {activeTab === 'fixed_assets' && hasFinancePermission && (
        <FixedAssetsTab />
      )}
      {activeTab === 'cost_centers' && hasFinancePermission && (
        <CostCentersTab />
      )}
      {activeTab === 'customers' && hasFinancePermission && (
        <CustomersTab />
      )}
      {activeTab === 'suppliers' && hasFinancePermission && (
        <SuppliersTab />
      )}
      {activeTab === 'sales_returns' && hasFinancePermission && (
        <SalesReturnsTab />
      )}
      {activeTab === 'purchase_returns' && hasFinancePermission && (
        <PurchaseReturnsTab />
      )}
      {activeTab === 'roles_permissions' && isSuperUser && (
        <RolesTab />
      )}
{activeTab === 'advanced_reports' && hasFinancePermission && (() => {
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
          .reduce((sum, o) => sum + getOrderTotalPrice(o), 0);

        const pendingAmount = filteredReconciliationOrders
          .filter(o => o.status === 'قيد المعالجة' || o.status === 'تم التجهيز للشحن')
          .reduce((sum, o) => sum + getOrderTotalPrice(o), 0);

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
                productSales[pid].revenue += (getProductPriceInSAR(it.product) * it.quantity);
              }
            });
          }
        });

        const sortedSales = Object.entries(productSales).map(([id, val]) => ({ id, ...val })).sort((a,b) => b.qty - a.qty);
        const topProducts = sortedSales.slice(0, 5);

        const lowStockProds = products.filter(p => p.stock !== undefined && p.stock <= 4);

        const successfulOrders = orders.filter(o => o.status !== 'ملغي ❌');
        const totalRev = successfulOrders.reduce((sum, o) => sum + getOrderTotalPrice(o), 0);
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
                          .reduce((sum, o) => sum + getOrderTotalPrice(o), 0);
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
                                  {displayPrice(getOrderTotalPrice(order))}
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
                  
                  {/* Category Sales Chart using Recharts */}
                  <div className="bg-[#060b18] p-5 rounded-2xl border border-blue-900/35 space-y-3.5 text-right flex flex-col justify-between md:col-span-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-300 pb-2 border-b border-blue-900/15 flex justify-between items-center">
                        <span>📊 أكثر الأقسام تحقيقاً للمبيعات خلال الشهر الحالي</span>
                        <span className="text-[9px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">توزيع المبيعات</span>
                      </h4>
                      <div className="w-full h-[300px] mt-4 relative" dir="ltr">
                        {orders.length === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                            لا توجد بيانات كافية لرسم الرسم البياني
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={
                                Object.entries(orders.filter(o => o.status !== 'ملغي ❌').reduce((acc, order) => {
                                  order.items.forEach(item => {
                                    if (item.product && item.product.category) {
                                      acc[item.product.category] = (acc[item.product.category] || 0) + (item.product.price * item.quantity);
                                    }
                                  });
                                  return acc;
                                }, {} as Record<string, number>)).map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue)
                              }
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" vertical={false} />
                              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#1e3a8a' }} tickLine={false} />
                              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}`} />
                              <Tooltip
                                cursor={{ fill: '#1e3a8a', opacity: 0.2 }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e40af', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                                itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                formatter={(value: number) => [`${displayPrice(value)}`, 'المبيعات']}
                              />
                              <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]}>
                                {Object.entries(orders.filter(o => o.status !== 'ملغي ❌').reduce((acc, order) => {
                                  order.items.forEach(item => {
                                    if (item.product && item.product.category) {
                                      acc[item.product.category] = (acc[item.product.category] || 0) + (item.product.price * item.quantity);
                                    }
                                  });
                                  return acc;
                                }, {} as Record<string, number>)).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#3b82f6'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

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
                        لديك عمليات معلقة بالانتظار بقيمة <span className="text-amber-500 font-bold font-mono">{displayPrice(orders.filter(o => o.status === 'قيد المعالجة').reduce((s,o)=>s+getOrderTotalPrice(o),0))}</span>. 
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
                            .reduce((sum, o) => sum + getOrderTotalPrice(o), 0);
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
                                  <td className="p-2 font-black text-slate-900 text-left font-mono text-[10px] border-r border-slate-200">{displayPrice(getOrderTotalPrice(order))}</td>
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
    </div>
  );
}
