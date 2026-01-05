# Prompt Figma AI - Page Agence Ottho

## Instructions pour Figma AI / Plugins (Magician, Diagram, etc.)

---

## PROMPT PRINCIPAL

```
Crée une landing page moderne pour une agence de développement No-Code appelée "Ottho Studio".

STYLE GÉNÉRAL:
- Design moderne, minimaliste, professionnel
- Palette: Fond sombre (#0a0a0a ou #111111), accents violet/indigo (#7C3AED ou #6366F1), texte blanc (#FFFFFF) et gris (#9CA3AF)
- Typographie: Inter ou Plus Jakarta Sans, titres bold, corps regular
- Coins arrondis (16-24px), ombres subtiles
- Espacement généreux (80-120px entre sections)
- Largeur max contenu: 1200px, centré

SECTIONS À CRÉER:

1. HERO SECTION (100vh)
- Navigation: Logo "Ottho" à gauche, liens (Services, Projets, Process, Contact) au centre, bouton CTA "Réserver un appel" à droite
- Titre principal H1: "On développe votre application No-Code sur mesure"
- Sous-titre: "De l'idée au lancement en 4-8 semaines. Sans code, sans friction."
- Deux boutons: "Réserver un appel découverte" (primary, violet) et "Voir nos projets" (secondary, outline)
- Élément visuel: mockup d'app ou illustration abstraite à droite
- Badge de confiance: "⭐ 4.9/5 sur 50+ projets"

2. BANDEAU LOGOS/STATS (fond légèrement différent)
- 4 stats en ligne: "50+ projets livrés" | "3000+ devs formés" | "4-8 semaines" | "Satisfaction 98%"
- Ou logos clients si disponibles (placeholder gris)

3. SECTION PROBLÈME/SOLUTION
- Titre: "Vous avez une idée. On la construit."
- Deux colonnes:
  - Gauche "Le problème": liste avec icônes X rouges
    - "Développer en code coûte trop cher"
    - "Les agences classiques prennent 6 mois"
    - "Vous avez besoin d'aller vite"
  - Droite "Notre solution": liste avec icônes ✓ vertes
    - "No-Code = 3x moins cher"
    - "Livraison en 4-8 semaines"
    - "Itérations rapides, budget maîtrisé"

4. SECTION SERVICES (grille 2x2 ou 4 colonnes)
- Titre: "Ce qu'on développe"
- 4 cards avec icône, titre, description:
  - Card 1: MVP & Prototypes - "Validez votre idée rapidement avec un produit fonctionnel"
  - Card 2: Apps Web Métier - "CRM, dashboards, outils internes sur mesure"
  - Card 3: Apps Mobile - "iOS & Android avec FlutterFlow"
  - Card 4: Automatisations - "Connectez vos outils, automatisez vos process"
- Chaque card a une icône, fond card sombre (#1a1a1a), border subtle

5. SECTION PROCESSUS (timeline horizontale)
- Titre: "Notre processus en 5 étapes"
- Timeline visuelle avec 5 étapes connectées:
  1. "Discovery Call" - 1h - Icône téléphone
  2. "Cadrage & Specs" - 1 semaine - Icône document
  3. "Design UI/UX" - 1-2 semaines - Icône Figma
  4. "Développement" - 2-4 semaines - Icône code
  5. "Lancement" - 1 semaine - Icône rocket
- Ligne de connexion entre les étapes, style moderne

6. SECTION PORTFOLIO (3 cards projets)
- Titre: "Nos dernières réalisations"
- 3 project cards côte à côte:
  - Image placeholder (mockup app)
  - Tag catégorie (MVP, App Métier, etc.)
  - Nom du projet
  - Description 1 ligne
  - Résultat clé ("Livré en 5 semaines", "+200 utilisateurs")
- Bouton "Voir tous les projets"

7. SECTION TÉMOIGNAGE (grande citation)
- Fond différencié (gradient subtil ou card)
- Grande citation avec guillemets décoratifs
- "Ottho a transformé notre idée en produit fonctionnel en 6 semaines. Leur expertise Bubble est incomparable."
- Photo avatar, nom, titre, entreprise
- Étoiles 5/5

8. SECTION "POURQUOI OTTHO" (3 colonnes)
- Titre: "Pourquoi nous choisir"
- 3 blocs avec icône + titre + texte:
  - "Expertise N°1" - "Formateurs Bubble depuis 2020, 3000+ devs formés"
  - "Équipe Senior" - "Nos devs ont +3 ans d'expérience No-Code"
  - "Vous repartez autonome" - "Formation incluse pour gérer votre app"

9. SECTION FAQ (accordéon)
- Titre: "Questions fréquentes"
- 5-6 questions:
  - "Combien coûte un projet ?" → "À partir de 5 000€ pour un MVP simple..."
  - "Quels sont les délais ?" → "Entre 4 et 8 semaines selon la complexité..."
  - "Quelles technologies utilisez-vous ?" → "Bubble, FlutterFlow, Xano, Make..."
  - "Que se passe-t-il après la livraison ?" → "Maintenance et évolutions possibles..."
  - "Je n'y connais rien en tech, c'est grave ?" → "Pas du tout, on s'occupe de tout..."

10. SECTION CTA FINALE
- Fond gradient violet/indigo
- Titre: "Prêt à lancer votre projet ?"
- Sous-titre: "Réservez un appel découverte gratuit de 30 minutes"
- Bouton large: "Réserver mon appel" (blanc sur fond)
- Texte secondaire: "ou envoyez-nous votre brief à hello@ottho.co"

11. FOOTER
- Logo Ottho
- Liens: Services, Projets, Blog, Formations, Contact
- Réseaux sociaux: LinkedIn, Twitter, YouTube
- Copyright + Mentions légales
```

---

## PROMPTS ADDITIONNELS PAR COMPOSANT

### Pour les cards services:
```
Crée 4 cards de service minimalistes avec: icône ligne fine en haut, titre bold, description 2 lignes, fond #1a1a1a, border 1px #2a2a2a, border-radius 16px, padding 32px, hover: border devient violet #7C3AED
```

### Pour la timeline processus:
```
Crée une timeline horizontale 5 étapes, chaque étape = cercle numéroté + titre + durée, cercles connectés par ligne, cercle actif en violet #7C3AED, style moderne épuré
```

### Pour les project cards:
```
Crée une card projet: image 16:10 en haut avec border-radius, tag catégorie positionné sur l'image, titre projet bold, description 1 ligne gris, métrique résultat en violet. Hover: légère élévation shadow
```

### Pour le témoignage:
```
Crée un bloc témoignage centré: guillemets décoratifs géants en violet 20% opacité, citation en texte large italic, puis ligne avec avatar rond 48px + nom bold + titre gris + 5 étoiles jaunes
```

---

## VARIANTES DE STYLE

### Option A - Ultra minimal (style Linear/Vercel)
```
Fond #000000, texte blanc pur, accents gradient violet-bleu, très peu d'éléments, beaucoup d'espace vide, animations subtiles suggérées
```

### Option B - Moderne friendly (style Notion/Figma)
```
Fond #111111, touches de couleurs vives (violet + accents colorés sur les icônes), illustrations custom, plus de personnalité
```

### Option C - Corporate premium (style Stripe)
```
Fond gradient très subtil, éléments 3D légers, glassmorphism sur certaines cards, très polished
```
