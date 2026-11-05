import type { ReactNode } from 'react';

import { useCurrentRole } from '@/utils/hooks/useCurrentRole';
import { hasAccess, type Role } from '@/utils/types/roles';

type PermissionGuardProps = {
  /** Роли, которым показывается содержимое. */
  allowed: readonly Role[];
  /** Что показать без доступа. Для страницы лучше Navigate. */
  fallback?: ReactNode;
  children: ReactNode;
};

/** Защита интерфейса. Данные защищает бэкенд на каждом эндпоинте. */
export function PermissionGuard({
  allowed,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const role = useCurrentRole();
  return <>{hasAccess(role, allowed) ? children : fallback}</>;
}
