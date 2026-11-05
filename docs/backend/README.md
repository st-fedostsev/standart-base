# Backend

Стек: Python, FastAPI, SQLModel, PostgreSQL.

## Запуск

```bash
cd backend
python -m venv .venv && source .venv/bin/activate // TODO: уточнить про запуск на маке и винде
pip install -r requirements-dev.txt
uvicorn app.main:app --reload // TODO: уточнить
```

`app.main:app` — путь к приложению FastAPI, !заменить!. Документация API на `http://localhost:8000/docs`.

## Проверки

Пока не настроено

Переменные окружения лежат в `backend/.env`, файл не коммитится. Адрес БД задаётся переменной `DATABASE_URL`.
