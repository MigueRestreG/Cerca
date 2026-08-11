import { Platform } from "react-native";

const defaultBaseUrl = Platform.select({
  android: "http://10.0.2.2:3333",
  ios: "http://localhost:3333",
  web: "http://localhost:3333",
  default: "http://localhost:3333",
});

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_BASE_URL =
  configuredApiUrl || defaultBaseUrl || "http://localhost:3333";
export const API_VERSION_PREFIX = "/v1";

export const API_HEALTHCHECK_URL = `${API_BASE_URL.replace(/\/$/, "")}${API_VERSION_PREFIX}/health`;
