# Структура репозитория

Файл создаёт `node scripts/structure.mjs create`. Не править вручную: список задаётся в скрипте.

## Обязательные папки

- `backend/`
- `docs/`
- `.githooks/`
- `.github/workflows/`
- `scripts/`
- `frontend/public/`
- `frontend/src/App/`
- `frontend/src/components/`
- `frontend/src/pages/`
- `frontend/src/utils/`

## Слои frontend/src

- `App/`: общие обёртки: App, Routes, ContentLayout
- `components/`: переиспользуемые компоненты
- `pages/`: страницы, по одной на маршрут
- `utils/`: API, хуки и типы
