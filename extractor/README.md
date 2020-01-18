# Extractor

A Python application that grabs the data necessary to create the web site.

## Running

For now you need to clone the repo to use it. Eventually we'll package it.

  1. Make sure you have Python 3.7 available
  1. Install `pipenv` - `pip install --user pipenv`
  1. Clone the whole repo, `cd` into the `extractor` directory
  1. Install dependencies - `pipenv install`
  1. Run the example: `pipenv run python -m extractor`
  1. Run it again to use the cache (notice the speedup)
  1. The cache is set to `./.extractor/`

## Development

  1. Make sure you have Python 3.7 available
  1. Install `pipenv` - `pip install --user pipenv`
  1. Clone the whole repo, `cd` into the `extractor` directory
  1. Install dependencies - `pipenv install --dev`
  1. Make your changes
  1. If you need to add dependencies:
    1. `pipenv install coolpkg`
    1. `pipenv lock` (updates the lock file)
  1. Make a pull request

