import { useEffect, useRef, useState } from 'react';

type RemoteState<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
	refresh: () => void;
};

export function useRemoteData<T>(loader: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[] = []): RemoteState<T> {
	const loaderRef = useRef(loader);
	loaderRef.current = loader;
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshIndex, setRefreshIndex] = useState(0);

	useEffect(() => {
		const controller = new AbortController();
		let active = true;

		setLoading(true);
		setError(null);

		loaderRef.current(controller.signal)
			.then((value) => {
				if (!active) {
					return;
				}
				setData(value);
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
	}, [refreshIndex, ...deps]);

	return {
		data,
		loading,
		error,
		refresh: () => setRefreshIndex((current) => current + 1),
	};
}
