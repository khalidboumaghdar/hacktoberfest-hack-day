run:
	uv run python main.py

index:
	uv run python main.py indexing

clean:
	rm -rf __pycache__
