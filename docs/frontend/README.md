# Frontend

Запуск: `cd frontend && npm ci && npm run dev`.

| Команда                | Что делает               |
| ---------------------- | ------------------------ |
| `npm run dev`          | dev-сервер               |
| `npm run format`       | форматирует frontend     |
| `npm run format:check` | проверяет форматирование |
| `npm run lint`         | eslint                   |
| `npm run typecheck`    | проверка типов           |
| `npm run build`        | сборка                   |
| `npm run structure`    | проверка структуры папок |

Переменные в `frontend/.env.local`: `HOST` и `API_PROXY_TARGET` (адрес backend для прокси `/api`).

Перед коммитом проверяются структура, prettier и eslint по изменённым файлам. Перед push дополнительно проверяются весь frontend и типы.

Структура папок: [structure.md](../structure.md).
