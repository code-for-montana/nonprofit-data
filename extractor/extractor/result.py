from __future__ import annotations
from typing import Callable, Iterable, Iterator, Optional, NamedTuple

from .downloader import Downloader
from .filing import Filing
from .index import Index
from .types import FilterCallback

# Result is the thing you interact with to generate
# Filings, but we'll provide some standalone functions
# directly on the package (like requests) that can
# take keyword arguments or use sensible defaults to
# make it easy to use in a notebook environment or
# whatever.

# The query will be what we generate code for so that
# it has all the things someone might want to extract
# or filter on as semantic fields / properties, plus
# we can have it support some generic mechanisms like
# naive xpath or a predicate callback.

# OK, but the Filing also needs code gen so that it
# has the right fields, plus some kind of string key
# lookup to augment.


class Result:
    """
    A lazily-evaluated query result based on the given index and downloader.

    The result can be filtered by providing a callback to the `Result.filter`
    method. This will return a new, independent `Result` that will apply all
    filters already applied by the previous `Result`, plus the one that was
    provided to the method.
    """

    _downloader: Downloader

    _filters: Iterable[FilterCallback[Filing]]

    _index: Index

    def __init__(
        self,
        downloader: Downloader,
        index: Index,
        filters: Iterable[FilterCallback[Filing]] = (),
    ):
        self._downloader = downloader
        self._index = index

    def __iter__(self) -> Iterator[Filing]:
        for record in self._index:
            xmlFile = self._downloader.fetch(record.object_id)
            filing = Filing(xmlFile)
            passed = True
            for cb in self._filters:
                if not cb(filing):
                    passed = False
                    break
            if passed:
                yield filing

    def filter(self, cb: FilterCallback[Filing],) -> Result:
        return Result(
            self._downloader, self._index, list(self._filters) + [cb],
        )

    def skip(self, n: int) -> Result:
        pass

    def take(self, n: int) -> Result:
        pass
