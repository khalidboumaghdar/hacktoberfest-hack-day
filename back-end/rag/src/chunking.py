from abc import ABC, abstractmethod
from pathlib import Path
import math
from typing import Dict, Any, List, Union

from langchain_text_splitters import (
    CharacterTextSplitter,
    Language,
    MarkdownTextSplitter,
    RecursiveCharacterTextSplitter,
)

class Chunker(ABC):
    processed_data: List[Dict] = []
    list_of_chunks: List[str] = []

    @abstractmethod
    def chunk(self, path: Path, max_chunk_size: int = 2000) -> None:
        """Split a file into chunks."""

    def _format_data(
        self,
        path: Path,
        splitter: Union[
            RecursiveCharacterTextSplitter,
            MarkdownTextSplitter,
            CharacterTextSplitter
            ]
    ) -> None:
        """Store chunk content and character positions."""

        chunks = splitter.create_documents(
            [path.read_text(encoding="utf-8")]
        )

        for chunk in chunks:
            start = chunk.metadata["start_index"]
            content = chunk.page_content
            data = {
                "file_path": str(path),
                "first_character_index": start,
                "last_character_index": start + len(content),
                "content": content
            }
            self.update_data(data, content)


    @classmethod
    def get_processed_data(cls) -> List[Dict]:
        return (cls.processed_data)

    @classmethod
    def get_list_of_chunks(cls) -> List[Dict]:
        return (cls.list_of_chunks)


    @classmethod
    def update_data(cls, data: Dict[str, Any], content: str) -> None:
        cls.processed_data.append(data)
        cls.list_of_chunks.append(content)

class TextChunker(Chunker):
    def chunk(self, path: Path, max_chunk_size: int = 2000) -> None:
        """Chunk a text file while preserving separators."""
        # we nned keep_separator here because in 
        # CharacterTextSplitter it is set to false 
        # and this lead to CharacterTextSplitter 
        # Striping out the exact character sequence
        # we split unlike the other two
        splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=max_chunk_size,
            chunk_overlap=0,
            keep_separator=True,
            add_start_index=True,
        )

        self._format_data(path, splitter)


class MarkdownChunker(Chunker):
    def chunk(self, path: Path, max_chunk_size: int = 2000) -> None:
        """Chunk a Markdown file."""
        splitter = MarkdownTextSplitter(
            chunk_size=max_chunk_size,
            chunk_overlap=0,
            add_start_index=True,
        )

        self._format_data(path, splitter)


if __name__ == "__main__":
    from .file_scanner import FileScanner
    scanner = FileScanner("data/raw/vllm-0.10.1")

    results = scanner.scan()
    extention = {
        ".py" : PythonChunker(),
        ".txt" : TextChunker(),
        ".md" : MarkdownChunker(),
    }

    for ext, files in scanner.files_by_extension.items():
        for file in files:
            extention[ext].chunk(file)

    processed_data = extention[".py"].processed_data
    import json

    json_string = json.dumps(processed_data, indent=4)

    print(json_string)
