export const ROLES = {
  Guest: 'guest',
  AuthGuest: 'auth_guest',
  Author: 'author',
  Admin: 'admin',
} as const;

/** Union значений: "guest" | "auth_guest" | "author" | "admin" */
export type Role = (typeof ROLES)[keyof typeof ROLES];

const ROLE_VALUES: readonly string[] = Object.values(ROLES);

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.Guest]: 'Гость',
  [ROLES.AuthGuest]: 'Авторизованный гость',
  [ROLES.Author]: 'Автор',
  [ROLES.Admin]: 'Администратор',
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLE_VALUES.includes(value);
}

/**
 * Allowed не задан: доступ всем. Задан: роль должна входить в список. null (не
 * вошёл) доступа не даёт.
 */
export function hasAccess(
  role: Role | null,
  allowed?: readonly Role[]
): boolean {
  if (allowed === undefined) return true;
  return role !== null && allowed.includes(role);
}
