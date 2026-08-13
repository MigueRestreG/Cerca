import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SurfaceCard({ children, style }: CardProps) {
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
});