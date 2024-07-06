import gymnasium as gym
import numpy as np
import time
from enums import *
import matplotlib.pyplot as plt

###################### MonteCarlo Algo ######################
class MonteCarloAgent:
    def __init__(self, number_of_states, number_of_actions, discount_factor=0.99):
        # Initialiser les variables de l'agent
        self.number_of_states = number_of_states
        self.number_of_actions = number_of_actions
        self.discount_factor = discount_factor
        
        # Initialiser les valeurs des états-actions (Q-values)
        self.state_action_values = np.zeros((number_of_states, number_of_actions))
        
        # Compter les visites pour chaque état-action
        self.state_action_visits = np.zeros((number_of_states, number_of_actions))
        
        # Initialiser la politique aléatoire
        self.policy = np.ones((number_of_states, number_of_actions)) / number_of_actions
        
    def select_action(self, state):
        # Sélectionner une action basée sur la politique actuelle
        return np.random.choice(self.number_of_actions, p=self.policy[state])
    
    def generate_episode(self, environment):
        episode = []
        state, _ = environment.reset()
        done = False

        while not done:
            action = environment.action_space.sample() 
            next_state, reward, done, _, _ = environment.step(action)
            episode.append((state, action, reward))
            state = next_state

        return episode

    def update_policy(self):
        # Mettre à jour la politique pour chaque état
        for state in range(self.number_of_states):
            best_action = np.argmax(self.state_action_values[state])
            self.policy[state] = np.eye(self.number_of_actions)[best_action]
    
    def learn_from_episode(self, episode):
        returns = 0
        for state, action, reward in reversed(episode):
            returns = self.discount_factor * returns + reward
            self.state_action_visits[state, action] += 1
            self.state_action_values[state, action] += (returns - self.state_action_values[state, action]) / self.state_action_visits[state, action]

        self.update_policy()

def create_graph_user_mode(only_testing, n_episodes_training, episode_time_completion, total_rewards, total_steps, total_penalties):
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

    graph_stats = f"""{n_episodes_training} training episodes
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/montecarlo/episode_count/episodes{n_episodes_training}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def create_graph_time_limited(only_testing,
                              time_limit ,episode_time_completion, 
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

    graph_stats = f"""{time_limit} seconds
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/montecarlo/time_limited/time{time_limit}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()


def evaluate_agent(environment, agent, state):
    done = False
    episode_reward = 0
    episode_penalty = 0
    episode_step = 0

    max_step = 200
    current_step = 0

    while not done:
        action = agent.select_action(state)
        next_state, reward, done, _, _ = environment.step(action)
        if reward == -10:
            episode_penalty += 1
        episode_reward += reward
        state = next_state
        episode_step += 1

        current_step += 1
        if current_step > max_step: break

    return episode_reward, episode_penalty, episode_step


def montecarlo_user_mode(only_testing=False, nb_training_episodes = None):

    ###################### Créer l'environnement Taxi ######################
    environment = gym.make('Taxi-v3')
    if not only_testing: 
        nb_training_episodes = int(input("Entrez le nombre d'épisodes d'entrainement: "))


    ###################### Obtenir le nombre d'états et d'actions ######################
    number_of_states = environment.observation_space.n
    number_of_actions = environment.action_space.n

    ####################### Initialiser l'agent ######################
    agent = MonteCarloAgent(number_of_states, number_of_actions)

    start_time = time.time()

    for _ in range(nb_training_episodes):
        episode = agent.generate_episode(environment)
        agent.learn_from_episode(episode)

    elapsed_time = time.time() - start_time
    print(f"\nEntraînement d'agent terminé en {elapsed_time:.2f} secondes\n")
    environment.close()

    if only_testing: 
        environment = gym.make('Taxi-v3')
        nb_test_episodes = nb_training_episodes
    else:
        environment = gym.make('Taxi-v3', render_mode="human")
        environment.metadata["render_fps"] = PYGAME_FPS
        nb_test_episodes = int(input("\nEntrez le nombre d'épisodes de test: "))

    ##################### Évaluer l'agent final #####################

    total_rewards = []
    total_steps = []
    total_penalties = []
    total_episode_completion = []

    for _ in range(nb_test_episodes):
    
        episode_start = time.time()
        state, _ = environment.reset()
        episode_reward, episode_penalty, episode_steps = evaluate_agent(environment, agent, state)

        total_rewards.append(episode_reward)
        total_steps.append(episode_steps)
        total_penalties.append(episode_penalty)
        total_episode_completion.append(time.time() - episode_start)
    
    create_graph_user_mode(only_testing,
                            nb_test_episodes, total_episode_completion, 
                            total_rewards, total_steps, total_penalties)


def montecarlo_time_limited(only_testing = False, time_limit=None):
    ###################### Créer l'environnement Taxi ######################
    environment = gym.make('Taxi-v3')

    if not only_testing:
        time_limit = int(input("Entrez la limite de temps en secondes: "))

    ###################### Obtenir le nombre d'états et d'actions ######################
    number_of_states = environment.observation_space.n
    number_of_actions = environment.action_space.n

    ####################### Initialiser l'agent ######################
    agent = MonteCarloAgent(number_of_states, number_of_actions)

    end_time = time.time() + time_limit

    episode_count = 0

    while time.time() < end_time:
        episode_count += 1
        episode = agent.generate_episode(environment)
        agent.learn_from_episode(episode)

    print(f"\n{episode_count} terminés.\n")

    environment.close()

    if only_testing: 
        environment = gym.make('Taxi-v3')
    else:
        environment = gym.make('Taxi-v3', render_mode="human")
        environment.metadata["render_fps"] = PYGAME_FPS

    ##################### Évaluer l'agent final #####################

    total_rewards = []
    total_steps = []
    total_penalties = []
    total_episode_completion = []

    end_time = time.time() + time_limit

    while time.time() < end_time:
        episode_start = time.time()
        state, _ = environment.reset()
        episode_reward, episode_penalty, episode_steps = evaluate_agent(environment, agent, state)

        total_rewards.append(episode_reward)
        total_steps.append(episode_steps)
        total_penalties.append(episode_penalty)
        total_episode_completion.append(time.time() - episode_start)
    
    create_graph_time_limited(only_testing,
                              time_limit, total_episode_completion, 
                              total_rewards, total_steps, total_penalties)