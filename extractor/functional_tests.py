import json
import extractor.lib as ext

finder = ext.Finder('cache', 'mt', 2019)
result = finder.search_name('TAMARACK')

print(json.dumps(ext.dump_json(result)))
