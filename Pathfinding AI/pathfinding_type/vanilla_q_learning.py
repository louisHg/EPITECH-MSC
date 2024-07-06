import gymnasium as gym
import time
from enums import *
import numpy as np
import matplotlib.pyplot as plt
import pickle


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

    file_name = f"./benchmarks/vanilla_q_learning/episode_count/episodes{n_episodes_training}_a{alpha}_g{gamma}_e{epsilon}.jpg"
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

    file_name = f"./benchmarks/vanilla_q_learning/time_limited/time{time_limit}_a{alpha}_g{gamma}_e{epsilon}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def vanilla_q_learning_user_mode(only_testing=False,alpha=None, gamma=None, epsilon=None, n_episodes_training=None):

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
            next_state, initial_reward, done, _, _ = env.step(action)
            reward = initial_reward

            if reward == -10: # Checks if agent attempted to do an illegal action.
                current_episode_penalty += 1

            if reward > 0:
                reward -= 1
            
            # Update Q-value
            Q[state, action] += alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
            
            state = next_state
            current_episode_reward += reward
            current_episode_steps += 1

        
        episode_end = time.time()

        total_rewards.append(current_episode_reward)
        total_steps.append(current_episode_steps)
        total_penalties.append(current_episode_penalty)

        episode_time_completion.append(episode_end - episode_start)
    
    end_time = time.time()
    print("Entrainement completé en {:.2f} secondes.".format(end_time - start_time))

    create_graph_user_mode(only_testing, 
                           alpha, gamma,epsilon,
                           n_episodes_training, 
                           episode_time_completion, total_rewards, total_steps ,total_penalties)
    
    if only_testing: return
    
    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))
    # Display random episodes
    env = gym.make('Taxi-v3', render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    total_penalties = []
    total_rewards = []
    total_steps = []

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
        
        total_penalties.append(current_episode_penalty)
        total_steps.append(current_episode_steps)
        total_rewards.append(current_episode_reward)
    
    print("\nStatistiques finales:")
    print("Etapes moyennes: ", np.mean(total_steps))
    print("Récompenses moyennes: ", np.mean(total_rewards))
    print("Pénalités moyennes: ", np.mean(total_penalties))


def vanilla_q_time_limited_mode(only_testing=False,alpha=None, gamma=None, epsilon=None, time_limit=None):

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
        
        done = False
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0

        episode_start = time.time()
        
        while time.time() < end_time and not done:
            if np.random.rand() < epsilon:
                action = env.action_space.sample()  # Exploration
            else:
                action = np.argmax(Q[state])  # Exploitation
            
            # Take action
            next_state, reward, done, _, _ = env.step(action)

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
            
            # Update Q-value
            Q[state, action] += alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
            
            state = next_state
            episode_steps += 1
            episode_reward += reward

        episode_end = time.time()
        
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_time_completion.append(episode_end - episode_start)
        
    create_graph_time_limited(only_testing, alpha, gamma, epsilon,
                              time_limit, episode_count, episode_time_completion, 
                              total_rewards, total_steps, total_penalties)

    
    if only_testing: return

    # Display random episodes
    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))
    env = gym.make("Taxi-v3", render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    total_penalties = []
    total_rewards = []
    total_steps = []
    episode_time_completion = []

    for _ in range(n_episode_testing):
        state, _ = env.reset()
        done = False

        iteration_limit = 200
        current_iteration = 0

        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0

        episode_start = time.time()

        while not done:
            current_iteration += 1
            env.render()
            action = np.argmax(Q[state])
            state, reward, done, _, _ = env.step(action)

            if reward == -10:
                episode_penalties += 1

            episode_steps += 1
            episode_reward += reward
            
            if current_iteration > iteration_limit: break
        
        episode_end = time.time()
        
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_time_completion.append(episode_end - episode_start)
            
    env.close()

    print("\nStatistiques finales:")
    print("Etapes moyennes:", np.mean(total_steps))
    print("Récompenses moyennes:", np.mean(total_rewards))
    print("Pénalités moyennes:", np.mean(total_penalties))