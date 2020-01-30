from __future__ import annotations

import csv
from logging import getLogger
from typing import Iterable, Iterator, List, NamedTuple, TextIO

from .downloader import Downloader
from .types import FilterCallback

_logger = getLogger(__name__)


class IndexRecord(NamedTuple):
    """
    A single index record that can be selected and used to fetch an XML
    filing.

    TODO: Audit the descriptions for correctness and completeness
    """

    return_id: str
    """Unique identifier for the tax filing."""

    filing_type: str
    """Type of filing, for example: 'EFILE'."""

    ein: str
    """Tax ID number of the organization."""

    tax_period: str
    """TODO: Find out what this is, exactly."""

    sub_date: str
    """Date the filing was submitted to the IRS."""

    taxpayer_name: str
    """Name of the organization that submitted the filing."""

    return_type: str
    """Type of form that was submitted, for example: '990'."""

    dln: str
    """TODO: Figure out what this is"""

    object_id: str
    """The unique identifier for this filing, used to download data."""


class Index:
    """
    Map from whatever properties or field matches (like name)
    into an ID that can be used to download the XML file or
    fetch it from the cache.

    The index won't change often so we don't need to generate
    the fields.

    Fields, see `RecordIndex` for details:

      - RETURN_ID
      - FILING_TYPE
      - EIN
      - TAX_PERIOD
      - SUB_DATE
      - TAXPAYER_NAME
      - RETURN_TYPE
      - DLN
      - OBJECT_ID
    
    TODO: Implement true indices to improve lookup performance
    TODO: Add some kind of query interface once we have real indices

    >>> index = Index.from_file(open('fixtures/index.csv', 'r'))
    >>> len(list(index._records))
    5
    >>> [r.return_id for r in index]
    ['16285381', '16279505', '16279502', '16279501', '16279248']
    """

    @staticmethod
    def from_file(
        index_file: TextIO, filters: Iterable[FilterCallback[IndexRecord]] = (),
    ) -> Index:
        records = Index.records_from_file(index_file)
        return Index(records, filters)

    @staticmethod
    def from_years(
        years: Iterable[str],
        index_downloader: Downloader,
        filters: Iterable[FilterCallback[IndexRecord]] = (),
    ) -> Index:
        records: List[IndexRecord] = []
        for index_file in index_downloader.fetch_all(years):
            records.extend(Index.records_from_file(index_file))
        return Index(records, filters)

    @staticmethod
    def records_from_file(index_file: TextIO) -> Iterable[IndexRecord]:
        records: List[IndexRecord] = []
        for row in csv.DictReader(index_file):
            try:
                record = IndexRecord(
                    return_id=row["RETURN_ID"],
                    filing_type=row["FILING_TYPE"],
                    ein=row["EIN"],
                    tax_period=row["TAX_PERIOD"],
                    sub_date=row["SUB_DATE"],
                    taxpayer_name=row["TAXPAYER_NAME"],
                    return_type=row["RETURN_TYPE"],
                    dln=row["DLN"],
                    object_id=row["OBJECT_ID"],
                )
                records.append(record)
            except KeyError as e:
                _logger.error(f"malformed index row - '{e}' - '{row}'")
                raise

        return records

    _filters: Iterable[FilterCallback[IndexRecord]]

    _records: Iterable[IndexRecord]

    def __init__(
        self,
        records: Iterable[IndexRecord],
        filters: Iterable[FilterCallback[IndexRecord]] = (),
    ):
        self._filters = filters
        self._records = records

    def __iter__(self) -> Iterator[IndexRecord]:
        for record in self._records:
            passed = True
            for cb in self._filters:
                if not cb(record):
                    passed = False
                    break
            if passed:
                yield record

    def augment(self, other: Iterable[IndexRecord]) -> Index:
        return AugmentedIndex(self, other)

    def filter(self, cb: FilterCallback[IndexRecord]) -> Index:
        return FilteredIndex(self, cb)


class AugmentedIndex(Index):
    """
    An `Index` that can combine the records from several different indices
    into one logical index.

    TODO: Just hold the iterables and iterate them sequentially
    """

    def __init__(self, original: Index, others: Iterable[IndexRecord]):
        records = list(original._records) + list(others)
        super().__init__(records)


class FilteredIndex(Index):
    """
    An `Index` that can be created from a parent and filter rather than a
    file and collection of filters. This is what is actually returned from
    the `filter()` method.
    """

    def __init__(
        self, parent: Index, cb: FilterCallback[IndexRecord],
    ):
        filters = list(parent._filters) + [cb]

        # We share the list of records since it could be quite large. This
        # shouldn't prevent concurrent iteration since we ultimately delegate
        # to the list's iterator.
        records = parent._records

        super().__init__(records, filters)
