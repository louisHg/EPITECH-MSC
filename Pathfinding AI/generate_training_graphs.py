from pathfinding_type.vanilla_q_learning import vanilla_q_learning_user_mode, vanilla_q_time_limited_mode
from pathfinding_type.a_star_q_learning import a_star_user_mode, a_star_time_limited_mode
from pathfinding_type.q_learning_louis import q_learning_louis_user_mode, q_learning_louis_time_limited_mode
from pathfinding_type.brutforce_full_random import brute_force_random_time_limited, brute_force_random_user_mode
from pathfinding_type.brutforce import brutforce_user_mode, brutforce_time_limited
from pathfinding_type.montecarlo import montecarlo_user_mode, montecarlo_time_limited

from random import randint, random


TEST_COUNT = 10

episode_counts = []
time_limits = []

for i in range(TEST_COUNT):
    alpha = round(random(), 4)
    gamma = round(random(), 4)
    epsilon = round(random(), 4)

    episode_count = randint(20, 10000)
    time_limit = randint(1, 30)

    episode_counts.append((alpha, gamma, epsilon, episode_count))
    time_limits.append((alpha, gamma, epsilon, time_limit))

for test_params in episode_counts:
    vanilla_q_learning_user_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    a_star_user_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    q_learning_louis_user_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    brute_force_random_user_mode(True, test_params[3])
    brutforce_user_mode(True, test_params[3])
    montecarlo_user_mode(True, round(test_params[3]/20))

for test_params in time_limits:
    vanilla_q_time_limited_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    a_star_time_limited_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    q_learning_louis_time_limited_mode(True, test_params[0],test_params[1], test_params[2], test_params[3])
    brute_force_random_time_limited(True, test_params[3])
    brutforce_time_limited(True, test_params[3])
    montecarlo_time_limited(True, test_params[3])