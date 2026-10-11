"""Check demonstration metadata and reference endpoints without downloading videos."""
import concurrent.futures
import json
import urllib.request
import subprocess
from pathlib import Path

exercises = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', 'import {exercises} from "./web/content.js"; console.log(JSON.stringify(exercises))'], text=True))

def check(item):
    key, exercise = item
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={exercise["youtube"]}&format=json'
    result = {'exercise': key, 'video': f'https://www.youtube.com/watch?v={exercise["youtube"]}'}
    try:
        with urllib.request.urlopen(url, timeout=25) as response:
            metadata = json.load(response)
        result.update(title=metadata['title'], channel=metadata['author_name'], thumbnail=metadata['thumbnail_url'], available=True)
        with urllib.request.urlopen(metadata['thumbnail_url'], timeout=25) as response:
            result['thumbnail_type'] = response.headers.get('Content-Type')
        if exercise.get('photo'):
            try:
                with urllib.request.urlopen(exercise['photo']['url'], timeout=25) as response:
                    result['photo_type'] = response.headers.get('Content-Type')
            except Exception as error:
                result['photo_error'] = str(error)
    except Exception as error:
        result.update(available=False, error=str(error))
    print(key, result.get('title', result.get('error')), flush=True)
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(check, exercises.items()))
Path('resources/media-audit.json').write_text(json.dumps({'checked': '2026-10-10', 'exercises': results}, indent=2))
