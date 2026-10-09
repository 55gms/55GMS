// Spanish language strings for Level Browser

export default {
  // Header section
  header: {
    title: "Niveles del Workshop",
    refresh: "Actualizar",
    refreshTooltip: "Recargar elementos suscritos",
    browseWorkshop: "Explorar Workshop",
    browseWorkshopTooltip: "Abrir Steam Workshop",
    closeTooltip: "Cerrar",
  },

  // Search and filtering
  search: {
    placeholder: "Buscar niveles...",
    advancedFiltersTooltip: "Filtros avanzados",
    showingResults: "Mostrando {shown} de {total} niveles",
    subscribedCount: "{count} nivel suscrito",
    subscribedCountPlural: "{count} niveles suscritos",
  },

  // Filter sections
  filters: {
    type: "Tipo",
    singleLevel: "Nivel individual",
    levelPack: "Pack de niveles",
    state: "Estado",
    installed: "Instalado",
    downloading: "Descargando",
    updateAvailable: "Actualización disponible",
    notInstalled: "No instalado",
    difficulty: "Dificultad",
    difficultyTo: "a",
    authorId: "ID del autor",
    authorPlaceholder: "ID de Steam",
    add: "Añadir",
  },

  // Sort options
  sort: {
    label: "Ordenar:",
    alphabetical: "Alfabético",
    mostUpvoted: "Más votados positivamente",
    mostDownvoted: "Más votados negativamente",
    mostSubscribed: "Más suscritos",
    highestRated: "Mejor valorados",
    recentlyUpdated: "Actualizados recientemente",
    ascending: "Ascendente (clic para invertir)",
    descending: "Descendente (clic para invertir)",
  },

  // Loading states
  loading: {
    text: "Cargando elementos del workshop...",
  },

  // Empty states
  empty: {
    noMatch: "Ningún nivel suscrito coincide con tu búsqueda",
    noSubscribed: "No se encontraron niveles suscritos",
    searchHint:
      "Intenta buscar en el Steam Workshop para encontrar y suscribirte a niveles que coincidan.",
    subscribeHint:
      "Suscríbete a niveles en el Steam Workshop para verlos aquí.",
    searchOnWorkshop: "Buscar en el Workshop",
    browseWorkshop: "Explorar Workshop",
  },

  // Error states
  error: {
    title: "Error al cargar niveles",
    tryAgain: "Reintentar",
    playFailed: "No se pudo iniciar este nivel. Es posible que sus archivos falten o estén desactualizados.",
  },

  // Level card
  card: {
    levelPack: "Pack de niveles",
    singleLevel: "Nivel individual",
    difficulty: "{value}/10",
    playTooltip: "Jugar nivel",
    untitled: "Nivel sin título",
    // Vote tooltips
    voteRatio: "{percent}% positivos ({up} a favor / {down} en contra)",
    subscribers: "{count} suscriptores",
    // Author
    authorLoading: "Cargando...",
    authorTooltip: "Autor: {name}",
    authorIdTooltip: "ID del autor: {id}",
    authorOptions: "Opciones del autor",
    showProfile: "Ver página de perfil",
    filterByAuthor: "Filtrar por este autor",
    moreFromAuthor: "Más de este autor",
    // State button labels
    stateInstalled: "Instalado",
    stateInstalledTooltip: "Clic para abrir carpeta",
    stateDownloading: "Descargando",
    stateDownloadingTooltip: "Descargando...",
    stateUpdate: "Actualizar",
    stateUpdateTooltip: "Actualización disponible - Clic para actualizar",
    stateInstall: "Instalar",
    stateInstallTooltip: "Clic para instalar",
    // Steam button
    showInWorkshop: "Ver en el Workshop",
  },

  // Date formatting
  dates: {
    today: "Hoy",
    yesterday: "Ayer",
    daysAgo: "Hace {count} días",
    weeksAgo: "Hace {count} semanas",
    monthsAgo: "Hace {count} meses",
  },
};
