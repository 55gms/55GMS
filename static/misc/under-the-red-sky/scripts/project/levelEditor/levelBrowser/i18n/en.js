// English language strings for Level Browser

export default {
  // Header section
  header: {
    title: "Workshop Levels",
    refresh: "Refresh",
    refreshTooltip: "Reload subscribed items",
    browseWorkshop: "Browse Workshop",
    browseWorkshopTooltip: "Open Steam Workshop",
    closeTooltip: "Close",
  },

  // Search and filtering
  search: {
    placeholder: "Search levels...",
    advancedFiltersTooltip: "Advanced filters",
    showingResults: "Showing {shown} of {total} levels",
    subscribedCount: "{count} subscribed level",
    subscribedCountPlural: "{count} subscribed levels",
  },

  // Filter sections
  filters: {
    type: "Type",
    singleLevel: "Single Level",
    levelPack: "Level Pack",
    state: "State",
    installed: "Installed",
    downloading: "Downloading",
    updateAvailable: "Update Available",
    notInstalled: "Not Installed",
    difficulty: "Difficulty",
    difficultyTo: "to",
    authorId: "Author ID",
    authorPlaceholder: "Steam ID",
    add: "Add",
  },

  // Sort options
  sort: {
    label: "Sort:",
    alphabetical: "Alphabetical",
    mostUpvoted: "Most Upvoted",
    mostDownvoted: "Most Downvoted",
    mostSubscribed: "Most Subscribed",
    highestRated: "Highest Rated",
    recentlyUpdated: "Recently Updated",
    ascending: "Ascending (click to reverse)",
    descending: "Descending (click to reverse)",
  },

  // Loading states
  loading: {
    text: "Loading workshop items...",
  },

  // Empty states
  empty: {
    noMatch: "No subscribed levels match your search",
    noSubscribed: "No subscribed levels found",
    searchHint:
      "Try searching on the Steam Workshop to find and subscribe to matching levels.",
    subscribeHint:
      "Subscribe to levels on the Steam Workshop to see them here.",
    searchOnWorkshop: "Search on Workshop",
    browseWorkshop: "Browse Workshop",
  },

  // Error states
  error: {
    title: "Error Loading Levels",
    tryAgain: "Try Again",
    playFailed: "Could not start this level. Its files may be missing or out of date.",
  },

  // Level card
  card: {
    levelPack: "Level Pack",
    singleLevel: "Single Level",
    difficulty: "{value}/10",
    playTooltip: "Play Level",
    untitled: "Untitled Level",
    // Vote tooltips
    voteRatio: "{percent}% positive ({up} up / {down} down)",
    subscribers: "{count} subscribers",
    // Author
    authorLoading: "Loading...",
    authorTooltip: "Author: {name}",
    authorIdTooltip: "Author ID: {id}",
    authorOptions: "Author options",
    showProfile: "Show Profile Page",
    filterByAuthor: "Filter by This Author",
    moreFromAuthor: "More from This Author",
    // State button labels
    stateInstalled: "Installed",
    stateInstalledTooltip: "Click to open folder",
    stateDownloading: "Downloading",
    stateDownloadingTooltip: "Downloading...",
    stateUpdate: "Update",
    stateUpdateTooltip: "Update available - Click to refresh",
    stateInstall: "Install",
    stateInstallTooltip: "Click to install",
    // Steam button
    showInWorkshop: "Show In Workshop",
  },

  // Date formatting
  dates: {
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "{count} days ago",
    weeksAgo: "{count} weeks ago",
    monthsAgo: "{count} months ago",
  },
};
