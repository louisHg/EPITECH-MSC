import numpy as np 
import matplotlib.pyplot as plt
import random
from tensorflow.keras.datasets import mnist 
 
class MNISTData: 
 
    def __init__(self): 
        # Load the MNIST dataset 
        (x_train, y_train), (x_test, y_test) = mnist.load_data() 
 
        self.x_train = x_train
        self.x_test = x_test
        self.y_train = y_train 
        self.y_test = y_test 
 
    #La méthode display_statistics() affiche un histogramme de la distribution de chaque chiffre 
    # dans l'ensemble d'entraînement. Cela est utile pour vérifier si les données sont équilibrées. 
    def display_statistics(self): 
        plt.figure('Statistics')
        # Display the distribution of each digit in the training set 
        digit_counts = np.bincount(self.y_train) 
        digits = np.arange(len(digit_counts))
        plt.bar(digits, digit_counts) 
        plt.xticks(digits) 
        plt.xlabel('Digit') 
        plt.ylabel('Count') 
        plt.show() 
 
    # La méthode display_image() affiche une image spécifique de l'ensemble d'entraînement ou de test, en spécifiant l'indice de l'image et le nom de l'ensemble de données. 
    def display_image(self, index, dataset):
        # Display the image at the specified index in the specified dataset 
        plt.figure('image ' + str(index))
        if dataset == 'train':
            image = self.x_train[index].reshape((28, 28)) 
        elif dataset == 'test': 
            image = self.x_test[index].reshape((28, 28)) 
        else: 
            raise ValueError('Invalid dataset name: {}'.format(dataset)) 
        plt.imshow(image, cmap='gray') 
        plt.axis('off')
        plt.show() 
 
    #La méthode display_digit_means() calcule et affiche l'image moyenne de chaque chiffre dans l'ensemble d'entraînement. 
    #Cette méthode est utile pour visualiser les caractéristiques distinctives de chaque chiffre. 
    def display_digit_means(self): 
        # Calcule et affiche les charactéristiques de chaque chiffre
        plt.figure('digits means')
        digit_means = [] 
        for digit in range(10): 
            digit_indices = np.where(self.y_train == digit)[0] 
            digit_images = self.x_train[digit_indices] 
            digit_mean = np.mean(digit_images, axis=0).reshape((28, 28)) 
            digit_means.append(digit_mean) 
 
        PLT_LIGNES = 2
        PLT_COLONES = 5
        PLT_INDEX = 0
        for i in range(10): 
            PLT_INDEX += 1
            plt.subplot(PLT_LIGNES, PLT_COLONES, PLT_INDEX) 
            plt.imshow(digit_means[i], cmap='gray') 
            plt.axis('off') 
        plt.show() 

    # Remodelage et uniformisation des datas
    def reshaping(self):
        self.x_train = self.x_train.reshape((60000, 784)) / 255.0 
        self.x_test = self.x_test.reshape((10000, 784)) / 255.0 
 
 
# Create an instance of the MNISTData class 
mnist_data = MNISTData() 

mnist_data.reshaping()
 
# Display basic statistics 
mnist_data.display_statistics() 

i = 9999
 
# Display a specific image from the training set 
mnist_data.display_image(i, 'train') 

#Display a specific image from the test set
mnist_data.display_image(i, 'test')
 
# Display the mean image for each digit 
mnist_data.display_digit_means() 
 
# Reshape the images to size [n, 784] 
x_train_reshaped = mnist_data.x_train.reshape((60000, 784)) 
x_test_reshaped = mnist_data.x_test.reshape((10000, 784))