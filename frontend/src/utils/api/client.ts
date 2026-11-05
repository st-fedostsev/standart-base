import axios, { type AxiosInstance } from 'axios';

import { ApiError } from '@/utils/api/errors';
import { isAccessStatus, type AccessStatus } from '@/utils/api/utils';

/** Таймаут по умолчанию * */
export const DEFAULT_TIMEOUT_MS = 60_000;

/** Заголовок с trace id. Предположение, TODO сверить с backend. */
const TRACE_ID_HEADER = 'x-trace-id';

type AccessListener = (status: AccessStatus) => void;

const accessListeners = new Set<AccessListener>();

/**
 * Подписка на ответы 401 и 403 от любого запроса. Возвращает функцию отписки,
 * её удобно отдавать из useEffect.
 */
export function onAccessError(listener: AccessListener): () => void {
  accessListeners.add(listener);
  return () => {
    accessListeners.delete(listener);
  };
}

export function createHttpClient(): AxiosInstance {
  const http = axios.create({
    // Пусто означает тот же origin: запросы /api уходят через прокси Vite
    baseURL: import.meta.env.VITE_API_URL ?? '/',
    timeout: DEFAULT_TIMEOUT_MS,
    // Сессия хранится в cookie
    withCredentials: true,
    headers: { Accept: 'application/json' },
  });

  http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data, headers } = error.response;
        const traceId = headers[TRACE_ID_HEADER];

        if (isAccessStatus(status)) {
          accessListeners.forEach((listener) => listener(status));
        }

        return Promise.reject(
          new ApiError(
            data,
            status,
            typeof traceId === 'string' ? traceId : undefined
          )
        );
      }
      // Ответа не было (сеть, таймаут): отдаём исходную ошибку
      return Promise.reject(error);
    }
  );

  return http;
}
