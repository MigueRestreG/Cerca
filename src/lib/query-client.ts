import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api';

function isPermissionError(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => !isPermissionError(error) && failureCount < 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});