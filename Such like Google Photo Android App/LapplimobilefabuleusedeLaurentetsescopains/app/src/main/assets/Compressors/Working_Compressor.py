import PIL._imaging as core
from PIL import Image
import builtins

original_filepath = "Images_entry/GigaChad.png"
new_filepath = "Images_output/GigaChad.jpg"
quality = 1

def set_encoder(mode, args, extra=()):
    if args is None:
        args = ()
    elif not isinstance(args, tuple):
        args = (args,)

    encoder = getattr(core, "jpeg_encoder")
    return encoder(mode,*args + extra)

image = Image.open(original_filepath)
image.load()

file = builtins.open(new_filepath, "w+b")

try:
    fh = file.fileno()
    file.flush()
except Exception as e:
    print(e)

heigth, width = image.height, image.width
bufsize = image.size[0] * image.size[1]
bufsize = max(65536, bufsize, image.size[0] * 4)

jpeg_params = (quality, False, 0, True, 0 , 0 , 0, -1, None, b'', b'')

encoder = set_encoder("RGB", "RGB", jpeg_params)
encoding_settings = (0, 0, width, heigth)
encoder.setimage(image.im, encoding_settings)
save = encoder.encode_to_file(fh, bufsize)
encoder.cleanup()


if hasattr(file, "flush"):
    file.flush()



