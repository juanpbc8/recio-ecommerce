#!/bin/bash
# Uso: ./scripts/create-task.sh "feat|fix|docs|chore|infra|ci|refactor|test" "Titulo de la tarea" "Descripcion detallada"

set -euo pipefail

TYPE=$1
TITLE=$2
BODY=$3

MILESTONE="Avance Final"
ASSIGNEE="juanpbc8"
PROJECT="Recio-Ecommerce - Avance Final"

if [ -z "$TYPE" ] || [ -z "$TITLE" ] || [ -z "$BODY" ]; then
  echo "Error: Faltan argumentos."
  echo "Uso: ./scripts/create-task.sh <tipo> <titulo> <descripcion>"
  exit 1
fi

case "$TYPE" in
  feat)
    LABEL="enhancement"
    ;;
  fix)
    LABEL="bug"
    ;;
  docs)
    LABEL="documentation"
    ;;
  chore|infra|ci|refactor|test)
    LABEL="enhancement"
    ;;
  *)
    echo "Error: Tipo '$TYPE' no valido."
    echo "Tipos validos: feat, fix, docs, chore, infra, ci, refactor, test"
    exit 1
    ;;
esac

echo "🚀 Creando Issue en GitHub..."
ISSUE_URL=$(gh issue create \
  --title "[$TYPE] $TITLE" \
  --body "$BODY" \
  --label "$LABEL" \
  --milestone "$MILESTONE" \
  --assignee "$ASSIGNEE" \
  --project "$PROJECT" 2>/dev/null || \
  gh issue create \
    --title "[$TYPE] $TITLE" \
    --body "$BODY" \
    --label "$LABEL" \
    --milestone "$MILESTONE" \
    --assignee "$ASSIGNEE")

ISSUE_NUM=$(echo "$ISSUE_URL" | grep -oE "[0-9]+$")

echo "✅ Issue #$ISSUE_NUM creado con exito!"
echo "🔗 $ISSUE_URL"

CLEAN_TITLE=$(echo "$TITLE" | iconv -t ascii//TRANSLIT 2>/dev/null | sed -E 's/[^a-zA-Z0-9]+/-/g' | tr '[:upper:]' '[:lower:]' | sed -E 's/^-|-$//g' | cut -c1-50)
BRANCH_NAME="$TYPE/issue-$ISSUE_NUM-$CLEAN_TITLE"

echo "🌴 Creando rama desde develop..."
git checkout develop
git pull origin develop
git checkout -b "$BRANCH_NAME"

echo "✅ Rama activa: $BRANCH_NAME"
