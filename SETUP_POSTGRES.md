# 🗄️ Настройка PostgreSQL для Sabay Owner Dashboard

## ✅ Статус

PostgreSQL **установлен** на вашей системе (версия 18), но не добавлен в PATH.

## 🔧 Быстрое решение

### Вариант 1: Добавить PostgreSQL в PATH (рекомендуется)

Добавьте в `~/.zshrc` или `~/.bash_profile`:

```bash
export PATH="/Library/PostgreSQL/18/bin:$PATH"
```

Затем:
```bash
source ~/.zshrc
```

### Вариант 2: Использовать полный путь

Используйте полный путь к командам:

```bash
/Library/PostgreSQL/18/bin/psql --version
/Library/PostgreSQL/18/bin/createdb sabay_owner_db
```

---

## 📋 Пошаговая настройка

### 1. Проверьте, запущен ли PostgreSQL

```bash
/Library/PostgreSQL/18/bin/pg_isready -h localhost
```

Если не запущен, запустите:
```bash
# macOS через LaunchDaemon
sudo launchctl load -w /Library/LaunchDaemons/com.edb.launchd.postgresql-18.plist

# Или через pg_ctl
/Library/PostgreSQL/18/bin/pg_ctl -D /Library/PostgreSQL/18/data start
```

### 2. Создайте базу данных

```bash
/Library/PostgreSQL/18/bin/createdb sabay_owner_db
```

Или через psql:
```bash
/Library/PostgreSQL/18/bin/psql postgres
CREATE DATABASE sabay_owner_db;
\q
```

### 3. Проверьте настройки подключения

Файл: `apps/api/.env.local`

```env
DATABASE_URL=postgresql://postgres:ваш_пароль@localhost:5432/sabay_owner_db
```

**Важно:** Замените `ваш_пароль` на пароль пользователя postgres.

Если пароль не установлен, установите его:
```bash
/Library/PostgreSQL/18/bin/psql postgres
ALTER USER postgres PASSWORD 'postgres';
\q
```

### 4. Инициализируйте данные

```bash
cd "/Users/v.goncharov/Desktop/Program/Sabay Owner Dashboard/apps/api"
pnpm init-db
```

### 5. Запустите API

```bash
cd "/Users/v.goncharov/Desktop/Program/Sabay Owner Dashboard/apps/api"
pnpm dev
```

---

## 🔍 Проверка

```bash
# Проверка версии
/Library/PostgreSQL/18/bin/psql --version

# Проверка подключения
/Library/PostgreSQL/18/bin/psql -U postgres -d sabay_owner_db -c "SELECT 1;"

# Проверка API
curl http://localhost:4000/api/health
```

---

## ⚠️ Если пароль неизвестен

Если вы не помните пароль пользователя postgres:

1. Отредактируйте `/Library/PostgreSQL/18/data/pg_hba.conf`
2. Измените метод аутентификации на `trust` для localhost
3. Перезапустите PostgreSQL
4. Установите новый пароль:
   ```bash
   /Library/PostgreSQL/18/bin/psql postgres
   ALTER USER postgres PASSWORD 'postgres';
   \q
   ```
5. Верните настройки `pg_hba.conf` обратно

---

## ✅ Готово!

После выполнения всех шагов API должен запуститься, и вы сможете войти в систему.
