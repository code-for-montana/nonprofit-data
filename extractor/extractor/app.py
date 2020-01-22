import json
from .cache import DirectoryCache, MemoryCache
from .downloader import AWS_TEMPLATE, HTTPDownloader
from .filters import filter_filings, filter_index_record
from .index import Index, IndexRecord
from .result import Result
from ._options import Options


# TODO: Split output methods into their own module (JSON, human-readable)


def run(options: Options):
    index = Index(open("fixtures/index.csv", "r"))
    if len(options.index_filters) > 0:
        index = index.filter(filter_index_record(options.index_filters))

    result = Result(HTTPDownloader(AWS_TEMPLATE, DirectoryCache()), index,)
    if len(options.filing_filters) > 0:
        result = result.filter(filter_filings(options.filing_filters))

    formatter = options.formatter
    formatter.prologue()
    formatter.write_all(result)
    formatter.epilogue()

