import subprocess as sp
from typing import NamedTuple

import pytest

from extractor.constants import CURRENT_VERSION, PROGRAM_NAME


class Return(NamedTuple):
    stdout: str
    stderr: str
    status: int


def runit(*args: str) -> Return:
    result = sp.run(
        ["pipenv", "run", "python", "-m", PROGRAM_NAME] + list(args),
        capture_output=True,
        encoding="utf-8",
        text=True,
    )
    return Return(
        stdout=result.stdout, stderr=result.stderr, status=result.returncode,
    )


@pytest.mark.subprocess
def test_cli_version() -> None:
    ret = runit("--version")
    assert ret.status == 0
    assert ret.stdout == f"{CURRENT_VERSION}\n"


@pytest.mark.subprocess
def test_extract_filing() -> None:
    pass
