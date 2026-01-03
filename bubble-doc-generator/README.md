# Bubble.io Document Generator

Un outil intelligent qui génère automatiquement la documentation complète pour vos projets clients développés en Bubble.io, à partir de transcriptions de réunions.

## 🎯 Fonctionnalités

Génère automatiquement :

1. **User Stories** - Stories détaillées au format "En tant que... Je veux... Afin de..."
2. **User Flows** - Diagrammes de flux sous forme de schémas Mermaid
3. **Cahier des charges** - Document complet structuré et professionnel
4. **Prompts écrans** - Descriptions détaillées pour créer chaque interface

## 🏗️ Architecture

```
bubble-doc-generator/
├── data/
│   ├── transcriptions/        # Vos transcriptions de réunions (Markdown)
│   ├── knowledge-base/        # Base de connaissance Bubble.io (scraped)
│   ├── templates/             # Votre template de cahier des charges (PDF)
│   └── output/                # Documents générés
├── src/
│   ├── cli.py                # Interface CLI principale
│   ├── ingest/               # Import transcriptions + scraping KB
│   ├── rag/                  # Système RAG (embeddings + recherche)
│   └── generators/           # Générateurs de documents
├── config.yaml               # Configuration
└── requirements.txt          # Dépendances Python
```

## 📋 Prérequis

- Python 3.9+
- Clé API Anthropic Claude (jusqu'à 50$ de budget)
- Transcriptions de réunions au format Markdown

## 🚀 Installation

### 1. Cloner le projet

```bash
cd bubble-doc-generator
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API Claude :

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Obtenez votre clé sur : https://console.anthropic.com/

## 📝 Préparation des données

### 1. Ajouter vos transcriptions

Placez vos transcriptions de réunions dans `data/transcriptions/`

Format attendu (Markdown) :

```markdown
# Nom du projet client

**Meeting Date:** 15th Jan, 2026 - 10:00 AM

---

**Client** *[00:15]*: Description du besoin...
**Consultant** *[00:30]*: Question de clarification...
```

Voir `data/transcriptions/example-transcription.md` pour un exemple complet.

### 2. Configurer les sources Bubble.io

Éditez `data/knowledge-base/bubble-urls.txt` et ajoutez les URLs de la documentation Bubble.io que vous voulez utiliser :

```
https://manual.bubble.io/
https://manual.bubble.io/getting-started
https://manual.bubble.io/core-resources/data
# etc.
```

### 3. (Optionnel) Ajouter votre template de cahier des charges

Si vous avez un template PDF personnalisé, placez-le dans :

```
data/templates/template-cahier-des-charges.pdf
```

Sinon, le système utilisera une structure par défaut.

## 🎬 Utilisation

### Setup initial (une seule fois)

Cette commande va :
- Scraper la base de connaissance Bubble.io
- Créer les embeddings pour le système RAG

```bash
cd src
python cli.py setup
```

Si vous avez des transcriptions dans un autre dossier :

```bash
python cli.py setup --import-transcriptions /chemin/vers/transcriptions/
```

### Génération des documents

#### Option 1 : Génération étape par étape (recommandé)

```bash
# 1. Générer les user stories
python cli.py generate stories
# → Éditer data/output/user-stories.md si nécessaire

# 2. Générer les user flows
python cli.py generate flows
# → Vérifier data/output/user-flows.md

# 3. Générer le cahier des charges
python cli.py generate cdc
# → Vérifier data/output/cahier-des-charges.md

# 4. Générer les prompts écrans
python cli.py generate screens
# → Vérifier data/output/screens-prompts.md
```

#### Option 2 : Génération complète (avec pauses pour validation)

```bash
python cli.py generate all
```

Cette commande génère tous les documents avec des pauses entre chaque étape pour vous permettre d'éditer les fichiers.

## 📊 Workflow recommandé

```
1. Transcriptions → 2. Setup → 3. User Stories → 4. User Flows → 5. CDC → 6. Prompts Écrans
                                      ↓
                            (édition manuelle possible)
```

## 🧠 Système RAG

Le système RAG (Retrieval Augmented Generation) combine :

- **Vos transcriptions** : Besoins exprimés par le client
- **Base de connaissance Bubble.io** : Bonnes pratiques et contraintes techniques

Pour chaque génération, le système :

1. Recherche les passages pertinents dans les transcriptions et la KB
2. Fournit ce contexte à Claude
3. Génère un document adapté au contexte Bubble.io

**Modèle d'embeddings** : `sentence-transformers/all-MiniLM-L6-v2` (local, gratuit)

## 💰 Coûts estimés

Avec Claude Sonnet 4 :

- User stories : ~$0.10 - $0.30
- User flows : ~$0.10 - $0.30
- Cahier des charges : ~$0.30 - $0.80
- Prompts écrans : ~$0.30 - $0.80

**Total pour un projet complet** : ~$1 - $3

Budget de 50$ = 15-50 projets complets

## 📁 Fichiers générés

Tous les documents sont sauvegardés dans `data/output/` :

- `user-stories.md` - User stories structurées par thématique
- `user-flows.md` - Diagrammes Mermaid des parcours utilisateurs
- `cahier-des-charges.md` - Cahier des charges complet
- `screens-prompts.md` - Prompts détaillés pour chaque écran

## 🔧 Configuration avancée

Éditez `config.yaml` pour personnaliser :

- Modèle Claude et tokens max
- Paramètres du système RAG
- Configuration du scraper
- Chemins des dossiers

## 🐛 Dépannage

### Erreur : "ANTHROPIC_API_KEY manquante"

Vérifiez que votre fichier `.env` contient bien votre clé API :

```bash
cat .env
```

### Erreur lors du scraping

Vérifiez votre connexion internet et les URLs dans `data/knowledge-base/bubble-urls.txt`

### Embeddings trop lents

Par défaut, le système utilise le CPU. Si vous avez un GPU :

1. Installez `faiss-gpu` au lieu de `faiss-cpu`
2. Changez `device: "cpu"` en `device: "cuda"` dans `config.yaml`

## 🚦 Prochaines améliorations

- [ ] Support direct de fichiers audio/vidéo (transcription automatique)
- [ ] Interface web pour faciliter l'utilisation
- [ ] Export en PDF du cahier des charges
- [ ] Templates de CDC personnalisables
- [ ] Support multilingue
- [ ] Génération de maquettes visuelles (intégration Figma/Screenshot)

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push et créer une Pull Request

## 📧 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation Bubble.io : https://manual.bubble.io/
- Documentation Claude : https://docs.anthropic.com/

---

**Créé avec Claude Code** 🚀
