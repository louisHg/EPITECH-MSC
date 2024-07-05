import rasterio
import rasterio.features
import rasterio.warp
import pyproj
import matplotlib.pyplot as plt
import earthpy.spatial as es
import numpy as np

def plot_chunk(map):

        """Create 2d plot and save it on a file
        """

        #Replace 0 by 5000
        array = map
        array[array == 0] = 5000

        #Create 3d relief
        hillshade = es.hillshade(array, azimuth=180, altitude=1)

        fig, ax = plt.subplots()

        #Create 2d + add the relief to it
        plt.imshow(array, cmap='Spectral')
        plt.ticklabel_format(useOffset=False)
        ax.imshow(hillshade, cmap="Greys", alpha=0.3)
        ax.axis('off')

        #Save to file and close
        plt.show()
        plt.close()

with rasterio.open("./back-end/maps/europe_mean_4.tif") as dataset:

    # Read the dataset's valid data mask as a ndarray.
    mask = dataset.dataset_mask()

    # Extract feature shapes and values from the array.
    for geom, val in rasterio.features.shapes(
            mask, transform=dataset.transform):
            
        
        transformer = pyproj.Transformer.from_crs(dataset.crs, "epsg:3857", always_xy=True)
        
        for coordinates in geom["coordinates"][0]:
            print("Avant: ", coordinates)
            print("Après: ",transformer.transform(coordinates[0], coordinates[1]))

        # Print GeoJSON shapes to stdout.
        print(dataset.crs)
        print(geom)