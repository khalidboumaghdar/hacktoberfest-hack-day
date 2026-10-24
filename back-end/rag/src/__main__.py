from .file_scanner import FileScanner
from .file_manager import FileManager
from .chunking import TextChunker, PythonChunker, MarkdownChunker
from .data_model import MinimalSource, StudentSearchResults, RagDataset, StudentSearchResultsAndAnswer
from .bm25 import bm25
from .helpers import validate_number
from .answer_generation import answer_generator

from pydantic import ValidationError
from time import sleep
from tqdm import tqdm
import fire
from json import JSONDecodeError, dump


import numpy as np

# the animation show 31591.02it/s, 31595 chunk/s i must
# remove the 31591.02it/s and leave only 31595 chunk/s
# should i handle the part if the data/processed/minimal_source.json has no conten because now content is required
class CLI:
    def __init__(self):
        self.bm25 = bm25()
        self.scanner = FileScanner()
        self.file_manager = FileManager()

    def index(self, max_chunk_size: int = 2000) -> None:
        validate_number(2000, max_chunk_size)
        meta_data, files_by_extension = self.scanner.scan("data/raw/vllm-0.10.1")
        extention = {
            ".py" : PythonChunker(),
            ".txt" : TextChunker(),
            ".md" : MarkdownChunker(),
        }
        pbar_chunk = tqdm(total=meta_data["chunked_files"], desc="Chunking: ")
        for ext, files in files_by_extension.items():
            for file in files:
                extention[ext].chunk(file, max_chunk_size)
                pbar_chunk.update(1)
                #the issue is that {rate} is None when the progress bar starts
                # (before any items are processed), and you can't format None with .0f
                if pbar_chunk.n > 0:
                    rate = pbar_chunk.n / pbar_chunk.format_dict['elapsed']
                    pbar_chunk.set_postfix_str(f"{int(rate)} file/s")
        pbar_chunk.close()
        
        chunker_obj = extention[".py"]
        processed_data = chunker_obj.get_processed_data()
        for data in processed_data:
            MinimalSource(**data)
        self.bm25.indexing(chunker_obj.list_of_chunks, processed_data)

    def __retreival_wrapper(self, query: str, k: int) -> list[dict]:
        processed_data = self.scanner.read("data/processed/minimal_source.json")
        data_len = len(processed_data)
        validate_number(data_len, k)
        results  = self.bm25.retreaving(query, k)
        return [processed_data[element["id"]] for element in results[0]]

    def search(self, query: str , k: int = 10) -> None:
        minimal_source =  self.__retreival_wrapper(query, k)
        source = [f"{element['file_path']} [{element['first_character_index'] }:{element['last_character_index'] }]" for element in minimal_source]
        return source

    def answer(self, query: str , k: int = 10):
        minimal_source =  self.__retreival_wrapper(query, k)
        content = self.scanner.resolve_contents(minimal_source)
        return answer_generator(query, content)
        
        # print(content)




def main() -> None:
    fire.Fire(CLI)
    # try:
    #     fire.Fire(CLI)
    # except KeyboardInterrupt:
    #     print("\nCtrl+C detected! Exiting gracefully...")
    # except JSONDecodeError as e:
    #     print(f"\nFailed to decode JSON: {e.msg}")
    #     print(f"\nError happened at line {e.lineno}, column {e.colno}")
    # except KeyError as e:
    #     print(f"\nmissing key: {e}")
    # except ValidationError as e:
    #     for error in e.errors():
    #         field = " -> ".join(str(loc) for loc in error["loc"])
    #         print(f"\nError in '{field}': {error['msg']} (Received: {error.get('input')})")
    # except ValueError as e:
    #     print(f"\nThe exception message is: {e}")
    # except FileNotFoundError as error:
    #     print(error)
    # except PermissionError as error:
    #     print(f"\nPermission denied: {error}")
    # except OSError as error:
    #     print(f"\nFilesystem error: {error}")
    # except Exception as e:
    #         print(f"unknown error: {e}")


if __name__ == "__main__":
    main()