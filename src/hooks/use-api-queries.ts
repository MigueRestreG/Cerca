import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/api/client';
import type { ApiBookingRole } from '@/api/types';

export const apiQueryKeys = {
  categories: ['categories'] as const,
  listings: (params: Record<string, unknown>) => ['listings', params] as const,
  listing: (id: string) => ['listing', id] as const,
  listingReviews: (id: string) => ['listingReviews', id] as const,
  bookings: (role: ApiBookingRole | null, token: string | null) => ['bookings', role, token] as const,
  booking: (id: string, token: string | null) => ['booking', id, token] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: apiQueryKeys.categories,
    queryFn: ({ signal }) => apiClient.getCategories(signal),
  });
}

export function useListingsQuery(params: {
  query?: string;
  categoryId?: string | null;
  cityId?: string | null;
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
  cursor?: string | null;
  limit?: number;
}) {
  return useQuery({
    queryKey: apiQueryKeys.listings(params),
    queryFn: ({ signal }) => apiClient.searchListings(params, signal),
  });
}

export function useListingQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: apiQueryKeys.listing(id ?? ''),
    queryFn: ({ signal }) => apiClient.getListing(id as string, signal),
    enabled: Boolean(id),
  });
}

export function useListingReviewsQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: apiQueryKeys.listingReviews(id ?? ''),
    queryFn: ({ signal }) => apiClient.listListingReviews(id as string, null, 10, signal),
    enabled: Boolean(id),
  });
}

export function useBookingsQuery(token: string | null, role: ApiBookingRole | null) {
  return useQuery({
    queryKey: apiQueryKeys.bookings(role, token),
    queryFn: ({ signal }) => apiClient.listBookings(token as string, role as ApiBookingRole, null, 20, signal),
    enabled: Boolean(token && role),
  });
}

export function useBookingQuery(id: string | null | undefined, token: string | null) {
  return useQuery({
    queryKey: apiQueryKeys.booking(id ?? '', token),
    queryFn: ({ signal }) => apiClient.getBooking(id as string, token as string, signal),
    enabled: Boolean(id && token),
  });
}