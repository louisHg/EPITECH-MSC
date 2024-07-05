from db_setup import setup_db
from config import MAPS_ARRAY
from map_class import Map, convert_coordinates_to_long_lat, convert_long_lat_to_coordinates
import argparse


if __name__ == "__main__":
    # Load environment and setup the database

    parser = argparse.ArgumentParser(description="Check for docker flag.")
    parser.add_argument("-d", action="store_true")
    options = parser.parse_args()
    if not options.d:
        from dotenv import load_dotenv
        load_dotenv()

    # Setting up the db for the first time, to comment before it
    # setup_db(MAPS_ARRAY)

    limitations = {"max_elevation": 5000}

    map = Map()

    #coordinates = convert_long_lat_to_coordinates((20.799861, 63.631111))
    #print(coordinates)
    #long_lat = convert_coordinates_to_long_lat(coordinates)
    #print(long_lat)

    # Zone non stitchée et non chunkable:
    # Point le plus haut (24416, 2985)
    #(24384 + 44, 2966 + 53)
    path = map.create_path(tuple([(20.799861, 63.631111), (20.937361, 63.758194), (20.854028, 63.674861)]), limitations)
    print(path)

    #limitations = {"max_elevation": 500}
    # Zone non stitchée mais chunkable:
    path = map.create_path(tuple([(-21.796875, 64.014496), (-23.203125, 65.694476), (-16.040039, 65.910623)]), limitations)
    print(path)

    #limitations = {"max_elevation": 500}
    # Zone stitchée avec chunks:
    #is_valid = map.create_path(tuple([(9840, 14984), (13471, 9730), (15045, 9600), (6706, 19185)]), limitations)
    #print(is_valid)
