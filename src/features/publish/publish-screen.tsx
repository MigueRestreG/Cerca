import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { apiClient } from '@/api/client';
import { apiCities } from '@/api/cities';
import { AppScreen } from '@/components/app-screen';
import { Card, DemoInput, LanguageSwitcher, Pill, PrimaryButton, SecondaryButton, Stepper, TextArea } from '@/components/ui-kit';
import { useRemoteData } from '@/hooks/use-remote-data';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/providers/app-provider';
import { useAuth } from '@/providers/auth-provider';

const languages = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
  { code: 'pt' as const, label: 'PT' },
];

export default function PublishScreen() {
  const router = useRouter();
  const { language, t } = useApp();
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [step, setStep] = useState(0);
  const [draftLanguage, setDraftLanguage] = useState(language);
  const [title, setTitle] = useState('Servicio local confiable');
  const [description, setDescription] = useState('Un servicio con respuesta rápida, claridad en precio y atención cercana.');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<(typeof apiCities)[number]['id']>(apiCities[1].id);
  const [amount, setAmount] = useState('12900');
  const [currency, setCurrency] = useState('MXN');
  const [pricingModel, setPricingModel] = useState<'fixed' | 'hourly' | 'quote'>('fixed');
  const [minimumHours, setMinimumHours] = useState('2');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);
  const categories = useRemoteData((signal) => apiClient.getCategories(signal), []);
  const selectedCategoryName = useMemo(() => categories.data?.find((category) => category.id === selectedCategory)?.name ?? '', [categories.data, selectedCategory]);

  const steps = [t('publish.steps.basics'), t('publish.steps.service'), t('publish.steps.pricing'), t('publish.steps.preview')];

  async function handlePublish() {
    if (!selectedCategory || !accessToken) {
      return;
    }

    const city = apiCities.find((item) => item.id === selectedCity) ?? apiCities[1];
    const minorAmount = Number.parseInt(amount, 10) || 0;
    const pricing =
      pricingModel === 'hourly'
        ? { model: 'hourly' as const, hourlyRate: { amountMinor: minorAmount, currency }, minimumHours: Math.max(1, Number.parseInt(minimumHours, 10) || 1) }
        : pricingModel === 'quote'
          ? { model: 'quote' as const, startingFrom: minorAmount > 0 ? { amountMinor: minorAmount, currency } : undefined }
          : { model: 'fixed' as const, price: { amountMinor: minorAmount, currency } };

    const listing = await apiClient.createListing(
      {
        categoryId: selectedCategory,
        title,
        description,
        pricing,
        location: { lat: city.lat, lng: city.lng },
      },
      accessToken,
    );

    setShowSuccess(true);
    setCreatedListingId(listing.id);
    router.push(`/(app)/listing/${listing.id}`);
  }

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 12 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>
              {t('publish.step')} {step + 1} / 4
            </Text>
            <Text style={{ fontSize: 30, lineHeight: 36, fontWeight: '800', textTransform: 'uppercase', color: theme.text }}>
              {t('publish.title')}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 23, fontWeight: '500', color: theme.textSecondary, maxWidth: 780 }}>
              {t('publish.subtitle')}
            </Text>
          </View>

          <Stepper steps={steps} currentStep={step} />
        </View>
      </Card>

      <Card>
        {step === 0 ? (
          <View style={{ gap: 12 }}>
            <DemoInput value={title} onChangeText={setTitle} placeholder={t('publish.fields.title')} />
            <TextArea value={description} onChangeText={setDescription} placeholder={t('publish.fields.description')} />
          </View>
        ) : null}

        {step === 1 ? (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
              {t('publish.fields.category')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {(categories.data ?? []).map((category) => (
                <Pill key={category.id} label={category.name} selected={selectedCategory === category.id} onPress={() => setSelectedCategory(category.id)} />
              ))}
            </View>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
              {t('publish.fields.location')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {apiCities.map((city) => (
                <Pill key={city.id} label={city.label} selected={selectedCity === city.id} onPress={() => setSelectedCity(city.id)} />
              ))}
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
              {t('publish.fields.pricingModel')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {(['fixed', 'hourly', 'quote'] as const).map((item) => (
                <Pill key={item} label={t(`publish.models.${item}`)} selected={pricingModel === item} onPress={() => setPricingModel(item)} />
              ))}
            </View>
            <DemoInput value={amount} onChangeText={setAmount} placeholder={t('publish.fields.amount')} />
            <DemoInput value={currency} onChangeText={setCurrency} placeholder={t('publish.fields.currency')} />
            {pricingModel === 'hourly' ? <DemoInput value={minimumHours} onChangeText={setMinimumHours} placeholder={t('publish.fields.minimumHours')} /> : null}
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
              {t('publish.fields.languages')}
            </Text>
            <LanguageSwitcher value={draftLanguage} onChange={setDraftLanguage} languages={languages} />
          </View>
        ) : null}

        {step === 3 ? (
          <View style={{ gap: 14 }}>
            <Card>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.accent }}>
                  {t('publish.steps.preview')}
                </Text>
                <Text style={{ fontSize: 22, lineHeight: 28, fontWeight: '800', textTransform: 'uppercase', color: theme.text }}>
                  {title}
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '500', color: theme.textSecondary }}>
                  {description}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: theme.accentStrong }}>
                  {selectedCategoryName} · {selectedCity} · {amount} {currency}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '500', color: theme.textSecondary }}>
                  {t(`publish.models.${pricingModel}`)}
                </Text>
              </View>
            </Card>
          </View>
        ) : null}

        {showSuccess ? <Text style={{ fontSize: 14, fontWeight: '800', color: theme.accent }}>{t('publish.published')}</Text> : null}
        {createdListingId ? <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>{createdListingId}</Text> : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <SecondaryButton label={t('common.back')} onPress={() => setStep((current) => Math.max(0, current - 1))} />
          {step < 3 ? (
            <PrimaryButton label={t('common.next')} onPress={() => setStep((current) => Math.min(3, current + 1))} />
          ) : (
            <PrimaryButton
              label={t('publish.previewCta')}
              onPress={() => {
                handlePublish().catch((cause) => {
                  setShowSuccess(false);
                  setCreatedListingId(cause instanceof Error ? cause.message : 'Publish failed');
                });
              }}
            />
          )}
        </View>
      </Card>

      <Card>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
            {t('publish.reset')}
          </Text>
          <SecondaryButton
            label={t('publish.reset')}
            onPress={() => {
              setStep(0);
              setTitle('Servicio local confiable');
              setDescription('Un servicio con respuesta rápida, claridad en precio y atención cercana.');
              setSelectedCategory(categories.data?.[0]?.id ?? null);
              setSelectedCity(apiCities[1].id);
              setAmount('12900');
              setCurrency('MXN');
              setShowSuccess(false);
              setDraftLanguage(language);
              setCreatedListingId(null);
            }}
          />
        </View>
      </Card>
    </AppScreen>
  );
}
