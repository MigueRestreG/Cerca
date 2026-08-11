import { useMemo, useState } from "react";
import { Text, TextInput } from "react-native";

import { API_HEALTHCHECK_URL } from "@/api/config";
import { useTheme } from "@/hooks/use-theme";
import { AppScreen, Card, PrimaryButton } from "@/UI";

export default function ConnectBackendScreen() {
  const theme = useTheme();
  const [url, setUrl] = useState(API_HEALTHCHECK_URL);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const canTest = useMemo(() => url.trim().length > 0, [url]);

  const initialUrl = API_HEALTHCHECK_URL;
  const effectiveUrl = url || initialUrl;

  async function testConnection() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(effectiveUrl, { method: "GET" });
      const body = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setStatus("ok");
      setMessage(body || "Backend reachable.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Connection failed.");
    }
  }

  return (
    <AppScreen>
      <Card style={{ gap: 14 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: theme.text }}>
          Conectar al backend
        </Text>
        <Text
          style={{ fontSize: 13, lineHeight: 20, color: theme.textSecondary }}
        >
          Define la URL del backend para que el app pueda autenticar usuarios y
          cargar datos reales.
        </Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: theme.text,
          }}
          placeholder="http://localhost:3333/v1/health"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PrimaryButton
          label={status === "loading" ? "Probando..." : "Probar conexión"}
          onPress={() => {
            if (!canTest) {
              return;
            }
            void testConnection();
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color:
              status === "ok"
                ? theme.accentStrong
                : status === "error"
                  ? theme.danger
                  : theme.textSecondary,
          }}
        >
          {message ||
            "Usa EXPO_PUBLIC_API_URL para fijar una URL distinta en móviles o web."}
        </Text>
      </Card>
    </AppScreen>
  );
}
