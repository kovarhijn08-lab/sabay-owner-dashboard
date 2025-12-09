#!/bin/bash

# Скрипт для настройки полезных Git алиасов
# Запустите: source git-aliases.sh

echo "🔧 Настройка Git алиасов..."

# Основные команды
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Улучшенные команды
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Полезные алиасы для просмотра
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.ll "log --oneline --decorate --all --graph"
git config --global alias.ls "log --pretty=format:'%C(yellow)%h%Cred%d\\ %Creset%s%Cgreen\\ [%cn]' --decorate"

# Алиасы для работы с ветками
git config --global alias.new "checkout -b"
git config --global alias.switch "checkout"
git config --global alias.branches "branch -a"

# Алиасы для сохранения
git config --global alias.save "!f() { git add -A && git commit -m \"$1\" && git push; }; f"
git config --global alias.save-all "!git add -A && git commit -m 'Auto-save: $(date +%Y-%m-%d\\ %H:%M:%S)' && git push"

# Алиасы для очистки
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
git config --global alias.prune-branches "!git remote prune origin && git branch -vv | grep ': gone]' | awk '{print \$1}' | xargs git branch -d"

# Алиасы для статистики
git config --global alias.stats "!git log --stat"
git config --global alias.contributors "shortlog --summary --numbered"

# Алиасы для diff
git config --global alias.diffc "diff --cached"
git config --global alias.diffw "diff --word-diff"

# Алиасы для работы с удаленным репозиторием
git config --global alias.up "!git pull --rebase --prune \$@ && git submodule update --init --recursive"
git config --global alias.sync "!git pull --rebase && git push"

echo "✅ Git алиасы настроены!"
echo ""
echo "Полезные команды:"
echo "  git st          - git status"
echo "  git co          - git checkout"
echo "  git save 'msg'  - git add -A && git commit -m 'msg' && git push"
echo "  git lg          - красивая история коммитов"
echo "  git ll          - история с графиком"
echo "  git new branch  - создать новую ветку"
echo "  git sync        - pull + push"

