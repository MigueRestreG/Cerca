import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
};

export function AppScreen({ children, scrollable = true }: AppScreenProps) {
  const theme = useTheme();

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </ScrollView>
  ) : (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(4,5,6,0)']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(91,255,138,0.18)', 'rgba(91,255,138,0)', 'rgba(91,255,138,0)']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        style={[styles.glow, styles.glowOne]}
      />
      <LinearGradient
        colors={['rgba(99,183,255,0.16)', 'rgba(99,183,255,0)', 'rgba(99,183,255,0)']}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.8, y: 0.9 }}
        style={[styles.glow, styles.glowTwo]}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        style={[styles.glow, styles.glowThree]}
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: 112,
    gap: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.92,
  },
  glowOne: {
    width: 360,
    height: 360,
    top: -120,
    right: -130,
  },
  glowTwo: {
    width: 320,
    height: 320,
    left: -110,
    top: 240,
  },
  glowThree: {
    width: 220,
    height: 220,
    right: 120,
    bottom: 120,
  },
});
