
# How we gonna do this? How do you specify exact matches
# or fuzzy matches or whatever? Maybe we just limit the
# stuff you can query on? Certainly to begin with.

class Query:
    _path: str

    organizationName: str

    def __init__(self):
        self._path = ""
        self.organizationName = ""
