#!/bin/bash

# Скрипт для добавления изменений в Changelog
# Использование: ./scripts/add-to-changelog.sh <тип> "<описание>"
# Типы: Added, Changed, Deprecated, Removed, Fixed, Security

CHANGELOG_FILE="CHANGELOG.md"
TYPE=$1
DESCRIPTION=$2

if [ -z "$TYPE" ] || [ -z "$DESCRIPTION" ]; then
  echo "❌ Ошибка: Укажите тип и описание"
  echo "Использование: ./scripts/add-to-changelog.sh <тип> \"<описание>\""
  echo "Типы: Added, Changed, Deprecated, Removed, Fixed, Security"
  exit 1
fi

# Проверка типа
case $TYPE in
  Added|Changed|Deprecated|Removed|Fixed|Security)
    ;;
  *)
    echo "❌ Ошибка: Неверный тип. Используйте: Added, Changed, Deprecated, Removed, Fixed, Security"
    exit 1
    ;;
esac

# Найти секцию [Unreleased]
if ! grep -q "## \[Unreleased\]" "$CHANGELOG_FILE"; then
  echo "❌ Ошибка: Секция [Unreleased] не найдена в $CHANGELOG_FILE"
  exit 1
fi

# Найти секцию ### $TYPE в [Unreleased]
if grep -A 20 "## \[Unreleased\]" "$CHANGELOG_FILE" | grep -q "### $TYPE"; then
  # Секция существует, добавить в неё
  # Найти строку после "### $TYPE" и вставить новую запись
  awk -v type="$TYPE" -v desc="$DESCRIPTION" '
    /## \[Unreleased\]/ { in_unreleased = 1 }
    in_unreleased && /^### '${TYPE}'/ { 
      print
      print "- " desc
      next
    }
    { print }
  ' "$CHANGELOG_FILE" > "$CHANGELOG_FILE.tmp" && mv "$CHANGELOG_FILE.tmp" "$CHANGELOG_FILE"
else
  # Секция не существует, создать её
  awk -v type="$TYPE" -v desc="$DESCRIPTION" '
    /## \[Unreleased\]/ { 
      print
      print ""
      print "### " type
      print "- " desc
      print ""
      next
    }
    { print }
  ' "$CHANGELOG_FILE" > "$CHANGELOG_FILE.tmp" && mv "$CHANGELOG_FILE.tmp" "$CHANGELOG_FILE"
fi

echo "✅ Добавлено в Changelog: [$TYPE] $DESCRIPTION"

