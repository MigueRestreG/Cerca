import { Pressable, StyleSheet, Text } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

const styles = StyleSheet.create({
  pill: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});