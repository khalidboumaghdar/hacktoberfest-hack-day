import bm25s
from typing import List
import json
from tqdm.auto import tqdm

class bm25:

    def indexing(self, list_of_chunks: List[str], processed_data) -> None:
        custom_pbar = tqdm(
            list_of_chunks,
            desc="Tokenizing ",
            dynamic_ncols=True,                  
            leave=True,
            unit=" chunk"
        )
        corpus_tokens = bm25s.tokenize(custom_pbar, show_progress=False)
        retriever = bm25s.BM25()
        retriever.index(corpus_tokens)

        retriever.save("data/processed/bm25_index", corpus=list_of_chunks)

        with open("data/processed/minimal_source.json", "w", encoding="utf-8") as f:
            json.dump(processed_data, f, ensure_ascii=False, indent=2)
        print(f"Ingestion complete! complete {len(processed_data)} chunks under data/processed/")

    def retreaving(self, query: str, k: int) -> None:
        retriever = bm25s.BM25.load("data/processed/bm25_index", load_corpus=True)
        query_tokens = bm25s.tokenize(query)
        results = retriever.retrieve(query_tokens, k=k)[0]
        # print(results)
        return results
