import { Text, View } from "react-native";

import type { ApiListingSearchItem } from "@/api/types";
import { Card, SecondaryButton } from "@/components/ui-kit";
import { useTheme } from "@/hooks/use-theme";
import { formatCompactNumber, formatDistance, formatMoney } from "@/i18n";

type SearchResultCardProps = {
  listing: ApiListingSearchItem;
  language: "es" | "en" | "pt";
  categoryName: string;
  t: (key: string) => string;
};

export function SearchResultCard({
  listing,
  language,
  categoryName,
  t,
}: SearchResultCardProps) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 10 }}>
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 17,
              lineHeight: 22,
              fontWeight: "800",
              color: theme.text,
            }}
          >
            {listing.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: theme.textSecondary,
            }}
          >
            {categoryName}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: theme.textSecondary,
          }}
        >
          {formatDistance(listing.distanceMeters / 1000, language)} ·{" "}
          {listing.status}
        </Text>
        <Text
          style={{ fontSize: 14, fontWeight: "800", color: theme.accentStrong }}
        >
          {listing.priceFrom ? formatMoney(listing.priceFrom, language) : "—"}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: theme.textSecondary,
          }}
        >
          {listing.ratingAvg.toFixed(1)} ·{" "}
          {formatCompactNumber(listing.ratingCount, language)} reviews
        </Text>
        <SecondaryButton
          label={t("common.viewDetails")}
          href={`/(app)/listing/${listing.id}`}
        />
      </View>
    </Card>
  );
}
