import { API_BASE_URL, API_VERSION_PREFIX } from './config';
import type {
	ApiActor,
	ApiAuthResult,
	ApiBooking,
	ApiBookingRole,
	ApiCategory,
	ApiListing,
	ApiListingSearchItem,
	ApiPage,
	ApiPricing,
	ApiReport,
	ApiReview,
} from './types';

type RequestOptions = {
	method?: string;
	body?: unknown;
	token?: string | null;
	signal?: AbortSignal;
	headers?: Record<string, string>;
};

export class ApiError extends Error {
	readonly status: number;
	readonly code: string;
	readonly detail: string;
	readonly reason: string | null;

	constructor(status: number, code: string, detail: string, reason: string | null = null) {
		super(detail);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
		this.detail = detail;
		this.reason = reason;
	}
}

type ProblemDetails = {
	code?: string;
	detail?: string;
	reason?: string;
};

function buildUrl(path: string, query?: Record<string, string | number | boolean | null | undefined>) {
	const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}${API_VERSION_PREFIX}${path}`);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined || value === null || value === '') {
				continue;
			}
			url.searchParams.set(key, String(value));
		}
	}

	return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}, query?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
	const response = await fetch(buildUrl(path, query), {
		method: options.method ?? 'GET',
		headers: {
			Accept: 'application/json',
			...(options.body ? { 'Content-Type': 'application/json' } : {}),
			...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
			...options.headers,
		},
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
		signal: options.signal,
	});

	if (response.status === 204) {
		return undefined as T;
	}

	const contentType = response.headers.get('content-type') ?? '';
	const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : await response.text();

	if (!response.ok) {
		const problem = (payload && typeof payload === 'object' ? (payload as ProblemDetails) : null) ?? {};
		throw new ApiError(response.status, problem.code ?? `HTTP_${response.status}`, problem.detail ?? response.statusText, problem.reason ?? null);
	}

	return payload as T;
}

function idempotencyHeaders() {
	return { 'Idempotency-Key': globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}` };
}

export const apiClient = {
	getCategories(signal?: AbortSignal) {
		return request<ApiCategory[]>('/categories', { signal });
	},
	searchListings(params: {
		query?: string;
		categoryId?: string | null;
		cityId?: string | null;
		lat?: number | null;
		lng?: number | null;
		radiusKm?: number;
		cursor?: string | null;
		limit?: number;
	}, signal?: AbortSignal) {
		return request<{ items: ApiListingSearchItem[]; nextCursor: string | null }>('/listings', { signal }, params);
	},
	getListing(id: string, signal?: AbortSignal) {
		return request<ApiListing>(`/listings/${id}`, { signal });
	},
	createListing(input: { categoryId: string; title: string; description: string; pricing: ApiPricing; location: { lat: number; lng: number } }, token: string, signal?: AbortSignal) {
		return request<ApiListing>('/listings', { method: 'POST', body: input, token, signal });
	},
	updateListing(id: string, input: Partial<{ title: string; description: string; pricing: ApiPricing }>, token: string, signal?: AbortSignal) {
		return request<ApiListing>(`/listings/${id}`, { method: 'PATCH', body: input, token, signal });
	},
	publishListing(id: string, token: string, signal?: AbortSignal) {
		return request<ApiListing>(`/listings/${id}/publish`, { method: 'POST', token, signal });
	},
	pauseListing(id: string, token: string, signal?: AbortSignal) {
		return request<ApiListing>(`/listings/${id}/pause`, { method: 'POST', token, signal });
	},
	moderateListing(id: string, input: { action: 'under_review' | 'removed'; reason: string }, token: string, signal?: AbortSignal) {
		return request<ApiListing>(`/listings/${id}/moderate`, { method: 'POST', body: input, token, signal });
	},
	listMyListings(token: string, signal?: AbortSignal) {
		return request<{ items: ApiListing[]; nextCursor: string | null }>('/me/listings', { token, signal });
	},
	listBookings(token: string, role: ApiBookingRole, cursor?: string | null, limit = 20, signal?: AbortSignal) {
		return request<{ items: ApiBooking[]; nextCursor: string | null }>('/bookings', { token, signal }, { role, cursor, limit });
	},
	getBooking(id: string, token: string, signal?: AbortSignal) {
		return request<ApiBooking>(`/bookings/${id}`, { token, signal });
	},
	createBooking(input: { listingId: string; note?: string }, token: string, signal?: AbortSignal) {
		return request<ApiBooking>('/bookings', { method: 'POST', body: input, token, signal, headers: idempotencyHeaders() });
	},
	acceptBooking(id: string, input: { scheduledFor: string }, token: string, signal?: AbortSignal) {
		return request<ApiBooking>(`/bookings/${id}/accept`, { method: 'POST', body: input, token, signal });
	},
	declineBooking(id: string, input: { reason: 'unavailable' | 'not_a_fit' | 'other' }, token: string, signal?: AbortSignal) {
		return request<ApiBooking>(`/bookings/${id}/decline`, { method: 'POST', body: input, token, signal });
	},
	completeBooking(id: string, token: string, signal?: AbortSignal) {
		return request<ApiBooking>(`/bookings/${id}/complete`, { method: 'POST', token, signal });
	},
	cancelBooking(id: string, token: string, signal?: AbortSignal) {
		return request<ApiBooking>(`/bookings/${id}/cancel`, { method: 'POST', token, signal });
	},
	listListingReviews(listingId: string, cursor?: string | null, limit = 20, signal?: AbortSignal) {
		return request<{ items: ApiReview[]; nextCursor: string | null }>(`/listings/${listingId}/reviews`, { signal }, { cursor, limit });
	},
	writeReview(bookingId: string, input: { rating: number; body: string }, token: string, signal?: AbortSignal) {
		return request<ApiReview>(`/bookings/${bookingId}/review`, { method: 'POST', body: input, token, signal, headers: idempotencyHeaders() });
	},
	getMe(token: string, signal?: AbortSignal) {
		return request<ApiActor>('/me', { token, signal });
	},
	becomeProvider(token: string, signal?: AbortSignal) {
		return request<ApiActor>('/me/capacities/provider', { method: 'POST', token, signal });
	},
	signIn(input: { email: string; password: string }, signal?: AbortSignal) {
		return request<ApiAuthResult>('/auth/sign-in', { method: 'POST', body: input, signal });
	},
	signUp(input: { email: string; password: string; displayName: string; capacities?: Array<'customer' | 'provider'> }, signal?: AbortSignal) {
		return request<ApiAuthResult>('/auth/sign-up', { method: 'POST', body: input, signal });
	},
	refresh(refreshToken: string, signal?: AbortSignal) {
		return request<ApiAuthResult>('/auth/refresh', { method: 'POST', body: { refreshToken }, signal });
	},
	signOut(refreshToken: string, signal?: AbortSignal) {
		return request<void>('/auth/sign-out', { method: 'POST', body: { refreshToken }, signal });
	},
	createReport(listingId: string, input: { reason: string }, token: string, signal?: AbortSignal) {
		return request<ApiReport>(`/listings/${listingId}/report`, { method: 'POST', body: input, token, signal });
	},
	listReports(token: string, signal?: AbortSignal) {
		return request<{ items: ApiReport[]; nextCursor: string | null }>('/reports', { token, signal });
	},
	resolveReport(id: string, input: { action: 'remove' | 'dismiss'; note?: string }, token: string, signal?: AbortSignal) {
		return request<ApiReport>(`/reports/${id}/resolve`, { method: 'POST', body: input, token, signal });
	},
};
