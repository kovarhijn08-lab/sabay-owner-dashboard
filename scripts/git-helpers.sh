#!/bin/bash

# Полезные функции для работы с Git

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для создания ветки с проверкой
git_new_branch() {
  if [ -z "$1" ]; then
    echo -e "${RED}❌ Укажите название ветки${NC}"
    echo "Использование: git_new_branch feature/название"
    return 1
  fi
  
  branch_name=$1
  
  # Проверка, существует ли ветка
  if git show-ref --verify --quiet refs/heads/$branch_name; then
    echo -e "${YELLOW}⚠️  Ветка $branch_name уже существует${NC}"
    read -p "Переключиться на неё? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git checkout $branch_name
    fi
    return 1
  fi
  
  echo -e "${GREEN}🌿 Создаю ветку: $branch_name${NC}"
  git checkout -b $branch_name
}

# Функция для безопасного удаления ветки
git_delete_branch() {
  if [ -z "$1" ]; then
    echo -e "${RED}❌ Укажите название ветки${NC}"
    return 1
  fi
  
  branch_name=$1
  current_branch=$(git branch --show-current)
  
  if [ "$branch_name" = "$current_branch" ]; then
    echo -e "${RED}❌ Нельзя удалить текущую ветку!${NC}"
    echo "Переключитесь на другую ветку сначала"
    return 1
  fi
  
  if [ "$branch_name" = "main" ] || [ "$branch_name" = "master" ]; then
    echo -e "${RED}❌ Нельзя удалить главную ветку!${NC}"
    return 1
  fi
  
  echo -e "${YELLOW}🗑️  Удаляю ветку: $branch_name${NC}"
  git branch -D $branch_name
}

# Функция для очистки слитых веток
git_cleanup_merged() {
  echo -e "${GREEN}🧹 Очищаю слитые ветки...${NC}"
  git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
  echo -e "${GREEN}✅ Готово!${NC}"
}

# Функция для просмотра изменений в файле
git_file_history() {
  if [ -z "$1" ]; then
    echo -e "${RED}❌ Укажите путь к файлу${NC}"
    return 1
  fi
  
  file_path=$1
  echo -e "${GREEN}📜 История файла: $file_path${NC}"
  git log --follow --pretty=format:"%h - %an, %ar : %s" -- $file_path
}

# Функция для поиска в истории коммитов
git_search_commits() {
  if [ -z "$1" ]; then
    echo -e "${RED}❌ Укажите поисковый запрос${NC}"
    return 1
  fi
  
  query=$1
  echo -e "${GREEN}🔍 Ищу в коммитах: $query${NC}"
  git log --all --grep="$query" --oneline
}

# Функция для создания тега релиза
git_create_release() {
  if [ -z "$1" ]; then
    echo -e "${RED}❌ Укажите версию (например: 1.0.0)${NC}"
    return 1
  fi
  
  version=$1
  tag_name="v$version"
  
  if git rev-parse "$tag_name" >/dev/null 2>&1; then
    echo -e "${RED}❌ Тег $tag_name уже существует!${NC}"
    return 1
  fi
  
  read -p "Описание релиза: " description
  
  echo -e "${GREEN}🏷️  Создаю тег: $tag_name${NC}"
  git tag -a "$tag_name" -m "$description"
  git push origin "$tag_name"
  
  echo -e "${GREEN}✅ Тег создан и загружен!${NC}"
}

# Функция для отмены последнего коммита (но оставить изменения)
git_undo_commit() {
  echo -e "${YELLOW}⚠️  Отменяю последний коммит (изменения сохранятся)${NC}"
  git reset --soft HEAD~1
  echo -e "${GREEN}✅ Коммит отменен, изменения в staging area${NC}"
}

# Функция для просмотра статистики
git_stats() {
  echo -e "${GREEN}📊 Статистика репозитория:${NC}"
  echo ""
  echo "Коммиты:"
  git log --oneline | wc -l | xargs echo "  Всего:"
  echo ""
  echo "Ветки:"
  git branch -a | wc -l | xargs echo "  Всего:"
  echo ""
  echo "Файлы:"
  git ls-files | wc -l | xargs echo "  Отслеживается:"
  echo ""
  echo "Контрибьюторы:"
  git shortlog -sn | head -5
}

# Вывод справки
git_help_custom() {
  echo -e "${GREEN}📚 Полезные Git функции:${NC}"
  echo ""
  echo "  git_new_branch <name>        - Создать новую ветку с проверкой"
  echo "  git_delete_branch <name>      - Безопасно удалить ветку"
  echo "  git_cleanup_merged            - Удалить все слитые ветки"
  echo "  git_file_history <file>       - История изменений файла"
  echo "  git_search_commits <query>    - Поиск в истории коммитов"
  echo "  git_create_release <version>  - Создать тег релиза"
  echo "  git_undo_commit               - Отменить последний коммит"
  echo "  git_stats                     - Статистика репозитория"
  echo ""
  echo -e "${YELLOW}💡 Использование: source scripts/git-helpers.sh${NC}"
}

# Автоматический вывод справки при загрузке
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
  echo -e "${GREEN}✅ Git helpers загружены!${NC}"
  echo "Используйте: git_help_custom для справки"
fi

