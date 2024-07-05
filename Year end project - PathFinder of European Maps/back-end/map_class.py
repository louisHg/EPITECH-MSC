import numpy as np
from node_class import CalculationNode, BaseNode
from skimage.measure import label, regionprops
from config import MAP_DIRECTIONS, get_opposite_direction, MAP_HEIGHT, MAP_WIDTH, MAPS_ARRAY
import math
import time
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from typing import Dict, Tuple, List
import matplotlib.pyplot as plt
import earthpy.spatial as es
from functools import lru_cache
from decorators import timing, freezeargs
import pygame
from pygame_configs import *
from pygame.locals import *


DISPLAY_MAP = False
DISPLAY_ALGO_RUNNING = False


class Chunk():
    __slots__ = "x", "y", "map", "last_checked", "is_full_map", "left_edge", "top_edge", "width", "heigth", "zones_id", "is_valid", "max_elevation"

    DEFAULT_HEIGHT = 400
    DEFAULT_WIDTH = 600

    def __init__(self, left_edge, top_edge, zones_id, x=None, y=None, width=DEFAULT_WIDTH, heigth=DEFAULT_HEIGHT, is_full_map=False) -> None:

        self.left_edge = left_edge
        self.top_edge = top_edge

        self.x = x
        self.y = y

        self.width = width
        self.heigth = heigth

        self.zones_id = zones_id
        self.is_full_map = is_full_map

        self.last_checked = time.time()

        if is_full_map:
            print("Initializing full map of zone {} of dimension {} starting at positions {}.".format(
                zones_id, (width, heigth), (self.left_edge, self.top_edge)))
        else:
            print("Initializing chunk coordinates: {} of zone {} of dimension {} starting at positions {}.".format(
                (x, y), zones_id, (width, heigth), (self.left_edge, self.top_edge)))

        self.map = np.zeros((heigth, width), dtype=int)
        self.load_chunk()
        if self.is_valid and DISPLAY_MAP:
            self.plot_chunk()
        
        self.max_elevation = np.amax(self.map)

    def connect_to_db(self):
        """Open a connexion to the database using the .env informations
        """
        connexion = psycopg2.connect(
            host=os.environ["DB_HOST"],
            database=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            port=os.environ["DB_PORT"])

        return connexion

    def load_chunk(self):
        conn = self.connect_to_db()
        cur = conn.cursor()

        if self.width == self.DEFAULT_WIDTH:
            width = self.width - 1
        else:
            width = self.width

        if self.heigth == self.DEFAULT_HEIGHT:
            heigth = self.heigth - 1
        else:
            heigth = self.heigth

        cur.execute("SELECT x_pos, y_pos, elevation_value FROM nodes WHERE x_pos BETWEEN %s AND %s AND y_pos BETWEEN %s AND %s AND zone_id = ANY(%s)",
                    (self.left_edge, self.left_edge + width,
                     self.top_edge, self.top_edge + heigth,
                     self.zones_id))

        count = 0

        for row in cur:
            count += 1
            x_pos = row[0] - self.left_edge
            y_pos = row[1] - self.top_edge
            self.map[y_pos][x_pos] = row[2]

        if count > 0:
            self.is_valid = True
            print("{} nodes inside.".format(count))

        else:
            self.is_valid = False
            self.map = None
            print("Invalid chunk, 0 nodes found.")

    def plot_chunk(self):
        """Create 2d plot and save it on a file
        """

        # Replace 0 by 5000
        array = self.map
        array[array == 0] = 5000

        # Create 3d relief
        hillshade = es.hillshade(array, azimuth=180, altitude=1)

        fig, ax = plt.subplots()

        # Create 2d + add the relief to it
        plt.imshow(array, cmap='Spectral')
        plt.ticklabel_format(useOffset=False)
        ax.imshow(hillshade, cmap="Greys", alpha=0.3)
        ax.axis('off')

        # Save to file and close
        plt.show()
        plt.close()

    def __repr__(self) -> str:
        return "<Chunk zone_id: {} left_edge: {} top_edge: {} width: {} heigth: {} >".format(self.zones_id, self.left_edge, self.top_edge, self.width, self.heigth)
        
    def setup_map_visual(self, limitations, dimension: int, offset_x, offset_y) -> List[List[BaseNode]]:

        base_node_list = []
        for y, row in enumerate(self.map):
            new_row = []
            for x, column in enumerate(row):
                color = interpolate(LIGHTEST_GREEN, DARKEST_GREEN, column / self.max_elevation)

                if column == 0:
                    color = BLUE
                if "min_elevation" in limitations and column < limitations["min_elevation"]:
                    color = BLACK
                if "max_elevation" in limitations and column > limitations["max_elevation"]:
                    color = BLACK

                node = BaseNode((x, y), column, color)
                
                node.set_drawn_position((x * dimension + offset_x, y * dimension + offset_y))
                new_row.append(node)
            base_node_list.append(new_row)
    
        return base_node_list



class Zone():
    __slots__ = ("chunk_manager", "zones_id", "count", "is_chunkable", "last_checked", "is_stitched",
                 "top_edge", "bot_edge", "left_edge", "right_edge",
                 "min_chunk_x", "max_chunk_x", "min_chunk_y", "max_chunk_y")

    CHUNK_HEIGHT = 400
    CHUNK_WIDTH = 600

    def __init__(self, zones_id, is_stitched) -> None:

        # La zone_id représente juste l'id de la zone donnée
        if isinstance(zones_id, int):
            self.zones_id = [zones_id]
        if isinstance(zones_id, list):
            self.zones_id = zones_id

        self.is_stitched = is_stitched

        # Récupère les points en haut a gauche et bas a droite de la zone + le nombre de nodes maximum dans la zone
        self.get_zone()
        self.last_checked = time.time()

        print("Initializing zone {}, Chunkable: {}, Stitched: {}".format(
            self.zones_id, self.is_chunkable, self.is_stitched))

        self.chunk_manager: Dict[Tuple[int, int], Chunk] = {}

        if not self.is_chunkable and not self.is_stitched:
            self.chunk_manager["full"] = Chunk(left_edge=self.left_edge,
                                               top_edge=self.top_edge,
                                               width=self.right_edge - self.left_edge + 1,
                                               heigth=self.bot_edge - self.top_edge + 1,
                                               zones_id=self.zones_id,
                                               is_full_map=True)

    def connect_to_db(self):
        """Open a connexion to the database using the .env informations
        """
        connexion = psycopg2.connect(
            host=os.environ["DB_HOST"],
            database=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            port=os.environ["DB_PORT"])

        return connexion

    def get_zone(self):
        conn = self.connect_to_db()
        cursor = conn.cursor()

        # Si plusieurs zones, on récupère les datas de toutes les zones
        if len(self.zones_id) != 1:
            query = """
                SELECT min_x_pos, max_x_pos, min_y_pos, max_y_pos, count
                FROM zone_data
                WHERE zone_id IN %s
            """

            cursor.execute(query, tuple(self.zones_id))
            zones_data = cursor.fetchall()

            # On additionne le count de toutes les zones stitchées
            count = 0
            for zone_data in zones_data:
                count += zone_data[4]

            self.count = count

        # Sinon de la première (et seule)
        else:
            query = """
                SELECT min_x_pos, max_x_pos, min_y_pos, max_y_pos, count
                FROM zone_data
                WHERE zone_id = {}
            """.format(self.zones_id[0])

            cursor.execute(query)
            zone_data = cursor.fetchone()

            self.count = zone_data[4]

        # Si la zone est plus grande que la taille d'un chunk alors elle sera coupée en chunks
        if self.count > self.CHUNK_HEIGHT * self.CHUNK_WIDTH:
            self.is_chunkable = True

            # Si elle est stitchée, on récupère considère les limites comme étant les plus hautes / basses
            # De plus les zones chargées sont les chunks de 300*200 selon la map globales
            if self.is_stitched:
                left_edge = 999999
                top_edge = 999999
                right_edge = 0
                bot_edge = 0

                for zone_data in zones_data:
                    if zone_data[0] < left_edge:
                        left_edge = zone_data[0]
                    if zone_data[1] > right_edge:
                        right_edge = zone_data[1]
                    if zone_data[2] < top_edge:
                        top_edge = zone_data[2]
                    if zone_data[3] > bot_edge:
                        bot_edge = zone_data[3]

                zero_chunk = self.get_chunk_coordinates(left_edge, top_edge)
                last_chunk = self.get_chunk_coordinates(right_edge, bot_edge)

                self.min_chunk_x, self.max_chunk_y = zero_chunk
                self.max_chunk_x, self.max_chunk_y = last_chunk

                self.left_edge = zero_chunk[0] * self.CHUNK_WIDTH
                self.top_edge = zero_chunk[1] * self.CHUNK_HEIGHT
                self.right_edge = last_chunk[0] * self.CHUNK_WIDTH
                self.bot_edge = last_chunk[1] * self.CHUNK_WIDTH

            else:
                zero_chunk = self.get_chunk_coordinates(
                    zone_data[0], zone_data[2])
                last_chunk = self.get_chunk_coordinates(
                    zone_data[1], zone_data[3])

                self.min_chunk_x, self.max_chunk_y = zero_chunk
                self.max_chunk_x, self.max_chunk_y = last_chunk

                self.left_edge = zero_chunk[0] * self.CHUNK_WIDTH
                self.top_edge = zero_chunk[1] * self.CHUNK_HEIGHT
                self.right_edge = last_chunk[0] * self.CHUNK_WIDTH
                self.bot_edge = last_chunk[1] * self.CHUNK_WIDTH

        else:
            # Les plus petites zones peuvent se permettrent uniquement de charger le strict minimum
            self.is_chunkable = False
            if self.is_stitched:
                left_edge = 999999
                top_edge = 999999
                right_edge = 0
                bot_edge = 0

                for zone_data in zones_data:
                    if zone_data[0] < left_edge:
                        left_edge = zone_data[0]
                    if zone_data[1] > right_edge:
                        right_edge = zone_data[1]
                    if zone_data[2] < top_edge:
                        top_edge = zone_data[2]
                    if zone_data[3] > bot_edge:
                        bot_edge = zone_data[3]

                self.left_edge = left_edge
                self.right_edge = right_edge
                self.top_edge = top_edge
                self.bot_edge = bot_edge

            else:
                self.left_edge = zone_data[0]
                self.right_edge = zone_data[1]
                self.top_edge = zone_data[2]
                self.bot_edge = zone_data[3]

        cursor.close()
        conn.close()

    def get_chunk_coordinates(self, x_pos: int, y_pos: int):
        # Les chunks peuvent pas être négatifs
        # On vérifie donc que les positions données sont bien des int positif ou nul
        assert type(x_pos) == int and x_pos >= 0
        assert type(y_pos) == int and y_pos >= 0
        chunk_x = math.floor(x_pos / self.CHUNK_WIDTH)
        chunk_y = math.floor(y_pos / self.CHUNK_HEIGHT)
        return (chunk_x, chunk_y)

    def load_chunk_by_node_pos(self, position):
        # Si y a pas de chunk, la map normalement déjà loaded avec un key "full"
        if not self.is_chunkable:
            return
        # Si il y a stitch a faire, on utilisera les coordonnées de chunks globale pour facilité le repérage de chunk
        # Sinon on utilsera les coordonnées de chunks locals car pas besoin de communiquer avec d'autres chunks

        x_chunk, y_chunk = self.get_chunk_coordinates(position[0], position[1])
        if not (x_chunk, y_chunk) in self.chunk_manager:
            self.chunk_manager[(x_chunk, y_chunk)] = Chunk(x=x_chunk,
                                                           y=y_chunk,
                                                           left_edge=x_chunk * self.CHUNK_WIDTH,
                                                           top_edge=y_chunk * self.CHUNK_HEIGHT,
                                                           zones_id=self.zones_id)

        print("Loading global chunk {} for zone {}.".format((x_chunk, y_chunk), self.zones_id))

    def load_chunk(self, chunk_coordinates: Tuple[int, int]):
        # Si y a pas de chunk ça sert a rien de les charger
        if not self.is_chunkable and not self.is_stitched:
            print("Zone {} is not chunkable.")
            return
        
        self.chunk_manager[chunk_coordinates] = Chunk(x=chunk_coordinates[0],
                                                      y=chunk_coordinates[1],
                                                        left_edge=chunk_coordinates[0] *
                                                      self.CHUNK_WIDTH,
                                                      top_edge=chunk_coordinates[1] *
                                                      self.CHUNK_HEIGHT,
                                                      zones_id=self.zones_id)
        print("Loading global chunk {} for zone {}".format(chunk_coordinates, self.zones_id))



class Map():
    # Le __slots__ est une méthode qui limite la mémoire prise par la classe dans la mémoire
    # En contrepartie les seuls propriétés enregistrables sont celles données en paramètres.
    __slots__ = "zone_manager", "stitches"

    CHUNK_HEIGHT = 400
    CHUNK_WIDTH = 600

    def __init__(self):
        # La map est un objet avec comme clé la zone_id
        # Les zones stitchées ont également une clé, mais elles pointent toutes vers le même objet.
        self.zone_manager: Dict[int, Zone] = {}
        self.stitches = self.get_regions_stitches()

    def get_regions_stitches(self):
        # Fait une requete SQL pour aller chercher les zones séparées dans la DB alors que liées dans la réalité
        try:
            query = "SELECT zones FROM regions"
            conn = self.connect_to_db()
            cursor = conn.cursor()
            cursor.execute(query)
            stitches = cursor.fetchall()
            new_stitches = []
            for stitch in stitches:
                new_stitches.append(stitch[0])

        except Exception as e:
            stitch = None
            print(e)
        finally:
            cursor.close()
            conn.close()
            return new_stitches

    def get_node(self, pos_x, pos_y, zone_id: int = None) -> CalculationNode:

        if zone_id:
            zone = self.zone_manager[zone_id]
            if not zone.is_chunkable:
                chunk = zone.chunk_manager["full"]
            else:
                chunk_coordinates = self.get_global_chunk_coordinates(pos_x, pos_y)
                if not chunk_coordinates in zone.chunk_manager:
                    zone.load_chunk(chunk_coordinates)
                chunk = zone.chunk_manager[chunk_coordinates]
            
            if not chunk.is_valid:
                return None

            x, y = ((pos_x - chunk.left_edge),
                    (pos_y - chunk.top_edge))

            try:
                elevation = chunk.map[(y, x)]
            except IndexError:
                return None
            if not elevation or elevation == 5000:
                return None
            else:
                return CalculationNode((pos_x, pos_y), elevation, zone_id)

        # Return a specific node with the specified X and Y
        sql_node = None
        query_string = "SELECT x_pos, y_pos, elevation_value, zone_id FROM nodes WHERE x_pos={} AND y_pos={};".format(
            pos_x, pos_y)

        conn = self.connect_to_db()
        try:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query_string)
            sql_node = cursor.fetchone()
            cursor.close()

        except Exception as e:
            print(e)
        finally:
            conn.close()

        if not sql_node:
            return None

        return CalculationNode((sql_node["x_pos"], sql_node["y_pos"]), sql_node["elevation_value"], sql_node["zone_id"])

    def connect_to_db(self):
        """Open a connexion to the database using the .env informations
        """
        connexion = psycopg2.connect(
            host=os.environ["DB_HOST"],
            database=os.environ["DB_NAME"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASSWORD"],
            port=os.environ["DB_PORT"])

        return connexion

    def get_zone_stitch(self, zone_id):
        for region in self.stitches:
            if zone_id in region:
                return region

        return None

    def get_global_chunk_coordinates(self, x_pos: int, y_pos: int):
        # Les chunks peuvent pas être négatifs
        # On vérifie donc que les positions données sont bien des int positif ou nul
        assert type(x_pos) == int and x_pos >= 0
        assert type(y_pos) == int and y_pos >= 0

        chunk_x = math.floor(x_pos / self.CHUNK_WIDTH)
        chunk_y = math.floor(y_pos / self.CHUNK_HEIGHT)

        return (chunk_x, chunk_y)

    def initialize_zone(self, zone_id) -> Zone:

        # Créer une zone dans la carte principale
        # Si elle fait parties des zones stitchées alors on lui passe le paramètre qui sera utile pour les vérifications plus tard.

        for regions in self.stitches:
            if zone_id in regions:
                zone_object = Zone(regions, True)
                for zone in regions:
                    self.zone_manager[zone] = zone_object
                return zone_object

        if zone_id not in self.zone_manager:
            zone = Zone(zone_id, False)
            self.zone_manager[zone_id] = zone

        return zone

    # Use to pathfinding 
    # Même format que Main.py
    # path = map.create_path(tuple([(24384, 3057), (24469, 2980), (24410, 3036)]), limitations)
    # Lat longitude
    @freezeargs
    @lru_cache(maxsize=None)
    @timing
    def create_path(self, nodes: Tuple[List[Tuple[int, int]]], limitations: dict):

        nodes = list(nodes)
        # Représente la liste des nodes qui seront converties juste après.
        path_nodes: List[CalculationNode] = []

        # On prend les coordonnées de chaques point et on créer une node a partir de ça + on récupère les infos dessus
        # Si la zone n'existe pas encore sur la map, on la créer avec son id comme key
        # Si la zone est petite elle est initialisée automatiquement
        # Sinon on l'initialise vite et on ajoutera les chunks petit a petit

        for node in nodes:
            node = convert_long_lat_to_coordinates(node)
            created_node = self.get_node(node[0], node[1])
            if created_node.elevation_value > limitations["max_elevation"]:
                print("Une des nodes n'a pas la hauteur minimale nécessaire")
                return False
            path_nodes.append(created_node)
            if created_node.zone_id not in self.zone_manager:
                self.initialize_zone(created_node.zone_id)
            if self.zone_manager[created_node.zone_id].is_chunkable:
                self.zone_manager[created_node.zone_id].load_chunk_by_node_pos(
                    created_node.position)

        nodes = path_nodes

        # Fait des vérifications avant de lancer le pathfinding réel
        valid_path = self.check_path_validity(path_nodes, limitations)

        if not valid_path: 
            return False

        if DISPLAY_ALGO_RUNNING:
            paths = self.show_a_star(nodes, limitations)
        else:
            paths = self.a_star(nodes, limitations)

        return paths

    def check_path_validity(self, nodes: List[CalculationNode], limitations: dict):
        # On vérifie la distance minimale possible entre les nodes comme si on tracait un trait du point A à B, de B à C et on additionne les distances
        # L'objectif sera de vérifier si la longueur trouvée est supérieur ou égale a celle qui sera déterminée plus tard pour le mode payant ou gratuit.
        total_minimum_distance = 0
        previous_node = nodes[0]

        for node in nodes[1:]:
            total_minimum_distance += abs(
                previous_node.position[0] - node.position[0]) + abs(
                previous_node.position[1] - node.position[1])
            previous_node = node

        print("Total minimum distance between points: ", total_minimum_distance)

        valid_path = True
        initial_node_zone_id = nodes[0].zone_id
        stitch_list = self.get_zone_stitch(initial_node_zone_id)

        for node in nodes[1:]:
            if not stitch_list and node.zone_id != initial_node_zone_id:
                valid_path = False
            if stitch_list and not node.zone_id in stitch_list:
                valid_path = False

        if not valid_path:
            return False

        valid_path = self.bi_directional_check(nodes, limitations)

        return valid_path

    def bi_directional_check(self, nodes: List[CalculationNode], limitations) -> bool:

        is_valid_path = True
        initial_zone = self.zone_manager[nodes[0].zone_id]

        if initial_zone.is_chunkable:
                is_valid_path = self.bi_directional_for_chunk(nodes, limitations)
        else:
            is_valid_path = self.bi_directional_for_no_chunk(nodes, limitations, initial_zone)

        return is_valid_path

    def create_binary_regions(self, map: np.ndarray, limitations: dict):
        # Si c'est une région a chunk on crée les binary regions pour le chunk donné
        # Sinon on fait sur toute la map

        binary = map != 0
        binary = np.logical_and(binary, map <= limitations["max_elevation"])

        if DISPLAY_MAP:

            map[map > limitations["max_elevation"]] = 5000
            map[map == 0] = 5000

            # Create 3d relief

            fig, ax = plt.subplots()

            # Create 2d + add the relief to it
            plt.imshow(map, cmap='Spectral')
            ax.axis('off')

            # Save to file and close
            plt.show()

        label_image = label(binary, connectivity=2)

        return regionprops(label_image)

    def bi_directional_for_no_chunk(self, nodes: List[CalculationNode], limitations: dict, initial_zone: Zone) -> bool:

        def check_all_found(dict):
            for key in dict:
                if dict[key]["found"] == False:
                    return False
            return True

        is_valid_path = True
        regions = self.create_binary_regions(
            initial_zone.chunk_manager["full"].map, limitations)
        nodes_regions = {}

        for node in nodes:
            nodes_regions[node.position] = {
                "relative_position": (node.position[0] - initial_zone.left_edge, node.position[1] - initial_zone.top_edge),
                "region": None,
                "found": False
            }

        for region_to_check in regions:
            if check_all_found(nodes_regions):
                break
            for coord in region_to_check.coords:
                if check_all_found(nodes_regions):
                    break
                for node in nodes_regions:
                    if check_all_found(nodes_regions):
                        break
                    if (coord[1], coord[0]) == (nodes_regions[node]["relative_position"][0], nodes_regions[node]["relative_position"][1]):
                        nodes_regions[node]["region"] = region_to_check
                        nodes_regions[node]["found"] = True

        initial_region = nodes_regions[nodes[0].position]["region"]

        if initial_region == None:
            print("Node initiale non trouvée.")

        for node in nodes_regions:
            if node == nodes[0].position:
                continue
            if nodes_regions[node]["found"] == False:
                print("Node {} n'a pas été trouvée.".format(
                    nodes_regions[node]["relative_position"]))
            if nodes_regions[node]["region"] is not initial_region:
                print("Node {} n'est pas dans une région atteignable.".format(
                    nodes_regions[node]["relative_position"]))
                is_valid_path = False

        return is_valid_path

    def check_neighbors_regions(self, regions_map, current_region, current_zone: Zone, limitations):
        max_chunk_x, max_chunk_y = current_zone.get_max_chunks_coordinates()
        regions_edges = (min_y, min_x, max_y,
                         max_x) = current_region["region"].bbox
        next_regions = []

        if min_y == 0 or max_y == self.CHUNK_HEIGHT or min_x == 0 or max_x == self.CHUNK_WIDTH:
            if min_y == 0 and current_region["chunk_coordinates"][0] != 0:
                chunk_to_load = (
                    current_region["chunk_coordinates"][0] - 1, current_region["chunk_coordinates"][1])
                if not chunk_to_load in current_zone.chunk_manager:
                    current_zone.load_chunk(chunk_to_load)
                if current_zone.chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map:
                        regions_map[chunk_to_load] = self.create_binary_regions(
                            current_zone.chunk_manager[chunk_to_load].map, limitations)
                    new_region = self.search_region_with_neighbor_coord(
                        regions_map, chunk_to_load, MAP_DIRECTIONS.WEST, regions_edges)
                    if new_region:
                        next_regions += new_region

            if max_x == self.CHUNK_WIDTH and current_region["chunk_coordinates"][0] != max_chunk_x:
                chunk_to_load = (
                    current_region["chunk_coordinates"][0] + 1, current_region["chunk_coordinates"][1])
                if not chunk_to_load in current_zone.chunk_manager:
                    current_zone.load_chunk(chunk_to_load)
                if current_zone.chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map:
                        regions_map[chunk_to_load] = self.create_binary_regions(
                            current_zone.chunk_manager[chunk_to_load].map, limitations)
                    new_region = self.search_region_with_neighbor_coord(
                        regions_map, chunk_to_load, MAP_DIRECTIONS.EAST, regions_edges)
                    if new_region:
                        next_regions += new_region

            if min_y == 0 and current_region["chunk_coordinates"][1] != 0:
                chunk_to_load = (
                    current_region["chunk_coordinates"][0], current_region["chunk_coordinates"][1] - 1)
                if not chunk_to_load in current_zone.chunk_manager:
                    current_zone.load_chunk(chunk_to_load)
                if current_zone.chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map:
                        regions_map[chunk_to_load] = self.create_binary_regions(
                            current_zone.chunk_manager[chunk_to_load].map, limitations)
                    new_region = self.search_region_with_neighbor_coord(
                        regions_map, chunk_to_load, MAP_DIRECTIONS.NORTH, regions_edges)
                    if new_region:
                        next_regions += new_region

            if max_y == self.CHUNK_HEIGHT and current_region["chunk_coordinates"][1] != max_chunk_y:
                chunk_to_load = (
                    current_region["chunk_coordinates"][0], current_region["chunk_coordinates"][1] + 1)
                if not chunk_to_load in current_zone.chunk_manager:
                    current_zone.load_chunk(chunk_to_load)
                if current_zone.chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map:
                        regions_map[chunk_to_load] = self.create_binary_regions(
                            current_zone.chunk_manager[chunk_to_load].map, limitations)
                    new_region = self.search_region_with_neighbor_coord(
                        regions_map, chunk_to_load, MAP_DIRECTIONS.SOUTH, regions_edges)
                    if new_region:
                        next_regions += new_region

        return next_regions

    def search_region_with_neighbor_coord(self, regions_map, chunk_coordinates, edge, regions_edges):
        # (min_y, min_x, max_y, max_x)

        next_regions = []

        if edge == MAP_DIRECTIONS.NORTH:
            for region in regions_map[chunk_coordinates]:
                new_edges = region.bbox
                if new_edges[2] == self.CHUNK_HEIGHT and check_overlap(regions_edges[1], new_edges[1], regions_edges[3], new_edges[3]):
                    if not region in next_regions:
                        next_regions.append(
                            {'chunk_coordinates': chunk_coordinates, 'region': region})

        if edge == MAP_DIRECTIONS.SOUTH:
            for region in regions_map[chunk_coordinates]:
                new_edges = region.bbox
                if new_edges[0] == 0 and check_overlap(regions_edges[1], new_edges[1], regions_edges[3], new_edges[3]):
                    if not region in next_regions:
                        next_regions.append(
                            {'chunk_coordinates': chunk_coordinates, 'region': region})

        if edge == MAP_DIRECTIONS.EAST:
            for region in regions_map[chunk_coordinates]:
                new_edges = region.bbox
                if new_edges[1] == 0 and check_overlap(regions_edges[0], new_edges[0], regions_edges[2], new_edges[2]):
                    if not region in next_regions:
                        next_regions.append(
                            {'chunk_coordinates': chunk_coordinates, 'region': region})

        if edge == MAP_DIRECTIONS.WEST:
            for region in regions_map[chunk_coordinates]:
                new_edges = region.bbox
                if new_edges[3] == self.CHUNK_WIDTH and check_overlap(regions_edges[0], new_edges[0], regions_edges[2], new_edges[2]):
                    if not region in next_regions:
                        next_regions.append(
                            {'chunk_coordinates': chunk_coordinates, 'region': region})

        return next_regions

    def bi_directional_for_chunk(self, nodes: List[CalculationNode], limitations: dict) -> bool:

        is_valid_path = True
        regions_map = {}
        nodes_regions = {}

        for node in nodes:
            found = False
            current_zone = self.zone_manager[node.zone_id]
            chunk_coordinates = current_zone.get_chunk_coordinates(
                node.position[0], node.position[1])
            node_position = (node.position[0] - chunk_coordinates[0] * self.CHUNK_WIDTH,
                             node.position[1] - chunk_coordinates[1] * self.CHUNK_HEIGHT)
            if not chunk_coordinates in current_zone.chunk_manager:
                current_zone.load_chunk(chunk_coordinates)
            if not node.zone_id in regions_map:
                regions_map[node.zone_id] = {}
            if not chunk_coordinates in regions_map:
                regions_map[node.zone_id][chunk_coordinates] = self.create_binary_regions(
                    current_zone.chunk_manager[chunk_coordinates].map, limitations)
            nodes_regions[node.position] = {
                "relative_position": node_position,
                "region": None,
                "connected_regions": [],
                "chunk_coordinates": chunk_coordinates,
                "explored_next": [],
                "already_explored": [],
                "is_fused": False
            }

            for region_to_check in regions_map[node.zone_id][chunk_coordinates]:
                if found:
                    break
                for coord in region_to_check.coords:
                    if found:
                        break
                    if (coord[1], coord[0]) == node_position:
                        nodes_regions[node.position]["region"] = {
                            "region": region_to_check,
                            "chunk_coordinates": chunk_coordinates,
                            "zone_id": node.zone_id}
                        nodes_regions[node.position]["connected_regions"].append(
                            region_to_check)
                        nodes_regions[node.position]["explored_next"].append({
                            "region": region_to_check,
                            "chunk_coordinates": chunk_coordinates,
                            "zone_id": node.zone_id})
                        found = True

        for node in nodes_regions:
            if not nodes_regions[node]["region"]:
                print("Une node n'a pas été retrouvée dans sa région.")
                is_valid_path = False

        if not is_valid_path:
            return is_valid_path
        early_stop = False

        while not check_if_all_fused(nodes_regions):
            check_array_intersection_and_fuse(nodes_regions)
            if early_stop:
                break
            for node in nodes_regions:
                if len(nodes_regions[node]["explored_next"]) == 0:
                    early_stop = True
                    break

                current_region = nodes_regions[node]["explored_next"].pop()
                nodes_regions[node]["already_explored"].append(current_region)
                new_regions = self.search_neighboring_region_for_stitched(
                    regions_map, current_region, limitations)

                if new_regions:
                    for region in new_regions:
                        if not region in nodes_regions[node]["explored_next"] and not region in nodes_regions[node]["already_explored"]:
                            nodes_regions[node]["explored_next"].append(region)
                        if not region in nodes_regions[node]["connected_regions"]:
                            nodes_regions[node]["connected_regions"].append(
                                region["region"])

        for node in nodes_regions:
            if not nodes_regions[node]["is_fused"]:
                is_valid_path = False

        return is_valid_path

    def search_neighboring_region_for_stitched(self, regions_map, current_region, limitations: dict):

        region_edges = (min_y, min_x, max_y, max_x) = current_region["region"].bbox
        next_regions = []

        if min_y == 0 or max_y == self.CHUNK_HEIGHT or min_x == 0 or max_x == self.CHUNK_WIDTH:
            if min_y == 0:
                chunk_to_load = (current_region["chunk_coordinates"][0], current_region["chunk_coordinates"][1] - 1)

                if not chunk_to_load in self.zone_manager[current_region["zone_id"]].chunk_manager:
                    self.zone_manager[current_region["zone_id"]].load_chunk(chunk_to_load)

                if self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load] and self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map[current_region["zone_id"]]:
                        regions_map[current_region["zone_id"]][chunk_to_load] = self.create_binary_regions(
                            self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].map, limitations)
                        
                    for region in regions_map[current_region["zone_id"]][chunk_to_load]:
                        new_regions = self.search_region_with_neighbor_coord_for_stitched(
                        region_edges, region, MAP_DIRECTIONS.NORTH, chunk_to_load, current_region["zone_id"])
                        if new_regions:
                            next_regions.append(new_regions)

            if max_x == self.CHUNK_WIDTH:
                chunk_to_load = (current_region["chunk_coordinates"][0] + 1, current_region["chunk_coordinates"][1])

                if not chunk_to_load in self.zone_manager[current_region["zone_id"]].chunk_manager:
                    self.zone_manager[current_region["zone_id"]].load_chunk(chunk_to_load)

                if self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load] and self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map[current_region["zone_id"]]:
                        regions_map[current_region["zone_id"]][chunk_to_load] = self.create_binary_regions(self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].map, limitations)
                        
                    for region in regions_map[current_region["zone_id"]][chunk_to_load]:
                        new_regions = self.search_region_with_neighbor_coord_for_stitched(region_edges, region, MAP_DIRECTIONS.EAST, chunk_to_load, current_region["zone_id"])
                        if new_regions:
                            next_regions.append(new_regions)

            if max_y == self.CHUNK_HEIGHT:
                chunk_to_load = (current_region["chunk_coordinates"][0], current_region["chunk_coordinates"][1] + 1)
                if not chunk_to_load in self.zone_manager[current_region["zone_id"]].chunk_manager:
                    self.zone_manager[current_region["zone_id"]].load_chunk(chunk_to_load)

                if self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load] and self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map[current_region["zone_id"]]:
                        regions_map[current_region["zone_id"]][chunk_to_load] = self.create_binary_regions(self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].map, limitations)

                    for region in regions_map[current_region["zone_id"]][chunk_to_load]:
                        new_regions = self.search_region_with_neighbor_coord_for_stitched(region_edges, region, MAP_DIRECTIONS.SOUTH, chunk_to_load, current_region["zone_id"])
                        if new_regions:
                            next_regions.append(new_regions)

            if min_x == 0:
                chunk_to_load = (current_region["chunk_coordinates"][0] - 1, current_region["chunk_coordinates"][1])
                if not chunk_to_load in self.zone_manager[current_region["zone_id"]].chunk_manager:
                    self.zone_manager[current_region["zone_id"]].load_chunk(chunk_to_load)

                if self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load] and self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].is_valid:
                    if not chunk_to_load in regions_map[current_region["zone_id"]]:
                        regions_map[current_region["zone_id"]][chunk_to_load] = self.create_binary_regions(self.zone_manager[current_region["zone_id"]].chunk_manager[chunk_to_load].map, limitations)

                    for region in regions_map[current_region["zone_id"]][chunk_to_load]:
                        new_regions = self.search_region_with_neighbor_coord_for_stitched(region_edges, region, MAP_DIRECTIONS.WEST, chunk_to_load, current_region["zone_id"])
                        if new_regions:
                            next_regions.append(new_regions)

        return next_regions

    def search_region_with_neighbor_coord_for_stitched(self, initial_region, region_to_compare, edge, chunk_coordinates, zone_id):
        # (min_y, min_x, max_y, max_x)
        if edge == MAP_DIRECTIONS.NORTH:
            new_edges = region_to_compare.bbox
            if new_edges[2] == self.CHUNK_HEIGHT and check_overlap(initial_region[1], new_edges[1], initial_region[3], new_edges[3]):
                return {'chunk_coordinates': chunk_coordinates, 'region': region_to_compare, 'zone_id': zone_id}

        if edge == MAP_DIRECTIONS.SOUTH:
            new_edges = region_to_compare.bbox
            if new_edges[0] == 0 and check_overlap(initial_region[1], new_edges[1], initial_region[3], new_edges[3]):
                return {'chunk_coordinates': chunk_coordinates, 'region': region_to_compare, 'zone_id': zone_id}

        if edge == MAP_DIRECTIONS.EAST:
            new_edges = region_to_compare.bbox
            if new_edges[1] == 0 and check_overlap(initial_region[0], new_edges[0], initial_region[2], new_edges[2]):
                return {'chunk_coordinates': chunk_coordinates, 'region': region_to_compare, 'zone_id': zone_id}

        if edge == MAP_DIRECTIONS.WEST:
            new_edges = region_to_compare.bbox
            if new_edges[3] == self.CHUNK_WIDTH and check_overlap(initial_region[0], new_edges[0], initial_region[2], new_edges[2]):
                return {'chunk_coordinates': chunk_coordinates, 'region': region_to_compare, 'zone_id': zone_id}
        return

    def search_valid_chunk_in_stitched_zone(self, zone_id: int, chunk_coordinates: Tuple[int, int]) -> List[int]:

        if not self.zone_manager[zone_id].is_stitched:
            return

        stitched_regions = self.get_zone_stitch(zone_id)
        valid_zones = []
        for zone in stitched_regions:
            if not zone in self.zone_manager:
                self.zone_manager[zone] = Zone(zone, True)
            if (self.zone_manager[zone].min_chunk_x <= chunk_coordinates[0] <= self.zone_manager[zone].max_chunk_x) and (
                    self.zone_manager[zone].min_chunk_y <= chunk_coordinates[1] <= self.zone_manager[zone].max_chunk_y):
                valid_zones.append(zone)

        return valid_zones

    def a_star(self, node_list: List[CalculationNode], limitations):

        node_dict: Dict[Tuple[int, int], CalculationNode] = {}
        for node in node_list:
            node_dict[node.position] = node

        current_node = node_list[0]
        paths = []

        for goal_node in node_list[1:]:
            current_node.distance_from_end = get_abs_distance(current_node, goal_node)
            current_node.heuristic_distance = current_node.distance_from_end + current_node.distance_from_start
            current_node.generation = 0

            visited = set()
            explored_next = set([current_node])

            while explored_next:
                current_node = get_lower_heuristic_node(explored_next)
                visited.add(current_node)

                if current_node is goal_node:
                    paths.append(self.back_track(current_node))
                    break
                if not current_node.is_loaded:
                    self.add_neighbors_to_node(current_node, node_dict)

                for direction in current_node.neighbors:

                    neighbor = current_node.neighbors[direction]
                    if not neighbor:
                        continue

                    if "max_elevation" in limitations and neighbor.elevation_value > limitations["max_elevation"]:
                        continue

                    if "min_elevation" in limitations and neighbor.elevation_value < limitations["min_elevation"]:
                        continue

                    if "max_diff_elevation" in limitations:
                        if (neighbor.elevation_value - current_node.elevation_value) > limitations["max_diff_elevation"]:
                            continue
                        if (current_node.elevation_value - neighbor.elevation_value) > limitations["max_diff_elevation"]:
                            continue

                    if neighbor.generation != 0 and not neighbor.ancestor:
                        neighbor.generation = current_node.generation + 1
                        neighbor.ancestor = current_node

                    if neighbor.distance_from_end == 999999999999:
                        neighbor.distance_from_end = get_abs_distance(current_node, goal_node)
                        
                    if current_node.elevation_value < neighbor.elevation_value:
                        travel_cost = 1 + current_node.distance_from_start + abs(neighbor.elevation_value - current_node.elevation_value)
                    else:
                        travel_cost = 1 + current_node.distance_from_start + abs(current_node.elevation_value - neighbor.elevation_value)

                    if neighbor.generation != 0 and neighbor.set_distance_from_start(travel_cost):
                        neighbor.ancestor = current_node
                        neighbor.generation = current_node.generation + 1
                        neighbor.heuristic_distance = neighbor.distance_from_start + neighbor.distance_from_end

                    if not neighbor in visited and not neighbor in explored_next:
                        explored_next.add(neighbor)

        formated_paths = []
        for path in paths:
            new_formated_path = []
            for position in path:
                new_formated_path.append(convert_coordinates_to_long_lat(position))
            formated_paths.append(new_formated_path)
        
        return formated_paths

    def back_track(self, last_node: CalculationNode):

        position_list = []

        while last_node:
            position_list.append(last_node.position)
            last_node = last_node.ancestor

        position_list.reverse()

        return position_list

    def add_neighbors_to_node(self, node: CalculationNode, node_dict: Dict[Tuple, CalculationNode]):
        if node.is_loaded:
            return

        for direction in MAP_DIRECTIONS:
            if direction.value == MAP_DIRECTIONS.NORTH.value:
                position = (node.position[0] - 1, node.position[1])
            if direction.value == MAP_DIRECTIONS.NORTH_EAST.value:
                position = (node.position[0] - 1, node.position[1] + 1)
            if direction.value == MAP_DIRECTIONS.EAST.value:
                position = (node.position[0], node.position[1] + 1)
            if direction.value == MAP_DIRECTIONS.SOUTH_EAST.value:
                position = (node.position[0] + 1, node.position[1] + 1)
            if direction.value == MAP_DIRECTIONS.SOUTH.value:
                position = (node.position[0] + 1, node.position[1])
            if direction.value == MAP_DIRECTIONS.SOUTH_WEST.value:
                position = (node.position[0] + 1, node.position[1] - 1)
            if direction.value == MAP_DIRECTIONS.WEST.value:
                position = (node.position[0], node.position[1] - 1)
            if direction.value == MAP_DIRECTIONS.NORTH_WEST.value:
                position = (node.position[0] - 1, node.position[1] - 1)

            if not position in node_dict:
                node_dict[position] = self.get_node(position[0], position[1], node.zone_id)

            if not node.neighbors[direction]:
                node.neighbors[direction] = node_dict[position]

            if node_dict[position] and not node_dict[position].neighbors[get_opposite_direction(direction)]:
                node_dict[position].neighbors[get_opposite_direction(direction)] = node

        node.is_loaded = True

    def show_a_star(self, node_list: List[CalculationNode], limitations):

        zone = self.zone_manager[node_list[0].zone_id]

        node_dict: Dict[Tuple[int, int], CalculationNode] = {}

        current_node = node_list[0]
        paths = []

        if zone.is_chunkable:
            node_size = 2
            offset_x = (WIDTH - ALGO_SIZE[0]) + ((ALGO_SIZE[0] - (node_size * 600)) / 2)
            offset_y = (HEIGTH - ALGO_SIZE[1]) + ((ALGO_SIZE[1] - (node_size * 400)) / 2)
            map_dict = {}
            for chunk in zone.chunk_manager:
                map_dict[chunk] = zone.chunk_manager[chunk].setup_map_visual(limitations, node_size, offset_x, offset_y)

            current_chunk_coordinates = self.get_global_chunk_coordinates(current_node.position[0], current_node.position[1])
            current_map = map_dict[self.get_global_chunk_coordinates(current_node.position[0], current_node.position[1])]

        else:
            chunk = zone.chunk_manager["full"]
            node_size = math.floor(min(ALGO_SIZE[0] / chunk.width, ALGO_SIZE[1] / chunk.heigth))
            offset_x = (WIDTH - ALGO_SIZE[0]) + ((ALGO_SIZE[0] - (node_size * chunk.width)) / 2)
            offset_y = (HEIGTH - ALGO_SIZE[1]) + ((ALGO_SIZE[1] - (node_size * chunk.heigth)) / 2)
            current_map = chunk.setup_map_visual(limitations, node_size, offset_x, offset_y)

        for node in node_list:
            node_dict[node.position] = node
            if zone.is_chunkable:
                chunk_position = self.get_global_chunk_coordinates(node.position[0], node.position[1])
                chunk = zone.chunk_manager[chunk_position]
                x = (node.position[0] - chunk.left_edge)
                y = (node.position[1] - chunk.top_edge)

                map_dict[chunk_position][y][x] = node
                current_map[y][x] = node
            else:
                x = (node.position[0] - chunk.left_edge)
                y = (node.position[1] - chunk.top_edge)
                
                current_map[y][x] = node

            node.is_goal()
            node.set_drawn_position((x * node_size + offset_x, y * node_size + offset_y))

        pygame.init()

        FPS = 240
        SCREEN = pygame.display.set_mode(SIZE)
        CLOCK = pygame.time.Clock()

        continue_to_loop = True
        is_finished = False

        while True:

            for event in pygame.event.get():
                if event.type == QUIT:
                    continue_to_loop = False
                    pygame.quit()

                if event.type == KEYDOWN:
                    if event.key == K_ESCAPE:
                        continue_to_loop = False
                        pygame.quit()
                    
                    if is_finished and zone.is_chunkable:
                        if event.key == K_UP:
                            if current_chunk_coordinates[1] > 0 and (current_chunk_coordinates[0], current_chunk_coordinates[1] - 1) in zone.chunk_manager:
                                current_chunk_coordinates = (current_chunk_coordinates[0], current_chunk_coordinates[1] - 1)
                                current_map = map_dict[current_chunk_coordinates]

                        if event.key == K_DOWN:
                            if current_chunk_coordinates[1] < zone.min_chunk_y and (current_chunk_coordinates[0], current_chunk_coordinates[1] + 1) in zone.chunk_manager:
                                current_chunk_coordinates = (current_chunk_coordinates[0], current_chunk_coordinates[1] + 1)
                                current_map = map_dict[current_chunk_coordinates]

                        if event.key == K_RIGHT:
                            if current_chunk_coordinates[0] < zone.max_chunk_x and (current_chunk_coordinates[0] + 1, current_chunk_coordinates[1]) in zone.chunk_manager:
                                current_chunk_coordinates = (current_chunk_coordinates[0] + 1, current_chunk_coordinates[1])
                                current_map = map_dict[current_chunk_coordinates]

                        if event.key == K_LEFT:
                            if current_chunk_coordinates[0] > 0 and (current_chunk_coordinates[0] - 1 , current_chunk_coordinates[1]) in zone.chunk_manager:
                                current_chunk_coordinates = (current_chunk_coordinates[0] - 1, current_chunk_coordinates[1])
                                current_map = map_dict[current_chunk_coordinates]

            if not continue_to_loop: break
                    
            SCREEN.fill(LIGHT_GREY)
            
            if is_finished: continue

            for goal_node in node_list[1:]:
                
                current_node.distance_from_end = get_abs_distance(current_node, goal_node)
                current_node.heuristic_distance = current_node.distance_from_end + current_node.distance_from_start
                current_node.generation = 0

                visited = set()
                explored_next = set([current_node])

                while explored_next:
                    for event in pygame.event.get():
                        if event.type == QUIT:
                            continue_to_loop = False
                            pygame.quit()
                    
                    current_node = get_lower_heuristic_node(explored_next)
                    current_node.is_head_of_search()
                    visited.add(current_node)

                    if current_node is goal_node:
                        paths.append(self.back_track(current_node))
                        break
                    if not current_node.is_loaded:
                        self.add_neighbors_to_node(current_node, node_dict)

                    for direction in current_node.neighbors:

                        neighbor = current_node.neighbors[direction]
                        if not neighbor:
                            continue
                        
                        if zone.is_chunkable:
                            for chunk in zone.chunk_manager:
                                if not chunk in map_dict:
                                    map_dict[chunk] = zone.chunk_manager[chunk].setup_map_visual(limitations, node_size, offset_x, offset_y)

                            chunk_position = self.get_global_chunk_coordinates(neighbor.position[0], neighbor.position[1])
                            chunk = zone.chunk_manager[chunk_position]
                            current_map = map_dict[chunk_position]
                        
                        x = (neighbor.position[0] - chunk.left_edge)
                        y = (neighbor.position[1] - chunk.top_edge)

                        if not isinstance(current_map[y][x], CalculationNode):
                            current_map[y][x] = neighbor
                            color = interpolate(LIGHTEST_GREEN, DARKEST_GREEN, neighbor.elevation_value / chunk.max_elevation)
                            neighbor.set_drawn_position((x * node_size + offset_x, y * node_size + offset_y), color)

                        if "max_elevation" in limitations and neighbor.elevation_value > limitations["max_elevation"]:
                            neighbor.color = BLACK
                            continue

                        if "min_elevation" in limitations and neighbor.elevation_value < limitations["min_elevation"]:
                            neighbor.color = BLACK
                            continue

                        if neighbor.generation != 0 and not neighbor.ancestor:
                            neighbor.generation = current_node.generation + 1
                            neighbor.ancestor = current_node

                        if neighbor.distance_from_end == 999999999999:
                            neighbor.distance_from_end = get_abs_distance(current_node, goal_node)
                            
                        if current_node.elevation_value < neighbor.elevation_value:
                            travel_cost = 1 + current_node.distance_from_start + abs(neighbor.elevation_value - current_node.elevation_value)
                        else:
                            travel_cost = 1 + current_node.distance_from_start + abs(current_node.elevation_value - neighbor.elevation_value)

                        if neighbor.generation != 0 and neighbor.set_distance_from_start(travel_cost):
                            neighbor.ancestor = current_node
                            neighbor.generation = current_node.generation + 1
                            neighbor.heuristic_distance = neighbor.distance_from_start + neighbor.distance_from_end

                        if not neighbor in visited and not neighbor in explored_next:
                            explored_next.add(neighbor)
                    
                    current_ancestors = get_set_ancestor(current_node)
                    for row in current_map:
                        for column in row:
                            go_next = False

                            for index, path in enumerate(paths):
                                if column.position in set(path):
                                    color = interpolate(DARKER_RED, RED, index / len(node_list))
                                    column.draw(SCREEN, node_size, color)
                                    go_next = True
                                    continue

                            if go_next: continue
                            if column in current_ancestors:
                                column.draw(SCREEN, node_size, RED)
                            else:
                                column.draw(SCREEN, node_size)

                    pygame.display.update()
                    CLOCK.tick(FPS)

                for position in node_dict:
                    if node_dict[position]:
                        node_dict[position].reset_node()

            is_finished = True

            for row in current_map:
                for column in row:
                    go_next = False
                    for path in paths:
                        if column.position in set(path):
                            color = interpolate(DARKER_RED, RED, index / len(node_list))
                            column.draw(SCREEN, node_size, color)
                            go_next = True
                            continue
                    if go_next: continue
                    column.draw(SCREEN, node_size)

            pygame.display.update()
            CLOCK.tick(FPS)
    

def check_overlap(x1, y1, x2, y2):
    return max(x1, y1) <= min(x2, y2)


def check_empty_arrays(dict):
    for key in dict:
        if len(dict[key]["explored_next"]) > 0:
            return False
    return True


def check_array_intersection_and_fuse(dict):
    """
        "relative_position": node_position, 
        "region": None,
        "connected_regions": [],
        "chunk_coordinates": chunk_coordinates,
        "explored_next": [],
        "already_explored":[],
        "is_fused":False
    """

    for key in dict:
        for second_key in dict:
            if key == second_key:
                continue
            if dict[key]["is_fused"] and dict[second_key]["is_fused"]:
                continue
            if dict[key]["connected_regions"] is dict[second_key]["connected_regions"]:
                continue

            intersection = []
            for item in dict[key]["connected_regions"]:
                if item in dict[second_key]["connected_regions"]:
                    intersection.append(item)

            if intersection:
                new_connected = dict[key]["connected_regions"] + \
                    dict[second_key]["connected_regions"]
                new_already_explored = dict[key]["already_explored"] + \
                    dict[second_key]["already_explored"]
                explored_next = dict[key]["explored_next"] + \
                    dict[second_key]["explored_next"]

                new_explored_next = []
                for region in explored_next:
                    if not region in new_already_explored:
                        new_explored_next.append(region)

                dict[key]["connected_regions"] = new_connected
                dict[second_key]["connected_regions"] = new_connected

                dict[key]["already_explored"] = new_already_explored
                dict[second_key]["already_explored"] = new_already_explored

                dict[key]["explored_next"] = new_explored_next
                dict[second_key]["explored_next"] = new_explored_next

                dict[key]["is_fused"] = True
                dict[second_key]["is_fused"] = True


def check_if_all_fused(dict):
    for key in dict:
        if not dict[key]["is_fused"]:
            return False
    return True


def get_abs_distance(first_node: CalculationNode, second_node: CalculationNode) -> int:
    x_diff = abs(first_node.position[0] - second_node.position[0])
    y_diff = abs(first_node.position[1] - second_node.position[1])
    return x_diff + y_diff


def get_lower_heuristic_node(node_list: List[CalculationNode]):
    lowest: CalculationNode = next(iter(node_list))

    for node in node_list:
        if lowest.heuristic_distance > node.heuristic_distance:
            lowest = node

    node_list.remove(lowest)
    return lowest


def convert_coordinates_to_long_lat(position):

    min_x, max_x = -30.000138888888888, 29.999861111111112
    min_y, max_y = 69.99986111111112, 29.99986111111112

    diff_x = abs(min_x) + abs(max_x)
    diff_y = abs(min_y) - abs(max_y)

    percentage_of_map_x = position[0] / (MAP_WIDTH * len(MAPS_ARRAY[0]))
    percentage_of_map_y = position[1] / (MAP_HEIGHT * len(MAPS_ARRAY))

    long = format(min_x + (diff_x * percentage_of_map_x), '.6f')
    lat = format(min_y - (diff_y * percentage_of_map_y), '.6f')

    return (long, lat)

def convert_long_lat_to_coordinates(coordinates: Tuple[float, float]):
    #min_x, max_x = -30.000138888888888, 29.999861111111112
    #Devient 0, 60
    #min_x, max_x = 0, 60

    #min_y, max_y = 69.99986111111112, 29.99986111111112
    #Devient 0, -40 => on inverse -40, 0 => 0, 40
    #min_x, max_y = 0, -40

    percentage_of_x = (coordinates[0] + 30) / 60
    position_x = abs(round(MAP_WIDTH * len(MAPS_ARRAY[0]) * percentage_of_x))

    percentage_of_y = (coordinates[1] - 70) / 40
    position_y = abs(round(MAP_HEIGHT * len(MAPS_ARRAY) * percentage_of_y))


    return (position_x, position_y)
    


def get_set_ancestor(current_node: CalculationNode) -> List[CalculationNode]:
    ancestors = set()
    while current_node.ancestor:
        ancestors.add(current_node.ancestor)
        current_node = current_node.ancestor
    
    return ancestors


def interpolate(color_a, color_b, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(color_a, color_b))