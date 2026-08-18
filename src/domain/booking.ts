export type BookingId = string;
export type UserId = string;
export type ListingId = string;

export type BookingStatus =
  | { kind: 'requested'; requestedAt: string }
  | { kind: 'accepted'; acceptedAt: string; scheduledFor: string }
  | { kind: 'declined'; reason: 'unavailable' | 'not_a_fit' | 'other' }
  | { kind: 'completed'; completedAt: string }
  | { kind: 'cancelled'; cancelledBy: UserId; at: string };

export interface Booking {
  readonly id: BookingId;
  readonly listingId: ListingId;
  readonly customerId: UserId;
  readonly status: BookingStatus;
  readonly reviewId: string | null;
}

export type BookingRole = 'customer' | 'provider';

export function getBookingRole(booking: Booking, actorId: UserId): BookingRole | null {
  if (booking.customerId === actorId) return 'customer';
  // TODO: Check if actor owns the listing
  return null;
}

export function getStatusLabel(status: BookingStatus): string {
  switch (status.kind) {
    case 'requested':
      return 'Requested';
    case 'accepted':
      return 'Accepted';
    case 'declined':
      return 'Declined';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
  }
}
