import numpy as np
import pandas as pd
from glob import glob
 
from keras.layers import Input, Lambda, Dense, Flatten
from keras.models import Model
from keras.applications.vgg16 import VGG16
from keras.applications.vgg16 import preprocess_input
from keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping
 
import numpy as np
import matplotlib.pyplot as plt
from skimage.io import imread, imshow

image = imread("../Datasets/train/NORMAL/IM-0115-0001.jpeg")
plt.imshow(image)

src_path_train = "../Datasets/train"
src_path_test = "../Datasets/test"
batch_size = 32
 
image_gen = ImageDataGenerator(
        rescale=1 / 255.0,
        rotation_range=20,
        zoom_range=0.05,
        width_shift_range=0.05,
        height_shift_range=0.05,
        shear_range=0.05,
        horizontal_flip=True,
        fill_mode="nearest",
        validation_split=0.20)

IMSIZE = (224, 224)

# create generators
train_generator = image_gen.flow_from_directory(
  src_path_train,
  target_size=IMSIZE,
  shuffle=True,
  batch_size=batch_size,
  subset='training'
)
 
test_generator = image_gen.flow_from_directory(
  src_path_test,
  target_size=IMSIZE,
  shuffle=True,
  batch_size=batch_size,
  subset='validation'
)

NBCLASSES = len(train_generator.class_indices)

def create_model():
    vgg = VGG16(input_shape=IMSIZE + (3,), weights='imagenet', include_top=False)
 
    # Freeze existing VGG already trained weights
    for layer in vgg.layers:
        layer.trainable = False
     
    # get the VGG output
    out = vgg.output
     
    # Add new dense layer at the end
    x = Flatten()(out)
    x = Dense(NBCLASSES, activation='softmax')(x)
     
    model = Model(inputs=vgg.input, outputs=x)
     
    model.compile(loss="categorical_crossentropy",
                  optimizer="adam",
                  metrics=['accuracy'])
     
    model.summary()
     
    return model
 
mymodel = create_model()

epochs = 10
early_stop = EarlyStopping(monitor='val_loss',patience=2)
 
mymodel.fit(
  train_generator,
  validation_data=test_generator,
  epochs=epochs,
  steps_per_epoch=train_generator.samples // batch_size,
  validation_steps=test_generator.samples // batch_size,
  callbacks=[early_stop]
)

score = mymodel.evaluate_generator(test_generator)
print('Test loss:', score[0])
print('Test accuracy:', score[1])

mymodel.save('cancer.h5')
