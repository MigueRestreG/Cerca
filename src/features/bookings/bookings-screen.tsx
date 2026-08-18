import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { apiClient } from '@/api/client';
import type { ApiBooking, ApiBookingRole } from '@/api/types';
import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, Pill, SecondaryButton, SectionTitle } from '@/components/ui-kit';
import { useRemoteData } from '@/hooks/use-remote-data';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

function BookingRow({ booking, listingTitle, language, t }: { booking: ApiBooking; listingTitle: string; language: 'es' | 'en' | 'pt'; t: (key: string) => string }) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }} numberOfLines={1}>
          {listingTitle}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>
          {t(`booking.statusValues.${booking.status.kind}`)} · {booking.reviewId ? t('bookings.reviewed') : t('bookings.pending')}
        </Text>
        {booking.status.kind === 'requested' && (
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{new Date(booking.status.requestedAt).toLocaleString(language === 'es' ? 'es-MX' : language === 'pt' ? 'pt-BR' : 'en-US')}</Text>
        )}
        <SecondaryButton label={t('common.viewDetails')} href={`/(app)/booking/${booking.id}`} />
      </View>
    </Card>
  );
}

export default function BookingsScreen() {
  const { language, t } = useApp();
  const theme = useTheme();
  const { actor, accessToken } = useAuth();
  const availableRoles = useMemo(() => actor?.capacities ?? ['customer'], [actor?.capacities]);
  const [selectedRole, setSelectedRole] = useState<ApiBookingRole>('customer');

  // Validate and update selected role if it's no longer available
  useEffect(() => {
    if (availableRoles.length > 0 && !availableRoles.includes(selectedRole)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRole(availableRoles[0] as ApiBookingRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableRoles]);

  const bookings = useRemoteData(
    (signal) => {
      if (!accessToken) {
        return Promise.resolve({ items: [], nextCursor: null });
      }

      return apiClient.listBookings(accessToken, selectedRole, null, 20, signal);
    },
    [accessToken, selectedRole],
  );
  const refreshBookings = bookings.refresh;

  useFocusEffect(
    useCallback(() => {
      if (availableRoles.includes('customer')) {
        setSelectedRole('customer');
      }

      refreshBookings();
    }, [availableRoles, refreshBookings]),
  );

  const titleByListingId = useRemoteData(async (signal) => {
    if (!bookings.data?.items.length || !accessToken) {
      return new Map<string, string>();
    }

    const entries = await Promise.all(
      bookings.data.items.map(async (booking) => {
        const listing = await apiClient.getListing(booking.listingId, signal, accessToken ?? undefined);
        return [booking.listingId, listing.title] as const;
      }),
    );

    return new Map(entries);
  }, [bookings.data?.items, accessToken]);

  const completed = useMemo(() => (bookings.data?.items ?? []).filter((booking) => booking.status.kind === 'completed'), [bookings.data?.items]);
  const upcoming = useMemo(() => (bookings.data?.items ?? []).filter((booking) => booking.status.kind !== 'completed'), [bookings.data?.items]);

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>
            {t('bookings.title')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 23, fontWeight: '500', color: theme.textSecondary, maxWidth: 760 }}>
            {t('bookings.subtitle')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {availableRoles.map((role) => (
              <Pill key={role} label={t(`bookings.roles.${role}`)} selected={selectedRole === role} onPress={() => setSelectedRole(role as ApiBookingRole)} />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Card style={{ flex: 1, minWidth: 160 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('bookings.upcoming')}</Text>
            <Text style={{ fontSize: 28, lineHeight: 32, fontWeight: '900', color: theme.text }}>{upcoming.length}</Text>
          </Card>
          <Card style={{ flex: 1, minWidth: 160 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase', color: theme.textSecondary }}>{t('bookings.completed')}</Text>
            <Text style={{ fontSize: 28, lineHeight: 32, fontWeight: '900', color: theme.accentStrong }}>{completed.length}</Text>
          </Card>
        </View>
      </Card>

      <SectionTitle title={t('bookings.upcoming')} />
      <View style={{ gap: 12 }}>
        {bookings.loading ? <Text style={{ color: theme.textSecondary }}>{t('common.loading')}</Text> : null}
        {!bookings.loading && bookings.error ? <EmptyState title={t('search.errorTitle')} body={bookings.error} actionLabel={t('common.retry')} onActionPress={bookings.refresh} /> : null}
        {!bookings.loading && upcoming.length === 0 ? <EmptyState title={t('bookings.upcoming')} body={t('bookings.reviewLocked')} /> : null}
        {upcoming.map((booking) => (
          <BookingRow key={booking.id} booking={booking} listingTitle={titleByListingId.data?.get(booking.listingId) ?? booking.listingId} language={language} t={t} />
        ))}
      </View>

      <SectionTitle title={t('bookings.completed')} />
      <View style={{ gap: 12 }}>
        {!bookings.loading && completed.length === 0 ? <EmptyState title={t('bookings.completed')} body={t('bookings.reviewLocked')} /> : null}
        {completed.map((booking) => (
          <BookingRow key={booking.id} booking={booking} listingTitle={titleByListingId.data?.get(booking.listingId) ?? booking.listingId} language={language} t={t} />
        ))}
      </View>
    </AppScreen>
  );
}
