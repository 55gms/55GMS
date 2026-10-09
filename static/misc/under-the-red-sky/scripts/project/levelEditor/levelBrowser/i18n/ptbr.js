// Brazilian Portuguese language strings for Level Browser

export default {
  // Header section
  header: {
    title: "Níveis da Oficina",
    refresh: "Atualizar",
    refreshTooltip: "Recarregar itens inscritos",
    browseWorkshop: "Explorar Oficina",
    browseWorkshopTooltip: "Abrir Oficina Steam",
    closeTooltip: "Fechar",
  },

  // Search and filtering
  search: {
    placeholder: "Buscar níveis...",
    advancedFiltersTooltip: "Filtros avançados",
    showingResults: "Mostrando {shown} de {total} níveis",
    subscribedCount: "{count} nível inscrito",
    subscribedCountPlural: "{count} níveis inscritos",
  },

  // Filter sections
  filters: {
    type: "Tipo",
    singleLevel: "Nível único",
    levelPack: "Pacote de níveis",
    state: "Estado",
    installed: "Instalado",
    downloading: "Baixando",
    updateAvailable: "Atualização disponível",
    notInstalled: "Não instalado",
    difficulty: "Dificuldade",
    difficultyTo: "até",
    authorId: "ID do autor",
    authorPlaceholder: "ID Steam",
    add: "Adicionar",
  },

  // Sort options
  sort: {
    label: "Ordenar:",
    alphabetical: "Alfabético",
    mostUpvoted: "Mais votados positivamente",
    mostDownvoted: "Mais votados negativamente",
    mostSubscribed: "Mais inscritos",
    highestRated: "Melhor avaliados",
    recentlyUpdated: "Atualizados recentemente",
    ascending: "Crescente (clique para inverter)",
    descending: "Decrescente (clique para inverter)",
  },

  // Loading states
  loading: {
    text: "Carregando itens da oficina...",
  },

  // Empty states
  empty: {
    noMatch: "Nenhum nível inscrito corresponde à sua busca",
    noSubscribed: "Nenhum nível inscrito encontrado",
    searchHint:
      "Tente buscar na Oficina Steam para encontrar e se inscrever em níveis correspondentes.",
    subscribeHint: "Inscreva-se em níveis na Oficina Steam para vê-los aqui.",
    searchOnWorkshop: "Buscar na Oficina",
    browseWorkshop: "Explorar Oficina",
  },

  // Error states
  error: {
    title: "Erro ao carregar níveis",
    tryAgain: "Tentar novamente",
    playFailed: "Não foi possível iniciar este nível. Seus arquivos podem estar ausentes ou desatualizados.",
  },

  // Level card
  card: {
    levelPack: "Pacote de níveis",
    singleLevel: "Nível único",
    difficulty: "{value}/10",
    playTooltip: "Jogar nível",
    untitled: "Nível sem título",
    // Vote tooltips
    voteRatio: "{percent}% positivos ({up} a favor / {down} contra)",
    subscribers: "{count} inscritos",
    // Author
    authorLoading: "Carregando...",
    authorTooltip: "Autor: {name}",
    authorIdTooltip: "ID do autor: {id}",
    authorOptions: "Opções do autor",
    showProfile: "Ver página de perfil",
    filterByAuthor: "Filtrar por este autor",
    moreFromAuthor: "Mais deste autor",
    // State button labels
    stateInstalled: "Instalado",
    stateInstalledTooltip: "Clique para abrir pasta",
    stateDownloading: "Baixando",
    stateDownloadingTooltip: "Baixando...",
    stateUpdate: "Atualizar",
    stateUpdateTooltip: "Atualização disponível - Clique para atualizar",
    stateInstall: "Instalar",
    stateInstallTooltip: "Clique para instalar",
    // Steam button
    showInWorkshop: "Ver na Oficina",
  },

  // Date formatting
  dates: {
    today: "Hoje",
    yesterday: "Ontem",
    daysAgo: "Há {count} dias",
    weeksAgo: "Há {count} semanas",
    monthsAgo: "Há {count} meses",
  },
};
