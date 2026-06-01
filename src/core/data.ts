import { Product, StoreCategory } from './types';

export interface NicheConfig {
  id: string; // Dynamic ID, e.g. hyper_games, smart_pharmacy
  name: string; // Dynamic Title
  subtitle: string;
  themeColor: string; // Tailwind accent base color
  badgeText: string;
  accentClass: string; // Tailwind text color class
  backgroundClass: string; // Tailwind background gradient top color
  gradientClass: string; // gradient classes
  iconName: string;
  categories: StoreCategory[];
  products: Product[];
  aiBehavior: string; // AI personality outline
}

// Initial Templates Definition matching exactly user specifications + original modules
const DEFAULT_TEMPLATES: NicheConfig[] = [
  {
    id: 'hyper_games',
    name: '🎮 Aldhibani Hyper Games & VIP Digital Services',
    subtitle: 'شحن فوري بالمعرف للألعاب والبطاقات الرقمية ومستلزمات الجيمنج',
    aiBehavior: 'Digital & gaming top-up consultant.',
    themeColor: 'amber',
    badgeText: 'خدمات الألعاب والشحن الفوري',
    accentClass: 'text-yellow-400',
    backgroundClass: 'from-[#030a1c] to-[#01030a]',
    gradientClass: 'from-amber-500 to-yellow-500',
    iconName: 'Gamepad2',
    categories: [
      { id: 'cat-game-1', name: 'شحن فوري بالمعرّف 🎮', englishName: 'instant_charge' },
      { id: 'cat-game-2', name: 'بطاقات الهدايا الرقمية 💳', englishName: 'digital_gift_cards' },
      { id: 'cat-game-3', name: 'مستلزمات وإكسسوارات الجيمنج ⚡', englishName: 'gaming_gear' }
    ],
    products: [
      {
        id: 'p-game-1',
        name: 'شحن مجوهرات فري فاير (100+10 جوهرة فوري) 💎',
        description: 'شحن رسمي آمن وسريع عبر المعرف المباشر للّاعب، متاح 24 ساعة.',
        category: 'شحن فوري بالمعرّف 🎮',
        price: 4.5,
        price_sar: 4.5,
        price_yer: 1800,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
        stock: 500,
        code: 'FF100',
        isApiProduct: true,
        apiRequiredField: 'رقم معرف اللاعب أو الأيدي (Player ID)',
        apiProvider: 'likecard',
        apiProductId: '840003'
      },
      {
        id: 'p-game-2',
        name: 'شحن شدات ببجي موبايل (60 شدّة فوري) 🔫',
        description: 'شحن رسمي فوري ومعتمد على حسابك مباشرة بالمعرّف.',
        category: 'شحن فوري بالمعرّف 🎮',
        price: 5.0,
        price_sar: 5.0,
        price_yer: 2000,
        image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=500&q=80',
        stock: 450,
        code: 'PUBG60',
        isApiProduct: true,
        apiRequiredField: 'رقم الأيدي للّاعب (Character ID)',
        apiProvider: 'likecard',
        apiProductId: '850020'
      },
      {
        id: 'p-game-3',
        name: 'سماعة رأس قيمنق المحيطية النخبة HyperX VIP 🎧',
        description: 'سماعة VIP بصوت محيطي نقي وعزل فائق مريحة جداً للجلسات الطويلة.',
        category: 'مستلزمات وإكسسوارات الجيمنج ⚡',
        price: 120.0,
        price_sar: 120.0,
        price_yer: 48000,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
        stock: 25,
        code: 'HPX-SP'
      }
    ]
  },
  {
    id: 'smart_pharmacy',
    name: '💊 Aldhibani Smart Pharmacy & Warehouse',
    subtitle: 'استشارة طبية ذكية وتوفير أدوية معتمدة ومكملات وأجهزة رعاية منزلية',
    aiBehavior: 'Medical, pharmaceutical, and inventory advisor.',
    themeColor: 'teal',
    badgeText: 'العناية والصحة الرقمية',
    accentClass: 'text-teal-400',
    backgroundClass: 'from-[#021315] to-[#000506]',
    gradientClass: 'from-teal-500 to-emerald-500',
    iconName: 'Pills',
    categories: [
      { id: 'cat-ph-1', name: 'أدوية ووصفات علاجية 💊', englishName: 'medications' },
      { id: 'cat-ph-2', name: 'فيتامينات ومكملات غذائية ✨', englishName: 'vitamins' },
      { id: 'cat-ph-3', name: 'أجهزة فحص ومعدات منزلية 🌡️', englishName: 'medical_devices' }
    ],
    products: [
      {
        id: 'p-ph-1',
        name: 'جهاز قياس السكر بالدم الألماني الذكي 🩸',
        description: 'جهاز فوري دقيق جداً مصادق عليه طبياً، يقدم النتيجة خلال 5 ثوانٍ مع ذاكرة حفظ.',
        category: 'أجهزة فحص ومعدات منزلية 🌡️',
        price: 135.0,
        price_sar: 135.0,
        price_yer: 54000,
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
        stock: 35,
        code: 'GLUCO-DE'
      },
      {
        id: 'p-ph-2',
        name: 'فيتامينات مالتي-فيتامين VIP المتكاملة 🌿',
        description: 'حبوب غنية بـ 24 عنصراً وفيتامينات أساسية لدعم المناعة والنشاط البدني الطبيعي.',
        category: 'فيتامينات ومكملات غذائية ✨',
        price: 85.0,
        price_sar: 85.0,
        price_yer: 34000,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80',
        stock: 60,
        code: 'VIT-VIP'
      },
      {
        id: 'p-ph-3',
        name: 'لوشن ترطيب البشرة سيرافي ذو الحماية الثلاثية 🧴',
        description: 'تركيبة رائدة بخلاصة السيراميد الطبيعي وحمض الهيالورونيك لترطيب عميق يدوم طويلاً.',
        category: 'أدوية ووصفات علاجية 💊',
        price: 72.0,
        price_sar: 72.0,
        price_yer: 28800,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
        stock: 45,
        code: 'CERAVE-HD'
      }
    ]
  },
  {
    id: 'luxury_tailoring',
    name: '🪡 Aldhibani Luxury Tailoring & Fashion',
    subtitle: 'تثبيت وحفظ مقاساتك وصياغة أثواب وأقمشة رجالية يابانية فخمة بمواصفات ملكية',
    aiBehavior: 'Fashion design, fabrics, and measurement consultant.',
    themeColor: 'amber',
    badgeText: 'تفصيل وتصميم الأزياء والملابس',
    accentClass: 'text-amber-500',
    backgroundClass: 'from-[#140b03] to-[#040200]',
    gradientClass: 'from-amber-600 to-orange-500',
    iconName: 'Scissors',
    categories: [
      { id: 'cat-tl-1', name: 'تفصيل وخياطة أثواب مخصصة 🧵', englishName: 'custom_tailor' },
      { id: 'cat-tl-2', name: 'طاقات وقماش فخم مستورد 🥻', englishName: 'fabrics' },
      { id: 'cat-tl-3', name: 'مستلزمات وأزرار ملكية فاخرة 🎖️', englishName: 'royal_accessories' }
    ],
    products: [
      {
        id: 'p-tl-1',
        name: 'تفصيل ثوب ياباني لوكس (درع ملكي سبيشال) 🪡',
        description: 'ثوب رجالي يتناسب مع مقاسك المسجل. يتم التفصيل من قماش تويوبو الياباني الفاخر بجلد ناعم صيفي أو شتوي.',
        category: 'تفصيل وخياطة أثواب مخصصة 🧵',
        price: 240.0,
        price_sar: 240.0,
        price_yer: 96000,
        image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&q=80',
        stock: 30,
        code: 'THOB-JAP',
        isApiProduct: true,
        apiRequiredField: 'رقم مقاسك المحفوظ أو اكتب (مقاساتي في الرسائل)'
      },
      {
        id: 'p-tl-2',
        name: 'طاقة قماش صوفي إنجليزي فخم (يكفي 5 أثواب) 🧵',
        description: 'قماش فاخر دافئ جداً مناسب للأجواء الباردة والشتوية، ألوان متعددة (كحلي، رمادي، رملي).',
        category: 'طاقات وقماش فخم مستورد 🥻',
        price: 450.0,
        price_sar: 450.0,
        price_yer: 180000,
        image: 'https://images.unsplash.com/photo-1524295981997-ec4f4e159675?w=500&q=80',
        stock: 12,
        code: 'WOOL-ENG'
      },
      {
        id: 'p-tl-3',
        name: 'باقة أزرار رويال نحاسية مطليّة بماء الذهب 🎖️',
        description: 'طقم أزرار من النحاس الخالص المقاوم للصدأ بشعار ملكي مصمم خصيصاً لأصحاب الفخامة والذوق الرفيع.',
        category: 'مستلزمات وأزرار ملكية فاخرة 🎖️',
        price: 60.0,
        price_sar: 60.0,
        price_yer: 24000,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80',
        stock: 80,
        code: 'BTN-GOLD'
      }
    ]
  },
  {
    id: 'hypermarket_supply',
    name: '🛒 Aldhibani Hypermarket & Central Supply',
    subtitle: 'خضار وفواكه طازجة ولحوم ومواد أساسية وتوصيل سريع لباب منزلك والبهارات',
    aiBehavior: 'Grocery, spices, shopping, and home supply assistant.',
    themeColor: 'emerald',
    badgeText: 'السلع والتموين والخدمات',
    accentClass: 'text-emerald-400',
    backgroundClass: 'from-[#031c0a] to-[#000502]',
    gradientClass: 'from-emerald-500 to-green-500',
    iconName: 'ShoppingBag',
    categories: [
      { id: 'cat-sm-1', name: 'مواد تموينية أساسية 🌾', englishName: 'staples' },
      { id: 'cat-sm-2', name: 'البان وأجبان ومبردات 🧀', englishName: 'dairy' },
      { id: 'cat-sm-3', name: 'خضار فواكه ولحوم طازجة 🥩', englishName: 'fresh_foods' }
    ],
    products: [
      {
        id: 'p-sm-1',
        name: 'أرز بسمتي الشعلان الفاخر (وزن 5 كجم) 🌾',
        description: 'أرز سيلا بسمتي ذو الحبة الطويلة، درجة أولى، طعم تقليدي شهي لا يقاوم للوجبات العائلية الفخمة.',
        category: 'مواد تموينية أساسية 🌾',
        price: 45.0,
        price_sar: 45.0,
        price_yer: 18000,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
        stock: 120,
        code: 'RICE-SHL'
      },
      {
        id: 'p-sm-2',
        name: 'قهوة بن يمني مطحون فاخر (وزن نصف كيلو) ☕',
        description: 'قهوة يمنية أصيلة بخلاصة الهيل والزنجبيل والبهارات العربية العطرة المصنوعة يدوياً.',
        category: 'خضار فواكه ولحوم طازجة 🥩',
        price: 65.0,
        price_sar: 65.0,
        price_yer: 26050,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
        stock: 80,
        code: 'YEM-COFFEE'
      },
      {
        id: 'p-sm-3',
        name: 'زيت الزيتون البكر الممتاز عضوي (1 لتر) 🫒',
        description: 'عصرة أولى على البارد، صحي ونقي 100% مستورد من أجود المزارع الجبلية العالية.',
        category: 'مواد تموينية أساسية 🌾',
        price: 36.0,
        price_sar: 36.0,
        price_yer: 14400,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
        stock: 55,
        code: 'OLIVE-OIL'
      }
    ]
  },
  {
    id: 'electronics_techno',
    name: '⚡ Aldhibani Techno for Electronics & Maintenance',
    subtitle: 'أجهزة إلكترونية حديثة، صيانة فورية، قطع غيار ذكية وتمديدات معتمدة بضمان',
    aiBehavior: 'Technical support, hardware, and electronics maintenance expert.',
    themeColor: 'blue',
    badgeText: 'صيانة وتجهيزات إلكترونية للورش والمنزل',
    accentClass: 'text-cyan-400',
    backgroundClass: 'from-[#03152d] to-[#01040f]',
    gradientClass: 'from-blue-500 to-cyan-500',
    iconName: 'Cpu',
    categories: [
      { id: 'cat-el-1', name: 'خدمات الصيانة والتشخيص 🛠️', englishName: 'maintenance' },
      { id: 'cat-el-2', name: 'قطع غيار وإلكترونيات ⚡', englishName: 'electronics' }
    ],
    products: [
      {
        id: 'p-el-1',
        name: 'جهاز لحام الكترونيات ومكواة حرارية تخصصية ⚡',
        description: 'ذات تحكم دقيق بالحرارة وشاشة رقمية من قطعات الصيانة الممتازة للدوائر وإلكترونيات الألعاب والاتصالات.',
        category: 'قطع غيار وإلكترونيات ⚡',
        price: 45.0,
        price_sar: 45.0,
        price_yer: 18000,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80',
        stock: 12,
        code: 'WELD-DIGI'
      },
      {
        id: 'p-el-2',
        name: 'جهاز قياس كهربائي رقمي (Multimeter Pro) 🌡️',
        description: 'جهاز احترافي لفحص التوصيلات الكهربائية والجهد والمقاومة في الورش والمنازل ومقاومة الأعطال بدقة.',
        category: 'قطع غيار وإلكترونيات ⚡',
        price: 25.0,
        price_sar: 25.0,
        price_yer: 10000,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
        stock: 30,
        code: 'MULTI-METER'
      },
      {
        id: 'p-el-3',
        name: 'باقة تشخيص وصيانة تمديدات كهربائية متكاملة 🛠️',
        description: 'خدمة مهندس صيانة لزيارة الموقع واكتشاف مشكلات الإضاءة والتحكم والأجهزة والديكورات الكهربية وسماعات الدي جي.',
        category: 'خدمات الصيانة والتشخيص 🛠️',
        price: 80.0,
        price_sar: 80.0,
        price_yer: 32000,
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500&q=80',
        stock: 100,
        isApiProduct: true,
        apiRequiredField: 'نوع العطل بالتفصيل بالإضافة لعنوانك والمنطقة'
      }
    ]
  },
  {
    id: 'legal_consulting',
    name: '⚖️ Aldhibani Legal Consultations & Law Firm',
    subtitle: 'صياغة عقود تجارية ورسمية، تصفية شركات، ومساعد وتوثيق قانوني فوري 24 ساعة',
    aiBehavior: 'General legal terminology, documentation, and consulting advisor.',
    themeColor: 'cyan',
    badgeText: 'المظلة والاستشارة القانونية والأمان',
    accentClass: 'text-cyan-400',
    backgroundClass: 'from-[#010c1f] to-[#00040a]',
    gradientClass: 'from-blue-600 to-cyan-500',
    iconName: 'Scale',
    categories: [
      { id: 'cat-lg-1', name: 'استشارات قانونية تخصصية ⚖️', englishName: 'consultations' },
      { id: 'cat-lg-2', name: 'صياغة ومراجعة العقود والاتفاقيات 📜', englishName: 'contracts' },
      { id: 'cat-lg-3', name: 'تجهيز رخص وتأسيس وتصفية شركات 🏗️', englishName: 'licensing' }
    ],
    products: [
      {
        id: 'p-lg-1',
        name: 'صياغة ومراجعة عقد شراكة تجارية متكامل 📜',
        description: 'تجهيز وصياغة عقد قانوني مهني يحمي الشركاء ويحدد الحصص والأرباح والالتزامات حسب لوائح القوانين الصارمة.',
        category: 'صياغة ومراجعة العقود والاتفاقيات 📜',
        price: 350.0,
        price_sar: 350.0,
        price_yer: 140000,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
        stock: 99,
        code: 'CNTRCT-SH'
      },
      {
        id: 'p-lg-2',
        name: 'جلسة استشارة قانونية مهنيّة (ساعة كاملة عبر زووم) ⚖️',
        description: 'جلسة رسمية مع محامٍ مرخص لمناقشة جميع مستنداتك وتوضيح موقفك القضائي وصيغ الدفاع باحتراف.',
        category: 'استشارات قانونية تخصصية ⚖️',
        price: 150.0,
        price_sar: 150.0,
        price_yer: 60000,
        image: 'https://images.unsplash.com/photo-1450175847920-7244ccde2365?w=500&q=80',
        stock: 50,
        isApiProduct: true,
        apiRequiredField: 'مجال الاستشارة (مثال: عمالية، عقارية، تجارية)'
      },
      {
        id: 'p-lg-3',
        name: 'تجهيز أوراق رخصة الاستثمار والشركات الأجنبية 🏦',
        description: 'باقة المتابعة الكاملة لوزارة التجارة وهيئة الاستثمار لتلقي السجل التجاري والختم والتراخيص بدون عناء.',
        category: 'تجهيز رخص وتأسيس وتصفية شركات 🏗️',
        price: 600.0,
        price_sar: 600.0,
        price_yer: 240000,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80',
        stock: 15,
        code: 'LIC-INVEST'
      }
    ]
  },
  {
    id: 'school',
    name: '🏫 Aldhibani Academic Academy & Tutoring',
    subtitle: 'دورات خصوصية، مناهج تخصصية، توليد اختبارات MCQ بذكاء الـ AI وتحسين أدائك الكلي',
    aiBehavior: 'Academic, educational, and exam tutor.',
    themeColor: 'indigo',
    badgeText: 'العلوم الأكاديمية والمناهج المعتمدة',
    accentClass: 'text-indigo-400',
    backgroundClass: 'from-[#090b1c] to-[#01020a]',
    gradientClass: 'from-indigo-500 to-violet-500',
    iconName: 'BookOpen',
    categories: [
      { id: 'cat-ed-1', name: 'كورسات وحصص تقوية 🧠', englishName: 'tutoring' },
      { id: 'cat-ed-2', name: 'دليل الاختبارات والمناهج 📝', englishName: 'curriculum' },
      { id: 'cat-ed-3', name: 'كتب وملازم علمية تلخيصية 📚', englishName: 'study_books' }
    ],
    products: [
      {
        id: 'p-ed-1',
        name: 'باقة تدريس خصوصي رياضيات وجبر للمرحلة الثانوية 📐',
        description: 'باقة دراسية ذكية تشمل 8 جلسات فلاش تفاعلية ومراجعة امتحانات مع اختبارات دورية بالذكاء الاصطناعي.',
        category: 'كورسات وحصص تقوية 🧠',
        price: 180.0,
        price_sar: 180.0,
        price_yer: 72000,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80',
        stock: 99,
        code: 'MATH-SEC',
        isApiProduct: true,
        apiRequiredField: 'رقم كود الطالب الأساسي للتقارير الدراسيّة'
      },
      {
        id: 'p-ed-2',
        name: 'الملف الشامل في أساسيات الفيزياء والـ كيمياء 🧪',
        description: 'ملزمة نموذجية ملخص تغطي كافة القوانين والشروحات البصرية المدهشة لتبسيط المواد الصعبة.',
        category: 'كتب وملازم علمية تلخيصية 📚',
        price: 45.0,
        price_sar: 45.0,
        price_yer: 18000,
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80',
        stock: 140,
        code: 'PHYS-CHEM'
      },
      {
        id: 'p-ed-3',
        name: 'دورة صيفية مكثفة لتعلم اللغة الإنكليزية والأيلتس 🌐',
        description: 'تطوير مخارج الحروف، التحدث بطلاقة، تدريب مكثف على أقسام الاستماع والكتابة مع مدرسين أجانب.',
        category: 'كورسات وحصص تقوية 🧠',
        price: 250.0,
        price_sar: 250.0,
        price_yer: 100000,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
        stock: 100,
        code: 'IELTS-CO'
      }
    ]
  },
  {
    id: 'consulting',
    name: '💼 Aldhibani Strategic Consulting & Management',
    subtitle: 'دراسات جدوى متكاملة، تقليص مصاريف تشغيلية بنسب فورية، وأتمتة إدارية شاملة',
    aiBehavior: 'Corporate operations and financial optimization expert.',
    themeColor: 'purple',
    badgeText: 'إعادة الهيكلة ونماذج الجدوى',
    accentClass: 'text-purple-400',
    backgroundClass: 'from-[#0b041c] to-[#010005]',
    gradientClass: 'from-purple-600 to-indigo-500',
    iconName: 'BarChart3',
    categories: [
      { id: 'cat-cs-1', name: 'دراسات الجدوى الاقتصادية 📈', englishName: 'feasibility' },
      { id: 'cat-cs-2', name: 'إعادة هيكلة وحطط تصفية الأعباء ⚙️', englishName: 'restructuring' },
      { id: 'cat-cs-3', name: 'برامج التدريب والتأهيل الإداري 🧑‍💼', englishName: 'training' }
    ],
    products: [
      {
        id: 'p-cs-1',
        name: 'دراسة جدوى تسويقية ومالية متكاملة لمشروع ناشئ 📈',
        description: 'دراسة شاملة تشمل حجم السوق المنافسين، الرسوم التشغيلية، الإيرادات المخططة، ومخارط الاستثمار ونقطة التعادل.',
        category: 'دراسات الجدوى الاقتصادية 📈',
        price: 500.0,
        price_sar: 500.0,
        price_yer: 200000,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
        stock: 99,
        code: 'FEAS-EASY'
      },
      {
        id: 'p-cs-2',
        name: 'استشارة هندسة التكاليف وخفض النفقات بنسبة 25%+ ⚙️',
        description: 'عمل دراسة تشغيلية لتحليل الهدر المالي وإلغاء الازدواج الإداري والمصاريف غير المبررة لتبني الرشاقة التنظيمية.',
        category: 'إعادة هيكلة وحطط تصفية الأعباء ⚙️',
        price: 380.0,
        price_sar: 380.0,
        price_yer: 152000,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80',
        stock: 45,
        code: 'COST-CUT'
      },
      {
        id: 'p-cs-3',
        name: 'برنامج تدريب الكادر والمشرفين على المبيعات الحديثة 🤵',
        description: 'تدريب احترافي متكامل يشمل تحسين معدل التحويل، تجنب رفض العملاء، مع أدوات المتابعة الذكية الكافية.',
        category: 'برامج التدريب والتأهيل الإداري 🧑‍💼',
        price: 320.0,
        price_sar: 320.0,
        price_yer: 128000,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80',
        stock: 30,
        code: 'TRAIN-SLS'
      }
    ]
  }
];

// In-place editable list of projects that components consume
export const NICHES: NicheConfig[] = [];

// Initialize functions to load/save from localStorage
export function initializeNiches() {
  if (typeof window === 'undefined') {
    NICHES.splice(0, NICHES.length, ...DEFAULT_TEMPLATES);
    return;
  }

  const saved = localStorage.getItem("store_editable_projects");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        NICHES.splice(0, NICHES.length, ...parsed);
        return;
      }
    } catch (e) {
      console.error("Failed to parse editable projects array:", e);
    }
  }

  // Fallback / Initial write of template array
  localStorage.setItem("store_editable_projects", JSON.stringify(DEFAULT_TEMPLATES));
  NICHES.splice(0, NICHES.length, ...DEFAULT_TEMPLATES);
}

// Save modified niches back to localStorage and keep memory in sync
export function saveNiches(updated: NicheConfig[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("store_editable_projects", JSON.stringify(updated));
  }
  NICHES.splice(0, NICHES.length, ...updated);
  
  // Dispatch dynamic custom event so parts of the React UI can listen and refresh instantly
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("niches-matrix-updated"));
  }
}

// Pre-call initializer
initializeNiches();
