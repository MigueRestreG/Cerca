import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, PrimaryButton, SecondaryButton } from '@/components/ui-kit';
import { useCategoriesQuery, useListingQuery, useListingReviewsQuery } from '@/hooks/use-api-queries';
import { useTheme } from '@/hooks/use-theme';
import { formatCompactNumber, formatMoney } from '@/i18n';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';
import { can } from '@/lib/permissions';
import {
  usePublishListingMutation,
  usePauseListingMutation,
  useCreateBookingMutation,
} from '@/hooks/use-api-mutations';
import { formatApiErrorMessage } from '@/lib/api-errors';

function formatCreatedAt(value: string, language: 'es' | 'en' | 'pt') {
  return new Intl.DateTimeFormat(language === 'es' ? 'es-MX' : language === 'pt' ? 'pt-BR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, t } = useApp();
  const theme = useTheme();
  const { actor, accessToken } = useAuth();
  const [bookingNote, setBookingNote] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const categories = useCategoriesQuery();
  const listing = useListingQuery(typeof id === 'string' ? id : null);
  const reviews = useListingReviewsQuery(listing.data?.id ?? null);

  const categoryLabel = categories.data?.find((category) => category.id === listing.data?.categoryId)?.name ?? listing.data?.categoryId ?? '';
  const isOwner = Boolean(actor && listing.data && actor.id === listing.data.ownerId);
  const canBook = can(actor, 'booking:create');
  const publishMutation = usePublishListingMutation();
  const pauseMutation = usePauseListingMutation();
  const createBookingMutation = useCreateBookingMutation();

  async function handlePublishToggle() {
    if (!listing.data || !accessToken) return;

    if (listing.data.status === 'published') {
      pauseMutation.mutate({ id: listing.data.id, token: accessToken }, {
        onSuccess(updated) {
          setActionMessage(updated.status);
        },
      });
      return;
    }

    publishMutation.mutate({ id: listing.data.id, token: accessToken }, {
      onSuccess(updated) {
        setActionMessage(updated.status);
      },
    });
  }

  async function handleBookNow() {
    if (!listing.data || !accessToken) return;

    createBookingMutation.mutate(
      { input: { listingId: listing.data.id, note: bookingNote.trim() || undefined }, token: accessToken },
      {
        onSuccess(booking) {
          router.push(`/(app)/booking/${booking.id}`);
        },
      },
    );
  }

  if (listing.isLoading || (reviews.isLoading && !reviews.data)) {
    return (
      <AppScreen>
        <EmptyState title={t('common.loading')} body={t('listing.loadingBody')} />
      </AppScreen>
    );
  }

  if (listing.error || !listing.data) {
    return (
      <AppScreen>
        <EmptyState title={t('listing.detailTitle')} body={formatApiErrorMessage(listing.error, language)} actionLabel={t('common.back')} onActionPress={() => router.back()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>{t('listing.detailTitle')}</Text>
            <Text style={{ fontSize: 32, lineHeight: 38, fontWeight: '800', textTransform: 'uppercase', color: theme.text }}>
              {listing.data.title}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 23, fontWeight: '500', color: theme.textSecondary, maxWidth: 820 }}>{listing.data.description}</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <Card style={{ flex: 1, minWidth: 160 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('listing.rating')}</Text>
              <Text style={{ fontSize: 22, lineHeight: 26, fontWeight: '900', color: theme.text }}>{listing.data.ratingAvg.toFixed(1)} · {formatCompactNumber(listing.data.ratingCount, language)}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: 160 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('listing.status')}</Text>
              <Text style={{ fontSize: 22, lineHeight: 26, fontWeight: '900', color: theme.accentStrong }}>{listing.data.status}</Text>
            </Card>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: theme.accentStrong }}>{listing.data.priceFrom ? formatMoney(listing.data.priceFrom, language) : t('listing.quoteOnly')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{t('listing.owner')}: <Text style={{ color: theme.text }}>{listing.data.ownerId}</Text></Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{t('listing.createdAt')}: <Text style={{ color: theme.text }}>{formatCreatedAt(listing.data.createdAt, language)}</Text></Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{t('listing.category')}: <Text style={{ color: theme.text }}>{categoryLabel}</Text></Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{t('listing.pricing')}: <Text style={{ color: theme.text }}>{listing.data.pricing.model}</Text></Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>{t('listing.reviewHint')}</Text>
        <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.text }}>{listing.data.pricing.model === 'fixed' ? formatMoney(listing.data.pricing.price, language) : listing.data.pricing.model}</Text>
      </Card>

      <Card>
        <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.textSecondary }}>{isOwner ? t('listing.ownerActions') : t('listing.bookingHint')}</Text>
        <View style={{ gap: 10 }}>
          {actionMessage ? <Text style={{ fontSize: 13, fontWeight: '700', color: theme.accentStrong }}>{actionMessage}</Text> : null}
          {!isOwner ? (
            <View style={{ gap: 10 }}>
              <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.backgroundSelected, borderRadius: 16, paddingHorizontal: 14 }}>
                <TextInput value={bookingNote} onChangeText={setBookingNote} placeholder={t('listing.notePlaceholder')} placeholderTextColor={theme.textSecondary} style={{ color: theme.text, fontSize: 15, fontWeight: '600', paddingVertical: 12 }} />
              </View>
              <PrimaryButton label={t('listing.booking')} onPress={handleBookNow} disabled={!canBook || (createBookingMutation as any).isLoading} loading={(createBookingMutation as any).isLoading} />
            </View>
          ) : null}
          {isOwner ? <PrimaryButton label={listing.data.status === 'published' ? t('listing.pause') : t('listing.publish')} onPress={handlePublishToggle} loading={(publishMutation as any).isLoading || (pauseMutation as any).isLoading} /> : null}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <SecondaryButton
            label={t('common.back')}
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>{t('listing.reviews')}</Text>
        <View style={{ gap: 12 }}>
          {reviews.data?.items.map((review) => (
            <View key={review.id} style={{ gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>{review.rating}/5</Text>
              <Text style={{ fontSize: 14, lineHeight: 20, color: theme.textSecondary }}>{review.body}</Text>
            </View>
          ))}
          {reviews.data && reviews.data.items.length === 0 ? <Text style={{ fontSize: 14, color: theme.textSecondary }}>{t('listing.noReviews')}</Text> : null}
        </View>
      </Card>
    </AppScreen>
  );
}
