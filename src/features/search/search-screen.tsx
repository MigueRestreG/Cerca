import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import { apiClient } from '@/api/client';
import { apiCities, type ApiCityId } from '@/api/cities';
import type { ApiListingSearchItem } from '@/api/types';
import { AppScreen } from '@/components/app-screen';
import { Card, EmptyState, Pill, SecondaryButton, SectionTitle } from '@/components/ui-kit';
import { useTheme } from '@/hooks/use-theme';
import { formatCompactNumber, formatDistance, formatMoney } from '@/i18n';
import { useRemoteData } from '@/hooks/use-remote-data';
import { useApp } from '@/providers/app-provider';

function SearchResultCard({ listing, language, categoryName, t }: { listing: ApiListingSearchItem; language: 'es' | 'en' | 'pt'; categoryName: string; t: (key: string) => string }) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 10 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 17, lineHeight: 22, fontWeight: '800', color: theme.text }}>{listing.title}</Text>
          <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', color: theme.textSecondary }}>{categoryName}</Text>
        </View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>
          {formatDistance(listing.distanceMeters / 1000, language)} · {listing.status}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '800', color: theme.accentStrong }}>
          {listing.priceFrom ? formatMoney(listing.priceFrom, language) : '—'}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary }}>
          {listing.ratingAvg.toFixed(1)} · {formatCompactNumber(listing.ratingCount, language)} reviews
        </Text>
        <SecondaryButton label={t('common.viewDetails')} href={`/(app)/listing/${listing.id}`} />
      </View>
    </Card>
  );
}

export default function SearchScreen() {
  const { language, t } = useApp();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<ApiCityId>('medellin');

  const categories = useRemoteData((signal) => apiClient.getCategories(signal), []);
  const listings = useRemoteData(
    (signal) =>
      apiClient.searchListings(
        {
          query: query.trim() || undefined,
          categoryId: selectedCategory === 'all' ? null : selectedCategory,
          cityId: selectedCity,
          limit: 20,
        },
        signal,
      ),
    [query, selectedCategory, selectedCity],
  );

  const categoryNameById = useMemo(() => new Map((categories.data ?? []).map((category) => [category.id, category.name])), [categories.data]);

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 14 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: theme.accent }}>
              {t('search.title')}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 23, fontWeight: '500', color: theme.textSecondary, maxWidth: 760 }}>
              {t('search.subtitle')}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase', color: theme.textSecondary }}>
              {t('search.city')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {apiCities.map((city) => (
                <Pill key={city.id} label={city.label} selected={selectedCity === city.id} onPress={() => setSelectedCity(city.id)} />
              ))}
            </View>
          </View>

          <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.backgroundSelected, borderRadius: 16, paddingHorizontal: 14 }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('search.searchPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              style={{ color: theme.text, fontSize: 15, fontWeight: '600', paddingVertical: 12 }}
            />
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <Pill label={t('common.all')} selected={selectedCategory === 'all'} onPress={() => setSelectedCategory('all')} />
            {(categories.data ?? []).map((category) => (
              <Pill key={category.id} label={category.name} selected={selectedCategory === category.id} onPress={() => setSelectedCategory(category.id)} />
            ))}
          </View>
        </View>
      </Card>

      {listings.error ? (
        <EmptyState
          title={t('search.errorTitle')}
          body={listings.error}
          actionLabel={t('common.retry')}
          onActionPress={listings.refresh}
        />
      ) : listings.loading ? (
        <EmptyState title={t('common.loading')} body={t('search.loadingBody')} />
      ) : (listings.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title={t('search.emptyTitle')}
          body={t('search.emptyBody')}
          actionLabel={t('common.clear')}
          onActionPress={() => {
            setQuery('');
            setSelectedCategory('all');
            setSelectedCity('medellin');
          }}
        />
      ) : (
        <FlatList
          data={listings.data?.items ?? []}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          renderItem={({ item }) => <SearchResultCard listing={item} language={language} categoryName={categoryNameById.get(item.categoryId) ?? item.categoryId} t={t} />}
          ListHeaderComponent={<SectionTitle title={t('search.results')} subtitle={`${listings.data?.items.length ?? 0} items`} />}
        />
      )}
    </AppScreen>
  );
}
