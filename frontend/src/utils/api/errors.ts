/**
 * Тело ошибки от backend. Поддерживаются свой формат (error.code) и FastAPI
 * (detail).
 */
export interface ErrorBody {
  error?: {
    code?: string;
    message?: string;
    context?: Record<string, unknown>;
  };
  detail?: unknown;
  traceId?: string;
}

type ParsedError = {
  code: string;
  message?: string;
  context?: Record<string, unknown>;
  traceId?: string;
};

function parseErrorBody(body: unknown, status: number): ParsedError {
  const fallback: ParsedError = { code: `HTTP_${status}` };
  if (typeof body !== 'object' || body === null) return fallback;

  const { error, detail, traceId } = body as ErrorBody;

  if (error && typeof error.code === 'string') {
    return {
      code: error.code,
      message: error.message,
      context: error.context,
      traceId,
    };
  }
  if (typeof detail === 'string') {
    return { ...fallback, message: detail, traceId };
  }
  return { ...fallback, traceId };
}

/**
 * Ошибка API. code и status нужны логике, serverMessage можно показать
 * пользователю.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly serverMessage?: string;
  readonly context?: Record<string, unknown>;
  readonly traceId?: string;

  constructor(body: unknown, status: number, traceIdFromHeader?: string) {
    const parsed = parseErrorBody(body, status);
    super(parsed.code);
    this.name = 'ApiError';
    this.status = status;
    this.code = parsed.code;
    this.serverMessage = parsed.message;
    this.context = parsed.context;
    this.traceId = traceIdFromHeader ?? parsed.traceId;
  }
}
