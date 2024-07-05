from enum import Enum
import os

config = {
    "SECRET_KEY" : os.urandom(32),
    "DATABASE_HOST" : "localhost:8000",
    "DATABASE_NAME" : "Trackfinder",
    "DATABASE_USER" : "user",
    "DATABASE_PASSWORD" : "user",
}

TIME_BEFORE_REMOVE = 60*60

MAP_WIDTH = 14400
MAP_HEIGHT = 9600

MAPS_ARRAY = [
    ["./maps/europe_mean_1.tif", "./maps/europe_mean_2.tif"],
    ["./maps/europe_mean_3.tif", "./maps/europe_mean_4.tif"]
]

CHUNK_SIZES = [(300, 200), (600, 400), (1200, 800),
               (2400, 1600), (4800, 3200), (9600, 6400)]

TABLES_NAME = {
    "nodes": "CREATE TABLE nodes (id SERIAL PRIMARY KEY, x_pos SMALLINT NOT NULL, y_pos SMALLINT NOT NULL, elevation_value SMALLINT, zone_id INT);",
    "regions": "CREATE TABLE regions (id SERIAL PRIMARY KEY, zones integer ARRAY);",
    "chunks": "CREATE TABLE chunks ( id SERIAL PRIMARY KEY, x_pos SMALLINT, y_pos SMALLINT, median_low FLOAT(2), median FLOAT(2), median_high FLOAT(2), mean FLOAT(2), variance FLOAT(2), standart_deviation FLOAT(2));",
    "zone_data": "CREATE TABLE zone_data (id SERIAL PRIMARY KEY, zone_id INT, min_x_pos INT, max_x_pos INT, min_y_pos INT, max_y_pos INT, count INT);"
}

TABLES_TO_CHECK = ["nodes", "regions", "chunks","zone_data"]

class MAP_DIRECTIONS(Enum):
    NORTH = "north"
    NORTH_EAST = "north_east"
    EAST = "east"
    SOUTH_EAST = "south_east"
    SOUTH = "south"
    SOUTH_WEST = "south_west"
    WEST = "west"
    NORTH_WEST = "north_west"

def get_opposite_direction(direction):
    opposite_directions = {
        MAP_DIRECTIONS.NORTH: MAP_DIRECTIONS.SOUTH,
        MAP_DIRECTIONS.NORTH_EAST: MAP_DIRECTIONS.SOUTH_WEST,
        MAP_DIRECTIONS.EAST: MAP_DIRECTIONS.WEST,
        MAP_DIRECTIONS.SOUTH_EAST: MAP_DIRECTIONS.NORTH_WEST,
        MAP_DIRECTIONS.SOUTH: MAP_DIRECTIONS.NORTH,
        MAP_DIRECTIONS.SOUTH_WEST: MAP_DIRECTIONS.NORTH_EAST,
        MAP_DIRECTIONS.WEST: MAP_DIRECTIONS.EAST,
        MAP_DIRECTIONS.NORTH_WEST: MAP_DIRECTIONS.SOUTH_EAST,
    }
    return opposite_directions[direction]

