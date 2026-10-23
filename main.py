import fire

from indexing import indexing


def main():

    fire.Fire({"indexing": indexing})


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(e)
