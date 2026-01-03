"""
Générateur de User Stories
"""

from pathlib import Path
from datetime import datetime
import anthropic
import os


class UserStoriesGenerator:
    """Génère les user stories à partir des transcriptions"""

    def __init__(self, rag_system, output_dir: Path):
        self.rag = rag_system
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Initialiser le client Claude
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY manquante dans les variables d'environnement")

        self.client = anthropic.Anthropic(api_key=api_key)

    def generate(self) -> Path:
        """Génère les user stories et retourne le chemin du fichier"""

        # Récupérer le contexte depuis le RAG
        context = self.rag.get_context_for_generation(
            query="besoins fonctionnels du projet client",
            include_transcriptions=True,
            include_knowledge=True,
            max_chunks=10
        )

        # Créer le prompt
        prompt = f"""Tu es un expert en analyse fonctionnelle pour des projets Bubble.io.

À partir des transcriptions de réunions clients ci-dessous, génère des user stories détaillées et structurées.

CONTEXTE:
{context}

INSTRUCTIONS:
1. Identifie tous les acteurs (utilisateurs, administrateurs, etc.)
2. Pour chaque fonctionnalité mentionnée, crée une user story au format:
   - En tant que [acteur]
   - Je veux [fonctionnalité]
   - Afin de [bénéfice/objectif]

3. Ajoute des critères d'acceptation pour chaque story
4. Priorise les stories (Critique / Important / Souhaitable)
5. Utilise le format Markdown
6. Organise par thématiques (Authentification, Catalogue, Paiement, etc.)

IMPORTANT:
- Sois précis et technique (mentionne les éléments Bubble.io quand pertinent)
- Utilise la base de connaissance Bubble.io pour des suggestions techniques appropriées
- Reste fidèle aux besoins exprimés dans les transcriptions

Génère maintenant les user stories:"""

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
        user_stories = message.content[0].text

        # Ajouter un header
        output_content = f"""# User Stories - Projet Bubble.io

**Généré le:** {datetime.now().strftime("%d/%m/%Y à %H:%M")}

---

{user_stories}
"""

        # Sauvegarder
        output_file = self.output_dir / "user-stories.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output_content)

        return output_file
