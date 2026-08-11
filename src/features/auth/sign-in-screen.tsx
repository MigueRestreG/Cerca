import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, Card, LanguageSwitcher, PrimaryButton } from "@/UI";
import { useTheme } from "@/hooks/use-theme";
import { useApp } from "@/providers/app-provider";
import { useAuth } from "@/providers/auth-provider";

const languages = [
  { code: "es" as const, label: "ES" },
  { code: "en" as const, label: "EN" },
  { code: "pt" as const, label: "PT" },
];

export default function SignInScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useApp();
  const theme = useTheme();
  const { actor, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (actor) {
      router.replace("/(app)/home");
    }
  }, [actor, router]);

  async function handleSubmit() {
    setError(null);

    if (mode === "sign-up") {
      if (!displayName.trim()) {
        setError("Please enter your name");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        await signUp({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          capacities: ["customer"],
        });
        router.replace("/(app)/home");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Sign-up failed");
      }

      return;
    }

    try {
      await signIn(email.trim(), password);
      router.replace("/(app)/home");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed");
    }
  }

  return (
    <AppScreen scrollable={false}>
      <View style={styles.page}>
        <View style={styles.left}>
          <View style={styles.kickerRow}>
            <View
              style={[styles.kickerLine, { backgroundColor: theme.accent }]}
            />
            <Text style={[styles.kicker, { color: theme.accent }]}>
              DARK PREMIUM UI SYSTEM
            </Text>
          </View>
          <Text style={[styles.brand, { color: theme.text }]}>FLOW</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("home.heroTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("home.heroBody")}
          </Text>
          <Card style={styles.formCard}>
            <View style={styles.modeRow}>
              <Pressable
                onPress={() => setMode("sign-in")}
                style={({ pressed }) => [
                  styles.modeButton,
                  {
                    borderColor:
                      mode === "sign-in" ? theme.accent : theme.border,
                    backgroundColor:
                      mode === "sign-in"
                        ? theme.accentSoft
                        : theme.backgroundElement,
                  },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text
                  style={{
                    color:
                      mode === "sign-in"
                        ? theme.accentStrong
                        : theme.textSecondary,
                    fontWeight: "800",
                  }}
                >
                  Sign in
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode("sign-up")}
                style={({ pressed }) => [
                  styles.modeButton,
                  {
                    borderColor:
                      mode === "sign-up" ? theme.accent : theme.border,
                    backgroundColor:
                      mode === "sign-up"
                        ? theme.accentSoft
                        : theme.backgroundElement,
                  },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text
                  style={{
                    color:
                      mode === "sign-up"
                        ? theme.accentStrong
                        : theme.textSecondary,
                    fontWeight: "800",
                  }}
                >
                  Create account
                </Text>
              </Pressable>
            </View>
            <View style={styles.formFields}>
              {mode === "sign-up" ? (
                <View style={styles.inputShell}>
                  <Text
                    style={[styles.inputLabel, { color: theme.textSecondary }]}
                  >
                    Name
                  </Text>
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.backgroundSelected,
                      },
                    ]}
                    placeholder="Your name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              ) : null}
              <View style={styles.inputShell}>
                <Text
                  style={[styles.inputLabel, { color: theme.textSecondary }]}
                >
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[
                    styles.input,
                    {
                      color: theme.text,
                      borderColor: theme.border,
                      backgroundColor: theme.backgroundSelected,
                    },
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={styles.inputShell}>
                <Text
                  style={[styles.inputLabel, { color: theme.textSecondary }]}
                >
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={[
                    styles.input,
                    {
                      color: theme.text,
                      borderColor: theme.border,
                      backgroundColor: theme.backgroundSelected,
                    },
                  ]}
                  placeholder="Choose a password"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              {mode === "sign-up" ? (
                <View style={styles.inputShell}>
                  <Text
                    style={[styles.inputLabel, { color: theme.textSecondary }]}
                  >
                    Confirm password
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.backgroundSelected,
                      },
                    ]}
                    placeholder="Repeat password"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              ) : null}
            </View>
            {error ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {error}
              </Text>
            ) : null}
            <View style={styles.controls}>
              <LanguageSwitcher
                value={language}
                onChange={setLanguage}
                languages={languages}
              />
              <Pressable onPress={() => router.push("/(Auth)/connect-backend")}>
                <Text style={[styles.linkText, { color: theme.accent }]}>
                  Test backend connection
                </Text>
              </Pressable>
              <PrimaryButton
                label={
                  loading
                    ? t("common.loading")
                    : mode === "sign-up"
                      ? "Create account"
                      : "Continue"
                }
                onPress={handleSubmit}
              />
            </View>
          </Card>
        </View>

        <View style={styles.right}>
          <Card style={styles.heroCard}>
            <View style={styles.heroCardTop}>
              <Text style={[styles.panelLabel, { color: theme.accent }]}>
                SIGN-IN PREVIEW
              </Text>
              <Text style={[styles.panelValue, { color: theme.text }]}>
                ES / EN / PT
              </Text>
            </View>
            <View style={styles.metricRow}>
              <View style={styles.metricBlock}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>
                  3
                </Text>
                <Text
                  style={[styles.metricLabel, { color: theme.textSecondary }]}
                >
                  languages
                </Text>
              </View>
              <View style={styles.metricBlock}>
                <Text
                  style={[styles.metricNumber, { color: theme.accentStrong }]}
                >
                  57
                </Text>
                <Text
                  style={[styles.metricLabel, { color: theme.textSecondary }]}
                >
                  expo sdk
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.sideCard}>
            <Text style={[styles.panelLabel, { color: theme.accent }]}>
              MOTION
            </Text>
            <Text style={[styles.sideTitle, { color: theme.text }]}>
              Soft glow, thin borders and measured spacing.
            </Text>
            <Text style={[styles.sideCopy, { color: theme.textSecondary }]}>
              The interface keeps the app logic intact while moving the entire
              shell toward the same visual weight as the reference.
            </Text>
          </Card>
        </View>
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 1100,
    flexDirection: "row",
    gap: 28,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  left: {
    flex: 1,
    maxWidth: 720,
    gap: 18,
  },
  right: {
    flex: 1,
    gap: 16,
  },
  kickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kickerLine: {
    width: 42,
    height: 1,
    opacity: 0.9,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  brand: {
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 5,
    textTransform: "uppercase",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 18,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: 0.1,
    textTransform: "uppercase",
    maxWidth: 620,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    maxWidth: 640,
  },
  controls: {
    marginTop: 8,
    width: "100%",
    alignItems: "flex-start",
    gap: 12,
  },
  formCard: {
    gap: 14,
  },
  formFields: {
    gap: 12,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  modeButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputShell: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "700",
  },
  linkText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  quickPick: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  heroCard: {
    minHeight: 250,
    justifyContent: "space-between",
  },
  heroCardTop: {
    gap: 8,
  },
  panelLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  panelValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  metricRow: {
    flexDirection: "row",
    gap: 16,
  },
  metricBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 14,
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  metricNumber: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  sideCard: {
    gap: 10,
  },
  sideTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sideCopy: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
});
