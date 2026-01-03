"""
Système RAG pour la base de connaissance Bubble.io
"""

from pathlib import Path
from typing import List, Dict
import json

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document


class RAGSystem:
    """Système de Retrieval Augmented Generation"""

    def __init__(
        self,
        knowledge_dir: Path,
        transcriptions_dir: Path,
        embeddings_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    ):
        self.knowledge_dir = Path(knowledge_dir)
        self.transcriptions_dir = Path(transcriptions_dir)

        # Initialiser le modèle d'embeddings (local, gratuit)
        print("  🔄 Chargement du modèle d'embeddings...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=embeddings_model,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

        self.vectorstore = None

    def build_index(self):
        """Construit l'index vectoriel à partir des documents"""
        print("  📚 Chargement des documents...")

        # Charger tous les documents
        documents = []

        # 1. Charger la base de connaissance Bubble
        for md_file in self.knowledge_dir.glob("*.md"):
            if md_file.name.lower() != "readme.md":
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
                    documents.append(
                        Document(
                            page_content=content,
                            metadata={"source": md_file.name, "type": "knowledge"}
                        )
                    )

        # 2. Charger les transcriptions
        for md_file in self.transcriptions_dir.glob("*.md"):
            if md_file.name.lower() not in ["readme.md", "example-transcription.md"]:
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
                    documents.append(
                        Document(
                            page_content=content,
                            metadata={"source": md_file.name, "type": "transcription"}
                        )
                    )

        print(f"  ✓ {len(documents)} documents chargés")

        # Découper les documents en chunks
        print("  ✂️  Découpage des documents...")
        texts = self.text_splitter.split_documents(documents)
        print(f"  ✓ {len(texts)} chunks créés")

        # Créer le vectorstore
        print("  🧮 Création de l'index vectoriel...")
        self.vectorstore = FAISS.from_documents(texts, self.embeddings)
        print("  ✓ Index créé")

    def search(self, query: str, k: int = 5, filter_type: str = None) -> List[Document]:
        """
        Recherche sémantique dans la base de connaissance

        Args:
            query: Question ou texte de recherche
            k: Nombre de résultats à retourner
            filter_type: Filtrer par type ("knowledge" ou "transcription")

        Returns:
            Liste de documents pertinents
        """
        if not self.vectorstore:
            raise RuntimeError("L'index n'a pas été construit. Appelez build_index() d'abord.")

        # Recherche simple sans filtre
        results = self.vectorstore.similarity_search(query, k=k)

        # Filtrer par type si nécessaire
        if filter_type:
            results = [doc for doc in results if doc.metadata.get("type") == filter_type]

        return results

    def get_context_for_generation(
        self,
        query: str,
        include_knowledge: bool = True,
        include_transcriptions: bool = True,
        max_chunks: int = 5
    ) -> str:
        """
        Récupère le contexte pertinent pour la génération

        Returns:
            Contexte formaté en string
        """
        context_parts = []

        if include_transcriptions:
            # Récupérer les transcriptions
            trans_results = self.search(query, k=max_chunks, filter_type="transcription")
            if trans_results:
                context_parts.append("=== TRANSCRIPTIONS DES RÉUNIONS CLIENTS ===\n")
                for doc in trans_results:
                    context_parts.append(doc.page_content)
                    context_parts.append("\n---\n")

        if include_knowledge:
            # Récupérer la connaissance Bubble
            kb_results = self.search(query, k=max_chunks, filter_type="knowledge")
            if kb_results:
                context_parts.append("\n=== BASE DE CONNAISSANCE BUBBLE.IO ===\n")
                for doc in kb_results:
                    context_parts.append(doc.page_content)
                    context_parts.append("\n---\n")

        return "\n".join(context_parts)
