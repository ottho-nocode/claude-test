"""
Module de génération de documents

Contient les générateurs pour :
- User stories
- User flows (diagrammes Mermaid)
- Cahier des charges
- Prompts pour les écrans
- Designs Figma (via MCP)
"""

from .user_stories import UserStoriesGenerator
from .user_flows import UserFlowsGenerator
from .cahier_des_charges import CahierDesChargesGenerator
from .screens_prompts import ScreensPromptsGenerator
from .figma_designer import FigmaDesigner

__all__ = [
    "UserStoriesGenerator",
    "UserFlowsGenerator",
    "CahierDesChargesGenerator",
    "ScreensPromptsGenerator",
    "FigmaDesigner",
]
