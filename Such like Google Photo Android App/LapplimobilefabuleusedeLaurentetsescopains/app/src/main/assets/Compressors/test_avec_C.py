
import PIL._imaging as core
from PIL import Image
import builtins

class deferred_error:
    def __init__(self, ex):
        self.ex = ex

    def __getattr__(self, elt):
        raise self.ex

image = Image.open("GigaChad.png")
image.load()

file_path = builtins.open("Gigachad.jpg", "w+b")

try:
    fh = file_path.fileno()
    print("Numéro de fichier dans le dossier",fh)
    file_path.flush()
except Exception as e:
    print(e)

def set_encoder(mode, args, extra=()):
    if args is None:
        args = ()
    elif not isinstance(args, tuple):
        args = (args,)

    encoder = getattr(core, "jpeg_encoder")
    return encoder(mode,*args + extra)


encoder = set_encoder("RGB","RGB",(25, False, 0, True, 0, 0, 0, -1, None, b'', b''))
encoder.setimage(image.im, (0,0,1920,1080))
save = encoder.encode_to_file(fh, 2073600)
encoder.cleanup()

if hasattr(file_path, "flush"):
    file_path.flush()

