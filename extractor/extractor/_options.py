from __future__ import annotations
from argparse import ArgumentParser, Namespace
from dataclasses import dataclass, field, fields
import json
from typing import Any, Dict, Mapping, NamedTuple
from .filing import Filing
from .index import IndexRecord


# TODO: Add ability to filter on Filing fields
# TODO: Add ability to filter on Index fields
# TODO: Auto-populate Filing fields for the --help output
# TODO: Auto-populate Index fields for the --help output


parser = ArgumentParser(
    prog="extractor",
    description="A utility to extract and serialize IRS 990 data.",
    epilog="A project of Code for Montana.",
)

parser.add_argument(
    "--version", "-v", action="version", version="0.0.1",
)

parser.add_argument(
    "--load-filters",
    action="append",
    type=str,
    help="Read filters from a JSON file",
)

parser.add_argument(
    "--save-filters", type=str, help="Save the filters applies to a JSON file",
)

parser.add_argument(
    "--to-json",
    action="store_true",
    default=False,
    help="Output extracted data to JSON",
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

for filingField in fields(Filing):
    parser.add_argument(
        f"--{filingField.name}",
        type=str,
        help=f"Apply a filter to the {filingField.name} filing field",
    )


class Options(NamedTuple):
    @staticmethod
    def from_args(args: Namespace) -> Options:
        # Gather all the index filters
        indexFilters: Dict[str, str] = {}
        for indexFieldName in IndexRecord._fields:
            if hasattr(args, indexFieldName):
                value = getattr(args, indexFieldName)
                if value is not None:
                    indexFilters[indexFieldName] = value

        # Gather all the filing filters
        filingFilters: Dict[str, str] = {}
        for filingField in fields(Filing):
            name = filingField.name
            if hasattr(args, name):
                value = getattr(args, name)
                if value is not None:
                    filingFilters[name] = value

        # Check for JSON files specifying filters
        if args.load_filters is not None:
            for filtersPath in args.load_filters:
                with open(filtersPath) as filtersFile:
                    filtersData: Dict[str, Any] = json.load(filtersFile)

                # JSON file has two top-level keys, "index" and "filing"

                indexData: Dict[str, str] = filtersData["index"]
                if indexData is not None:
                    indexFilters.update(indexData)

                filingData: Dict[str, str] = filtersData["filing"]
                if filingData is not None:
                    filingFilters.update(filingData)

        # Save filters if we need to do so
        if args.save_filters is not None:
            payload = {
                "index": indexFilters,
                "filing": filingFilters,
            }
            with open(args.save_filters, "w") as saveFile:
                json.dump(payload, saveFile)

        return Options(
            filing_filters=filingFilters,
            index_filters=indexFilters,
            to_json=args.to_json,
        )

    filing_filters: Mapping[str, str] = {}

    index_filters: Mapping[str, str] = {}

    to_json: bool = False
