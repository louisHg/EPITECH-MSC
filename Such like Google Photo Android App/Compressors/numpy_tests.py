from PIL import Image

image = Image.open("GigaChad.png")
image = image.convert("RGB")
image.save("image-file-compressed.jpg", "JPEG", optimize=True, quality=10)
