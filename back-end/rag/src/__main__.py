from .file_scanner import FileScanner
from .file_manager import FileManager
from .chunking import TextChunker, MarkdownChunker
from .data_model import MinimalSource
from .bm25 import bm25
from .semantic_search import SemanticSearch  # <--- زدناها هنا
from .helpers import validate_number
from .answer_generation import answer_generator

from tqdm import tqdm
import fire


class CLI:
    def __init__(self):
        self.bm25 = bm25()
        self.semantic = SemanticSearch()  # <--- instance ديال semantic search
        self.scanner = FileScanner()
        self.file_manager = FileManager()

    def _chunk_corpus(self, max_chunk_size: int = 2000):
        """Helper باش ما نعودوش نفس كود الـ chunking فـ BM25 و Semantic."""
        validate_number(2000, max_chunk_size)
        meta_data, files_by_extension = self.scanner.scan("data/raw/vllm-0.10.1")
        extension = {
            ".txt": TextChunker(),
            ".md": MarkdownChunker(),
        }
        pbar_chunk = tqdm(total=meta_data["chunked_files"], desc="Chunking: ")
        for ext, files in files_by_extension.items():
            for file in files:
                extension[ext].chunk(file, max_chunk_size)
                pbar_chunk.update(1)
        pbar_chunk.close()

        chunker_obj = extension[".md"]
        processed_data = chunker_obj.get_processed_data()
        for data in processed_data:
            MinimalSource(**data)
        return chunker_obj.list_of_chunks, processed_data

    # --- BM25 Commands ---
    def index(self, max_chunk_size: int = 2000) -> None:
        chunks, processed_data = self._chunk_corpus(max_chunk_size)
        self.bm25.indexing(chunks, processed_data)

    def search(self, query: str, k: int = 10) -> list[str]:
        processed_data = self.scanner.read("data/processed/minimal_source.json")
        validate_number(len(processed_data), k)
        results = self.bm25.retreaving(query, k)
        minimal_source = [processed_data[element["id"]] for element in results[0]]
        return [
            f"{el['file_path']} [{el['first_character_index']}:{el['last_character_index']}]"
            for el in minimal_source
        ]

    # --- Semantic Search Commands ---
    def index_semantic(self, max_chunk_size: int = 2000) -> None:
        """صاوب الـ embeddings لجميع الـ chunks وخزنهم."""
        chunks, processed_data = self._chunk_corpus(max_chunk_size)
        self.semantic.indexing(chunks, processed_data)

    def search_semantic(self, query: str, k: int = 10) -> list[str]:
        """بحث دلالي (Semantic Search) كيرجع البلايص ديال الـ chunks المناسبة."""
        processed_data = self.scanner.read("data/processed/minimal_source.json")
        validate_number(len(processed_data), k)

        top_indices = self.semantic.retrieving(query, k)
        minimal_source = [processed_data[i] for i in top_indices]

        return [
            f"{el['file_path']} [{el['first_character_index']}:{el['last_character_index']}]"
            for el in minimal_source
        ]

    def answer_semantic(self, query: str, k: int = 10) -> str:
        """RAG كامل بالـ Semantic Search."""
        processed_data = self.scanner.read("data/processed/minimal_source.json")
        validate_number(len(processed_data), k)

        top_indices = self.semantic.retrieving(query, k)
        minimal_source = [processed_data[i] for i in top_indices]
        content = self.scanner.resolve_contents(minimal_source)
        return answer_generator(query, content)


def main() -> None:
    fire.Fire(CLI)


if __name__ == "__main__":
    main()
