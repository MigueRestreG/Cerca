import * as SecureStore from "expo-secure-store";

import type { ApiActor } from "@/api/types";

const SESSION_KEY = "cerca.session";

type PersistedSession = {
  actor: ApiActor;
  accessToken: string;
  refreshToken: string;
};

export async function saveSession(session: PersistedSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedSession;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
