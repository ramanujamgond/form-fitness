"""Compress generated exercise assets and retain their generation provenance."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json

root=Path('web/img/generated')
specs=json.loads(Path('resources/generation-prompts.json').read_text())
report=[]
for key in specs:
    destination=root/f'{key}.webp'
    archive=Path('resources/generated-originals')
    archive.mkdir(exist_ok=True)
    candidates=[root/f'{key}{suffix}.png' for suffix in ['-v3','-v2','']]
    source=next((file for file in candidates if file.exists()),None)
    if source:
        image=Image.open(source).convert('RGB')
        image.thumbnail((800,600))
        image.save(destination,'WEBP',quality=78,method=6)
        for file in root.glob(f'{key}*.png'):
            file.replace(archive/file.name)
        for file in root.glob(f'{key}*_thumb.jpeg'):
            file.replace(archive/file.name)
    if destination.exists():
        image=Image.open(destination)
        report.append({'exercise':key,'file':str(destination),'bytes':destination.stat().st_size,'width':image.width,'height':image.height})
Path('resources/generated-media.json').write_text(json.dumps(report,indent=2))
tiles=[]
for key in specs:
    file=root/f'{key}.webp'
    if file.exists():
        tile=Image.new('RGB',(320,264),'white')
        tile.paste(ImageOps.contain(Image.open(file),(320,240)),(0,24))
        ImageDraw.Draw(tile).text((8,6),key,fill='black')
        tiles.append(tile)
if tiles:
    sheet=Image.new('RGB',(1280,264*((len(tiles)+3)//4)), '#eeeeee')
    for i,tile in enumerate(tiles):sheet.paste(tile,((i%4)*320,(i//4)*264))
    sheet.save('resources/previews/generated-exercises.jpg',quality=90)
print(f'{len(report)} images, {sum(row["bytes"] for row in report):,} bytes')
