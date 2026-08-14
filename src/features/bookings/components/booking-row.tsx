import { memo } from "react";
import { Text, View } from "react-native";

import type { ApiBooking } from "@/api/types";
import { Card, SecondaryButton } from "@/components/ui-kit";
import { useTheme } from "@/hooks/use-theme";

type BookingRowProps = {
  booking: ApiBooking;
  listingTitle: string;
  language: "es" | "en" | "pt";
  t: (key: string) => string;
};

function BookingRowComponent({
  booking,
  listingTitle,
  language,
  t,
}: BookingRowProps) {
  const theme = useTheme();

  return (
    <Card>
      <View style={{ gap: 8 }}>
        <Text
          style={{ fontSize: 16, fontWeight: "800", color: theme.text }}
          numberOfLines={1}
        >
          {listingTitle}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: theme.textSecondary,
          }}
        >
          {booking.status} · {booking.reviewId ? "reviewed" : "pending"}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: theme.textSecondary,
          }}
        >
          {new Date(booking.requestedAt).toLocaleString(
            language === "es" ? "es-MX" : language === "pt" ? "pt-BR" : "en-US",
          )}
        </Text>
        <SecondaryButton
          label={t("common.viewDetails")}
          href={`/(app)/booking/${booking.id}`}
        />
      </View>
    </Card>
  );
}

export const BookingRow = memo(BookingRowComponent);
