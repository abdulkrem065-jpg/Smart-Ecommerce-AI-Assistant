import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Trophy, ShoppingBag } from "lucide-react";
import { CarouselSlide } from "../types";

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

interface PromoCarouselProps {
  slides?: CarouselSlide[];
  onSetActiveTab: (tab: any) => void;
}

export function PromoCarousel({ slides = [], onSetActiveTab }: PromoCarouselProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
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
