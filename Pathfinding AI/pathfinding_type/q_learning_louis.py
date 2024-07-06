import gymnasium as gym
import numpy as np
#import matplotlib
from enums import *
import pickle

import matplotlib.pyplot as plt
# Used loading and saving data
import time

# Allowed to display it directly on the screen 
#matplotlib.use('TkAgg')

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

    graph_stats = f"""{n_episodes_training} training episodes alpha: {alpha} gamma: {gamma} epsilon: {round(epsilon, 4)}
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/q_learning_louis/episode_count/episodes{n_episodes_training}_a{alpha}_g{gamma}_e{round(epsilon, 4)}.jpg"
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

    graph_stats = f"""{time_limit} seconds alpha: {alpha} gamma: {gamma} epsilon: {round(epsilon, 4)} episode_completed {episode_completed}
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/q_learning_louis/time_limited/time{time_limit}_a{alpha}_g{gamma}_e{round(epsilon, 4)}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def q_learning_louis_user_mode(only_testing=False,alpha=None, gamma=None, epsilon=None, n_episodes_training=None):
    env = gym.make('Taxi-v3')
    env.metadata["render_fps"] = PYGAME_FPS

    Q = np.zeros((env.observation_space.n, env.action_space.n)) # init a 500 x 6 array

    if not only_testing:
        alpha, gamma, epsilon, n_episodes_training = ask_meta_values()
    
    original_alpha = alpha

    epsilon_decay_rate = 0.0001        # epsilon decay rate. 1/0.0001 = 10,000
    
    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    # For each epiosde we reseting to the initial states
    for _ in range(n_episodes_training):
        state = env.reset()[0]  
        # (initial_state, info) There's 64 states with information called initial states
        # And info which is a dictionnary containning all informations about the place
        # + : states: 0 to 63, 0=top left corner,63=bottom right corner
        terminated = False      # True when we reached the goal
        truncated = False       # True when actions > 200

        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()

        # Execute until it's finished or we don't missed up 200 times
        while(not terminated and not truncated):
            # If we're in the trainning step, we did 1 random action 
            if np.random.rand() < epsilon:
                action = env.action_space.sample() # actions: 0=left,1=down,2=right,3=up
            # When we're in user mode, we picked the highest Q-value
            # highest Q-value is the best actions to did for a given states
            else:
                action = np.argmax(Q[state,:])

            #  Execute the actions picked up before
            # All informations are in variable and refered in documentation
            # Rewards are automatically given by gymnasium, well on we can customize it more
            new_state,reward,terminated,truncated,_ = env.step(action)

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1

                # Update Q-values, objective is too have the highest one 
                # The best Q-values is best pair states/actions
            Q[state,action] = Q[state,action] + alpha * (reward + gamma * np.max(Q[new_state,:]) - Q[state,action])

            # Our news states or position evolved
            episode_steps += 1 
            episode_reward += reward

            state = new_state

        # Reduce epsilon throw the time to not have overlearning
        epsilon = max(epsilon - epsilon_decay_rate, 0)

        #  If espilon has 0 has value put the minimum leaning rates to not influence more the states
        # Objective (don't beeing lost)
        if epsilon == 0:
            alpha = 0.0001

        # Saved how much rewards for the currents episode
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_end = time.time()
        episode_time_completion.append(episode_end - episode_start)

    # When all episodes are done close it
    env.close()

    create_graph_user_mode(only_testing, 
                           original_alpha, gamma,epsilon,
                           n_episodes_training, 
                           episode_time_completion, total_rewards, total_steps ,total_penalties)
    
    file_name = f"./benchmarks/q_learning_louis/episode_count/q_tables/episodes{n_episodes_training}_a{alpha}_g{gamma}_e{round(epsilon, 4)}.pkl"
    f = open(file_name,"wb")
    # Effective way to save Q-table reinforcement learning in a file called taxi.pkl
    pickle.dump(Q, f)
    f.close()
    
    if only_testing: return
    
    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))

    env = gym.make("Taxi-v3", render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    rewards_per_episode = np.zeros(n_episode_testing)

    # For each epiosde we reseting to the initial states
    for i in range(n_episode_testing):
        state = env.reset()[0]  
        # (initial_state, info) There's 64 states with information called initial states
        # And info which is a dictionnary containning all informations about the place
        # + : states: 0 to 63, 0=top left corner,63=bottom right corner
        terminated = False      # True when we reached the goal
        truncated = False       # True when actions > 200

        rewards = 0

        iteration_limit = 200
        current_iteration = 0

        # Execute until it's finished or we don't missed up 200 times
        while(not terminated and not truncated):

            current_iteration += 1

            action = np.argmax(Q[state,:])

            #  Execute the actions picked up before
            # All informations are in variable and refered in documentation
            # Rewards are automatically given by gymnasium, well on we can customize it more
            new_state,reward,terminated,truncated,_ = env.step(action)

            # Sum all rewards for the episodes
            rewards += reward

            # Our news states or position evolved 
            state = new_state

            if current_iteration > iteration_limit: break



        # Saved how much rewards for the currents episode
        rewards_per_episode[i] = rewards

    # When all episodes are done close it
    env.close()

def q_learning_louis_time_limited_mode(only_testing=False,alpha=None, gamma=None, epsilon=None, time_limit=None):
    env = gym.make('Taxi-v3')
    env.metadata["render_fps"] = PYGAME_FPS

    Q = np.zeros((env.observation_space.n, env.action_space.n)) # init a 500 x 6 array

    if not only_testing:
        time_limit = int(input("Entrez la limite de temps en secondes: "))
        alpha = 0.5
        gamma = 0.5
        epsilon = 0.5

    original_alpha = alpha

    epsilon_decay_rate = 0.0001        # epsilon decay rate. 1/0.0001 = 10,000

    episode_count = 0
    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    end_time = time.time() + time_limit

    # For each epiosde we reseting to the initial states
    while time.time() < end_time:
        state = env.reset()[0]  
        # (initial_state, info) There's 64 states with information called initial states
        # And info which is a dictionnary containning all informations about the place
        # + : states: 0 to 63, 0=top left corner,63=bottom right corner
        terminated = False      # True when we reached the goal
        truncated = False       # True when actions > 200

        episode_count += 1
        
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()

        # Execute until it's finished or we don't missed up 200 times
        while(not terminated and not truncated):
            # we did 1 random action 
            if np.random.rand() < epsilon:
                action = env.action_space.sample() # actions: 0=left,1=down,2=right,3=up
            # When we're in user mode, we picked the highest Q-value
            # highest Q-value is the best actions to did for a given states
            else:
                action = np.argmax(Q[state,:])

            #  Execute the actions picked up before
            # All informations are in variable and refered in documentation
            # Rewards are automatically given by gymnasium, well on we can customize it more
            next_state, reward, terminated, truncated,_ = env.step(action)

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1

            # Update Q-values, objective is too have the highest one 
            # The best Q-values is best pair states/actions
            Q[state, action] += alpha * (reward + gamma * np.max(Q[next_state]) - Q[state, action])

            # Our news states or position evolved 
            state = next_state
            episode_steps += 1
            episode_reward += reward

        # Reduce epsilon throw the time to not have overlearning
        epsilon = max(epsilon - epsilon_decay_rate, 0)
        episode_end = time.time()

        #  If espilon has 0 has value put the minimum leaning rates to not influence more the states
        # Objective (don't beeing lost)
        if epsilon == 0:
            alpha = 0.0001

        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_time_completion.append(episode_end - episode_start)

    # When all episodes are done close it
    env.close()

    create_graph_time_limited(only_testing, original_alpha, gamma, epsilon,
                              time_limit, episode_count, episode_time_completion, 
                              total_rewards, total_steps, total_penalties)
    
    file_name = f"./benchmarks/q_learning_louis/time_limited/q_tables/time{time_limit}_a{alpha}_g{gamma}_e{round(epsilon, 4)}.pkl"
    f = open(file_name,"wb")
    # Effective way to save Q-table reinforcement learning in a file called taxi.pkl
    pickle.dump(Q, f)
    f.close()

    if only_testing: return

    n_episode_testing = int(input("\nEntrez le nombre d'épisodes de test: "))

    env = gym.make("Taxi-v3", render_mode="human")
    env.metadata["render_fps"] = PYGAME_FPS

    rewards_per_episode = np.zeros(n_episode_testing)

    # For each epiosde we reseting to the initial states
    for i in range(n_episode_testing):
        state = env.reset()[0]  
        # (initial_state, info) There's 64 states with information called initial states
        # And info which is a dictionnary containning all informations about the place
        # + : states: 0 to 63, 0=top left corner,63=bottom right corner
        terminated = False      # True when we reached the goal
        truncated = False       # True when actions > 200

        rewards = 0
        iteration_limit = 200
        current_iteration = 0
        # Execute until it's finished or we don't missed up 200 times
        while(not terminated and not truncated):
            current_iteration += 1
            action = np.argmax(Q[state,:])

            #  Execute the actions picked up before
            # All informations are in variable and refered in documentation
            # Rewards are automatically given by gymnasium, well on we can customize it more
            new_state,reward,terminated,truncated,_ = env.step(action)

            # Sum all rewards for the episodes
            rewards += reward

            # Our news states or position evolved 
            state = new_state

            if current_iteration > iteration_limit: break



        # Saved how much rewards for the currents episode
        rewards_per_episode[i] = rewards

    # When all episodes are done close it
    env.close()

    mean_reward = np.mean(total_rewards)
    mean_steps = np.mean(total_steps)
    print("Nombres d'épisodes complétés:", episode_count)
    print("Récompense moyenne:", mean_reward)
    print("Etapes moyennes:", mean_steps)

