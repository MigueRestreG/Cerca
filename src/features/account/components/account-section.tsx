import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/UI';
import { useTheme } from '@/hooks/use-theme';

export function AccountSection({
  title,
  children,
  accent = false,
}: {
  title: string;
  children: ReactNode;
  accent?: boolean;
}) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: accent ? theme.accent : theme.textSecondary }}>{title}</Text>
        {children}
      </View>
    </Card>
  );
}