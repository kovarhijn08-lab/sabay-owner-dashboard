# Исправление проблемы с черным экраном

## 🔍 Проблема

Страница `/portfolio` отображалась полностью черной (не загружалась).

## 🐛 Найденные ошибки

### 1. Next.js - MODULE_NOT_FOUND
```
Error: Cannot find module './84.js'
```
- **Причина**: Поврежденный кэш сборки Next.js
- **Решение**: Очистка папки `.next`

### 2. API - MODULE_NOT_FOUND
```
Error: Cannot find module './entities'
```
- **Причина**: Отсутствовал файл `index.ts` для экспорта entities
- **Решение**: Создан файл `entities/index.ts` с экспортами всех сущностей

## ✅ Выполненные исправления

1. ✅ **Очищен кэш Next.js**
   ```bash
   rm -rf apps/dashboard/.next
   ```

2. ✅ **Очищен кэш API**
   ```bash
   rm -rf apps/api/dist
   ```

3. ✅ **Создан файл `entities/index.ts`**
   - Экспортирует все необходимые сущности
   - Решает проблему импорта `import * as entities from './entities'`

4. ✅ **Перезапущены серверы**
   - Backend API: http://localhost:4000/api ✅
   - Frontend Dashboard: http://localhost:3000 ✅

## 📋 Созданный файл

`apps/api/src/modules/database/entities/index.ts`:
```typescript
export { User } from './user.entity';
export { OwnerProperty } from './owner-property.entity';
export { Project } from './project.entity';
export { Unit } from './unit.entity';
export { PortfolioGoal } from './portfolio-goal.entity';
export { Notification } from './notification.entity';
export { PropertyEvent } from './property-event.entity';
export { PropertyMetrics } from './property-metrics.entity';
export { ValuationHistory } from './valuation-history.entity';
export { MarketBenchmark } from './market-benchmark.entity';
export { Dictionary } from './dictionary.entity';
export { SLASettings } from './sla-settings.entity';
export { ManagementCompany } from './management-company.entity';
```

## 🚀 Результат

- ✅ Backend API запущен и работает
- ✅ Frontend Dashboard запущен и готов
- ✅ Кэш очищен
- ✅ Импорты исправлены
- ✅ Страница должна загружаться корректно

## 📝 Рекомендации

1. **При проблемах с Next.js**: Очищайте кэш командой `rm -rf .next`
2. **При проблемах с импортами**: Проверяйте наличие `index.ts` файлов
3. **При проблемах с API**: Очищайте папку `dist` и пересобирайте

## ⚠️ Если проблема сохраняется

1. Откройте консоль браузера (F12) и проверьте ошибки
2. Проверьте логи серверов:
   - API: `/tmp/api.log`
   - Dashboard: `/tmp/dashboard.log`
3. Убедитесь, что серверы запущены:
   ```bash
   lsof -ti:3000,4000
   ```

