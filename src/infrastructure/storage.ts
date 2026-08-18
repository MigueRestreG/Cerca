import { getItem, setItem, deleteItemAsync } from 'expo-secure-store';

const TOKEN_KEY = 'cerca_access_token';
const REFRESH_TOKEN_KEY = 'cerca_refresh_token';

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await setItem(TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // Silently fail - tokens just won't persist
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await deleteItemAsync(TOKEN_KEY);
    await deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    // Silently fail
  }
}
