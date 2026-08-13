import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

const styles = StyleSheet.create({
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
});