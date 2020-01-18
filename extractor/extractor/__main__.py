from extractor import app

if __name__ == "__main__":
    import logging

    logging.basicConfig()
    logger = logging.getLogger(__package__)

    app.run()
