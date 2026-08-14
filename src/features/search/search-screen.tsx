import * as Location from 'expo-location';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';

import { apiCities, type ApiCityId } from '@/api/cities';
import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, Pill, SecondaryButton, SectionTitle } from '@/components/ui-kit';
import { useCategoriesQuery, useListingsQuery } from '@/hooks/use-api-queries';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/providers/app-provider';
import { formatApiErrorMessage } from '@/lib/api-errors';

import { SearchResultCard } from './components/search-result-card';

export default function SearchScreen() {
  const { language, t } = useApp();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<ApiCityId>('medellin');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied' | 'error'>('idle');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  const categories = useCategoriesQuery();
  const listings = useListingsQuery({
    query: query.trim() || undefined,
    categoryId: selectedCategory === 'all' ? null : selectedCategory,
    cityId: gpsLocation ? null : selectedCity,
    lat: gpsLocation?.lat ?? null,
    lng: gpsLocation?.lng ?? null,
    radiusKm: gpsLocation ? 25 : undefined,
    limit: 20,
  });

  const categoryNameById = useMemo(
    () => new Map((categories.data ?? []).map((category) => [category.id, category.name])),
    [categories.data],
  );

  const searchResults = listings.data?.items ?? [];

  const handleUseGps = useCallback(async () => {
    setLocationStatus('loading');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setGpsLocation(null);
        setLocationStatus('denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      setLocationStatus('granted');
    } catch {
      setGpsLocation(null);
      setLocationStatus('error');
    }
  }, []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCity('medellin');
    setGpsLocation(null);
    setLocationStatus('idle');
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof searchResults)[number] }) => (
      <SearchResultCard
        listing={item}
        language={language}
        categoryName={categoryNameById.get(item.categoryId) ?? item.categoryId}
        t={t}
      />
    ),
    [categoryNameById, language, t],
  );

  const header = (
    <View style={{ gap: 14 }}>
      <Card>
        <View style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 2.2,
                textTransform: 'uppercase',
                color: theme.accent,
              }}
            >
              {t('search.title')}
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 23,
                fontWeight: '500',
                color: theme.textSecondary,
                maxWidth: 760,
              }}
            >
              {t('search.subtitle')}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                color: theme.textSecondary,
              }}
            >
              {t('search.city')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {apiCities.map((city) => (
                <Pill
                  key={city.id}
                  label={city.label}
                  selected={selectedCity === city.id}
                  onPress={() => {
                    setSelectedCity(city.id);
                    setGpsLocation(null);
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <SecondaryButton
              label={locationStatus === 'loading' ? 'GPS...' : 'Usar GPS'}
              onPress={() => {
                void handleUseGps();
              }}
              loading={locationStatus === 'loading'}
            />
            {locationStatus === 'denied' ? (
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                Se desactivó la ubicación; puedes seguir con búsqueda manual.
              </Text>
            ) : null}
            {locationStatus === 'error' ? (
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                No fue posible obtener GPS. Usa ciudad o texto.
              </Text>
            ) : null}
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.backgroundSelected,
              borderRadius: 16,
              paddingHorizontal: 14,
            }}
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('search.searchPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: '600',
                paddingVertical: 12,
              }}
            />
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <Pill
              label={t('common.all')}
              selected={selectedCategory === 'all'}
              onPress={() => setSelectedCategory('all')}
            />
            {(categories.data ?? []).map((category) => (
              <Pill
                key={category.id}
                label={category.name}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <AppScreen scrollable={false}>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        getItemLayout={(_, index) => ({ length: 188, offset: 188 * index, index })}
        ListHeaderComponent={header}
        ListEmptyComponent={
          listings.isLoading ? (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ActivityIndicator color={theme.accentStrong} />
                <Text style={{ color: theme.textSecondary }}>{t('search.loadingBody')}</Text>
              </View>
            </Card>
          ) : listings.error ? (
            <EmptyState
              title={t('search.errorTitle')}
              body={formatApiErrorMessage(listings.error, language)}
              actionLabel={t('common.retry')}
              onActionPress={() => {
                void listings.refetch();
              }}
            />
          ) : searchResults.length === 0 ? (
            <EmptyState
              title={t('search.emptyTitle')}
              body={t('search.emptyBody')}
              actionLabel={t('common.clear')}
              onActionPress={clearFilters}
            />
          ) : null
        }
        ListFooterComponent={
          searchResults.length > 0 ? (
            <SectionTitle
              title={t('search.results')}
              subtitle={`${searchResults.length} items`}
            />
          ) : null
        }
      />
    </AppScreen>
  );
}
