export type ApiMoney = {
	amountMinor: number;
	currency: string;
};

export type ApiPricing =
	| { model: 'fixed'; price: ApiMoney }
	| { model: 'hourly'; hourlyRate: ApiMoney; minimumHours: number }
	| { model: 'quote'; startingFrom?: ApiMoney };

export type ApiListingStatus = 'draft' | 'published' | 'paused' | 'under_review' | 'removed';
export type ApiBookingStatus = 'requested' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type ApiCapacity = 'customer' | 'provider';
export type ApiPlatformRole = 'user' | 'moderator' | 'admin';
export type ApiBookingRole = 'customer' | 'provider';

export type ApiCategory = {
	id: string;
	slug: string;
	name: string;
};

export type ApiListingSearchItem = {
	id: string;
	title: string;
	categoryId: string;
	priceFrom: ApiMoney | null;
	status: ApiListingStatus;
	ratingAvg: number;
	ratingCount: number;
	distanceMeters: number;
};

export type ApiListing = {
	id: string;
	ownerId: string;
	categoryId: string;
	title: string;
	description: string;
	pricing: ApiPricing;
	priceFrom: ApiMoney | null;
	status: ApiListingStatus;
	ratingAvg: number;
	ratingCount: number;
	createdAt: string;
};

export type ApiBooking = {
	id: string;
	listingId: string;
	customerId: string;
	status: ApiBookingStatus;
	requestedAt: string;
	scheduledFor: string | null;
	completedAt: string | null;
	reviewId: string | null;
};

export type ApiActor = {
	id: string;
	capacities: ApiCapacity[];
	platformRole: ApiPlatformRole;
};

export type ApiAuthResult = {
	accessToken: string;
	refreshToken: string;
	actor: ApiActor;
};

export type ApiReview = {
	id: string;
	bookingId: string;
	listingId: string;
	authorId: string;
	rating: number;
	body: string;
	createdAt: string;
};

export type ApiReport = {
	id: string;
	listingId: string;
	reporterId: string;
	reason: string;
	status: 'open' | 'resolved' | 'dismissed';
	createdAt: string;
};

export type ApiPage<T> = {
	items: T[];
	nextCursor: string | null;
};
