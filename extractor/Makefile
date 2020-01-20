help:
	@echo analyze - run the type checker
	@echo check   - run tests
	@echo format  - format the code

analyze:
	mypy .

check:
	pytest

format:
	black -t py38 -l 80 .
