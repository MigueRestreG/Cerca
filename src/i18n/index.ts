import type { Language } from '@/domain/demo-market';

export type Money = {
  amountMinor: number;
  currency: string;
};

export type { Language };

const translations = {
  es: {
    appName: 'Cerca',
    appTagline: 'Mercado local. Demo navegable. Tres idiomas.',
    common: {
      search: 'Buscar',
      clear: 'Limpiar',
      retry: 'Reintentar',
      save: 'Guardar',
      next: 'Siguiente',
      back: 'Atrás',
      publish: 'Publicar',
      review: 'Reseñar',
      requestBooking: 'Solicitar reserva',
      viewDetails: 'Ver detalle',
      all: 'Todo',
      loading: 'Cargando',
      demoMode: 'Modo demo',
      signOut: 'Cerrar sesión',
    },
    tabs: {
      home: 'Inicio',
      search: 'Buscar',
      publish: 'Publicar',
      bookings: 'Reservas',
      account: 'Cuenta',
    },
    home: {
      heroTitle: 'Encuentra ayuda cerca de ti',
      heroBody: 'Un front conectado a la API real para buscar, publicar, reservar y reseñar.',
      featured: 'Destacados',
      quickActions: 'Acciones rápidas',
      noBackend: 'No hay backend todavía. Todo lo que ves aquí vive en datos mockeados y rutas reales.',
      liveMode: 'Modo conectado',
      liveCopy: 'Los datos vienen de la API y cambian con la sesión autenticada.',
      searchScope: 'Búsqueda por ciudad con la misma lógica que usa el backend.',
      categories: 'Categorías activas',
      stats: {
        active: 'Servicios activos',
        fast: 'Respuesta media',
        languages: 'Idiomas',
      },
    },
    search: {
      title: 'Buscar servicios',
      subtitle: 'Filtra por ciudad y categoría, y explora resultados reales desde la API.',
      searchPlaceholder: 'Fontanero, guitarra, paseo de perros...',
      errorTitle: 'No pudimos cargar los resultados',
      errorBody: 'Esto simula un fallo de red. Puedes volver al estado normal para seguir explorando.',
      emptyTitle: 'No hay coincidencias',
      emptyBody: 'Prueba otro texto, limpia filtros o cambia de categoría.',
      modeLabel: 'Estado demo',
      modes: { normal: 'Normal', empty: 'Vacío', error: 'Error' },
      results: 'Resultados',
      city: 'Ciudad',
      loadingBody: 'Estamos consultando la API con tus filtros actuales.',
    },
    publish: {
      title: 'Publicar en 4 pasos',
      subtitle: 'Crea un anuncio real con categoría, ciudad y pricing validado por el backend.',
      step: 'Paso',
      steps: {
        basics: 'Básicos',
        service: 'Servicio',
        pricing: 'Precio',
        preview: 'Vista previa',
      },
      fields: {
        title: 'Título del servicio',
        description: 'Descripción',
        category: 'Categoría',
        location: 'Ciudad',
        amount: 'Monto en minor units',
        currency: 'Moneda',
        languages: 'Idiomas',
        pricingModel: 'Modelo de precio',
        minimumHours: 'Horas mínimas',
      },
      models: { fixed: 'Fijo', hourly: 'Por hora', quote: 'Cotización' },
      previewCta: 'Publicar borrador',
      published: 'Borrador listo para publicar',
      reset: 'Reiniciar demo',
    },
    bookings: {
      title: 'Reservas',
      subtitle: 'Historial real del actor autenticado, separado por rol.',
      upcoming: 'Próximas',
      completed: 'Completadas',
      reviewReady: 'Lista para reseñar',
      reviewLocked: 'Aún no disponible para reseñar',
    },
    account: {
      title: 'Cuenta y ajustes',
      subtitle: 'Revisa la sesión real, cambia idioma y confirma la conexión con la API.',
      language: 'Idioma',
      localePreview: 'Vista de locale',
      demoNote: 'La sesión y la sincronización ya salen de la API.',
      session: 'Sesión',
      noSession: 'Sin sesión',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      becomeProvider: 'Hacerme proveedor',
      capabilities: 'Capacidades',
    },
    listing: {
      detailTitle: 'Detalle del servicio',
      response: 'Responde rápido',
      distance: 'Distancia',
      rating: 'Valoración',
      nextSlot: 'Próximo espacio',
      provider: 'Proveedor',
      booking: 'Reservar ahora',
      reviewHint: 'La reseña solo se habilita cuando la reserva está completada.',
      loadingBody: 'Estamos cargando el anuncio desde la API.',
      status: 'Estado',
      owner: 'Propietario',
      createdAt: 'Creado',
      category: 'Categoría',
      pricing: 'Pricing',
      quoteOnly: 'Cotización',
      ownerActions: 'Acciones de propietario',
      bookingHint: 'Solicita una reserva con el anuncio real.',
      notePlaceholder: 'Añade una nota opcional para la reserva',
      pause: 'Pausar',
      publish: 'Publicar',
      reviews: 'Reseñas',
      noReviews: 'Todavía no hay reseñas.',
    },
    booking: {
      detailTitle: 'Detalle de la reserva',
      status: 'Estado',
      customer: 'Cliente',
      location: 'Ubicación',
      note: 'Notas',
      review: 'Reseña disponible',
      markReviewed: 'Marcar como reseñada',
      accept: 'Aceptar',
      decline: 'Rechazar',
      cancel: 'Cancelar',
      requestedAt: 'Solicitada',
      scheduledFor: 'Programada',
      reviewId: 'Reseña',
      reviewDefault: 'Buen servicio',
      accepted: 'Reserva aceptada',
      declined: 'Reserva rechazada',
      cancelled: 'Reserva cancelada',
    },
  },
  en: {
    appName: 'Cerca',
    appTagline: 'Local marketplace. Navigable demo. Three languages.',
    common: {
      search: 'Search',
      clear: 'Clear',
      retry: 'Retry',
      save: 'Save',
      next: 'Next',
      back: 'Back',
      publish: 'Publish',
      review: 'Review',
      requestBooking: 'Request booking',
      viewDetails: 'View details',
      all: 'All',
      loading: 'Loading',
      demoMode: 'Demo mode',
      signOut: 'Sign out',
    },
    tabs: {
      home: 'Home',
      search: 'Search',
      publish: 'Publish',
      bookings: 'Bookings',
      account: 'Account',
    },
    home: {
      heroTitle: 'Find help near you',
      heroBody: 'A front end connected to the real API for search, publishing, bookings and reviews.',
      featured: 'Featured',
      quickActions: 'Quick actions',
      noBackend: 'There is no backend yet. Everything here is mock data and real routes.',
      liveMode: 'Connected mode',
      liveCopy: 'Data comes from the API and changes with the authenticated session.',
      searchScope: 'City-based search using the same server logic.',
      categories: 'Active categories',
      stats: {
        active: 'Active services',
        fast: 'Average response',
        languages: 'Languages',
      },
    },
    search: {
      title: 'Search services',
      subtitle: 'Filter by city and category, and explore real API results.',
      searchPlaceholder: 'Plumber, guitar, dog walk...',
      errorTitle: 'We could not load the results',
      errorBody: 'This simulates a network failure. Switch back to the normal state to keep exploring.',
      emptyTitle: 'No matches found',
      emptyBody: 'Try a different query, clear filters or change category.',
      modeLabel: 'Demo state',
      modes: { normal: 'Normal', empty: 'Empty', error: 'Error' },
      results: 'Results',
      city: 'City',
      loadingBody: 'We are querying the API with your current filters.',
    },
    publish: {
      title: 'Publish in 4 steps',
      subtitle: 'Create a real listing with category, city and backend-validated pricing.',
      step: 'Step',
      steps: {
        basics: 'Basics',
        service: 'Service',
        pricing: 'Pricing',
        preview: 'Preview',
      },
      fields: {
        title: 'Service title',
        description: 'Description',
        category: 'Category',
        location: 'City',
        amount: 'Amount in minor units',
        currency: 'Currency',
        languages: 'Languages',
        pricingModel: 'Pricing model',
        minimumHours: 'Minimum hours',
      },
      models: { fixed: 'Fixed', hourly: 'Hourly', quote: 'Quote' },
      previewCta: 'Publish draft',
      published: 'Draft ready to publish',
      reset: 'Reset demo',
    },
    bookings: {
      title: 'Bookings',
      subtitle: 'Real history for the authenticated actor, split by role.',
      upcoming: 'Upcoming',
      completed: 'Completed',
      reviewReady: 'Ready to review',
      reviewLocked: 'Not available to review yet',
    },
    account: {
      title: 'Account and settings',
      subtitle: 'Review the real session, change language and confirm the API connection.',
      language: 'Language',
      localePreview: 'Locale preview',
      demoNote: 'Session and sync already come from the API.',
      session: 'Session',
      noSession: 'No session',
      connected: 'Connected',
      disconnected: 'Disconnected',
      becomeProvider: 'Become provider',
      capabilities: 'Capabilities',
    },
    listing: {
      detailTitle: 'Service detail',
      response: 'Fast reply',
      distance: 'Distance',
      rating: 'Rating',
      nextSlot: 'Next slot',
      provider: 'Provider',
      booking: 'Book now',
      reviewHint: 'Review only unlocks when the booking is completed.',
      loadingBody: 'Loading the listing from the API.',
      status: 'Status',
      owner: 'Owner',
      createdAt: 'Created',
      category: 'Category',
      pricing: 'Pricing',
      quoteOnly: 'Quote only',
      ownerActions: 'Owner actions',
      bookingHint: 'Request a booking against the real listing.',
      notePlaceholder: 'Add an optional booking note',
      pause: 'Pause',
      publish: 'Publish',
      reviews: 'Reviews',
      noReviews: 'No reviews yet.',
    },
    booking: {
      detailTitle: 'Booking detail',
      status: 'Status',
      customer: 'Customer',
      location: 'Location',
      note: 'Notes',
      review: 'Review available',
      markReviewed: 'Mark as reviewed',
      accept: 'Accept',
      decline: 'Decline',
      cancel: 'Cancel',
      requestedAt: 'Requested at',
      scheduledFor: 'Scheduled for',
      reviewId: 'Review',
      reviewDefault: 'Great service',
      accepted: 'Booking accepted',
      declined: 'Booking declined',
      cancelled: 'Booking cancelled',
    },
  },
  pt: {
    appName: 'Cerca',
    appTagline: 'Marketplace local. Demo navegável. Três idiomas.',
    common: {
      search: 'Buscar',
      clear: 'Limpar',
      retry: 'Tentar novamente',
      save: 'Salvar',
      next: 'Próximo',
      back: 'Voltar',
      publish: 'Publicar',
      review: 'Avaliar',
      requestBooking: 'Solicitar reserva',
      viewDetails: 'Ver detalhes',
      all: 'Tudo',
      loading: 'Carregando',
      demoMode: 'Modo demo',
      signOut: 'Sair',
    },
    tabs: {
      home: 'Início',
      search: 'Buscar',
      publish: 'Publicar',
      bookings: 'Reservas',
      account: 'Conta',
    },
    home: {
      heroTitle: 'Encontre ajuda perto de você',
      heroBody: 'Um front conectado à API real para busca, publicação, reservas e avaliações.',
      featured: 'Destaques',
      quickActions: 'Ações rápidas',
      noBackend: 'Ainda não existe backend. Tudo aqui são dados mockados e rotas reais.',
      liveMode: 'Modo conectado',
      liveCopy: 'Os dados vêm da API e mudam com a sessão autenticada.',
      searchScope: 'Busca por cidade com a mesma lógica do servidor.',
      categories: 'Categorias ativas',
      stats: {
        active: 'Serviços ativos',
        fast: 'Resposta média',
        languages: 'Idiomas',
      },
    },
    search: {
      title: 'Buscar serviços',
      subtitle: 'Filtre por cidade e categoria e explore resultados reais da API.',
      searchPlaceholder: 'Encanador, violão, passeio de cães...',
      errorTitle: 'Não conseguimos carregar os resultados',
      errorBody: 'Isso simula uma falha de rede. Volte ao estado normal para continuar explorando.',
      emptyTitle: 'Nenhuma correspondência',
      emptyBody: 'Tente outro texto, limpe os filtros ou troque de categoria.',
      modeLabel: 'Estado demo',
      modes: { normal: 'Normal', empty: 'Vazio', error: 'Erro' },
      results: 'Resultados',
      city: 'Cidade',
      loadingBody: 'Consultando a API com seus filtros atuais.',
    },
    publish: {
      title: 'Publicar em 4 passos',
      subtitle: 'Crie um anúncio real com categoria, cidade e pricing validado pelo backend.',
      step: 'Passo',
      steps: {
        basics: 'Básico',
        service: 'Serviço',
        pricing: 'Preço',
        preview: 'Prévia',
      },
      fields: {
        title: 'Título do serviço',
        description: 'Descrição',
        category: 'Categoria',
        location: 'Cidade',
        amount: 'Valor em minor units',
        currency: 'Moeda',
        languages: 'Idiomas',
        pricingModel: 'Modelo de preço',
        minimumHours: 'Horas mínimas',
      },
      models: { fixed: 'Fixo', hourly: 'Por hora', quote: 'Cotação' },
      previewCta: 'Publicar rascunho',
      published: 'Rascunho pronto para publicar',
      reset: 'Reiniciar demo',
    },
    bookings: {
      title: 'Reservas',
      subtitle: 'Histórico real do ator autenticado, separado por papel.',
      upcoming: 'Próximas',
      completed: 'Concluídas',
      reviewReady: 'Pronta para avaliar',
      reviewLocked: 'Ainda não disponível para avaliar',
    },
    account: {
      title: 'Conta e ajustes',
      subtitle: 'Revise a sessão real, troque o idioma e confirme a conexão com a API.',
      language: 'Idioma',
      localePreview: 'Prévia do locale',
      demoNote: 'A sessão e a sincronização já vêm da API.',
      session: 'Sessão',
      noSession: 'Sem sessão',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      becomeProvider: 'Virar provedor',
      capabilities: 'Capacidades',
    },
    listing: {
      detailTitle: 'Detalhe do serviço',
      response: 'Resposta rápida',
      distance: 'Distância',
      rating: 'Avaliação',
      nextSlot: 'Próximo horário',
      provider: 'Prestador',
      booking: 'Reservar agora',
      reviewHint: 'A avaliação só libera quando a reserva estiver concluída.',
      loadingBody: 'Carregando o anúncio pela API.',
      status: 'Status',
      owner: 'Proprietário',
      createdAt: 'Criado',
      category: 'Categoria',
      pricing: 'Pricing',
      quoteOnly: 'Cotação',
      ownerActions: 'Ações do proprietário',
      bookingHint: 'Solicite uma reserva usando o anúncio real.',
      notePlaceholder: 'Adicione uma nota opcional para a reserva',
      pause: 'Pausar',
      publish: 'Publicar',
      reviews: 'Avaliações',
      noReviews: 'Ainda não há avaliações.',
    },
    booking: {
      detailTitle: 'Detalhe da reserva',
      status: 'Status',
      customer: 'Cliente',
      location: 'Localização',
      note: 'Notas',
      review: 'Avaliação disponível',
      markReviewed: 'Marcar como avaliada',
      accept: 'Aceitar',
      decline: 'Rejeitar',
      cancel: 'Cancelar',
      requestedAt: 'Solicitada em',
      scheduledFor: 'Agendada para',
      reviewId: 'Avaliação',
      reviewDefault: 'Ótimo serviço',
      accepted: 'Reserva aceita',
      declined: 'Reserva rejeitada',
      cancelled: 'Reserva cancelada',
    },
  },
} as const;

const localeByLanguage: Record<Language, string> = {
  es: 'es-MX',
  en: 'en-US',
  pt: 'pt-BR',
};

function readValue(source: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[part];
  }, source);
}

export function getLocale(language: Language) {
  return localeByLanguage[language];
}

export function createTranslator(language: Language) {
  return (key: string) => {
    const value = readValue(translations[language], key);
    return typeof value === 'string' ? value : key;
  };
}

export function formatMoney(money: Money, language: Language) {
  const locale = getLocale(language);
  const amount = money.amountMinor / 100;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(amount);
}

export function formatDistance(distanceKm: number, language: Language) {
  const locale = getLocale(language);

  if (language === 'en') {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(distanceKm * 0.621371) + ' mi';
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(distanceKm) + ' km';
}

export function formatCompactNumber(value: number, language: Language) {
  return new Intl.NumberFormat(getLocale(language), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function pickLocalizedText<T extends Record<Language, string>>(value: T, language: Language) {
  return value[language];
}

export function detectInitialLanguage(): Language {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();

  if (locale.startsWith('pt')) {
    return 'pt';
  }

  if (locale.startsWith('en')) {
    return 'en';
  }

  return 'es';
}
