import json
from pathlib import Path
import os
from typing import Dict, List
from tqdm import tqdm


class FileManager:
    """A utility class to manage file/folder creation and JSON serialization."""

    @staticmethod
    def ensure_directory(file_path: str) -> None:
        """Extracts the directory from a file path and creates it if it doesn't exist."""
        directory = os.path.dirname(file_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)

    @classmethod
    def save_dict_to_json(
        cls,
        data: List[Dict],
        save_directory: str,
        file_path: str
    ) -> None:
        new_path = save_directory + "/" + Path(file_path).name
        cls.ensure_directory(new_path)
        with open(new_path, "w", encoding="utf-8") as json_file:
            with tqdm(total=len(data["search_results"]), desc=f"Saving to {file_path}") as pbar:
                json.dump(data, json_file, ensure_ascii=False, indent=4)
                pbar.update(len(data["search_results"]))
