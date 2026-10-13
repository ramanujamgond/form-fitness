"""Export web icon sizes from the inspected Nano Banana master artwork."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[2]
source = Image.open(root / 'resources/brand/form-logo-flow-master.png').convert('RGB')
for name, size in [('form-icon-192.png',192),('form-icon-512.png',512),('form-maskable-512.png',512),('form-apple-touch-180.png',180),('form-brand-64.png',64),('form-favicon-32.png',32)]:
    source.resize((size,size),Image.Resampling.LANCZOS).save(root/'web'/name,optimize=True)
source.save(root/'web/form-favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48)])
