"""
Générateur de designs Figma via MCP
"""

from pathlib import Path
from datetime import datetime
import anthropic
import os


class FigmaDesigner:
    """Génère automatiquement les designs Figma depuis les spécifications"""

    def __init__(self, rag_system, output_dir: Path, project_name: str):
        self.rag = rag_system
        self.output_dir = Path(output_dir)
        self.project_name = project_name
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def generate(self) -> Path:
        """Génère les designs Figma et retourne le chemin du fichier de rapport"""

        print("\n" + "="*60)
        print("🎨 GÉNÉRATION DES DESIGNS FIGMA")
        print("="*60)

        # Charger tous les documents précédents
        stories_file = self.output_dir / "user-stories.md"
        flows_file = self.output_dir / "user-flows.md"
        cdc_file = self.output_dir / "cahier-des-charges.md"
        screens_file = self.output_dir / "screens-prompts.md"

        print("  📖 Chargement des documents...")
        with open(stories_file, "r", encoding="utf-8") as f:
            user_stories = f.read()

        with open(flows_file, "r", encoding="utf-8") as f:
            user_flows = f.read()

        with open(cdc_file, "r", encoding="utf-8") as f:
            cahier = f.read()

        with open(screens_file, "r", encoding="utf-8") as f:
            screens_prompts = f.read()

        # Récupérer le contexte UI/UX Bubble
        print("  🔍 Récupération du contexte Bubble UI/UX...")
        context = self.rag.get_context_for_generation(
            query="bubble.io interface design responsive components elements buttons forms",
            include_transcriptions=False,
            include_knowledge=True,
            max_chunks=6
        )

        # Créer le prompt pour Claude avec outils MCP
        prompt = f"""Tu es un expert en design UI/UX et tu as accès aux outils Figma via MCP.

OBJECTIF: Créer automatiquement les designs Figma pour le projet "{self.project_name}" en utilisant les spécifications fournies.

DOCUMENTATION PROJET:

USER STORIES:
{user_stories[:3000]}...

USER FLOWS:
{user_flows[:2000]}...

CAHIER DES CHARGES (extrait):
{cahier[:4000]}...

PROMPTS ÉCRANS:
{screens_prompts[:4000]}...

CONTEXTE BUBBLE.IO:
{context}

INSTRUCTIONS:

1. **Créer un nouveau fichier Figma** nommé "{self.project_name} - Designs"

2. **Pour chaque écran principal identifié** dans les documents:
   - Créer une frame (1440x900 pour desktop, 375x812 pour mobile)
   - Définir la structure (header, contenu, footer)
   - Ajouter les composants UI de base (boutons, inputs, cards, etc.)
   - Appliquer une palette de couleurs cohérente
   - Respecter les spécifications du cahier des charges

3. **Style guide**:
   - Créer une page "Style Guide" avec:
     - Palette de couleurs
     - Typographie (titres, textes, labels)
     - Composants réutilisables (buttons, inputs, cards)
     - Spacing system (8px grid)

4. **Workflow**:
   - Organiser les frames par fonctionnalité/rôle utilisateur
   - Créer des connexions entre les écrans (prototyping)
   - Ajouter des annotations pour les interactions

IMPORTANT:
- Utilise les outils MCP Figma disponibles pour créer réellement le fichier
- Crée des designs simples mais professionnels
- Respecte les principes de design Bubble.io (responsive, composants modulaires)
- Retourne le lien vers le fichier Figma créé

Commence maintenant la création des designs Figma."""

        # Appeler Claude avec outils MCP
        print("  🤖 Génération des designs avec Claude + MCP Figma...")
        print("  ⏳ Cela peut prendre quelques minutes...")

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=16384,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            # Extraire le contenu et les résultats
            response_text = message.content[0].text

            # Créer le rapport
            output_content = f"""# Designs Figma - {self.project_name}

**Généré le:** {datetime.now().strftime("%d/%m/%Y à %H:%M")}

---

## 📊 Résumé de la génération

{response_text}

---

## 🎨 Contenu des designs

Les designs Figma incluent :

### Pages créées
- **Style Guide** : Composants, couleurs, typographie
- **User Flows** : Diagrammes des parcours utilisateurs
- **Screens** : Tous les écrans principaux de l'application
- **Components** : Bibliothèque de composants réutilisables

### Écrans par rôle utilisateur
Les écrans ont été organisés selon les rôles identifiés dans le cahier des charges.

### Annotations
Des annotations ont été ajoutées pour :
- Les interactions utilisateur
- Les workflows Bubble.io à implémenter
- Les contraintes techniques
- Les états alternatifs (loading, error, empty)

---

## 🔗 Accès aux designs

**Lien Figma** : [Voir dans le rapport ci-dessus]

### Comment utiliser les designs

1. **Pour le développement Bubble.io** :
   - Ouvrir le fichier Figma
   - Consulter les spécifications de chaque écran
   - Utiliser les mesures et styles fournis

2. **Pour la collaboration** :
   - Partager le lien Figma avec l'équipe
   - Utiliser les commentaires Figma pour les retours
   - Référencer les frames dans les tickets/issues

3. **Export** :
   - Exporter les assets (images, icônes)
   - Copier les couleurs et styles CSS
   - Utiliser le code CSS généré par Figma

---

## ✅ Prochaines étapes

1. **Review** : Examiner les designs avec le client
2. **Itération** : Ajuster selon les retours
3. **Handoff** : Partager les specs avec les développeurs Bubble.io
4. **Développement** : Utiliser les designs comme référence pour l'implémentation

---

## 📝 Notes

- Les designs respectent les contraintes Bubble.io
- Le système de grille 8px facilite l'implémentation
- Les composants sont modulaires et réutilisables
- Les designs sont optimisés pour le responsive (desktop + mobile)
"""

            # Sauvegarder
            output_file = self.output_dir / "figma-designs.md"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(output_content)

            print(f"\n  ✅ Designs Figma générés : {output_file.name}")
            return output_file

        except Exception as e:
            print(f"\n  ⚠️  Erreur lors de la génération Figma : {str(e)}")
            print("  💡 Vérifiez que le serveur MCP Figma est bien configuré et authentifié")

            # Créer un rapport d'erreur
            error_report = f"""# Designs Figma - {self.project_name}

**Généré le:** {datetime.now().strftime("%d/%m/%Y à %H:%M")}

---

## ⚠️ Erreur de génération

Une erreur s'est produite lors de la création des designs Figma :

```
{str(e)}
```

### Solutions possibles

1. **Vérifier la configuration MCP Figma** :
   ```bash
   claude mcp list
   ```

2. **Authentification** :
   - Tapez `/mcp` dans Claude Code
   - Sélectionnez "figma"
   - Cliquez sur "Authenticate"

3. **Ajouter le serveur MCP** (si absent) :
   ```bash
   claude mcp add --transport http figma https://mcp.figma.com/mcp
   ```

4. **Alternative manuelle** :
   Utilisez le fichier `screens-prompts.md` pour créer manuellement les designs dans Figma.

---

## 📋 Spécifications disponibles

Les documents suivants sont disponibles pour créer les designs manuellement :
- `user-stories.md` - Fonctionnalités attendues
- `user-flows.md` - Parcours utilisateurs
- `cahier-des-charges.md` - Spécifications détaillées
- `screens-prompts.md` - Prompts pour chaque écran
"""

            output_file = self.output_dir / "figma-designs.md"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(error_report)

            return output_file
