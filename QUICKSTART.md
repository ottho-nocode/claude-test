# ⚡ Guide de démarrage rapide - 5 minutes

## 🎯 Objectif

Avoir l'application YouTube Learning Guide fonctionnelle **sans installer Node.js** sur votre machine.

## 🚀 Méthode 1: En ligne avec Vercel (Le plus rapide)

### ⏱️ Temps: 3 minutes

1. **Créer un compte Vercel** (gratuit)
   - Aller sur https://vercel.com
   - Cliquer sur "Sign Up"
   - Se connecter avec GitHub

2. **Importer le projet**
   - Cliquer sur "New Project"
   - Sélectionner le repository GitHub
   - Cliquer sur "Import"

3. **Configurer**
   - Ajouter la variable d'environnement:
     - Nom: `OPENAI_API_KEY`
     - Valeur: Votre clé API OpenAI (obtenir sur https://platform.openai.com/api-keys)

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre 2 minutes

5. **✅ Terminé !**
   - Votre app est en ligne sur `https://votre-projet.vercel.app`

---

## 🐳 Méthode 2: Local avec Docker (Sans Node.js)

### ⏱️ Temps: 5 minutes

### Prérequis
- Docker Desktop installé ([Télécharger](https://www.docker.com/products/docker-desktop))

### Étapes

1. **Ouvrir un terminal et cloner le projet**
   ```bash
   git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
   cd VOTRE-REPO
   ```

2. **Lancer le script de déploiement**
   ```bash
   ./deploy.sh
   ```

3. **Entrer votre clé API OpenAI quand demandé**
   - Si vous n'avez pas de clé: https://platform.openai.com/api-keys

4. **✅ Terminé !**
   - L'application est accessible sur http://localhost:3000

### Commandes utiles

```bash
# Voir les logs
docker compose logs -f

# Arrêter l'application
docker compose down

# Redémarrer
docker compose restart
```

---

## 🔑 Obtenir une clé API OpenAI

1. Créer un compte sur https://platform.openai.com
2. Aller dans "API Keys"
3. Cliquer sur "Create new secret key"
4. Copier la clé (commence par `sk-...`)
5. **Important**: Ajouter des crédits (minimum 5$)

---

## 💡 Utilisation de l'application

1. **Ouvrir l'application** dans votre navigateur
2. **Entrer une URL YouTube** (ex: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. **Cliquer sur "Générer le cours"**
4. **Attendre 30 secondes à 2 minutes** (l'IA analyse la vidéo)
5. **Naviguer dans les chapitres** et suivre les instructions

---

## ❓ Dépannage rapide

### "Module not found" avec Docker
```bash
docker compose down
docker compose up -d --build
```

### L'IA ne génère pas de contenu
- Vérifier que votre clé API OpenAI est correcte
- Vérifier que vous avez des crédits sur votre compte OpenAI
- Regarder les logs: `docker compose logs -f`

### Le port 3000 est déjà utilisé
```bash
# Dans docker-compose.yml, changer:
ports:
  - "3001:3000"  # Utiliser le port 3001 au lieu de 3000
```

---

## 📞 Besoin d'aide ?

- [Guide de déploiement complet](DEPLOYMENT.md)
- [README principal](README.md)
- Vérifier les logs: `docker compose logs -f`

---

## 🎉 Prêt à démarrer !

Choisissez la méthode qui vous convient le mieux et profitez de vos guides d'apprentissage interactifs !
