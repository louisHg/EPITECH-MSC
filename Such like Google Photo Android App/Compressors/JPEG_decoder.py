from struct import unpack

#class JPEG_IMG:
#    def __init__(self, file) -> None:
#        with open(file, 'rb') as img_file:
#            self.image_data = img_file.read()

#    def decode(self):
#        img_data = self.image_data
#        while True:
#            file_marker, = unpack(">H", img_data[0:2])
#            print(mapping.get(file_marker))
#
#            if file_marker == 0xffd8:
#                img_data = img_data[2:]
#            elif file_marker == 0xffda:
#                img_data = img_data[-2:]
#            else:
#                length_chunk, = unpack(">H", img_data[2:4])
#                img_data = img_data[2+length_chunk:]
#            
#            if len(img_data) == 0:
#                break

mapping = {
    0xffd8: "Start of Image",
    0xffe0: "Application Default Header",
    0xffdb: "Quantization Table",
    0xffc0: "Start of Frame",
    0xffc4: "Define Huffman Table",
    0xffda: "Start of Scan",
    0xffd9: "End of Image"
}

class JPEG:
    def __init__(self, image_file):
        with open(image_file, 'rb') as f:
            self.img_data = f.read()
    
    def decode(self):
        data = self.img_data
        while(True):
            marker, = unpack(">H", data[0:2])
            print(mapping.get(marker))
            if marker == 0xffd8:
                data = data[2:]
            elif marker == 0xffd9:
                return
            elif marker == 0xffda:
                data = data[-2:]
            else:
                lenchunk, = unpack(">H", data[2:4])
                data = data[2+lenchunk:]            
            if len(data)==0:
                break        



if __name__ == "__main__":
    image = JPEG("./Paysage.jpg")
    image.decode()