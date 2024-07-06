from typing import Tuple
from functools import lru_cache

NODES = {
        #(Coordonnées): {Action: (Coordonnées après action)}
        #Seulement les déplacements possibles

        #(Colonne, ligne)

        #0 => Bas
        #1 => Haut
        #2 => Droite
        #3 => Gauche
        
        #1ère ligne
        (0,0): {0: (0,1), 2: (1,0)},
        (1,0): {0: (1,1), 3: (0,0)},
        (2,0): {0: (2,1), 2: (3,0)},
        (3,0): {0: (3,1), 2: (4,0), 3: (2,0)},
        (4,0): {0: (4,1), 3: (3,0)},

        #2ème ligne
        (0,1): {0: (0,2), 1: (0,0), 2: (1,1)},
        (1,1): {0: (1,2), 1: (1,0), 3: (0,1)},
        (2,1): {0: (2,2), 1: (2,0), 2: (3,1)},
        (3,1): {0: (3,2), 1: (3,0), 2: (4,1), 3: (2, 1)},
        (4,1): {0: (4,2), 1: (4,0), 3: (3,1)},

        #3ème ligne (GOOD)
        (0,2): {0: (0,3), 1: (0,1), 2: (1,2)},
        (1,2): {0: (1,3), 1: (1,1), 2: (2,2), 3: (0,2)},
        (2,2): {0: (2,3), 1: (2,1), 2: (3,2), 3: (1,2)},
        (3,2): {0: (3,3), 1: (3,1), 2: (4,2), 3: (2,2)},
        (4,2): {0: (4,3), 1: (4,1), 3: (3,2)},

        #4ème ligne (GOOD)
        (0,3): {0: (0,4), 1: (0,2)},
        (1,3): {0: (1,4), 1: (1,2), 2: (2,3)},
        (2,3): {0: (2,4), 1: (2,2), 3: (1,3)},
        (3,3): {0: (3,4), 1: (3,2), 2: (4,3)},
        (4,3): {0: (4,4), 1: (4,2), 3: (3,3)},

        #5ème ligne (GOOD)
        (0,4): {1: (0,3)},
        (1,4): {1: (1,3), 2: (2,4)},
        (2,4): {1: (2,3), 3: (1,4)},
        (3,4): {1: (3,3), 2: (4,4)},
        (4,4): {1: (4,3), 3: (3,4)},
    }

SPECIAL_SPOTS = {
    #Rouge
    0: (0,0),
    #Vert
    1: (4,0),
    #Jaune
    2: (0,4),
    #Bleu
    3: (3,4)
}

class Graph:

    def __init__(self) -> None:
        self.nodes = NODES
        self.minimal_steps_to_goal = {}
        self.compute_steps_to_goal()

    @lru_cache
    def can_travel_by_action(self, position: Tuple[int, int], action: int):
        if not action in self.nodes[position]:
            return False
        return self.nodes[position][action]
    
    def compute_steps_to_goal(self):
        for special_spot in SPECIAL_SPOTS:
            explored_nodes = []
            explored_next = set()
            steps_table = {}

            explored_next.add(SPECIAL_SPOTS[special_spot])
            current_distance = 0

            while len(explored_next):
                next_explored_set = set()
                for current_spot in explored_next:
                    steps_table[current_spot] = current_distance
                    explored_nodes.append(current_spot)
                    for action in NODES[current_spot]:
                        next_node = NODES[current_spot][action]
                        if next_node not in explored_nodes:
                            next_explored_set.add(next_node)
                
                current_distance += 1
                explored_nodes.append(current_spot)
                explored_next = next_explored_set

            self.minimal_steps_to_goal[SPECIAL_SPOTS[special_spot]] = steps_table

    @lru_cache
    def get_distance_minimum(self, current_location: Tuple[int, int], goal: Tuple[int, int]):
        return self.minimal_steps_to_goal[goal][current_location]
    
    @lru_cache
    def is_path_optimal(self, current_position: Tuple[int, int], next_position:Tuple[int,int], goal: Tuple[int,int]):
        return self.get_distance_minimum(current_position, goal) > self.get_distance_minimum(next_position, goal)



            
        
            
