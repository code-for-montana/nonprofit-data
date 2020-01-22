from typing import Callable, TypeVar


FilterT = TypeVar("FilterT")


FilterCallback = Callable[[FilterT], bool]
"""
A callback used to filter collections of data. Takes a thing and returns a
boolean that indicates whether the thing should be retained (`True`) or
dropped (`False`).
"""

