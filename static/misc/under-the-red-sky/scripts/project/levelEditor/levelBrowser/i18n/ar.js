// Arabic (MSA) language strings for Level Browser

export default {
  // Header section
  header: {
    title: "مستويات الورشة",
    refresh: "تحديث",
    refreshTooltip: "إعادة تحميل العناصر المشترك بها",
    browseWorkshop: "تصفح الورشة",
    browseWorkshopTooltip: "فتح ورشة Steam",
    closeTooltip: "إغلاق",
  },

  // Search and filtering
  search: {
    placeholder: "ابحث عن مستويات...",
    advancedFiltersTooltip: "عوامل تصفية متقدمة",
    showingResults: "عرض {shown} من أصل {total} مستوى",
    subscribedCount: "{count} مستوى مشترك به",
    subscribedCountPlural: "{count} مستوى مشترك بها",
  },

  // Filter sections
  filters: {
    type: "النوع",
    singleLevel: "مستوى مفرد",
    levelPack: "حزمة مستويات",
    state: "الحالة",
    installed: "مُثبّت",
    downloading: "جارٍ التنزيل",
    updateAvailable: "تحديث متاح",
    notInstalled: "غير مُثبّت",
    difficulty: "الصعوبة",
    difficultyTo: "إلى",
    authorId: "معرّف المؤلف",
    authorPlaceholder: "معرّف Steam",
    add: "إضافة",
  },

  // Sort options
  sort: {
    label: "الترتيب:",
    alphabetical: "أبجدي",
    mostUpvoted: "الأكثر تصويتاً إيجابياً",
    mostDownvoted: "الأكثر تصويتاً سلبياً",
    mostSubscribed: "الأكثر اشتراكاً",
    highestRated: "الأعلى تقييماً",
    recentlyUpdated: "المُحدَّث حديثاً",
    ascending: "تصاعدي (انقر للعكس)",
    descending: "تنازلي (انقر للعكس)",
  },

  // Loading states
  loading: {
    text: "جارٍ تحميل عناصر الورشة...",
  },

  // Empty states
  empty: {
    noMatch: "لا توجد مستويات مشترك بها تطابق بحثك",
    noSubscribed: "لم يتم العثور على مستويات مشترك بها",
    searchHint:
      "جرّب البحث في ورشة Steam للعثور على مستويات مطابقة والاشتراك بها.",
    subscribeHint:
      "اشترك بمستويات في ورشة Steam لتظهر هنا.",
    searchOnWorkshop: "ابحث في الورشة",
    browseWorkshop: "تصفح الورشة",
  },

  // Error states
  error: {
    title: "خطأ في تحميل المستويات",
    tryAgain: "حاول مجدداً",
    playFailed: "تعذّر تشغيل هذا المستوى. قد تكون ملفاته مفقودة أو قديمة.",
  },

  // Level card
  card: {
    levelPack: "حزمة مستويات",
    singleLevel: "مستوى مفرد",
    difficulty: "{value}/10",
    playTooltip: "العب المستوى",
    untitled: "مستوى بلا عنوان",
    // Vote tooltips
    voteRatio: "{percent}% إيجابية ({up} إيجابي / {down} سلبي)",
    subscribers: "{count} مشترك",
    // Author
    authorLoading: "جارٍ التحميل...",
    authorTooltip: "المؤلف: {name}",
    authorIdTooltip: "معرّف المؤلف: {id}",
    authorOptions: "خيارات المؤلف",
    showProfile: "عرض صفحة الملف الشخصي",
    filterByAuthor: "تصفية حسب هذا المؤلف",
    moreFromAuthor: "المزيد من هذا المؤلف",
    // State button labels
    stateInstalled: "مُثبّت",
    stateInstalledTooltip: "انقر لفتح المجلد",
    stateDownloading: "جارٍ التنزيل",
    stateDownloadingTooltip: "جارٍ التنزيل...",
    stateUpdate: "تحديث",
    stateUpdateTooltip: "تحديث متاح - انقر للتحديث",
    stateInstall: "تثبيت",
    stateInstallTooltip: "انقر للتثبيت",
    // Steam button
    showInWorkshop: "عرض في الورشة",
  },

  // Date formatting
  dates: {
    today: "اليوم",
    yesterday: "أمس",
    daysAgo: "قبل {count} يوم",
    weeksAgo: "قبل {count} أسبوع",
    monthsAgo: "قبل {count} شهر",
  },
};
