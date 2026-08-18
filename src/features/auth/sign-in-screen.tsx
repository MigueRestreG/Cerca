import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen, Card, LanguageSwitcher, PrimaryButton } from '@/UI';
import { ApiError } from '@/api/client';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

const languages = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
  { code: 'pt' as const, label: 'PT' },
];

export default function SignInScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useApp();
  const theme = useTheme();
  const { actor, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function resolveAuthError(cause: unknown, fallbackKey: 'auth.signInFailed' | 'auth.signUpFailed') {
    if (cause instanceof ApiError) {
      if (cause.code === 'NETWORK_ERROR') {
        return t('auth.networkError');
      }

      const normalized = `${cause.code} ${cause.reason ?? ''} ${cause.detail}`.toLowerCase();
      if (normalized.includes('email') && (normalized.includes('exists') || normalized.includes('taken') || normalized.includes('duplicate'))) {
        return t('auth.duplicateEmail');
      }

      if (cause.code === 'INVALID_CREDENTIALS' || normalized.includes('invalid_credentials')) {
        return t('auth.invalidCredentials');
      }

      return cause.detail || t(fallbackKey);
    }

    return cause instanceof Error ? cause.message : t(fallbackKey);
  }

  useEffect(() => {
    if (actor) {
      router.replace('/(app)/home');
    }
  }, [actor, router]);

  async function handleSubmit() {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(t('auth.emailRequired'));
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError(t('auth.emailInvalid'));
      return;
    }

    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }

    if (mode === 'sign-up' && password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (mode === 'sign-up') {
      if (!displayName.trim()) {
        setError(t('auth.nameRequired'));
        return;
      }

      if (password !== confirmPassword) {
        setError(t('auth.passwordMismatch'));
        return;
      }

      try {
        await signUp({ email: normalizedEmail, password, displayName: displayName.trim(), capacities: ['customer'] });
        router.replace('/(app)/home');
      } catch (cause) {
        setError(resolveAuthError(cause, 'auth.signUpFailed'));
      }

      return;
    }

    try {
      await signIn(normalizedEmail, password);
      router.replace('/(app)/home');
    } catch (cause) {
      setError(resolveAuthError(cause, 'auth.signInFailed'));
    }
  }

  return (
    <AppScreen scrollable={false}>
      <View style={styles.page}>
        <View style={styles.left}>
          <View style={styles.kickerRow}>
            <View style={[styles.kickerLine, { backgroundColor: theme.accent }]} />
            <Text style={[styles.kicker, { color: theme.accent }]}>{t('auth.uiSystem')}</Text>
          </View>
          <Text style={[styles.brand, { color: theme.text }]}>FLOW</Text>
          <Text style={[styles.title, { color: theme.text }]}>{t('home.heroTitle')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('home.heroBody')}</Text>
          <Card style={styles.formCard}>
            <View style={styles.modeRow}>
              <Pressable onPress={() => setMode('sign-in')} style={({ pressed }) => [styles.modeButton, { borderColor: mode === 'sign-in' ? theme.accent : theme.border, backgroundColor: mode === 'sign-in' ? theme.accentSoft : theme.backgroundElement }, pressed && { opacity: 0.9 }]}> 
                <Text style={{ color: mode === 'sign-in' ? theme.accentStrong : theme.textSecondary, fontWeight: '800' }}>{t('auth.modeSignIn')}</Text>
              </Pressable>
              <Pressable onPress={() => setMode('sign-up')} style={({ pressed }) => [styles.modeButton, { borderColor: mode === 'sign-up' ? theme.accent : theme.border, backgroundColor: mode === 'sign-up' ? theme.accentSoft : theme.backgroundElement }, pressed && { opacity: 0.9 }]}> 
                <Text style={{ color: mode === 'sign-up' ? theme.accentStrong : theme.textSecondary, fontWeight: '800' }}>{t('auth.modeSignUp')}</Text>
              </Pressable>
            </View>
            <View style={styles.formFields}>
              {mode === 'sign-up' ? (
                <View style={styles.inputShell}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('auth.name')}</Text>
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}
                    placeholder={t('auth.namePlaceholder')}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              ) : null}
              <View style={styles.inputShell}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('auth.email')}</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={styles.inputShell}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('auth.password')}</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              {mode === 'sign-up' ? (
                <View style={styles.inputShell}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('auth.confirmPassword')}</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              ) : null}
            </View>
            {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
            <View style={styles.controls}>
              <LanguageSwitcher value={language} onChange={setLanguage} languages={languages} />
              <PrimaryButton label={loading ? t('common.loading') : mode === 'sign-up' ? t('auth.createAccount') : t('auth.continue')} onPress={handleSubmit} />
            </View>
          </Card>
        </View>

        <View style={styles.right}>
          <Card style={styles.heroCard}>
            <View style={styles.heroCardTop}>
              <Text style={[styles.panelLabel, { color: theme.accent }]}>{t('auth.previewTitle')}</Text>
              <Text style={[styles.panelValue, { color: theme.text }]}>ES / EN / PT</Text>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricBlock}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>3</Text>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('auth.languagesMetric')}</Text>
              </View>
              <View style={styles.metricBlock}>
                <Text style={[styles.metricNumber, { color: theme.accentStrong }]}>57</Text>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{t('auth.expoSdkMetric')}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sideCard}>
            <Text style={[styles.panelLabel, { color: theme.accent }]}>{t('auth.motionLabel')}</Text>
            <Text style={[styles.sideTitle, { color: theme.text }]}>{t('auth.motionTitle')}</Text>
            <Text style={[styles.sideCopy, { color: theme.textSecondary }]}>{t('auth.motionBody')}</Text>
          </Card>
        </View>
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    gap: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  left: {
    flex: 1,
    maxWidth: 720,
    gap: 18,
  },
  right: {
    flex: 1,
    gap: 16,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kickerLine: {
    width: 42,
    height: 1,
    opacity: 0.9,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  brand: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 5,
    textTransform: 'uppercase',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 18,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 0.1,
    textTransform: 'uppercase',
    maxWidth: 620,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    maxWidth: 640,
  },
  controls: {
    marginTop: 8,
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
  },
  formCard: {
    gap: 14,
  },
  formFields: {
    gap: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  modeButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputShell: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickPick: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  heroCard: {
    minHeight: 250,
    justifyContent: 'space-between',
  },
  heroCardTop: {
    gap: 8,
  },
  panelLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  panelValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 14,
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  metricNumber: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sideCard: {
    gap: 10,
  },
  sideTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sideCopy: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
});
