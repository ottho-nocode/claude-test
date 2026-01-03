# Template de Cahier des Charges - Structure Générique par Rôles

## Principe de la structure

Le cahier des charges doit être organisé **par rôle utilisateur**, chaque rôle ayant ses propres fonctionnalités, et chaque fonctionnalité ayant plusieurs fonctions.

```
PROJET
├── Rôle 1 (identifié par analyse)
│   ├── Fonctionnalité 1
│   │   ├── Fonction 1
│   │   ├── Fonction 2
│   │   └── Fonction N
│   ├── Fonctionnalité 2
│   └── Profil (commune)
├── Rôle 2 (identifié par analyse)
└── Rôle N...
```

---

## IMPORTANT : Identification des rôles

**Les rôles NE sont PAS prédéfinis.** Ils doivent être **identifiés automatiquement** à partir des transcriptions.

**Rôle par défaut :**
- Il y a TOUJOURS un rôle **Administrateur** (gestion de la plateforme)

**Autres rôles :**
- À identifier dans les transcriptions (ex: Client, Vendeur, Professionnel, Utilisateur, etc.)
- Peuvent varier selon le type de projet (eCommerce, SaaS, Marketplace, etc.)

---

## Structure à suivre pour chaque rôle

### ## [NOM DU RÔLE]

*Description courte du rôle et de ses responsabilités*

#### Fonctionnalités

Pour chaque fonctionnalité propre à ce rôle :

---

### Fonctionnalité : [Nom de la fonctionnalité]

*Description de la fonctionnalité*

**Fonctions disponibles :**

#### 1. [Nom de la fonction]

**Description :**
Description de ce que fait cette fonction

**Workflow :**
1. Étape 1
2. Étape 2
3. Étape 3

**Champs/Informations :**
- Champ 1 (obligatoire/optionnel) : description
- Champ 2 (obligatoire/optionnel) : description

**Règles de gestion :**
- Règle 1
- Règle 2

**Notifications :**
- Type de notification (email/push/in-app)
- Déclencheur

**Validations :**
- Validation 1
- Validation 2

**Important :** (si applicable)
Contraintes critiques, limites, règles métier spécifiques

---

#### 2. [Autre fonction]

*Même structure que ci-dessus*

---

## Fonctionnalités communes à tous les rôles

Certaines fonctionnalités sont présentes pour TOUS les rôles :

### Authentification

**Fonctions :**
1. **Inscription** (si applicable au rôle)
   - Méthodes (email/password, OAuth, etc.)
   - Champs requis
   - Validation (email, etc.)

2. **Connexion**
   - Méthodes
   - Gestion des erreurs
   - Sécurité (rate limiting, etc.)

3. **Réinitialisation mot de passe**
   - Workflow
   - Sécurité

### Profil

**Fonctions :**
1. **Consultation du profil**
   - Informations affichées

2. **Modification des informations**
   - Champs modifiables
   - Validations

3. **Modification du mot de passe**
   - Workflow sécurisé
   - Validations

4. **Suppression du compte**
   - Workflow
   - Conséquences (archivage vs suppression hard)

---

## Fonctionnalités potentielles (selon le projet)

Les fonctionnalités ci-dessous sont **des exemples** qui peuvent apparaître selon le type de projet. **Ne les inclure QUE si elles sont mentionnées dans les transcriptions.**

### Dashboard / Tableau de bord

**Fonctions :**
1. **Visualisation des métriques**
   - KPIs affichés
   - Filtres disponibles

2. **Accès rapides**
   - Actions principales
   - Raccourcis

### Gestion [Entité]

**Fonctions :**
1. **Création**
   - Champs
   - Upload de fichiers
   - Validations

2. **Consultation/Liste**
   - Filtres
   - Tri
   - Recherche

3. **Modification**
   - Champs modifiables
   - Validations

4. **Suppression**
   - Type (hard/soft)
   - Confirmations

### Messagerie / Communication

**Fonctions :**
1. **Liste des conversations**
   - Tri
   - Filtres
   - Indicateurs (non lu, etc.)

2. **Conversation**
   - Envoi de messages
   - Upload de fichiers
   - Actions disponibles

3. **Notifications**
   - Types
   - Déclencheurs

### Paiement / Transactions

**Fonctions :**
1. **Moyen de paiement**
   - Intégrations (Stripe, etc.)
   - Méthodes acceptées

2. **Processus de paiement**
   - Workflow
   - Gestion des erreurs

3. **Historique**
   - Consultation
   - Export

### Recherche / Catalogue

**Fonctions :**
1. **Recherche**
   - Critères
   - Filtres
   - Tri

2. **Consultation détaillée**
   - Informations affichées
   - Actions disponibles

---

## Format de rédaction

### Niveau de détail requis

Pour **chaque fonction**, préciser :

✅ **Description** : Que fait cette fonction ?
✅ **Workflow** : Étapes précises (si multi-étapes)
✅ **Champs de données** : Tous les champs avec type et obligation
✅ **Règles de gestion** : Logique métier, calculs, conditions
✅ **Validations** : Contrôles côté client et serveur
✅ **Notifications** : Quand, comment, à qui
✅ **Permissions** : Qui peut accéder/modifier
✅ **États/Statuts** : Différents états possibles

### Format Markdown

```markdown
## [Rôle]

### Fonctionnalité : [Nom]

#### 1. [Fonction]

**Description :**
...

**Workflow :**
1. ...
2. ...

**Champs :**
- Champ 1 (obligatoire) : ...
- Champ 2 (optionnel) : ...

**Règles :**
- ...

**Important :**
...
```

---

## Aspects techniques Bubble.io

Pour chaque rôle/fonctionnalité, préciser :

### Data Types (Types de données)

Liste des Data Types à créer avec leurs champs :

```
DataType: User
- email (text)
- password (text, hashed)
- role (option set)
- created_date (date)
```

### Workflows principaux

Liste des workflows avec leurs déclencheurs :

```
Workflow: Inscription utilisateur
Déclencheur: Bouton "S'inscrire" cliqué
Actions:
1. Créer un User
2. Envoyer email de confirmation
3. Rediriger vers tableau de bord
```

### Plugins nécessaires

- Plugin 1 (ex: Stripe pour paiement)
- Plugin 2 (ex: SendGrid pour emails)

### Intégrations externes

- API 1 (ex: API de géolocalisation)
- API 2 (ex: Import XML)

### Privacy Rules

Permissions par rôle :

```
DataType: User
- Admins : Full access
- Users : View own only
- Public : None
```

### Responsive Design

- Web (desktop/mobile)
- Application mobile (si applicable)

---

## Consignes de génération

1. **Identifier les rôles** depuis les transcriptions (+ Admin par défaut)
2. **Pour chaque rôle** identifié, créer une section complète
3. **Pour chaque fonctionnalité**, lister toutes les fonctions
4. **Pour chaque fonction**, suivre le format détaillé ci-dessus
5. **Inclure les fonctionnalités communes** (Authentification, Profil)
6. **Ne PAS inventer** de fonctionnalités non mentionnées
7. **Être TRÈS précis** sur les détails techniques

---

## Exemple de section bien détaillée

### Fonctionnalité : Gestion des produits

#### 1. Création d'un produit

**Description :**
Permet au vendeur de créer une nouvelle fiche produit dans son catalogue.

**Workflow :**
1. Accès au formulaire de création depuis le dashboard
2. Remplissage des champs obligatoires
3. Upload des photos (drag & drop)
4. Prévisualisation du rendu
5. Validation et publication
6. Notification de confirmation

**Champs :**
- Nom du produit (obligatoire, text, max 100 caractères)
- Description (obligatoire, text, max 2000 caractères)
- Prix (obligatoire, number, min 0.01)
- Catégorie (obligatoire, dropdown depuis liste prédéfinie)
- Photos (obligatoire, minimum 3, maximum 10, formats: JPG/PNG)
- Stock disponible (obligatoire, number, min 0)
- Poids (optionnel, number pour calcul frais de port)

**Règles de gestion :**
- Le prix doit être > 0
- Minimum 3 photos requises
- Si stock = 0, produit automatiquement marqué "Rupture de stock"
- Les photos sont redimensionnées automatiquement (max 1200px)

**Validations :**
- Vérification des formats d'images côté client
- Validation du prix et stock > 0 côté serveur
- Vérification unicité du nom dans le catalogue du vendeur

**Notifications :**
- Email de confirmation au vendeur après publication
- Notification in-app : "Produit créé avec succès"

**Permissions :**
- Uniquement les utilisateurs avec rôle "Vendeur" vérifié

**Important :**
Les produits créés sont en statut "Brouillon" par défaut et doivent être publiés manuellement. La modération admin n'est requise que pour la première publication.

---

**Workflow technique Bubble.io :**

```
DataType: Product
- name (text)
- description (text)
- price (number)
- category (option set)
- photos (list of images)
- stock (number)
- status (option set: draft/published/archived)
- seller (User)
- created_date (date)

Workflow: Create Product
Trigger: Button "Créer le produit"
Actions:
1. Create a new Product
2. Set Product's fields from inputs
3. Upload images to Product's photos
4. Send email to seller (confirmation)
5. Navigate to Product dashboard
```

---

Cette structure garantit un cahier des charges complet, précis et adaptable à tout type de projet Bubble.io.
