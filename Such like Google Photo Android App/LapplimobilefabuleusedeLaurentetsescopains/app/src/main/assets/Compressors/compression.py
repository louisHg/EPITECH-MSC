import numpy as np
import math
import imageio
from copy import deepcopy


QTY = np.array([[16, 11, 10, 16, 24, 40, 51, 61],  # luminance quantization table
                [12, 12, 14, 19, 26, 48, 60, 55],
                [14, 13, 16, 24, 40, 57, 69, 56],
                [14, 17, 22, 29, 51, 87, 80, 62],
                [18, 22, 37, 56, 68, 109, 103, 77],
                [24, 35, 55, 64, 81, 104, 113, 92],
                [49, 64, 78, 87, 103, 121, 120, 101],
                [72, 92, 95, 98, 112, 100, 103, 99]])

QTC = np.array([[17, 18, 24, 47, 99, 99, 99, 99],  # chrominance quantization table
                [18, 21, 26, 66, 99, 99, 99, 99],
                [24, 26, 56, 99, 99, 99, 99, 99],
                [47, 66, 99, 99, 99, 99, 99, 99],
                [99, 99, 99, 99, 99, 99, 99, 99],
                [99, 99, 99, 99, 99, 99, 99, 99],
                [99, 99, 99, 99, 99, 99, 99, 99],
                [99, 99, 99, 99, 99, 99, 99, 99]])

TO_YCBCR = np.array(
    [[.299, .587, .114], [-.1687, -.3313, .5], [.5, -.4187, -.0813]])
TO_RGB = np.array([[1, 0, 1.402], [1, -0.34414, -.71414], [1, 1.772, 0]])

CHUNK_SIZE = 8

PI = math.pi


def convert_format(array: np.ndarray):

    new_array = array.astype("int8")
    if(len(array[0][0]) != 3):
        new_array = np.delete(new_array, 3, axis=2)
    return new_array


def rgb2ycbcr(image_array: np.ndarray):
    y_cb_cr_array = image_array.dot(TO_YCBCR.transpose())
    return np.int8(y_cb_cr_array)


def ycbcr2rgb(image_array: np.ndarray):
    rgb_array = image_array.astype(float)
    rgb_array[:, :, [1, 2]] -= 128
    rgb_array = rgb_array.dot(TO_RGB.transpose())

    np.putmask(rgb_array, rgb_array > 255, 255)
    np.putmask(rgb_array, rgb_array < 0, 0)

    return np.uint8(rgb_array)


def get_next_divisable(len, diviser):
    while len % diviser != 0:
        len += 1

    return len


def dct_transform(image):

    dct_values = []

    # Crée une array de 8x8 vide pour stocker les coefs
    for i in range(CHUNK_SIZE):
        dct_values.append([None for j in range(CHUNK_SIZE)])

    for i in range(CHUNK_SIZE):
        for j in range(CHUNK_SIZE):

            if(i == 0):
                ci = 1 / (CHUNK_SIZE ** 0.5)
            else:
                ci = (2 / CHUNK_SIZE) ** 0.5
            if(j == 0):
                cj = 1 / (CHUNK_SIZE ** 0.5)
            else:
                cj = (2 / CHUNK_SIZE) ** 0.5

            # Stock la somme des cosinus
            sum = 0

            for k in range(CHUNK_SIZE):
                for l in range(CHUNK_SIZE):
                    cos_1 = math.cos((2 * k + 1) * i * PI / (2 * CHUNK_SIZE))
                    cos_2 = math.cos((2 * l + 1) * j * PI / (2 * CHUNK_SIZE))
                    dct1 = image[k][l] * cos_1 * cos_2

                    sum = sum + dct1
            dct_values[i][j] = ci * cj * dct1

    return dct_values


def chunk_generator(map: np.ndarray, new_height: int, new_width: int):

    current_height, current_width = map.shape
    assert current_height % new_height == 0, f"{new_height} rows is not divible by {new_height}"
    assert current_width % new_width == 0, f"{current_width} rows is not divible by {new_width}"

    return map.reshape(current_height // new_height, new_height, -1, new_width).swapaxes(1, 2)

def huffman_array_creation(array, index_to_sort):
    print(len(array)+len(array[0])-1)
    solution = [[] for i in range(len(array)+len(array[0])-1)]

    for i in range(len(array)):
        for j in range(len(array[0])):
            sum = i+j
            if(sum % 2 == 0):

                # add at beginning
                solution[sum].insert(0, array[i][j][index_to_sort])
            else:

                # add at end of the list
                solution[sum].append(array[i][j][index_to_sort])

    # print the solution as it as
    new_list = []
    for i in solution:
        for j in i:
            new_list.append(j)

    new_list.pop(0)

    tuple_list = []
    zero_counter = 0
    for i in new_list:
        if i != 0 or zero_counter == 15:
            if(zero_counter == 15):
                current_number = 0
            current_number = i
            tuple_list.append((zero_counter, current_number))
            zero_counter = 0

        else:
            zero_counter += 1
    tuple_list.append((0, 0))
    print(tuple_list)
    return tuple_list

def binary_converter(value):
    if value == 0:
        category = 0
    if value == -1 or value == 1:
        category = 1
    if (value <= -3 and value >= -2 ) or (value >= 2 and value <= 3 ):
        category = 2
    if (value <= -7 and value >= -4 ) or (value >= 4 and value <= 7 ):
        category = 3
    if (value <= -15 and value >= -8 ) or (value >= 8 and value <= 15 ):
        category = 4
    if (value <= -31 and value >= -16 ) or (value >= 16 and value <= 32 ):
        category = 5
    if (value <= -63 and value >= -32 ) or (value >= 32 and value <= 63 ):
        category = 6
    if (value <= -127 and value >= -64 ) or (value >= 64 and value <= 127 ):
        category = 7
    if (value <= -255 and value >= -128 ) or (value >= 128 and value <= 255 ):
        category = 8
    if (value <= -511 and value >= -256 ) or (value >= 256 and value <= 511 ):
        category = 9
    if (value <= -1023 and value >= -512 ) or (value >= 512 and value <= 1023 ):
        category = 10
    if (value <= -2047 and value >= -1024 ) or (value >= 1024 and value <= 2047 ):
        category = 11
    if (value <= -4095 and value >= -2048 ) or (value >= 2048 and value <= 4095 ):
        category = 12
    if (value <= -8191 and value >= -4096 ) or (value >= 4096 and value <= 8191 ):
        category = 13
    if (value <= -16383 and value >= -8192 ) or (value >= 8192 and value <= 16383 ):
        category = 14
    if (value <= -32767 and value >= -16384 ) or (value >= 16384 and value <= 32767 ):
        category = 15
    
    print(category)
    pass

original_image = imageio.imread("./Paysage.jpg")
original_image = convert_format(original_image)
converted_image = rgb2ycbcr(original_image)

height = len(converted_image)
width = len(converted_image[0])

y_values = np.zeros((height, width),np.float32) + converted_image[:,:,0]
cr_values = np.zeros((height, width),np.float32) + converted_image[:,:,1]
cb_values = np.zeros((height, width),np.float32) + converted_image[:,:,2]

size_without_compression = len(y_values) * len(y_values[0]) * 8 + len(cr_values) * len(cr_values[0]) * 8 + len(cb_values) * len(cb_values[0]) * 8

y_values -= 128
cr_values -= 128
cb_values -= 128

print(y_values.shape)
print(y_values)
print(y_values[0])
print(y_values[0][0])

if len(converted_image) % CHUNK_SIZE == 0 and len(converted_image[0]) % CHUNK_SIZE == 0:
    print("No padding")
else:
    expected_width = get_next_divisable(width, CHUNK_SIZE)
    width_difference = expected_width - width
    expected_height = get_next_divisable(height, CHUNK_SIZE)
    height_difference = expected_height - height

    if expected_width != width:
        zero_arr = np.zeros((height, width_difference), int)
        y_values = np.append(y_values, zero_arr, axis=1)
        cr_values = np.append(cr_values, zero_arr, axis=1)
        cb_values = np.append(cb_values, zero_arr, axis=1)

    if expected_height != height:
        zero_arr = np.zeros((height_difference, width), int)
        y_values = np.append(y_values, zero_arr, axis=0)
        cr_values = np.append(cr_values, zero_arr, axis=0)
        cb_values = np.append(cb_values, zero_arr, axis=0)

y_values = chunk_generator(y_values, 8, 8)
cr_values = chunk_generator(cr_values, 8, 8)
cb_values = chunk_generator(cb_values, 8, 8)

print(len(y_values))
print(len(y_values[0]))

#for i, line in enumerate(converted_image):
#    for j, chunk in enumerate(converted_image[0]):
#        dct_matrix = dct_transform(chunk)
#
#        for k in range(CHUNK_SIZE):
#            new_huffman_line = []
#            for l in range(CHUNK_SIZE):
#                new_array = np.around(dct_matrix / QTY[k][l])
#                # new_huffman_line.append(huffman_array_creation(new_array))
#                break
#            # huffman_array.append(new_huffman_line)
#            break
#        break
#    break


