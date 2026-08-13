import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
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
  isHydrating: boolean;
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
    session: { actor: ApiActor; accessToken: string; refreshToken: string } | null,
  ) => Promise<void>;
};

const AuthContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<ApiActor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [loading, setLoading] = useState(false);

  const setSession = useCallback(async (
    session: {
      actor: ApiActor;
      accessToken: string;
      refreshToken: string;
    } | null,
  ) => {
    if (!session) {
      try {
        await clearSession();
      } finally {
        setActor(null);
        setAccessToken(null);
        setRefreshToken(null);
      }
      return;
    }

    await saveSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    setActor(session.actor);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiClient.signIn({ email, password });
      await setSession(result);
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  const signUp = useCallback(async (input: {
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
  }, [setSession]);

  const signOut = useCallback(async () => {
    if (refreshToken) {
      try {
        await apiClient.signOut(refreshToken);
      } catch {
        // Ignore sign-out failures; the local session is still cleared.
      }
    }
    await setSession(null);
  }, [refreshToken, setSession]);

  const becomeProvider = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const updated = await apiClient.becomeProvider(accessToken);
    setActor(updated);
  }, [accessToken]);

  useEffect(() => {
    let active = true;

    const hydrateSession = async () => {
      try {
        const persisted = await loadSession();

        if (!active || !persisted) {
          return;
        }

        setAccessToken(persisted.accessToken);
        setRefreshToken(persisted.refreshToken);
      } finally {
        if (active) {
          setIsHydrating(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let active = true;
    apiClient
      .getMe(accessToken)
      .then((me) => {
        if (active) {
          setActor(me);
        }
      })
      .catch(async () => {
        if (active) {
          await setSession(null);
        }
      });

    return () => {
      active = false;
    };
  }, [accessToken, setSession]);

  const value = useMemo<SessionState>(
    () => ({
      actor,
      accessToken,
      refreshToken,
      isHydrating,
      loading,
      signIn,
      signUp,
      signOut,
      becomeProvider,
      setSession,
    }),
    [
      actor,
      accessToken,
      refreshToken,
      isHydrating,
      loading,
      signIn,
      signUp,
      signOut,
      becomeProvider,
      setSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
