import { type DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: +import.meta.env.VITE_STALE_TIME * 60 * 1000, // Данные считаются свежими 5 минут
    retry: +import.meta.env.VITE_GET_RETRY_COUNT, // Количество повторных попыток запроса при ошибке
    refetchOnWindowFocus: true, // Не обновлять данные при фокусе окна
    refetchOnReconnect: true, // Перезапрашивать данные при восстановлении соединения
    refetchOnMount: false, // Не делать повторный запрос при монтировании компонента
  },
  mutations: {
    retry: 0, // Повторять мутации только 0 раз при ошибке
  },
};

export const tanstackQueryClient = new QueryClient({ defaultOptions: queryConfig });
