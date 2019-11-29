import os
import pandas as pd


DEFAULT_FIELDS = ['OBJECT_ID', 'EIN', 'NAME', 'STREET', 'CITY', 'STATE', 'ZIP']


class Finder:
    def __init__(self, cache_path: str, state: str, year: int):
        index_path = os.path.join(
            cache_path,
            'index',
            'CSV',
            'index_%s.csv' % year,
        )
        index = pd.read_csv(index_path)

        summary_path = os.path.join(
            cache_path,
            'eo_%s.csv' % state,
        )
        summary = pd.read_csv(summary_path)

        self._lookup = summary.merge(index, on='EIN')

    def get_fields(self, fields=None):
        if fields is None:
            fields = DEFAULT_FIELDS

        return self._lookup[fields]

    def search_name(self, query: str, fields=None) -> pd.DataFrame:
        if fields is None:
            fields = DEFAULT_FIELDS

        lookup = self._lookup[self._lookup['NAME'].str.contains(query)]
        return lookup[fields]


def dump_json(lookup: pd.DataFrame) -> list:
    payload = []
    for row in lookup.iterrows():
        _, row_data = row
        row_dict = {}
        for key in row_data.keys():
            row_dict[key.lower()] = row_data[key]
        payload.append(row_dict)
    return payload
