import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
                <Text style={[styles.stepNumber, { color: active ? '#040506' : theme.textSecondary }]}>{index + 1}</Text>
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

const styles = StyleSheet.create({
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
  stepNumber: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});