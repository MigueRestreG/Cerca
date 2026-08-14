import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import { apiClient } from "@/api/client";
import type { ApiActor } from "@/api/types";
import { clearSession, loadSession, saveSession } from "@/lib/session-store";

type SessionState = {
  actor: ApiActor | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    displayName: string;
    capacities?: ("customer" | "provider")[];
  }) => Promise<void>;
  signOut: () => Promise<void>;
  becomeProvider: () => Promise<void>;
  setSession: (
    session: {
      actor: ApiActor;
      accessToken: string;
      refreshToken: string;
    } | null,
  ) => Promise<void>;
};

const AuthContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<ApiActor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = async (
    session: {
      actor: ApiActor;
      accessToken: string;
      refreshToken: string;
    } | null,
  ) => {
    if (!session) {
      await clearSession();
      setActor(null);
      setAccessToken(null);
      setRefreshToken(null);
      return;
    }

    await saveSession(session);
    setActor(session.actor);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiClient.signIn({ email, password });
      await setSession(result);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (input: {
    email: string;
    password: string;
    displayName: string;
    capacities?: ("customer" | "provider")[];
  }) => {
    setLoading(true);
    try {
      const result = await apiClient.signUp(input);
      await setSession(result);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (refreshToken) {
      try {
        await apiClient.signOut(refreshToken);
      } catch {
        // Ignore sign-out failures; the local session is still cleared.
      }
    }
    await setSession(null);
  };

  const becomeProvider = async () => {
    if (!accessToken) {
      return;
    }

    const updated = await apiClient.becomeProvider(accessToken);
    setActor(updated);
  };

  useEffect(() => {
    let active = true;

    const hydrateSession = async () => {
      try {
        const persisted = await loadSession();
        if (!active || !persisted) {
          return;
        }

        setActor(persisted.actor);
        setAccessToken(persisted.accessToken);
        setRefreshToken(persisted.refreshToken);

        try {
          const me = await apiClient.getMe(persisted.accessToken);
          if (active) {
            setActor(me);
          }
        } catch {
          if (active) {
            await clearSession();
            setActor(null);
            setAccessToken(null);
            setRefreshToken(null);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        actor,
        accessToken,
        refreshToken,
        loading,
        signIn,
        signUp,
        signOut,
        becomeProvider,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
