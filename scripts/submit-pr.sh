#!/bin/bash
# Uso: ./scripts/submit-pr.sh "tipo(alcance): descripcion en espanol" "Cuerpo del PR"

set -euo pipefail

COMMIT_MSG=$1
PR_BODY=$2
BASE_BRANCH="develop"
ASSIGNEE="juanpbc8"
PROJECT="Recio-Ecommerce - Avance Final"

if [ -z "$COMMIT_MSG" ] || [ -z "$PR_BODY" ]; then
  echo "Error: Faltan argumentos."
  echo "Uso: ./scripts/submit-pr.sh <commit_msg> <pr_body>"
  exit 1
fi

if ! echo "$COMMIT_MSG" | grep -Eq '^(feat|fix|docs|chore|infra|ci|refactor|test)(\([a-z0-9-]+\))?: .+'; then
  echo "Error: El mensaje no cumple Conventional Commits."
  echo "Formato esperado: tipo(alcance): descripcion en espanol"
  echo "Ejemplo: feat(api): agregar modulo de productos"
  exit 1
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "No hay cambios para commitear."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ] || [ "$CURRENT_BRANCH" = "main" ]; then
  echo "Error: No puedes hacer PR desde '$CURRENT_BRANCH'. Crea una rama feature primero."
  exit 1
fi

echo "📝 Creando commit..."
git add .
git commit -m "$COMMIT_MSG"

echo "📤 Subiendo rama '$CURRENT_BRANCH' a GitHub..."
git push -u origin "$CURRENT_BRANCH"

echo "🔀 Creando Pull Request hacia '$BASE_BRANCH'..."
PR_URL=$(gh pr create \
  --title "$COMMIT_MSG" \
  --body "$PR_BODY" \
  --base "$BASE_BRANCH" \
  --head "$CURRENT_BRANCH" \
  --assignee "$ASSIGNEE" \
  --project "$PROJECT" 2>/dev/null || \
  gh pr create \
    --title "$COMMIT_MSG" \
    --body "$PR_BODY" \
    --base "$BASE_BRANCH" \
    --head "$CURRENT_BRANCH" \
    --assignee "$ASSIGNEE")

echo "✅ Pull Request creado: $PR_URL"

echo "🤖 Activando auto-merge..."
gh pr merge "$PR_URL" --auto --merge --delete-branch || echo "⚠️ Auto-merge no disponible. Se fusionara manualmente al aprobar."
