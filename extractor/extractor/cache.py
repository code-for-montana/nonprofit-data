from io import StringIO
import os
from typing import Dict, Optional, TextIO


class Cache:
    """
    A generic cache to allow fast lookups for XML filings.

    TODO: Should both methods return strings, or both TextIOs?
    """

    def get(self, object_id: str) -> Optional[TextIO]:
        raise NotImplementedError()

    def put(self, object_id: str, content: str) -> str:
        raise NotImplementedError()


class MemoryCache(Cache):
    """
    A naive, in-memory cache that does no eviction or invalidation.
    """

    _dict: Dict[str, str]

    def __init__(self):
        self._dict = {}

    def get(self, object_id: str) -> Optional[TextIO]:
        return self._dict.get(object_id, None)

    def put(self, object_id: str, content: str) -> str:
        self._dict[object_id] = content
        return content


class DirectoryCache(Cache):
    """
    A simple on-disk cache that saves the filing XML files to the given
    directory.

    TODO: Accept a path template to use with object IDs
    TODO: Opened files need to be closed
    TODO: OMG so much edge case and error checking, seriously
    """

    _path: str

    def __init__(self, path: str = ""):
        if path == "":
            # Use the default directory
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

    def get(self, object_id: str) -> Optional[TextIO]:
        path = os.path.join(self._path, f"{object_id}_public.xml")
        if os.path.exists(path) and os.path.isfile(path):
            return open(path)

    def put(self, object_id: str, content: str) -> str:
        path = os.path.join(self._path, f"{object_id}_public.xml")
        with open(path, 'w') as xml:
            xml.write(content)
        return content
