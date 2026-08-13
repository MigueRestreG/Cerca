import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Card } from './card';
import { PrimaryButton } from './buttons';

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

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: 'flex-start',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500' as const,
  },
});