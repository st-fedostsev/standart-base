# База стандартов и лучших практик

Модуль для накопления, поиска и публикации проверенных решений предприятия: карточки материалов, поиск по категориям, модерация публикаций и разграничение доступа для внутренних и внешних пользователей.

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![SQLModel](https://img.shields.io/badge/SQLModel-1F2937) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## Стек

| Часть         | Технологии                                                      | Где лежит                     |
| ------------- | --------------------------------------------------------------- | ----------------------------- |
| Frontend      | React, TypeScript, MUI (Material UI), Vite                      | `frontend/`                   |
| Backend       | Python, FastAPI, SQLModel                                       | `backend/`                    |
| База данных   | PostgreSQL, драйвер `psycopg`                                   | адрес задаётся `DATABASE_URL` |
| Качество кода | ESLint, Prettier, TypeScript (frontend); Ruff, pytest (backend) | `frontend/`, `backend/`       |
| Автоматизация | GitHub Actions, git-хуки, CODEOWNERS                            | `.github/`, `.githooks/`      |

## Структура репозитория

```
standart-base/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            проверки frontend
│   │   └── backend.yml       проверки backend
│   └── CODEOWNERS            владельцы папок
├── .githooks/
│   ├── pre-commit            проверка перед коммитом
│   └── pre-push              проверка перед push
├── backend/                  FastAPI, SQLModel
├── docs/                     документация
├── frontend/                 React, TypeScript, MUI
└── scripts/
    └── structure.mjs         проверка структуры папок
```

Папки `frontend/src`:

| Папка         | Что внутри                                      |
| ------------- | ----------------------------------------------- |
| `App/`        | общие обёртки: `App`, `Routes`, `ContentLayout` |
| `components/` | переиспользуемые компоненты                     |
| `pages/`      | страницы, по одной на маршрут                   |
| `utils/`      | API-клиент, хуки и типы                         |

Импорты из `src` пишутся через алиас `@/`, например `@/utils/api`.

Проверка структуры:

```bash
node scripts/structure.mjs check    # сравнивает папки с эталоном
node scripts/structure.mjs create   # создаёт недостающие папки и docs/structure.md
```

## Ветки

| Ветка                     | Назначение                        | Куда вливается                     |
| ------------------------- | --------------------------------- | ---------------------------------- |
| `rc`                      | релиз, ветка по умолчанию, деплой | —                                  |
| `dev`                     | стенд для проверки                | `rc`                               |
| `frontend`                | общая ветка фронтенда             | `dev`                              |
| `backend`                 | общая ветка бэкенда               | `dev`                              |
| `feature/BSP-XX-описание` | задача одного человека            | `frontend` или `backend`           |
| `hotfix/описание`         | срочная правка                    | `rc`, затем `rc` вливается в `dev` |

Правила:

- `rc`, `dev`, `frontend` и `backend` меняются только через Pull Request.
- Одобрение владельца папки по `CODEOWNERS` обязательно.
- Force push в защищённые ветки запрещён.
- Фича создаётся от `frontend` или `backend`: `git checkout -b feature/BSP-67-main-page origin/frontend`. В PR базовой веткой выбирайте `frontend`, а не `rc`.
- Чтобы подтянуть `dev` во `frontend`, создайте ветку от `frontend`, выполните `git merge origin/dev` и откройте PR в `frontend`.
- После hotfix вливайте `rc` в `dev`, иначе исправление может потеряться.

## Владельцы

`.github/CODEOWNERS`:

/frontend/ @st-fedostsev @FOCUSnik1758
/backend/ @rtmrslnv

Владельцы получают запрос на ревью автоматически, если в правилах веток включено «Require review from Code Owners».

## Проверки

### Git-хуки

Включаются при `npm ci` в `frontend/` (скрипт `prepare`). Вручную: `git config core.hooksPath .githooks`.

| Хук          | Когда        | Что проверяет                                                       |
| ------------ | ------------ | ------------------------------------------------------------------- |
| `pre-commit` | `git commit` | структура папок; Prettier и ESLint по изменённым файлам `frontend/` |
| `pre-push`   | `git push`   | структура; Prettier, ESLint и типы по всему `frontend/`             |

Хуки только проверяют и ничего не исправляют. Форматирование исправляется командой `npm run format` в `frontend/`. Если `node_modules` нет, коммит останавливается с подсказкой. `--no-verify` обходит хуки, но CI всё равно проверит PR.

### CI

| Файл                          | Запускается на PR в | Шаги                                                                   |
| ----------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `ci.yml` (job `frontend`)     | `frontend`, `dev`   | структура → `npm ci` → `format:check` → `lint` → `typecheck` → `build` |
| `backend.yml` (job `backend`) | `backend`, `dev`    | `pip install` → `ruff check` → `ruff format --check` → `pytest`        |

Шаги идут по порядку: если один падает, следующие не выполняются. Результат виден в PR как check. Чтобы CI блокировал слияние, отметьте checks `frontend` и `backend` как обязательные в Settings → Branches.

## Запуск

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Версия Node задаётся в `frontend/.nvmrc` (сейчас 22), переключение через `nvm use`. Dev-сервер: http://localhost:5173.

| Команда                | Что делает                 |
| ---------------------- | -------------------------- |
| `npm run dev`          | dev-сервер                 |
| `npm run build`        | проверка типов и сборка    |
| `npm run format`       | Prettier: исправляет файлы |
| `npm run format:check` | Prettier: только проверка  |
| `npm run lint`         | ESLint                     |
| `npm run typecheck`    | проверка типов TypeScript  |
| `npm run structure`    | проверка структуры папок   |

Переменные в `frontend/.env.local` (файл не коммитится):

```
HOST=localhost
API_PROXY_TARGET=http://localhost:<порт backend>
```

`API_PROXY_TARGET` задаёт адрес backend для запросов на `/api`. Если значение пустое, прокси не включается.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

Документация API (Swagger): http://localhost:8000/docs.

| Команда                 | Что делает                                           |
| ----------------------- | ---------------------------------------------------- |
| `ruff check .`          | линтер                                               |
| `ruff format --check .` | проверка форматирования (`ruff format .` исправляет) |
| `pytest`                | тесты                                                |

Переменные окружения лежат в `backend/.env` (файл не коммитится). Адрес БД задаётся `DATABASE_URL`.

## Тесты

- **Backend:** тестов пока нет. `pytest` без тестов завершается с кодом 5, и шаг в CI падает. Первый тест нужен до первого PR в `backend`.
- **Frontend:** unit-тесты логики в `src/utils` на Vitest и Testing Library. Команда `npm run test` появится после их настройки. E2E на Playwright добавим, когда будет стенд `dev`.

## Документация

| Документ                 | Где                                                         |
| ------------------------ | ----------------------------------------------------------- |
| Оглавление               | [docs/README.md](docs/README.md)                            |
| Структура репозитория    | [docs/structure.md](docs/structure.md) (создаётся скриптом) |
| Frontend                 | [docs/frontend/README.md](docs/frontend/README.md)          |
| Backend                  | [docs/backend/README.md](docs/backend/README.md)            |
| Бриф                     | [ссылка]                                                    |
| Бэклог                   | [ссылка]                                                    |
| Матрица прав доступа     | [ссылка]                                                    |
| Инструкция по наполнению | [ссылка]                                                    |

Ссылки на `docs/...` работают на GitHub, если эти файлы закоммичены.

## Ограничения

- Проверки CI не запускаются на PR в `rc`.
- Тесты frontend не входят в CI, пока не добавлен шаг `npm run test`.
- Хуки проверяют только frontend.
- Деплой не автоматизирован.
- Новый push не отменяет предыдущий запуск CI.
