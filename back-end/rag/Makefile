PYTHON = python
UV = uv



all: index

install:
	$(PYTHON) -m pip install $(MODULE)

index:
	${UV} run $(PYTHON) -m src index --max_chunk_size 1000

run:
	${UV} run $(PYTHON) -m src index --max_chunk_size 2000

debug:
	${UV} run $(PYTHON) -m src pdb index --max_chunk_size 2000

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +

lint:
	flake8 .
	mypy . \
		--warn-return-any \
		--warn-unused-ignores \
		--ignore-missing-imports \
		--disallow-untyped-defs \
		--check-untyped-defs

lint-strict:
	flake8 .
	mypy . --strict

.PHONY: all install run debug clean lint lint-strict