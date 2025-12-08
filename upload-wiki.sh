#!/bin/bash

# Скрипт для автоматической загрузки Wiki на GitHub
# Использование: ./upload-wiki.sh

echo "📚 Загрузка Wiki на GitHub..."

PROJECT_DIR="/Users/v.goncharov/Desktop/Program/Sabay Owner Dashboard"
WIKI_REPO="https://github.com/kovarhijn08-lab/sabay-owner-dashboard.wiki.git"
TEMP_DIR="/tmp/sabay-wiki-upload"

# Проверка, включена ли Wiki
echo "⚠️  ВАЖНО: Сначала включите Wiki на GitHub:"
echo "   1. Перейдите: https://github.com/kovarhijn08-lab/sabay-owner-dashboard/settings"
echo "   2. Features → Wikis → включите"
echo "   3. Нажмите Save"
echo ""
read -p "Нажмите Enter после включения Wiki..."

# Очистка временной директории
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Клонирование Wiki репозитория
echo "📥 Клонирование Wiki репозитория..."
cd "$TEMP_DIR"
git clone "$WIKI_REPO" . 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Ошибка: Wiki репозиторий не найден"
    echo "   Убедитесь, что Wiki включена в настройках репозитория"
    exit 1
fi

# Копирование файлов
echo "📋 Копирование страниц Wiki..."
cp "$PROJECT_DIR/wiki/Home.md" "./Home.md"
cp "$PROJECT_DIR/wiki/Installation.md" "./Installation.md"
cp "$PROJECT_DIR/wiki/Quick-Start.md" "./Quick-Start.md"
cp "$PROJECT_DIR/wiki/FAQ.md" "./FAQ.md"
cp "$PROJECT_DIR/wiki/Database-Setup.md" "./Database-Setup.md"

# Коммит и загрузка
echo "💾 Сохранение изменений..."
git add .
git commit -m "Add wiki pages: Home, Installation, Quick-Start, FAQ, Database-Setup" || echo "Нет изменений для коммита"
git push

if [ $? -eq 0 ]; then
    echo "✅ Wiki успешно загружена!"
    echo "🔗 Доступна по адресу: https://github.com/kovarhijn08-lab/sabay-owner-dashboard/wiki"
else
    echo "❌ Ошибка при загрузке Wiki"
    exit 1
fi

# Очистка
cd "$PROJECT_DIR"
rm -rf "$TEMP_DIR"

echo "✨ Готово!"

