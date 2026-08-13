import { API_BASE_URL, API_VERSION_PREFIX } from "./config";
import {
    ApiActorSchema,
    ApiAuthResultSchema,
    ApiBookingRoleSchema,
    ApiBookingSchema,
    ApiCategorySchema,
    ApiListingSchema,
    ApiListingSearchItemSchema,
    ApiReportSchema,
    ApiReviewSchema,
    createPageSchema
} from "./schemas";
import type {
    ApiBookingRole,
    ApiPricing
} from "./types";

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

  constructor(
    status: number,
    code: string,
    detail: string,
    reason: string | null = null,
  ) {
    super(detail);
    this.name = "ApiError";
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

const CATEGORY_PAGE_SCHEMA = createPageSchema(ApiCategorySchema);
const LISTING_SEARCH_PAGE_SCHEMA = createPageSchema(ApiListingSearchItemSchema);
const LISTING_PAGE_SCHEMA = createPageSchema(ApiListingSchema);
const BOOKING_PAGE_SCHEMA = createPageSchema(ApiBookingSchema);
const REVIEW_PAGE_SCHEMA = createPageSchema(ApiReviewSchema);
const REPORT_PAGE_SCHEMA = createPageSchema(ApiReportSchema);

function validateContract<T>(
  schema: { parse: (value: unknown) => T },
  value: unknown,
  label: string,
): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(
        502,
        "INVALID_API_RESPONSE",
        `${label} contract validation failed: ${error.message}`,
      );
    }
    throw new ApiError(
      502,
      "INVALID_API_RESPONSE",
      `${label} contract validation failed`,
    );
  }
}

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const url = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}${API_VERSION_PREFIX}${path}`,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  query?: Record<string, string | number | boolean | null | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const problem =
      (payload && typeof payload === "object"
        ? (payload as ProblemDetails)
        : null) ?? {};
    throw new ApiError(
      response.status,
      problem.code ?? `HTTP_${response.status}`,
      problem.detail ?? response.statusText,
      problem.reason ?? null,
    );
  }

  return payload as T;
}

function requestValidated<T>(
  path: string,
  schema: { parse: (value: unknown) => T },
  options: RequestOptions = {},
  query?: Record<string, string | number | boolean | null | undefined>,
  label = path,
): Promise<T> {
  return request<T>(path, options, query).then((payload) =>
    validateContract(schema, payload, label),
  );
}

function idempotencyHeaders() {
  return {
    "Idempotency-Key":
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
  };
}

export const apiClient = {
  getCategories(signal?: AbortSignal) {
    return requestValidated(
      "/categories",
      CATEGORY_PAGE_SCHEMA,
      { signal },
      undefined,
      "categories",
    ).then((page) => page.items);
  },
  searchListings(
    params: {
      query?: string;
      categoryId?: string | null;
      cityId?: string | null;
      lat?: number | null;
      lng?: number | null;
      radiusKm?: number;
      cursor?: string | null;
      limit?: number;
    },
    signal?: AbortSignal,
  ) {
    return requestValidated(
      "/listings",
      LISTING_SEARCH_PAGE_SCHEMA,
      { signal },
      params,
      "listings",
    );
  },
  getListing(id: string, signal?: AbortSignal) {
    return requestValidated(
      `/listings/${id}`,
      ApiListingSchema,
      { signal },
      undefined,
      `listing:${id}`,
    );
  },
  createListing(
    input: {
      categoryId: string;
      title: string;
      description: string;
      pricing: ApiPricing;
      location: { lat: number; lng: number };
    },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      "/listings",
      ApiListingSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      "createListing",
    );
  },
  updateListing(
    id: string,
    input: Partial<{ title: string; description: string; pricing: ApiPricing }>,
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/listings/${id}`,
      ApiListingSchema,
      { method: "PATCH", body: input, token, signal },
      undefined,
      `updateListing:${id}`,
    );
  },
  publishListing(id: string, token: string, signal?: AbortSignal) {
    return requestValidated(
      `/listings/${id}/publish`,
      ApiListingSchema,
      { method: "POST", token, signal },
      undefined,
      `publishListing:${id}`,
    );
  },
  pauseListing(id: string, token: string, signal?: AbortSignal) {
    return requestValidated(
      `/listings/${id}/pause`,
      ApiListingSchema,
      { method: "POST", token, signal },
      undefined,
      `pauseListing:${id}`,
    );
  },
  moderateListing(
    id: string,
    input: { action: "under_review" | "removed"; reason: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/listings/${id}/moderate`,
      ApiListingSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      `moderateListing:${id}`,
    );
  },
  listMyListings(token: string, signal?: AbortSignal) {
    return requestValidated(
      "/me/listings",
      LISTING_PAGE_SCHEMA,
      { token, signal },
      undefined,
      "me/listings",
    );
  },
  listBookings(
    token: string,
    role: ApiBookingRole,
    cursor?: string | null,
    limit = 20,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      "/bookings",
      BOOKING_PAGE_SCHEMA,
      { token, signal },
      { role: ApiBookingRoleSchema.parse(role), cursor, limit },
      "bookings",
    );
  },
  getBooking(id: string, token: string, signal?: AbortSignal) {
    return requestValidated(
      `/bookings/${id}`,
      ApiBookingSchema,
      { token, signal },
      undefined,
      `booking:${id}`,
    );
  },
  createBooking(
    input: { listingId: string; note?: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      "/bookings",
      ApiBookingSchema,
      {
        method: "POST",
        body: input,
        token,
        signal,
        headers: idempotencyHeaders(),
      },
      undefined,
      "createBooking",
    );
  },
  acceptBooking(
    id: string,
    input: { scheduledFor: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/bookings/${id}/accept`,
      ApiBookingSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      `acceptBooking:${id}`,
    );
  },
  declineBooking(
    id: string,
    input: { reason: "unavailable" | "not_a_fit" | "other" },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/bookings/${id}/decline`,
      ApiBookingSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      `declineBooking:${id}`,
    );
  },
  completeBooking(id: string, token: string, signal?: AbortSignal) {
    return requestValidated(
      `/bookings/${id}/complete`,
      ApiBookingSchema,
      { method: "POST", token, signal },
      undefined,
      `completeBooking:${id}`,
    );
  },
  cancelBooking(id: string, token: string, signal?: AbortSignal) {
    return requestValidated(
      `/bookings/${id}/cancel`,
      ApiBookingSchema,
      { method: "POST", token, signal },
      undefined,
      `cancelBooking:${id}`,
    );
  },
  listListingReviews(
    listingId: string,
    cursor?: string | null,
    limit = 20,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/listings/${listingId}/reviews`,
      REVIEW_PAGE_SCHEMA,
      { signal },
      { cursor, limit },
      `reviews:${listingId}`,
    );
  },
  writeReview(
    bookingId: string,
    input: { rating: number; body: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/bookings/${bookingId}/review`,
      ApiReviewSchema,
      {
        method: "POST",
        body: input,
        token,
        signal,
        headers: idempotencyHeaders(),
      },
      undefined,
      `writeReview:${bookingId}`,
    );
  },
  getMe(token: string, signal?: AbortSignal) {
    return requestValidated(
      "/me",
      ApiActorSchema,
      { token, signal },
      undefined,
      "me",
    );
  },
  becomeProvider(token: string, signal?: AbortSignal) {
    return requestValidated(
      "/me/capacities/provider",
      ApiActorSchema,
      { method: "POST", token, signal },
      undefined,
      "becomeProvider",
    );
  },
  signIn(input: { email: string; password: string }, signal?: AbortSignal) {
    return requestValidated(
      "/auth/sign-in",
      ApiAuthResultSchema,
      { method: "POST", body: input, signal },
      undefined,
      "signIn",
    );
  },
  signUp(
    input: {
      email: string;
      password: string;
      displayName: string;
      capacities?: Array<"customer" | "provider">;
    },
    signal?: AbortSignal,
  ) {
    return requestValidated(
      "/auth/sign-up",
      ApiAuthResultSchema,
      { method: "POST", body: input, signal },
      undefined,
      "signUp",
    );
  },
  refresh(refreshToken: string, signal?: AbortSignal) {
    return requestValidated(
      "/auth/refresh",
      ApiAuthResultSchema,
      { method: "POST", body: { refreshToken }, signal },
      undefined,
      "refresh",
    );
  },
  signOut(refreshToken: string, signal?: AbortSignal) {
    return request<void>("/auth/sign-out", {
      method: "POST",
      body: { refreshToken },
      signal,
    });
  },
  createReport(
    listingId: string,
    input: { reason: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/listings/${listingId}/report`,
      ApiReportSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      `createReport:${listingId}`,
    );
  },
  listReports(token: string, signal?: AbortSignal) {
    return requestValidated(
      "/reports",
      REPORT_PAGE_SCHEMA,
      { token, signal },
      undefined,
      "reports",
    );
  },
  resolveReport(
    id: string,
    input: { action: "remove" | "dismiss"; note?: string },
    token: string,
    signal?: AbortSignal,
  ) {
    return requestValidated(
      `/reports/${id}/resolve`,
      ApiReportSchema,
      { method: "POST", body: input, token, signal },
      undefined,
      `resolveReport:${id}`,
    );
  },
};
