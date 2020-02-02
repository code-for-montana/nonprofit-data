from ._options import Options
from .annual_record import AnnualYear, get_annual_index
from .bmf_record import BMFRegion, get_bmf_index
from .constants import AWS_FILING_TEMPLATE, AWS_INDEX_TEMPLATE, IRS_BMF_TEMPLATE
from .downloader import HTTPDownloader
from .filters import filter_filings, filter_index_record
from .formatter import Formatter
from .index import Index
from .result import Result

# TODO: Split output methods into their own module (JSON, human-readable)


LIMIT_BEFORE_CONFIRM = 100
"""
If more than this number of documents will be downloaded, interactively
confirm before starting unless the --no-confirm flag was passed.
"""


def _confirm(
    download_count: int, cache_count: int, formatter: Formatter
) -> bool:
    # TODO: Give the formatter a crack at the prompt message
    total_count = download_count + cache_count
    raw = input(
        f"This will download ${download_count} documents "
        + f"and process ${total_count} total documents, "
        + "continue? [yN] "
    )
    return raw.strip().lower().startswith("y")


def run(options: Options):
    annual_downloader = HTTPDownloader(AWS_INDEX_TEMPLATE, options.index_cache,)
    bmf_downloader = HTTPDownloader(IRS_BMF_TEMPLATE, options.index_cache,)

    index = Index()
    index.add_annual_index(
        get_annual_index(AnnualYear(2018), annual_downloader)
    )
    index.add_bmf_index(get_bmf_index(BMFRegion("mt"), bmf_downloader))

    if len(options.index_filters) > 0:
        index.add_filter(filter_index_record(options.index_filters))

    filing_downloader = HTTPDownloader(
        AWS_FILING_TEMPLATE, options.filing_cache,
    )
    result = Result(filing_downloader, index,)
    if len(options.filing_filters) > 0:
        result = result.filter(filter_filings(options.filing_filters))

    formatter = options.formatter
    download_count = result.download_count()

    if options.dry_run:
        # TODO: Have it check the cache and adjust downloads, proces separately
        # TODO: Formatter should get a chance to modify / format messages
        print(f"This would download ${download_count} documents")
        return

    if not options.no_confirm and download_count > LIMIT_BEFORE_CONFIRM:
        if not _confirm(download_count, 0, formatter):
            # TODO: Use the formatter for this output
            print("Aborting")
            return

    formatter.prologue()
    formatter.write_all(result)
    formatter.epilogue()
