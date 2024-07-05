# importation des bibliothèques nécessaires
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import KFold

# Chargement des données d'entraînement, de validation et de test à partir du répertoire Ressources
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

# Préparation des données pour l'entraînement en les mettant en cache pour accélérer le traitement
train_data = train_data.prefetch(buffer_size=32)
val_data = val_data.prefetch(buffer_size=32)
test_data = test_data.prefetch(buffer_size=32)

train_data_np = np.concatenate([x for x, y in train_data.as_numpy_iterator()], axis=0)
train_labels_np = np.concatenate([y for x, y in train_data.as_numpy_iterator()], axis=0)

kfold = KFold(n_splits=5, shuffle=True, random_state=42)

for fold, (train_indices, val_indices) in enumerate(kfold.split(train_data_np)):
    
# Définition de la structure du modèle
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
#Compilation du modèle avec l'optimiseur Adam, la fonction de perte binaire croisée et la métrique de précision
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
#Entraînement et évaluation du modèle pour chaque fold de la cross-validation
    history = model.fit(train_data_np[train_indices], train_labels_np[train_indices],
                        validation_data=(train_data_np[val_indices], train_labels_np[val_indices]), epochs=10)
# Évaluation de la précision du modèle sur les données de test
    test_loss, test_acc = model.evaluate(test_data)
    print('Test accuracy:', test_acc)