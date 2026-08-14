import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { apiClient } from "@/api/client";
import type { ApiBookingRole } from "@/api/types";
import { AppScreen } from "@/components/app-screen";
import { Card, EmptyState, Pill, SectionTitle } from "@/components/ui-kit";
import { useBookingsQuery } from "@/hooks/use-api-queries";
import { useTheme } from "@/hooks/use-theme";
import { useApp } from "@/providers/app-provider";
import { useAuth } from "@/providers/auth-provider";

import { useQueries } from '@tanstack/react-query';

import { BookingRow } from "./components/booking-row";

export default function BookingsScreen() {
  const { language, t } = useApp();
  const theme = useTheme();
  const { actor, accessToken } = useAuth();
  const availableRoles = actor?.capacities ?? ["customer"];
  const [selectedRole, setSelectedRole] = useState<ApiBookingRole>(
    availableRoles[0] ?? "customer",
  );
  const resolvedRole = availableRoles.includes(selectedRole)
    ? selectedRole
    : (availableRoles[0] ?? "customer");

  const bookings = useBookingsQuery(accessToken, resolvedRole);
  const listingTitleQueries = useQueries({
    queries: (bookings.data?.items ?? []).map((booking) => ({
      queryKey: ['listing-title', booking.listingId],
      queryFn: ({ signal }) => apiClient.getListing(booking.listingId, signal),
      enabled: Boolean(bookings.data?.items.length),
      staleTime: 5 * 60_000,
    })),
  });

  const titleByListingId = useMemo(
    () =>
      new Map(
        listingTitleQueries.reduce<[string, string][]>((entries, query, index) => {
          const booking = bookings.data?.items[index];
          if (booking && query.data) {
            entries.push([booking.listingId, query.data.title]);
          }

          return entries;
        }, []),
      ),
    [bookings.data?.items, listingTitleQueries],
  );

  const completed = useMemo(
    () =>
      (bookings.data?.items ?? []).filter(
        (booking) => booking.status === "completed",
      ),
    [bookings.data?.items],
  );
  const upcoming = useMemo(
    () =>
      (bookings.data?.items ?? []).filter(
        (booking) => booking.status !== "completed",
      ),
    [bookings.data?.items],
  );

  return (
    <AppScreen>
      <Card>
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: theme.accent,
            }}
          >
            {t("bookings.title")}
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
            {t("bookings.subtitle")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {availableRoles.map((role) => (
              <Pill
                key={role}
                label={role}
                selected={resolvedRole === role}
                onPress={() => setSelectedRole(role)}
              />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <Card style={{ flex: 1, minWidth: 160 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: theme.textSecondary,
              }}
            >
              {t("bookings.upcoming")}
            </Text>
            <Text
              style={{
                fontSize: 28,
                lineHeight: 32,
                fontWeight: "900",
                color: theme.text,
              }}
            >
              {upcoming.length}
            </Text>
          </Card>
          <Card style={{ flex: 1, minWidth: 160 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: theme.textSecondary,
              }}
            >
              {t("bookings.completed")}
            </Text>
            <Text
              style={{
                fontSize: 28,
                lineHeight: 32,
                fontWeight: "900",
                color: theme.accentStrong,
              }}
            >
              {completed.length}
            </Text>
          </Card>
        </View>
      </Card>

      <SectionTitle title={t("bookings.upcoming")} />
      <View style={{ gap: 12 }}>
        {bookings.isLoading ? (
          <Text style={{ color: theme.textSecondary }}>
            {t("common.loading")}
          </Text>
        ) : null}
        {!bookings.isLoading && upcoming.length === 0 ? (
          <EmptyState
            title={t("bookings.upcoming")}
            body={t("bookings.reviewLocked")}
          />
        ) : null}
        {upcoming.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            listingTitle={titleByListingId.get(booking.listingId) ?? booking.listingId}
            language={language}
            t={t}
          />
        ))}
      </View>

      <SectionTitle title={t("bookings.completed")} />
      <View style={{ gap: 12 }}>
        {!bookings.isLoading && completed.length === 0 ? (
          <EmptyState
            title={t("bookings.completed")}
            body={t("bookings.reviewLocked")}
          />
        ) : null}
        {completed.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            listingTitle={titleByListingId.get(booking.listingId) ?? booking.listingId}
            language={language}
            t={t}
          />
        ))}
      </View>
    </AppScreen>
  );
}
