"""
Générateur de User Flows (diagrammes Mermaid)
"""

from pathlib import Path
from datetime import datetime
import anthropic
import os


class UserFlowsGenerator:
    """Génère les user flows sous forme de diagrammes Mermaid"""

    def __init__(self, rag_system, output_dir: Path):
        self.rag = rag_system
        self.output_dir = Path(output_dir)
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def generate(self) -> Path:
        """Génère les user flows et retourne le chemin du fichier"""

        # Charger les user stories générées précédemment
        stories_file = self.output_dir / "user-stories.md"
        with open(stories_file, "r", encoding="utf-8") as f:
            user_stories = f.read()

        # Récupérer le contexte depuis le RAG
        context = self.rag.get_context_for_generation(
            query="workflows et parcours utilisateur",
            include_transcriptions=True,
            include_knowledge=True,
            max_chunks=8
        )

        # Créer le prompt
        prompt = f"""Tu es un expert en UX design pour des applications Bubble.io.

À partir des user stories et du contexte ci-dessous, génère des diagrammes de flux utilisateur (user flows) en utilisant la syntaxe Mermaid.

USER STORIES:
{user_stories}

CONTEXTE ADDITIONNEL:
{context}

INSTRUCTIONS:
1. Crée un diagramme Mermaid pour chaque parcours principal:
   - Inscription/Connexion
   - Parcours d'achat/utilisation principal
   - Gestion de profil
   - Workflows administrateur (si applicable)

2. Utilise la syntaxe Mermaid flowchart (flowchart TD ou LR)

3. Inclus:
   - Points d'entrée et de sortie
   - Décisions (losanges)
   - Actions (rectangles)
   - Connexions avec des labels explicites

4. Format Markdown avec sections pour chaque flow

EXEMPLE DE SYNTAXE MERMAID:
```mermaid
flowchart TD
    A[Démarrer] --> B{Utilisateur connecté?}
    B -->|Oui| C[Accueil]
    B -->|Non| D[Page de connexion]
    D --> E[Saisir identifiants]
    E --> F{Identifiants valides?}
    F -->|Oui| C
    F -->|Non| D
```

Génère maintenant les user flows:"""

        # Appeler Claude
        print("  🤖 Appel à Claude API...")
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extraire le contenu
        user_flows = message.content[0].text

        # Ajouter un header
        output_content = f"""# User Flows - Projet Bubble.io

**Généré le:** {datetime.now().strftime("%d/%m/%Y à %H:%M")}

---

{user_flows}

---

## Notes d'utilisation

Ces diagrammes peuvent être visualisés :
- Dans GitHub/GitLab (support natif Mermaid)
- Sur https://mermaid.live/ (copier/coller le code)
- Dans VSCode avec l'extension "Markdown Preview Mermaid Support"
"""

        # Sauvegarder
        output_file = self.output_dir / "user-flows.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output_content)

        return output_file
