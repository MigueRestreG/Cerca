import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { LanguageSwitcher, PrimaryButton, Card } from '@/UI';
import { useTheme } from '@/hooks/use-theme';

const languages = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
  { code: 'pt' as const, label: 'PT' },
];

export function SignInForm({
  mode,
  loading,
  error,
  displayName,
  email,
  password,
  confirmPassword,
  setMode,
  setDisplayName,
  setEmail,
  setPassword,
  setConfirmPassword,
  onSubmit,
  onTestBackend,
  language,
  onLanguageChange,
  submitLabel,
}: {
  mode: 'sign-in' | 'sign-up';
  loading: boolean;
  error: string | null;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  setMode: (mode: 'sign-in' | 'sign-up') => void;
  setDisplayName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onSubmit: () => void;
  onTestBackend: () => void;
  language: 'es' | 'en' | 'pt';
  onLanguageChange: (language: 'es' | 'en' | 'pt') => void;
  submitLabel: string;
}) {
  const theme = useTheme();

  return (
    <Card style={styles.formCard}>
      <View style={styles.modeRow}>
        <Pressable onPress={() => setMode('sign-in')} style={({ pressed }) => [styles.modeButton, { borderColor: mode === 'sign-in' ? theme.accent : theme.border, backgroundColor: mode === 'sign-in' ? theme.accentSoft : theme.backgroundElement }, pressed && { opacity: 0.9 }]}>
          <Text style={{ color: mode === 'sign-in' ? theme.accentStrong : theme.textSecondary, fontWeight: '800' }}>Sign in</Text>
        </Pressable>
        <Pressable onPress={() => setMode('sign-up')} style={({ pressed }) => [styles.modeButton, { borderColor: mode === 'sign-up' ? theme.accent : theme.border, backgroundColor: mode === 'sign-up' ? theme.accentSoft : theme.backgroundElement }, pressed && { opacity: 0.9 }]}>
          <Text style={{ color: mode === 'sign-up' ? theme.accentStrong : theme.textSecondary, fontWeight: '800' }}>Create account</Text>
        </Pressable>
      </View>

      <View style={styles.formFields}>
        {mode === 'sign-up' ? <Field label="Name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" autoCapitalize="words" /> : null}
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="Choose a password" secureTextEntry />
        {mode === 'sign-up' ? <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" secureTextEntry /> : null}
      </View>

      {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}

      <View style={styles.controls}>
        <LanguageSwitcher value={language} onChange={onLanguageChange} languages={languages} />
        <Pressable onPress={onTestBackend}>
          <Text style={[styles.linkText, { color: theme.accent }]}>Test backend connection</Text>
        </Pressable>
        <PrimaryButton label={loading ? 'Loading...' : submitLabel} onPress={onSubmit} />
      </View>
    </Card>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
}) {
  const theme = useTheme();

  return (
    <View style={styles.inputShell}>
      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    width: 420,
    maxWidth: '100%',
    gap: 14,
  },
  formFields: { gap: 12 },
  modeRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  modeButton: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  inputShell: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontWeight: '600' },
  errorText: { fontSize: 13, fontWeight: '700' },
  controls: { marginTop: 8, width: '100%', alignItems: 'flex-start', gap: 12 },
  linkText: { fontSize: 12, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
});