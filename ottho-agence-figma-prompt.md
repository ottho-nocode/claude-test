# Prompt Figma AI - Page Agence Ottho (Style Light)

## PROMPT PRINCIPAL

```
Crée une landing page moderne pour une agence de développement No-Code appelée "Ottho".

STYLE GÉNÉRAL:
- Design moderne, épuré, chaleureux et professionnel
- Palette: Fond beige clair (#FDF8F4), cards blanches (#FFFFFF), accent violet (#7C3AED), texte noir (#1a1a1a) et gris (#6b7280)
- Typographie: Plus Jakarta Sans, titres bold 800, corps regular 400
- Boutons arrondis en forme de pill (border-radius: 100px)
- Coins arrondis sur les cards (16px)
- Ombres très légères et subtiles
- Espacement généreux (80px entre sections)
- Largeur max contenu: 1200px, centré

SECTIONS À CRÉER:

1. NAVIGATION (sticky top)
- Logo "otthō" à gauche (font-weight 800, noir)
- Liens au centre: Services, Process, Réalisations, FAQ
- Bouton CTA violet pill "Parler à un conseiller 📞" à droite
- Fond blanc avec légère transparence et blur

2. HERO SECTION
- Layout 2 colonnes (texte gauche, image droite)
- Badge violet clair (#F3EEFF) avec texte "🏢 L'agence No-Code N°1 en France 🇫🇷"
- Titre H1 noir: "On développe votre application sur mesure" (48px, font-weight 800)
- Sous-titre gris: "Lancez votre MVP ou digitalisez vos process grâce à l'expertise de l'équipe qui a formé +4000 développeurs No-Code."
- Bouton violet pill: "Réserver un appel découverte →"
- Ligne avis: étoiles jaunes ★★★★★ + "5/5 sur plus de 180 avis" + logo Google
- Image droite: photo dans un cadre arrondi avec caption overlay sombre "Marketplace B2B - de l'idée au lancement en 6 semaines"

3. BANDEAU LOGOS CLIENTS
- Fond beige (#FDF8F4)
- Titre: "Ils nous ont fait confiance"
- 6 logos en ligne: Evaboot, Odyseek, Upfront, ExcelFormulaBot, Scrybecast, Synthflow
- Logos en gris/désaturé

4. BANDEAU STATS (fond violet #7C3AED)
- 4 colonnes de stats en blanc:
  - "+50" / "projets livrés"
  - "4-8" / "semaines de delivery"
  - "98%" / "de clients satisfaits"
  - "+4000" / "développeurs formés"
- Chiffres en gras 42px, descriptions en regular 14px

5. SECTION SERVICES (fond beige)
- Titre centré: "Ce qu'on développe pour vous"
- Sous-titre: "Des applications web et mobile performantes, livrées en quelques semaines"
- Grille 4 cards blanches avec bordure grise légère:
  - Card 1: icône 🚀, "MVP & Prototypes", description, tech "Bubble • Xano"
  - Card 2: icône 💼, "Apps Web Métier", description, tech "Bubble • WeWeb"
  - Card 3: icône 📱, "Apps Mobile", description, tech "FlutterFlow"
  - Card 4: icône ⚡, "Automatisations", description, tech "Make • Zapier • n8n"
- Hover: bordure devient violet, légère élévation

6. SECTION PROCESS (fond blanc)
- Titre: "Notre process"
- Sous-titre: "Une méthodologie éprouvée sur +50 projets"
- 5 étapes en ligne horizontale avec flèches → entre chaque:
  - Cercle violet clair avec numéro violet + titre + durée
  1. Discovery Call - 30 min • Gratuit
  2. Cadrage & Specs - 1 semaine
  3. Design UI/UX - 1-2 semaines
  4. Développement - 2-4 semaines
  5. Go Live - Lancement + formation

7. SECTION PORTFOLIO (fond beige)
- Titre: "Nos dernières réalisations"
- 3 cards projets côte à côte:
  - Image placeholder avec dégradé pastel (violet, vert, orange)
  - Tag blanc pill sur l'image (MVP, App Métier, SaaS)
  - Titre projet, description 1 ligne
  - Résultat en violet "✓ Livré en 6 semaines"
- Hover: élévation shadow

8. SECTION TÉMOIGNAGES (fond blanc)
- Titre italic: "Des clients satisfaits"
- Sous-titre: "Rejoignez les entreprises qui nous font confiance"
- Rating: ★★★★★ 5/5 sur plus de 180 avis Google
- Grille 5 cards témoignages:
  - Avatar cercle avec initiales (fond violet clair, texte violet)
  - Nom + étoiles jaunes
  - Citation en gris
- Noms: Marc Lamouret, Nathalie Morel, Sof PG, Geoffrey Riviere, Guillaume Berthet

9. SECTION POURQUOI NOUS (fond beige)
- Titre: "Pourquoi choisir Ottho ?"
- Sous-titre: "L'expertise No-Code la plus reconnue en France"
- 3 cards blanches centrées:
  - Card 1: 🏆 "Expertise N°1" - "Formateurs Bubble depuis 2020 et +4000 développeurs formés..."
  - Card 2: 👥 "Équipe Senior" - "Nos développeurs ont +3 ans d'expérience No-Code..."
  - Card 3: 🎓 "Vous repartez autonome" - "Formation incluse à la fin du projet..."

10. SECTION FAQ (fond blanc)
- Titre: "Questions fréquentes"
- Accordéon centré (max 800px):
  - Question en noir bold 17px
  - "+" violet à droite
  - Réponse en gris dessous
- Questions:
  - Combien coûte un projet ?
  - Quels sont les délais de livraison ?
  - Quelles technologies utilisez-vous ?
  - Que se passe-t-il après la livraison ?
  - Je n'y connais rien en tech, c'est grave ?

11. SECTION CTA FINALE (fond violet #7C3AED)
- Titre blanc: "Prêt à lancer votre projet ?"
- Sous-titre: "Réservez un appel découverte gratuit de 30 minutes"
- Bouton blanc pill: "Parler à un conseiller 📞"
- Texte: "ou envoyez-nous votre brief à hello@ottho.co"

12. FOOTER (fond beige)
- Logo otthō + description
- 3 colonnes de liens: Entreprise, Formations, Ressources
- Ligne copyright + icônes réseaux sociaux (LinkedIn, X, YouTube)
```

---

## PROMPTS PAR COMPOSANT

### Badge hero:
```
Crée un badge pill avec fond violet très clair (#F3EEFF), texte violet (#7C3AED), padding 8px 16px, font-weight 600, avec emoji drapeau français
```

### Bouton CTA principal:
```
Crée un bouton pill (border-radius 100px) fond violet (#7C3AED), texte blanc, padding 16px 32px, font-weight 600, avec flèche → à droite. Hover: violet plus foncé (#6D28D9), légère ombre
```

### Cards services:
```
Card blanche, border 1px #e5e7eb, border-radius 16px, padding 32px. Icône 56x56 fond violet clair avec emoji centré. Titre 18px bold noir, description 14px gris, tech en violet 13px bold. Hover: border violet, translateY(-4px), shadow
```

### Bandeau stats:
```
Fond violet uni (#7C3AED), padding 48px. 4 colonnes centrées. Chiffre 42px font-weight 800 blanc, texte 14px blanc 80% opacité dessous
```

### Timeline process:
```
5 cercles 64px fond violet clair (#F3EEFF) avec numéro violet (#7C3AED) 24px bold centré. Flèche → grise entre chaque cercle. Titre 16px bold noir dessous, durée 13px gris
```

### Cards témoignages:
```
Card blanche border grise, border-radius 16px, padding 24px. Avatar 44px cercle fond violet clair avec initiales violet. Nom 14px bold + étoiles jaunes 12px. Citation 14px gris line-height 1.6
```

### Accordéon FAQ:
```
Ligne avec question 17px bold noir à gauche, "+" violet 24px à droite. Border-bottom grise. Au clic: + devient × (rotation 45deg), réponse gris 15px apparaît dessous avec animation slide
```

---

## PALETTE EXACTE

| Élément | Couleur |
|---------|---------|
| Fond page | #FDF8F4 |
| Cards/Sections blanches | #FFFFFF |
| Accent principal | #7C3AED |
| Accent hover | #6D28D9 |
| Accent light (badges, icons bg) | #F3EEFF |
| Texte principal | #1a1a1a |
| Texte secondaire | #6b7280 |
| Texte muted | #9ca3af |
| Bordures | #e5e7eb |
| Étoiles avis | #FBBF24 |
| Succès/Check | #10b981 |

---

## TYPOGRAPHIE

- **Font**: Plus Jakarta Sans (Google Fonts)
- **H1**: 48px, weight 800, letter-spacing -1px
- **H2**: 36px, weight 800, letter-spacing -0.5px
- **H3 cards**: 18-20px, weight 700
- **Body**: 14-16px, weight 400, line-height 1.6
- **Boutons**: 15-16px, weight 600
- **Small/Tech**: 12-13px, weight 600
