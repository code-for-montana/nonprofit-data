import json
from .cache import DirectoryCache, MemoryCache
from .downloader import HTTPDownloader
from .filing import Filing
from .filters import filter_filings, filter_index_record
from .index import Index, IndexRecord
from .result import Result
from ._options import Options


def run(options: Options):
    index = Index(open("fixtures/index.csv", "r"))
    if len(options.index_filters) > 0:
        index = index.filter(filter_index_record(options.index_filters))

    result = Result(
        HTTPDownloader(
            "https://s3.amazonaws.com/irs-form-990", DirectoryCache()
        ),
        index,
    )
    if len(options.filing_filters) > 0:
        result = result.filter(filter_filings(options.filing_filters))

    if options.to_json:
        print(json.dumps(result.to_json()))
        return

    for filing in result:
        print("-----------------------------")
        print(filing.principal_officer_name)
        print(filing.formation_year)
        print(filing.website_address)
        print(filing.us_address)
        print(filing.us_city_name)
        print(filing.us_zip_code)
        print(filing.gross_receipts)
        print(filing.employee_count)
