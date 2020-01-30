from __future__ import annotations

from typing import Any, Dict, Iterable, Iterator

from .downloader import Downloader
from .filing import Filing
from .index import Index
from .querier import Querier
from .types import FilterCallback


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
        self._filters = filters
        self._index = index

    def __iter__(self) -> Iterator[Filing]:
        for record in self._index:
            xmlFile = self._downloader.fetch(record.object_id)
            querier = Querier.from_file(xmlFile)
            filing = Filing(querier)
            passed = True
            for cb in self._filters:
                if not cb(filing):
                    passed = False
                    break
            if passed:
                yield filing

    def filter(self, cb: FilterCallback[Filing],) -> Result:
        """
        Apply a filter to the returned filings. Filings that don't pass the
        given function will not be yielded by the result.
        """
        return Result(
            self._downloader, self._index, list(self._filters) + [cb],
        )

    def skip(self, n: int) -> Result:
        """
        Return a result that is identical to this one but doesn't contain the
        first `n` results.
        """
        # TODO: Implement me

    def take(self, n: int) -> Result:
        """
        Return a result that is identical to this one but contains only the
        first `n` results.
        """
        # TODO: Implement me

    def to_json(self) -> Dict[str, Any]:
        """
        Convert the result into JSON suitable for use as data for modules.

        TODO: Think about additional metadata we might want
        """
        return {
            "filings": [f.to_json() for f in self],
        }
