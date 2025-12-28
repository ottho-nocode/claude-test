# YouTube Learning Guide

Une application web éducative qui transforme des tutoriels YouTube longs en guides d'apprentissage interactifs étape par étape.

## 🚀 Déploiement rapide (sans installation)

### Option 1: Déployer sur Vercel (1-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VOTRE-USERNAME/VOTRE-REPO&env=OPENAI_API_KEY&envDescription=Clé%20API%20OpenAI%20requise&project-name=youtube-learning-guide&repository-name=youtube-learning-guide)

**Après le déploiement :** Ajouter votre clé API OpenAI dans les variables d'environnement Vercel.

### Option 2: Déployer avec Docker (local)

```bash
# Cloner le repo
git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
cd VOTRE-REPO

# Lancer le script de déploiement automatique
chmod +x deploy.sh
./deploy.sh
```

Puis accéder à **http://localhost:3000**

📖 **[Guide de déploiement complet →](DEPLOYMENT.md)**

---

## Fonctionnalités

- **Page d'accueil** : Saisie d'URL YouTube avec génération automatique du cours
- **Cours structurés** : Découpage automatique en chapitres logiques (45s - 2min chacun)
- **Interface interactive** :
  - Accordéons extensibles pour chaque chapitre
  - Lecteur vidéo YouTube intégré avec timestamps (début/fin)
  - Checklists d'instructions claires et actionnables
  - Suivi de progression par chapitre
- **Intelligence Artificielle** :
  - Transcription automatique avec OpenAI Whisper
  - Structuration pédagogique avec GPT-4o
  - Génération d'instructions étape par étape

## Architecture

### Base de données (Prisma + SQLite)

```prisma
model Course {
  id                  String   @id @default(uuid())
  youtube_url         String
  video_title         String
  raw_transcript      String
  structured_chapters String   // JSON
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
}
```

### Workflow Backend

1. **Extraction** : Récupération de l'URL YouTube et extraction du video ID
2. **Transcription** : Utilisation de OpenAI Whisper pour transcrire l'audio avec timestamps
3. **Structuration** : Analyse par GPT-4o pour découper en chapitres pédagogiques
4. **Sauvegarde** : Stockage du cours structuré en base de données

### Structure des chapitres (JSON)

```typescript
{
  "chapters": [
    {
      "start_time": 0,
      "end_time": 45,
      "title": "Introduction au projet",
      "instructions": [
        "Installer Node.js depuis nodejs.org",
        "Vérifier l'installation avec node --version",
        "Créer un nouveau dossier pour le projet"
      ]
    }
  ]
}
```

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Clé API OpenAI

### Étapes

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd youtube-learning-guide
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```

   Éditer `.env` et ajouter votre clé API OpenAI :
   ```
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="sk-..."
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma migrate dev
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir l'application**
   ```
   http://localhost:3000
   ```

## Utilisation

1. Sur la page d'accueil, entrez une URL YouTube valide
2. Cliquez sur "Générer le cours"
3. Attendez que l'IA analyse et structure le contenu (30s - 2min)
4. Naviguez dans les chapitres en cliquant sur les accordéons
5. Regardez la vidéo segment par segment
6. Cochez les instructions au fur et à mesure

## Technologies utilisées

- **Frontend** : Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : SQLite (développement)
- **IA** : OpenAI GPT-4o, OpenAI Whisper
- **Vidéo** : YouTube Embedded Player API

## Structure du projet

```
├── app/
│   ├── api/
│   │   ├── generate-course/    # Workflow de génération
│   │   └── course/[id]/         # Récupération d'un cours
│   ├── course/[id]/             # Page de résultats
│   ├── page.tsx                 # Page d'accueil
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ChapterAccordion.tsx     # Composant accordéon
├── lib/
│   ├── prisma.ts                # Client Prisma
│   └── youtube.ts               # Utilitaires YouTube
├── prisma/
│   └── schema.prisma            # Schéma de base de données
├── types/
│   └── course.ts                # Types TypeScript
└── package.json
```

## Améliorations futures

- [ ] Intégration réelle avec un service d'extraction audio YouTube
- [ ] Support de la YouTube Data API pour les métadonnées
- [ ] Système d'authentification utilisateur
- [ ] Sauvegarde de progression personnalisée
- [ ] Export des cours en PDF/Markdown
- [ ] Support multilingue
- [ ] Cache intelligent pour éviter les re-générations
- [ ] Interface d'édition manuelle des chapitres
- [ ] Migration vers PostgreSQL pour production

## Notes techniques

### Transcription Whisper

La transcription actuelle utilise une simulation. Pour implémenter la vraie transcription :

1. Utiliser `yt-dlp` ou un service tiers pour extraire l'audio
2. Appeler l'API Whisper avec le format `verbose_json` pour obtenir les timestamps
3. Parser la réponse pour créer la transcription avec timestamps

### Structuration GPT-4o

Le prompt système est optimisé pour :
- Découper en segments de 45s-2min
- Identifier les actions clés
- Générer des instructions impératives et actionnables
- Retourner un JSON structuré valide

## Licence

MIT

## Auteur

Créé avec Claude Code
