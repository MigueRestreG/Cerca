import { useCallback, useEffect, useRef, useState } from 'react';

type RemoteState<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
	refresh: () => void;
};

export function useRemoteData<T>(loader: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[] = []): RemoteState<T> {
	const loaderRef = useRef(loader);
	const initializedRef = useRef(false);
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshIndex, setRefreshIndex] = useState(0);

	useEffect(() => {
		loaderRef.current = loader;
	});

	const fetchData = useCallback(() => {
		const controller = new AbortController();
		let active = true;

		loaderRef.current(controller.signal)
			.then((value) => {
				if (!active) {
					return;
				}
				setData(value);
				setError(null);
			})
			.catch((reason: unknown) => {
				if (!active || controller.signal.aborted) {
					return;
				}
				setError(reason instanceof Error ? reason.message : 'Request failed');
				setData(null);
			})
			.finally(() => {
				if (!active || controller.signal.aborted) {
					return;
				}
				setLoading(false);
			});

		return () => {
			active = false;
			controller.abort();
		};
	}, []);

	const refresh = useCallback(() => {
		setRefreshIndex((current) => current + 1);
	}, []);

	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
		}
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLoading(true);
		return fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refreshIndex, ...deps]);

	return {
		data,
		loading,
		error,
		refresh,
	};
}
