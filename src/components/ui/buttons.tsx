import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function PrimaryButton({ label, onPress, href }: { label: string; onPress?: () => void; href?: string }) {
  const theme = useTheme();

  const button = (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.buttonPressable, pressed && styles.buttonPressed]}>
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

  return href ? (
    <Link href={href as never} asChild>
      {button}
    </Link>
  ) : (
    button
  );
}

export function SecondaryButton({ label, onPress, href }: { label: string; onPress?: () => void; href?: string }) {
  const theme = useTheme();

  const button = (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.buttonPressable, pressed && styles.buttonPressed]}>
      <Text
        style={[
          styles.secondaryButton,
          {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: theme.border,
            color: theme.text,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );

  return href ? (
    <Link href={href as never} asChild>
      {button}
    </Link>
  ) : (
    button
  );
}

const styles = StyleSheet.create({
  buttonPressable: {
    alignSelf: 'flex-start',
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
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.35,
    overflow: 'hidden',
  },
});