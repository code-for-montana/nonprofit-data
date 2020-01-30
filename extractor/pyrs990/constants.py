AWS_FILING_TEMPLATE = (
    "https://s3.amazonaws.com/irs-form-990/{document}_public.xml"
)
"""
A URL template that uses the AWS S3 bucket maintained by the IRS. For
use with `HTTPDownloader` to download filing documents.
"""

AWS_INDEX_TEMPLATE = (
    "https://s3.amazonaws.com/irs-form-990/index_{document}.csv"
)
"""
A URL template that uses the AWS S3 bucket maintained by the IRS. For
use with the `HTTPDownloader` to download index documents.
"""

CURRENT_VERSION = "0.0.1"

DEFAULT_CACHE_PATH = ".pyrs990-cache"

PROGRAM_DESCRIPTION = "A utility to extract and serialize IRS Form 990 data on non-profit organizations."

PROGRAM_NAME = "pyrs990"
