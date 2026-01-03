#!/bin/bash

echo "🚀 Installation de Bubble Doc Generator..."
echo ""

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé."
    echo "👉 Installez Python 3.9+ depuis https://www.python.org/"
    exit 1
fi

echo "✓ Python $(python3 --version) détecté"

# Créer l'environnement virtuel
echo ""
echo "📦 Création de l'environnement virtuel..."
python3 -m venv venv

# Activer l'environnement
echo "🔄 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo ""
echo "📥 Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

# Créer le fichier .env si nécessaire
if [ ! -f .env ]; then
    echo ""
    echo "🔐 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  N'oubliez pas d'ajouter votre clé API Claude dans .env"
fi

echo ""
echo "✅ Installation terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Éditez le fichier .env et ajoutez votre clé API Claude"
echo "2. Ajoutez vos transcriptions dans data/transcriptions/"
echo "3. Ajoutez les URLs Bubble.io dans data/knowledge-base/bubble-urls.txt"
echo "4. Lancez : source venv/bin/activate && cd src && python cli.py setup"
echo ""
echo "📖 Consultez README.md pour plus d'informations"
