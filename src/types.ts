export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
  code?: string;
  currency?: 'SAR' | 'YER';
  colors?: string[];
  flavors?: string[];
  subOptions?: string[];
  images?: string[];
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
  date: string;
  status: 'قيد المعالجة' | 'تم التجهيز للشحن' | 'تم التسليم 🟢' | 'ملغي ❌';
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
}

export interface StoreCategory {
  id: string;
  name: string; // Arabic name
  englishName: string;
}

