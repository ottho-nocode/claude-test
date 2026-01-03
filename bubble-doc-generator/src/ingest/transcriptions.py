"""
Loader pour les transcriptions de réunions clients
"""

import shutil
from pathlib import Path
from typing import List, Dict


class TranscriptionLoader:
    """Charge et gère les transcriptions de réunions"""

    def __init__(self, transcriptions_dir: Path):
        self.transcriptions_dir = Path(transcriptions_dir)
        self.transcriptions_dir.mkdir(parents=True, exist_ok=True)

    def import_from_directory(self, source_dir: str) -> int:
        """
        Importe toutes les transcriptions markdown depuis un dossier source

        Args:
            source_dir: Chemin vers le dossier contenant les fichiers .md

        Returns:
            Nombre de fichiers importés
        """
        source_path = Path(source_dir)
        if not source_path.exists():
            raise FileNotFoundError(f"Le dossier {source_dir} n'existe pas")

        md_files = list(source_path.glob("*.md"))
        count = 0

        for md_file in md_files:
            # Copier le fichier
            destination = self.transcriptions_dir / md_file.name
            shutil.copy2(md_file, destination)
            count += 1
            print(f"  ✓ Importé: {md_file.name}")

        return count

    def load_all_transcriptions(self) -> List[Dict[str, str]]:
        """
        Charge toutes les transcriptions disponibles

        Returns:
            Liste de dictionnaires avec 'filename', 'content' et 'metadata'
        """
        transcriptions = []

        for md_file in self.transcriptions_dir.glob("*.md"):
            # Ignorer les README
            if md_file.name.lower() in ["readme.md", "example-transcription.md"]:
                continue

            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()

            transcriptions.append({
                "filename": md_file.name,
                "content": content,
                "metadata": self._extract_metadata(content)
            })

        return transcriptions

    def _extract_metadata(self, content: str) -> Dict[str, str]:
        """Extrait les métadonnées d'une transcription (titre, date, etc.)"""
        lines = content.split("\n")
        metadata = {}

        # Extraire le titre (première ligne # Titre)
        for line in lines:
            if line.startswith("# "):
                metadata["title"] = line[2:].strip()
                break

        # Extraire la date de réunion
        for line in lines:
            if "Meeting Date:" in line:
                metadata["meeting_date"] = line.split("Meeting Date:")[1].strip()
                break

        return metadata
