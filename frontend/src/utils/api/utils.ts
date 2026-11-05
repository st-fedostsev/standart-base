/**
 * HTTP-статусы, которые используем в коде. Объект вместо enum: в tsconfig
 * включён erasableSyntaxOnly, а он запрещает enum.
 */
export const ResponseStatuses = {
  Conflict: 409,
  Forbidden: 403,
  NotFound: 404,
  Unauthorized: 401,
  UnprocessableEntity: 422,
} as const;

export type ResponseStatus =
  (typeof ResponseStatuses)[keyof typeof ResponseStatuses];

/**
 * Статусы, по которым понятно, что доступа нет: нет входа или прав
 * недостаточно.
 */
export const AccessErrors = [
  ResponseStatuses.Forbidden,
  ResponseStatuses.Unauthorized,
] as const;

export type AccessStatus = (typeof AccessErrors)[number];

export function isAccessStatus(status: number): status is AccessStatus {
  return (AccessErrors as readonly number[]).includes(status);
}
