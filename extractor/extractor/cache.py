from logging import getLogger
import os
from typing import Dict, Optional, TextIO


_logger = getLogger(__name__)


class Cache:
    """
    A generic, abstract, cache to allow fast lookups for XML filings. This
    exists to keep us from having to download thousands of XML documents
    every time we update the site or data.

    TODO: Add a mechanism for invalidating / replacing cached documents
    """

    def get(self, object_id: str) -> Optional[str]:
        """
        Fetch a filing from the cache.
        """
        raise NotImplementedError()

    def put(self, object_id: str, content: str) -> str:
        """
        Cache a filing.
        """
        raise NotImplementedError()


class MemoryCache(Cache):
    """
    A naive, in-memory cache that does no eviction or invalidation.

    >>> c = MemoryCache()
    >>> c.get("foo")
    >>> c.put("foo", "bar")
    'bar'
    >>> c.get("foo")
    'bar'
    """

    _dict: Dict[str, str]

    def __init__(self):
        self._dict = {}

    def get(self, object_id: str) -> Optional[str]:
        content = self._dict.get(object_id, None)
        if content is None:
            _logger.debug(f"cache miss fetching object_id '{object_id}'")
        _logger.debug(f"cache hit fetching object_id '{object_id}'")
        return content

    def put(self, object_id: str, content: str) -> str:
        _logger.debug(f"caching object_id '{object_id}'")
        self._dict[object_id] = content
        return content


class DirectoryCache(Cache):
    """
    A simple on-disk cache that saves the filing XML files to the given
    directory.

    TODO: Accept a path template to use with object IDs
    TODO: Opened files need to be closed
    TODO: OMG so much edge case and error checking, seriously

    >>> import os.path as p
    >>> import tempfile as tf
    >>> d = tf.mkdtemp()
    >>> c = DirectoryCache(d)
    >>> c.get("foo")
    >>> c.put("foo", "bar")
    'bar'
    >>> p.exists(f"{d}/foo_public.xml")
    True
    """

    _path: str

    def __init__(self, path: str = ""):
        if path == "":
            # Use the default directory
            # TODO: Better error checking here, what if it's a file?
            if not os.path.isdir(".extractor"):
                os.mkdir(".extractor")
            self._path = ".extractor"
            return

        if os.path.exists(path):
            # Attempt to use the existing directory
            if not os.path.isdir(path):
                raise ValueError(f"path '{path}' is not a directory")

            self._path = path
            return

        os.mkdir(path)
        self._path = path

    def get(self, object_id: str) -> Optional[str]:
        path = os.path.join(self._path, f"{object_id}_public.xml")
        if os.path.exists(path) and os.path.isfile(path):
            _logger.debug(f"cache hit fetching object_id '{object_id}'")
            with open(path) as xml:
                return xml.read()
        _logger.debug(f"cache miss fetching object_id '{object_id}'")
        return None

    def put(self, object_id: str, content: str) -> str:
        _logger.debug(f"caching object_id '{object_id}'")
        path = os.path.join(self._path, f"{object_id}_public.xml")
        with open(path, "w") as xml:
            xml.write(content)
        return content
