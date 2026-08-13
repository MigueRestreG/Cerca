import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function DemoInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.inputShell, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

export function TextArea({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.inputShell, styles.textAreaShell, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[styles.input, styles.textArea, { color: theme.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputShell: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  textAreaShell: {
    minHeight: 140,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
});