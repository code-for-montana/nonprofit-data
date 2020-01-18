from __future__ import annotations
import csv
from typing import Callable, Iterable, Iterator, List, NamedTuple, TextIO
from .types import FilterCallback, FilterT


class IndexRecord(NamedTuple):
    """
    A single index record that can be selected and used to fetch an XML
    filing.

    TODO: Add useful descriptions to each field
    """

    return_id: str
    filing_type: str
    ein: str
    tax_period: str
    sub_date: str
    taxpayer_name: str
    return_type: str
    dln: str
    object_id: str


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

    >>> index = Index(open('fixtures/index.csv', 'r'))
    >>> len(index._records)
    5
    >>> [r.return_id for r in index]
    ['16285381', '16279505', '16279502', '16279501', '16279248']
    """

    _filters: Iterable[FilterCallback[IndexRecord]]

    _records: Iterable[IndexRecord]

    def __init__(
        self,
        index_file: TextIO,
        filters: Iterable[FilterCallback[IndexRecord]] = (),
    ):
        records: List[IndexRecord] = []

        for row in csv.DictReader(index_file):
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

    def filter(self, cb: FilterCallback[IndexRecord]) -> Index:
        return FilteredIndex(self, cb)


class FilteredIndex(Index):
    def __init__(
        self, parent: Index, cb: FilterCallback[IndexRecord],
    ):
        self._filters = list(parent._filters) + [cb]

        # We share the list of records since it could be quite large. This
        # shouldn't prevent concurrent iteration since we ultimately delegate
        # to the list's iterator.
        self._records = parent._records
