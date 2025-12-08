-- Создание администратора
INSERT INTO users (id, login, "passwordHash", role, name, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin',
  '$2b$10$rQ8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'admin',
  'Администратор',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (login) DO NOTHING;

-- Создание тестового инвестора
INSERT INTO users (id, login, "passwordHash", role, name, email, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'investor1',
  '$2b$10$rQ8K8K8K8K8K8K8K8K8K8uK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'investor',
  'Тестовый инвестор',
  'investor@example.com',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (login) DO NOTHING;

-- Создание рыночных данных
INSERT INTO market_benchmarks (id, region, "adrAvg", "occupancyAvg", "yieldAvg", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Patong', 95, 80, 7.5, NOW(), NOW()),
  (gen_random_uuid(), 'Kata', 100, 85, 8.0, NOW(), NOW()),
  (gen_random_uuid(), 'Rawai', 90, 75, 7.0, NOW(), NOW()),
  (gen_random_uuid(), 'Kamala', 85, 78, 6.8, NOW(), NOW()),
  (gen_random_uuid(), 'Bang Tao', 110, 82, 8.5, NOW(), NOW())
ON CONFLICT DO NOTHING;
