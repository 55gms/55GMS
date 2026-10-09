// French language strings for Level Browser

export default {
  // Header section
  header: {
    title: "Niveaux du Workshop",
    refresh: "Actualiser",
    refreshTooltip: "Recharger les éléments abonnés",
    browseWorkshop: "Parcourir le Workshop",
    browseWorkshopTooltip: "Ouvrir le Steam Workshop",
    closeTooltip: "Fermer",
  },

  // Search and filtering
  search: {
    placeholder: "Rechercher des niveaux...",
    advancedFiltersTooltip: "Filtres avancés",
    showingResults: "Affichage de {shown} sur {total} niveaux",
    subscribedCount: "{count} niveau abonné",
    subscribedCountPlural: "{count} niveaux abonnés",
  },

  // Filter sections
  filters: {
    type: "Type",
    singleLevel: "Niveau unique",
    levelPack: "Pack de niveaux",
    state: "État",
    installed: "Installé",
    downloading: "Téléchargement",
    updateAvailable: "Mise à jour disponible",
    notInstalled: "Non installé",
    difficulty: "Difficulté",
    difficultyTo: "à",
    authorId: "ID de l'auteur",
    authorPlaceholder: "ID Steam",
    add: "Ajouter",
  },

  // Sort options
  sort: {
    label: "Trier :",
    alphabetical: "Alphabétique",
    mostUpvoted: "Plus de votes positifs",
    mostDownvoted: "Plus de votes négatifs",
    mostSubscribed: "Plus d'abonnés",
    highestRated: "Mieux notés",
    recentlyUpdated: "Récemment mis à jour",
    ascending: "Croissant (cliquer pour inverser)",
    descending: "Décroissant (cliquer pour inverser)",
  },

  // Loading states
  loading: {
    text: "Chargement des éléments du workshop...",
  },

  // Empty states
  empty: {
    noMatch: "Aucun niveau abonné ne correspond à votre recherche",
    noSubscribed: "Aucun niveau abonné trouvé",
    searchHint:
      "Essayez de rechercher sur le Steam Workshop pour trouver et vous abonner à des niveaux correspondants.",
    subscribeHint:
      "Abonnez-vous à des niveaux sur le Steam Workshop pour les voir ici.",
    searchOnWorkshop: "Rechercher sur le Workshop",
    browseWorkshop: "Parcourir le Workshop",
  },

  // Error states
  error: {
    title: "Erreur de chargement des niveaux",
    tryAgain: "Réessayer",
    playFailed: "Impossible de lancer ce niveau. Ses fichiers sont peut-être manquants ou obsolètes.",
  },

  // Level card
  card: {
    levelPack: "Pack de niveaux",
    singleLevel: "Niveau unique",
    difficulty: "{value}/10",
    playTooltip: "Jouer au niveau",
    untitled: "Niveau sans titre",
    // Vote tooltips
    voteRatio: "{percent}% positifs ({up} pour / {down} contre)",
    subscribers: "{count} abonnés",
    // Author
    authorLoading: "Chargement...",
    authorTooltip: "Auteur : {name}",
    authorIdTooltip: "ID de l'auteur : {id}",
    authorOptions: "Options de l'auteur",
    showProfile: "Afficher la page de profil",
    filterByAuthor: "Filtrer par cet auteur",
    moreFromAuthor: "Plus de cet auteur",
    // State button labels
    stateInstalled: "Installé",
    stateInstalledTooltip: "Cliquer pour ouvrir le dossier",
    stateDownloading: "Téléchargement",
    stateDownloadingTooltip: "Téléchargement en cours...",
    stateUpdate: "Mettre à jour",
    stateUpdateTooltip: "Mise à jour disponible - Cliquer pour actualiser",
    stateInstall: "Installer",
    stateInstallTooltip: "Cliquer pour installer",
    // Steam button
    showInWorkshop: "Afficher dans le Workshop",
  },

  // Date formatting
  dates: {
    today: "Aujourd'hui",
    yesterday: "Hier",
    daysAgo: "Il y a {count} jours",
    weeksAgo: "Il y a {count} semaines",
    monthsAgo: "Il y a {count} mois",
  },
};
