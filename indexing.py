from pathlib import Path
from pydantic import BaseModel
import json

from langchain_text_splitters import RecursiveCharacterTextSplitter

from default_inputs import RAW_DATA_PATH, MAX_CHUNK_SIZE, OUTPUT_CHUNKS_PATH


class PathContent(BaseModel):
    suffix: str
    content: str


# ======================================================================================

def read_the_repo(raw_data_path: str) -> list[str]:

    p: Path = Path(raw_data_path)
    # --------------------------------------------------------------------------
    lst_contents: list[PathContent] = []
    for i in p.rglob("*"):
        if not i.is_file() or i.suffix not in [".md", ".txt"]:
            continue
        try:
            content: str = i.read_text()
        except (FileNotFoundError, IsADirectoryError, OSError, Exception) as e:
            print(f"Error on {i.__str__()}:", e)
            continue
        lst_contents.append(
                                PathContent(
                                            suffix=i.suffix,
                                            content=content
                                           )
                           )
    # ------------------
    return lst_contents


# ======================================================================================

def chunking(
                data: list[PathContent],
                max_chunk_size=MAX_CHUNK_SIZE
            ) -> list[str]:

    lst_chunks: list[str] = []
    for i in data:
        content: str = i.content
        # --------------------------------------------------------------------
        s = RecursiveCharacterTextSplitter(
                                        chunk_size=max_chunk_size,
                                        chunk_overlap=max_chunk_size*15//100,
                                        add_start_index=True
                                          )
        # ---------------------------------
        chunks: list[str] = s.split_text(content)
        lst_chunks.extend(chunks)
    # ----------------
    return lst_chunks


# ======================================================================================

def save_chunks_into_json(
                            lst_chunks: list[str],
                            output_chunks_path: str = OUTPUT_CHUNKS_PATH
                         ) -> None:

    p: Path = Path(output_chunks_path)
    p.parent.mkdir(parents=True, exist_ok=True)

    with open(output_chunks_path, "w") as f:
        json.dump(lst_chunks, f, indent=3)


# ======================================================================================

def indexing(
                raw_data_path: str = RAW_DATA_PATH,
                max_chunk_size: int = MAX_CHUNK_SIZE,
                output_chunks_path: str = OUTPUT_CHUNKS_PATH
            ) -> None:

    data: list[PathContent] = read_the_repo(raw_data_path)
    # ----------------------------------------------------
    lst_chunks: list[str] = chunking(data, max_chunk_size)
    # ---------------------------------------------------
    save_chunks_into_json(lst_chunks, output_chunks_path)


if __name__ == "__main__":

    # ------------------------------------------------------------
    raw_data_path: str = "/home/ybajdou/hackaton/raw_data"
    max_chunk_size: int = 2000
    output_chunks_path: str = "/home/ybajdou/hackaton/chunks.json"
    # ---------------------------------------------------------
    indexing(raw_data_path, max_chunk_size, output_chunks_path)
