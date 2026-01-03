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
            return "Utilise une structure standard de cahier des charges organisée par rôles utilisateurs"

        # Charger le template de structure markdown
        template_structure_file = self.template_path / "TEMPLATE-STRUCTURE.md"

        if template_structure_file.exists():
            with open(template_structure_file, "r", encoding="utf-8") as f:
                return f.read()

        # Fallback : structure par rôles
        return """STRUCTURE PAR RÔLES UTILISATEURS:

Pour chaque rôle identifié, suivre cette organisation:

## [NOM DU RÔLE]

### Authentification
- Méthodes (inscription/connexion)
- Vérifications
- Sécurité

### Onboarding (si applicable)
- Informations obligatoires
- Validation du compte
- Documents requis

### Dashboard / Espace principal
- Métriques chiffrées
- Gestion des entités (création, modification, suppression)

### Fonctionnalités spécifiques
- Détailler chaque fonctionnalité unique au rôle
- Workflow précis
- Champs de données
- Notifications

### Messagerie (si applicable)
- Liste conversations
- Détail conversation
- Actions disponibles

### Profil
- Modification informations
- Modification mot de passe
- Suppression compte"""

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

Génère un cahier des charges complet et professionnel pour ce projet Bubble.io en suivant STRICTEMENT la structure par rôles utilisateurs fournie.

STRUCTURE À SUIVRE (OBLIGATOIRE):
{template_structure}

USER STORIES:
{user_stories}

USER FLOWS:
{user_flows}

CONTEXTE TECHNIQUE ET FONCTIONNEL:
{context}

INSTRUCTIONS CRITIQUES:
1. **ORGANISATION PAR RÔLES** : Le cahier des charges DOIT être organisé par rôle utilisateur (Administrateur, Agence, Agent, Utilisateur, etc.), PAS par fonctionnalités
2. Pour chaque rôle identifié dans les transcriptions, crée une section complète avec TOUTES les sous-sections du template
3. Respecte EXACTEMENT la hiérarchie du template : Authentification > Onboarding > Dashboard > Fonctionnalités > Messagerie > Profil
4. Sois TRÈS PRÉCIS sur les détails:
   - Champs de formulaires (obligatoires/optionnels)
   - Workflows étape par étape
   - Règles de validation
   - Notifications (email/push)
   - Statuts et états
   - Métriques et KPIs
5. Pour les fonctionnalités complexes (Kanban, Import XML, Estimation), détaille:
   - Le workflow complet
   - Les différents types/modes si applicable
   - Les règles métier
   - Les délais et temporalités
6. Utilise des **listes à puces** pour les champs et détails
7. Utilise des **workflows numérotés** pour les processus multi-étapes
8. Ajoute des **blocs "Important:"** pour les contraintes critiques

ASPECTS TECHNIQUES BUBBLE.IO À INCLURE:
- Types de données (Data Types) à créer
- Workflows principaux et leurs déclencheurs
- Plugins nécessaires (Stripe, messaging, etc.)
- Intégrations externes (API, XML, etc.)
- Permissions et privacy rules par rôle
- Responsive design (web + mobile si applicable)

FORMAT: Markdown professionnel avec:
- Titres clairs (##, ###, ####)
- Listes à puces pour les détails
- Workflows numérotés
- Sections "Important:" pour les contraintes
- Pas de tableaux complexes, privilégier les listes

IMPORTANT: Ne crée QUE les rôles mentionnés dans les transcriptions. Ne crée PAS de sections vides.

Génère maintenant le cahier des charges en suivant RIGOUREUSEMENT la structure par rôles:"""

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
