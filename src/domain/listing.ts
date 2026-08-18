import type { Money } from './money';

export type ListingId = string;
export type UserId = string;
export type CategoryId = string;

export type ListingStatus =
  | { kind: 'draft' }
  | { kind: 'published'; publishedAt: string }
  | { kind: 'paused' }
  | { kind: 'under_review'; reportId: string }
  | { kind: 'removed'; removedBy: UserId; reason: 'spam' | 'inappropriate' | 'fake' | 'other' };

export type Pricing =
  | { model: 'fixed'; price: Money }
  | { model: 'hourly'; hourlyRate: Money; minimumHours: number }
  | { model: 'quote'; startingFrom?: Money };

export interface Listing {
  readonly id: ListingId;
  readonly ownerId: UserId;
  readonly categoryId: CategoryId;
  readonly title: string;
  readonly description: string;
  readonly pricing: Pricing;
  readonly status: ListingStatus;
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly createdAt: string;
}

export interface ListingSearchItem {
  readonly id: ListingId;
  readonly title: string;
  readonly categoryId: CategoryId;
  readonly priceFrom: Money | null;
  readonly status: ListingStatus;
  readonly ratingAvg: number;
  readonly ratingCount: number;
  readonly distanceMeters: number;
}

export function canEditListing(listing: Listing, actorId: UserId): boolean {
  return listing.ownerId === actorId && listing.status.kind === 'draft';
}

export function getStatusLabel(status: ListingStatus): string {
  switch (status.kind) {
    case 'draft':
      return 'Draft';
    case 'published':
      return 'Published';
    case 'paused':
      return 'Paused';
    case 'under_review':
      return 'Under Review';
    case 'removed':
      return 'Removed';
  }
}
