import { Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { API_BASE_URL } from '@/api/config';
import { AppScreen } from '@/components/app-screen';
import { Card, LanguageSwitcher, PrimaryButton, SecondaryButton } from '@/components/ui-kit';
import { useTheme } from '@/hooks/use-theme';
import { getLocale } from '@/i18n';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

const languages = [
  { code: 'es' as const, label: 'Español' },
  { code: 'en' as const, label: 'English' },
  { code: 'pt' as const, label: 'Português' },
];

export default function AccountScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useApp();
  const theme = useTheme();
  const locale = getLocale(language);
  const { actor, accessToken, becomeProvider, signOut } = useAuth();

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>
              {t('account.title')}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 23, fontWeight: '500', color: theme.textSecondary, maxWidth: 760 }}>
              {t('account.subtitle')}
            </Text>
          </View>
          <PrimaryButton label={t('common.search')} href="/(app)/search" />
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
            {t('account.session')}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>{actor?.id ?? t('account.noSession')}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{accessToken ? t('account.connected') : t('account.disconnected')}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{API_BASE_URL}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <PrimaryButton
              label={t('common.signOut')}
              onPress={() => {
                signOut().finally(() => {
                  router.replace('/(Auth)/sign-in');
                });
              }}
            />
            <SecondaryButton label={t('account.becomeProvider')} onPress={() => becomeProvider()} />
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
            {t('account.language')}
          </Text>
          <LanguageSwitcher value={language} onChange={setLanguage} languages={languages} />
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
            {t('account.localePreview')}
          </Text>
          <Text style={{ fontSize: 22, lineHeight: 28, fontWeight: '800', color: theme.text }}>{locale}</Text>
          <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.textSecondary }}>{t('account.demoNote')}</Text>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.accent }}>{t('account.capabilities')}</Text>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>{actor?.capacities.map((capacity) => t(`account.capacityValues.${capacity}`)).join(' · ') ?? t('account.noSession')}</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>{actor ? t(`account.platformRoleValues.${actor.platformRole}`) : t('account.noSession')}</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>ES / EN / PT</Text>
          </View>
        </View>
      </Card>
    </AppScreen>
  );
}
