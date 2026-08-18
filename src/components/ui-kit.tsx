import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import type { DemoBooking, DemoListing, Language } from '@/domain/demo-market';
import { useTheme } from '@/hooks/use-theme';
import { formatCompactNumber, formatDistance, formatMoney } from '@/i18n';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function SurfaceCard({ children, style }: CardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.cardOuter, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardBorder}>
        <View
          style={[
            styles.cardSurface,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              shadowColor: '#000000',
            },
          ]}>
          <View style={[styles.cardGlow, styles.cardGlowLeft, { backgroundColor: theme.blueGlow }]} />
          <View style={[styles.cardGlow, styles.cardGlowRight, { backgroundColor: theme.primaryGlow }]} />
          <View style={[styles.cardGlow, styles.cardGlowTop, { backgroundColor: theme.whiteGlow }]} />
          <View style={styles.cardContent}>{children}</View>
        </View>
      </LinearGradient>
    </View>
  );
}

export function Card({ children, style }: CardProps) {
  return <SurfaceCard style={style}>{children}</SurfaceCard>;
}

export function SectionTitle({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderCopy}>
        <Text style={[styles.sectionKicker, { color: theme.accent }]}>{title}</Text>
        {subtitle ? <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.sectionAction,
            {
              borderColor: theme.border,
              backgroundColor: 'rgba(255,255,255,0.02)',
            },
            pressed && styles.pressed,
          ]}>
          <Text style={{ color: theme.text, fontWeight: '700', letterSpacing: 0.4 }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Pill({ label, selected = false, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          borderColor: selected ? theme.accent : theme.border,
          backgroundColor: selected ? 'rgba(51, 225, 138, 0.10)' : theme.backgroundElement,
        },
        pressed && styles.pressed,
      ]}>
      <Text
        style={{
          color: selected ? theme.accentStrong : theme.textSecondary,
          fontWeight: selected ? '700' : '600',
          letterSpacing: 0.35,
          textTransform: 'uppercase',
          fontSize: 12,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LanguageSwitcher({
  value,
  onChange,
  languages,
}: {
  value: Language;
  onChange: (language: Language) => void;
  languages: readonly { code: Language; label: string }[];
}) {
  return (
    <View style={styles.switchRow}>
      {languages.map((language) => (
        <Pill key={language.code} label={language.label} selected={value === language.code} onPress={() => onChange(language.code)} />
      ))}
    </View>
  );
}

export function PrimaryButton({ label, onPress, href, disabled = false }: { label: string; onPress?: () => void; href?: string; disabled?: boolean }) {
  const theme = useTheme();

  const button = (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.buttonPressable,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}>
      <LinearGradient
        colors={[theme.neonStart, theme.neonMid, theme.neonEnd]}
        locations={[0, 0.58, 1]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryGradient}>
        <Text style={[styles.primaryButtonText, { color: '#040506' }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );

  if (href && disabled) {
    return button;
  }

  return href ? (
    <Link href={href as never} asChild>
      {button}
    </Link>
  ) : (
    button
  );
}

export function SecondaryButton({ label, onPress, href, disabled = false }: { label: string; onPress?: () => void; href?: string; disabled?: boolean }) {
  const theme = useTheme();

  const button = (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.buttonPressable,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}>
      <View
        style={[
          styles.secondaryButton,
          {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: theme.border,
          },
        ]}>
        <Text style={{ color: theme.text, fontWeight: '700', letterSpacing: 0.35 }}>{label}</Text>
      </View>
    </Pressable>
  );

  if (href && disabled) {
    return button;
  }

  return href ? (
    <Link href={href as never} asChild>
      {button}
    </Link>
  ) : (
    button
  );
}

export function DemoInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.inputShell, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

export function EmptyState({ title, body, actionLabel, onActionPress }: { title: string; body: string; actionLabel?: string; onActionPress?: () => void }) {
  const theme = useTheme();

  return (
    <Card style={styles.emptyCard}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>{body}</Text>
      {actionLabel ? <PrimaryButton label={actionLabel} onPress={onActionPress} /> : null}
    </Card>
  );
}

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
                <Text style={{ color: theme.accentStrong, fontSize: 11, fontWeight: '700', letterSpacing: 0.35, textTransform: 'uppercase' }}>
                  {tag}
                </Text>
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
            <Text style={{ color: statusColor, fontWeight: '700', fontSize: 11, letterSpacing: 0.35, textTransform: 'uppercase' }}>
              {booking.status}
            </Text>
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

export function Stepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  const theme = useTheme();

  return (
    <View style={styles.stepperWrap}>
      <View style={styles.stepperTrack}>
        {steps.map((step, index) => {
          const active = index === currentStep;
          const done = index < currentStep;
          const accentColor = active ? theme.accent : done ? theme.success : theme.border;

          return (
            <View key={step} style={styles.stepperItem}>
              <View style={[styles.stepDot, { borderColor: accentColor, backgroundColor: active ? accentColor : 'transparent' }]}>
                <Text style={{ color: active ? '#040506' : theme.textSecondary, fontSize: 11, fontWeight: '800' }}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepperLabel, { color: active ? theme.text : theme.textSecondary }]} numberOfLines={1}>
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function TextArea({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.inputShell, styles.textAreaShell, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[styles.input, styles.textArea, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    width: '100%',
  },
  cardBorder: {
    borderRadius: 24,
    padding: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 28,
    elevation: 8,
  },
  cardSurface: {
    borderWidth: 1,
    borderRadius: 23,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardGlow: {
    position: 'absolute',
    borderRadius: 999,
  },
  cardGlowLeft: {
    width: 180,
    height: 180,
    left: -80,
    top: -60,
    opacity: 0.85,
  },
  cardGlowRight: {
    width: 200,
    height: 200,
    right: -80,
    bottom: -90,
    opacity: 0.72,
  },
  cardGlowTop: {
    width: 120,
    height: 120,
    right: 22,
    top: 20,
    opacity: 0.4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: 6,
  },
  sectionKicker: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  sectionAction: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
  pill: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  buttonPressable: {
    alignSelf: 'flex-start',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  primaryGradient: {
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#33E18A',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputShell: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  textAreaShell: {
    minHeight: 140,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  emptyCard: {
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontFamily: Fonts.sans,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
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
    gap: Spacing.two,
  },
  coverMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.45,
    textTransform: 'uppercase',
  },
  listingBody: {
    padding: Spacing.four,
    gap: Spacing.three,
    borderTopWidth: 1,
  },
  listingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
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
    gap: Spacing.two,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bookingPressable: {
    width: '100%',
  },
  bookingCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.four,
    gap: Spacing.two,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
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
  stepperWrap: {
    width: '100%',
  },
  stepperTrack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
