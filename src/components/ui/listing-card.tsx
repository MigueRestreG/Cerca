import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DemoListing, Language } from '@/domain/demo-market';
import { useTheme } from '@/hooks/use-theme';
import { formatCompactNumber, formatDistance, formatMoney } from '@/i18n';

export function ListingCard({ listing, language, href }: { listing: DemoListing; language: Language; href?: string }) {
  const theme = useTheme();

  const content = (
    <Pressable style={({ pressed }) => [styles.listingPressable, pressed && styles.buttonPressed]}>
      <View style={styles.listingCard}>
        <LinearGradient
          colors={[listing.palette[0], listing.palette[1], 'rgba(4,5,6,0.96)']}
          locations={[0, 0.62, 1]}
          start={{ x: 0.05, y: 0.05 }}
          end={{ x: 1, y: 1 }}
          style={styles.listingCover}>
          <View style={[styles.coverGlowOrb, { backgroundColor: listing.palette[1] }]} />
          <View style={[styles.coverGlowLine, { backgroundColor: theme.accent }]} />
          <View style={styles.coverMetaRow}>
            <Text style={[styles.coverMeta, { color: 'rgba(255,255,255,0.86)' }]}>{listing.providerName}</Text>
            <Text style={[styles.coverMeta, { color: 'rgba(255,255,255,0.72)' }]}>{formatDistance(listing.distanceKm, language)}</Text>
          </View>
        </LinearGradient>
        <View style={[styles.listingBody, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
          <View style={styles.listingTopRow}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={[styles.listingTitle, { color: theme.text }]} numberOfLines={2}>
                {listing.title[language]}
              </Text>
              <Text style={[styles.listingSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
                {listing.description[language]}
              </Text>
            </View>
            <View style={styles.priceWrap}>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>FROM</Text>
              <Text style={[styles.priceText, { color: theme.accentStrong }]}>{formatMoney(listing.price, language)}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>{listing.providerTitle[language]}</Text>
            <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>{formatCompactNumber(listing.reviews, language)} reviews</Text>
            <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>{listing.responseTime[language]}</Text>
          </View>
          <View style={styles.tagRow}>
            {listing.tags[language].slice(0, 3).map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: 'rgba(51, 225, 138, 0.08)', borderColor: theme.border }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
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
  listingPressable: {
    width: '100%',
  },
  listingCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0B0F12',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 7,
  },
  listingCover: {
    height: 148,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  coverGlowOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    right: -60,
    top: -44,
    opacity: 0.62,
  },
  coverGlowLine: {
    position: 'absolute',
    left: 18,
    bottom: 14,
    width: 84,
    height: 2,
    borderRadius: 999,
    opacity: 0.85,
  },
  coverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  coverMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.45,
    textTransform: 'uppercase',
  },
  listingBody: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  listingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  listingTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  listingSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 96,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    color: '#33E18A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
});