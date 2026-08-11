export const languages = ['es', 'en', 'pt'] as const;

export type Language = (typeof languages)[number];

export type Money = {
  amountMinor: number;
  currency: 'MXN' | 'USD' | 'BRL' | 'COP' | 'EUR';
};

export type ListingCategoryId =
  | 'home'
  | 'lessons'
  | 'pets'
  | 'beauty'
  | 'tech'
  | 'wellness';

export type ListingCategory = {
  id: ListingCategoryId;
  label: Record<Language, string>;
  accent: string;
};

export type DemoListing = {
  id: string;
  categoryId: ListingCategoryId;
  title: Record<Language, string>;
  description: Record<Language, string>;
  providerName: string;
  providerTitle: Record<Language, string>;
  rating: number;
  reviews: number;
  distanceKm: number;
  responseTime: Record<Language, string>;
  nextSlot: Record<Language, string>;
  price: Money;
  tags: Record<Language, readonly string[]>;
  palette: readonly [string, string];
};

export type DemoBookingStatus = 'requested' | 'accepted' | 'completed';

export type DemoBooking = {
  id: string;
  listingId: string;
  customerName: string;
  status: DemoBookingStatus;
  scheduledAt: string;
  location: Record<Language, string>;
  note: Record<Language, string>;
  price: Money;
  reviewAllowed: boolean;
};

export const listingCategories: readonly ListingCategory[] = [
  {
    id: 'home',
    label: { es: 'Hogar', en: 'Home', pt: 'Casa' },
    accent: '#33E18A',
  },
  {
    id: 'lessons',
    label: { es: 'Clases', en: 'Lessons', pt: 'Aulas' },
    accent: '#63B7FF',
  },
  {
    id: 'pets',
    label: { es: 'Mascotas', en: 'Pets', pt: 'Pets' },
    accent: '#5BFF8A',
  },
  {
    id: 'beauty',
    label: { es: 'Belleza', en: 'Beauty', pt: 'Beleza' },
    accent: '#8AD7FF',
  },
  {
    id: 'tech',
    label: { es: 'Tecnología', en: 'Tech', pt: 'Tecnologia' },
    accent: '#63B7FF',
  },
  {
    id: 'wellness',
    label: { es: 'Bienestar', en: 'Wellness', pt: 'Bem-estar' },
    accent: '#33E18A',
  },
] as const;

export const demoListings: readonly DemoListing[] = [
  {
    id: 'plumber-rivera',
    categoryId: 'home',
    title: {
      es: 'Fontanero en 30 minutos',
      en: 'Plumber in 30 minutes',
      pt: 'Encanador em 30 minutos',
    },
    description: {
      es: 'Reparaciones urgentes, destapes y mantenimiento preventivo con garantía por escrito.',
      en: 'Urgent repairs, unclogging and preventive maintenance with written warranty.',
      pt: 'Reparos urgentes, desentupimento e manutenção preventiva com garantia por escrito.',
    },
    providerName: 'Camilo Rivera',
    providerTitle: { es: 'Técnico certificado', en: 'Certified technician', pt: 'Técnico certificado' },
    rating: 4.9,
    reviews: 182,
    distanceKm: 1.8,
    responseTime: { es: 'Responde en 12 min', en: 'Replies in 12 min', pt: 'Responde em 12 min' },
    nextSlot: { es: 'Hoy 18:30', en: 'Today 6:30 PM', pt: 'Hoje 18:30' },
    price: { amountMinor: 12900, currency: 'MXN' },
    tags: {
      es: ['Emergencias', 'Garantía', 'Factura'],
      en: ['Emergency', 'Warranty', 'Invoice'],
      pt: ['Emergência', 'Garantia', 'Nota fiscal'],
    },
    palette: ['#33E18A', '#DFFFEA'],
  },
  {
    id: 'guitar-marta',
    categoryId: 'lessons',
    title: {
      es: 'Clases de guitarra para principiantes',
      en: 'Guitar lessons for beginners',
      pt: 'Aulas de violão para iniciantes',
    },
    description: {
      es: 'Sesiones híbridas con material propio y seguimiento semanal.',
      en: 'Hybrid sessions with custom material and weekly follow-up.',
      pt: 'Aulas híbridas com material próprio e acompanhamento semanal.',
    },
    providerName: 'Marta López',
    providerTitle: { es: 'Música y pedagogía', en: 'Music and pedagogy', pt: 'Música e pedagogia' },
    rating: 4.8,
    reviews: 96,
    distanceKm: 3.2,
    responseTime: { es: 'Responde en 1 h', en: 'Replies in 1 h', pt: 'Responde em 1 h' },
    nextSlot: { es: 'Mañana 19:00', en: 'Tomorrow 7:00 PM', pt: 'Amanhã 19:00' },
    price: { amountMinor: 18000, currency: 'USD' },
    tags: {
      es: ['Online', 'Presencial', '4 plazas'],
      en: ['Online', 'In person', '4 spots'],
      pt: ['Online', 'Presencial', '4 vagas'],
    },
    palette: ['#63B7FF', '#DCEBFF'],
  },
  {
    id: 'dog-walk-olivia',
    categoryId: 'pets',
    title: {
      es: 'Paseos seguros para perros activos',
      en: 'Safe walks for active dogs',
      pt: 'Passeios seguros para cães ativos',
    },
    description: {
      es: 'Ruta por barrio, foto al finalizar y seguimiento con GPS compartido.',
      en: 'Neighborhood route, photo at the end and shared GPS tracking.',
      pt: 'Rota pelo bairro, foto ao final e rastreamento GPS compartilhado.',
    },
    providerName: 'Olivia Torres',
    providerTitle: { es: 'Cuidadora de confianza', en: 'Trusted sitter', pt: 'Cuidadora de confiança' },
    rating: 5.0,
    reviews: 241,
    distanceKm: 0.9,
    responseTime: { es: 'Responde en 5 min', en: 'Replies in 5 min', pt: 'Responde em 5 min' },
    nextSlot: { es: 'Disponible ahora', en: 'Available now', pt: 'Disponível agora' },
    price: { amountMinor: 7500, currency: 'BRL' },
    tags: {
      es: ['GPS', 'Foto', 'Vacunas al día'],
      en: ['GPS', 'Photo', 'Vaccinated only'],
      pt: ['GPS', 'Foto', 'Vacinas em dia'],
    },
    palette: ['#5BFF8A', '#E7FFF0'],
  },
  {
    id: 'design-ana',
    categoryId: 'tech',
    title: {
      es: 'Diseño rápido para negocios locales',
      en: 'Fast design for local businesses',
      pt: 'Design rápido para negócios locais',
    },
    description: {
      es: 'Branding mínimo, piezas para redes y ajustes sobre la marcha.',
      en: 'Lean branding, social assets and on-the-fly revisions.',
      pt: 'Branding enxuto, peças para redes e ajustes rápidos.',
    },
    providerName: 'Ana Prado',
    providerTitle: { es: 'Diseñadora UX/UI', en: 'UX/UI designer', pt: 'Designer UX/UI' },
    rating: 4.7,
    reviews: 58,
    distanceKm: 4.1,
    responseTime: { es: 'Responde en 25 min', en: 'Replies in 25 min', pt: 'Responde em 25 min' },
    nextSlot: { es: 'Vie 11:00', en: 'Fri 11:00 AM', pt: 'Sex 11:00' },
    price: { amountMinor: 14500, currency: 'EUR' },
    tags: {
      es: ['Figma', 'Logo', 'Redes'],
      en: ['Figma', 'Logo', 'Social'],
      pt: ['Figma', 'Logo', 'Redes sociais'],
    },
    palette: ['#63B7FF', '#D9E9FF'],
  },
  {
    id: 'wellness-lucia',
    categoryId: 'wellness',
    title: {
      es: 'Masaje descontracturante a domicilio',
      en: 'Home deep-tissue massage',
      pt: 'Massagem descontraturante em casa',
    },
    description: {
      es: 'Sesiones de 60 y 90 minutos con aceites neutros y horario flexible.',
      en: '60 and 90 minute sessions with neutral oils and flexible scheduling.',
      pt: 'Sessões de 60 e 90 minutos com óleos neutros e agenda flexível.',
    },
    providerName: 'Lucía Vega',
    providerTitle: { es: 'Terapeuta corporal', en: 'Body therapist', pt: 'Terapeuta corporal' },
    rating: 4.9,
    reviews: 77,
    distanceKm: 2.4,
    responseTime: { es: 'Responde en 18 min', en: 'Replies in 18 min', pt: 'Responde em 18 min' },
    nextSlot: { es: 'Hoy 20:00', en: 'Today 8:00 PM', pt: 'Hoje 20:00' },
    price: { amountMinor: 11000, currency: 'COP' },
    tags: {
      es: ['Relajación', 'A domicilio', 'Toallas'],
      en: ['Relaxing', 'At home', 'Towels'],
      pt: ['Relax', 'Em casa', 'Toalhas'],
    },
    palette: ['#33E18A', '#D6F9E7'],
  },
  {
    id: 'bike-tomas',
    categoryId: 'home',
    title: {
      es: 'Reparación de bicicletas el mismo día',
      en: 'Same-day bike repair',
      pt: 'Conserto de bicicleta no mesmo dia',
    },
    description: {
      es: 'Ajuste de cambios, frenos y limpieza profunda con recogida opcional.',
      en: 'Gear tuning, brakes and deep cleaning with optional pickup.',
      pt: 'Ajuste de marcha, freios e limpeza profunda com retirada opcional.',
    },
    providerName: 'Tomás Silva',
    providerTitle: { es: 'Mecánico ciclista', en: 'Bike mechanic', pt: 'Mecânico de bikes' },
    rating: 4.8,
    reviews: 131,
    distanceKm: 5.5,
    responseTime: { es: 'Responde en 14 min', en: 'Replies in 14 min', pt: 'Responde em 14 min' },
    nextSlot: { es: 'Mañana 09:30', en: 'Tomorrow 9:30 AM', pt: 'Amanhã 09:30' },
    price: { amountMinor: 9900, currency: 'MXN' },
    tags: {
      es: ['Taller', 'Recogida', 'Express'],
      en: ['Workshop', 'Pickup', 'Express'],
      pt: ['Oficina', 'Retirada', 'Express'],
    },
    palette: ['#8AD7FF', '#E8F4FF'],
  },
] as const;

export const demoBookings: readonly DemoBooking[] = [
  {
    id: 'booking-apt-14',
    listingId: 'plumber-rivera',
    customerName: 'Mariana Castillo',
    status: 'accepted',
    scheduledAt: '2026-08-08T18:30:00.000Z',
    location: {
      es: 'Roma Norte, Ciudad de México',
      en: 'Roma Norte, Mexico City',
      pt: 'Roma Norte, Cidade do México',
    },
    note: {
      es: 'Fuga debajo del fregadero. Acceso desde la cocina.',
      en: 'Leak under the sink. Access from the kitchen.',
      pt: 'Vazamento sob a pia. Acesso pela cozinha.',
    },
    price: { amountMinor: 12900, currency: 'MXN' },
    reviewAllowed: false,
  },
  {
    id: 'booking-clase-03',
    listingId: 'guitar-marta',
    customerName: 'Luis Fernández',
    status: 'completed',
    scheduledAt: '2026-08-01T19:00:00.000Z',
    location: {
      es: 'En línea',
      en: 'Online',
      pt: 'Online',
    },
    note: {
      es: 'Quiero aprender acordes básicos en 6 semanas.',
      en: 'I want to learn basic chords in 6 weeks.',
      pt: 'Quero aprender acordes básicos em 6 semanas.',
    },
    price: { amountMinor: 18000, currency: 'USD' },
    reviewAllowed: true,
  },
  {
    id: 'booking-pet-21',
    listingId: 'dog-walk-olivia',
    customerName: 'Sofía Herrera',
    status: 'requested',
    scheduledAt: '2026-08-09T08:00:00.000Z',
    location: {
      es: 'Narvarte, CDMX',
      en: 'Narvarte, CDMX',
      pt: 'Narvarte, CDMX',
    },
    note: {
      es: 'Paseo corto por la mañana con perro mediano.',
      en: 'Short morning walk with a medium dog.',
      pt: 'Passeio curto pela manhã com cão médio.',
    },
    price: { amountMinor: 7500, currency: 'BRL' },
    reviewAllowed: false,
  },
] as const;

export function findListingById(id: string) {
  return demoListings.find((listing) => listing.id === id) ?? null;
}

export function findBookingById(id: string) {
  return demoBookings.find((booking) => booking.id === id) ?? null;
}
