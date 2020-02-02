from __future__ import annotations

import dataclasses as dc
import json
from argparse import ArgumentParser, Namespace
from datetime import datetime
from typing import Any, Dict, Iterable, List, Mapping, NamedTuple

from .cache import Cache, DirectoryCache, MemoryCache
from .constants import (
    CURRENT_VERSION,
    DEFAULT_CACHE_PATH,
    PROGRAM_DESCRIPTION,
    PROGRAM_NAME,
)
from .filing import Filing
from .formatter import (
    FileFormatter,
    Formatter,
    get_formatter,
    registered_formatters,
)
from .index import IndexRecord

parser = ArgumentParser(
    prog=PROGRAM_NAME,
    description=PROGRAM_DESCRIPTION,
    epilog="A project of *Code for Montana*.",
)

parser.add_argument(
    "--version", "-v", action="version", version=CURRENT_VERSION,
)

parser.add_argument(
    "--cache-to-disk",
    action="store_true",
    default=False,
    help="Cache index and filing documents to disk",
)

parser.add_argument(
    "--cache-path",
    type=str,
    default=DEFAULT_CACHE_PATH,
    help="Path to use for reading and writing cache data",
)

parser.add_argument(
    "--dry-run",
    action="store_true",
    default=False,
    help="Just report how many documents would be downloaded",
)

parser.add_argument(
    "--load-filters",
    action="append",
    type=str,
    help="Read filters from a JSON file",
)

parser.add_argument(
    "--no-confirm",
    action="store_true",
    default=False,
    help="Do not interactively confirm large downloads, for shell scripts",
)

parser.add_argument(
    "--save-filters", type=str, help="Save the filters applied to a JSON file",
)

parser.add_argument(
    "--to-json",
    action="store_true",
    default=False,
    help="Output extracted data to JSON, equivalent to --formatter=json",
)

parser.add_argument(
    "--formatter",
    type=str,
    choices=registered_formatters(),
    default="file",
    help="Output formatter, use --destination to specify file name",
)

parser.add_argument(
    "--destination",
    type=str,
    default=":stdout:",
    help="File to which output should be written (or ':stdout:', ':stderr:')",
)

parser.add_argument(
    "--years",
    type=str,
    default=":current:",
    help="Years to search, comma-separated (':current:' is the current year)",
)

# -------------------- #
# Index record filters #
# -------------------- #

for indexFieldName in IndexRecord._fields:
    parser.add_argument(
        f"--{indexFieldName}",
        type=str,
        help=f"Apply a filter to the {indexFieldName} index field",
    )

# -------------- #
# Filing filters #
# -------------- #

for filingField in dc.fields(Filing):
    parser.add_argument(
        f"--{filingField.name}",
        type=str,
        help=f"Apply a filter to the {filingField.name} filing field",
    )


class Options(NamedTuple):
    @staticmethod
    def from_args(args: Namespace) -> Options:
        formatter = get_formatter(args.formatter, args.destination)
        if formatter is None:
            formatter = FileFormatter(args.destination)

        index_cache: Cache
        filing_cache: Cache
        if args.cache_to_disk:
            index_cache = DirectoryCache(".csv", args.cache_path)
            filing_cache = DirectoryCache(".xml", args.cache_path)
        else:
            index_cache = MemoryCache()
            filing_cache = MemoryCache()

        # Gather all the index filters
        index_filters: Dict[str, str] = {}
        for index_field_name in IndexRecord._fields:
            if hasattr(args, index_field_name):
                value = getattr(args, index_field_name)
                if value is not None:
                    index_filters[index_field_name] = value

        # Gather all the filing filters
        filing_filters: Dict[str, str] = {}
        for filing_field in dc.fields(Filing):
            name = filing_field.name
            if hasattr(args, name):
                value = getattr(args, name)
                if value is not None:
                    filing_filters[name] = value

        # Check for JSON files specifying filters
        if args.load_filters is not None:
            for filters_path in args.load_filters:
                with open(filters_path) as filters_file:
                    filters_data: Dict[str, Any] = json.load(filters_file)

                # JSON file has two top-level keys, "index" and "filing"

                index_data: Dict[str, str] = filters_data["index"]
                if index_data is not None:
                    index_filters.update(index_data)

                filing_data: Dict[str, str] = filters_data["filing"]
                if filing_data is not None:
                    filing_filters.update(filing_data)

        # Save filters if we need to do so
        if args.save_filters is not None:
            payload = {
                "index": index_filters,
                "filing": filing_filters,
            }
            with open(args.save_filters, "w") as saveFile:
                json.dump(payload, saveFile)

        # Figure out the years we want
        years: List[str] = []
        years_str = args.years.split(",")
        for year_str in years_str:
            if year_str == ":current:":
                years.append(str(datetime.today().year))
                continue
            years.append(year_str)

        return Options(
            dry_run=args.dry_run,
            formatter=formatter,
            filing_cache=filing_cache,
            index_cache=index_cache,
            no_confirm=args.no_confirm,
            filing_filters=filing_filters,
            index_filters=index_filters,
            to_json=args.to_json,
            years=years,
        )

    dry_run: bool

    formatter: Formatter

    filing_cache: Cache

    index_cache: Cache

    no_confirm: bool

    years: Iterable[str]

    filing_filters: Mapping[str, str] = {}

    index_filters: Mapping[str, str] = {}

    to_json: bool = False
