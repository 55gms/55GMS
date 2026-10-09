// Chinese (Simplified) language strings for Level Browser

export default {
  // Header section
  header: {
    title: "创意工坊关卡",
    refresh: "刷新",
    refreshTooltip: "重新加载已订阅的项目",
    browseWorkshop: "浏览创意工坊",
    browseWorkshopTooltip: "打开 Steam 创意工坊",
    closeTooltip: "关闭",
  },

  // Search and filtering
  search: {
    placeholder: "搜索关卡...",
    advancedFiltersTooltip: "高级筛选",
    showingResults: "显示 {shown} / {total} 个关卡",
    subscribedCount: "已订阅 {count} 个关卡",
    subscribedCountPlural: "已订阅 {count} 个关卡",
  },

  // Filter sections
  filters: {
    type: "类型",
    singleLevel: "单个关卡",
    levelPack: "关卡包",
    state: "状态",
    installed: "已安装",
    downloading: "下载中",
    updateAvailable: "有可用更新",
    notInstalled: "未安装",
    difficulty: "难度",
    difficultyTo: "至",
    authorId: "作者 ID",
    authorPlaceholder: "Steam ID",
    add: "添加",
  },

  // Sort options
  sort: {
    label: "排序：",
    alphabetical: "按字母顺序",
    mostUpvoted: "最多好评",
    mostDownvoted: "最多差评",
    mostSubscribed: "最多订阅",
    highestRated: "评分最高",
    recentlyUpdated: "最近更新",
    ascending: "升序（点击反转）",
    descending: "降序（点击反转）",
  },

  // Loading states
  loading: {
    text: "正在加载创意工坊项目...",
  },

  // Empty states
  empty: {
    noMatch: "没有符合搜索条件的已订阅关卡",
    noSubscribed: "未找到已订阅的关卡",
    searchHint:
      "请尝试在 Steam 创意工坊中搜索并订阅符合条件的关卡。",
    subscribeHint:
      "在 Steam 创意工坊订阅关卡后即可在此查看。",
    searchOnWorkshop: "在创意工坊中搜索",
    browseWorkshop: "浏览创意工坊",
  },

  // Error states
  error: {
    title: "加载关卡时出错",
    tryAgain: "重试",
    playFailed: "无法启动此关卡。其文件可能缺失或已过期。",
  },

  // Level card
  card: {
    levelPack: "关卡包",
    singleLevel: "单个关卡",
    difficulty: "{value}/10",
    playTooltip: "开始游玩",
    untitled: "未命名关卡",
    // Vote tooltips
    voteRatio: "{percent}% 好评（{up} 顶 / {down} 踩）",
    subscribers: "{count} 位订阅者",
    // Author
    authorLoading: "加载中...",
    authorTooltip: "作者：{name}",
    authorIdTooltip: "作者 ID：{id}",
    authorOptions: "作者选项",
    showProfile: "显示个人资料页",
    filterByAuthor: "按此作者筛选",
    moreFromAuthor: "查看此作者的更多作品",
    // State button labels
    stateInstalled: "已安装",
    stateInstalledTooltip: "点击打开文件夹",
    stateDownloading: "下载中",
    stateDownloadingTooltip: "正在下载...",
    stateUpdate: "更新",
    stateUpdateTooltip: "有可用更新 - 点击刷新",
    stateInstall: "安装",
    stateInstallTooltip: "点击安装",
    // Steam button
    showInWorkshop: "在创意工坊中查看",
  },

  // Date formatting
  dates: {
    today: "今天",
    yesterday: "昨天",
    daysAgo: "{count} 天前",
    weeksAgo: "{count} 周前",
    monthsAgo: "{count} 个月前",
  },
};
