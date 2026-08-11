import { Text, View } from "react-native";

import { apiCities } from "@/api/cities";
import { apiClient } from "@/api/client";
import { AppScreen } from "@/components/app-screen";
import {
  Card,
  PrimaryButton,
  SecondaryButton,
  SectionTitle,
} from "@/components/ui-kit";
import { useRemoteData } from "@/hooks/use-remote-data";
import { useTheme } from "@/hooks/use-theme";
import { formatCompactNumber, formatDistance } from "@/i18n";
import { useApp } from "@/providers/app-provider";

import { ListingSummaryCard } from "./components/listing-summary-card";

export default function HomeScreen() {
  const { language, t } = useApp();
  const theme = useTheme();
  const categories = useRemoteData(
    (signal) => apiClient.getCategories(signal),
    [],
  );
  const featuredListings = useRemoteData(
    (signal) =>
      apiClient.searchListings({ cityId: apiCities[1].id, limit: 6 }, signal),
    [],
  );

  const categoryNameById = new Map(
    (categories.data ?? []).map((category) => [category.id, category.name]),
  );
  const activeCount = featuredListings.data
    ? formatCompactNumber(featuredListings.data.items.length, language)
    : "—";
  const featured = featuredListings.data?.items.slice(0, 3) ?? [];

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 14 }}>
          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 2.2,
                textTransform: "uppercase",
                color: theme.accent,
              }}
            >
              {t("home.liveMode")}
            </Text>
            <Text
              style={{
                fontSize: 34,
                lineHeight: 40,
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: 0.2,
                color: theme.text,
              }}
            >
              {t("home.heroTitle")}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 23,
                fontWeight: "500",
                color: theme.textSecondary,
                maxWidth: 760,
              }}
            >
              {t("home.heroBody")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <PrimaryButton label={t("common.search")} href="/(app)/search" />
            <SecondaryButton label={t("tabs.publish")} href="/(app)/publish" />
          </View>
        </View>
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        <Card style={{ flex: 1, minWidth: 160 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: theme.textSecondary,
            }}
          >
            {t("home.stats.active")}
          </Text>
          <Text
            style={{
              fontSize: 30,
              lineHeight: 34,
              fontWeight: "900",
              color: theme.text,
            }}
          >
            {activeCount}
          </Text>
          <Text
            style={{ fontSize: 13, lineHeight: 19, color: theme.textSecondary }}
          >
            {t("home.liveCopy")}
          </Text>
        </Card>
        <Card style={{ flex: 1, minWidth: 160 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: theme.textSecondary,
            }}
          >
            {t("home.stats.fast")}
          </Text>
          <Text
            style={{
              fontSize: 30,
              lineHeight: 34,
              fontWeight: "900",
              color: theme.accentStrong,
            }}
          >
            {featuredListings.data?.items[0]
              ? formatDistance(
                  featuredListings.data.items[0].distanceMeters / 1000,
                  language,
                )
              : "—"}
          </Text>
          <Text
            style={{ fontSize: 13, lineHeight: 19, color: theme.textSecondary }}
          >
            {t("home.searchScope")}
          </Text>
        </Card>
      </View>

      <Card>
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: theme.accent,
            }}
          >
            {t("home.stats.languages")}
          </Text>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 24,
              fontWeight: "800",
              textTransform: "uppercase",
              color: theme.text,
            }}
          >
            {t("home.categories")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              fontWeight: "500",
              color: theme.textSecondary,
            }}
          >
            {(categories.data ?? [])
              .map((category) => category.name)
              .join(" · ")}
          </Text>
        </View>
      </Card>

      <SectionTitle title={t("home.quickActions")} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <SecondaryButton label={t("tabs.search")} href="/(app)/search" />
        <SecondaryButton label={t("tabs.bookings")} href="/(app)/bookings" />
        <SecondaryButton label={t("tabs.account")} href="/(app)/account" />
      </View>

      <SectionTitle title={t("home.featured")} />
      <View style={{ gap: 14 }}>
        {featuredListings.loading ? (
          <Text style={{ color: theme.textSecondary }}>
            {t("common.loading")}
          </Text>
        ) : null}
        {featured.map((listing) => (
          <ListingSummaryCard
            key={listing.id}
            listing={listing}
            language={language}
            categoryName={
              categoryNameById.get(listing.categoryId) ?? listing.categoryId
            }
            t={t}
          />
        ))}
      </View>
    </AppScreen>
  );
}
