import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { apiClient } from '@/api/client';
import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, PrimaryButton, SecondaryButton } from '@/components/ui-kit';
import { useRemoteData } from '@/hooks/use-remote-data';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/i18n';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, t } = useApp();
  const theme = useTheme();
  const { actor, accessToken } = useAuth();
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewBody, setReviewBody] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const booking = useRemoteData((signal) => {
    if (typeof id !== 'string' || !accessToken) {
      return Promise.reject(new Error('Missing booking id'));
    }

    return apiClient.getBooking(id, accessToken, signal);
  }, [id, accessToken]);

  const listing = useRemoteData((signal) => {
    if (!booking.data) {
      return Promise.resolve(null);
    }

    return apiClient.getListing(booking.data.listingId, signal);
  }, [booking.data?.listingId]);

  const isOwner = Boolean(actor && listing.data && actor.id === listing.data.ownerId);
  const isCustomer = Boolean(actor && booking.data && actor.id === booking.data.customerId);

  async function handleAccept() {
    if (!booking.data || !accessToken) {
      return;
    }

    const scheduledFor = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await apiClient.acceptBooking(booking.data.id, { scheduledFor }, accessToken);
    booking.refresh();
    setMessage(t('booking.accepted'));
  }

  async function handleDecline() {
    if (!booking.data || !accessToken) {
      return;
    }

    await apiClient.declineBooking(booking.data.id, { reason: 'unavailable' }, accessToken);
    booking.refresh();
    setMessage(t('booking.declined'));
  }

  async function handleCancel() {
    if (!booking.data || !accessToken) {
      return;
    }

    await apiClient.cancelBooking(booking.data.id, accessToken);
    booking.refresh();
    setMessage(t('booking.cancelled'));
  }

  async function handleReview() {
    if (!booking.data || !accessToken) {
      return;
    }

    await apiClient.writeReview(
      booking.data.id,
      { rating: Math.min(5, Math.max(1, Number.parseInt(reviewRating, 10) || 5)), body: reviewBody.trim() || t('booking.reviewDefault') },
      accessToken,
    );
    booking.refresh();
    setMessage(t('booking.review'));
  }

  if (booking.loading || (listing.loading && !listing.data)) {
    return (
      <AppScreen>
        <EmptyState title={t('booking.detailTitle')} body={t('common.loading')} />
      </AppScreen>
    );
  }

  if (booking.error || !booking.data) {
    return (
      <AppScreen>
        <EmptyState title={t('booking.detailTitle')} body={booking.error ?? String(id ?? '')} actionLabel={t('common.back')} onActionPress={() => router.back()} />
      </AppScreen>
    );
  }

  const canReview = booking.data.status === 'completed' && !booking.data.reviewId;

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
          {isOwner && booking.data.status === 'requested' ? <PrimaryButton label={t('booking.accept')} onPress={handleAccept} /> : null}
          {isOwner && booking.data.status === 'requested' ? <SecondaryButton label={t('booking.decline')} onPress={handleDecline} /> : null}
          {isCustomer && booking.data.status !== 'completed' ? <PrimaryButton label={t('booking.cancel')} onPress={handleCancel} /> : null}
          {canReview ? <PrimaryButton label={t('booking.markReviewed')} onPress={handleReview} /> : null}
          <SecondaryButton label={t('common.back')} onPress={() => router.back()} />
        </View>
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
