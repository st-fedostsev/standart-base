import type { AxiosInstance } from 'axios';

import { ApiError } from '@/utils/api/errors';
import { ResponseStatuses } from '@/utils/api/utils';
import type { CurrentUser } from '@/utils/types/user';

export class AuthApi {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * Текущий пользователь. null, если не вошли (401). Путь api/me —
   * предположение.
   */
  getCurrentUser = async (): Promise<CurrentUser | null> => {
    try {
      const { data } = await this.http.get<CurrentUser>('api/me');
      return data;
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === ResponseStatuses.Unauthorized
      ) {
        return null;
      }
      throw error;
    }
  };

  /** Выход на сервере. Путь api/logout — предположение. */
  logout = async (): Promise<void> => {
    await this.http.post('api/logout');
  };
}
