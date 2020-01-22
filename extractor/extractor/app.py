import json
from .cache import DirectoryCache, MemoryCache
from .downloader import HTTPDownloader
from .filing import Filing
from .index import Index, IndexRecord
from .result import Result
from ._options import Options


def _filter_taxpayer_name(record: IndexRecord) -> bool:
    # Remove non-profits from MS because it's hard to spell?
    return "MISSISSIPPI" not in record.taxpayer_name


def _filter_website(filing: Filing) -> bool:
    # Only keep organizations that have a website.
    return filing.website_address is not None


def run(options: Options):
    result = Result(
        HTTPDownloader(
            "https://s3.amazonaws.com/irs-form-990", DirectoryCache()
        ),
        Index(open("fixtures/index.csv", "r")).filter(_filter_taxpayer_name),
    )

    if options.to_json:
        print(json.dumps(result.to_json()))
        return

    for filing in result.filter(_filter_website):
        print("-----------------------------")
        print(filing.principal_officer_name)
        print(filing.formation_year)
        print(filing.website_address)
        print(filing.us_address)
        print(filing.us_city_name)
        print(filing.us_zip_code)
        print(filing.gross_receipts)
        print(filing.employee_count)
