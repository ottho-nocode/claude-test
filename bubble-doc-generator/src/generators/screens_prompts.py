"""
Générateur de prompts pour la création des écrans
"""

from pathlib import Path
from datetime import datetime
import anthropic
import os


class ScreensPromptsGenerator:
    """Génère des prompts détaillés pour créer chaque écran de l'interface"""

    def __init__(self, rag_system, output_dir: Path):
        self.rag = rag_system
        self.output_dir = Path(output_dir)
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def generate(self) -> Path:
        """Génère les prompts pour les écrans et retourne le chemin du fichier"""

        # Charger tous les documents précédents
        stories_file = self.output_dir / "user-stories.md"
        flows_file = self.output_dir / "user-flows.md"
        cdc_file = self.output_dir / "cahier-des-charges.md"

        with open(stories_file, "r", encoding="utf-8") as f:
            user_stories = f.read()

        with open(flows_file, "r", encoding="utf-8") as f:
            user_flows = f.read()

        with open(cdc_file, "r", encoding="utf-8") as f:
            cahier = f.read()

        # Récupérer le contexte UI/UX
        context = self.rag.get_context_for_generation(
            query="interface utilisateur bubble design responsive elements",
            include_transcriptions=True,
            include_knowledge=True,
            max_chunks=8
        )

        # Créer le prompt
        prompt = f"""Tu es un expert en design UI/UX pour Bubble.io.

Génère des prompts détaillés pour créer chaque écran de l'application dans Bubble.io.

DOCUMENTATION PROJET:

USER STORIES:
{user_stories}

USER FLOWS:
{user_flows}

CAHIER DES CHARGES:
{cahier}

BASE DE CONNAISSANCE BUBBLE:
{context}

INSTRUCTIONS:
Pour chaque écran principal de l'application, crée un prompt détaillé qui pourra être utilisé par un développeur Bubble.io ou un outil de génération d'interface.

Chaque prompt d'écran doit inclure:

1. **Nom de l'écran** et son rôle
2. **Layout général** (disposition, sections)
3. **Éléments visuels**:
   - Header/Navigation
   - Contenu principal
   - Sidebar (si applicable)
   - Footer
4. **Composants Bubble.io** à utiliser:
   - Repeating Groups
   - Input forms
   - Buttons
   - Text elements
   - Images/Icons
5. **Responsive design**: comportement mobile/desktop
6. **États et interactions**:
   - États de chargement
   - États vides
   - États d'erreur
7. **Style visuel**:
   - Palette de couleurs
   - Typographie
   - Espacement
8. **Workflows déclenchés** depuis cet écran

FORMAT: Markdown avec une section par écran

Génère maintenant les prompts pour tous les écrans principaux:"""

        # Appeler Claude
        print("  🤖 Appel à Claude API...")
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extraire le contenu
        screens = message.content[0].text

        # Ajouter un header
        output_content = f"""# Prompts pour la création des écrans - Projet Bubble.io

**Généré le:** {datetime.now().strftime("%d/%m/%Y à %H:%M")}

---

## Introduction

Ce document contient des prompts détaillés pour créer chaque écran de l'application dans Bubble.io.

Chaque prompt peut être:
- Utilisé comme guide par un développeur Bubble.io
- Fourni à un outil d'IA pour générer du code/configuration
- Utilisé comme spécification pour la création manuelle

---

{screens}

---

## Notes d'utilisation

### Pour les développeurs Bubble.io
- Suivez les spécifications pour chaque écran
- Adaptez les composants selon les contraintes du projet
- Testez la responsivité sur différents appareils

### Pour la génération assistée par IA
- Copiez le prompt de l'écran souhaité
- Fournissez-le à Claude/GPT avec le contexte Bubble.io
- Demandez la génération de la configuration Bubble

### Checklist de création d'écran
- [ ] Structure HTML/Bubble mise en place
- [ ] Composants configurés
- [ ] Styles appliqués
- [ ] Workflows créés
- [ ] Responsive testé
- [ ] États alternatifs gérés (loading, error, empty)
"""

        # Sauvegarder
        output_file = self.output_dir / "screens-prompts.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output_content)

        return output_file
