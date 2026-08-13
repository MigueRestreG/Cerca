import { z } from "zod";

export const ApiMoneySchema = z.object({
  amountMinor: z.number().int(),
  currency: z.string(),
});

export const ApiPricingSchema = z.discriminatedUnion("model", [
  z.object({
    model: z.literal("fixed"),
    price: ApiMoneySchema,
  }),
  z.object({
    model: z.literal("hourly"),
    hourlyRate: ApiMoneySchema,
    minimumHours: z.number().int().min(1),
  }),
  z.object({
    model: z.literal("quote"),
    startingFrom: ApiMoneySchema.optional(),
  }),
]);

export const ApiCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export const ApiListingStatusSchema = z.enum([
  "draft",
  "published",
  "paused",
  "under_review",
  "removed",
]);

export const ApiBookingStatusSchema = z.enum([
  "requested",
  "accepted",
  "declined",
  "completed",
  "cancelled",
]);

export const ApiCapacitySchema = z.enum(["customer", "provider"]);
export const ApiPlatformRoleSchema = z.enum(["user", "moderator", "admin"]);
export const ApiBookingRoleSchema = z.enum(["customer", "provider"]);

export const ApiListingSearchItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  priceFrom: ApiMoneySchema.nullable(),
  status: ApiListingStatusSchema,
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
  distanceMeters: z.number(),
});

export const ApiListingSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  pricing: ApiPricingSchema,
  priceFrom: ApiMoneySchema.nullable(),
  status: ApiListingStatusSchema,
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
  createdAt: z.string(),
});

export const ApiBookingSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  customerId: z.string(),
  status: ApiBookingStatusSchema,
  requestedAt: z.string(),
  scheduledFor: z.string().nullable(),
  completedAt: z.string().nullable(),
  reviewId: z.string().nullable(),
});

export const ApiActorSchema = z.object({
  id: z.string(),
  capacities: z.array(ApiCapacitySchema),
  platformRole: ApiPlatformRoleSchema,
});

export const ApiAuthResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  actor: ApiActorSchema,
});

export const ApiReviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  listingId: z.string(),
  authorId: z.string(),
  rating: z.number().int().min(1).max(5),
  body: z.string(),
  createdAt: z.string(),
});

export const ApiReportSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  reporterId: z.string(),
  reason: z.string(),
  status: z.enum(["open", "resolved", "dismissed"]),
  createdAt: z.string(),
});

export const createPageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  });
