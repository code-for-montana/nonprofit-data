from __future__ import annotations
import logging
from defusedxml import ElementTree
import sys
from typing import Dict, Optional, TextIO


_logger = logging.getLogger(__name__)


class Filing:
    """
    Encapsulate a Filing as a semantic object with appropriately named
    fields.

    The implementation actually returned from Result objects will have its
    fields generated at build time to avoid the need to update the code every
    time someone wants to access a new field.

    Fields that aren't included can still be accessed using the XPath strings
    listed on http://www.irsx.info/ and the `get_*` methods. The paths should
    be used verbatim, in their absolute form, without namespaces.

    >>> with open('fixtures/filing.xml') as xml:
    ...    filing = Filing(xml)
    >>> filing.formation_year
    '2004'
    >>> filing.principal_officer_name
    'SCOTT LEWIS'
    """

    _namespaces: Dict[str, str]

    _tree: ElementTree

    @staticmethod
    def from_file(path: str,) -> Filing:
        """
        A factory primarily intended for testing and interactive (REPL or
        Jupyter) use.
        """
        with open(path) as xmlFile:
            return Filing(xmlFile)

    def __init__(
        self, xml_file: TextIO,
    ):
        self._namespaces = {
            "efile": "http://www.irs.gov/efile",
        }

        content = xml_file.read()
        while not content.startswith("<"):
            content = content[1:]
        byteContent = content.encode("utf-8")
        _logger.info(f"XML: '{str(byteContent[:40])}'")

        self._tree = ElementTree.fromstring(byteContent)

    def to_json(self):
        # We're just going to do kind of a poor man's serialization here until
        # we have time to think it through. Update this when you add a property.
        return {
            "activity_or_mission_description": self.activity_or_mission_description,
            "formation_year": self.formation_year,
            "gross_receipts": self.gross_receipts,
            "employee_count": self.employee_count,
            "principal_officer_name": self.principal_officer_name,
            "us_address": self.us_address,
            "us_city_name": self.us_city_name,
            "us_zip_code": self.us_zip_code,
            "website_address": self.website_address,
        }

    @property
    def activity_or_mission_description(self) -> Optional[str]:
        return self.get_str("/IRS990/ActivityOrMissionDesc")

    @property
    def formation_year(self) -> Optional[str]:
        return self.get_str("/IRS990/FormationYr")

    @property
    def gross_receipts(self) -> Optional[int]:
        return self.get_int("/IRS990/GrossReceiptsAmt")

    @property
    def employee_count(self) -> Optional[int]:
        return self.get_int("/IRS990/TotalEmployeeCnt")

    @property
    def principal_officer_name(self) -> Optional[str]:
        return self.get_str("/IRS990/PrincipalOfficerNm")

    @property
    def us_address(self) -> Optional[str]:
        line1 = self.get_str("/IRS990/USAddress/AddressLine1Txt")
        line2 = self.get_str("/IRS990/USAddress/AddressLine2Txt")
        full = "\n".join([l for l in [line1, line2] if l is not None])
        if full == "":
            return None
        return full

    @property
    def us_city_name(self) -> Optional[str]:
        return self.get_str("/IRS990/USAddress/CityNm")

    @property
    def us_zip_code(self) -> Optional[str]:
        return self.get_str("/IRS990/USAddress/ZIPCd")

    @property
    def website_address(self) -> Optional[str]:
        return self.get_str("/IRS990/WebsiteAddressTxt")

    # -----------------------------------------------#
    # Helper methods, add new fields above this line #
    # -----------------------------------------------#

    def get_str(self, path: str) -> Optional[str]:
        """
        Extract a field from the XML document and return
        it exactly as it was contained in the document.
        """
        fullPath = self._add_namespace(path)
        element = self._tree.find(fullPath, namespaces=self._namespaces)

        if element is None:
            return None

        return element.text

    def get_float(self, path: str) -> Optional[float]:
        """
        Extract a field from the XML document adn convert
        it to a float before returning it.
        """
        raw = self.get_str(path)
        if raw is None:
            return None
        return float(raw)

    def get_int(self, path: str) -> Optional[int]:
        """
        Extract a field from the XML document and
        convert it to an integer before returning it.
        """
        raw = self.get_str(path)
        if raw is None:
            return None
        return int(raw)

    def _add_namespace(self, path: str) -> str:
        """
        Add the default namespace to all path segments
        that do not already have one.
        """
        segments = ["efile:ReturnData"] + [
            f"efile:{tag}" for tag in path.lstrip("/").split("/")
        ]
        fullPath = "/".join(segments)
        _logger.info(f"XPath: '{fullPath}'")
        return fullPath
