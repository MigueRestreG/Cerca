import { useEffect, useRef, useState } from "react";

type RemoteState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useRemoteData<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = [],
): RemoteState<T> {
  const loaderRef = useRef(loader);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const runLoader = () => {
      setLoading(true);
      setError(null);

      void loaderRef
        .current(controller.signal)
        .then((value) => {
          if (!active || controller.signal.aborted) {
            return;
          }
          setData(value);
        })
        .catch((reason: unknown) => {
          if (!active || controller.signal.aborted) {
            return;
          }
          setError(reason instanceof Error ? reason.message : "Request failed");
          setData(null);
        })
        .finally(() => {
          if (!active || controller.signal.aborted) {
            return;
          }
          setLoading(false);
        });
    };

    void runLoader();

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
