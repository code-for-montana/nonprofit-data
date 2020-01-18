import io
from . import HTTPDownloader, Index, DirectoryCache, MemoryCache, Result
from .filing import Filing


def run():
    result = Result(
        HTTPDownloader(
            "https://s3.amazonaws.com/irs-form-990", DirectoryCache()
        ),
        Index(io.open("fixtures/index.csv")),
    )
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
