from io import StringIO
import logging
import requests
from typing import Iterable, TextIO
from .cache import Cache


# This thing will take a cache to use, otherwise we probably don't
# want caching, or maybe in-memory by default or something? Probably
# leave that up to the individual Downloader implementations.


_logger = logging.getLogger(__name__)


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

    TODO: Error handling on failed requests
    TODO: Remove "requests" dependency and just use the std lib
    TODO: Allow the base URL to be a true template of some sort
    """

    _base_url: str

    _cache: Cache

    def __init__(
        self, base_url: str, cache: Cache,
    ):
        self._base_url = base_url.rstrip("/")
        self._cache = cache

    def fetch(self, object_id: str,) -> TextIO:
        content = self._cache.get(object_id)
        if content is None:
            url = f"{self._base_url}/{object_id}_public.xml"
            _logger.info(f"Fetch: '{url}'")
            response = requests.get(url)
            _logger.info(f"Response: '{response.reason}'")
            content = self._cache.put(object_id, response.text)
        return StringIO(content)

    def fetch_all(self, object_ids: Iterable[str],) -> Iterable[TextIO]:
        for object_id in object_ids:
            yield self.fetch(object_id)
