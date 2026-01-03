# Quick Start - Bubble Doc Generator

Guide de démarrage rapide en 5 étapes.

## 🎯 But

Générer automatiquement User Stories, User Flows, Cahier des Charges et Prompts Écrans pour un projet Bubble.io.

## ⚡ Installation (5 minutes)

### Linux/Mac

```bash
chmod +x install.sh
./install.sh
```

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## 🔑 Configuration (2 minutes)

1. **Obtenez votre clé API Claude** : https://console.anthropic.com/

2. **Ajoutez-la dans `.env`** :

   ```
   ANTHROPIC_API_KEY=sk-ant-votre-cle-ici
   ```

## 📝 Préparez vos données (10 minutes)

### 1. Ajoutez vos transcriptions

Copiez vos transcriptions markdown dans `data/transcriptions/`

Format attendu :

```markdown
# Nom du projet

**Meeting Date:** 15th Jan, 2026

**Client** *[00:15]*: Je veux créer une plateforme...
**Consultant** *[00:30]*: D'accord, parlons des fonctionnalités...
```

### 2. Configurez les URLs Bubble.io

Éditez `data/knowledge-base/bubble-urls.txt` :

```
https://manual.bubble.io/
https://manual.bubble.io/getting-started
https://manual.bubble.io/core-resources/data
```

### 3. (Optionnel) Ajoutez votre template CDC

Placez votre template PDF dans `data/templates/template-cahier-des-charges.pdf`

## 🚀 Génération (1 commande)

### Setup (première fois seulement)

```bash
source venv/bin/activate  # Windows: venv\Scripts\activate
cd src
python cli.py setup
```

Cela va :
- Scraper la documentation Bubble.io
- Créer l'index de recherche (embeddings)

### Générer tous les documents

```bash
python cli.py generate all
```

Ou étape par étape :

```bash
python cli.py generate stories    # User stories
python cli.py generate flows      # User flows (Mermaid)
python cli.py generate cdc        # Cahier des charges
python cli.py generate screens    # Prompts écrans
```

## 📂 Résultats

Vos documents sont dans `data/output/` :

- `user-stories.md`
- `user-flows.md` (avec diagrammes Mermaid)
- `cahier-des-charges.md`
- `screens-prompts.md`

## 🎨 Visualiser les diagrammes Mermaid

Les User Flows utilisent Mermaid. Pour les visualiser :

1. **GitHub/GitLab** : Les affiche automatiquement
2. **En ligne** : https://mermaid.live/
3. **VSCode** : Extension "Markdown Preview Mermaid Support"

## 💡 Conseils

### Pour de meilleurs résultats

1. **Transcriptions détaillées** : Plus les transcriptions sont complètes, meilleurs sont les documents générés
2. **Édition manuelle** : Vous pouvez éditer les user stories avant de générer les flows et le CDC
3. **Contexte Bubble** : Ajoutez des URLs spécifiques à vos besoins (plugins, API, etc.)

### Workflow recommandé

```
Réunion client → Transcription → Setup → Generate all → Édition → Livrable client
```

## 🐛 Problèmes courants

### "ANTHROPIC_API_KEY manquante"

→ Vérifiez votre fichier `.env`

### "No module named 'anthropic'"

→ Activez l'environnement virtuel : `source venv/bin/activate`

### Scraping échoue

→ Vérifiez votre connexion internet et les URLs dans `bubble-urls.txt`

## 📊 Coût par projet

Avec Claude Sonnet 4 : **~$1-3 par projet complet**

Budget 50$ = 15-50 projets

## 🎓 Exemple complet

```bash
# 1. Installation
./install.sh

# 2. Configuration
echo "ANTHROPIC_API_KEY=sk-ant-xxxxx" > .env

# 3. Ajouter les données
cp ~/mes-reunions/projet-X.md data/transcriptions/

# 4. Setup
source venv/bin/activate
cd src
python cli.py setup

# 5. Générer
python cli.py generate all

# 6. Résultats
ls -la ../data/output/
```

## 📖 Documentation complète

Consultez [README.md](README.md) pour :
- Architecture détaillée
- Configuration avancée
- Dépannage
- Contribution

## 🚀 C'est parti !

Vous êtes prêt à générer vos premiers documents Bubble.io !

Questions ? Consultez le README ou ouvrez une issue.
