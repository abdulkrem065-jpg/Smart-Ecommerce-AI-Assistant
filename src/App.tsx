import React, { useState, useEffect } from "react";
import { Product, StoreCategory, CartItem, OrderDetails, Order, CarouselSlide } from "./types";
import ProductCatalog from "./components/ProductCatalog";
import AIChatSection from "./components/AIChatSection";
import AdminDashboard from "./components/AdminDashboard";
import AdminLoginGate from "./components/AdminLoginGate";
import { PromoCarousel } from "./components/PromoCarousel";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { 
  ShoppingBag, 
  Bot, 
  Settings, 
  CreditCard, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  Store, 
  Sparkles, 
  MapPin, 
  Phone, 
  User, 
  X, 
  CheckCircle2, 
  Coins, 
  Smartphone, 
  MessageSquare,
  AlertCircle,
  Package,
  Clock,
  Search
} from "lucide-react";

// Fallback seed categories
const DEFAULT_CATEGORIES: StoreCategory[] = [
  { id: "cat-1", name: "🎮 شحن فورى ألعاب وإنترنت", englishName: "games_charge" },
  { id: "cat-2", name: "🔌 جوالات وإلكترونيات", englishName: "electronics" },
  { id: "cat-3", name: "🌾 تموين وتغذية", englishName: "food_supplies" },
  { id: "cat-4", name: "🧂 خلطات بهارات وتوابل", englishName: "spices" }
];

// Fallback seed products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "شحن شدات PUBG Mobile - 325 شدة فوري",
    description: "تعبئة وشحن فوري ومباشر إلى معرف الأي دي (ID) الخاص بك دون انتظار بأسعار تنافسية ممتازة.",
    category: "🎮 شحن فورى ألعاب وإنترنت",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
    stock: 99,
    code: "PUBG325"
  },
  {
    id: "prod-2",
    name: "سماعات بلوتوث مخصصة للألعاب Ultra Bass",
    description: "عزل كامل للضوضاء، استجابة صوتية متفوقة خالية من التأخير وميكروفون نقي للدردشة.",
    category: "🔌 جوالات وإلكترونيات",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stock: 12,
    code: "G_HEADSET"
  },
  {
    id: "prod-3",
    name: "خلطة بهارات الذيباني الفاخرة المشكلة - كرتون",
    description: "توليفة سرية غنية بالهيل والزعفران والمكونات الطبيعية الممتازة المناسبة لجميع أنواع الكبسات والطبخ اليمني والشرقي الفاخر.",
    category: "🧂 خلطات بهارات وتوابل",
    price: 85.0,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80",
    stock: 50,
    code: "SP_DHIBANI"
  }
];

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<"store" | "ai" | "admin" | "tracking">("store");

  // Currency & Exchange Rate State
  const [currency, setCurrency] = useState<'SAR' | 'YER'>(() => {
    return (localStorage.getItem("store_currency") as 'SAR' | 'YER') || "SAR";
  });
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem("store_exchange_rate");
    return saved ? Number(saved) : 400; // default 1 SAR = 400 YER
  });

  const [deliveryFeeEnabled, setDeliveryFeeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_delivery_fee_enabled");
    return saved !== "false"; // default true
  });
  const [deliveryFeeValue, setDeliveryFeeValue] = useState<number>(() => {
    const saved = localStorage.getItem("store_delivery_fee_value");
    return saved ? Number(saved) : 20; // default 20 SAR
  });

  const [taxEnabled, setTaxEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_tax_enabled");
    return saved !== "false"; // default true
  });
  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem("store_tax_rate");
    return saved ? Number(saved) : 15; // default 15%
  });
  const [taxInTotal, setTaxInTotal] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_tax_in_total");
    return saved !== "false"; // default true
  });
  const [taxVisible, setTaxVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_tax_visible");
    return saved !== "false"; // default true
  });
  const [deliveryInTotal, setDeliveryInTotal] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_delivery_in_total");
    return saved !== "false"; // default true
  });
  const [deliveryVisible, setDeliveryVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("store_delivery_visible");
    return saved !== "false"; // default true
  });

  const formatPrice = (priceInSAR: number) => {
    if (currency === 'YER') {
      const priceInYER = Math.round(priceInSAR * exchangeRate);
      return `${priceInYER.toLocaleString('ar-YE')} ر.ي`;
    }
    return `${priceInSAR.toFixed(1)} ر.س`;
  };

  // Admin security credentials & states for strict segregation 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("is_admin_vip_logged") === "true";
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("store_admin_password") || "1122";
  });
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        addToast("🔓 تم تنشيط بوابة الإدارة الفنية السريّة! جاري فتح كابينة الضبط...", "info");
        setCurrentTab("admin");
        return 0;
      }
      return next;
    });
  };

  // Dynamic products & categories synced with Firebase Realtime Database with Local Fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("store_products");
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState<StoreCategory[]>(() => {
    const saved = localStorage.getItem("store_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Real-time beautiful feedback toasts
  interface FancyToast {
    id: string;
    message: string;
    type: "success" | "info" | "warning";
    productImage?: string;
  }
  const [toasts, setToasts] = useState<FancyToast[]>([]);

  const addToast = (message: string, type: "success" | "info" | "warning" = "success", productImage?: string) => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, message, type, productImage }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Settings from Realtime Database
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem("store_logo_url") || "");
  const [whatsappNumber, setWhatsappNumber] = useState(() => localStorage.getItem("store_whatsapp_number") || "967770493341"); // Famous VIP support number
  const [tickerMessage, setTickerMessage] = useState(() => localStorage.getItem("store_ticker_message") || "🔥 مرحباً بكم في متجر ومستودع الذيباني VIP! نوفر لكم خدمات الشحن الفوري للألعاب والتموين الفاخر بأفضل الأسعار. اسألوا مساعدنا الذكي AI عن أي شيء! ✨");
  const [activeSettings, setActiveSettings] = useState<any[]>([]);

  // Comprehensive customer orders list state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("store_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // Slides array loaded dynamically
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(() => {
    const saved = localStorage.getItem("store_carousel_slides");
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic payment methods list editable by admin
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    const saved = localStorage.getItem("store_payment_methods");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return [
      "الدفع كاش عند التوصيل 💵",
      "بنك الكريمي (حساب أو كريمي باي) 🏦",
      "حوالة سريعة عبر النجم للصرافة 💸",
      "حوالة عبر الامتياز وبن سلمان 🚀",
      "محفظة جوالي / إم فلوس 📱"
    ];
  });

  // Find active payment methods from Realtime Database, with local pre-defined regional ones as fallback
  const getPaymentMethods = (): string[] => {
    return paymentMethods;
  };

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("store_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Sales Statistics State for simulated metrics
  const [salesStats, setSalesStats] = useState(() => {
    const saved = localStorage.getItem("store_sales");
    return saved ? JSON.parse(saved) : { totalRevenue: 1845.0, totalOrders: 11 };
  });

  // User input name saved in memory
  const [customerSavedName, setCustomerSavedName] = useState(() => {
    return localStorage.getItem("customer_name") || "";
  });

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "success">("details");
  const [checkoutSubStep, setCheckoutSubStep] = useState<1 | 2 | 3>(1); // Progress Wizard 1: Personal, 2: Address, 3: Payment method

  // Checkout inputs
  const [customerName, setCustomerName] = useState(customerSavedName);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [createdOrderLink, setCreatedOrderLink] = useState("");
  const [isAnyInputFocused, setIsAnyInputFocused] = useState(false);

  // Firebase Realtime DB Listeners
  useEffect(() => {
    try {
      const productsRef = ref(db, "products");
      const unsubscribe = onValue(productsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const loadedList: Product[] = [];
          const seenIds = new Set<string>();
          if (Array.isArray(val)) {
            val.forEach((p, idx) => {
              if (p) {
                let id = String(p.id !== undefined && p.id !== null && p.id !== "" ? p.id : idx);
                if (seenIds.has(id)) {
                  id = `${id}_dup_${idx}`;
                }
                seenIds.add(id);
                // Strip numbers from name if match
                const cleanName = p.name ? String(p.name).replace(/^\d+\s*/, "") : "منتج مميز";
                loadedList.push({
                  id,
                  name: cleanName,
                  description: p.description || p.name || "",
                  category: p.category || "عام",
                  price: Number(p.price) || 0,
                  image: p.image && String(p.image).startsWith("http") ? p.image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
                  stock: p.stock !== undefined ? Number(p.stock) : 99,
                  code: p.code || id,
                  currency: p.currency === 'YER' || p.currency === 'SAR' ? p.currency : 'SAR',
                  colors: p.colors || [],
                  flavors: p.flavors || []
                });
              }
            });
          } else {
            Object.keys(val).forEach((key, idx) => {
              const p = val[key];
              if (p) {
                let id = String(p.id !== undefined && p.id !== null && p.id !== "" ? p.id : key);
                if (seenIds.has(id)) {
                  id = `${id}_dup_${idx}`;
                }
                seenIds.add(id);
                const cleanName = p.name ? String(p.name).replace(/^\d+\s*/, "") : "منتج مميز";
                loadedList.push({
                  id,
                  name: cleanName,
                  description: p.description || p.name || "",
                  category: p.category || "عام",
                  price: Number(p.price) || 0,
                  image: p.image && String(p.image).startsWith("http") ? p.image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
                  stock: p.stock !== undefined ? Number(p.stock) : 99,
                  code: p.code || id,
                  currency: p.currency === 'YER' || p.currency === 'SAR' ? p.currency : 'SAR',
                  colors: p.colors || [],
                  flavors: p.flavors || []
                });
              }
            });
          }

          if (loadedList.length > 0) {
            setProducts(loadedList);
            // Re-compile beautiful categories
            const extracted = Array.from(new Set(loadedList.map(item => item.category)))
              .filter(Boolean)
              .map((catName, idx) => ({
                id: `dynamic-cat-${idx}`,
                name: catName,
                englishName: catName.toLowerCase().replace(/\s+/g, "_")
              }));
            if (extracted.length > 0) {
              setCategories(extracted);
            }
          }
        }
      }, (err) => {
        console.error("Firebase products stream error:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen to live database orders for real-time customer tracking
  useEffect(() => {
    try {
      const ordersRef = ref(db, "orders");
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const loadedList: Order[] = [];
          const seenIds = new Set<string>();
          Object.keys(val).forEach((key) => {
            const ord = val[key];
            if (ord) {
              let id = String(ord.id !== undefined && ord.id !== null && ord.id !== "" ? ord.id : key);
              if (seenIds.has(id)) {
                id = `${id}_dup_${key}`;
              }
              seenIds.add(id);
              loadedList.push({
                id,
                customerName: ord.customerName || "عميل مجهول",
                phone: ord.phone || "",
                address: ord.address || "",
                paymentMethod: ord.paymentMethod || "كاش",
                items: ord.items || [],
                totalPrice: Number(ord.totalPrice) || 0,
                date: ord.date || "",
                status: ord.status || "قيد المعالجة"
              });
            }
          });
          // Newest orders first
          loadedList.sort((a, b) => b.id.localeCompare(a.id));
          setOrders(loadedList);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase orders subscriber link fail:", e);
    }
  }, []);

  // Listen to dynamic slider promotional carousel slides
  useEffect(() => {
    try {
      const slidesRef = ref(db, "settings/carousel");
      const unsubscribe = onValue(slidesRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const loadedSlides: CarouselSlide[] = [];
          const seenIds = new Set<string>();
          const addUniqueSlide = (s: any, idx: number) => {
            if (!s) return;
            let id = String(s.id !== undefined && s.id !== null && s.id !== "" ? s.id : `slide-${idx}`);
            if (seenIds.has(id)) {
              id = `${id}_dup_${idx}`;
            }
            seenIds.add(id);
            loadedSlides.push({ ...s, id });
          };
          if (Array.isArray(val)) {
            val.forEach((s, idx) => addUniqueSlide(s, idx));
          } else {
            Object.keys(val).forEach((k, idx) => addUniqueSlide(val[k], idx));
          }
          if (loadedSlides.length > 0) {
            setCarouselSlides(loadedSlides);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase slider subscriber error:", e);
    }
  }, []);

  // Listen to custom payment method configurations defined by the administrator
  useEffect(() => {
    try {
      const paymentsRef = ref(db, "settings/payments");
      const unsubscribe = onValue(paymentsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          let loaded: string[] = [];
          if (Array.isArray(val)) {
            loaded = val.filter(Boolean);
          } else {
            Object.keys(val).forEach(k => val[k] && loaded.push(val[k]));
          }
          if (loaded.length > 0) {
            setPaymentMethods(loaded);
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen and notify if the active tracked order changes status live!
  const [lastTrackedStatus, setLastTrackedStatus] = useState<string>(() => {
    return localStorage.getItem("last_tracked_status") || "";
  });
  const [trackedOrderId, setTrackedOrderId] = useState<string>(() => {
    return localStorage.getItem("last_placed_order_id") || "";
  });

  useEffect(() => {
    if (!trackedOrderId) return;
    const matchedOrder = orders.find(o => o.id === trackedOrderId);
    if (matchedOrder) {
      if (lastTrackedStatus && matchedOrder.status !== lastTrackedStatus) {
        // Status updated! Notify the user!
        addToast(`🔔 تحديث عاجل: لقد تم تغيير حالة طلبك [${trackedOrderId}] إلى "${matchedOrder.status}"!`, "success");
        localStorage.setItem("last_tracked_status", matchedOrder.status);
        
        // Play polite sound or speak voice
        try {
          if ('speechSynthesis' in window) {
            // Cancel current speech to prevent overlapping
            window.speechSynthesis.cancel();
            const textToSpeak = `تنبيه من متجر الذيباني: تم تحديث حالة طلبك إلى ${matchedOrder.status}`;
            const speech = new SpeechSynthesisUtterance(textToSpeak);
            speech.lang = 'ar';
            speech.rate = 0.9;
            window.speechSynthesis.speak(speech);
          }
        } catch (e) {
          console.error("Speech synthesis failed:", e);
        }
      }
      setLastTrackedStatus(matchedOrder.status);
      localStorage.setItem("last_tracked_status", matchedOrder.status);
    }
  }, [orders, trackedOrderId, lastTrackedStatus]);

  useEffect(() => {
    try {
      const settingsRef = ref(db, "settings");
      const unsubscribe = onValue(settingsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const loadedSettings: any[] = [];
          if (Array.isArray(val)) {
            val.forEach(s => s && loadedSettings.push(s));
          } else {
            Object.keys(val).forEach(k => val[k] && loadedSettings.push(val[k]));
          }
          setActiveSettings(loadedSettings);

          // Extract WhatsApp support
          const wa = loadedSettings.find(s => s.Key === "whatsapp" || s.Type === "whatsapp");
          if (wa && wa.Value) {
            const cleanWa = wa.Value.replace(/[^\d]/g, "");
            if (cleanWa) {
              setWhatsappNumber(cleanWa);
            }
          }

          // Extract logo url or base64
          const logoS = loadedSettings.find(s => s.Key === "logo" || s.Type === "logo" || s.Key === "logoUrl");
          if (logoS && logoS.Value) {
            setLogoUrl(logoS.Value);
          }

          // Extract alert promotions ticker
          const alertS = loadedSettings.find(s => s.Type === "alert" && s.Link_or_Status === "نشط");
          if (alertS && alertS.Value) {
            setTickerMessage(alertS.Value);
          }

          // Extract dynamic administration password/PIN
          const passS = loadedSettings.find(s => s.Key === "adminPassword" || s.Type === "adminPassword" || s.Key === "password");
          if (passS && passS.Value) {
            setAdminPassword(String(passS.Value));
            localStorage.setItem("store_admin_password", String(passS.Value));
          }

          // Extract default currency selection
          const currencyS = loadedSettings.find(s => s.Key === "currency" || s.Type === "currency");
          if (currencyS && currencyS.Value) {
            const currencyVal = String(currencyS.Value).toUpperCase();
            if (currencyVal === "SAR" || currencyVal === "YER") {
              setCurrency(currencyVal as 'SAR' | 'YER');
              localStorage.setItem("store_currency", currencyVal);
            }
          }

          // Extract dynamic currency exchange rate
          const rateS = loadedSettings.find(s => s.Key === "exchangeRate" || s.Type === "exchangeRate");
          if (rateS && rateS.Value) {
            const parsedRate = Number(rateS.Value);
            if (!isNaN(parsedRate) && parsedRate > 0) {
              setExchangeRate(parsedRate);
              localStorage.setItem("store_exchange_rate", String(parsedRate));
            }
          }

          // Extract delivery fee configurations
          const isDeliveryEnabledS = loadedSettings.find(s => s.Key === "deliveryFeeEnabled");
          if (isDeliveryEnabledS) {
            setDeliveryFeeEnabled(isDeliveryEnabledS.Value === "true" || isDeliveryEnabledS.Value === true);
            localStorage.setItem("store_delivery_fee_enabled", String(isDeliveryEnabledS.Value));
          }

          const deliveryFeeValS = loadedSettings.find(s => s.Key === "deliveryFeeValue");
          if (deliveryFeeValS) {
            const parsedVal = Number(deliveryFeeValS.Value);
            if (!isNaN(parsedVal)) {
              setDeliveryFeeValue(parsedVal);
              localStorage.setItem("store_delivery_fee_value", String(parsedVal));
            }
          }

          const taxEnabledS = loadedSettings.find(s => s.Key === "taxEnabled");
          if (taxEnabledS) {
            setTaxEnabled(taxEnabledS.Value === "true" || taxEnabledS.Value === true);
            localStorage.setItem("store_tax_enabled", String(taxEnabledS.Value));
          }

          const taxRateS = loadedSettings.find(s => s.Key === "taxRate");
          if (taxRateS) {
            const parsedVal = Number(taxRateS.Value);
            if (!isNaN(parsedVal)) {
              setTaxRate(parsedVal);
              localStorage.setItem("store_tax_rate", String(parsedVal));
            }
          }

          const taxInTotalS = loadedSettings.find(s => s.Key === "taxInTotal");
          if (taxInTotalS) {
            setTaxInTotal(taxInTotalS.Value === "true" || taxInTotalS.Value === true);
            localStorage.setItem("store_tax_in_total", String(taxInTotalS.Value));
          }

          const taxVisibleS = loadedSettings.find(s => s.Key === "taxVisible");
          if (taxVisibleS) {
            setTaxVisible(taxVisibleS.Value === "true" || taxVisibleS.Value === true);
            localStorage.setItem("store_tax_visible", String(taxVisibleS.Value));
          }

          const deliveryInTotalS = loadedSettings.find(s => s.Key === "deliveryInTotal");
          if (deliveryInTotalS) {
            setDeliveryInTotal(deliveryInTotalS.Value === "true" || deliveryInTotalS.Value === true);
            localStorage.setItem("store_delivery_in_total", String(deliveryInTotalS.Value));
          }

          const deliveryVisibleS = loadedSettings.find(s => s.Key === "deliveryVisible");
          if (deliveryVisibleS) {
            setDeliveryVisible(deliveryVisibleS.Value === "true" || deliveryVisibleS.Value === true);
            localStorage.setItem("store_delivery_visible", String(deliveryVisibleS.Value));
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save changes locally for instant caching
  useEffect(() => {
    localStorage.setItem("store_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("store_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("store_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("store_sales", JSON.stringify(salesStats));
  }, [salesStats]);

  useEffect(() => {
    localStorage.setItem("store_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("store_carousel_slides", JSON.stringify(carouselSlides));
  }, [carouselSlides]);

  useEffect(() => {
    localStorage.setItem("store_payment_methods", JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem("store_whatsapp_number", whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    localStorage.setItem("store_exchange_rate", String(exchangeRate));
  }, [exchangeRate]);

  useEffect(() => {
    localStorage.setItem("store_delivery_fee_enabled", String(deliveryFeeEnabled));
  }, [deliveryFeeEnabled]);

  useEffect(() => {
    localStorage.setItem("store_delivery_fee_value", String(deliveryFeeValue));
  }, [deliveryFeeValue]);

  useEffect(() => {
    localStorage.setItem("store_tax_enabled", String(taxEnabled));
  }, [taxEnabled]);

  useEffect(() => {
    localStorage.setItem("store_tax_rate", String(taxRate));
  }, [taxRate]);

  useEffect(() => {
    localStorage.setItem("store_tax_in_total", String(taxInTotal));
  }, [taxInTotal]);

  useEffect(() => {
    localStorage.setItem("store_tax_visible", String(taxVisible));
  }, [taxVisible]);

  useEffect(() => {
    localStorage.setItem("store_delivery_in_total", String(deliveryInTotal));
  }, [deliveryInTotal]);

  useEffect(() => {
    localStorage.setItem("store_delivery_visible", String(deliveryVisible));
  }, [deliveryVisible]);

  useEffect(() => {
    localStorage.setItem("store_ticker_message", tickerMessage);
  }, [tickerMessage]);

  // Auto-scroll input boxes and textareas into center view on mobile virtual keyboard trigger
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        setIsAnyInputFocused(true);
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 280);
      }
    };
    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!active || (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
          setIsAnyInputFocused(false);
        }
      }, 150);
    };
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Keep customerName in sync with saved state
  useEffect(() => {
    if (customerName) {
      localStorage.setItem("customer_name", customerName);
      setCustomerSavedName(customerName);
    }
  }, [customerName]);

  // Cart operations
  const handleAddToCart = (product: Product, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: { name: string; quantity: number }[]) => {
    let limitReached = false;
    let addedNew = false;

    const matchSubOptions = (a?: { name: string; quantity: number }[], b?: { name: string; quantity: number }[]) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      return a.every(x => b.some(y => y.name === x.name && y.quantity === x.quantity));
    };

    setCart((prev) => {
      const exist = prev.find((item) => 
        item.product.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedFlavor === selectedFlavor &&
        matchSubOptions(item.selectedSubOptions, selectedSubOptions)
      );
      if (exist) {
        const targetStock = product.stock !== undefined ? product.stock : 99;
        if (exist.quantity >= targetStock) {
          limitReached = true;
          return prev;
        }
        return prev.map((item) =>
          (item.product.id === product.id && 
           item.selectedColor === selectedColor && 
           item.selectedFlavor === selectedFlavor &&
           matchSubOptions(item.selectedSubOptions, selectedSubOptions)) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      addedNew = true;
      return [...prev, { product, quantity: 1, selectedColor, selectedFlavor, selectedSubOptions }];
    });

    if (limitReached) {
      addToast(`انتهى المخزون المتاح لهذا الصنف بمتجرنا ⚠️`, "warning", product.image);
    } else if (addedNew) {
      const details = [];
      if (selectedColor) details.push(selectedColor);
      if (selectedFlavor) details.push(selectedFlavor);
      if (selectedSubOptions && selectedSubOptions.length > 0) {
        details.push(...selectedSubOptions.map(s => `${s.name} (x${s.quantity})`));
      }
      const optionLabel = details.filter(Boolean).join(' / ');
      const optionStr = optionLabel ? ` (${optionLabel})` : '';
      addToast(`تم إضافة "${product.name}${optionStr}" بنجاح إلى السلة 🛒`, "success", product.image);
    } else {
      addToast(`تم زيادة كمية الصنف في سلة المشتريات! 📈`, "success", product.image);
    }
  };

  const handleUpdateCartQty = (productId: string, increment: boolean, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: { name: string; quantity: number }[]) => {
    let limitReached = false;
    let foundProduct: Product | undefined;

    const matchSubOptions = (a?: { name: string; quantity: number }[], b?: { name: string; quantity: number }[]) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      return a.every(x => b.some(y => y.name === x.name && y.quantity === x.quantity));
    };

    setCart((prev) => {
      return prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedFlavor === selectedFlavor &&
            matchSubOptions(item.selectedSubOptions, selectedSubOptions)
          ) {
            foundProduct = item.product;
            const nextQty = increment ? item.quantity + 1 : item.quantity - 1;
            const limit = item.product.stock !== undefined ? item.product.stock : 99;
            if (increment && nextQty > limit) {
              limitReached = true;
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });

    if (limitReached) {
      addToast(`تجاوزت الحد الأقصى للمخزون المتوفر ⚠️`, "warning", foundProduct?.image);
    } else {
      addToast(increment ? `تم زيادة كمية الصنف ➕` : `تم تخفيض كمية الصنف ➖`, "info", foundProduct?.image);
    }
  };

  const handleRemoveFromCart = (productId: string, selectedColor?: string, selectedFlavor?: string, selectedSubOptions?: { name: string; quantity: number }[]) => {
    const matchSubOptions = (a?: { name: string; quantity: number }[], b?: { name: string; quantity: number }[]) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      return a.every(x => b.some(y => y.name === x.name && y.quantity === x.quantity));
    };

    const itemToRemove = cart.find(
      (item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedFlavor === selectedFlavor &&
        matchSubOptions(item.selectedSubOptions, selectedSubOptions)
    );
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedFlavor === selectedFlavor &&
            matchSubOptions(item.selectedSubOptions, selectedSubOptions)
          )
      )
    );
    if (itemToRemove) {
      addToast(`تم شطب "${itemToRemove.product.name}" من سلتك 🗑️`, "warning", itemToRemove.product.image);
    }
  };

  const getProductPriceInSAR = (p: Product) => {
    if (p.currency === 'YER') {
      return p.price / (exchangeRate || 400);
    }
    return p.price;
  };

  const handleBulkConvertCurrency = (targetCurrency: 'SAR' | 'YER') => {
    const rate = exchangeRate || 400;
    const updatedProducts = products.map((prod) => {
      const currentCurr = prod.currency || 'SAR';
      if (currentCurr === targetCurrency) {
        return prod;
      }
      
      let convertedPrice = prod.price;
      if (targetCurrency === 'YER') {
        convertedPrice = Math.round(prod.price * rate);
      } else {
        convertedPrice = Number((prod.price / rate).toFixed(1));
      }

      return {
        ...prod,
        price: convertedPrice,
        currency: targetCurrency
      };
    });

    setProducts(updatedProducts);
    
    try {
      updatedProducts.forEach((prod) => {
        set(ref(db, `products/${prod.id}`), prod);
      });
      addToast(`🔄 تم تحويل جميع المنتجات السابقة ماليّاً لتعمل بـ ${targetCurrency === 'SAR' ? 'الريال السعودي' : 'الريال اليمني'} بنجاح!`, "success");
    } catch (err) {
      console.error("Failed to batch update products on Firebase:", err);
      addToast("عذراً، فشل تحويل عملة السلة الكلية.", "warning");
    }
  };

  // Pricing calculations
  const totalPriceOfCart = cart.reduce((sum, item) => sum + getProductPriceInSAR(item.product) * item.quantity, 0);
  const deliveryFee = deliveryFeeEnabled ? deliveryFeeValue : 0;
  const taxAmount = taxEnabled ? (totalPriceOfCart * (taxRate / 100)) : 0;
  const taxToSum = (taxEnabled && taxInTotal) ? taxAmount : 0;
  const deliveryToSum = (deliveryFeeEnabled && deliveryInTotal) ? deliveryFee : 0;
  const finalBillAmount = totalPriceOfCart + taxToSum + deliveryToSum;

  // Formatting order to WhatsApp API URL Redirection
  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("الرجاء استكمال الاسم الصريح والهاتف والموقع للتوصيل الدقيق.");
      return;
    }

    // Prepare WhatsApp message
    const itemsText = cart.map((item, idx) => {
      const optionDetails = [];
      if (item.selectedColor) optionDetails.push(`اللون: ${item.selectedColor}`);
      if (item.selectedFlavor) optionDetails.push(`النكهة: ${item.selectedFlavor}`);
      if (item.selectedSubOptions && item.selectedSubOptions.length > 0) {
        const subStrs = item.selectedSubOptions.map(s => `${s.name} (x${s.quantity})`);
        optionDetails.push(`خيارات فرعية: ${subStrs.join(' - ')}`);
      }
      const optionsLabel = optionDetails.length > 0 ? ` [${optionDetails.join(' / ')}]` : '';
      return `${idx + 1}. *🔑 ${item.product.name}${optionsLabel}*\n   الكمية: (${item.quantity})\n   رمز الصنف: [${item.product.code || item.product.id}]\n   السعر: ${formatPrice(getProductPriceInSAR(item.product) * item.quantity)}\n`;
    }).join("\n");

    const fullMsg = 
`*📥 طلب جديد من متجر ومستودع الذيباني VIP* 🐺💎
======================
*العميل المعتمد:* ${customerName}
*الجوال المساعد:* ${customerPhone}
*عنوان التوصيل:* ${customerAddress}
*وسيلة دفع السلة:* ${paymentMethod}

*📋 تفاصيل الأصناف المحجوزة:*
${itemsText}
======================
*قيمة السلة الأساسي:* ${formatPrice(totalPriceOfCart)}
${taxEnabled && taxVisible ? `*ضريبة القيمة المضافة (${taxRate}%)${!taxInTotal ? " (غير مضافة على الإجمالي)" : ""}:* ${formatPrice(taxAmount)}\n` : ""}${(deliveryFeeEnabled && deliveryVisible) ? `*رسوم الخدمة وتوصيل الشحنة${!deliveryInTotal ? " (غير مضافة على الإجمالي)" : ""}:* ${deliveryFee === 0 ? "مجاني" : formatPrice(deliveryFee)}\n` : ""}======================
*المبلغ الكلي الكلي:* *${formatPrice(finalBillAmount)}* 💵

✨ _تم إعداد وتجهيز الطلب بنجاح عبر النظام الذكي ومساعد الـ AI_ 🤖`;

    const encoded = encodeURIComponent(fullMsg);
    const waLink = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    setCreatedOrderLink(waLink);

    // Update stocks safely
    setProducts((prev) => {
      return prev.map((p) => {
        const cartMatch = cart.find(c => c.product.id === p.id);
        if (cartMatch) {
          const cap = p.stock !== undefined ? p.stock : 99;
          return { ...p, stock: Math.max(0, cap - cartMatch.quantity) };
        }
        return p;
      });
    });

    // Save statistics
    setSalesStats((prev) => ({
      totalRevenue: prev.totalRevenue + finalBillAmount,
      totalOrders: prev.totalOrders + 1
    }));

    // Helper to recursively remove undefined properties for Firebase compatibility
    const cleanUndefined = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(cleanUndefined);
      } else if (obj !== null && typeof obj === 'object') {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (val !== undefined) {
            cleaned[key] = cleanUndefined(val);
          }
        }
        return cleaned;
      }
      return obj;
    };

    // Record order in state list and Firebase Realtime Database
    const orderId = `DHB-ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      paymentMethod: paymentMethod,
      items: [...cart],
      totalPrice: finalBillAmount,
      date: new Date().toLocaleString("ar-YE", { hour12: true }),
      status: "قيد المعالجة"
    };

    setOrders((prev) => [newOrder, ...prev]);
    localStorage.setItem("last_placed_order_id", orderId);
    localStorage.setItem("last_tracked_status", "قيد المعالجة");
    setTrackedOrderId(orderId);
    setLastTrackedStatus("قيد المعالجة");

    try {
      const firebaseFriendlyOrder = cleanUndefined(newOrder);
      set(ref(db, `orders/${orderId}`), firebaseFriendlyOrder);
    } catch (err) {
      console.error("Failed to commit order: ", err);
    }

    // Transition to Success Step
    setCheckoutStep("success");
  };

  const finalReset = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setCheckoutStep("details");
    setCheckoutSubStep(1);
    setCustomerPhone("");
    setCustomerAddress("");
    setCreatedOrderLink("");
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white font-sans antialiased selection:bg-yellow-500/20 selection:text-yellow-405" id="applet-main-container">
      
      {/* Dynamic Header Announcement marquee (Infinite slide feel) */}
      <div className={`bg-gradient-to-r from-blue-950 via-[#0f172a] to-blue-950 text-xs text-center py-2 px-4 shadow-sm border-b border-yellow-500/20 relative z-50 text-yellow-400 font-semibold transition-all duration-300 ${
        isAnyInputFocused ? 'hidden sm:block' : 'block'
      }`} id="promo-banner">
        <marquee direction="right" scrollamount="4" className="w-full">
          {tickerMessage}
        </marquee>
      </div>

      {/* CORE HERO BRANDING HEADER */}
      <header className={`bg-[#0b1329] border-b border-yellow-500/20 sticky top-0 z-40 shadow-xl transition-all duration-300 ${isAnyInputFocused ? 'py-1 md:py-4' : 'py-3 md:py-4'}`} id="store-main-header">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${isAnyInputFocused ? 'py-0.5 md:py-2' : 'py-3 md:py-4'}`}>
          
          {/* Main customized logo representing Al-Dhibani VIP */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => {
            setCurrentTab("store");
            handleLogoClick();
          }} id="brand-logo-panel" title="بوابة الإدارة انقر 5 مرات متتالية">
            <div className={`bg-gradient-to-tr from-yellow-500 via-amber-500 to-yellow-600 text-blue-950 p-1.5 rounded-2xl shadow-lg border border-yellow-400 font-extrabold items-center justify-center transform hover:rotate-3 transition-all duration-300 overflow-hidden ${isAnyInputFocused ? 'hidden md:flex w-10 h-10' : 'flex w-13 h-13'}`}>
              {logoUrl ? (
                <img src={logoUrl} alt="الذيباني" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-xl">🐺</span>
              )}
            </div>
            <div className="text-right">
              <h1 className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 leading-none transition-all duration-305 ${isAnyInputFocused ? 'text-sm md:text-xl' : 'text-base md:text-xl'}`}>
                مستودع ومتجر الذيباني VIP
              </h1>
              {!isAnyInputFocused && (
                <p className="text-[10px] text-slate-405 mt-1 font-semibold tracking-wide hidden sm:block">
                  خدمة شحن ألعاب فوري، توابل فاخرة، مواد تموينية وإلكترونيات بجودة معتمدة
                </p>
              )}
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1.5 bg-[#060b18] p-1 rounded-2xl border border-blue-900/40" id="currency-toggle-wrapper" dir="rtl">
            <span className="text-[10px] text-slate-400 font-bold px-2 hidden sm:inline">تحديد العملة:</span>
            <button
              onClick={() => {
                setCurrency('SAR');
                localStorage.setItem("store_currency", "SAR");
                addToast("🇸🇦 تم تغيير عملة المتجر إلى الريال السعودي (ر.س)", "info");
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer select-none ${
                currency === 'SAR'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-md transform hover:scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="currency-sar-btn"
            >
              <span>🇸🇦</span>
              <span>سعودي</span>
            </button>
            <button
              onClick={() => {
                setCurrency('YER');
                localStorage.setItem("store_currency", "YER");
                addToast("🇾🇪 تم تغيير عملة المتجر إلى الريال اليمني (ر.ي)", "info");
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer select-none ${
                currency === 'YER'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-md transform hover:scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="currency-yer-btn"
            >
              <span>🇾🇪</span>
              <span>يمني</span>
            </button>
          </div>

          {/* Dynamic Navigation Selectors */}
          <nav className="flex bg-[#060b18] p-1 rounded-2xl border border-blue-900/40 w-full md:w-auto" id="main-navigation-tabs">
            <button
              onClick={() => setCurrentTab("store")}
              className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                currentTab === "store"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-lg font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-store-btn"
            >
              <Store className="w-4 h-4" />
              <span>🐺 المعرض والمعروضات</span>
            </button>

            <button
              onClick={() => setCurrentTab("ai")}
              className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                currentTab === "ai"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-lg font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-ai-btn"
            >
              <Bot className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>💬 مستشارك الذكي AI</span>
            </button>

            <button
              onClick={() => setCurrentTab("tracking")}
              className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                currentTab === "tracking"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-lg font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
              id="nav-tracking-btn"
            >
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>🚚 تتبع الطلبات</span>
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => setCurrentTab("admin")}
                className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  currentTab === "admin"
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 shadow-lg font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
                id="nav-admin-btn"
              >
                <Settings className="w-4 h-4 text-yellow-405 animate-spin duration-[10000ms]" />
                <span>⚙️ لوحة إدارة المخزن</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* CORE APPLICATION VIEWPORT CONTAINER */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isAnyInputFocused ? 'py-1 md:py-8' : 'py-8'}`} id="main-body-container">
        
        {currentTab === "store" && (
          <div className="space-y-8">
            {/* Promo / Advertisements Carousel Slide Banner Area */}
            <PromoCarousel slides={carouselSlides} onSetActiveTab={setCurrentTab} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="store-view-grid">
            
            {/* Products grid block */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0b1329] p-5 rounded-3xl border border-blue-900/40" dir="rtl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h2 className="text-xl font-extrabold text-yellow-400 flex items-center gap-2">
                      <span>💎 الأصناف الفاخرة للذيباني</span>
                      <span className="text-[11px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-bold px-2.5 py-1 rounded-full">
                        {products.length} صنف متوفر بالمستودع
                      </span>
                    </h2>
                    <p className="text-xs text-slate-405 mt-1">
                      أصناف شحن الألعاب الفورية المباشرة بالإضافة لتشكيلة البهارات والمواد الفاخرة المعتمدة
                    </p>
                  </div>

                  {/* direct support info buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <a 
                      href={`https://wa.me/${whatsappNumber}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-550/10 hover:bg-emerald-600/20 rounded-xl text-xs border border-emerald-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-400 font-bold">تواصل واتساب الكادر</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Product catalog display */}
              <div className="bg-[#111a2e]/55 p-6 rounded-3xl border border-blue-900/30">
                <ProductCatalog
                  products={products}
                  categories={categories}
                  onAddToCart={handleAddToCart}
                  formatPrice={formatPrice}
                  currency={currency}
                  exchangeRate={exchangeRate}
                />
              </div>
            </div>

            {/* Shopping cart sidebar layout */}
            <div className="lg:col-span-1" id="sticky-cart-sidebar">
              <div className="bg-[#0b1329] rounded-3xl border border-yellow-500/20 p-6 shadow-2xl sticky top-28 space-y-6" dir="rtl">
                
                {/* Header of Sidebar */}
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-extrabold text-white text-sm">سلة الذيباني النشطة 🛒</h3>
                  </div>
                  <span className="bg-yellow-400 text-blue-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {cart.reduce((s, i) => s + i.quantity, 0)} قطعة محجوزة
                  </span>
                </div>

                {/* Items container */}
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 space-y-3">
                      <ShoppingBag className="w-10 h-10 mx-auto text-yellow-400 opacity-20 animate-pulse" />
                      <p className="text-xs font-semibold">سلتك خالية من البضائع حالياً</p>
                      <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                        اختر ما يناسبك من فئات الشحن السريع أو البهارات الفاخرة ليقوم مساعدنا بتجهيز الطلب لك
                      </p>
                    </div>
                  ) : (
                     cart.map((item) => {
                       const subKey = item.selectedSubOptions ? item.selectedSubOptions.map(s => `${s.name}_${s.quantity}`).join('-') : '';
                       const uniqueItemKey = `${item.product.id}-${item.selectedColor || ''}-${item.selectedFlavor || ''}-${subKey}`;
                       return (
                         <div key={uniqueItemKey} className="flex gap-3 bg-[#060b18]/60 p-3 rounded-2xl border border-blue-900/40 hover:border-yellow-500/20 transition-all">
                           <img
                             src={item.product.image}
                             alt={item.product.name}
                             className="w-12 h-12 object-cover rounded-xl border border-blue-900/40"
                           />
                           <div className="flex-1 min-w-0 flex flex-col justify-between">
                             <div className="space-y-0.5">
                               <h4 className="font-bold text-white text-xs truncate leading-normal">{item.product.name}</h4>
                               {((item.selectedColor || item.selectedFlavor) || (item.selectedSubOptions && item.selectedSubOptions.length > 0)) && (
                                 <div className="flex flex-wrap gap-1 mt-0.5 mb-1">
                                   {item.selectedSubOptions && item.selectedSubOptions.map((sub, sIdx) => (
                                     <span key={sIdx} className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[8px] font-bold text-rose-350 rounded">
                                       {sub.name} (x{sub.quantity})
                                     </span>
                                   ))}
                                   {item.selectedColor && (
                                     <span className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-[8px] font-bold text-yellow-450 rounded">
                                       اللون: {item.selectedColor}
                                     </span>
                                   )}
                                   {item.selectedFlavor && (
                                     <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 rounded">
                                       النكهة: {item.selectedFlavor}
                                     </span>
                                   )}
                                 </div>
                               )}
                               <p className="text-[10px] text-yellow-400 font-bold">{formatPrice(getProductPriceInSAR(item.product) * item.quantity)}</p>
                             </div>

                             <div className="flex items-center justify-between mt-1">
                               {/* Quantity Controls */}
                               <div className="flex items-center gap-1.5 bg-[#060b18] border border-blue-900/50 rounded-lg p-0.5">
                                 <button
                                   onClick={() => handleUpdateCartQty(item.product.id, false, item.selectedColor, item.selectedFlavor, item.selectedSubOptions)}
                                   className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors cursor-pointer"
                                 >
                                   <Minus className="w-3 h-3" />
                                 </button>
                                 <span className="text-[10px] font-bold px-1.5 text-white">{item.quantity}</span>
                                 <button
                                   onClick={() => handleUpdateCartQty(item.product.id, true, item.selectedColor, item.selectedFlavor, item.selectedSubOptions)}
                                   className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors cursor-pointer"
                                 >
                                   <Plus className="w-3 h-3" />
                                 </button>
                               </div>

                               <button
                                 onClick={() => handleRemoveFromCart(item.product.id, item.selectedColor, item.selectedFlavor, item.selectedSubOptions)}
                                 className="text-slate-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                                 title="إزالة هذا الصنف من السلة"
                                >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             </div>
                           </div>
                         </div>
                       );
                     })
                  )}
                </div>

                {/* Subtotals & checkout trigger */}
                {cart.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-blue-900/40">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>إجمالي بنود البضائع:</span>
                      <span className="font-bold text-white">{formatPrice(totalPriceOfCart)}</span>
                    </div>

                    {taxEnabled && taxVisible && (
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>ضريبة القيمة المضافة ({taxRate}%){!taxInTotal && " (غير مضافة للإجمالي)"}:</span>
                        <span className="font-bold text-white">{formatPrice(taxAmount)}</span>
                      </div>
                    )}

                    {deliveryFeeEnabled && deliveryVisible && (
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>رسوم خدمة الشحن والتوصيل الفوري{!deliveryInTotal && " (غير مضافة للإجمالي)"}:</span>
                        <span className="font-bold">
                          {deliveryFee === 0 ? (
                            <span className="text-emerald-450 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">مجاني VIP ✨</span>
                          ) : (
                            formatPrice(deliveryFee)
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs font-bold text-white bg-[#060b18] p-3.5 rounded-2xl border border-yellow-500/20 mt-1">
                      <span className="text-slate-300 font-extrabold text-xs">المبلغ الكلي المطلوب بالعملة المختارة:</span>
                      <span className="text-yellow-455 text-base font-black">{formatPrice(finalBillAmount)}</span>
                    </div>

                    {/* Check out button */}
                    <button
                      onClick={() => {
                        setCheckoutStep("details");
                        setIsCheckoutOpen(true);
                        // prefill customer name
                        setCustomerName(localStorage.getItem("customer_name") || "");
                        // prefill payment method dynamically
                        const pm = getPaymentMethods();
                        if (pm.length > 0) {
                          setPaymentMethod(pm[0]);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-450 hover:to-amber-450 shadow-yellow-500/10 shadow-lg text-blue-950 font-black py-3.5 px-4 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                      id="initiate-checkout-btn"
                    >
                      <CreditCard className="w-4 h-4 text-blue-950" />
                      <span>إكمال الطلب وحجز المنتجات</span>
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
          </div>
        )}

        {/* Tab 1.5: Customer Order Tracking Tab */}
        {currentTab === "tracking" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" id="tracking-tab-wrapper" dir="rtl">
            <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-xl space-y-6">
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-yellow-400 via-amber-300 to-yellow-400 flex items-center justify-center gap-2">
                  <Package className="w-7 h-7 text-yellow-400 animate-bounce" />
                  <span>تتبع حالة وتجهيز طلبك الفوري 🚚</span>
                </h2>
                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-normal">
                  أدخل رمز الفاتورة (الطلب) أو رقم الجوال الذي استخدمته أثناء حجز الطلب، لتتبع عملية المعالجة والتجهيز والتوصيل مباشرة من مستودع الذيباني VIP.
                </p>
              </div>

              {/* Search Bar Block */}
              <div className="flex flex-col sm:flex-row gap-3 bg-[#060b18]/60 p-4 rounded-2xl border border-blue-950">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={trackedOrderId}
                    onChange={(e) => setTrackedOrderId(e.target.value)}
                    placeholder="أدخل رمز طلبك (مثلاً: DHB-ORD-5231) أو رقم جوالك..."
                    className="w-full bg-[#0b1329]/90 border border-blue-900/30 rounded-xl py-3 pr-11 pl-4 text-xs font-bold text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500"
                  />
                </div>
                {/* Clear query button if there is any */}
                {trackedOrderId && (
                  <button
                    onClick={() => setTrackedOrderId("")}
                    className="bg-red-950/20 text-red-400 border border-red-900/30 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-900/20 transition-all cursor-pointer"
                  >
                    مسح البحث
                  </button>
                )}
              </div>

              {/* Quick suggestions block if they have a saved local order */}
              {localStorage.getItem("last_placed_order_id") && (
                <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-blue-950/20 p-3 rounded-xl border border-blue-900/10">
                  <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 animate-pulse" />
                  <span>طلبك الأخير المتاح في متمتصفحك:</span>
                  <button
                    onClick={() => {
                      const savedId = localStorage.getItem("last_placed_order_id") || "";
                      setTrackedOrderId(savedId);
                      addToast(`تم عرض الطلب الحالي: ${savedId}`, "info");
                    }}
                    className="text-yellow-400 font-bold underline hover:text-yellow-350 cursor-pointer"
                  >
                    {localStorage.getItem("last_placed_order_id")}
                  </button>
                </div>
              )}

              {/* Render Search Results */}
              <div className="space-y-6">
                {(() => {
                  if (!trackedOrderId.trim()) {
                    return (
                      <div className="text-center py-10 space-y-3 bg-[#060b18]/30 rounded-2xl border border-blue-950">
                        <Clock className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                        <p className="text-xs text-slate-405 font-bold">بانتظار إدخال رمز الطلب أو رقم الهاتف لبث حالة التحضير...</p>
                      </div>
                    );
                  }

                  // Find orders matching order ID OR phone number (stripped or partial matching)
                  const queryStripped = trackedOrderId.replace(/[^\d\w-]/g, '').toLowerCase();
                  const found = orders.filter(o => {
                    const idMatch = o.id.toLowerCase().includes(queryStripped);
                    const phoneMatch = o.phone.replace(/[^\d]/g, '').includes(queryStripped) && queryStripped.length >= 6;
                    return idMatch || phoneMatch;
                  });

                  if (found.length === 0) {
                    return (
                      <div className="bg-[#1f1015]/40 border border-red-900/30 p-5 rounded-2xl text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                        <h4 className="text-xs font-bold text-red-400">عذراً، لم نجد أي طلب مطابق للبيانات المدخلة!</h4>
                        <p className="text-[11px] text-slate-405 leading-normal max-w-md mx-auto">
                          يرجى التأكد من كتابة رمز الفاتورة بشكل صحيح (مثلاً <span className="font-mono text-yellow-400">DHB-ORD-123456</span>) أو كتابة رقم الجوال الصحيح الذي تم تأكيده مع المتجر.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="text-xs font-black text-yellow-400 border-b border-blue-900/20 pb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                        <span>تم العثور على ({found.length}) طلبات مطابقة:</span>
                      </div>

                      {found.map((order) => {
                        // Helper to estimate stepper status step
                        const isAtLeastProcessing = ['قيد المعالجة', 'تم التجهيز للشحن', 'تم التسليم 🟢'].includes(order.status);
                        const isAtLeastShipped = ['تم التجهيز للشحن', 'تم التسليم 🟢'].includes(order.status);
                        const isDelivered = order.status === 'تم التسليم 🟢';
                        const isCancelled = order.status === 'ملغي ❌';

                        return (
                          <div key={order.id} className="bg-[#060b18]/80 p-5 sm:p-6 rounded-2xl border border-blue-900/40 space-y-5 hover:border-yellow-500/20 transition-all">
                            
                            {/* Order mini-header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-blue-900/20 pb-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black text-yellow-400 bg-yellow-400/5 px-2.5 py-1 rounded-lg border border-yellow-500/10 font-mono">{order.id}</span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    isDelivered ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    isAtLeastShipped ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-550 border border-amber-500/20'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  تاريخ الحجز والوقت: {order.date}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block">الإجمالي الكلي المطلوب:</span>
                                <span className="text-xs font-black text-yellow-455 font-mono">{formatPrice(order.totalPrice)}</span>
                              </div>
                            </div>

                            {/* visual progress stepper progress bar */}
                            {!isCancelled ? (
                              <div className="space-y-4">
                                <span className="block text-[10px] font-black text-slate-400 mb-2">مراحل وخطوات التجهيز الفوري:</span>
                                
                                {/* Stepper Layout */}
                                <div className="grid grid-cols-4 gap-2 relative pt-2">
                                  {/* Step 1: Received */}
                                  <div className="text-center flex flex-col items-center gap-1.5 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border shadow-md transition-all ${
                                      isAtLeastProcessing 
                                        ? 'bg-amber-500 text-blue-950 border-amber-400 scale-105' 
                                        : 'bg-slate-900 text-slate-550 border-blue-950'
                                    }`}>
                                      {isAtLeastProcessing ? '✓' : '1'}
                                    </div>
                                    <span className="text-[9px] font-bold text-white truncate w-full">استلام الطلب</span>
                                    <span className="text-[8px] text-slate-500">تم تسجيله بنجاح</span>
                                  </div>

                                  {/* Step 2: Preparing */}
                                  <div className="text-center flex flex-col items-center gap-1.5 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border shadow-md transition-all ${
                                      order.status === 'قيد المعالجة'
                                        ? 'bg-amber-400 text-blue-950 border-yellow-300 animate-pulse scale-110'
                                        : isAtLeastShipped
                                          ? 'bg-amber-500 text-blue-950 border-amber-400'
                                          : 'bg-slate-900 text-slate-550 border-blue-950'
                                    }`}>
                                      {isAtLeastShipped ? '✓' : '2'}
                                    </div>
                                    <span className="text-[9px] font-bold text-white truncate w-full">تحت التجهيز ⏳</span>
                                    <span className="text-[8px] text-slate-500">تجميع البضائع</span>
                                  </div>

                                  {/* Step 3: Packed / Ready */}
                                  <div className="text-center flex flex-col items-center gap-1.5 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border shadow-md transition-all ${
                                      order.status === 'تم التجهيز للشحن'
                                        ? 'bg-blue-500 text-white border-blue-400 animate-pulse scale-110'
                                        : isDelivered
                                          ? 'bg-amber-500 text-blue-950 border-amber-400'
                                          : 'bg-slate-900 text-slate-550 border-blue-950'
                                    }`}>
                                      {isDelivered ? '✓' : '3'}
                                    </div>
                                    <span className="text-[9px] font-bold text-white truncate w-full">للشحن والتسليم</span>
                                    <span className="text-[8px] text-slate-500">جاهز للتوصيل 🚚</span>
                                  </div>

                                  {/* Step 4: Delivered */}
                                  <div className="text-center flex flex-col items-center gap-1.5 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border shadow-md transition-all ${
                                      isDelivered
                                        ? 'bg-emerald-500 text-white border-emerald-400 scale-105'
                                        : 'bg-slate-900 text-slate-550 border-blue-950'
                                    }`}>
                                      {isDelivered ? '✓' : '4'}
                                    </div>
                                    <span className="text-[9px] font-bold text-white truncate w-full">تم التسليم 🟢</span>
                                    <span className="text-[8px] text-slate-500">بنجاح تام</span>
                                  </div>
                                </div>

                                {/* Tracking Empathetic Reassuring Status Description Card */}
                                <div className="bg-[#0b1329]/95 p-4 rounded-xl border border-blue-900/40 mt-3 space-y-1">
                                  <p className="text-[11px] font-black text-yellow-400 flex items-center gap-1">
                                    <span>🛡️ معلومات حالة الشحنة:</span>
                                    {order.status === 'قيد المعالجة' && <span className="animate-pulse text-amber-400">(الطلب قيد المراجعة الفورية وتعبئة الصناديق والتجهيز)</span>}
                                    {order.status === 'تم التجهيز للشحن' && <span className="animate-pulse text-blue-400">(تم الانتهاء من التجهيز بالكامل وهو جاهز للانطلاق مع مندوب التوصيل)</span>}
                                    {order.status === 'تم التسليم 🟢' && <span className="text-emerald-400">(تم تسليم الطلب للعميل، شكراً لتعاملك الموثوق!)</span>}
                                  </p>
                                  <p className="text-[10px] text-slate-400 leading-normal font-sans">
                                    {order.status === 'قيد المعالجة' && "الطلب الآن يخضع للتدقيق اليدوي لضمان صحة البيانات والخيارات المختارة من قبلك، وسيتم إكمال التجهيز للشحن فوراً. يرجى إبقاء هاتفك متاحاً للتواصل المباشر."}
                                    {order.status === 'تم التجهيز للشحن' && "لقد قام موظفو المخزن بإنهاء تحضير وفرز جميع الأصناف المطلوبة وتعبئتها في العبوة المعتمدة للذيباني VIP، ويتم تحضير المندوب حالياً لبدء مسار الرحلة لتسليم شحنتك الموقرة."}
                                    {order.status === 'تم التسليم 🟢' && "لقد تم إنهاء وتسليم هذه الصفقة بالكامل وتأكيد السداد المباشر لها بنجاح. إذا كان لديك أي استفسار آخر، لا تتردد بالتواصل مع دعم مستودع الذيباني."}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-950/10 border border-red-900/20 p-4 rounded-xl text-right animate-pulse">
                                <p className="text-red-400 text-xs font-black">❌ حالة هذا الطلب: ملغي ومستبعد</p>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                                  تم إلغاء هذا الطلب من قبل الإدارة الفنية للمتجر. قد يكون ذلك بسبب عدم تأكيد البيانات أو تعديل الطلب بطلب جديد، يرجى التواصل مع الدعم للتفاصيل المباشرة.
                                </p>
                              </div>
                            )}

                            {/* Order Details Accordion summary layout */}
                            <div className="bg-[#0b1329]/40 p-3 sm:p-4 rounded-xl space-y-2 border border-blue-900/10">
                              <span className="block text-[10px] font-black text-slate-400 pb-1">ملخص البضائع والأصناف المحجوزة:</span>
                              <div className="space-y-1.5" dir="rtl">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center text-[10px] text-slate-350 bg-[#060b18]/45 px-2.5 py-1.5 rounded-lg border border-blue-950">
                                    <div className="flex flex-col text-right">
                                      <span className="font-extrabold text-white">{item.product.name}</span>
                                      {(item.selectedColor || item.selectedFlavor || (item.selectedSubOptions && item.selectedSubOptions.length > 0)) && (
                                        <div className="flex flex-wrap gap-1 mt-0.5 text-[8px] font-bold">
                                          {item.selectedSubOptions && item.selectedSubOptions.map((sub, sIdx) => (
                                            <span key={sIdx} className="px-1 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-350 rounded">
                                              {sub.name} (x{sub.quantity})
                                            </span>
                                          ))}
                                          {item.selectedColor && <span className="px-1 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-450 rounded">اللون: {item.selectedColor}</span>}
                                          {item.selectedFlavor && <span className="px-1 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded">النكهة: {item.selectedFlavor}</span>}
                                        </div>
                                      )}
                                    </div>
                                    <span className="font-mono flex-shrink-0">({item.quantity} حبة) x {formatPrice(item.product.price)}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="pt-2 border-t border-blue-900/10 flex justify-between items-center text-[10px] text-slate-405">
                                <span>العميل: <strong className="text-white">{order.customerName}</strong></span>
                                <span>عنوان التوصيل: <strong className="text-white font-sans">{order.address}</strong></span>
                              </div>
                            </div>

                            {/* Quick direct Whatsapp contact update request link button */}
                            <div className="flex justify-end pt-1">
                              <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`السلام عليكم، أود الاستفسار عن حالة طلبي المعتمد رقم (${order.id}) مسجل باسم العميل المحترم (${order.customerName}).`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-gradient-to-r from-emerald-600/10 to-emerald-500/15 text-emerald-400 hover:from-emerald-600/20 hover:to-emerald-500/25 text-[10px] font-black rounded-xl border border-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer decoration-none"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>تواصل واتساب مباشر للاستفسار عن هذا الطلب 📲</span>
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Gemini Direct Chat with Context */}
        {currentTab === "ai" && (
          <div className="space-y-6" id="ai-tab-wrapper">
            <div className="max-w-4xl mx-auto">
              <AIChatSection products={products} />
            </div>
          </div>
        )}

        {/* Tab 3: Admin Dashboard with Security login verification */}
        {currentTab === "admin" && (
          <div className="space-y-6" id="admin-tab-wrapper">
            {!isAdminLoggedIn ? (
              <AdminLoginGate 
                correctPassword={adminPassword}
                onSuccess={() => {
                  setIsAdminLoggedIn(true);
                  sessionStorage.setItem("is_admin_vip_logged", "true");
                  addToast("🔑 تم التحقق بنجاح! نرحب بكم في كابينة الإشراف VIP...", "success");
                }}
                onCancel={() => {
                  setCurrentTab("store");
                }}
              />
            ) : (
              <div className="bg-[#0b1329] p-6 rounded-3xl border border-blue-900/40 shadow-2xl animate-fade-in" id="admin-management-container">
                {/* Provide warning informative card about database settings node */}
                <div className="mb-6 p-4 rounded-2xl bg-blue-950/40 border border-yellow-500/20 flex gap-3 text-right" dir="rtl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-400 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-yellow-400">مزامنة تامة لمتجر الذيباني الفعلي 🔗</p>
                    <p className="text-slate-300 leading-relaxed">
                      لوحة الإدارة تقوم بمزامنة تامة مع خادم وقاعدة بيانات Realtime Database المعتمدة لديك. التغييرات التي تقوم بها هنا سوف تؤثر على البضائع المحلية فورياً لغرض المحاكاة وتجربة السلة بامتياز.
                    </p>
                  </div>
                </div>

                <AdminDashboard
                  products={products}
                  categories={categories}
                  salesData={salesStats}
                  logoUrl={logoUrl}
                  onUpdateLogo={(newLogo) => {
                    setLogoUrl(newLogo);
                    localStorage.setItem("store_logo_url", newLogo);
                    try {
                      set(ref(db, "settings/logo"), {
                        Key: "logo",
                        Type: "logo",
                        Value: newLogo,
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write logo to firebase:", err);
                    }
                  }}
                  whatsappNumber={whatsappNumber}
                  onUpdateWhatsapp={(newNumber) => {
                    const cleaned = newNumber.replace(/[^\d]/g, "");
                    setWhatsappNumber(cleaned);
                    localStorage.setItem("store_whatsapp_number", cleaned);
                    try {
                      set(ref(db, "settings/whatsapp"), {
                        Key: "whatsapp",
                        Type: "whatsapp",
                        Value: cleaned,
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write whatsapp to firebase:", err);
                    }
                  }}
                  tickerMessage={tickerMessage}
                  onUpdateTicker={(newTicker) => {
                    setTickerMessage(newTicker);
                    localStorage.setItem("store_ticker_message", newTicker);
                    try {
                      set(ref(db, "settings/alert"), {
                        Key: "alert",
                        Type: "alert",
                        Value: newTicker,
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write alert to firebase:", err);
                    }
                  }}
                  paymentMethods={paymentMethods}
                  onUpdatePaymentMethods={(newPayments) => {
                    setPaymentMethods(newPayments);
                    localStorage.setItem("store_payment_methods", JSON.stringify(newPayments));
                    try {
                      set(ref(db, "settings/payments"), newPayments);
                    } catch (err) {
                      console.error("Failed to write payments to firebase:", err);
                    }
                  }}
                  orders={orders}
                  onUpdateOrderStatus={(orderId, nextStatus) => {
                    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
                    try {
                      set(ref(db, `orders/${orderId}/status`), nextStatus);
                    } catch (err) {
                      console.error("Failed to update status on firebase: ", err);
                    }
                  }}
                  onDeleteOrder={(orderId) => {
                    setOrders(prev => prev.filter(o => o.id !== orderId));
                    try {
                      set(ref(db, `orders/${orderId}`), null);
                    } catch (err) {
                      console.error("Failed to remove order from firebase:", err);
                    }
                  }}
                  carouselSlides={carouselSlides}
                  onUpdateSlides={(newSlides) => {
                    setCarouselSlides(newSlides);
                    localStorage.setItem("store_carousel_slides", JSON.stringify(newSlides));
                    try {
                      set(ref(db, "settings/carousel"), newSlides);
                    } catch(err) {
                      console.error("Failed to write carousel to firebase:", err);
                    }
                  }}
                  onAddProduct={(p) => {
                    const created: Product = { ...p, id: `prod-${Date.now()}` };
                    setProducts(prev => [...prev, created]);
                    try {
                      set(ref(db, `products/${created.id}`), created);
                    } catch(err) {
                      console.error("Failed to write newly added product to firebase:", err);
                    }
                  }}
                  onEditProduct={(id, updated) => {
                    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
                    try {
                      const selectProduct = products.find(p => p.id === id);
                      if (selectProduct) {
                        set(ref(db, `products/${id}`), {
                          ...selectProduct,
                          ...updated
                        });
                      }
                    } catch(err) {
                      console.error("Failed to edit product on firebase:", err);
                    }
                  }}
                  onBulkConvertCurrency={handleBulkConvertCurrency}
                  onDeleteProduct={(id) => {
                    setProducts(prev => prev.filter(p => p.id !== id));
                    try {
                      set(ref(db, `products/${id}`), null);
                    } catch(err) {
                      console.error("Failed to delete product from firebase:", err);
                    }
                  }}
                  onAddCategory={(cat) => {
                    const created: StoreCategory = { ...cat, id: `cat-${Date.now()}` };
                    setCategories(prev => [...prev, created]);
                    try {
                      set(ref(db, `categories/${created.id}`), created);
                    } catch(err) {
                      console.error("Failed to add category to firebase:", err);
                    }
                  }}
                  onDeleteCategory={(id) => {
                    setCategories(prev => prev.filter(c => c.id !== id));
                    try {
                      set(ref(db, `categories/${id}`), null);
                    } catch(err) {
                      console.error("Failed to delete category from firebase:", err);
                    }
                  }}
                  adminPassword={adminPassword}
                  onUpdateAdminPassword={(newPass) => {
                    const cleaned = newPass.trim();
                    setAdminPassword(cleaned);
                    localStorage.setItem("store_admin_password", cleaned);
                    try {
                      set(ref(db, "settings/adminPassword"), {
                        Key: "adminPassword",
                        Type: "adminPassword",
                        Value: cleaned,
                        Link_or_Status: "نشط"
                      });
                      addToast("🔒 تم ترقية وتحديث رمز الحماية السري بالكامل!", "success");
                    } catch (err) {
                      console.error("Failed to write admin password to firebase:", err);
                    }
                  }}
                  currency={currency}
                  onUpdateCurrency={(newCurr) => {
                    setCurrency(newCurr);
                    localStorage.setItem("store_currency", newCurr);
                    try {
                      set(ref(db, "settings/currency"), {
                        Key: "currency",
                        Type: "currency",
                        Value: newCurr,
                        Link_or_Status: "نشط"
                      });
                      addToast(`💳 تم تغيير العملة الافتراضية للمتجر إلى ${newCurr === 'SAR' ? 'الريال السعودي (SAR)' : 'الريال اليمني (YER)'} بنجاح!`, "success");
                    } catch (err) {
                      console.error("Failed to write currency to firebase:", err);
                    }
                  }}
                  exchangeRate={exchangeRate}
                  onUpdateExchangeRate={(newRate) => {
                    setCurrency('YER'); // auto-select Yemeni Rial to witness the changes if updating
                    localStorage.setItem("store_currency", "YER");
                    setExchangeRate(newRate);
                    localStorage.setItem("store_exchange_rate", String(newRate));
                    try {
                      set(ref(db, "settings/exchangeRate"), {
                        Key: "exchangeRate",
                        Type: "exchangeRate",
                        Value: newRate,
                        Link_or_Status: "نشط"
                      });
                      addToast("💳 تم تحديث سعر صرف الريال اليمني وتعميمه بنجاح!", "success");
                    } catch (err) {
                      console.error("Failed to write exchange rate to firebase:", err);
                    }
                  }}
                  formatPrice={formatPrice}
                  deliveryFeeEnabled={deliveryFeeEnabled}
                  onUpdateDeliveryFeeEnabled={(enabled) => {
                    setDeliveryFeeEnabled(enabled);
                    localStorage.setItem("store_delivery_fee_enabled", String(enabled));
                    try {
                      set(ref(db, "settings/deliveryFeeEnabled"), {
                        Key: "deliveryFeeEnabled",
                        Type: "deliveryFeeEnabled",
                        Value: String(enabled),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write deliveryFeeEnabled to firebase:", err);
                    }
                  }}
                  deliveryFeeValue={deliveryFeeValue}
                  onUpdateDeliveryFeeValue={(newVal) => {
                    setDeliveryFeeValue(newVal);
                    localStorage.setItem("store_delivery_fee_value", String(newVal));
                    try {
                      set(ref(db, "settings/deliveryFeeValue"), {
                        Key: "deliveryFeeValue",
                        Type: "deliveryFeeValue",
                        Value: Number(newVal),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write deliveryFeeValue to firebase:", err);
                    }
                  }}
                  taxEnabled={taxEnabled}
                  onUpdateTaxEnabled={(enabled) => {
                    setTaxEnabled(enabled);
                    localStorage.setItem("store_tax_enabled", String(enabled));
                    try {
                      set(ref(db, "settings/taxEnabled"), {
                        Key: "taxEnabled",
                        Type: "taxEnabled",
                        Value: String(enabled),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write taxEnabled to firebase:", err);
                    }
                  }}
                  taxRate={taxRate}
                  onUpdateTaxRate={(rate) => {
                    setTaxRate(rate);
                    localStorage.setItem("store_tax_rate", String(rate));
                    try {
                      set(ref(db, "settings/taxRate"), {
                        Key: "taxRate",
                        Type: "taxRate",
                        Value: Number(rate),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write taxRate to firebase:", err);
                    }
                  }}
                  taxInTotal={taxInTotal}
                  onUpdateTaxInTotal={(inTotal) => {
                    setTaxInTotal(inTotal);
                    localStorage.setItem("store_tax_in_total", String(inTotal));
                    try {
                      set(ref(db, "settings/taxInTotal"), {
                        Key: "taxInTotal",
                        Type: "taxInTotal",
                        Value: String(inTotal),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write taxInTotal to firebase:", err);
                    }
                  }}
                  taxVisible={taxVisible}
                  onUpdateTaxVisible={(visible) => {
                    setTaxVisible(visible);
                    localStorage.setItem("store_tax_visible", String(visible));
                    try {
                      set(ref(db, "settings/taxVisible"), {
                        Key: "taxVisible",
                        Type: "taxVisible",
                        Value: String(visible),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write taxVisible to firebase:", err);
                    }
                  }}
                  deliveryInTotal={deliveryInTotal}
                  onUpdateDeliveryInTotal={(inTotal) => {
                    setDeliveryInTotal(inTotal);
                    localStorage.setItem("store_delivery_in_total", String(inTotal));
                    try {
                      set(ref(db, "settings/deliveryInTotal"), {
                        Key: "deliveryInTotal",
                        Type: "deliveryInTotal",
                        Value: String(inTotal),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write deliveryInTotal to firebase:", err);
                    }
                  }}
                  deliveryVisible={deliveryVisible}
                  onUpdateDeliveryVisible={(visible) => {
                    setDeliveryVisible(visible);
                    localStorage.setItem("store_delivery_visible", String(visible));
                    try {
                      set(ref(db, "settings/deliveryVisible"), {
                        Key: "deliveryVisible",
                        Type: "deliveryVisible",
                        Value: String(visible),
                        Link_or_Status: "نشط"
                      });
                    } catch (err) {
                      console.error("Failed to write deliveryVisible to firebase:", err);
                    }
                  }}
                  onLogoutAdmin={() => {
                    setIsAdminLoggedIn(false);
                    sessionStorage.removeItem("is_admin_vip_logged");
                    setCurrentTab("store");
                    addToast("🔒 تم خروج المشرف وإغلاق الجلسة الآمنة بنجاح.", "warning");
                  }}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* CHECKOUT MODAL WINDOW DETAILED FOR WHATSAPP TRANSMISSION */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-[#060b18]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="checkout-modal-overlay">
          <div className="bg-[#0b1329] rounded-3xl border border-yellow-500/25 max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-fit" dir="rtl" id="checkout-modal-content">
            
            {/* Modal header */}
            <div className="bg-[#0f172a] p-5 border-b border-blue-900/40 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-2 text-yellow-400">
                  <CreditCard className="w-4.5 h-4.5 text-yellow-400" />
                  <span>تأكيد المشتريات وإرسال الطلب لمتجر الذيباني VIP</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">يرجى تسجيل التفاصيل أدناه لتجهيز بضاعتك وإرسالها الفوري.</p>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
                id="close-checkout-modal"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* STEP 1: FILL SPECIFICS & REDIRECT BUTTON ASSIGN */}
            {checkoutStep === "details" && (
              <div className="flex flex-col flex-1" id="checkout-form-container">
                
                {/* Interactive checkout stepper progress bar */}
                <div className="bg-[#060b18] px-6 py-4 border-b border-blue-900/35 flex items-center justify-between text-[11px]" dir="rtl">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-black text-[10px] ${checkoutSubStep >= 1 ? 'bg-yellow-500 text-blue-950' : 'bg-slate-800 text-slate-400'}`}>1</div>
                    <span className={`${checkoutSubStep >= 1 ? 'text-yellow-400 font-extrabold' : 'text-slate-400'}`}>الاسم والهاتف</span>
                  </div>
                  <div className="flex-grow h-[2px] bg-blue-950 mx-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: checkoutSubStep === 1 ? '0%' : checkoutSubStep === 2 ? '50%' : '100%' }}></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-black text-[10px] ${checkoutSubStep >= 2 ? 'bg-yellow-500 text-blue-950' : 'bg-slate-800 text-slate-400'}`}>2</div>
                    <span className={`${checkoutSubStep >= 2 ? 'text-yellow-400 font-extrabold' : 'text-slate-400'}`}>عنوان الشحن</span>
                  </div>
                  <div className="flex-grow h-[2px] bg-blue-950 mx-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: checkoutSubStep === 3 ? '100%' : '0%' }}></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-black text-[10px] ${checkoutSubStep >= 3 ? 'bg-yellow-500 text-blue-950' : 'bg-slate-800 text-slate-400'}`}>3</div>
                    <span className={`${checkoutSubStep >= 3 ? 'text-yellow-400 font-extrabold' : 'text-slate-400'}`}>إجراء الدفع</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Sub Step 1: Personal Info */}
                  {checkoutSubStep === 1 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-yellow-400" />
                          <span>الاسم الكامل الصريح واللقب المعتمد *</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: يونس بن علي الذيباني"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#060b18] border border-blue-900/60 rounded-xl text-base md:text-xs text-white focus:border-yellow-500/50 outline-none transition-all text-right"
                          id="checkout-name-input"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-yellow-400" />
                          <span>جوال التواصل المباشر (رقم الكشاف أو حساب واتساب) *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="مثال: 770493341"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-[#060b18] border border-blue-900/60 rounded-xl text-base md:text-xs text-white focus:border-yellow-500/50 outline-none transition-all text-left font-mono"
                          id="checkout-phone-input"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!customerName.trim() || !customerPhone.trim()) {
                              addToast("⚠️ يرجى تعبئة الاسم ورقم الجوال للمتابعة", "warning");
                              return;
                            }
                            setCheckoutSubStep(2);
                          }}
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg text-blue-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                        >
                          <span>أكمل إلى عنوان وموقع الشحن 📍</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub Step 2: Location Address */}
                  {checkoutSubStep === 2 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                          <span>حدد عنوان الشحن التفصيلي وموقع التوصيل الدقيق لبضاعتك *</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="مثال: صنعاء، أمانة العاصمة، شارع الستين الغربي، بجانب بريد الستين..."
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full px-4 py-3 bg-[#060b18] border border-blue-900/60 rounded-xl text-base md:text-xs text-white focus:border-yellow-500/50 outline-none transition-all text-right placeholder:text-slate-600 leading-relaxed"
                          id="checkout-address-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutSubStep(1)}
                          className="w-full bg-slate-800 hover:bg-slate-750 text-white font-bold py-3 rounded-xl text-xs cursor-pointer text-center"
                        >
                          ◀ السابق
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!customerAddress.trim()) {
                              addToast("⚠️ يرجى تفصيل عنوان شحن البضائع للمتابعة", "warning");
                              return;
                            }
                            setCheckoutSubStep(3);
                          }}
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-3 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                        >
                          <span>طريقة دفع السلة 💳</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub Step 3: Payment Selection */}
                  {checkoutSubStep === 3 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-yellow-405" />
                          <span>إجراء ووسيلة تسوية سداد السلة المعتمدة للطلب: *</span>
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[180px] overflow-y-auto pr-1" id="payment-methods-grid">
                          {getPaymentMethods().map((method, index) => {
                            const isSelected = paymentMethod === method;

                            let iconEmoji = "💵";
                            if (method.includes("كريمي") || method.includes("الكريمي") || method.includes("بنك")) {
                              iconEmoji = "🏦";
                            } else if (method.includes("النجم") || method.includes("حوالة") || method.includes("ارسال")) {
                              iconEmoji = "💸";
                            } else if (method.includes("محفظة") || method.includes("جوالي") || method.includes("فلوس") || method.includes("جوال")) {
                              iconEmoji = "📱";
                            } else if (method.includes("الاستلام") || method.includes("كاش") || method.includes("يدوي")) {
                              iconEmoji = "💵";
                            } else if (method.includes("الامتياز") || method.includes("سلمان")) {
                              iconEmoji = "🚀";
                            }

                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setPaymentMethod(method)}
                                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-right cursor-pointer h-full ${
                                  isSelected
                                    ? "border-yellow-500 bg-yellow-500/15 text-white shadow-md font-extrabold"
                                    : "border-blue-900/40 bg-[#060b18] text-slate-400 hover:bg-blue-950/35"
                                }`}
                                id={`pay-method-option-${index}`}
                              >
                                <span className="text-sm flex-shrink-0">{iconEmoji}</span>
                                <span className="text-[10px] sm:text-[11px] font-bold leading-normal">{method}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Summary recap block inside step 3 */}
                      <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-[10px] text-slate-350 leading-relaxed space-y-1">
                        <div className="flex justify-between">
                          <span>المشتريات لـ <strong className="text-slate-205">{customerName}</strong></span>
                          <span>المجموع الكلي: <strong className="text-yellow-400 font-bold">{formatPrice(finalBillAmount)}</strong></span>
                        </div>
                        <p className="text-[9px] text-slate-450 mt-1">
                          💡 بمجرد الحجز وتأكيد الفاتورة سوف تحصل فورا على الرابط الفوري لإرسال الطلب مباشر لواتساب الإدارة وتأكيد الشحن!
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutSubStep(2)}
                          className="col-span-1 bg-slate-800 hover:bg-slate-750 text-white font-bold py-3 rounded-xl text-xs cursor-pointer text-center font-sans"
                        >
                          ◀ السابق
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            if (!paymentMethod) {
                              addToast("⚠️ الرجاء تحديد طريقة من خيارات الدفع", "warning");
                              return;
                            }
                            handleProcessCheckout(e);
                          }}
                          className="col-span-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black py-3 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg transform active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-950" />
                          <span>إنشاء وتأكيد الفاتورة 🚀</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STEP 2: ORDER SUCCESSFULLY BUILT AND REDIRECT READY */}
            {checkoutStep === "success" && (
              <div className="p-8 text-center space-y-5" id="checkout-success-view">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-yellow-405">تم حجز وتجميع الطلب الفاخر الخاص بك! 🎉</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                    شكراً لك يا عزيزنا <strong className="text-white">{customerName}</strong>! تم تسجيل طلبيتك في السجلات، لإتمام الشحن السداد الفوري وتوصيل المنتجات لعنوانك (<span className="text-yellow-400">{customerAddress}</span>) يرجى الضغط على الزر الأخضر بالأسفل لإرسال الفاتورة عبر واتساب الإدارة الفني لمتجر ومستودع الذيباني!
                  </p>
                </div>

                {/* PROMINENT DIRECT WHATSAPP BUTTON REDIRECTION */}
                <div className="py-2">
                  <a
                    href={createdOrderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => {
                        finalReset();
                      }, 1000);
                    }}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-555 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/10 transition-all transform active:scale-95 text-xs animate-bounce"
                    id="whatsapp-redirect-anchor"
                  >
                    <Smartphone className="w-5 h-5 text-white" />
                    <span>إرسال وتأكيد الطلب الفوري عبر واتساب (رسالة جاهزة) 📲</span>
                  </a>
                </div>

                <div className="bg-[#060b18] p-4 rounded-2xl border border-blue-900/40 text-right text-[10px] space-y-1 text-slate-400">
                  <p>قيمة عناصر السلة: <strong>{formatPrice(totalPriceOfCart)}</strong></p>
                  <p>المبلغ الإجمالي الكلي للفاتورة: <strong className="text-yellow-400">{formatPrice(finalBillAmount)}</strong></p>
                </div>

                <button
                  onClick={finalReset}
                  className="w-full py-2.5 bg-blue-950 text-slate-400 hover:text-white rounded-xl text-[10px] transition-colors cursor-pointer"
                  id="checkout-complete-success-btn"
                >
                  تخطي وإغلاق النافذة
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MOBILE PERSISTENT QUICK CART PANEL */}
      {cart.length > 0 && currentTab === "store" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1329]/95 backdrop-blur-md border-t border-yellow-500/30 p-4 shadow-xl flex items-center justify-between lg:hidden transition-all animate-slide-in-up" id="mobile-sticky-checkout-trigger-bar" dir="rtl">
          <div className="flex flex-col items-start text-right">
            <span className="text-[10px] text-slate-400 font-bold">إجمالي السلة ({cart.reduce((s, i) => s + i.quantity, 0)} قطع):</span>
            <span className="text-yellow-405 font-black text-sm">{formatPrice(finalBillAmount)}</span>
          </div>
          <button
            onClick={() => {
              setCheckoutStep("details");
              setCheckoutSubStep(1);
              setIsCheckoutOpen(true);
              setCustomerName(localStorage.getItem("customer_name") || "");
              const pm = getPaymentMethods();
              if (pm.length > 0) {
                setPaymentMethod(pm[0]);
              }
            }}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-yellow-450 hover:from-yellow-400 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>إكمال الطلب وحجز البضائع ◀</span>
          </button>
        </div>
      )}

      {/* GLOWING REAL-TIME TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none" id="toasts-portal">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-slide-in-right ${
              toast.type === "success"
                ? "bg-[#0b1329]/95 border-emerald-500/30 text-white shadow-emerald-950/10"
                : toast.type === "warning"
                ? "bg-[#0b1329]/95 border-amber-500/30 text-white shadow-amber-950/10"
                : "bg-[#0b1329]/95 border-blue-500/30 text-white shadow-blue-950/10"
            }`}
            id={`toast-item-${toast.id}`}
          >
            {toast.productImage && (
              <img
                src={toast.productImage}
                alt=""
                className="w-10 h-10 object-cover rounded-xl border border-blue-950 flex-shrink-0"
              />
            )}
            <div className="flex-1 text-right" dir="rtl">
              <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* CORE FOOTER */}
      <footer className="bg-[#0b1329] border-t border-yellow-500/20 mt-16 pb-24 lg:pb-8 pt-8" id="store-main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-4" dir="rtl">
          <p>© {new Date().getFullYear()} متجر ومستودع الذيباني الفاخر VIP. حقوق البرمجة والعمليات التامة محفوظة.</p>
          <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-2 text-[10px] text-slate-500">
            <span>الرقم المعتمد: {whatsappNumber}</span>
            <span>•</span>
            <span>الذكاء الاصطناعي مدعوم بنماذج Gemini لتمكين العمليات الذكية الفورية</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentTab("admin");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 hover:text-yellow-400 border border-yellow-500/20 rounded-xl transition-all cursor-pointer font-bold inline-flex items-center gap-1"
            >
              <span>لوحة الإدارة الفنية والتحكم 🔐</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
