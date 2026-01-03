#!/usr/bin/env python3
"""
CLI principale pour le générateur de documents Bubble.io

Usage:
    python cli.py setup --import-transcriptions ./mes-transcriptions/
    python cli.py generate stories
    python cli.py generate flows
    python cli.py generate cdc
    python cli.py generate screens
    python cli.py generate all
"""

import argparse
import sys
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv(Path(__file__).parent.parent / ".env")

from ingest.transcriptions import TranscriptionLoader
from ingest.knowledge_scraper import BubbleKnowledgeScraper
from rag.rag_system import RAGSystem
from generators.user_stories import UserStoriesGenerator
from generators.user_flows import UserFlowsGenerator
from generators.cahier_des_charges import CahierDesChargesGenerator
from generators.screens_prompts import ScreensPromptsGenerator
from project_manager import ProjectManager


class BubbleDocCLI:
    """Interface CLI pour le générateur de documents Bubble.io"""

    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.project_manager = ProjectManager(self.base_dir)

        # Projet en cours (sera défini par select_or_create_project)
        self.current_project_path: Optional[Path] = None
        self.transcriptions_dir: Optional[Path] = None
        self.templates_dir: Optional[Path] = None
        self.output_dir: Optional[Path] = None

        self.rag_system: Optional[RAGSystem] = None

    def select_or_create_project(self):
        """Sélectionne ou crée un projet"""
        # Vérifier si un projet est déjà défini en ligne de commande ou si on doit demander
        current_project = self.project_manager.get_current_project()

        if not current_project:
            # Aucun projet en cours, demander à l'utilisateur
            self.current_project_path = self.project_manager.prompt_project_selection()
        else:
            # Utiliser le projet en cours
            print(f"\n📌 Projet en cours : {current_project}")
            use_current = input("Continuer avec ce projet ? [O/n] : ").strip().lower()

            if use_current in ['', 'o', 'oui', 'y', 'yes']:
                self.current_project_path = self.project_manager.select_project(current_project)
                print(f"✅ Utilisation du projet '{current_project}'")
            else:
                self.current_project_path = self.project_manager.prompt_project_selection()

        # Définir les paths du projet
        self.transcriptions_dir = self.current_project_path / "transcriptions"
        self.templates_dir = self.current_project_path / "templates"
        self.output_dir = self.current_project_path / "output"

        # Afficher les informations du projet
        print(f"\n📁 Dossier du projet : {self.current_project_path}")
        print(f"📝 Transcriptions : {self.transcriptions_dir}")
        print(f"📄 Output : {self.output_dir}\n")

    def setup(self, import_path: Optional[str] = None):
        """Setup initial : import transcriptions et création de la base RAG"""
        # Sélectionner ou créer un projet
        self.select_or_create_project()

        print("🚀 Setup du projet Bubble Doc Generator...")

        # 1. Importer les transcriptions si nécessaire
        if import_path:
            print(f"\n📥 Import des transcriptions depuis {import_path}...")
            loader = TranscriptionLoader(self.transcriptions_dir)
            loader.import_from_directory(import_path)

        # 2. Scraper la base de connaissance Bubble.io (reste global)
        knowledge_base_dir = self.data_dir / "knowledge-base"

        # Vérifier si la knowledge-base existe déjà
        existing_files = list(knowledge_base_dir.glob("*.md")) if knowledge_base_dir.exists() else []

        if existing_files:
            print(f"\n📚 Base de connaissance Bubble.io détectée ({len(existing_files)} fichiers)")
            rescrape = input("  Voulez-vous la rescaper ? [o/N] : ").strip().lower()

            if rescrape in ['o', 'oui', 'y', 'yes']:
                print("\n🌐 Rescraping de la base de connaissance Bubble.io...")
                scraper = BubbleKnowledgeScraper(
                    urls_file=self.data_dir / "knowledge-base" / "bubble-urls.txt",
                    output_dir=self.data_dir / "knowledge-base"
                )
                scraper.scrape_all()
            else:
                print("  ✓ Utilisation de la base de connaissance existante")
        else:
            print("\n🌐 Scraping de la base de connaissance Bubble.io...")
            scraper = BubbleKnowledgeScraper(
                urls_file=self.data_dir / "knowledge-base" / "bubble-urls.txt",
                output_dir=self.data_dir / "knowledge-base"
            )
            scraper.scrape_all()

        # 3. Créer les embeddings pour le RAG
        print("\n🧠 Création des embeddings pour le système RAG...")
        self.rag_system = RAGSystem(
            knowledge_dir=self.data_dir / "knowledge-base",
            transcriptions_dir=self.transcriptions_dir
        )
        self.rag_system.build_index()

        print("\n✅ Setup terminé avec succès!")

    def generate(self, doc_type: str):
        """Génère un type de document spécifique"""
        # Sélectionner ou créer un projet
        if not self.current_project_path:
            self.select_or_create_project()

        # Initialize RAG if not already done
        if not self.rag_system:
            print("🧠 Chargement du système RAG...")
            self.rag_system = RAGSystem(
                knowledge_dir=self.data_dir / "knowledge-base",
                transcriptions_dir=self.transcriptions_dir
            )
            print("📚 Construction de l'index vectoriel...")
            self.rag_system.build_index()

        if doc_type == "stories":
            self._generate_user_stories()
        elif doc_type == "flows":
            self._generate_user_flows()
        elif doc_type == "cdc":
            self._generate_cahier_des_charges()
        elif doc_type == "screens":
            self._generate_screens_prompts()
        elif doc_type == "all":
            self._generate_all()
        else:
            print(f"❌ Type de document inconnu: {doc_type}")
            print("Types disponibles: stories, flows, cdc, screens, all")
            sys.exit(1)

    def _generate_user_stories(self):
        """Génère les user stories"""
        print("\n📝 Génération des user stories...")
        generator = UserStoriesGenerator(self.rag_system, self.output_dir)
        output_file = generator.generate()
        print(f"✅ User stories générées: {output_file}")
        print(f"\n👉 Vous pouvez maintenant éditer le fichier avant de continuer.")

    def _generate_user_flows(self):
        """Génère les user flows (diagrammes Mermaid)"""
        print("\n🔄 Génération des user flows...")

        # Vérifier que les user stories existent
        stories_file = self.output_dir / "user-stories.md"
        if not stories_file.exists():
            print("❌ Les user stories n'existent pas encore.")
            print("👉 Exécutez d'abord: python cli.py generate stories")
            sys.exit(1)

        generator = UserFlowsGenerator(self.rag_system, self.output_dir)
        output_file = generator.generate()
        print(f"✅ User flows générés: {output_file}")

    def _generate_cahier_des_charges(self):
        """Génère le cahier des charges"""
        print("\n📋 Génération du cahier des charges...")

        # Vérifier que les prérequis existent
        stories_file = self.output_dir / "user-stories.md"
        flows_file = self.output_dir / "user-flows.md"

        if not stories_file.exists() or not flows_file.exists():
            print("❌ Les user stories et user flows doivent exister.")
            print("👉 Exécutez d'abord: python cli.py generate stories && python cli.py generate flows")
            sys.exit(1)

        generator = CahierDesChargesGenerator(
            self.rag_system,
            self.output_dir,
            template_path=self.templates_dir
        )
        output_file = generator.generate()
        print(f"✅ Cahier des charges généré: {output_file}")

    def _generate_screens_prompts(self):
        """Génère les prompts pour les écrans"""
        print("\n🖼️  Génération des prompts pour les écrans...")

        generator = ScreensPromptsGenerator(self.rag_system, self.output_dir)
        output_file = generator.generate()
        print(f"✅ Prompts écrans générés: {output_file}")

    def _generate_all(self):
        """Génère tous les documents dans l'ordre"""
        print("\n🚀 Génération de tous les documents...")
        self._generate_user_stories()

        input("\n⏸️  Appuyez sur Entrée pour continuer vers les user flows (après avoir édité les user stories si besoin)...")
        self._generate_user_flows()

        input("\n⏸️  Appuyez sur Entrée pour continuer vers le cahier des charges...")
        self._generate_cahier_des_charges()

        input("\n⏸️  Appuyez sur Entrée pour continuer vers les prompts écrans...")
        self._generate_screens_prompts()

        print("\n🎉 Tous les documents ont été générés avec succès!")


def main():
    parser = argparse.ArgumentParser(
        description="Générateur de documents pour projets Bubble.io"
    )
    subparsers = parser.add_subparsers(dest="command", help="Commande à exécuter")

    # Commande setup
    setup_parser = subparsers.add_parser("setup", help="Setup initial du projet")
    setup_parser.add_argument(
        "--import-transcriptions",
        type=str,
        help="Chemin vers le dossier contenant les transcriptions à importer"
    )

    # Commande generate
    generate_parser = subparsers.add_parser("generate", help="Générer des documents")
    generate_parser.add_argument(
        "type",
        choices=["stories", "flows", "cdc", "screens", "all"],
        help="Type de document à générer"
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    cli = BubbleDocCLI()

    if args.command == "setup":
        cli.setup(import_path=args.import_transcriptions)
    elif args.command == "generate":
        cli.generate(args.type)


if __name__ == "__main__":
    main()
