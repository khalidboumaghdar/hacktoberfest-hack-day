"""Corpus scanning and JSON / text reading helpers."""
import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Tuple


class FileScanner:
    """Scan the corpus, read JSON files and rebuild chunk text."""

    def __init__(self) -> None:
        """Prepare the extension table filled by scan()."""
        self.files_by_extension: Dict[str, List[Path]] = {
            ".md": [],
            ".txt": [],
        }

    def __check_dir_exist(self, root_dir: str) -> Path:
        """Return the directory as a Path or raise FileNotFoundError."""
        path = Path(root_dir)
        if not path.exists():
            raise FileNotFoundError(
                f"The directory {root_dir} does not exist."
            )
        return path

    def __check_file_exist(self, path: Path) -> None:
        """Raise FileNotFoundError when the file does not exist."""
        if not path.exists():
            raise FileNotFoundError(f"The file {path} does not exist.")

    def scan(
        self, root_dir: str
    ) -> Tuple[Dict[str, int], Dict[str, List[Path]]]:
        """Recursively scan the root directory and sort target files."""
        directory = self.__check_dir_exist(root_dir)
        meta_data = {"files_count": 0, "chunked_files": 0}
        for path in directory.rglob("*"):
            if path.is_file():
                meta_data["files_count"] += 1
                if path.suffix in self.files_by_extension:
                    self.files_by_extension[path.suffix].append(path)
        meta_data["chunked_files"] = sum(
            len(v) for v in self.files_by_extension.values()
        )
        return meta_data, self.files_by_extension

    def read(self, file_path: str) -> Any:
        """Read and parse a JSON file."""
        path = Path(file_path)
        self.__check_file_exist(path)
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)

    @staticmethod
    @lru_cache(maxsize=128)
    def _read_text(file_path: str) -> str:
        """Read a corpus file exactly like the chunkers did, with a cache.

        read_text() with its default newline handling is required: the
        indices stored at indexing time were computed on that text.
        """
        return Path(file_path).read_text(encoding="utf-8")

    def read_span(self, file_path: str, first: int, last: int) -> str:
        """Return the text between two character indices (end exclusive)."""
        self.__check_file_exist(Path(file_path))
        text = self._read_text(file_path)
        if first < 0 or first > last or last > len(text):
            raise ValueError(
                f"Span [{first}:{last}] is outside {file_path} "
                f"(length {len(text)})"
            )
        return text[first:last]

    def resolve_contents(self, sources: List[Dict[str, Any]]) -> List[str]:
        """Return each source text, read from its file when content is None.

        The sources are not modified, so the saved output keeps the exact
        shape the search stage produced.
        """
        contents: List[str] = []
        for source in sources:
            text = source.get("content")
            if text is None:
                text = self.read_span(
                    source["file_path"],
                    source["first_character_index"],
                    source["last_character_index"],
                )
            contents.append(text)
        return contents