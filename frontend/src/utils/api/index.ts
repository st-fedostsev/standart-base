import type { AxiosInstance } from 'axios';

import { AuthApi } from '@/utils/api/auth';
import { createHttpClient } from '@/utils/api/client';

export { ApiError, type ErrorBody } from '@/utils/api/errors';
export { DEFAULT_TIMEOUT_MS, onAccessError } from '@/utils/api/client';
export {
  AccessErrors,
  isAccessStatus,
  ResponseStatuses,
  type AccessStatus,
  type ResponseStatus,
} from '@/utils/api/utils';

/**
 * Реестр всех API приложения. Новый раздел: класс в utils/api/<name>.ts, поле
 * здесь и строка в конструкторе. Параметр http нужен для тестов: можно передать
 * клиент-заглушку.
 */
export default class Api {
  public readonly Auth: AuthApi;

  constructor(http: AxiosInstance = createHttpClient()) {
    this.Auth = new AuthApi(http);
  }
}

/** Общий экземпляр для приложения: import { api } from "@/utils/api" */
export const api = new Api();
