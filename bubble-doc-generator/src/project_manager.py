"""
Gestionnaire de projets pour le générateur de documents Bubble.io
"""

import os
from pathlib import Path
from typing import List, Optional


class ProjectManager:
    """Gère les projets clients"""

    def __init__(self, base_dir: Path):
        self.base_dir = Path(base_dir)
        self.projects_dir = self.base_dir / "projects"
        self.projects_dir.mkdir(parents=True, exist_ok=True)
        self.current_project_file = self.base_dir / ".current-project"

    def list_projects(self) -> List[str]:
        """Liste tous les projets existants"""
        projects = []
        if self.projects_dir.exists():
            for item in self.projects_dir.iterdir():
                if item.is_dir() and not item.name.startswith('.'):
                    projects.append(item.name)
        return sorted(projects)

    def create_project(self, project_name: str) -> Path:
        """
        Crée un nouveau projet avec sa structure de dossiers

        Args:
            project_name: Nom du projet (sera normalisé)

        Returns:
            Path vers le dossier du projet créé
        """
        # Normaliser le nom du projet (remplacer espaces par tirets, lowercase)
        normalized_name = project_name.lower().strip()
        normalized_name = normalized_name.replace(' ', '-')
        normalized_name = ''.join(c for c in normalized_name if c.isalnum() or c == '-')

        project_path = self.projects_dir / normalized_name

        if project_path.exists():
            raise ValueError(f"Le projet '{normalized_name}' existe déjà")

        # Créer la structure de dossiers
        (project_path / "transcriptions").mkdir(parents=True, exist_ok=True)
        (project_path / "templates").mkdir(parents=True, exist_ok=True)
        (project_path / "output").mkdir(parents=True, exist_ok=True)

        # Créer des fichiers README
        self._create_project_readme(project_path, project_name)

        print(f"✅ Projet '{project_name}' créé : {normalized_name}")
        return project_path

    def _create_project_readme(self, project_path: Path, project_name: str):
        """Crée les README pour un nouveau projet"""

        # README principal du projet
        readme_content = f"""# {project_name}

**Date de création :** {self._get_current_date()}

## Structure

- `transcriptions/` : Vos transcriptions de réunions clients
- `templates/` : Template de cahier des charges (optionnel)
- `output/` : Documents générés

## Utilisation

1. Ajoutez vos transcriptions dans `transcriptions/`
2. (Optionnel) Ajoutez votre template CDC dans `templates/`
3. Lancez la génération :
   ```bash
   cd src
   python cli.py generate all
   ```
"""
        (project_path / "README.md").write_text(readme_content, encoding='utf-8')

        # README transcriptions
        trans_readme = """# Transcriptions

Placez vos fichiers de transcription markdown (.md) ici.

Format attendu : voir `data/transcriptions/example-transcription.md`
"""
        (project_path / "transcriptions" / "README.md").write_text(trans_readme, encoding='utf-8')

    def _get_current_date(self) -> str:
        """Retourne la date actuelle formatée"""
        from datetime import datetime
        return datetime.now().strftime("%d/%m/%Y")

    def select_project(self, project_name: str) -> Path:
        """
        Sélectionne un projet existant

        Args:
            project_name: Nom du projet

        Returns:
            Path vers le dossier du projet
        """
        project_path = self.projects_dir / project_name

        if not project_path.exists():
            raise ValueError(f"Le projet '{project_name}' n'existe pas")

        return project_path

    def get_current_project(self) -> Optional[str]:
        """Récupère le nom du projet en cours"""
        if self.current_project_file.exists():
            content = self.current_project_file.read_text().strip()
            # Ignorer les lignes de commentaire
            lines = [line for line in content.split('\n') if line and not line.startswith('#')]
            if lines:
                return lines[0].strip()
        return None

    def set_current_project(self, project_name: str):
        """Définit le projet en cours"""
        self.current_project_file.write_text(project_name, encoding='utf-8')

    def prompt_project_selection(self) -> Path:
        """
        Demande à l'utilisateur de sélectionner ou créer un projet

        Returns:
            Path vers le projet sélectionné
        """
        projects = self.list_projects()

        print("\n" + "="*60)
        print("🗂️  GESTION DES PROJETS")
        print("="*60)

        # Afficher le projet en cours
        current = self.get_current_project()
        if current:
            print(f"\n📌 Projet en cours : {current}")

        # Options
        print("\nOptions disponibles :")
        print("  [N] Créer un nouveau projet")

        if projects:
            print("  [S] Sélectionner un projet existant")
            print("\nProjets existants :")
            for i, project in enumerate(projects, 1):
                marker = " (actuel)" if project == current else ""
                print(f"    {i}. {project}{marker}")

        print("\n" + "-"*60)
        choice = input("\nVotre choix [N/S] : ").strip().upper()

        if choice == 'N':
            # Créer un nouveau projet
            project_name = input("\nNom du projet : ").strip()
            if not project_name:
                print("❌ Le nom du projet ne peut pas être vide")
                return self.prompt_project_selection()

            try:
                project_path = self.create_project(project_name)
                normalized_name = project_path.name
                self.set_current_project(normalized_name)
                print(f"\n✅ Projet '{project_name}' sélectionné")
                return project_path
            except ValueError as e:
                print(f"❌ Erreur : {e}")
                return self.prompt_project_selection()

        elif choice == 'S' and projects:
            # Sélectionner un projet existant
            print("\nSélectionnez un projet :")
            try:
                selection = int(input(f"Numéro [1-{len(projects)}] : ").strip())
                if 1 <= selection <= len(projects):
                    project_name = projects[selection - 1]
                    project_path = self.select_project(project_name)
                    self.set_current_project(project_name)
                    print(f"\n✅ Projet '{project_name}' sélectionné")
                    return project_path
                else:
                    print("❌ Numéro invalide")
                    return self.prompt_project_selection()
            except (ValueError, IndexError):
                print("❌ Entrée invalide")
                return self.prompt_project_selection()
        else:
            print("❌ Choix invalide")
            return self.prompt_project_selection()
