import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DemoBooking, Language } from '@/domain/demo-market';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/i18n';

export function BookingCard({ booking, language, href }: { booking: DemoBooking; language: Language; href?: string }) {
  const theme = useTheme();
  const statusColor = booking.status === 'completed' ? theme.success : booking.status === 'accepted' ? theme.accent : theme.warning;

  const content = (
    <Pressable style={({ pressed }) => [styles.bookingPressable, pressed && styles.buttonPressed]}>
      <View style={[styles.bookingCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <View style={styles.bookingHeader}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={[styles.listingTitle, { color: theme.text }]} numberOfLines={1}>
              {booking.customerName}
            </Text>
            <Text style={[styles.bookingSubtle, { color: theme.textSecondary }]} numberOfLines={1}>
              {booking.location[language]}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}40` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{booking.status}</Text>
          </View>
        </View>
        <Text style={[styles.bookingNote, { color: theme.textSecondary }]}>{booking.note[language]}</Text>
        <View style={styles.bookingMetaRow}>
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>{booking.scheduledAt}</Text>
          <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
          <Text style={[styles.metaText, { color: theme.accentStrong }]}>{formatMoney(booking.price, language)}</Text>
        </View>
      </View>
    </Pressable>
  );

  return href ? (
    <Link href={href as never} asChild>
      {content}
    </Link>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  bookingPressable: {
    width: '100%',
  },
  bookingCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bookingSubtle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  bookingNote: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  bookingMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
  listingTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  metaDot: {
    fontSize: 12,
    fontWeight: '700',
  },
});