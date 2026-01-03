# Template de Cahier des Charges - Structure par Rôles

## Instructions pour le générateur

Ce template doit être utilisé pour structurer le cahier des charges selon une organisation **par rôle utilisateur** plutôt que par fonctionnalités.

## Structure à suivre

### 1. Introduction (optionnelle)
- Contexte du projet
- Objectifs généraux
- Périmètre

### 2. Fonctionnalités détaillées par rôle utilisateur

Pour chaque rôle identifié dans les transcriptions, suivre cette structure :

#### [NOM DU RÔLE] (ex: Administrateur, Agence, Agent, Utilisateur)

##### Authentification
- Type d'authentification (inscription/connexion)
- Méthodes (email/mot de passe, OAuth, etc.)
- Vérifications (email, validation, etc.)
- Sécurité

##### Onboarding (si applicable)
- Informations obligatoires à collecter
- Étapes de configuration
- Validation du compte
- Documents requis

##### Dashboard / Espace principal
**Métriques chiffrées affichables :**
- Liste des KPIs et statistiques
- Filtres disponibles

**Gestion [entité] :**
Pour chaque type de gestion (utilisateurs, annonces, etc.) :
- Création
  - Champs obligatoires
  - Champs optionnels
  - Upload de fichiers/médias
- Modification
  - Quels champs sont modifiables
- Suppression
  - Type de suppression (hard delete / archivage)
- Import (si applicable)
  - Format (XML, CSV, API)
  - Fréquence
  - Configuration

##### Kanban / Gestion des leads (si applicable)
- Colonnes (statuts)
- Informations affichées sur chaque carte
- Actions disponibles
- Workflow de changement de statut

##### Vitrine / Page publique (si applicable)
**Configuration :**
- Éléments personnalisables (logo, photos, textes)
- Informations affichées

**Contenu affiché :**
- Sections de la page
- Filtres de recherche
- Cartes/vignettes

##### Fonctionnalités spécifiques au rôle
Pour chaque fonctionnalité unique à ce rôle :
- Description
- Workflow détaillé
- Champs de saisie
- Règles métier
- Notifications
- Validations

##### Messagerie (si applicable)
- Liste des conversations
- Détail d'une conversation
- Actions disponibles (upload, RDV, etc.)
- Notifications
- Statuts

##### Profil
- Modification des informations
- Modification email/mot de passe
- Suppression du compte

---

### 3. Extensions (si applicable)

#### Extension Mobile
- Rôles concernés
- Fonctionnalités spécifiques mobile
- Notifications push
- Déploiement stores

#### Extension [Autre]
- Description
- Fonctionnalités additionnelles

---

## Format de rédaction

### Pour chaque fonctionnalité :

**Titre de la fonctionnalité**

Description concise de ce que fait la fonctionnalité.

**Détails :**
- Point 1
- Point 2
- Point 3

**Important :** (si applicable)
Précisions critiques, contraintes, validations

**Workflow :** (si applicable)
1. Étape 1
2. Étape 2
3. Étape 3

**Champs/Informations :**
- Champ 1 (obligatoire/optionnel)
- Champ 2 (obligatoire/optionnel)

**Actions disponibles :**
- Action 1
- Action 2

**Notifications :** (si applicable)
- Type de notification (email, push)
- Déclencheur

---

## Éléments récurrents à systématiquement inclure

Pour chaque rôle, vérifier la présence de :
1. ✅ Authentification
2. ✅ Profil (modification + suppression)
3. ✅ Dashboard (si rôle admin/gestion)
4. ✅ Messagerie (si interaction avec d'autres utilisateurs)

## Niveau de détail attendu

Pour chaque fonctionnalité :
- ✅ Description claire et précise
- ✅ Champs de données spécifiés
- ✅ Workflow détaillé si multi-étapes
- ✅ Règles de validation
- ✅ Notifications associées
- ✅ États/statuts possibles
- ✅ Permissions et accès

## Exemple de section bien détaillée

### Gestion des annonces

**Création d'une annonce**

L'agent/agence peut créer une nouvelle annonce immobilière.

**Champs obligatoires :**
- Galerie photo (minimum 3 photos)
- Titre (max 100 caractères)
- Prix (format numérique)
- Description (max 2000 caractères)
- Surface habitable (m²)
- Nombre de pièces
- Type de bien (Maison/Appartement/Terrain/Immeuble)
- Adresse complète

**Champs optionnels :**
- Année de construction
- Année de rénovation
- DPE
- GES
- Places de parking
- Balcon/Terrasse

**Workflow de création :**
1. Accès au formulaire de création
2. Remplissage des champs obligatoires
3. Upload des photos (drag & drop)
4. Prévisualisation
5. Validation et publication
6. Notification de confirmation

**Statuts de l'annonce :**
- Brouillon
- Publiée
- Archivée
- Vendue

**Actions disponibles :**
- Modifier les informations
- Dupliquer l'annonce
- Mettre en avant (promotion)
- Archiver
- Supprimer

---

## Notes pour la génération

- Adapter la structure aux rôles identifiés dans les transcriptions
- Ne pas inventer de fonctionnalités, se baser uniquement sur les transcriptions
- Utiliser un langage professionnel et précis
- Grouper les fonctionnalités similaires
- Éviter les répétitions entre rôles (faire des références croisées si besoin)
