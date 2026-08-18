import { createContext, useContext, useEffect, useState } from 'react';
import type { Actor } from '@/domain/actor';
import { apiClient } from '@/api/client';
import * as storage from '@/infrastructure/storage';

interface AuthContextValue {
  actor: Actor | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  becomeProvider: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [actor, setActor] = useState<Actor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from secure storage
  useEffect(() => {
    async function init() {
      try {
        const token = await storage.getAccessToken();
        const refresh = await storage.getRefreshToken();

        if (token) {
          const me = await apiClient.getMe(token);
          setAccessToken(token);
          setRefreshToken(refresh);
          setActor(me);
        }
      } catch {
        // Silent fail - user not authenticated
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.signIn({ email, password });
      await storage.saveTokens(result.accessToken, result.refreshToken);
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setActor(result.actor);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, displayName: string) {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.signUp({ email, password, displayName, capacities: ['customer'] });
      await storage.saveTokens(result.accessToken, result.refreshToken);
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setActor(result.actor);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      if (refreshToken) {
        await apiClient.signOut(refreshToken);
      }
    } catch {
      // Ignore errors
    } finally {
      await storage.clearTokens();
      setActor(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  }

  async function becomeProvider() {
    try {
      setLoading(true);
      if (!accessToken) throw new Error('Not authenticated');
      const updated = await apiClient.becomeProvider(accessToken);
      setActor(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to become provider';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        actor,
        accessToken,
        refreshToken,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        becomeProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
