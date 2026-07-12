export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number; // legacy fallback field
  price_sar?: number; // separated SAR price
  price_yer?: number; // separated YER price
  image: string;
  stock?: number;
  code?: string;
  currency?: 'SAR' | 'YER';
  colors?: string[];
  flavors?: string[];
  subOptions?: string[];
  images?: string[];
  isApiProduct?: boolean;
  apiProductId?: string;
  apiRequiredField?: string;
  apiProvider?: 'likecard' | 'cardstore' | 'smm' | 'custom' | 'etisalatonline';
  cost_usd?: number;
  profit_margin_usd?: number;
  is_digital_service?: boolean;
  digital_service_type?: 'direct' | 'card'; // 'direct' = ID/Phone charge, 'card' = digital cards
  digital_category?: 'game' | 'balance' | 'cards'; // 'game' = ألعاب, 'balance' = تسديد رصيد, 'cards' = بطاقات
}

export interface StoreSettings {
  Key: string;
  Value: string;
  Type: 'contact' | 'payment' | 'whatsapp' | 'alert' | string;
  Link_or_Status?: string;
}

export interface CartSubOption {
  name: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedFlavor?: string;
  selectedSubOptions?: CartSubOption[];
  playerId?: string;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  totalPrice: number;
  currency: 'SAR' | 'YER'; // Native transaction currency to avoid on-the-fly rounding issues
  date: string;
  status: 'قيد المعالجة' | 'تم التجهيز للشحن' | 'تم التسليم 🟢' | 'ملغي ❌' | 'معلق ⏳' | 'مرفوض 🔴' | 'مرتجع';
  remittanceNumber?: string;
  remittanceImage?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  actionText: string;
  actionType: "ai" | "store";
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isBargain?: boolean;
  bargainStatus?: 'idle' | 'accepted' | 'declined';
  bargainedPrice?: number;
}

export interface StoreCategory {
  id: string;
  name: string; // Arabic name
  englishName: string;
  isDefault?: boolean;
}

export interface Staff {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'tailor' | 'lawyer' | 'cashier';
  permissions: {
    canViewFinance: boolean;
    canEditInventory: boolean;
    canManageOrders: boolean;
    canUseAI: boolean;
  };
}

export interface UserSession {
  role: 'developer' | 'owner' | 'staff';
  email?: string;
  username?: string;
  fullName: string;
  staffRole?: 'admin' | 'teacher' | 'tailor' | 'lawyer' | 'cashier';
  permissions?: {
    canViewFinance: boolean;
    canEditInventory: boolean;
    canManageOrders: boolean;
    canUseAI: boolean;
  };
}

export type AccountCategory = 'suppliers' | 'customers' | 'cash_boxes' | 'expenses' | 'shareholders' | 'revenues' | 'cogs';

export interface AccountingTransaction {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  costCenterId?: string;
}

export interface AccountingAccount {
  id: string;
  name: string;
  category: AccountCategory;
  phone?: string;
  email?: string;
  address?: string;
  transactions: AccountingTransaction[];
  totalDebit: number;
  totalCredit: number;
  currentBalance: number;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
  referenceId?: string;
  is_broken?: boolean;
}


export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;           // رصيد العميل (موجب = مدين، سالب = دائن)
  creditLimit?: number;      // الحد الائتماني
  totalPurchases: number;    // إجمالي المشتريات
  createdAt: string;
}

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
}

export interface SalesReturn {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  items: ReturnItem[];
  totalRefund: number;
  reason: string;
  date: string;
  status: 'معتمد' | 'معلق';
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'صرف' | 'إضافة' | 'مرتجع';
  quantity: number;
  reference: string;  // رقم الطلب أو الفاتورة
  date: string;
}

// المورد
export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number;           // رصيد المورد (موجب = دائن، سالب = مدين)
  totalPurchases: number;    // إجمالي المشتريات من هذا المورد
  createdAt: string;
}

// صنف في فاتورة الشراء
export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

// فاتورة الشراء
export interface PurchaseInvoice {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  date: string;
  status: 'مفتوحة' | 'مدفوعة' | 'ملغية';
  paymentMethod?: string;
}

// مرتجع المشتريات
export interface PurchaseReturn {
  id: string;
  invoiceId: string;
  supplierId: string;
  supplierName: string;
  items: ReturnItem[];  // نستخدم ReturnItem الموجود مسبقاً
  totalRefund: number;
  reason: string;
  date: string;
  status: 'معتمد' | 'معلق';
}

// حساب الخزينة (صندوق أو بنك)
export interface CashAccount {
  id: string;
  name: string;           // مثال: "الصندوق الرئيسي"، "بنك الراجحي"
  type: 'صندوق' | 'بنك';
  currency: 'SAR' | 'YER';
  balance: number;        // الرصيد الحالي
  accountNumber?: string; // رقم الحساب البنكي
  bankName?: string;      // اسم البنك
  createdAt: string;
}

// سند قبض
export interface ReceiptVoucher {
  id: string;
  date: string;
  cashAccountId: string;
  cashAccountName: string;
  amount: number;
  fromParty: string;      // الجهة الدافعة (عميل، مورد، جهة أخرى)
  fromPartyId?: string;   // معرف العميل أو المورد
  description: string;
  referenceId?: string;   // رقم الفاتورة أو المستند المرجعي
}

// سند صرف
export interface PaymentVoucher {
  id: string;
  date: string;
  cashAccountId: string;
  cashAccountName: string;
  amount: number;
  toParty: string;        // الجهة المستفيدة (مورد، موظف، جهة أخرى)
  toPartyId?: string;     // معرف المورد أو الموظف
  description: string;
  referenceId?: string;
}

// عهدة
export interface Custody {
  id: string;
  date: string;
  employeeName: string;
  employeeId?: string;
  amount: number;
  purpose: string;
  status: 'مفتوحة' | 'مسددة';
  settledDate?: string;
  settlementItems?: CustodySettlementItem[];
}

// بند تسوية العهدة
export interface CustodySettlementItem {
  description: string;
  amount: number;
  accountName: string;  // حساب المصروف
}

// تحويل بين خزائن
export interface CashTransfer {
  id: string;
  date: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
  description: string;
}

// فاتورة مبيعات (للواجهة)
export interface SalesInvoice {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'مدفوعة' | 'آجلة';
}

// فاتورة شراء (للواجهة)
export interface PurchaseInvoiceView {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'مفتوحة' | 'مدفوعة' | 'ملغية';
}

// الأصل الثابت
export interface FixedAsset {
  id: string;
  name: string;               // اسم الأصل
  category: string;           // تصنيف (أثاث، أجهزة، مركبات، عقارات)
  purchaseDate: string;       // تاريخ الشراء
  purchaseValue: number;      // قيمة الشراء
  salvageValue: number;       // قيمة الخردة
  usefulLife: number;         // العمر الإنتاجي (بالشهور)
  depreciationMethod: 'قسط ثابت' | 'متناقص';  // طريقة الإهلاك
  depreciationRate: number;   // معدل الإهلاك (يُحتسب تلقائياً)
  accumulatedDepreciation: number;  // مجمع الإهلاك
  bookValue: number;          // القيمة الدفترية الحالية
  monthlyDepreciation: number; // قسط الإهلاك الشهري
  lastDepreciationDate?: string;  // تاريخ آخر إهلاك
  status: 'نشط' | 'مباع' | 'مستهلك';
  notes?: string;
}

// قسط الإهلاك
export interface DepreciationEntry {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  amount: number;
  accumulatedBefore: number;
  accumulatedAfter: number;
  bookValueAfter: number;
  journalEntryId?: string;
}

// مركز التكلفة
export interface CostCenter {
  id: string;
  name: string;               // اسم المركز (مبيعات، إدارة، إنتاج...)
  type: 'قسم' | 'فرع' | 'مشروع';
  parentId?: string;          // المركز الأب (للهيكل الشجري)
  budget: number;             // الموازنة التقديرية
  actualSpending: number;     // الإنفاق الفعلي
  createdAt: string;
}

// صلاحية مستخدم متقدمة
export interface UserPermission {
  module: string;             // اسم الوحدة
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// دور مستخدم مخصص
export interface UserRole {
  id: string;
  name: string;               // اسم الدور (مدير مالي، محاسب، أمين مخزن...)
  permissions: UserPermission[];
  createdAt: string;
}

// مستخدم النظام
export interface SystemUser {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email?: string;
  phone?: string;
  roleId: string;             // معرف الدور
  roleName: string;           // اسم الدور
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}
