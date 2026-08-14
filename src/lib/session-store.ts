import * as SecureStore from "expo-secure-store";

import type { ApiActor } from "@/api/types";

const SESSION_KEY = "cerca.session";

type PersistedSession = {
  actor: ApiActor;
  accessToken: string;
  refreshToken: string;
};

export async function saveSession(session: PersistedSession) {
  await setItem(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession() {
  const raw = await getItem(SESSION_KEY);

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
  await deleteItem(SESSION_KEY);
}

// Adapter helpers: prefer expo-secure-store, fallback to localStorage (web) or in-memory store
const inMemoryStore = new Map<string, string>();

async function getItem(key: string): Promise<string | null> {
  // Try SecureStore first; if it fails for any reason, fallback to web localStorage or in-memory
  try {
    if (typeof (SecureStore as any).getItemAsync === 'function') {
      try {
        const v = await (SecureStore as any).getItemAsync(key);
        return v;
      } catch {
        // fallthrough to fallback storage
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }

    return inMemoryStore.get(key) ?? null;
  } catch {
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    if (typeof (SecureStore as any).setItemAsync === 'function') {
      try {
        await (SecureStore as any).setItemAsync(key, value);
        return;
      } catch {
        // fallthrough
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }

    inMemoryStore.set(key, value);
  } catch {
    // ignore
  }
}

async function deleteItem(key: string): Promise<void> {
  try {
    if (typeof (SecureStore as any).deleteItemAsync === 'function') {
      try {
        await (SecureStore as any).deleteItemAsync(key);
        return;
      } catch {
        // fallthrough
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }

    inMemoryStore.delete(key);
  } catch {
    // ignore
  }
}
