import numpy as np
import rasterio
from skimage.measure import label, regionprops
import multiprocessing
from typing import Iterator, Optional, Any
import io
import psycopg2
import os
import time
import matplotlib.pyplot as plt
import earthpy.spatial as es
import PIL
import config


def create_table(query: str):
    """Take a query string to create a table and execute it
    """

    conn = connect_to_db()

    try:
        cursor = conn.cursor()
        cursor.execute(query)
        cursor.close()
        conn.commit()
    except Exception as e:
        print(e)
    finally:
        conn.close()


def clean_csv_value(value: Optional[Any]) -> str:
    """Format a string to mimic CSV string format
    """
    if value is None:
        return r'\N'
    return str(value).replace('\n', '\\n')


def get_file_dataset(file: str) -> np.ndarray:
    """Open the file and return its numpy arrays
    """
    with rasterio.open(file) as file_dataset:
        dataset = file_dataset.read()[0]
    return dataset


def connect_to_db():
    """Open a connexion to the database using the .env informations
    """
    connexion = psycopg2.connect(
        host=os.environ["DB_HOST"],
        database=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        port=os.environ["DB_PORT"])

    return connexion


def check_table_exists(table_name: str) -> bool:
    """Return a boolean depending if the tables already exists or not
    True for existing, False if not
    """

    conn = connect_to_db()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = '{}');".format(table_name))
        result = cursor.fetchone()[0]
        cursor.close()
    except Exception as e:
        print(e)
    finally:
        conn.close()

    return result


def handle_chunk_creation(chunk_size: int, map_array: np.ndarray, height_offset, width_offset) -> np.ndarray:
    """Convert the map into chunks of given size and save them using multiprocessing"""

    # Create a ressource manager + lists to give to processess.
    manager = multiprocessing.Manager()
    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())

    shared_chunks = manager.list()
    tasks = []

    # Create chunks of given size
    map_array = chunk_generator(map_array, chunk_size, chunk_size)

    # Pass line of chunks to tasks list
    for current_height, line in enumerate(map_array):
        tasks.append((current_height + height_offset, line, width_offset))
        shared_chunks.append(
            (current_height + height_offset, line, width_offset))

    # Start executings the processes
    try:
        results = pool.starmap(handle_chunk_line, tasks)
    except Exception as e:
        print(e)

    # Get the results + close the pool of processes
    results = [item for sublist in results for item in sublist]

    pool.close()
    pool.join()

    # Convert the results to CSV-like file + save them
    file = StringIteratorIO(
        ('|'.join(map(clean_csv_value, tuple(chunk))) + '\n' for chunk in results))
    save_chunks("chunks".format(chunk_size), file)

    # return the map back to normal
    return map_array.swapaxes(1, 2).reshape(config.MAP_HEIGHT, config.MAP_WIDTH)


def handle_chunk_line(current_height, chunk_line, width_offset) -> list:
    """Take a line of chunk and calculate the data for each chunk before returning the result as an array
    """
    chunks = []
    for current_width, chunk in enumerate(chunk_line):
        # ignore the chunk if there is no value different of 0
        if np.count_nonzero(chunk != 0):
            chunks.append(calculate_zone_data(current_height,
                          current_width + width_offset, chunk))

    return chunks


def calculate_zone_data(current_height, current_width, values: np.ndarray) -> tuple:
    """Return height, width, 25% median, 50% median, 75% median, mean, standart deviation and variance of given chunk
    """

    if type(values) == np.ndarray:
        # filter out the 0
        values = values[values != 0]
        if not len(values):
            # if no value left return tuple with 0 values
            return(current_height, current_width, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00)

    low_median = round(np.quantile(values, 0.25), 3)
    median = round(np.median(values), 3)
    high_median = round(np.quantile(values, 0.75), 3)
    mean = round(np.average(values), 3)
    standart_deviation = round(np.std(values), 3)
    # Can't calculate variance over only 1 value
    if len(values) > 1:
        variance = round(np.var(values), 3)
    else:
        variance = 0.00

    return (round(current_height), round(current_width), low_median, median, high_median, mean, standart_deviation, variance)


def chunk_generator(map: np.ndarray, new_height: int, new_width: int):
    """Take a map and split it into chunk of given height and width
    """

    current_height, current_width = map.shape
    assert current_height % new_height == 0, f"{new_height} rows is not divible by {new_height}"
    assert current_width % new_width == 0, f"{current_width} rows is not divible by {new_width}"

    return map.reshape(current_height // new_height, new_height, -1, new_width).swapaxes(1, 2)


def get_table_count(table_name: str) -> int:
    """Return row count of given table
    """

    conn = connect_to_db()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM {};".format(table_name))
        count = cursor.fetchone()[0]
        cursor.close()
        conn.commit()
    except Exception as e:
        print("erreur dans table count")
        print(e)
    finally:
        conn.close()
    return count


class StringIteratorIO(io.TextIOBase):
    """Convert text to CSV-like file buffer
    """

    def __init__(self, iter: Iterator[str]):
        self._iter = iter
        self._buff = ''

    def readable(self) -> bool:
        return True

    def _read1(self, n: Optional[int] = None) -> str:
        while not self._buff:
            try:
                self._buff = next(self._iter)
            except StopIteration:
                break
        ret = self._buff[:n]
        self._buff = self._buff[len(ret):]
        return ret

    def read(self, n: Optional[int] = None) -> str:
        line = []
        if n is None or n < 0:
            while True:
                m = self._read1()
                if not m:
                    break
                line.append(m)
        else:
            while n > 0:
                m = self._read1(n)
                if not m:
                    break
                n -= len(m)
                line.append(m)
        return ''.join(line)


def save_chunks(table_name: str, iterator: StringIteratorIO):
    """Save the chunks using CSV-like file buffer
    """

    conn = connect_to_db()
    conn.autocommit = True
    try:
        cursor = conn.cursor()
        cursor.copy_from(
            iterator,
            table=table_name,
            sep='|',
            size=8192,
            columns=(
                'y_pos',
                'x_pos',
                'median_low',
                'median',
                'median_high',
                'mean',
                'standart_deviation',
                'variance'
            ))
        cursor.close()
        conn.commit()

    except Exception as e:
        print(e)
    finally:
        conn.close()


def get_current_max_zone():
    """Return current last zone_id
    """
    conn = connect_to_db()

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(zone_id) FROM nodes;")
        current_max = cursor.fetchone()[0]
        cursor.close()
    except Exception as e:
        print("Erreur dans la requete de max zone")
        print(e)
    finally:
        conn.close()

    if current_max:
        return current_max
    else:
        return 0


def handle_node_creation(map_array: np.ndarray, height_offset: int, width_offset: int):
    """Take a 2d array and save its nodes
    """

    # Create a binary mask and create isolated regions
    binary = map_array != 0
    label_image = label(binary, connectivity=2)
    regions = regionprops(label_image)

    # Get zone offset to start with
    zone_offset = get_current_max_zone()
    node_data = []

    # Take each zone and fill the array until 500k, save those and empty the array
    # Continue until all regions are finished
    for zone_id, region in enumerate(regions):
        for node in region.coords:
            node_data.append((node[1] + width_offset, node[0] + height_offset,
                             map_array[node[0]][node[1]], zone_id + zone_offset))
            if len(node_data) > 500000:
                save_nodes(StringIteratorIO(
                    ('|'.join(map(clean_csv_value, tuple(node))) + '\n' for node in node_data)))
                node_data = []

    # Save remaining nodes
    if len(node_data):
        save_nodes(StringIteratorIO(
            ('|'.join(map(clean_csv_value, tuple(node))) + '\n' for node in node_data)))


def save_nodes(node_iterator: StringIteratorIO):
    """Save nodes using CSV-like file buffer
    """

    conn = connect_to_db()
    conn.autocommit = True
    try:
        cursor = conn.cursor()
        cursor.copy_from(
            node_iterator,
            table='nodes',
            sep='|',
            size=16384,
            columns=('x_pos', 'y_pos', 'elevation_value', 'zone_id'))
        cursor.close()
        conn.commit()

    except Exception as e:
        print(e)
    finally:
        conn.close()


def get_vertical_borders(width_coords: tuple, height_coords: tuple) -> list:

    """Return all nodes where y_pos and y_pos + 1 have different zone_id 
    """

    min_height = height_coords[0]
    max_height = height_coords[1]
    x_pos = width_coords[1] - 1
    x_pos_plus = width_coords[1]

    conn = connect_to_db()
    query = """
        SELECT t1.zone_id, t2.zone_id
        FROM nodes t1
        INNER JOIN nodes t2 ON t1.y_pos = t2.y_pos 
        AND t1.x_pos = {} 
        AND t2.x_pos = {} 
        AND t1.zone_id <> t2.zone_id
        WHERE t1.y_pos > {}
        AND t1.y_pos < {};
    """.format(x_pos, x_pos_plus, min_height, max_height)

    try:
        cursor = conn.cursor()
        cursor.execute(query)
        nodes = cursor.fetchall()
        cursor.close()

    except Exception as e:
        nodes = None
        print(e)
    finally:
        conn.close()

    return nodes


def get_horizontal_borders(width_coords: tuple, height_coords: tuple) -> list:

    """Return all nodes where x_pos and x_pos + 1 have different zone_id 
    """

    min_width = width_coords[0]
    max_width = width_coords[1]
    y_pos = height_coords[1] - 1
    y_pos_plus = height_coords[1]

    conn = connect_to_db()
    query = """
        SELECT t1.zone_id, t2.zone_id
        FROM nodes t1
        INNER JOIN nodes t2 ON t1.x_pos = t2.x_pos 
        AND t1.y_pos = {} 
        AND t2.y_pos = {} 
        AND t1.zone_id <> t2.zone_id
        WHERE t1.x_pos > {}
        AND t1.x_pos < {}
    """.format(y_pos, y_pos_plus, min_width, max_width)

    try:
        cursor = conn.cursor()
        cursor.execute(query)
        nodes = cursor.fetchall()
        cursor.close()

    except Exception as e:
        nodes = None
        print(e)
    finally:
        conn.close()
    return nodes


def create_regions(regions: list):

    """Create a region for each region in given list
    """

    conn = connect_to_db()

    #Must use a tuple to pass it as parameter
    regions = [((region,)) for region in regions]

    try:
        cursor = conn.cursor()
        cursor.executemany("INSERT INTO regions (zones) VALUES (%s)", regions)
        cursor.close()
        conn.commit()
    except Exception as e:
        print(e)
    finally:
        conn.close()


def handle_regions(border_to_check: list):

    """Take all borders to check, search for neighboring nodes with differents zone_id and create regions with thoses
    """

    #Get alls nodes from borders to check
    all_borders_nodes = []
    for coords in border_to_check:
        if "v" in coords[0]:
            all_borders_nodes += list(
                set(get_vertical_borders(coords[1], coords[2])))

        if "h" in coords[0]:
            all_borders_nodes += list(
                set(get_horizontal_borders(coords[1], coords[2])))

    #Check for neighboring nodes with differents id and group them
    regions = []
    while len(all_borders_nodes):

        to_delete = [0]
        region = {all_borders_nodes[0][0], all_borders_nodes[0][1]}

        for j in range(1, len(all_borders_nodes)):
            if all_borders_nodes[j][0] in region:
                region.add(all_borders_nodes[j][1])
                to_delete.append(j)
            elif all_borders_nodes[j][1] in region:
                region.add(all_borders_nodes[j][0])
                to_delete.append(j)

        regions.append(list(region))
        all_borders_nodes = [v for i, v in enumerate(
            all_borders_nodes) if i not in to_delete]

    #save those groups
    create_regions(regions)


def create_elevation_array(chunk_id):
    """Get all nodes corresponding to those of the chunk id
    """

    conn = connect_to_db()

    # Query the database for nodes within the specified range
    cur = conn.cursor()
    cur.execute("SELECT * FROM chunks WHERE id={}".format(chunk_id))
    chunk_data = cur.fetchone()

    min_x = chunk_data[1]*64
    max_x = chunk_data[1]*64 + 64
    min_y = chunk_data[2]*64
    max_y = chunk_data[2]*64 + 64

    chunk_data = {
        "id": chunk_data[0],
        "x_pos": chunk_data[1],
        "y_pos": chunk_data[2],
        "low_median": chunk_data[3],
        "median": chunk_data[4],
        "high_median": chunk_data[5],
        "mean": chunk_data[6],
        "variance": chunk_data[7],
        "standart_deviation": chunk_data[8]
    }

    width = max_x - min_x + 1
    height = max_y - min_y + 1
    elevation_array = np.zeros((height, width), dtype=int)

    cur.execute("SELECT x_pos, y_pos, elevation_value FROM nodes WHERE x_pos BETWEEN %s AND %s AND y_pos BETWEEN %s AND %s",
                (min_x, max_x, min_y, max_y))

    # Iterate over the rows returned by the query, and update the corresponding entries in the array
    for row in cur:
        x_pos = row[0] - min_x
        y_pos = row[1] - min_y
        elevation_value = row[2]
        elevation_array[y_pos][x_pos] = elevation_value

    return elevation_array, chunk_data


def get_deliberate_array(start_width, end_width, start_height, end_height) -> np.ndarray:
    """Return np array filled with nodes within specified range
    """

    conn = connect_to_db()

    # Query the database for nodes within the specified range
    cur = conn.cursor()

    width = end_width - start_width + 1
    height = end_height - start_height + 1
    elevation_array = np.zeros((height, width), dtype=int)

    cur.execute("SELECT x_pos, y_pos, elevation_value FROM nodes WHERE x_pos BETWEEN %s AND %s AND y_pos BETWEEN %s AND %s",
                (start_width, end_width, start_height, end_height))

    # Iterate over the rows returned by the query, and update the corresponding entries in the array
    for row in cur:
        x_pos = row[0] - start_width
        y_pos = row[1] - start_height
        elevation_value = row[2]
        elevation_array[y_pos][x_pos] = elevation_value

    return elevation_array


def plot_3d_surface(array: np.ndarray, chunk_data: dict):
    """Create 3d plot + related data and save it
    """

    # Create figure with 3d plot
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # Get array shape
    x_dim, y_dim = array.shape

    # Create np array needed for 3d plot
    x, y = np.meshgrid(np.arange(x_dim), np.arange(y_dim))
    x = x.transpose((1, 0))
    y = y.transpose((1, 0))

    # Plot the surface
    ax.plot_surface(x, y, array, cmap='viridis',
                    linewidth=0, antialiased=False)

    # Add label on plot
    ax.set_zlabel('Hauteur en mètres')
    ax.set_zlim(0, 5000)

    string = """
        Chunk id: {} X: {} Y: {}\n
        25% median: {} Median: {} 75% median: {}\n
        Mean: {} Variance: {} Standart Deviation: {}
    """.format(
        chunk_data["id"],
        chunk_data["x_pos"],
        chunk_data["y_pos"],
        chunk_data["low_median"],
        chunk_data["median"],
        chunk_data["high_median"],
        chunk_data["mean"],
        chunk_data["variance"],
        chunk_data["standart_deviation"]
    )
    #Add text and save figure
    plt.gcf().text(0.02, 0.02, string, fontsize=6)
    plt.savefig(
        "/3d_plots/{}_{}_{}.jpg".format(chunk_data["id"], chunk_data["x_pos"], chunk_data["y_pos"]))
    #Close the figure or it create memory leak
    plt.close()


def plot_2d_surface(array: np.ndarray, chunk_data: dict):
    """Create 2d plot + related data and save it to a file
    """

    #Replace all value of 0 by 5000
    array[array == 0] = 5000
    
    #Create 3d reliefs 
    hillshade = es.hillshade(array, azimuth=180, altitude=1)

    fig, ax = plt.subplots()

    #Create the 2d plot
    plt.imshow(array, cmap='Spectral')

    #Add 3d relief on top of it
    ax.imshow(hillshade, cmap="Greys", alpha=0.3)
    ax.axis('off')

    string = """
        Chunk id: {} X: {} Y: {}\n
        25% median: {} Median: {} 75% median: {}\n
        Mean: {} Variance: {} Standart Deviation: {}
    """.format(
        chunk_data["id"],
        chunk_data["x_pos"],
        chunk_data["y_pos"],
        chunk_data["low_median"],
        chunk_data["median"],
        chunk_data["high_median"],
        chunk_data["mean"],
        chunk_data["variance"],
        chunk_data["standart_deviation"]
    )

    #Add text and save
    plt.gcf().text(0.02, 0.87, string, fontsize=6)
    plt.savefig(
        "/2d_plots/{}_{}_{}.jpg".format(chunk_data["id"], chunk_data["x_pos"], chunk_data["y_pos"]))
    
    #Close the figure or it create memory leak
    plt.close()


def plot_chunks(array: np.ndarray, size, x_pos, y_pos):

    """Create 2d plot and save it on a file
    """

    #Replace 0 by 5000
    array[array == 0] = 5000

    #Create 3d relief
    hillshade = es.hillshade(array, azimuth=180, altitude=1)

    fig, ax = plt.subplots()

    #Create 2d + add the relief to it
    plt.imshow(array, cmap='Spectral')
    ax.imshow(hillshade, cmap="Greys", alpha=0.3)
    ax.axis('off')

    #Save to file and close
    plt.savefig("./chunks/size_{}_{}/{}_{}.jpg".format(
        size[0], size[1], y_pos, x_pos), bbox_inches='tight', pad_inches=0.0)
    plt.close()


def handle_saved_chunks():

    """Create image for each chunk in database using multiprocessing
    """

    #Get max chunk to check
    chunk_count = get_table_count("chunks")

    #Create pool of processes + tasks to give them
    manager = multiprocessing.Manager()
    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())

    shared_chunks = manager.list()
    tasks = []

    for chunk_id in range(1, chunk_count+1):
        function_data = (chunk_id, )
        tasks.append(function_data)
        shared_chunks.append(function_data)

    #Start the processes
    try:
        pool.starmap(create_plot_chunks_in_db, tasks)
    except Exception as e:
        print(e)

    #Close the pool

    pool.close()
    pool.join()


def check_images_integrity():

    """Check all images and delete them if corrupted
    """

    redo_2d_plots = set()
    redo_3d_plots = set()
    redo_chunk_128 = set()
    redo_chunk_256 = set()
    redo_chunk_512 = set()
    redo_chunk_1024 = set()
    redo_chunk_2048 = set()

    for filename in os.listdir('/2d_plots/'):
        try:
            img = PIL.Image.open('/2d_plots/'+filename)  # open the image file
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_2d_plots.add(filename)
            os.remove('/2d_plots/'+filename)

    for filename in os.listdir('/3d_plots/'):
        try:
            img = PIL.Image.open('/3d_plots/'+filename)  # open the image file
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_3d_plots.add(filename)
            os.remove('/3d_plots/'+filename)

    for filename in os.listdir('/chunks/size_150_100/'):
        try:
            img = PIL.Image.open('/chunks/size_150_100/' +
                                 filename)  # open the image file
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_chunk_128.add(filename)
            os.remove('/chunks/size_150_100/'+filename)

    for filename in os.listdir('/chunks/size_300_200/'):
        try:
            img = PIL.Image.open('/chunks/size_300_200/' +
                                 filename)  # open the image file
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_chunk_256.add(filename)
            os.remove('/chunks/size_300_200/'+filename)

    for filename in os.listdir('/chunks/size_600_400/'):
        try:
            img = PIL.Image.open('/chunks/size_600_400/' +
                                 filename)  # open the image file
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_chunk_512.add(filename)
            os.remove('/chunks/size_600_400/'+filename)

    for filename in os.listdir('/chunks/size_1200_800/'):
        try:
            # open the image file
            img = PIL.Image.open('/chunks/size_1200_800/'+filename)
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_chunk_1024.add(filename)
            os.remove('/chunks/size_1200_800/'+filename)

    for filename in os.listdir('/chunks/size_2400_1600/'):
        print(filename)
        try:
            # open the image file
            img = PIL.Image.open('/chunks/size_2400_1600/'+filename)
            img.verify()  # verify that it is, in fact an image
        except (IOError, SyntaxError) as e:
            print(filename)
            redo_chunk_2048.add(filename)
            os.remove('/chunks/size_2400_1600/'+filename)

    print(redo_2d_plots)
    print(redo_3d_plots)
    print(redo_chunk_128)
    print(redo_chunk_256)
    print(redo_chunk_512)
    print(redo_chunk_1024)
    print(redo_chunk_2048)


def create_plot_chunks_in_db(chunk_id):
    """ Get map corresponding to chunk + its data + create images of it
    """
    chunk_map, chunk_data = create_elevation_array(chunk_id)
    plot_3d_surface(chunk_map, chunk_data)
    plot_2d_surface(chunk_map, chunk_data)


def handle_chunks_images():

    """Create images for each chunk using multiprocessing
    """

    total_map_width = config.MAP_WIDTH * 2 + 1
    total_map_height = config.MAP_HEIGHT * 2 + 1

    #Create pool of processes + dispatch tasks
    manager = multiprocessing.Manager()
    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())

    shared_chunks = manager.list()
    tasks = []

    #Take all chunk size except last because of limited ram issues
    for size in config.CHUNK_SIZES[0:-2]:
        for height in range(0, total_map_height, size[1]):
            for width in range(0, total_map_width, size[0]):
                function_data = (size, width, width +
                                 size[0], height, height + size[1])
                tasks.append(function_data)
                shared_chunks.append(function_data)

    #Start processes
    try:
        pool.starmap(create_chunks_images, tasks)
    except Exception as e:
        print(e)

    #Close pools
    pool.close()
    pool.join()
    
    #Do the remaining chunk sizes the normal way
    for size in config.CHUNK_SIZES[-1:]:
        for height in range(0, total_map_height, size[1]):
            for width in range(0, total_map_width, size[0]):
                create_chunks_images(size, width, width +
                                     size[0], height, height + size[1])


def create_chunks_images(size, width, width_max, height, height_max):
    """Get array corresponding to given range and create images of it if not empty
    """
    chunk_map = get_deliberate_array(width, width_max, height, height_max)
    if np.count_nonzero(chunk_map != 0):
        plot_chunks(chunk_map, size, width, height)


def create_indexes():
    # Create the index on x_pos and y_pos to speedup the searches of nodes
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        query_string = "CREATE INDEX idx_node_pos ON nodes (x_pos, y_pos);"
        cursor.execute(query_string)
        cursor.close()
        conn.commit()
    except Exception as e:
        print(e)

    finally:
        conn.close()

    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        query_string = "CREATE INDEX nodes_zone_id_x_pos_y_pos ON nodes (x_pos, y_pos, zone_id);"
        cursor.execute(query_string)
        cursor.close()
        conn.commit()
    except Exception as e:
        print(e)

    finally:
        conn.close()

def get_zones_data():

    query = """
        SELECT zone_id, MIN(x_pos), MAX(x_pos), MIN(y_pos), MAX(y_pos), COUNT(*)
        FROM "nodes"
        GROUP BY zone_id
    """
    conn = connect_to_db()
    cursor = conn.cursor()
    cursor.execute(query)
    zones_id = cursor.fetchall()

    return [(zone_id[0], zone_id[1], zone_id[2], zone_id[3], zone_id[4], zone_id[5],) for zone_id in zones_id]


def populate_zone_data():

    zones = get_zones_data()
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        psycopg2.extras.execute_values(
            cursor, "INSERT INTO zone_data (zone_id, min_x_pos , max_x_pos, min_y_pos, max_y_pos, count) VALUES %s", zones)
        cursor.close()
        conn.commit()
    except Exception as e:
        print(e)
    finally:
        conn.close()


def setup_db(file_array: str) -> None:

    """Seed the database with the data on given file array
    """

    #Get time at the start
    start_time = time.time()

    #Check if tables exists and create them if not
    for table_name, query in config.TABLES_NAME.items():
        table_exist = check_table_exists(table_name)
        if table_exist:
            print("Table {} already exists, skipping creation.".format(table_name))
        else:
            print("Creating table {}...".format(table_name))
            create_table(query)

    uncomplete_tables = []

    #Check if tables are empty and create task if yes
    for table in config.TABLES_TO_CHECK:
        count = get_table_count(table)
        if count:
            print("Table {} already complete, skipping processing.".format(table))
        else:
            print("Table {} empty, adding to processing list.".format(table))
            uncomplete_tables.append(table)

    #If everything is already done, skip all
    if not len(uncomplete_tables):
        print("Nothing to process, starting the API.")
        return

    borders_to_check = []

    #Iterate over files and create data for it
    for current_height, line in enumerate(file_array):
        for current_width, map in enumerate(line):
            map_array = get_file_dataset(map)

            height_offset = current_height * config.MAP_HEIGHT
            width_offset = current_width * config.MAP_WIDTH

            alignmnent = ""
            min_width_to_check = current_width * config.MAP_WIDTH
            max_width_to_check = (current_width + 1) * config.MAP_WIDTH
            min_height_to_check = current_height * config.MAP_HEIGHT
            max_height_to_check = (current_height + 1) * config.MAP_HEIGHT

            if current_width != len(file_array[0]) - 1:
                alignmnent += "v"
            if current_height != len(file_array) - 1:
                alignmnent += "h"

            borders_to_check.append(
                (alignmnent, (min_width_to_check, max_width_to_check), (min_height_to_check, max_height_to_check)))

            if "chunks" in uncomplete_tables:
                map_array = handle_chunk_creation(
                    64, map_array, height_offset/64, width_offset/64)
                print("Finished chunks pour map ({},{})".format(
                    current_width, current_height))
            if "nodes" in uncomplete_tables:
                handle_node_creation(map_array, height_offset, width_offset)
                print("Finished nodes for map ({},{})".format(
                    current_width, current_height))

    #Create the regions for neighboring node with different zone_id
    print("Starting regions creations...")
    handle_regions(borders_to_check)
    print("Finished regions creations")

    #Create the index on x_pos and y_pos
    print("Starting indexing...")
    create_indexes()
    print("Finished indexing")

    print("Creating zone_data...")
    populate_zone_data()
    print("Finished zone_data...")

    #Create images for each chunk on database
    print("Creating saved chunks files...")
    # handle_saved_chunks()
    print("Finished saved chunks files.")

    #Create image for each chunk for every size
    print("Creating chunks images...")
    # handle_chunks_images()
    print("Finished chunks images.")

    #Check for corrupted images and delete them
    print("Starting check of images integrity...")
    # check_images_integrity()
    print("Finished images check")

    #Get time at the end and print how much it took
    end_time = time.time()

    print("Durée d'execution: ", end_time - start_time)

