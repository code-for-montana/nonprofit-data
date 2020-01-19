from __future__ import annotations
from argparse import ArgumentParser, Namespace
from typing import NamedTuple


parser = ArgumentParser(
    prog="extractor",
    description="A utility to extract and serialize IRS 990 data.",
    epilog="A project of Code for Montana.",
)

parser.add_argument(
    "--version", "-v", action="version", version="0.0.1",
)

parser.add_argument(
    "--to-json",
    action="store_true",
    default=False,
    help="Output extracted data to JSON",
)


class Options(NamedTuple):
    @staticmethod
    def from_args(args: Namespace) -> Options:
        return Options(to_json=args.to_json,)

    to_json: bool
