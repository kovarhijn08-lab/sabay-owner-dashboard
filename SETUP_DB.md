# 🗄️ Настройка базы данных

## Проблема
API не запускается из-за отсутствия подключения к PostgreSQL.

## Быстрое решение

### 1. Проверьте, установлен ли PostgreSQL

```bash
which psql
# или
brew list postgresql
```

### 2. Если PostgreSQL не установлен

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Или скачайте с:** https://www.postgresql.org/download/

### 3. Создайте базу данных

```bash
# Вариант 1: через createdb
createdb sabay_owner_db

# Вариант 2: через psql
psql postgres
CREATE DATABASE sabay_owner_db;
\q
```

### 4. Проверьте настройки подключения

Файл: `apps/api/.env.local`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sabay_owner_db
```

**Измените:**
- `postgres:postgres` → ваш логин:пароль
- `localhost:5432` → ваш хост:порт (если другой)

### 5. Инициализируйте данные

```bash
cd apps/api
pnpm init-db
```

Это создаст:
- Администратора: `admin` / `admin123`
- Инвестора: `investor1` / `investor123`
- Рыночные данные

### 6. Запустите API

```bash
cd apps/api
pnpm dev
```

Должно появиться: `API is running on http://localhost:4000/api`

---

## Проверка работы

```bash
# Проверка подключения к БД
psql sabay_owner_db -c "SELECT COUNT(*) FROM users;"

# Проверка API
curl http://localhost:4000/api/health
```

---

## Если PostgreSQL недоступен

Можно временно использовать Docker:

```bash
docker run --name sabay-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sabay_owner_db \
  -p 5432:5432 \
  -d postgres:14
```

Затем используйте:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sabay_owner_db
```
