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
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  totalPrice: number;
  currency: 'SAR' | 'YER'; // Native transaction currency to avoid on-the-fly rounding issues
  date: string;
  status: 'قيد المعالجة' | 'تم التجهيز للشحن' | 'تم التسليم 🟢' | 'ملغي ❌' | 'معلق ⏳' | 'مرفوض 🔴';
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
