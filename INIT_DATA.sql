-- Инициализация данных для Sabay Owner Dashboard
-- Выполните этот SQL в pgAdmin на базе данных sabay_owner_db

-- Создание администратора
-- Пароль: admin123
INSERT INTO users (id, login, "passwordHash", role, name, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin',
  '$2b$10$42lOJMJccMQvVxFoeUq9BuprUs5xnm33MsLgQaeMYdBbLPL9du7XK',
  'admin',
  'Администратор',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (login) DO NOTHING;

-- Создание тестового инвестора
-- Пароль: investor123
INSERT INTO users (id, login, "passwordHash", role, name, email, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'investor1',
  '$2b$10$UIa7Wd7drq4WS79rW9saueSzhtVeWUUeNC9fWZWaBAW14oAsz65m6',
  'investor',
  'Тестовый инвестор',
  'investor@example.com',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (login) DO NOTHING;

-- Создание рыночных данных по районам Пхукета
INSERT INTO market_benchmarks (id, region, "adrAvg", "occupancyAvg", "yieldAvg", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Patong', 95, 80, 7.5, NOW(), NOW()),
  (gen_random_uuid(), 'Kata', 100, 85, 8.0, NOW(), NOW()),
  (gen_random_uuid(), 'Rawai', 90, 75, 7.0, NOW(), NOW()),
  (gen_random_uuid(), 'Kamala', 85, 78, 6.8, NOW(), NOW()),
  (gen_random_uuid(), 'Bang Tao', 110, 82, 8.5, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Проверка
SELECT 'Готово! Создано пользователей:' as status, COUNT(*) as count FROM users;
SELECT 'Создано рыночных данных:' as status, COUNT(*) as count FROM market_benchmarks;

