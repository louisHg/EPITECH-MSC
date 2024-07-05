import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split

train_data = tf.keras.preprocessing.image_dataset_from_directory(
    '../Ressources/train',
    batch_size=32,
    image_size=(224, 224),
    validation_split=0.2,
    seed=42, 
    subset='training',
    shuffle=True
)

val_data = tf.keras.preprocessing.image_dataset_from_directory(
    '../Ressources/val',
    batch_size=32,
    image_size=(224, 224),
    validation_split=0.2,
    seed=42, 
    subset='validation',
    shuffle=True
)

test_data = tf.keras.preprocessing.image_dataset_from_directory(
    '../Ressources/test',
    batch_size=32,
    image_size=(224, 224)
)

train_data = train_data.prefetch(buffer_size=32)
val_data = val_data.prefetch(buffer_size=32)
test_data = test_data.prefetch(buffer_size=32)

model = models.Sequential([
    layers.experimental.preprocessing.Rescaling(1./255),
    layers.Conv2D(16, (3,3), activation='relu', input_shape=(224,224,3)),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

history = model.fit(train_data, validation_data=val_data, epochs=10)

test_loss, test_acc = model.evaluate(test_data)
print('Test accuracy:', test_acc)
