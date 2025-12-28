#!/bin/bash

echo "🚀 YouTube Learning Guide - Script de déploiement rapide"
echo "========================================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}❌ Erreur: $1${NC}"
    exit 1
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les infos
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé. Veuillez l'installer depuis https://docs.docker.com/get-docker/"
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    error "Docker Compose n'est pas installé. Veuillez l'installer depuis https://docs.docker.com/compose/install/"
fi

success "Docker et Docker Compose sont installés"

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    warning "Fichier .env non trouvé. Création depuis .env.example..."
    cp .env.example .env
    info "Veuillez éditer le fichier .env et ajouter votre clé API OpenAI"
    echo ""
    read -p "Appuyez sur Entrée après avoir configuré votre clé API OpenAI dans .env..."
fi

# Vérifier si OPENAI_API_KEY est défini
if grep -q "sk-placeholder-key" .env || grep -q "your_openai_api_key_here" .env; then
    warning "La clé API OpenAI semble être un placeholder"
    echo ""
    read -p "Entrez votre clé API OpenAI (ou Entrée pour continuer): " api_key
    if [ ! -z "$api_key" ]; then
        # Remplacer la clé API dans .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=\"$api_key\"/" .env
        else
            # Linux
            sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=\"$api_key\"/" .env
        fi
        success "Clé API mise à jour"
    fi
fi

# Créer le dossier data s'il n'existe pas
mkdir -p data

echo ""
info "Construction de l'image Docker..."
docker compose build || error "Échec de la construction de l'image Docker"

success "Image Docker construite avec succès"

echo ""
info "Démarrage de l'application..."
docker compose up -d || error "Échec du démarrage de l'application"

success "Application démarrée avec succès!"

echo ""
echo "========================================================="
echo -e "${GREEN}🎉 Déploiement réussi!${NC}"
echo ""
echo "L'application est maintenant accessible à:"
echo -e "${BLUE}👉 http://localhost:3000${NC}"
echo ""
echo "Commandes utiles:"
echo "  - Voir les logs:        docker compose logs -f"
echo "  - Arrêter l'app:        docker compose down"
echo "  - Redémarrer l'app:     docker compose restart"
echo "  - Voir le statut:       docker compose ps"
echo ""
echo "========================================================="
