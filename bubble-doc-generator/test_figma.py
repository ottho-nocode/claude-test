#!/usr/bin/env python3
"""
Script de test pour la génération Figma via MCP
"""

import anthropic
import os
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv(Path(__file__).parent / ".env")

def test_figma_generation():
    """Test simple de création de fichier Figma"""

    print("\n" + "="*60)
    print("🧪 TEST DE GÉNÉRATION FIGMA VIA MCP")
    print("="*60)

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    # Prompt de test simple
    prompt = """Tu as accès aux outils MCP Figma.

OBJECTIF: Créer un fichier Figma de test et ajouter quelques éléments simples.

ÉTAPES:
1. Crée un nouveau fichier Figma nommé "TEST Bubble Generator"
2. Ajoute une page nommée "Test Page"
3. Crée une frame simple (1440x900) nommée "Screen Test"
4. Ajoute un rectangle de 200x100 de couleur #4F46E5
5. Ajoute un texte "Hello Bubble.io" en Helvetica 24px

Retourne ensuite:
- Le lien complet vers le fichier Figma
- L'ID du fichier
- La confirmation que tout a été créé

IMPORTANT: Utilise réellement les outils MCP Figma pour créer ces éléments."""

    print("\n🤖 Appel à Claude avec outils MCP Figma...")
    print("⏳ Création du fichier de test...\n")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extraire la réponse
        response = message.content[0].text

        print("="*60)
        print("✅ RÉSULTAT DE LA GÉNÉRATION")
        print("="*60)
        print(response)
        print("\n" + "="*60)

        # Sauvegarder le résultat
        output_file = Path(__file__).parent / "test-figma-result.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("# Test Figma MCP - Résultat\n\n")
            f.write(response)

        print(f"\n💾 Résultat sauvegardé dans: {output_file}")
        print("\n🔗 Vérifiez le lien Figma dans le résultat ci-dessus")

    except Exception as e:
        print(f"\n❌ ERREUR: {str(e)}")
        print("\n💡 Vérifiez que:")
        print("  - Le serveur MCP Figma est bien configuré (claude mcp list)")
        print("  - Vous êtes authentifié sur Figma")
        print("  - Votre clé API Claude est valide")

if __name__ == "__main__":
    test_figma_generation()
