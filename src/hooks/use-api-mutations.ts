import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { apiClient } from '@/api/client';
import { apiQueryKeys } from '@/hooks/use-api-queries';

export function usePublishListingMutation() {
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => apiClient.publishListing(id, token),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: apiQueryKeys.listing(id) });
      const prev = queryClient.getQueryData(apiQueryKeys.listing(id));
      queryClient.setQueryData(apiQueryKeys.listing(id), (old: any) => ({ ...(old ?? {}), status: 'published' }));
      return { prev };
    },
    onError: (_err, { id }, context: any) => {
      if (context?.prev) {
        queryClient.setQueryData(apiQueryKeys.listing(id), context.prev);
      }
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.listing(id) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.listings({}) });
    },
  });
}

export function usePauseListingMutation() {
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => apiClient.pauseListing(id, token),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: apiQueryKeys.listing(id) });
      const prev = queryClient.getQueryData(apiQueryKeys.listing(id));
      queryClient.setQueryData(apiQueryKeys.listing(id), (old: any) => ({ ...(old ?? {}), status: 'paused' }));
      return { prev };
    },
    onError: (_err, { id }, context: any) => {
      if (context?.prev) {
        queryClient.setQueryData(apiQueryKeys.listing(id), context.prev);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.listing(id) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.listings({}) });
    },
  });
}

export function useCreateBookingMutation() {
  return useMutation({
    mutationFn: ({ input, token }: { input: { listingId: string; note?: string }; token: string }) =>
      apiClient.createBooking(input, token),
    onSuccess: (booking) => {
      // invalidate bookings queries for the current user (both roles)
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.bookings(null, null) });
      // You may also navigate to the booking detail after the caller receives the booking
    },
  });
}

export function useAcceptBookingMutation() {
  return useMutation({
    mutationFn: ({ id, input, token }: { id: string; input: { scheduledFor: string }; token: string }) =>
      apiClient.acceptBooking(id, input, token),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.booking(id, null) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.bookings(null, null) });
    },
  });
}

export function useDeclineBookingMutation() {
  return useMutation({
    mutationFn: ({ id, input, token }: { id: string; input: { reason: string }; token: string }) =>
      apiClient.declineBooking(id, input as any, token),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.booking(id, null) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.bookings(null, null) });
    },
  });
}

export function useCancelBookingMutation() {
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => apiClient.cancelBooking(id, token),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.booking(id, null) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.bookings(null, null) });
    },
  });
}

export function useWriteReviewMutation() {
  return useMutation({
    mutationFn: ({ bookingId, input, token }: { bookingId: string; input: { rating: number; body: string }; token: string }) =>
      apiClient.writeReview(bookingId, input, token),
    onSuccess: (review, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.booking(bookingId, null) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.listingReviews(review.listingId) });
      queryClient.invalidateQueries({ queryKey: apiQueryKeys.bookings(null, null) });
    },
  });
}
