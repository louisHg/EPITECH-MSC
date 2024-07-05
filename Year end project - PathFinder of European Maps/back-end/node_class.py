
from typing import Tuple, Dict
from config import *
from pygame_configs import BLACK, BLUE, WHITE, PURPLE
import pygame



class BaseNode():
    __slots__ = "position", "elevation_value", "color", "drawn_position"

    def __init__(self, position, elevation_value, initial_color) -> None:
        self.position: Tuple[int, int] = position
        self.elevation_value = elevation_value
        self.color = initial_color
        self.drawn_position: Tuple[int, int] = position

    def __repr__(self) -> str:
        return f"<Node id={self.id} (x,y)=({self.position}) elevation_value={self.elevation_value}>"
    
    def draw(self, surface, dimension):
        rect = (self.drawn_position[0], self.drawn_position[1], dimension, dimension)
        pygame.draw.rect(surface, self.color,rect, 0)

    def is_not_travelable(self):
        self.color = BLACK
    
    def is_water(self):
        self.color = BLUE
    
    def set_drawn_position(self, position):
        self.drawn_position = position
    


class CalculationNode():

    __slots__ = ('position', 'elevation_value', 'neighbors', "generation",
                 'distance_from_start', 'distance_from_end', "heuristic_distance",'ancestor', 'zone_id',
                 'is_loaded', "color", "drawn_position")

    def __init__(self, position: Tuple[int, int], elevation_value: int, zone_id: int) -> None:
        self.position: Tuple[int, int] = position
        self.elevation_value = elevation_value
        self.zone_id = zone_id

        self.neighbors: Dict[str, CalculationNode] = {
            MAP_DIRECTIONS.NORTH: None,
            MAP_DIRECTIONS.NORTH_EAST: None,
            MAP_DIRECTIONS.EAST: None,
            MAP_DIRECTIONS.SOUTH_EAST: None,
            MAP_DIRECTIONS.SOUTH: None,
            MAP_DIRECTIONS.SOUTH_WEST: None,
            MAP_DIRECTIONS.WEST: None,
            MAP_DIRECTIONS.NORTH_WEST: None
        }

        self.distance_from_start: int = 0
        self.distance_from_end = 999999999999
        self.heuristic_distance: int = None
        self.ancestor = None
        self.generation = None
        self.is_loaded = False
        self.color = WHITE

    def __eq__(self, other) -> bool:
        return self.heuristic_distance == other.heuristic_distance
    
    def __lt__(self, other) -> bool:
        return self.heuristic_distance < other.f_cost
    
    def __le__(self, other) -> bool:
        return self.heuristic_distance <= other.heuristic_distance

    def __ne__(self, other) -> bool:
        return self.heuristic_distance != other.heuristic_distance

    def __gt__(self, other) -> bool:
        return self.heuristic_distance > other.heuristic_distance

    def __ge__(self, other) -> bool:
        return self.heuristic_distance >= other.heuristic_distance

    def __repr__(self) -> str:
        return f"<CalculationNode zone_id={self.zone_id} pos: {self.position}, elevation: {self.elevation_value} heuristic: {self.heuristic_distance}>"

    def __hash__(self) -> int:
        return hash(self.position)
    
    def set_distance_from_start(self, distance)-> bool:
        if self.distance_from_start == 0:
            self.distance_from_start = distance
            return True
        
        if self.distance_from_start > distance: 
            self.distance_from_start = distance
            return True
        
        return False
    
    def reset_node(self):
        self.distance_from_start: int = 0
        self.distance_from_end: int = 9999999999
        self.heuristic_distance: int = None
        self.ancestor: CalculationNode = None
        self.generation = None
    
    def draw(self, surface, dimension, color=None):
        rect = (self.drawn_position[0], self.drawn_position[1], dimension, dimension)
        if color:
            pygame.draw.rect(surface, color,rect, 0)
        else:
            pygame.draw.rect(surface, self.color,rect, 0)

    def is_explored(self):
        pass

    def is_explored_next(self):
        pass
    
    def is_goal(self):
        self.color = PURPLE
    
    def is_head_of_search(self):
        pass

    def set_drawn_position(self, position, color=None):
        if color:
            self.color = color
        self.drawn_position = position


