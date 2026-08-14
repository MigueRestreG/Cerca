import type { ApiActor, ApiBooking } from '@/api/types';

export type ReviewBlockReason =
  | 'not_your_booking'
  | 'not_completed'
  | 'already_reviewed'
  | 'window_closed';

export type Permission =
  | 'booking:create'
  | 'booking:review'
  | 'provider:become'
  | 'listing:publish';

export function can(actor: ApiActor | null | undefined, permission: Permission) {
  const capacities = actor?.capacities ?? [];

  switch (permission) {
    case 'booking:create':
      return capacities.includes('customer');
    case 'booking:review':
      return capacities.includes('customer');
    case 'provider:become':
      return !capacities.includes('provider');
    case 'listing:publish':
      return capacities.includes('provider');
    default:
      return false;
  }
}

export function canReviewBooking(
  actor: ApiActor | null | undefined,
  booking: Pick<ApiBooking, 'customerId' | 'status' | 'reviewId' | 'completedAt'>,
): { allowed: true } | { allowed: false; reason: ReviewBlockReason } {
  if (!actor || actor.id !== booking.customerId) {
    return { allowed: false, reason: 'not_your_booking' };
  }

  if (booking.status !== 'completed') {
    return { allowed: false, reason: 'not_completed' };
  }

  if (booking.reviewId) {
    return { allowed: false, reason: 'already_reviewed' };
  }

  if (booking.completedAt) {
    const completedAt = new Date(booking.completedAt).getTime();
    const windowClosedAt = completedAt + 1000 * 60 * 60 * 24 * 30;

    if (Number.isFinite(completedAt) && Date.now() > windowClosedAt) {
      return { allowed: false, reason: 'window_closed' };
    }
  }

  return { allowed: true };
}