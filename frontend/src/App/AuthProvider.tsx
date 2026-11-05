import { useCallback, useEffect, useMemo, type ReactNode } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ResponseStatuses, api, onAccessError } from '@/utils/api';
import { AuthContext, type AuthContextValue } from '@/utils/hooks/useAuth';

const ME_KEY = ['me'] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ME_KEY,
    queryFn: api.Auth.getCurrentUser,
    // Перечитывать при возврате на вкладку
    refetchOnWindowFocus: 'always',
  });

  // Сессия истекла в любом запросе: сразу переводим пользователя в гостя
  useEffect(
    () =>
      onAccessError((status) => {
        if (status === ResponseStatuses.Unauthorized) {
          queryClient.setQueryData(ME_KEY, null);
        }
      }),
    [queryClient]
  );

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ME_KEY });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await api.Auth.logout();
    } finally {
      // Даже если сервер не ответил, на клиенте пользователь уже гость
      queryClient.setQueryData(ME_KEY, null);
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ user: data ?? null, isPending, refresh, logout }),
    [data, isPending, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
