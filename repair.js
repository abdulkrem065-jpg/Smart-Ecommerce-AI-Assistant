const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const fix = `
const getProjectTypeNiche = (): string | null => {
  const envVal = (((import.meta as any).env?.VITE_PROJECT_TYPE) || "").toLowerCase().trim();
  if (!envVal) return null;
  if (envVal.includes("game") || envVal.includes("charge")) return "hyper_games";
  if (envVal.includes("pharmacy") || envVal.includes("medicine")) return "smart_pharmacy";
  if (envVal.includes("supermarket") || envVal.includes("grocery")) return "hypermarket_supply";
  if (envVal.includes("school") || envVal.includes("education")) return "school";
  if (envVal.includes("tailor")) return "luxury_tailoring";
  if (envVal.includes("legal") || envVal.includes("law")) return "legal_consulting";
  if (envVal.includes("consulting") || envVal.includes("corporate")) return "consulting";
  if (envVal.includes("hyper") || envVal.includes("multiproject")) return "hypermarket_supply";
  return null;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<"store" | "ai" | "admin" | "tracking">("store");
  const [selectedPortal, setSelectedPortal] = useState<'none' | 'gaming' | 'grocery'>('none');
  const [currency, setCurrency] = useState<'SAR' | 'YER'>(() => (localStorage.getItem("store_currency") as 'SAR' | 'YER') || "YER");
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem("store_exchange_rate");
    const parsed = saved ? Number(saved) : 400;
    return (parsed > 0 && parsed <= 5000) ? parsed : 400;
  });
  const [lang, setLang] = useState<'ar' | 'en'>(() => (localStorage.getItem("store_lang") as 'ar' | 'en') || "ar");

  const translations = {
    ar: {
      store: "المتجر الإلكتروني",
      ai: "المساعد الذكي AI",
      tracking: "تتبع الطلبات",
      admin: "لوحة الإدارة",
      currencyTitle: "عملة المتجر:",
      langTitle: "اللغة:",
      gatesTitle: "بوابات مستودع ومتجر الذيباني VIP الشامل 🔱",
      gatesSubtitle: "مرحباً بكم في المتجر الهجين الأول في الشرق الأوسط. اختر وجهتك للتسوق المباشر والآمن والسريع من مستودعاتنا الفورية:",
      gamingGateTitle: "بوابة شحن الألعاب والبطاقات",
      gamingGateBadge: "شحن فوري ثواني ⚡",
      gamingGateDesc: "اشحن شدات PUBG Mobile و Free Fire فورا، بطاقات جوجل وآيتونز، ومحفظة الجيمنج ومفاتيح التفعيل مع دعم فني متين.",
      gamingGateButton: "دخول قسم شحن الألعاب",
      groceryGateTitle: "هايبرماركت آل ذيبان للتموين",
      groceryGateBadge: "تجهيز آمن 🚛",
      groceryGateDesc: "البهارات والتوابل والخلطات اليمنية والمواد التموينية عالية الجودة المجهزة والمعبأة بعناية لحساب احتياجاتك لتصل لباب منزلك.",
      groceryGateButton: "تصفح هايبرماركت المواد التموينية",
      backToGates: "العودة للبوابات (الأقسام)",
      gamingHeader: "🎮 بوابة شحن الألعاب والترفيه",
      groceryHeader: "🌾 هايبرماركت التموين والخلطات",
      matchingItems: "صنف متطابق",
      technicalSupport: "مساعدة الكادر الفني",
      activeBasket: "سلة الذيباني النشطة 🛒",
      reservedItems: "قطعة محجوزة",
      emptyBasketTitle: "سلتك خالية من البضائع حالياً",
      emptyBasketDesc: "اختر ما يناسبك من الأصناف المعروضة ليقوم مساعدنا الذكي بتجهيز وتأكيد الطلب لك",
      flavor: "النكهة:",
      color: "اللون:",
      options: "الخيارات:",
      playerId: "حساب اللاعب ID:",
      itemsTotal: "مجموع قيمة الأصناف",
      deliveryFee: "رسوم الشحن والتوصيل",      
      taxAndService: "الضرائب المضافة والخدمة",
      instantShipping: "تجهيز وشحن فوري ثواني ⚡",
      freeForVip: "مجاني للمستويات VIP",
      includingTax: "شامل الضريبة",
      totalDue: "المبلغ الإجمالي المستحق",
      proceedCheckout: "متابعة تجهيز وحجز الطلب",
      clearCart: "إخلاء وتصفية السلة",
    },
    en: {
`;

// Replace lines 70 to 73 with the fix
app.splice(70, 4, fix);

fs.writeFileSync('src/App.tsx', app.join('\n'));
