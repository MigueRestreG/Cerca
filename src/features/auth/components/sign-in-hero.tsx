import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/UI';
import { useTheme } from '@/hooks/use-theme';

export function SignInHero({ title, subtitle }: { title: string; subtitle: string }) {
  const theme = useTheme();

  return (
    <View style={styles.left}>
      <View style={styles.kickerRow}>
        <View style={[styles.kickerLine, { backgroundColor: theme.accent }]} />
        <Text style={[styles.kicker, { color: theme.accent }]}>DARK PREMIUM UI SYSTEM</Text>
      </View>

      <Text style={[styles.brand, { color: theme.text }]}>FLOW</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

export function SignInSidePanels() {
  const theme = useTheme();

  return (
    <View style={styles.right}>
      <Card style={styles.heroCard}>
        <View style={styles.heroCardTop}>
          <Text style={[styles.panelLabel, { color: theme.accent }]}>SIGN-IN PREVIEW</Text>
          <Text style={[styles.panelValue, { color: theme.text }]}>ES / EN / PT</Text>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricNumber, { color: theme.text }]}>3</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>languages</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={[styles.metricNumber, { color: theme.accentStrong }]}>57</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>expo sdk</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.sideCard}>
        <Text style={[styles.panelLabel, { color: theme.accent }]}>MOTION</Text>
        <Text style={[styles.sideTitle, { color: theme.text }]}>Soft glow, thin borders and measured spacing.</Text>
        <Text style={[styles.sideCopy, { color: theme.textSecondary }]}>The interface keeps the app logic intact while moving the entire shell toward the same visual weight as the reference.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    flex: 1,
    maxWidth: 420,
    minWidth: 0,
    justifyContent: 'center',
    gap: 12,
    paddingRight: 6,
  },
  right: {
    width: 260,
    minWidth: 0,
    justifyContent: 'center',
    gap: 16,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kickerLine: {
    width: 42,
    height: 1,
    opacity: 0.9,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  brand: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 5,
    textTransform: 'uppercase',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 18,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: 0.1,
    textTransform: 'uppercase',
    maxWidth: 420,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: 420,
  },
  heroCard: {
    minHeight: 230,
    justifyContent: 'space-between',
  },
  heroCardTop: {
    gap: 8,
  },
  panelLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  panelValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 14,
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  metricNumber: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sideCard: {
    gap: 10,
  },
  sideTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sideCopy: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
});