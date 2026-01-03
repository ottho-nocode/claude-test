"""
Scraper pour la base de connaissance Bubble.io
"""

import time
from pathlib import Path
from typing import List
import requests
from bs4 import BeautifulSoup
import hashlib


class BubbleKnowledgeScraper:
    """Scrape les pages web de la documentation Bubble.io"""

    def __init__(self, urls_file: Path, output_dir: Path):
        self.urls_file = Path(urls_file)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def load_urls(self) -> List[str]:
        """Charge les URLs depuis le fichier de configuration"""
        urls = []

        if not self.urls_file.exists():
            print(f"⚠️  Fichier URLs non trouvé: {self.urls_file}")
            return urls

        with open(self.urls_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                # Ignorer les commentaires et lignes vides
                if line and not line.startswith("#"):
                    urls.append(line)

        return urls

    def scrape_all(self):
        """Scrape toutes les URLs configurées"""
        urls = self.load_urls()

        if not urls:
            print("⚠️  Aucune URL à scraper. Ajoutez des URLs dans data/knowledge-base/bubble-urls.txt")
            return

        print(f"📥 Scraping de {len(urls)} pages...")

        for i, url in enumerate(urls, 1):
            print(f"  [{i}/{len(urls)}] {url}")
            try:
                self.scrape_url(url)
                time.sleep(1)  # Politesse : ne pas surcharger le serveur
            except Exception as e:
                print(f"    ❌ Erreur: {e}")

    def scrape_url(self, url: str):
        """Scrape une URL et sauvegarde le contenu en markdown"""
        # Télécharger la page
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # Parser le HTML
        soup = BeautifulSoup(response.content, "html.parser")

        # Extraire le contenu principal (à adapter selon la structure des pages Bubble)
        # On retire les scripts, styles, etc.
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()

        # Extraire le texte
        text = soup.get_text()

        # Nettoyer le texte
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        clean_text = "\n".join(lines)

        # Créer un nom de fichier basé sur l'URL
        filename = self._url_to_filename(url)
        output_path = self.output_dir / filename

        # Sauvegarder
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"# Source: {url}\n\n")
            f.write(clean_text)

        print(f"    ✓ Sauvegardé: {filename}")

    def _url_to_filename(self, url: str) -> str:
        """Convertit une URL en nom de fichier"""
        # Créer un hash de l'URL pour un nom unique
        url_hash = hashlib.md5(url.encode()).hexdigest()[:8]

        # Extraire une partie lisible de l'URL
        path = url.split("//")[-1].replace("/", "-").replace(".", "-")

        # Limiter la longueur
        if len(path) > 50:
            path = path[:50]

        return f"{path}-{url_hash}.md"
