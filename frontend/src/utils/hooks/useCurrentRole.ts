import { useAuth } from '@/utils/hooks/useAuth';
import type { Role } from '@/utils/types/roles';

/** Не вошедший пользователь имеет роль guest. Авторизация подключится позже. */
export function useCurrentRole(): Role {
  return useAuth().user?.role ?? 'guest';
}
