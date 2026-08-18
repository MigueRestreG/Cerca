import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ApiError, apiClient } from '@/api/client';
import type { ApiActor } from '@/api/types';
import { authenticateLocalUser, createLocalActor, registerLocalUser } from '@/infrastructure/local-auth';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/infrastructure/storage';

type SessionState = {
	actor: ApiActor | null;
	accessToken: string | null;
	refreshToken: string | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (input: { email: string; password: string; displayName: string; capacities?: ('customer' | 'provider')[] }) => Promise<void>;
	signOut: () => Promise<void>;
	becomeProvider: () => Promise<void>;
	setSession: (session: { actor: ApiActor; accessToken: string; refreshToken: string | null } | null) => void;
};

const AuthContext = createContext<SessionState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [actor, setActor] = useState<ApiActor | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const setSession = useCallback((session: { actor: ApiActor; accessToken: string; refreshToken: string | null } | null) => {
		if (!session) {
			setActor(null);
			setAccessToken(null);
			setRefreshToken(null);
			return;
		}

		setActor(session.actor);
		setAccessToken(session.accessToken);
		setRefreshToken(session.refreshToken);
	}, []);

	const signIn = useCallback(async (email: string, password: string) => {
		setLoading(true);
		try {
			const result = await apiClient.signIn({ email, password });
			await saveTokens(result.accessToken, result.refreshToken);
			setSession(result);
		} catch (error) {
			if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
				const user = authenticateLocalUser({ email, password });
				const localSession = {
					accessToken: `local-${user.id}`,
					refreshToken: `local-refresh-${user.id}`,
					actor: createLocalActor(user),
				};
				await saveTokens(localSession.accessToken, localSession.refreshToken);
				setSession(localSession);
				return;
			}

			throw error;
		} finally {
			setLoading(false);
		}
	}, [setSession]);

	const signUp = useCallback(async (input: { email: string; password: string; displayName: string; capacities?: ('customer' | 'provider')[] }) => {
		setLoading(true);
		try {
			const result = await apiClient.signUp(input);
			await saveTokens(result.accessToken, result.refreshToken);
			setSession(result);
		} catch (error) {
			if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
				try {
					const user = registerLocalUser(input);
					const localSession = {
						accessToken: `local-${user.id}`,
						refreshToken: `local-refresh-${user.id}`,
						actor: createLocalActor(user),
					};
					await saveTokens(localSession.accessToken, localSession.refreshToken);
					setSession(localSession);
					return;
				} catch (localError) {
					if (localError instanceof Error && localError.message === 'EMAIL_EXISTS') {
						throw new ApiError(409, 'EMAIL_EXISTS', 'Email already exists', null);
					}
					throw localError;
				}
			}

			throw error;
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
		await clearTokens();
		setSession(null);
	}, [refreshToken, setSession]);

	const becomeProvider = useCallback(async () => {
		if (!accessToken) {
			return;
		}

		setLoading(true);
		try {
			const updated = await apiClient.becomeProvider(accessToken);
			setActor(updated);
		} finally {
			setLoading(false);
		}
	}, [accessToken]);

	useEffect(() => {
		let active = true;

		async function bootstrap() {
			try {
				const token = await getAccessToken();
				const refresh = await getRefreshToken();

				if (!token) {
					return;
				}

				const me = await apiClient.getMe(token);
				if (!active) {
					return;
				}

				setSession({ actor: me, accessToken: token, refreshToken: refresh });
			} catch {
				if (!active) {
					return;
				}
				await clearTokens();
				setSession(null);
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		bootstrap();

		return () => {
			active = false;
		};
	}, [setSession]);

	useEffect(() => {
		if (!accessToken) {
			return;
		}

		if (accessToken.startsWith('local-')) {
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
					await clearTokens();
					setSession(null);
				}
			});

		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		[actor, accessToken, refreshToken, loading, signIn, signUp, signOut, becomeProvider, setSession],
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
