from __future__ import annotations
from typing import Iterable

from .downloader import Downloader
from .filing import Filing
from .index import Index
from .query import Query

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

    TODO: Make the query actually matter
    """

    _downloader: Downloader

    _index: Index

    _query: Query

    def __init__(
        self, downloader: Downloader, index: Index, query: Query,
    ):
        self._downloader = downloader
        self._index = index
        self._query = query

    def __iter__(self) -> Iterable[Filing]:
        for record in self._index:
            xmlFile = self._downloader.fetch(record.object_id)
            yield Filing(xmlFile)

    def skip(self, n: int) -> Result:
        pass

    def take(self, n: int) -> Result:
        pass


def fetch(downloader: Downloader, index: Index, query: Query,) -> Result:
    return Result(downloader, index, query)
