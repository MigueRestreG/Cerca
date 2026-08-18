// Re-export validated types from infrastructure
export type {
	ValidatedMoney as ApiMoney,
	ValidatedPricing as ApiPricing,
	ValidatedListingSearchItem as ApiListingSearchItem,
	ValidatedListing as ApiListing,
	ValidatedBooking as ApiBooking,
	ValidatedCategory as ApiCategory,
	ValidatedActor as ApiActor,
	ValidatedAuthResult as ApiAuthResult,
	ValidatedReview as ApiReview,
	ValidatedReport as ApiReport,
	Page as ApiPage,
} from '@/infrastructure/schemas';

export type ApiCapacity = 'customer' | 'provider';
export type ApiPlatformRole = 'user' | 'moderator' | 'admin';
export type ApiBookingRole = 'customer' | 'provider';
