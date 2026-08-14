import { memo } from "react";
import { Text, View } from "react-native";

import type { ApiListingSearchItem } from "@/api/types";
import { Card, SecondaryButton } from "@/components/ui-kit";
import { useTheme } from "@/hooks/use-theme";
import { formatCompactNumber, formatDistance, formatMoney } from "@/i18n";

type ListingSummaryCardProps = {
  listing: ApiListingSearchItem;
  language: "es" | "en" | "pt";
  categoryName: string;
  t: (key: string) => string;
};

function ListingSummaryCardComponent({
  listing,
  language,
  categoryName,
  t,
}: ListingSummaryCardProps) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                fontWeight: "800",
                color: theme.text,
              }}
              numberOfLines={2}
            >
              {listing.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                letterSpacing: 1,
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
              fontWeight: "800",
              color: theme.accentStrong,
            }}
          >
            {listing.priceFrom ? formatMoney(listing.priceFrom, language) : "—"}
          </Text>
        </View>
        <Text
          style={{ fontSize: 13, lineHeight: 19, color: theme.textSecondary }}
        >
          {formatDistance(listing.distanceMeters / 1000, language)} ·{" "}
          {listing.status}
        </Text>
        <Text
          style={{ fontSize: 13, lineHeight: 19, color: theme.textSecondary }}
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

export const ListingSummaryCard = memo(ListingSummaryCardComponent);
