import json
from pathlib import Path
from typing import List, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer


class SemanticSearch:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2") -> None:
        self.model_name = model_name
        self._model = None

    @property
    def model(self) -> SentenceTransformer:
        if self._model is None:
            self._model = SentenceTransformer(self.model_name)
        return self._model

    def indexing(
        self,
        list_of_chunks: List[str],
        processed_data: List[Dict[str, Any]],
        output_dir: str = "data/processed",
    ) -> None:
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)

        print(f"Generating embeddings for {len(list_of_chunks)} chunks...")
        embeddings = self.model.encode(
            list_of_chunks,
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

        np.save(out_path / "semantic_embeddings.npy", embeddings)

        meta_file = out_path / "minimal_source.json"
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)

        print(f"Semantic index saved under {output_dir}/")

    def retrieving(
        self,
        query: str,
        k: int = 10,
        index_dir: str = "data/processed",
    ) -> List[int]:
        emb_path = Path(index_dir) / "semantic_embeddings.npy"
        if not emb_path.exists():
            raise FileNotFoundError(
                "Semantic index not found. Run 'index_semantic' first."
            )

        corpus_embeddings = np.load(emb_path)

        query_embedding = self.model.encode(
            query,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )

        scores = np.dot(corpus_embeddings, query_embedding)

        top_k_indices = np.argsort(scores)[::-1][:k]
        return top_k_indices.tolist()