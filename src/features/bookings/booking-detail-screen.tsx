import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, PrimaryButton, SecondaryButton } from '@/components/ui-kit';
import { useBookingQuery, useListingQuery } from '@/hooks/use-api-queries';
import {
  useAcceptBookingMutation,
  useDeclineBookingMutation,
  useCancelBookingMutation,
  useWriteReviewMutation,
} from '@/hooks/use-api-mutations';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/i18n';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';
import { canReviewBooking } from '@/lib/permissions';
import { formatApiErrorMessage } from '@/lib/api-errors';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, t } = useApp();
  const theme = useTheme();
  const { actor, accessToken } = useAuth();
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewBody, setReviewBody] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  // mutation loading states are used instead of local busyAction state
  const acceptMutation = useAcceptBookingMutation();
  const declineMutation = useDeclineBookingMutation();
  const cancelMutation = useCancelBookingMutation();
  const reviewMutation = useWriteReviewMutation();

  const booking = useBookingQuery(typeof id === 'string' ? id : null, accessToken);
  const listing = useListingQuery(booking.data?.listingId ?? null);

  const isOwner = Boolean(actor && listing.data && actor.id === listing.data.ownerId);
  const isCustomer = Boolean(actor && booking.data && actor.id === booking.data.customerId);

  async function handleAccept() {
    if (!booking.data || !accessToken) {
      return;
    }

    const scheduledFor = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    acceptMutation.mutate({ id: booking.data.id, input: { scheduledFor }, token: accessToken }, {
      onSuccess: async () => {
        await booking.refetch();
        setMessage(t('booking.accepted'));
      },
    });
  }

  async function handleDecline() {
    if (!booking.data || !accessToken) {
      return;
    }

    declineMutation.mutate({ id: booking.data.id, input: { reason: 'unavailable' }, token: accessToken }, {
      onSuccess: async () => {
        await booking.refetch();
        setMessage(t('booking.declined'));
      },
    });
  }

  async function handleCancel() {
    if (!booking.data || !accessToken) {
      return;
    }

    cancelMutation.mutate({ id: booking.data.id, token: accessToken }, {
      onSuccess: async () => {
        await booking.refetch();
        setMessage(t('booking.cancelled'));
      },
    });
  }

  async function handleReview() {
    if (!booking.data || !accessToken) {
      return;
    }

    reviewMutation.mutate({ bookingId: booking.data.id, input: { rating: Math.min(5, Math.max(1, Number.parseInt(reviewRating, 10) || 5)), body: reviewBody.trim() || t('booking.reviewDefault') }, token: accessToken }, {
      onSuccess: async () => {
        await booking.refetch();
        setMessage(t('booking.review'));
      },
    });
  }

  if (booking.isLoading || (listing.isLoading && !listing.data)) {
    return (
      <AppScreen>
        <EmptyState title={t('booking.detailTitle')} body={t('common.loading')} />
      </AppScreen>
    );
  }

  if (booking.error || !booking.data) {
    return (
      <AppScreen>
        <EmptyState title={t('booking.detailTitle')} body={formatApiErrorMessage(booking.error, language)} actionLabel={t('common.back')} onActionPress={() => router.back()} />
      </AppScreen>
    );
  }

  const reviewGate = canReviewBooking(actor, booking.data);
  const canReview = reviewGate.allowed;
  const reviewReasonText = reviewGate.allowed
    ? t('booking.review')
    : reviewGate.reason === 'not_your_booking'
      ? 'Solo el cliente de esta reserva puede reseñar.'
      : reviewGate.reason === 'not_completed'
        ? 'La reserva todavía no está completada.'
        : reviewGate.reason === 'already_reviewed'
          ? 'Esta reserva ya fue reseñada.'
          : 'La ventana para reseñar ya cerró.';

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 12 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>{t('booking.detailTitle')}</Text>
            <Text style={{ fontSize: 30, lineHeight: 36, fontWeight: '800', textTransform: 'uppercase', color: theme.text }}>
              {listing.data?.title ?? booking.data.listingId}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <Card style={{ flex: 1, minWidth: 160 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('booking.status')}</Text>
              <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: '900', color: theme.text }}>{booking.data.status}</Text>
            </Card>
            <Card style={{ flex: 1, minWidth: 160 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('booking.customer')}</Text>
              <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: '900', color: theme.accentStrong }}>{booking.data.customerId}</Text>
            </Card>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>{t('booking.requestedAt')}: <Text style={{ color: theme.text }}>{new Date(booking.data.requestedAt).toLocaleString()}</Text></Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>{t('booking.scheduledFor')}: <Text style={{ color: theme.text }}>{booking.data.scheduledFor ?? '—'}</Text></Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>{t('booking.reviewId')}: <Text style={{ color: theme.text }}>{booking.data.reviewId ?? '—'}</Text></Text>
            <Text style={{ fontSize: 18, fontWeight: '900', color: theme.accentStrong }}>{listing.data?.priceFrom ? formatMoney(listing.data.priceFrom, language) : '—'}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.textSecondary }}>
          {message ?? (canReview ? t('booking.review') : t('bookings.reviewLocked'))}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {isOwner && booking.data.status === 'requested' ? <PrimaryButton label={t('booking.accept')} onPress={handleAccept} loading={(acceptMutation as any).isLoading} /> : null}
          {isOwner && booking.data.status === 'requested' ? <SecondaryButton label={t('booking.decline')} onPress={handleDecline} loading={(declineMutation as any).isLoading} /> : null}
          {isCustomer && booking.data.status !== 'completed' ? <PrimaryButton label={t('booking.cancel')} onPress={handleCancel} loading={(cancelMutation as any).isLoading} /> : null}
          <PrimaryButton label={t('booking.markReviewed')} onPress={handleReview} disabled={!canReview || (reviewMutation as any).isLoading} loading={(reviewMutation as any).isLoading} />
          <SecondaryButton label={t('common.back')} onPress={() => router.back()} />
        </View>
      </Card>

      <Card>
        <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.textSecondary }}>
          {reviewReasonText}
        </Text>
      </Card>

      {canReview ? (
        <Card>
          <View style={{ gap: 10 }}>
            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.backgroundSelected, borderRadius: 16, paddingHorizontal: 14 }}>
              <TextInput value={reviewRating} onChangeText={setReviewRating} keyboardType="number-pad" placeholder="5" placeholderTextColor={theme.textSecondary} style={{ color: theme.text, fontSize: 15, fontWeight: '600', paddingVertical: 12 }} />
            </View>
            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.backgroundSelected, borderRadius: 16, paddingHorizontal: 14 }}>
              <TextInput value={reviewBody} onChangeText={setReviewBody} placeholder={t('booking.reviewDefault')} placeholderTextColor={theme.textSecondary} style={{ color: theme.text, fontSize: 15, fontWeight: '600', paddingVertical: 12 }} multiline />
            </View>
          </View>
        </Card>
      ) : null}
    </AppScreen>
  );
}
