import gymnasium as gym
import matplotlib.pyplot as plt
import time
from enums import *
import numpy as np

# We predifined a certains trips and when we have the passenger we drop it on the first color case
# If it's an hostel we ended the brut force else we repeat the action of
# Pick the passengers and drop it as possible 
# Time will tell if it was performant trip
# Will return 2 tuple int

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

    file_name = f"./benchmarks/brutforce/episode_count/episode{episode_completed}.jpg"
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

    file_name = f"./benchmarks/brutforce/time_limited/time{time_limit}.jpg"
    file_name = file_name.replace("0.", "")
    plt.savefig(file_name)

    if not only_testing and DISPLAY_CHART: plt.show()
    if only_testing: plt.close()

def brutforce_user_mode(only_testing = False, n_episodes_testing= None) -> tuple[int, int]:

    if only_testing: env = gym.make('Taxi-v3')
    else: 
        env = gym.make('Taxi-v3', render_mode="human")
        env.metadata["render_fps"] = PYGAME_FPS
        n_episodes_testing = int(input("\nEntrez le nombre d'épisodes de test: "))

    total_reward = 0
    passenger_found = False

    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    state = env.reset()

    for _ in range(n_episodes_testing):
        done = False
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()
        stop = False

        while not stop:  
            new_state, reward, _, _, _= env.step(1) # Perform action '1' (move up)

            if state == new_state: # Stop if no change in state
                stop = True

            state = new_state
            episode_steps += 1
            total_reward += reward

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        stop = False
        while not stop: # Loop to move to the top left corner of the grid
            new_state, reward, _, _, _ = env.step(3) # Perform action '3' (move left)
            episode_steps += 1
            total_reward += reward
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if new_state == state:

                for s in [0, 0, 3, 3, 1, 1]: # Move Bottom twice. Move left twice. Move top twice.
                    new_state, reward, _, _, _ = env.step(s)
                    total_reward += reward
                    episode_steps += 1
                    if reward > 0:
                        reward -= 1
                    
                    if reward == -10:
                        episode_penalties += 1

                    episode_steps += 1 
                    episode_reward += reward

                stop = False
                while not stop: # Loop to move to the top edge again
                    new_state, reward, _, _, _ = env.step(1)

                    if state == new_state:
                        stop = True

                    state = new_state
                    episode_steps += 1
                    total_reward += reward
                    if reward > 0:
                        reward -= 1
                    
                    if reward == -10:
                        episode_penalties += 1
                        
                    episode_steps += 1 
                    episode_reward += reward

            state = new_state

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, found, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            state = new_state
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            passenger_found = False
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if done: break

        for s in [0, 0, 0, 0]:
            new_state, reward, _, _, _= env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        for s in [1, 1, 2, 2, 2, 2, 1, 1]:
            new_state, reward, _, _, _ = env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        for s in [0, 0, 0, 0, 3]:
            new_state, reward, _, _, _ = env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        # Saved how much rewards for the currents episode
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_end = time.time()
        episode_time_completion.append(episode_end - episode_start)
        
        if done: break

    env.close()

    create_graph_user_mode(only_testing,
                            n_episodes_testing, episode_time_completion, 
                            total_rewards, total_steps, total_penalties)
 

def brutforce_time_limited(only_testing = False, time_limit= None) -> tuple[int, int]:

    if only_testing: env = gym.make('Taxi-v3')
    else: 
        env = gym.make('Taxi-v3', render_mode="human")
        env.metadata["render_fps"] = PYGAME_FPS

        time_limit = int(input("Entrez la limite de temps en secondes: "))

    total_steps = 0
    total_reward = 0
    passenger_found = False

    start = time.time()
    end_time = start + time_limit
    numbers_of_episodes = 0

    total_rewards = []
    total_steps = []
    total_penalties = []
    episode_time_completion = []

    state = env.reset()

    while time.time() < end_time:
        done = False

        numbers_of_episodes += 1
        episode_steps = 0
        episode_reward = 0
        episode_penalties = 0
        episode_start = time.time()
        stop = False

        while not stop:  
            new_state, reward, _, _, _= env.step(1) # Perform action '1' (move up)

            if state == new_state: # Stop if no change in state
                stop = True

            state = new_state
            episode_steps += 1
            total_reward += reward

            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        stop = False
        while not stop: # Loop to move to the top left corner of the grid
            new_state, reward, _, _, _ = env.step(3) # Perform action '3' (move left)
            episode_steps += 1
            total_reward += reward
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if new_state == state:

                for s in [0, 0, 3, 3, 1, 1]: # Move Bottom twice. Move left twice. Move top twice.
                    new_state, reward, _, _, _ = env.step(s)
                    total_reward += reward
                    episode_steps += 1
                    if reward > 0:
                        reward -= 1
                    
                    if reward == -10:
                        episode_penalties += 1

                    episode_steps += 1 
                    episode_reward += reward

                stop = False
                while not stop: # Loop to move to the top edge again
                    new_state, reward, _, _, _ = env.step(1)

                    if state == new_state:
                        stop = True

                    state = new_state
                    episode_steps += 1
                    total_reward += reward
                    if reward > 0:
                        reward -= 1
                    
                    if reward == -10:
                        episode_penalties += 1
                        
                    episode_steps += 1 
                    episode_reward += reward

            state = new_state

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, found, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            state = new_state
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            passenger_found = False
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        for s in [0, 0, 0, 0]:
            new_state, reward, _, _, _= env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        for s in [1, 1, 2, 2, 2, 2, 1, 1]:
            new_state, reward, _, _, _ = env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        for s in [0, 0, 0, 0, 3]:
            new_state, reward, _, _, _ = env.step(s)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        if not only_testing: env.render()

        if not passenger_found:
            new_state, reward, _, _, _ = env.step(4)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

            if reward == -1:
                passenger_found = True

        else:
            new_state, reward, done, _, _ = env.step(5)
            total_reward += reward
            episode_steps += 1
            if reward > 0:
                reward -= 1
            
            if reward == -10:
                episode_penalties += 1
                
            episode_steps += 1 
            episode_reward += reward

        # Saved how much rewards for the currents episode
        total_steps.append(episode_steps)
        total_rewards.append(episode_reward)
        total_penalties.append(episode_penalties)
        episode_end = time.time()
        episode_time_completion.append(episode_end - episode_start)    

        if done: 
            break


    env.close()

    create_graph_time_limited(only_testing,
                              time_limit, numbers_of_episodes, episode_time_completion, 
                              total_rewards, total_steps, total_penalties)

