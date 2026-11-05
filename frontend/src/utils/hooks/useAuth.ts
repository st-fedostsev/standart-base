// src/utils/hooks/useAuth.ts
import { createContext, useContext } from 'react';

import type { CurrentUser } from '@/utils/types/user';

export type AuthContextValue = {
  /** Текущий пользователь или null, если не вошли. */
  user: CurrentUser | null;
  /** True, пока первый запрос /me не завершён. */
  isPending: boolean;
  /** Перечитать пользователя, например после входа. */
  refresh: () => Promise<void>;
  /** Выход: запрос на сервер и сброс пользователя на клиенте. */
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth вызван вне AuthProvider');
  }
  return value;
}
