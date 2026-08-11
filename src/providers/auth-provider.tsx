import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { apiClient } from '@/api/client';
import type { ApiActor } from '@/api/types';

type SessionState = {
	actor: ApiActor | null;
	accessToken: string | null;
	refreshToken: string | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (input: { email: string; password: string; displayName: string; capacities?: Array<'customer' | 'provider'> }) => Promise<void>;
	signOut: () => Promise<void>;
	becomeProvider: () => Promise<void>;
	setSession: (session: { actor: ApiActor; accessToken: string; refreshToken: string } | null) => void;
};

const AuthContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [actor, setActor] = useState<ApiActor | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const setSession = (session: { actor: ApiActor; accessToken: string; refreshToken: string } | null) => {
		if (!session) {
			setActor(null);
			setAccessToken(null);
			setRefreshToken(null);
			return;
		}

		setActor(session.actor);
		setAccessToken(session.accessToken);
		setRefreshToken(session.refreshToken);
	};

	const signIn = async (email: string, password: string) => {
		setLoading(true);
		try {
			const result = await apiClient.signIn({ email, password });
			setSession(result);
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (input: { email: string; password: string; displayName: string; capacities?: Array<'customer' | 'provider'> }) => {
		setLoading(true);
		try {
			const result = await apiClient.signUp(input);
			setSession(result);
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
		setSession(null);
	};

	const becomeProvider = async () => {
		if (!accessToken) {
			return;
		}

		const updated = await apiClient.becomeProvider(accessToken);
		setActor(updated);
	};

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
			.catch(() => {
				if (active) {
					setSession(null);
				}
			});

		return () => {
			active = false;
		};
	}, [accessToken]);

	const value = useMemo<SessionState>(
		() => ({
			actor,
			accessToken,
			refreshToken,
			loading,
			signIn,
			signUp,
			signOut,
			becomeProvider,
			setSession,
		}),
		[actor, accessToken, refreshToken, loading],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
}
