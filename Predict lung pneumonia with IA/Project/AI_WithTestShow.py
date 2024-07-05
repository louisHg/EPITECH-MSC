import tensorflow as tf
import random
import numpy as np
import os
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

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
    layers.Conv2D(16, (3,3), activation='relu', input_shape=(224,224,10)),
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

# Obtient le chemin vers le dossier de test
test_dir = '../Ressources/test'

# Crée un Dataset contenant les noms de fichiers des images du dossier de test
test_filenames = tf.data.Dataset.list_files(os.path.join(test_dir, '*/*'))

# Convertit le Dataset en liste et extrait les noms de fichiers
test_filenames = list(test_filenames)
test_filenames = [os.path.basename(file.numpy()).decode('utf-8') for file in test_filenames]

# Sélectionne une image aléatoire du jeu de données de test
test_images = np.concatenate([x for x, y in test_data], axis=0)
test_labels = np.concatenate([y for x, y in test_data], axis=0)

# Sélectionne et affiche 5 images aléatoires du jeu de données de test
fig, axs = plt.subplots(1, 5, figsize=(20, 20))
for i in range(5):
    random_index = random.randint(0, len(test_images) - 1)
    test_filename = test_filenames[random_index]
    test_image = test_images[random_index]
    test_label = test_labels[random_index]
    test_image_norm = test_image / 255.0
    predictions = model.predict(np.array([test_image]))
    prediction = "poumons malades" if predictions[0][0] > 0.5 else "poumons sains"
    axs[i].imshow(test_image_norm, cmap="gray")
    axs[i].set_title(f"{prediction} \n {test_filename}")
plt.show()
