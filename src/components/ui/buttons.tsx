import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
};

function ButtonShell({
  children,
  onPress,
  href,
  disabled = false,
  loading = false,
}: {
  children: ReactNode;
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        if (disabled || loading) {
          return;
        }

        if (href) {
          // router.push expects a typed path; cast to any to allow string URLs
          (router as any).push(href);
          return;
        }

        onPress?.();
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.buttonPressable,
        (pressed || disabled || loading) && styles.buttonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress, href, disabled = false, loading = false }: ButtonProps) {
  const theme = useTheme();

  return (
    <ButtonShell onPress={onPress} href={href} disabled={disabled} loading={loading}>
      <LinearGradient
        colors={[theme.neonStart, theme.neonMid, theme.neonEnd]}
        locations={[0, 0.58, 1]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryGradient}
      >
        <Text style={[styles.primaryButtonText, { color: '#040506' }]}>
          {loading ? `${label}...` : label}
        </Text>
      </LinearGradient>
    </ButtonShell>
  );
}

export function SecondaryButton({ label, onPress, href, disabled = false, loading = false }: ButtonProps) {
  const theme = useTheme();

  return (
    <ButtonShell onPress={onPress} href={href} disabled={disabled} loading={loading}>
      <Text
        style={[
          styles.secondaryButton,
          {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
      >
        {loading ? `${label}...` : label}
      </Text>
    </ButtonShell>
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
