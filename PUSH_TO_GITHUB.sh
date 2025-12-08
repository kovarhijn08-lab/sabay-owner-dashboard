#!/bin/bash

# Скрипт для загрузки проекта на GitHub
# Использование: ./PUSH_TO_GITHUB.sh <URL_вашего_репозитория>

if [ -z "$1" ]; then
    echo "❌ Ошибка: Укажите URL репозитория GitHub"
    echo "Пример использования: ./PUSH_TO_GITHUB.sh https://github.com/username/sabay-owner-dashboard.git"
    exit 1
fi

REPO_URL=$1

echo "📦 Подключение к удаленному репозиторию..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo "🚀 Загрузка кода на GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Успешно! Проект загружен на GitHub"
    echo "🔗 Ваш репозиторий: $REPO_URL"
else
    echo "❌ Ошибка при загрузке. Проверьте:"
    echo "   1. Репозиторий создан на GitHub"
    echo "   2. У вас есть права на запись"
    echo "   3. Вы авторизованы в Git (git config --global user.name и user.email)"
fi

