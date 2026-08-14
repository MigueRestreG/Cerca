import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/UI';
import { formatApiErrorMessage } from '@/lib/api-errors';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

import { SignInForm } from './components/sign-in-form';
import { SignInHero, SignInSidePanels } from './components/sign-in-hero';

export default function SignInScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useApp();
  const { actor, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (actor) {
      router.replace('/(app)/home');
    }
  }, [actor, router]);

  async function handleSubmit() {
    setError(null);

    if (mode === 'sign-up') {
      if (!displayName.trim()) {
        setError('Please enter your name');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        await signUp({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          capacities: ['customer'],
        });
        router.replace('/(app)/home');
      } catch (cause) {
        setError(formatApiErrorMessage(cause, language));
      }

      return;
    }

    try {
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch (cause) {
      setError(formatApiErrorMessage(cause, language));
    }
  }

  return (
    <AppScreen scrollable={false}>
      <View style={styles.page}>
        <SignInHero title={t('home.heroTitle')} subtitle={t('home.heroBody')} />
        <SignInForm
          mode={mode}
          loading={loading}
          error={error}
          displayName={displayName}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          setMode={setMode}
          setDisplayName={setDisplayName}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleSubmit}
          onTestBackend={() => router.push('/(Auth)/connect-backend')}
          language={language}
          onLanguageChange={setLanguage}
          submitLabel={mode === 'sign-up' ? 'Create account' : 'Continue'}
        />
        <SignInSidePanels />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 12,
  },
});
