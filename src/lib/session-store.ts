import * as SecureStore from "expo-secure-store";

import { z } from "zod";

const SESSION_KEY = "cerca.session";

const PersistedSessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export type PersistedSession = z.infer<typeof PersistedSessionSchema>;

export async function saveSession(session: PersistedSession) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession() {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);

    if (!raw) {
      return null;
    }

    const parsed = PersistedSessionSchema.safeParse(JSON.parse(raw));

    if (parsed.success) {
      return parsed.data;
    }
  } catch {
    // Treat unreadable or malformed local data as a signed-out session.
  }

  await SecureStore.deleteItemAsync(SESSION_KEY).catch(() => {});
  return null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
