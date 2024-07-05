import tensorflow as tf
import cv2
import numpy as np

# Load the trained model from the .h5 file
model = tf.keras.models.load_model('cancer.h5')

# Load and preprocess the input image
img_path = '../Datasets/val/NORMAL/NORMAL2-IM-1442-0001.jpeg'
img = cv2.imread(img_path)
img = cv2.resize(img, (224, 224))
img = np.expand_dims(img, axis=0)
img = img / 255.0
# Predict the class of the input image
pred = model.predict(img)
class_idx = np.argmax(pred)
print(pred)
print(class_idx)
if class_idx == 0:
    print("NORMAL")
else:
    print("PNEUMONIA")

