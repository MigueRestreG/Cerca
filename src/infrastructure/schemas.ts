import { z } from 'zod';

// Money
export const moneySchema = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: z.enum(['MXN', 'USD', 'BRL', 'COP', 'EUR']),
});

export type ValidatedMoney = z.infer<typeof moneySchema>;

// Pricing
export const pricingSchema = z.union([
  z.object({
    model: z.literal('fixed'),
    price: moneySchema,
  }),
  z.object({
    model: z.literal('hourly'),
    hourlyRate: moneySchema,
    minimumHours: z.number().int().positive(),
  }),
  z.object({
    model: z.literal('quote'),
    startingFrom: moneySchema.optional(),
  }),
]);

export type ValidatedPricing = z.infer<typeof pricingSchema>;

// Listing Status
export const listingStatusSchema = z.union([
  z.object({ kind: z.literal('draft') }),
  z.object({ kind: z.literal('published'), publishedAt: z.string() }),
  z.object({ kind: z.literal('paused') }),
  z.object({
    kind: z.literal('under_review'),
    reportId: z.string(),
  }),
  z.object({
    kind: z.literal('removed'),
    removedBy: z.string(),
    reason: z.enum(['spam', 'inappropriate', 'fake', 'other']),
  }),
]);

// Booking Status  
export const bookingStatusSchema = z.union([
  z.object({ kind: z.literal('requested'), requestedAt: z.string() }),
  z.object({
    kind: z.literal('accepted'),
    acceptedAt: z.string(),
    scheduledFor: z.string(),
  }),
  z.object({
    kind: z.literal('declined'),
    reason: z.enum(['unavailable', 'not_a_fit', 'other']),
  }),
  z.object({ kind: z.literal('completed'), completedAt: z.string() }),
  z.object({
    kind: z.literal('cancelled'),
    cancelledBy: z.string(),
    at: z.string(),
  }),
]);

// Listing
export const listingSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  pricing: pricingSchema,
  priceFrom: moneySchema.nullable().optional().default(null),
  status: listingStatusSchema,
  ratingAvg: z.number().min(0).max(5),
  ratingCount: z.number().nonnegative(),
  createdAt: z.string(),
});

export type ValidatedListing = z.infer<typeof listingSchema>;

export const listingSearchItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  priceFrom: moneySchema.nullable(),
  status: listingStatusSchema,
  ratingAvg: z.number().min(0).max(5),
  ratingCount: z.number().nonnegative(),
  distanceMeters: z.number().nonnegative(),
});

export type ValidatedListingSearchItem = z.infer<typeof listingSearchItemSchema>;

// Booking
export const bookingSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  customerId: z.string(),
  status: bookingStatusSchema,
  reviewId: z.string().nullable(),
});

export type ValidatedBooking = z.infer<typeof bookingSchema>;

// Category
export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export type ValidatedCategory = z.infer<typeof categorySchema>;

// Review
export const reviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  listingId: z.string(),
  authorId: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string(),
  createdAt: z.string(),
});

export type ValidatedReview = z.infer<typeof reviewSchema>;

// Report
export const reportSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  reporterId: z.string(),
  reason: z.string(),
  status: z.enum(['open', 'resolved', 'dismissed']),
  createdAt: z.string(),
});

export type ValidatedReport = z.infer<typeof reportSchema>;

// Actor/Auth
export const actorSchema = z.object({
  id: z.string(),
  capacities: z.array(z.enum(['customer', 'provider'])),
  platformRole: z.enum(['user', 'moderator', 'admin']),
});

export type ValidatedActor = z.infer<typeof actorSchema>;

export const authResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  actor: actorSchema,
});

export type ValidatedAuthResult = z.infer<typeof authResultSchema>;

// Page/Pagination
export const pageSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });

export type Page<T> = {
  items: T[];
  nextCursor: string | null;
};
