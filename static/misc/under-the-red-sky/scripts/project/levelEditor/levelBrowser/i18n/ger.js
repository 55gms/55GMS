// German language strings for Level Browser

export default {
  // Header section
  header: {
    title: "Workshop-Level",
    refresh: "Aktualisieren",
    refreshTooltip: "Abonnierte Elemente neu laden",
    browseWorkshop: "Workshop durchsuchen",
    browseWorkshopTooltip: "Steam Workshop öffnen",
    closeTooltip: "Schließen",
  },

  // Search and filtering
  search: {
    placeholder: "Level suchen...",
    advancedFiltersTooltip: "Erweiterte Filter",
    showingResults: "Zeige {shown} von {total} Leveln",
    subscribedCount: "{count} abonniertes Level",
    subscribedCountPlural: "{count} abonnierte Level",
  },

  // Filter sections
  filters: {
    type: "Typ",
    singleLevel: "Einzelnes Level",
    levelPack: "Level-Paket",
    state: "Status",
    installed: "Installiert",
    downloading: "Wird heruntergeladen",
    updateAvailable: "Update verfügbar",
    notInstalled: "Nicht installiert",
    difficulty: "Schwierigkeit",
    difficultyTo: "bis",
    authorId: "Autor-ID",
    authorPlaceholder: "Steam-ID",
    add: "Hinzufügen",
  },

  // Sort options
  sort: {
    label: "Sortieren:",
    alphabetical: "Alphabetisch",
    mostUpvoted: "Meiste positive Stimmen",
    mostDownvoted: "Meiste negative Stimmen",
    mostSubscribed: "Meiste Abonnenten",
    highestRated: "Bestbewertet",
    recentlyUpdated: "Kürzlich aktualisiert",
    ascending: "Aufsteigend (klicken zum Umkehren)",
    descending: "Absteigend (klicken zum Umkehren)",
  },

  // Loading states
  loading: {
    text: "Workshop-Elemente werden geladen...",
  },

  // Empty states
  empty: {
    noMatch: "Keine abonnierten Level entsprechen Ihrer Suche",
    noSubscribed: "Keine abonnierten Level gefunden",
    searchHint:
      "Versuchen Sie, im Steam Workshop zu suchen, um passende Level zu finden und zu abonnieren.",
    subscribeHint:
      "Abonnieren Sie Level im Steam Workshop, um sie hier zu sehen.",
    searchOnWorkshop: "Im Workshop suchen",
    browseWorkshop: "Workshop durchsuchen",
  },

  // Error states
  error: {
    title: "Fehler beim Laden der Level",
    tryAgain: "Erneut versuchen",
    playFailed: "Dieses Level konnte nicht gestartet werden. Seine Dateien fehlen möglicherweise oder sind veraltet.",
  },

  // Level card
  card: {
    levelPack: "Level-Paket",
    singleLevel: "Einzelnes Level",
    difficulty: "{value}/10",
    playTooltip: "Level spielen",
    untitled: "Unbenanntes Level",
    // Vote tooltips
    voteRatio: "{percent}% positiv ({up} dafür / {down} dagegen)",
    subscribers: "{count} Abonnenten",
    // Author
    authorLoading: "Wird geladen...",
    authorTooltip: "Autor: {name}",
    authorIdTooltip: "Autor-ID: {id}",
    authorOptions: "Autor-Optionen",
    showProfile: "Profilseite anzeigen",
    filterByAuthor: "Nach diesem Autor filtern",
    moreFromAuthor: "Mehr von diesem Autor",
    // State button labels
    stateInstalled: "Installiert",
    stateInstalledTooltip: "Klicken zum Öffnen des Ordners",
    stateDownloading: "Wird heruntergeladen",
    stateDownloadingTooltip: "Wird heruntergeladen...",
    stateUpdate: "Aktualisieren",
    stateUpdateTooltip: "Update verfügbar - Klicken zum Aktualisieren",
    stateInstall: "Installieren",
    stateInstallTooltip: "Klicken zum Installieren",
    // Steam button
    showInWorkshop: "Im Workshop anzeigen",
  },

  // Date formatting
  dates: {
    today: "Heute",
    yesterday: "Gestern",
    daysAgo: "Vor {count} Tagen",
    weeksAgo: "Vor {count} Wochen",
    monthsAgo: "Vor {count} Monaten",
  },
};
