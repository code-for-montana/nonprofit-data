from extractor import app
import sys
from ._options import parser, Options

if __name__ == "__main__":
    import logging

    logging.basicConfig()
    logger = logging.getLogger(__package__)

    args = parser.parse_args(sys.argv[1:])
    options = Options.from_args(args)

    app.run(options)
