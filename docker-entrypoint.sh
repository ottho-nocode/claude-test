#!/bin/sh
set -e

echo "🚀 Démarrage de YouTube Learning Guide..."

# Vérifier que la clé API est définie
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  ATTENTION: OPENAI_API_KEY n'est pas définie"
  echo "L'application peut ne pas fonctionner correctement"
fi

# Exécuter les migrations Prisma
echo "📦 Exécution des migrations de base de données..."
npx prisma migrate deploy

echo "✅ Application prête!"

# Exécuter la commande passée en argument
exec "$@"
