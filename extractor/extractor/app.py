from ._options import Options
from .constants import AWS_FILING_TEMPLATE, AWS_INDEX_TEMPLATE
from .downloader import HTTPDownloader
from .filters import filter_filings, filter_index_record
from .index import Index
from .result import Result

# TODO: Split output methods into their own module (JSON, human-readable)


def run(options: Options):
    index_downloader = HTTPDownloader(AWS_INDEX_TEMPLATE, options.index_cache,)
    index = Index.from_years(options.years, index_downloader)
    if len(options.index_filters) > 0:
        index = index.filter(filter_index_record(options.index_filters))

    filing_downloader = HTTPDownloader(
        AWS_FILING_TEMPLATE, options.filing_cache,
    )
    result = Result(filing_downloader, index,)
    if len(options.filing_filters) > 0:
        result = result.filter(filter_filings(options.filing_filters))

    formatter = options.formatter
    formatter.prologue()
    formatter.write_all(result)
    formatter.epilogue()
