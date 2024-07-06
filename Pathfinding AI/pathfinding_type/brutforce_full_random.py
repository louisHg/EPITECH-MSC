import random
import time
import gymnasium as gym
import numpy as np
from enums import *

#import matplotlib
# Allowed to display it directly on the screen 
#matplotlib.use('TkAgg')

import matplotlib.pyplot as plt

def create_graph_user_mode(only_testing,
                              episode_completed ,episode_time_completion, 
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

    graph_stats = f"""{episode_completed} episodes completed
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/brutforce_full_random/episode_count/episode{episode_completed}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def create_graph_time_limited(only_testing, episodes_completed,
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

    graph_stats = f"""{episodes_completed} episodes completed
    Average reward: {round(np.mean(total_rewards),4)} Average steps: {round(np.mean(total_steps),4)}
    """
    plt.gcf().text(0.01, 0.01, graph_stats)

    file_name = f"./benchmarks/brutforce_full_random/time_limited/time{time_limit}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def generate_random_action_sequence(action_space, max_length):
    length = random.randint(1, max_length)
    sequence = [random.choice(action_space) for _ in range(length)]
    return sequence

def brute_force_random_user_mode(only_testing = False, n_episodes_testing= None):
    
    if only_testing: env = gym.make('Taxi-v3')
    else: 
        env = gym.make('Taxi-v3', render_mode="human")
        env.metadata["render_fps"] = PYGAME_FPS
        n_episodes_testing = int(input("Entrez le nombre d'épisodes de tests: "))

    start = time.time()

    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    action_space = list(range(env.action_space.n))
    max_length = 50  # Adjust based on computational limits

    for _ in range(n_episodes_testing):
        actions = generate_random_action_sequence(action_space, max_length)

        state = env.reset()
        terminated = False
        truncated = False
        rewards = 0
        steps = 0
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()
        
        for action in actions:
            if terminated or truncated:
                break
            _, reward, terminated, truncated, _ = env.step(action)
            rewards += reward
            steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1

            episode_steps += 1 
            episode_reward += reward
        
        if terminated:
            break
        
        total_rewards.append(rewards)
        total_steps.append(steps)

        # Saved how much rewards for the currents episode
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_end = time.time()
        episode_time_completion.append(episode_end - episode_start)

    env.close()

    create_graph_user_mode(only_testing,
                            n_episodes_testing, episode_time_completion, 
                            total_rewards, total_steps, total_penalties)
                
    print(f"[{n_episodes_testing} LOOP DONE - {np.round(time.time() - start)} SECONDS]")

def brute_force_random_time_limited(only_testing = False, time_limit= None):

    if only_testing: env = gym.make('Taxi-v3')
    else: 
        env = gym.make('Taxi-v3', render_mode="human")
        env.metadata["render_fps"] = PYGAME_FPS

        time_limit = int(input("Entrez la limite de temps en secondes: "))

    start = time.time()
    end_time = start + time_limit
    numbers_of_episodes = 0

    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    action_space = list(range(env.action_space.n))
    max_length = 500  # Adjust based on computational limits

    while time.time() < end_time:
        actions = generate_random_action_sequence(action_space, max_length)

        state = env.reset()
        terminated = False
        truncated = False
        rewards = 0
        steps = 0
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()
        
        for action in actions:
            if terminated or truncated:
                break
            _, reward, terminated, truncated, _ = env.step(action)
            rewards += reward
            steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1

            episode_steps += 1 
            episode_reward += reward
        
        if terminated:
            break
        
        total_rewards.append(rewards)
        total_steps.append(steps)
        numbers_of_episodes += 1

        # Saved how much rewards for the currents episode
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_end = time.time()
        episode_time_completion.append(episode_end - episode_start)

    env.close()

    create_graph_time_limited(only_testing,
                              time_limit, numbers_of_episodes, episode_time_completion, 
                              total_rewards, total_steps, total_penalties)
                
    print("[{} LOOP DONE - {} SECONDS]".format(numbers_of_episodes, np.round(time.time() - start)))
    print(f"Number of episodes: {numbers_of_episodes}")
