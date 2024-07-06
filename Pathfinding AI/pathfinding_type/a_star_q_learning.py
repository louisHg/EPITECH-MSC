import gymnasium as gym
import time
from enums import *
import numpy as np
from helpers import frozendict
import matplotlib.pyplot as plt

from typing import Tuple
from functools import lru_cache

def ask_meta_values():
    alpha = float(input("Entrez le taux d'apprentissage (alpha): "))
    gamma = float(input("Entrez le facteur d'actualisation (gamma): "))
    epsilon = float(input("Entrez le taux d'exploration (epsilon): "))
    n_episodes_training = int(input("Entrez le nombre d'épisodes d'entrainement: "))

    return alpha, gamma, epsilon, n_episodes_training

def create_graph_user_mode(only_testing, alpha, gamma, epsilon, n_episodes_training, episode_time_completion, total_rewards, total_steps, total_penalties):
    figure, axis = plt.subplots(2,2)
    figure.tight_layout(pad=2)
    figure.set_size_inches(10,8)

    axis[0, 0].plot(episode_time_completion)
    axis[0, 0].set_title("Temps de complétion")

    axis[0, 1].plot(total_rewards)
    axis[0, 1].set_title("Récompenses")

    axis[1, 0].plot(total_steps)
    axis[1, 0].set_title("Etapes")

    axis[1, 1].plot(total_penalties)
    axis[1, 1].set_title("Pénalités")

    graph_stats = f"""{n_episodes_training} training episodes alpha: {alpha} gamma: {gamma} epsilon: {epsilon}
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/a_star_q_learning/episode_count/episodes{n_episodes_training}_a{alpha}_g{gamma}_e{epsilon}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def create_graph_time_limited(only_testing, alpha, gamma, epsilon, 
                              time_limit, episode_completed ,episode_time_completion, 
                              total_rewards, total_steps, total_penalties):
    figure, axis = plt.subplots(2,2)
    figure.tight_layout(pad=2)
    figure.set_size_inches(10,8)

    axis[0, 0].plot(episode_time_completion)
    axis[0, 0].set_title("Temps de complétion")

    axis[0, 1].plot(total_rewards)
    axis[0, 1].set_title("Récompenses")

    axis[1, 0].plot(total_steps)
    axis[1, 0].set_title("Etapes")

    axis[1, 1].plot(total_penalties)
    axis[1, 1].set_title("Pénalités")

    graph_stats = f"""{time_limit} seconds alpha: {alpha} gamma: {gamma} epsilon: {epsilon} episode_completed {episode_completed}
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/a_star_q_learning/time_limited/time{time_limit}_a{alpha}_g{gamma}_e{epsilon}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()


@lru_cache
def handle_rewards(graph, action: int, current_env, next_env, will_be_done) -> int:

    #The action will finish the episode
    if will_be_done:
        return REWARD_TABLE["finishing_move"]

    #If trying to pick up passenger while on passenger position
    if action == 4 and current_env["taxi_location"] == current_env["passenger_location"]:
        return REWARD_TABLE["succesful_pick_up"]

    #If trying to drop passenger while no passenger
    if action == 5 and current_env["passenger_location"] != SPECIAL_LOCATIONS[4]:
        return REWARD_TABLE["illegal_move"]
    
    #If trying to drop passenger while not at destination
    if action == 5 and current_env["taxi_location"] != current_env["destination_location"]:
        return REWARD_TABLE["illegal_move"]
    
    #if trying to pickup passenger while not on passenger
    if action == 4 and current_env["taxi_location"] != current_env["passenger_location"]:
        return REWARD_TABLE["illegal_move"]
    
    #If trying to move in a direction where it's not possible
    if not TRAVELABLE_PATH[current_env["taxi_location"]][action]:
        return REWARD_TABLE["illegal_move"]
    
    
    if current_env["passenger_location"] == SPECIAL_LOCATIONS[4]:
        goal_location = current_env["destination_location"]
    else:
        goal_location = current_env["passenger_location"]

    if graph.is_path_optimal(current_env["taxi_location"], next_env["taxi_location"], goal_location):
        return REWARD_TABLE["getting_closer"]
    else:
        return REWARD_TABLE["getting_farther"]


def a_star_user_mode(only_testing=False,alpha=None, gamma=None, epsilon=None, n_episodes_training=None):

    GRAPH = Graph()

    # Initialize environment
    env = gym.make('Taxi-v3')
    n_states = env.observation_space.n
    n_actions = env.action_space.n

    # Initialize Q-table
    Q = np.zeros((n_states, n_actions))

    if not only_testing:
        alpha, gamma, epsilon, n_episodes_training = ask_meta_values()

    # Q-learning algorithm
    start_time = time.time()

    total_rewards = []
    total_steps = []
    total_penalties = []

    episode_time_completion = []

    for _ in range(n_episodes_training):
        episode_start = time.time()
        state, _ = env.reset()

        decoded_env= list(env.unwrapped.decode(state))
        current_env = {
            "taxi_location": (decoded_env[1], decoded_env[0]),
            "passenger_location": SPECIAL_LOCATIONS[decoded_env[2]],
            "destination_location": SPECIAL_LOCATIONS[decoded_env[3]],
        }

        
        done = False
        current_episode_penalty = 0
        current_episode_reward = 0
        current_episode_steps = 0
        
        while not done:
            if np.random.rand() < epsilon:
                action = env.action_space.sample()  # Exploration
            else:
                action = np.argmax(Q[state])  # Exploitation
            
            # Take action
            next_state, _, done, _, _ = env.step(action)

            next_decoded_env = list(env.unwrapped.decode(next_state))
            next_env = {
                "taxi_location": (next_decoded_env[1], next_decoded_env[0]),
                "passenger_location": SPECIAL_LOCATIONS[next_decoded_env[2]],
                "destination_location": SPECIAL_LOCATIONS[next_decoded_env[3]],
            }
            
            reward = handle_rewards(GRAPH, action, frozendict(current_env), frozendict(next_env), will_be_done=done)

            if reward == -10: # Checks if agent attempted to do an illegal action.
                current_episode_penalty += 1

            if reward > 0:
                reward -= 1
            
            # Update Q-value
            Q[state, action] += alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
            
            state = next_state
            current_env = next_env
            current_episode_reward += reward
            current_episode_steps += 1

        
        episode_end = time.time()

        total_rewards.append(current_episode_reward)
        total_steps.append(current_episode_steps)
        total_penalties.append(current_episode_penalty)

        episode_time_completion.append(episode_end - episode_start)

    end_time = time.time()
    print("\nEntrainement completé en {:.2f} secondes.".format(end_time - start_time))

    create_graph_user_mode(only_testing, 
                           alpha, gamma,epsilon,
                           n_episodes_training, 
                           episode_time_completion, total_rewards, total_steps ,total_penalties)
    
    if only_testing: return

    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))

    # Display random episodes
    env = gym.make('Taxi-v3', render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    penalties = []
    rewards = []
    steps = []

    for _ in range(n_episode_testing):
        state, _ = env.reset()
        done = False
        current_episode_penalty = 0
        current_episode_reward = 0
        current_episode_steps = 0

        iteration_limit = 200
        current_iteration = 0

        while not done:
            current_iteration += 1
            env.render()
            action = np.argmax(Q[state])
            state, reward, done, _, _ = env.step(action)

            if reward == -10:
                current_episode_penalty += 1
            
            current_episode_steps += 1
            current_episode_reward += reward
            if current_iteration > iteration_limit: break
        
        penalties.append(current_episode_penalty)
        steps.append(current_episode_steps)
        rewards.append(current_episode_reward)
    
    print("\nStatistiques finales:")
    print("Etapes moyennes: ", np.mean(total_steps))
    print("Récompenses moyennes: ", np.mean(total_rewards))
    print("Pénalités moyennes: ", np.mean(total_penalties))

def a_star_time_limited_mode(only_testing=False, alpha=None, gamma=None, epsilon=None, time_limit=None):

    GRAPH = Graph()

    # Initialize environment
    env = gym.make("Taxi-v3")
    n_states = env.observation_space.n
    n_actions = env.action_space.n

    # Optimal hyperparameters
    if not only_testing:
        time_limit = int(input("Entrez la limite de temps en secondes: "))
        alpha = 0.5
        gamma = 0.5
        epsilon = 0.5

    # Initialize Q-table
    Q = np.zeros((n_states, n_actions))

    # Q-learning algorithm
    episode_count = 0

    total_rewards = []
    total_steps = []
    total_penalties = []

    episode_time_completion = []

    end_time = time.time() + time_limit

    while time.time() < end_time:
        state, _ = env.reset()

        episode_count += 1

        decoded_env= list(env.unwrapped.decode(state))
        current_env = {
            "taxi_location": (decoded_env[1], decoded_env[0]),
            "passenger_location": SPECIAL_LOCATIONS[decoded_env[2]],
            "destination_location": SPECIAL_LOCATIONS[decoded_env[3]],
        }

        
        done = False

        current_episode_penalty = 0
        current_episode_reward = 0
        current_episode_steps = 0

        episode_start = time.time()
        
        while time.time() < end_time and not done:
            if np.random.rand() < epsilon:
                action = env.action_space.sample()  # Exploration
            else:
                action = np.argmax(Q[state])  # Exploitation
            
            # Take action
            next_state, _, done, _, _ = env.step(action)

            next_decoded_env = list(env.unwrapped.decode(next_state))
            next_env = {
                "taxi_location": (next_decoded_env[1], next_decoded_env[0]),
                "passenger_location": SPECIAL_LOCATIONS[next_decoded_env[2]],
                "destination_location": SPECIAL_LOCATIONS[next_decoded_env[3]],
            }
            
            reward = handle_rewards(GRAPH, action, frozendict(current_env), frozendict(next_env), will_be_done=done)

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                current_episode_penalty += 1
            
            # Update Q-value
            Q[state, action] += alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
            
            state = next_state
            current_env = next_env

            current_episode_reward += reward
            current_episode_steps += 1
        
        episode_end = time.time()
        
        total_steps.append(current_episode_steps)
        total_rewards.append(current_episode_reward)
        total_penalties.append(current_episode_penalty)

        episode_time_completion.append(episode_end - episode_start)
        
    
    create_graph_time_limited(only_testing, alpha, gamma, epsilon,
                              time_limit, episode_count, episode_time_completion, 
                              total_rewards, total_steps, total_penalties)
    
    if only_testing: return

    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))

    # Display random episodes
    env = gym.make('Taxi-v3', render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    penalties = []
    rewards = []
    steps = []

    for _ in range(n_episode_testing):
        state, _ = env.reset()
        done = False
        current_episode_penalty = 0
        current_episode_reward = 0
        current_episode_steps = 0

        iteration_limit = 200
        current_iteration = 0

        while not done:
            current_iteration += 1
            env.render()
            action = np.argmax(Q[state])
            state, reward, done, _, _ = env.step(action)

            if reward == -10:
                current_episode_penalty += 1
            
            current_episode_steps += 1
            current_episode_reward += 1
            
            if current_iteration > iteration_limit: break
        
        penalties.append(current_episode_penalty)
        steps.append(current_episode_steps)
        rewards.append(current_episode_reward)
    
    print("\nStatistiques finales:")
    print("Etapes moyennes: ", np.mean(total_steps))
    print("Récompenses moyennes: ", np.mean(total_rewards))
    print("Pénalités moyennes: ", np.mean(total_penalties))

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
