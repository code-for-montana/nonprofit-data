import re
from typing import Mapping
from .filing import Filing
from .index import IndexRecord
from .types import FilterCallback


class FieldNotFound(Exception):
    name: str

    def __init__(self, name: str):
        self.name = name


def filter_filings(filters: Mapping[str, str]) -> FilterCallback[Filing]:
    def _filter(filing: Filing) -> bool:
        passed = True
        for fieldName in filters:
            filterText = filters[fieldName]
            if not hasattr(filing, fieldName):
                raise FieldNotFound(fieldName)
            value = getattr(filing, fieldName)
            if value is None:
                return False
            match = re.match(filterText, str(value))
            if match is None:
                passed = False
                break
        return passed

    return _filter


def filter_index_record(
    filters: Mapping[str, str]
) -> FilterCallback[IndexRecord]:
    def _filter(record: IndexRecord) -> bool:
        passed = True
        for fieldName in filters:
            filterText = filters[fieldName]
            if not hasattr(record, fieldName):
                raise FieldNotFound(fieldName)
            value = getattr(record, fieldName)
            if value is None:
                return False
            match = re.match(filterText, str(value))
            if match is None:
                passed = False
                break
        return passed

    return _filter


def match_filing(field: str, needle: str) -> FilterCallback[Filing]:
    pass


def match_index_record(field: str, needle: str) -> FilterCallback[IndexRecord]:
    def filter(record: IndexRecord) -> bool:
        if not field in record.__dict__:
            raise FieldNotFound(field)
        value = record.__dict__[field]
        if value is None:
            return False
        match = re.match(needle, str(value))
        return match is not None

    return filter
