import { type DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: +import.meta.env.VITE_STALE_TIME * 60 * 1000,
    retry: +import.meta.env.VITE_GET_RETRY_COUNT,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: 0, // Повторять мутации только 0 раз при ошибке
  },
};

export const tanstackQueryClient = new QueryClient({ defaultOptions: queryConfig });
