import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ApiActor } from "@/api/types";

const SESSION_KEY = "cerca.session";

type PersistedSession = {
  actor: ApiActor;
  accessToken: string;
  refreshToken: string;
};

export async function saveSession(session: PersistedSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedSession;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
