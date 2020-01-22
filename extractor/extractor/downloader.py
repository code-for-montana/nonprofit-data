from io import StringIO
import logging
import requests
from typing import Iterable, TextIO
from .cache import Cache


_logger = logging.getLogger(__name__)


AWS_TEMPLATE = "https://s3.amazonaws.com/irs-form-990/{object_id}_public.xml"
"""
A URL template that utilizes the AWS S3 bucket that hosts the official 990
filings. For use with `HTTPDownloader`.
"""


class DownloaderException(Exception):
    pass


class Downloader:
    """
    A class responsible for fetching XML filings based on their object ID,
    which is looked up in an index.
    """

    def fetch(self, object_id: str,) -> TextIO:
        raise NotImplementedError()

    def fetch_all(self, object_ids: Iterable[str],) -> Iterable[TextIO]:
        raise NotImplementedError()


class HTTPDownloader(Downloader):
    """
    A downloader implementation that uses a templated URL to fetch XML files
    using HTTP. The cache is checked before any requests are made.

    The cache will always be checked before a network request is made.

    The `url_template` passed to the constructor should be a valid Python
    format string. The only context made available to it will be a key called
    `object_id` which will match the object ID of the filing to be
    downloaded.

    If the download fails for any reason a `DownloaderException` will be
    raised. Its message will include the body of the response.

    TODO: Remove "requests" dependency and just use the std lib
    """

    _cache: Cache

    _url_template: str

    def __init__(
        self, url_template: str, cache: Cache,
    ):
        self._cache = cache
        self._url_template = url_template

    def fetch(self, object_id: str,) -> TextIO:
        content = self._cache.get(object_id)
        if content is None:
            url = self._url_template.format(object_id=object_id)
            _logger.info(f"downloading '{url}'")
            response = requests.get(url)
            _logger.info(f"download finished '{response.reason}'")

            # We're pretty loose with what we assume to be a successful
            # download here but that should be fine for now.
            if response.status_code < 200 or response.status_code > 299:
                _logger.warning(f"download failed '{response.status_code}'")
                raise DownloaderException(response.text)

            content = self._cache.put(object_id, response.text)
        return StringIO(content)

    def fetch_all(self, object_ids: Iterable[str],) -> Iterable[TextIO]:
        for object_id in object_ids:
            yield self.fetch(object_id)
