#!/usr/bin/env sh

set -e

STATE=mt
# TODO: Allow multiple years
YEAR=2019

# TODO: Convert to a makefile to avoid redundant downloads
# TODO: Check for irsx_index in the PATH

DATA_CACHE="`pwd`/cache"
echo "Creating data cache directory"
mkdir -p "$DATA_CACHE"

export IRSX_CACHE_DIRECTORY="$DATA_CACHE/index"
echo "Creating index cache directory"
mkdir -p "$IRSX_CACHE_DIRECTORY"

echo "Fetching index for $YEAR"
irsx_index --year $YEAR

# Note that this won't include organizations that ceased to exist
# awhile ago because the IRS purges them, so some organizations may
# be missing for earlier years.
echo "Fetching summary data for $STATE"
curl https://www.irs.gov/pub/irs-soi/eo_$STATE.csv --output "$DATA_CACHE/eo_$STATE.csv"

