import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Trophy, ShoppingBag } from "lucide-react";
import { CarouselSlide } from "../core/types";

export const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "1",
    title: "بوابة الشحن الفوري للألعاب والشدات المباشرة 🎮",
    description: "اشحن شدات ببجي (UC) وجواهر فري فاير فورياً بأرخص الأسعار عبر رقم المعرف بموثوقية 100% وبسرعة البرق!",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
    badge: "شحن ألعاب فوري ⚡",
    actionText: "تصفح منتجات الشحن 👇",
    actionType: "store"
  },
  {
    id: "2",
    title: "قسم المنتجات الاستهلاكية والبهارات والتموين الفاخر 🍯",
    description: "نوفر لكم أجود أنواع العسل اليمني، البهارات الفاخرة المشكلة، والمكسرات المباشرة من مستودعاتنا لبيوتكم مباشرة.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000",
    badge: "توابل وتموين رقي 🌶️",
    actionText: "طلب التموين الفاخر",
    actionType: "store"
  },
  {
    id: "3",
    title: "تحدث مع مستشار الذيباني الذكي المدعوم بالذكاء الاصطناعي ✨",
    description: "اسأله عن أفضل عروض شحن شدات البكجات، أو مكونات البهارات، أو احسب قيمة مشترياتك في دقيقة واحدة بحرية تامة!",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    badge: "مستشار ذكي VIP 🤖",
    actionText: "ابدأ دردشة AI فوراً",
    actionType: "ai"
  }
];

export const NICHE_DEFAULT_SLIDES: Record<string, CarouselSlide[]> = {
  game: [
    {
      id: "game-1",
      title: "بوابة الشحن الفوري للألعاب والشدات المباشرة 🎮",
      description: "اشحن شدات ببجي (UC) وجواهر فري فاير فورياً بأرخص الأسعار عبر رقم المعرف بموثوقية 100% وبسرعة البرق!",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      badge: "شحن ألعاب فوري ⚡",
      actionText: "تصفح منتجات الشحن 👇",
      actionType: "store"
    },
    {
      id: "game-2",
      title: "بطاقات الهدايا والاتصالات والبطاقات الرقمية الكودية 💳",
      description: "تسوق بطاقات آيتونز، جوجل بلاي، بلايستيشن، بطاقات الاتصال والإنترنت بأسعار الجملة وتوصيل فوري برسالة.",
      image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=1000",
      badge: "بطاقات رقمية 💳",
      actionText: "تصفح البطاقات المتاحة",
      actionType: "store"
    },
    {
      id: "game-3",
      title: "تحدث مع مستشار الشحن الذكي بالذكاء الاصطناعي ✨",
      description: "اسأله عن خطوات الشحن، أسعار البطاقات، أو احسب قيمة طلبك في ثانية واحدة بحرية تامة وموثوقية!",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      badge: "مستشار ذكي VIP 🤖",
      actionText: "ابدأ دردشة AI فوراً",
      actionType: "ai"
    }
  ],
  pharmacy: [
    {
      id: "ph-1",
      title: "صيدلية العناية والشفاء السحابية المتكاملة 🧪",
      description: "توفير فوري لكافة الأدوية، مستحضرات العناية بالبشرة، المكملات الغذائية، والأجهزة الطبية المنزلية المعتمدة بتنسيق دقيق.",
      image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1000",
      badge: "رعاية وعناية فورية 🩺",
      actionText: "تصفح المستلزمات الطبية 👇",
      actionType: "store"
    },
    {
      id: "ph-2",
      title: "فيتامينات ومكملات غذائية لدعم مناعة الجسم والنشاط 🌿",
      description: "أجود الفيتامينات الأصلية الموثوقة والمستخلصات الطبيعية لتعزيز صحتك وطاقتك البدنية اليومية بأقصى درجات الأمان والفاعلية.",
      image: "https://images.unsplash.com/photo-1471864195257-b18a7300481e?auto=format&fit=crop&q=80&w=1000",
      badge: "مكملات أصلية 100% 🌿",
      actionText: "تسوق الفيتامينات الآن",
      actionType: "store"
    },
    {
      id: "ph-3",
      title: "المستشار الطبي والدوائي الذكي بالذكاء الاصطناعي 🤖",
      description: "مساعدك الطبي الذكي يساعدك في معرفة فوائد المستحضرات، الفيتامينات، وإرشادات الاستخدام الموثوقة فوراً وبكل سهولة.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
      badge: "استشارة طبية ذكية ✨",
      actionText: "استشر طبيب الـ AI الآن",
      actionType: "ai"
    }
  ],
  supermarket: [
    {
      id: "sm-1",
      title: "تموين الأسرة والمواد الاستهلاكية والغذائية الطازجة 🛒",
      description: "تسوق كافة مستلزمات السوبرماركت، الألبان والأجبان، الخضار الطازجة مع توصيل فوري فائق السرعة لباب منزلك!",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
      badge: "توصيل عالي السرعة ⚡",
      actionText: "تصفح السلع الفورية 👇",
      actionType: "store"
    },
    {
      id: "sm-2",
      title: "أجود أنواع العسل والبهارات والبن اليمني الأصيل 🍯",
      description: "نوفر لكم خلاصة العسل الطبيعي، البهارات الفاخرة المشكلة والبن الملكي مباشرة بمواصفات وجودة تضمن رضاكم الطاهي.",
      image: "https://images.unsplash.com/photo-1596515431050-829dce1d45d2?auto=format&fit=crop&q=80&w=1000",
      badge: "نكهات التراث الأصيلة 🌶️",
      actionText: "طلب التموين والبهارات",
      actionType: "store"
    },
    {
      id: "sm-3",
      title: "مساعد الطهي وقائمة المشتريات بالذكاء الاصطناعي 🤖",
      description: "احصل فوراً على أفكار طبخ ذكية بمنتجات السوبرماركت، وحافظ على ميزانيتك بحساب ذكي بمساعدة مستشاره الحركي الموجه.",
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=1000",
      badge: "وصفات طهي ذكية ✨",
      actionText: "اسأل طباخ الـ AI الآن",
      actionType: "ai"
    }
  ],
  school: [
    {
      id: "sc-1",
      title: "المنصة والأكاديمية التعليمية الذكية الفاخرة 📚",
      description: "نوفر دورات خصوصية، مراجعات مكثفة للثانوي والمراحل الأخرى، وتيسير التعلم لكافة الطلاب بتميز وجودة مذهلة وعالية.",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000",
      badge: "كفاءة وأكاديمية 🎓",
      actionText: "تصفح المناهج والحلول",
      actionType: "store"
    },
    {
      id: "sc-2",
      title: "أقوى ملازم التلخيص ومراجعة الاختبارات الدورية 📝",
      description: "حقائب تعليمية شاملة، ملفات PDF تفاعلية، وقوانين الفيزياء والكيمياء المبسطة برسوم بصرية لتقوية مهارات الاستيعاب السريع.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
      badge: "مراجعات نموذجية ✔️",
      actionText: "ابدأ تقوية مستواك",
      actionType: "store"
    },
    {
      id: "sc-3",
      title: "توجيه وتدريس خصوصي ذكي مع المعلم المساعد AI 🤖",
      description: "مساعدك التعليمي متاح 24 ساعة بميزة توليد أسئلة اختبار وشرح معقد المسائل خطوة بخطوة باللغتين العربية والإنكليزية بطلاقة.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
      badge: "مستشارك التعليمي ✨",
      actionText: "اسأل معلّم الـ AI الآن",
      actionType: "ai"
    }
  ],
  tailor: [
    {
      id: "tl-1",
      title: "تفصيل وخياطة الأثواب الرجالية الفخمة بدار الذيباني 🪡",
      description: "نصنع أثواباً ملكية مخصصة ومصاغة بدقة وفق مقاساتك المسجلة باستخدام أفخر الأقمشة اليابانية الأصلية المترفة والراقية.",
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1000",
      badge: "الأناقة الملكية والتميز 👑",
      actionText: "احجز ثوبك المخصص 👇",
      actionType: "store"
    },
    {
      id: "tl-2",
      title: "طاقات قماش ياباني وإنجليزي صيفي وشتوي مستورد 🧵",
      description: "أقمشة رسمية فاخرة وخيوط رويال وأزرار بماء الذهب، اختر اللون والمقاس للحصول على مظهر خارق النقاء وعالي الجودة.",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000",
      badge: "خامات رويال نخبة ✨",
      actionText: "تصفح مستلزمات الخياطة",
      actionType: "store"
    },
    {
      id: "tl-3",
      title: "مصمم الأزياء والمستشار الشخصي للأناقة بالذكاء الاصطناعي 🤖",
      description: "مساعدك مصمم الأزياء الذكي يقترح عليك أنسب الأطقم، ويحسب مقاسات جسمك، وينظم مواعيد تسليم الخياطة بمرونة وسهولة فائقة.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000",
      badge: "مصمم أزياء ذكي 🪡",
      actionText: "دردش مع خياط الـ AI",
      actionType: "ai"
    }
  ],
  legal: [
    {
      id: "lg-1",
      title: "مكتب الذيباني للاستشارات القانونية وأعمال المحاماة ⚖️",
      description: "نقدم حلولاً نظامية وعقوداً قوية، مراجعة وتدقيق اللوائح والدفاع في القضايا العمالية والتجارية والاستثمارية باحترافية كاملة.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000",
      badge: "حماية قانونية متكاملة ⚖️",
      actionText: "طلب حجز استشارة للوائح 👇",
      actionType: "store"
    },
    {
      id: "lg-2",
      title: "صياغة وتوثيق العقود المعتمدة للشركات والمؤسسات 📜",
      description: "اتفاقيات شراكة، عقود توريد وحوكمة نظامية تضمن كل شاردة وواردة لحماية حقوقك ومكافحة المخاطر القانونية والمالية.",
      image: "https://images.unsplash.com/photo-1450175847920-7244ccde2365?auto=format&fit=crop&q=80&w=1000",
      badge: "اتفاقيات ومواثيق مبرمة 📜",
      actionText: "اطلب صياغة عقدك الآمن",
      actionType: "store"
    },
    {
      id: "lg-3",
      title: "المشرّع والمستشار القانوني اللحظي بالذكاء الاصطناعي 🤖",
      description: "اطرح أي سؤال قضائي، عمالي أو استشاري والتمس فوراً تحليلاً توجيهياً نظامياً أوليًا بسرية مطلقة طوال اليوم.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
      badge: "مستشارك القانوني AI ✨",
      actionText: "تحدث مع مستشار الـ AI",
      actionType: "ai"
    }
  ],
  consulting: [
    {
      id: "cs-1",
      title: "مجموعة الذيباني للاستشارات الاقتصادية وإدارة الشركات 📊",
      description: "نرسم لك خارطة الطريق: دراسات جدوى اقتصادية، خطط خفض تكاليف والهدر المالي، وإعادة الهيكلة والتطوير المؤسسي كلياً.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
      badge: "الريادة والتطوير الإستراتيجي 📊",
      actionText: "طلب دراسة واستشارة 👇",
      actionType: "store"
    },
    {
      id: "cs-2",
      title: "دراسات جدوى مالية وتسويقية متكاملة لمشروعك الناشئ 📈",
      description: "احصل على دراسة رائدة تحدد فيها تكاليف التشغيل السنوية، التدفق النقدي، مخاطر الاستثمار ونقطة التعادل للمستثمرين ورجال الأعمال.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
      badge: "دراسات جدوى رائدة 🚀",
      actionText: "اطلب باقة الجدوى الاقتصادية",
      actionType: "store"
    },
    {
      id: "cs-3",
      title: "مستشار النمو وتسعير الخدمات الذكي بالذكاء الاصطناعي 🤖",
      description: "مساعدك الإداري المالي لابتكار خطة عمل احترافية، تنظيم هامش الربح واحتساب العوائد التقديرية بدقائق ذكية ومقنعة.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
      badge: "حلول أعمال ذكية ✨",
      actionText: "خطط واحسب مع الـ AI",
      actionType: "ai"
    }
  ],
  hyper: [
    {
      id: "hy-1",
      title: "هايبر ماركت ومجمع الخدمات الشامل لآل الذيباني 🛒🎮⚡",
      description: "منصتك الشاملة والآمنة: تسوق التموين المنزلي، شحن الألعاب الفوري بالمعرف، وشراء بطاقات الاتصالات الرقمية في واجهة واحدة وموحدة!",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      badge: "مجمع خدمات متكامل ⚡",
      actionText: "تصفح الهايبر ماركت 👇",
      actionType: "store"
    },
    {
      id: "hy-2",
      title: "قسم المنتجات الغذائية الفاخرة والبهارات والبن اليمني الأصيل 🌾",
      description: "أرز بسمتي فخيم، بن يمني مطحون طازج ومستلزمات تموينية استثنائية لجميع البيوت والمطاعم الراقية مع توصيل عالي السرعة.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
      badge: "تموين غذائي فخر 🛡️",
      actionText: "زيارة مستودع التموين",
      actionType: "store"
    },
    {
      id: "hy-3",
      title: "مستشار ومساعد مجمع الخدمات الذكي بالذكاء الاصطناعي 🤖",
      description: "تحاور مع الـ AI لشحن البطاقات والألعاب، حجز استشارات مقاسات، ومعرفة المكونات الطازجة لأي بهارات وتوابل بذكاء وسرعة فائقة!",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      badge: "مستشاري الذكي الشامل ✨",
      actionText: "تحدث مع المساعد الذكي الآن",
      actionType: "ai"
    }
  ]
};

interface PromoCarouselProps {
  slides?: CarouselSlide[];
  onSetActiveTab: (tab: any) => void;
  activeNicheId?: 'game' | 'pharmacy' | 'supermarket' | 'school' | 'tailor' | 'legal' | 'consulting' | 'hyper';
}

export function PromoCarousel({ slides = [], onSetActiveTab, activeNicheId = 'game' }: PromoCarouselProps) {
  // Compute best active slides
  const activeSlides = React.useMemo(() => {
    // 1. If explicit slides are stored/passed, let's look at them
    if (slides && slides.length > 0) {
      // If the passed slides represent the old base default slides but the active niche has changed to something else,
      // override them completely with the beautiful niche-aligned slider cards.
      const hasSpicesText = slides.some(s => s.description?.includes("البهارات") || s.title?.includes("البهارات") || s.badge?.includes("توابل"));
      const hasGamesText = slides.some(s => s.description?.includes("ببجي") || s.title?.includes("ببجي") || s.badge?.includes("شحن ألعاب"));
      
      const isPharmacyNiche = activeNicheId === 'pharmacy';
      const isSchoolNiche = activeNicheId === 'school';
      const isTailorNiche = activeNicheId === 'tailor';
      const isLegalNiche = activeNicheId === 'legal';
      const isConsultingNiche = activeNicheId === 'consulting';
      
      const shouldOverrideLegacy = (isPharmacyNiche || isSchoolNiche || isTailorNiche || isLegalNiche || isConsultingNiche) && (hasSpicesText || hasGamesText);
      
      if (!shouldOverrideLegacy) {
        return slides;
      }
    }
    // 2. Return fallback slides matched perfectly for this active niche template 
    return NICHE_DEFAULT_SLIDES[activeNicheId] || NICHE_DEFAULT_SLIDES['game'] || DEFAULT_SLIDES;
  }, [slides, activeNicheId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Reset index in case active slides length changed
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides, currentIndex]);

  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, activeSlides.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleAction = (type: "ai" | "store") => {
    if (type === "ai") {
      onSetActiveTab("ai");
    } else {
      onSetActiveTab("store");
      // Scroll smoothly to catalog
      const catalogEl = document.getElementById("catalog-search-input");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-[#0b1329] h-[210px] sm:h-[280px] md:h-[320px] shadow-2xl flex flex-col group"
      dir="rtl"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      id="promo-carousel-container"
    >
      {/* Slides tracks with smooth absolute positioning and animation */}
      {activeSlides.map((slide, idx) => {
        const isCurrent = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out flex flex-col justify-end ${
              isCurrent 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-95 pointer-events-none z-0"
            }`}
          >
            {/* Background image with smooth lazy loaded looks & dark elegant gradient scrim */}
            <div className="absolute inset-0 select-none overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform scale-105 transition-all duration-[6000ms] ease-out hover:scale-100 filter brightness-[0.38] contrast-[1.05]"
              />
              {/* Rich double-layered gradient to ensure flawless legibility of Arabic typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-[#0b1329]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060b18]/60 via-[#060b18]/15 to-transparent" />
            </div>

            {/* Content box */}
            <div className="relative z-10 p-4 sm:p-7 md:p-8 max-w-2xl text-right space-y-2 sm:space-y-3.5 select-none text-white">
              
              {/* Floating premium badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/90 text-blue-970 text-[9px] sm:text-xs font-black rounded-full shadow-lg border border-yellow-400/20">
                <Sparkles className="w-3 h-3 animate-spin duration-[4000ms]" />
                <span>{slide.badge}</span>
              </div>

              {/* Title & Description with modern layout */}
              <h3 className="text-sm sm:text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white via-slate-100 to-yellow-100 tracking-tight leading-snug sm:leading-normal">
                {slide.title}
              </h3>

              <p className="text-[10px] sm:text-xs md:text-sm text-slate-300 leading-relaxed font-medium max-w-xl line-clamp-2 sm:line-clamp-none">
                {slide.description}
              </p>

              {/* Instant action call buttons */}
              <div className="pt-1.5 sm:pt-3">
                <button
                  onClick={() => handleAction(slide.actionType)}
                  className="px-4.5 py-1.5 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-blue-950 font-black text-[10px] sm:text-xs rounded-xl hover:from-yellow-450 hover:to-amber-450 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10"
                >
                  {slide.actionType === "ai" ? (
                    <Trophy className="w-3.5 h-3.5" />
                  ) : (
                    <ShoppingBag className="w-3.5 h-3.5" />
                  )}
                  <span>{slide.actionText}</span>
                </button>
              </div>

            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrow Controllers (hidden on mobile, revealed on hover on desktop) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-blue-950 transition-all cursor-pointer opacity-80 md:opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronRight className="w-5 h-5 pointer-events-none" />
          </button>

          <button
            onClick={handleNext}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-blue-950 transition-all cursor-pointer opacity-80 md:opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronLeft className="w-5 h-5 pointer-events-none" />
          </button>
        </>
      )}

      {/* Visual Navigation Progress Dots indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2">
          {activeSlides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                  isActive ? "w-6.5 bg-yellow-400" : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
