from typing import Callable, TypeVar


FilterT = TypeVar("FilterT")
FilterCallback = Callable[[FilterT], bool]
