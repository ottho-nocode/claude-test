"""
Générateur de Cahier des Charges
"""

from pathlib import Path
from datetime import datetime
import anthropic
import os


class CahierDesChargesGenerator:
    """Génère le cahier des charges complet"""

    def __init__(self, rag_system, output_dir: Path, template_path: Path = None):
        self.rag = rag_system
        self.output_dir = Path(output_dir)
        self.template_path = Path(template_path) if template_path else None
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def _load_template_structure(self) -> str:
        """Charge la structure du template de cahier des charges (si disponible)"""

        if not self.template_path:
            return "Utilise une structure standard de cahier des charges"

        template_file = self.template_path / "template-cahier-des-charges.pdf"

        if not template_file.exists():
            return "Utilise une structure standard de cahier des charges"

        # TODO: Si le PDF existe, l'extraire avec PyPDF2 ou similaire
        # Pour l'instant, on utilise une structure par défaut
        return """Structure du cahier des charges:
1. Présentation du projet
2. Contexte et objectifs
3. Périmètre fonctionnel
4. Spécifications techniques
5. User stories détaillées
6. User flows
7. Architecture Bubble.io
8. Planning et livrables
9. Budget estimatif"""

    def generate(self) -> Path:
        """Génère le cahier des charges complet"""

        # Charger les documents précédents
        stories_file = self.output_dir / "user-stories.md"
        flows_file = self.output_dir / "user-flows.md"

        with open(stories_file, "r", encoding="utf-8") as f:
            user_stories = f.read()

        with open(flows_file, "r", encoding="utf-8") as f:
            user_flows = f.read()

        # Récupérer le contexte
        context = self.rag.get_context_for_generation(
            query="spécifications techniques et architecture Bubble.io",
            include_transcriptions=True,
            include_knowledge=True,
            max_chunks=10
        )

        # Charger la structure du template
        template_structure = self._load_template_structure()

        # Créer le prompt
        prompt = f"""Tu es un expert en gestion de projet Bubble.io et rédaction de cahiers des charges.

Génère un cahier des charges complet et professionnel pour ce projet Bubble.io.

STRUCTURE À SUIVRE:
{template_structure}

USER STORIES:
{user_stories}

USER FLOWS:
{user_flows}

CONTEXTE TECHNIQUE ET FONCTIONNEL:
{context}

INSTRUCTIONS:
1. Rédige un cahier des charges complet en Markdown
2. Inclus toutes les sections nécessaires
3. Sois précis sur les aspects techniques Bubble.io:
   - Types de données à créer
   - Workflows principaux
   - Plugins nécessaires
   - Intégrations externes (API, Stripe, etc.)
4. Ajoute des recommandations d'architecture
5. Sois professionnel et structuré
6. Utilise des tableaux Markdown pour les listes de fonctionnalités
7. Ajoute une section "Contraintes et limites"
8. Propose un planning macro (phases de développement)

FORMAT: Markdown structuré avec titres, sous-titres, tableaux, et listes

Génère maintenant le cahier des charges:"""

        # Appeler Claude
        print("  🤖 Appel à Claude API...")
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,  # Plus de tokens pour un document complet
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extraire le contenu
        cahier = message.content[0].text

        # Ajouter un header
        output_content = f"""# Cahier des Charges - Projet Bubble.io

**Date de création:** {datetime.now().strftime("%d/%m/%Y")}
**Version:** 1.0

---

{cahier}
"""

        # Sauvegarder
        output_file = self.output_dir / "cahier-des-charges.md"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output_content)

        return output_file
