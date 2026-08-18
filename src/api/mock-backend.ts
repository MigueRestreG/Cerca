import { demoListings, listingCategories } from '@/domain/demo-market';
import type { ApiCapacity, ApiPlatformRole, ApiPricing } from '@/api/types';

type ListingStatus =
  | { kind: 'draft' }
  | { kind: 'published'; publishedAt: string }
  | { kind: 'paused' }
  | { kind: 'under_review'; reportId: string }
  | { kind: 'removed'; removedBy: string; reason: 'spam' | 'inappropriate' | 'fake' | 'other' };

type BookingStatus =
  | { kind: 'requested'; requestedAt: string }
  | { kind: 'accepted'; acceptedAt: string; scheduledFor: string }
  | { kind: 'declined'; reason: 'unavailable' | 'not_a_fit' | 'other' }
  | { kind: 'completed'; completedAt: string }
  | { kind: 'cancelled'; cancelledBy: string; at: string };

type MockListing = {
  id: string;
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  pricing: ApiPricing;
  priceFrom: { amountMinor: number; currency: 'MXN' | 'USD' | 'BRL' | 'COP' | 'EUR' } | null;
  status: ListingStatus;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  location: { lat: number; lng: number };
};

type MockBooking = {
  id: string;
  listingId: string;
  customerId: string;
  status: BookingStatus;
  reviewId: string | null;
  note?: string;
};

type MockReview = {
  id: string;
  bookingId: string;
  listingId: string;
  authorId: string;
  rating: number;
  body: string;
  createdAt: string;
};

type MockReport = {
  id: string;
  listingId: string;
  reporterId: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
};

type MockUser = {
  id: string;
  email: string;
  password: string;
  capacities: ApiCapacity[];
  platformRole: ApiPlatformRole;
};

type MockSession = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

type QueryParams = Record<string, string | number | boolean | null | undefined>;

export class MockBackendError extends Error {
  readonly status: number;
  readonly code: string;
  readonly reason: string | null;

  constructor(status: number, code: string, detail: string, reason: string | null = null) {
    super(detail);
    this.name = 'MockBackendError';
    this.status = status;
    this.code = code;
    this.reason = reason;
  }
}

type MockState = {
  categories: { id: string; slug: string; name: string }[];
  listings: MockListing[];
  bookings: MockBooking[];
  reviews: MockReview[];
  reports: MockReport[];
  users: MockUser[];
  sessions: MockSession[];
};

let state: MockState | null = null;

function nowIso() {
  return new Date().toISOString();
}

function seedState(): MockState {
  const categories = listingCategories.map((category) => ({
    id: category.id,
    slug: category.id,
    name: category.label.es,
  }));

  const listings: MockListing[] = demoListings.map((item, index) => ({
    id: item.id,
    ownerId: `provider-${index + 1}`,
    categoryId: item.categoryId,
    title: item.title.es,
    description: item.description.es,
    pricing: { model: 'fixed', price: item.price },
    priceFrom: item.price,
    status: { kind: 'published', publishedAt: nowIso() },
    ratingAvg: item.rating,
    ratingCount: item.reviews,
    createdAt: nowIso(),
    location: { lat: 4.711, lng: -74.0721 },
  }));

  const users: MockUser[] = [
    {
      id: 'user-demo',
      email: 'demo@cerca.app',
      password: 'Demo12345!',
      capacities: ['customer'],
      platformRole: 'user',
    },
  ];

  return {
    categories,
    listings,
    bookings: [],
    reviews: [],
    reports: [],
    users,
    sessions: [],
  };
}

function getState() {
  if (!state) {
    state = seedState();
  }
  return state;
}

function ensureString(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new MockBackendError(400, 'VALIDATION_ERROR', `Invalid ${field}`);
  }
  return value;
}

function ensureEmail(value: unknown) {
  const email = ensureString(value, 'email').toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new MockBackendError(400, 'VALIDATION_ERROR', 'Invalid email');
  }
  return email;
}

function ensureAuthToken(token: string | null | undefined): MockUser {
  const current = getState();

  if (!token) {
    throw new MockBackendError(401, 'UNAUTHORIZED', 'Missing token');
  }

  const session = current.sessions.find((item) => item.accessToken === token);
  if (session) {
    const user = current.users.find((item) => item.id === session.userId);
    if (!user) {
      throw new MockBackendError(401, 'UNAUTHORIZED', 'Invalid session');
    }
    return user;
  }

  if (token.startsWith('local-')) {
    const id = token.replace(/^local-/, '').trim();
    let user = current.users.find((item) => item.id === id);

    if (!user) {
      user = {
        id,
        email: `${id}@local.invalid`,
        password: '',
        capacities: ['customer'],
        platformRole: 'user',
      };
      current.users.push(user);
    }

    return user;
  }

  throw new MockBackendError(401, 'UNAUTHORIZED', 'Invalid token');
}

function toActor(user: MockUser) {
  return {
    id: user.id,
    capacities: user.capacities,
    platformRole: user.platformRole,
  };
}

function isPrivileged(user: MockUser) {
  return user.platformRole === 'moderator' || user.platformRole === 'admin';
}

function canAccessListing(user: MockUser | null, listing: MockListing) {
  if (listing.status.kind === 'published') {
    return true;
  }

  if (!user) {
    return false;
  }

  return listing.ownerId === user.id || isPrivileged(user);
}

function getListingOwner(listingId: string): MockUser | null {
  const current = getState();
  const listing = current.listings.find((item) => item.id === listingId);
  if (!listing) {
    return null;
  }

  return current.users.find((item) => item.id === listing.ownerId) ?? null;
}

function canAccessBooking(user: MockUser, booking: MockBooking) {
  if (booking.customerId === user.id) {
    return true;
  }

  const owner = getListingOwner(booking.listingId);
  if (owner && owner.id === user.id) {
    return true;
  }

  return isPrivileged(user);
}

function createSession(userId: string) {
  const accessToken = `mock-token-${userId}-${Date.now()}`;
  const refreshToken = `mock-refresh-${userId}-${Date.now()}`;
  const current = getState();

  current.sessions.push({ accessToken, refreshToken, userId });

  return { accessToken, refreshToken };
}

function listingToSearchItem(listing: MockListing) {
  return {
    id: listing.id,
    title: listing.title,
    categoryId: listing.categoryId,
    priceFrom: listing.priceFrom,
    status: listing.status,
    ratingAvg: listing.ratingAvg,
    ratingCount: listing.ratingCount,
    distanceMeters: 800 + Math.floor(Math.random() * 5000),
  };
}

function requireListing(id: string) {
  const listing = getState().listings.find((item) => item.id === id);
  if (!listing) {
    throw new MockBackendError(404, 'NOT_FOUND', 'Listing not found');
  }
  return listing;
}

function requireBooking(id: string) {
  const booking = getState().bookings.find((item) => item.id === id);
  if (!booking) {
    throw new MockBackendError(404, 'NOT_FOUND', 'Booking not found');
  }
  return booking;
}

function parsePath(path: string) {
  return path.split('?')[0];
}

function isMockEnabled() {
  return process.env.EXPO_PUBLIC_DISABLE_MOCK_API !== '1';
}

export async function mockRequest(path: string, options: RequestOptions = {}, query?: QueryParams): Promise<unknown> {
  if (!isMockEnabled()) {
    throw new MockBackendError(503, 'MOCK_DISABLED', 'Mock API disabled by environment');
  }

  const method = (options.method ?? 'GET').toUpperCase();
  const cleanPath = parsePath(path);
  const current = getState();

  if (cleanPath === '/categories' && method === 'GET') {
    return current.categories;
  }

  if (cleanPath === '/auth/sign-up' && method === 'POST') {
    const body = (options.body ?? {}) as { email?: string; password?: string; displayName?: string; capacities?: ApiCapacity[] };
    const email = ensureEmail(body.email);
    const password = ensureString(body.password, 'password');
    ensureString(body.displayName, 'displayName');

    if (password.length < 8) {
      throw new MockBackendError(400, 'VALIDATION_ERROR', 'Password must be at least 8 characters');
    }

    if (current.users.some((item) => item.email === email)) {
      throw new MockBackendError(409, 'EMAIL_EXISTS', 'Email already exists');
    }

    const user: MockUser = {
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email,
      password,
      capacities: body.capacities && body.capacities.length > 0 ? body.capacities : ['customer'],
      platformRole: 'user',
    };

    current.users.push(user);
    const session = createSession(user.id);
    return { ...session, actor: toActor(user) };
  }

  if (cleanPath === '/auth/sign-in' && method === 'POST') {
    const body = (options.body ?? {}) as { email?: string; password?: string };
    const email = ensureEmail(body.email);
    const password = ensureString(body.password, 'password');

    const user = current.users.find((item) => item.email === email);
    if (!user || user.password !== password) {
      throw new MockBackendError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const session = createSession(user.id);
    return { ...session, actor: toActor(user) };
  }

  if (cleanPath === '/auth/refresh' && method === 'POST') {
    const body = (options.body ?? {}) as { refreshToken?: string };
    const refreshToken = ensureString(body.refreshToken, 'refreshToken');
    const session = current.sessions.find((item) => item.refreshToken === refreshToken);
    if (!session) {
      throw new MockBackendError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token');
    }
    const user = current.users.find((item) => item.id === session.userId);
    if (!user) {
      throw new MockBackendError(401, 'UNAUTHORIZED', 'User not found');
    }

    const next = createSession(user.id);
    return { ...next, actor: toActor(user) };
  }

  if (cleanPath === '/auth/sign-out' && method === 'POST') {
    const body = (options.body ?? {}) as { refreshToken?: string };
    if (typeof body.refreshToken === 'string') {
      current.sessions = current.sessions.filter((item) => item.refreshToken !== body.refreshToken);
    }
    return undefined;
  }

  if (cleanPath === '/me' && method === 'GET') {
    const user = ensureAuthToken(options.token);
    return toActor(user);
  }

  if (cleanPath === '/me/capacities/provider' && method === 'POST') {
    const user = ensureAuthToken(options.token);
    if (!user.capacities.includes('provider')) {
      user.capacities = [...user.capacities, 'provider'];
    }
    return toActor(user);
  }

  if (cleanPath === '/me/listings' && method === 'GET') {
    const user = ensureAuthToken(options.token);
    return {
      items: current.listings.filter((item) => item.ownerId === user.id),
      nextCursor: null,
    };
  }

  if (cleanPath === '/listings' && method === 'GET') {
    const input = query ?? {};
    const queryText = typeof input.query === 'string' ? input.query.toLowerCase().trim() : '';
    const categoryId = typeof input.categoryId === 'string' ? input.categoryId : null;
    const limit = typeof input.limit === 'number' ? Math.max(1, Math.floor(input.limit)) : 20;

    const items = current.listings
      .filter((item) => item.status.kind === 'published')
      .filter((item) => !categoryId || item.categoryId === categoryId)
      .filter((item) => !queryText || item.title.toLowerCase().includes(queryText) || item.description.toLowerCase().includes(queryText))
      .map(listingToSearchItem)
      .slice(0, limit);

    return { items, nextCursor: null };
  }

  if (cleanPath === '/listings' && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const body = (options.body ?? {}) as {
      categoryId?: string;
      title?: string;
      description?: string;
      pricing?: ApiPricing;
      location?: { lat?: number; lng?: number };
    };

    const listing: MockListing = {
      id: `listing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ownerId: user.id,
      categoryId: ensureString(body.categoryId, 'categoryId'),
      title: ensureString(body.title, 'title'),
      description: ensureString(body.description, 'description'),
      pricing: body.pricing ?? { model: 'quote' },
      priceFrom: body.pricing && body.pricing.model === 'fixed' ? body.pricing.price : null,
      status: { kind: 'draft' },
      ratingAvg: 0,
      ratingCount: 0,
      createdAt: nowIso(),
      location: {
        lat: typeof body.location?.lat === 'number' ? body.location.lat : 0,
        lng: typeof body.location?.lng === 'number' ? body.location.lng : 0,
      },
    };

    current.listings.unshift(listing);
    return listing;
  }

  const listingById = cleanPath.match(/^\/listings\/([^/]+)$/);
  if (listingById && method === 'GET') {
    const listing = requireListing(listingById[1]);
    const requester = options.token ? ensureAuthToken(options.token) : null;
    if (!canAccessListing(requester, listing)) {
      throw new MockBackendError(404, 'NOT_FOUND', 'Listing not found');
    }
    return listing;
  }

  if (listingById && method === 'PATCH') {
    const user = ensureAuthToken(options.token);
    const listing = requireListing(listingById[1]);
    if (listing.ownerId !== user.id) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }

    const body = (options.body ?? {}) as Partial<{ title: string; description: string; pricing: ApiPricing }>;
    if (typeof body.title === 'string') listing.title = body.title;
    if (typeof body.description === 'string') listing.description = body.description;
    if (body.pricing) {
      listing.pricing = body.pricing;
      listing.priceFrom = body.pricing.model === 'fixed' ? body.pricing.price : null;
    }

    return listing;
  }

  const listingPublish = cleanPath.match(/^\/listings\/([^/]+)\/publish$/);
  if (listingPublish && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const listing = requireListing(listingPublish[1]);
    if (listing.ownerId !== user.id) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (listing.status.kind !== 'draft' && listing.status.kind !== 'paused') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Listing cannot be published from current state');
    }
    listing.status = { kind: 'published', publishedAt: nowIso() };
    return listing;
  }

  const listingPause = cleanPath.match(/^\/listings\/([^/]+)\/pause$/);
  if (listingPause && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const listing = requireListing(listingPause[1]);
    if (listing.ownerId !== user.id) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (listing.status.kind !== 'published') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Only published listings can be paused');
    }
    listing.status = { kind: 'paused' };
    return listing;
  }

  const listingModerate = cleanPath.match(/^\/listings\/([^/]+)\/moderate$/);
  if (listingModerate && method === 'POST') {
    const user = ensureAuthToken(options.token);
    if (!isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    const listing = requireListing(listingModerate[1]);
    const body = (options.body ?? {}) as { action?: 'under_review' | 'removed'; reason?: string };

    if (body.action === 'under_review') {
      listing.status = { kind: 'under_review', reportId: `report-${Date.now()}` };
      return listing;
    }

    if (body.action === 'removed') {
      listing.status = { kind: 'removed', removedBy: 'moderator-mock', reason: 'other' };
      return listing;
    }

    throw new MockBackendError(400, 'VALIDATION_ERROR', 'Invalid action');
  }

  const listingReviews = cleanPath.match(/^\/listings\/([^/]+)\/reviews$/);
  if (listingReviews && method === 'GET') {
    const listingId = listingReviews[1];
    const limit = typeof query?.limit === 'number' ? Math.max(1, Math.floor(query.limit)) : 20;
    return {
      items: current.reviews.filter((item) => item.listingId === listingId).slice(0, limit),
      nextCursor: null,
    };
  }

  if (cleanPath === '/bookings' && method === 'GET') {
    const user = ensureAuthToken(options.token);
    const role = query?.role === 'provider' ? 'provider' : 'customer';
    const limit = typeof query?.limit === 'number' ? Math.max(1, Math.floor(query.limit)) : 20;

    if (role === 'provider' && !user.capacities.includes('provider') && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }

    const items = current.bookings.filter((booking) => {
      if (role === 'customer') {
        return booking.customerId === user.id;
      }
      const listing = current.listings.find((item) => item.id === booking.listingId);
      return listing?.ownerId === user.id;
    });

    return { items: items.slice(0, limit), nextCursor: null };
  }

  if (cleanPath === '/bookings' && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const body = (options.body ?? {}) as { listingId?: string; note?: string };
    const listingId = ensureString(body.listingId, 'listingId');
    const listing = requireListing(listingId);
    if (listing.ownerId === user.id) {
      throw new MockBackendError(400, 'VALIDATION_ERROR', 'Cannot book your own listing');
    }
    if (listing.status.kind !== 'published') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Only published listings can be booked');
    }

    const duplicate = current.bookings.find(
      (item) =>
        item.customerId === user.id
        && item.listingId === listingId
        && (item.status.kind === 'requested' || item.status.kind === 'accepted'),
    );

    if (duplicate) {
      throw new MockBackendError(409, 'DUPLICATE_BOOKING', 'There is already an active booking for this listing');
    }

    const booking: MockBooking = {
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      listingId,
      customerId: user.id,
      status: { kind: 'requested', requestedAt: nowIso() },
      reviewId: null,
      note: typeof body.note === 'string' ? body.note : undefined,
    };

    current.bookings.unshift(booking);
    return booking;
  }

  const bookingById = cleanPath.match(/^\/bookings\/([^/]+)$/);
  if (bookingById && method === 'GET') {
    const user = ensureAuthToken(options.token);
    const booking = requireBooking(bookingById[1]);
    if (!canAccessBooking(user, booking)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    return booking;
  }

  const bookingAccept = cleanPath.match(/^\/bookings\/([^/]+)\/accept$/);
  if (bookingAccept && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const body = (options.body ?? {}) as { scheduledFor?: string };
    const booking = requireBooking(bookingAccept[1]);
    const listing = requireListing(booking.listingId);
    if (listing.ownerId !== user.id && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (booking.status.kind !== 'requested') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Only requested bookings can be accepted');
    }
    const scheduledFor = ensureString(body.scheduledFor, 'scheduledFor');
    booking.status = { kind: 'accepted', acceptedAt: nowIso(), scheduledFor };
    return booking;
  }

  const bookingDecline = cleanPath.match(/^\/bookings\/([^/]+)\/decline$/);
  if (bookingDecline && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const body = (options.body ?? {}) as { reason?: 'unavailable' | 'not_a_fit' | 'other' };
    const booking = requireBooking(bookingDecline[1]);
    const listing = requireListing(booking.listingId);
    if (listing.ownerId !== user.id && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (booking.status.kind !== 'requested') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Only requested bookings can be declined');
    }
    booking.status = { kind: 'declined', reason: body.reason ?? 'other' };
    return booking;
  }

  const bookingComplete = cleanPath.match(/^\/bookings\/([^/]+)\/complete$/);
  if (bookingComplete && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const booking = requireBooking(bookingComplete[1]);
    const listing = requireListing(booking.listingId);
    if (listing.ownerId !== user.id && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (booking.status.kind !== 'accepted') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Only accepted bookings can be completed');
    }
    booking.status = { kind: 'completed', completedAt: nowIso() };
    return booking;
  }

  const bookingCancel = cleanPath.match(/^\/bookings\/([^/]+)\/cancel$/);
  if (bookingCancel && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const booking = requireBooking(bookingCancel[1]);
    if (booking.customerId !== user.id && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    if (booking.status.kind === 'completed' || booking.status.kind === 'declined' || booking.status.kind === 'cancelled') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Booking cannot be cancelled');
    }
    booking.status = { kind: 'cancelled', cancelledBy: user.id, at: nowIso() };
    return booking;
  }

  const bookingReview = cleanPath.match(/^\/bookings\/([^/]+)\/review$/);
  if (bookingReview && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const body = (options.body ?? {}) as { rating?: number; body?: string };
    const booking = requireBooking(bookingReview[1]);

    if (booking.customerId !== user.id && !isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }

    if (booking.status.kind !== 'completed') {
      throw new MockBackendError(409, 'INVALID_STATE', 'Review is only allowed for completed bookings');
    }

    if (booking.reviewId) {
      throw new MockBackendError(409, 'REVIEW_ALREADY_EXISTS', 'Review already exists for booking');
    }

    const review: MockReview = {
      id: `review-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingId: booking.id,
      listingId: booking.listingId,
      authorId: user.id,
      rating: typeof body.rating === 'number' ? Math.max(1, Math.min(5, body.rating)) : 5,
      body: typeof body.body === 'string' && body.body.trim() ? body.body : 'Great service',
      createdAt: nowIso(),
    };

    booking.reviewId = review.id;
    current.reviews.unshift(review);
    return review;
  }

  const listingReport = cleanPath.match(/^\/listings\/([^/]+)\/report$/);
  if (listingReport && method === 'POST') {
    const user = ensureAuthToken(options.token);
    const listing = requireListing(listingReport[1]);
    const body = (options.body ?? {}) as { reason?: string };

    if (listing.ownerId === user.id) {
      throw new MockBackendError(400, 'VALIDATION_ERROR', 'Cannot report your own listing');
    }

    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
    if (!reason) {
      throw new MockBackendError(400, 'VALIDATION_ERROR', 'Report reason is required');
    }

    const report: MockReport = {
      id: `report-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      listingId: listingReport[1],
      reporterId: user.id,
      reason,
      status: 'open',
      createdAt: nowIso(),
    };

    current.reports.unshift(report);
    return report;
  }

  if (cleanPath === '/reports' && method === 'GET') {
    const user = ensureAuthToken(options.token);
    if (!isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    return { items: current.reports, nextCursor: null };
  }

  const resolveReport = cleanPath.match(/^\/reports\/([^/]+)\/resolve$/);
  if (resolveReport && method === 'POST') {
    const user = ensureAuthToken(options.token);
    if (!isPrivileged(user)) {
      throw new MockBackendError(403, 'FORBIDDEN', 'Forbidden');
    }
    const report = current.reports.find((item) => item.id === resolveReport[1]);
    if (!report) {
      throw new MockBackendError(404, 'NOT_FOUND', 'Report not found');
    }

    const body = (options.body ?? {}) as { action?: 'remove' | 'dismiss'; note?: string };
    report.status = body.action === 'remove' ? 'resolved' : 'dismissed';

    if (body.action === 'remove') {
      const listing = current.listings.find((item) => item.id === report.listingId);
      if (listing) {
        listing.status = { kind: 'removed', removedBy: 'moderator-mock', reason: 'other' };
      }
    }

    return report;
  }

  throw new MockBackendError(404, 'NOT_FOUND', `No mock handler for ${method} ${cleanPath}`);
}
