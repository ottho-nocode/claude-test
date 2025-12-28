# 🚀 Guide de Déploiement - YouTube Learning Guide

Ce guide vous explique comment déployer l'application **sans avoir à installer Node.js ou les dépendances** sur votre machine.

## 🎯 Options de déploiement

### Option 1: Déploiement sur Vercel (Recommandé - 100% gratuit)

**Le plus simple et le plus rapide pour mettre l'application en ligne.**

#### Prérequis
- Un compte GitHub
- Un compte Vercel (gratuit) : https://vercel.com

#### Étapes

1. **Pusher le code sur GitHub**
   ```bash
   # Déjà fait! Le code est sur la branche claude/youtube-learning-guide-nkLcv
   ```

2. **Importer le projet sur Vercel**
   - Aller sur https://vercel.com/new
   - Sélectionner votre repository GitHub `ottho-nocode/claude-test`
   - Sélectionner la branche `claude/youtube-learning-guide-nkLcv`
   - Cliquer sur "Import"

3. **Configurer les variables d'environnement**
   Dans Vercel, ajouter cette variable :
   - `OPENAI_API_KEY` = votre clé API OpenAI (commence par `sk-...`)

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre 2-3 minutes
   - Votre application sera accessible sur une URL type `https://votre-app.vercel.app`

**✅ C'est tout ! Votre application est en ligne et accessible par tous.**

#### Avantages Vercel
- ✅ Déploiement automatique à chaque push
- ✅ HTTPS gratuit
- ✅ CDN mondial
- ✅ Pas de serveur à gérer
- ✅ 100% gratuit pour les projets personnels

---

### Option 2: Déploiement Docker (Pour serveur local ou VPS)

**Parfait si vous voulez héberger l'application sur votre propre serveur.**

#### Prérequis
- Docker installé : https://docs.docker.com/get-docker/
- Docker Compose installé (généralement inclus avec Docker Desktop)

#### Méthode A: Script automatique (Le plus simple)

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

Le script va :
1. ✅ Vérifier que Docker est installé
2. ✅ Créer le fichier .env si nécessaire
3. ✅ Vous demander votre clé API OpenAI
4. ✅ Construire l'image Docker
5. ✅ Démarrer l'application

L'application sera accessible sur **http://localhost:3000**

#### Méthode B: Manuel

1. **Créer le fichier .env**
   ```bash
   cp .env.example .env
   ```

2. **Éditer .env et ajouter votre clé OpenAI**
   ```
   OPENAI_API_KEY=sk-votre-clé-ici
   ```

3. **Construire et démarrer**
   ```bash
   docker compose up -d
   ```

4. **Accéder à l'application**
   ```
   http://localhost:3000
   ```

#### Commandes Docker utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Arrêter l'application
docker compose down

# Redémarrer l'application
docker compose restart

# Voir le statut
docker compose ps

# Reconstruire après une modification du code
docker compose up -d --build
```

---

### Option 3: Déploiement sur d'autres plateformes

#### Railway.app (Gratuit + Facile)

1. Aller sur https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Sélectionner votre repo
4. Ajouter la variable `OPENAI_API_KEY`
5. Déployer

#### Render.com (Gratuit + Facile)

1. Aller sur https://render.com
2. "New Web Service"
3. Connecter votre repo GitHub
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm start`
6. Ajouter la variable `OPENAI_API_KEY`
7. Déployer

#### Netlify (Avec serveur)

1. Aller sur https://netlify.com
2. Importer votre repo
3. Configurer comme un site Next.js
4. Ajouter `OPENAI_API_KEY`
5. Déployer

---

## 🔑 Obtenir une clé API OpenAI

1. Créer un compte sur https://platform.openai.com/
2. Aller dans "API Keys"
3. Cliquer sur "Create new secret key"
4. Copier la clé (commence par `sk-...`)
5. ⚠️ **Important** : Ajouter des crédits (minimum 5$) sur votre compte OpenAI

---

## 🗄️ Base de données en production

### Pour Vercel

Vercel utilise SQLite par défaut mais n'est pas idéal en production. Pour une vraie base de données :

1. **Option A: Vercel Postgres** (Gratuit pour commencer)
   ```bash
   # Dans votre dashboard Vercel
   # Storage → Create Database → Postgres
   # Copier DATABASE_URL automatiquement
   ```

2. **Option B: Supabase** (Gratuit)
   - Créer un projet sur https://supabase.com
   - Copier la DATABASE_URL
   - Modifier `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```

### Pour Docker

SQLite fonctionne bien avec Docker. Les données sont persistées dans `./data/`

---

## 📊 Surveillance et logs

### Vercel
- Logs en temps réel dans le dashboard Vercel
- Analytics intégré
- Monitoring des erreurs

### Docker
```bash
# Voir tous les logs
docker compose logs -f

# Voir les logs des 100 dernières lignes
docker compose logs --tail=100

# Chercher des erreurs
docker compose logs | grep ERROR
```

---

## 🔧 Dépannage

### L'application ne démarre pas

1. **Vérifier que la clé API est correcte**
   ```bash
   echo $OPENAI_API_KEY  # Doit afficher votre clé
   ```

2. **Vérifier les logs**
   ```bash
   docker compose logs -f
   ```

3. **Reconstruire l'image**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

### Erreur "Module not found"

```bash
# Régénérer le client Prisma
docker compose exec app npx prisma generate
docker compose restart
```

### Base de données corrompue

```bash
# Réinitialiser la base de données
docker compose down
rm -rf data/
docker compose up -d
```

---

## 💰 Coûts estimés

| Plateforme | Coût mensuel | Gratuit jusqu'à |
|------------|--------------|-----------------|
| Vercel | 0€ | Usage personnel illimité |
| Railway | 0€ - 5€ | 500h/mois ou 5$ de crédits |
| Render | 0€ | Projets illimités (avec limitations) |
| Docker local | 0€ | Illimité |
| **OpenAI API** | ~0.10€/vidéo* | Selon utilisation |

\* *Estimation pour une vidéo de 10 minutes avec GPT-4o et Whisper*

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifier les logs
2. Consulter la documentation Next.js : https://nextjs.org/docs
3. Consulter la documentation Prisma : https://www.prisma.io/docs
4. Vérifier les issues GitHub du projet

---

## 🎉 Félicitations !

Votre application YouTube Learning Guide est maintenant déployée et accessible en ligne !

Partagez l'URL avec vos utilisateurs et profitez de vos guides d'apprentissage interactifs.
