import { Product, StoreCategory } from './types';

// Fallback seed categories
export const DEFAULT_CATEGORIES: StoreCategory[] = [
  { id: "cat-1", name: "🎮 شحن فورى ألعاب وإنترنت", nameEn: "games_charge", isDefault: true },
  { id: "cat-2", name: "🔌 جوالات وإلكترونيات", nameEn: "electronics", isDefault: true },
  { id: "cat-3", name: "🌾 تموين وتغذية", nameEn: "food_supplies", isDefault: true },
  { id: "cat-4", name: "🧂 خلطات بهارات وتوابل", nameEn: "spices", isDefault: true }
];

// Fallback seed products
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "شحن شدات PUBG Mobile - 325 شدة فوري",
    description: "تعبئة وشحن فوري ومباشر إلى معرف الأي دي (ID) الخاص بك دون انتظار بأسعار تنافسية ممتازة.",
    category: "cat-1",
    price: 35.0,
    price_sar: 35.0,
    price_yer: 14000,
    currency: "SAR",
    is_digital_service: true,
    digital_service_type: "direct",
    digital_category: "game",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    stock: 9999,
    code: "PUBG-325"
  }
];
