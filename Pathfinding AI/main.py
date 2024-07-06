from pathfinding_type.a_star_q_learning import a_star_user_mode, a_star_time_limited_mode
from pathfinding_type.vanilla_q_learning import vanilla_q_learning_user_mode, vanilla_q_time_limited_mode
from pathfinding_type.montecarlo import montecarlo_user_mode, montecarlo_time_limited
from pathfinding_type.brutforce_full_random import brute_force_random_user_mode, brute_force_random_time_limited
from pathfinding_type.brutforce import brutforce_user_mode, brutforce_time_limited
from pathfinding_type.q_learning_louis import q_learning_louis_user_mode, q_learning_louis_time_limited_mode

PATHFINDING_TYPE = [{ 
        "id": 1,
        "name": "Vanilla Q Learning",
        "user_mode": vanilla_q_learning_user_mode,
        "time_limited": vanilla_q_time_limited_mode
    },
    {
        "id": 2,
        "name": "Q-learning Louis",
        "user_mode": q_learning_louis_user_mode,
        "time_limited": q_learning_louis_time_limited_mode
    },
    {
        "id": 3,
        "name": "A* Q Learning",
        "user_mode": a_star_user_mode,
        "time_limited": a_star_time_limited_mode
    },
    {
        "id": 4,
        "name": "Monte Carlo",
        "user_mode": montecarlo_user_mode,
        "time_limited": montecarlo_time_limited
    },
    {
        "id": 5,
        "name": "Brutforce random",
        "user_mode": brute_force_random_user_mode,
        "time_limited": brute_force_random_time_limited
    },
    {
        "id": 6,
        "name": "Smart brutforce",
        "user_mode": brutforce_user_mode,
        "time_limited": brutforce_time_limited
    },
]


if __name__ == "__main__":

    print("Voici les modes disponibles:")
    for mode in PATHFINDING_TYPE:
        print("{}. {}".format(mode["id"], mode["name"]))

    mode = input("\nSelectionnez un mode: ")

    for possible_mode in PATHFINDING_TYPE:
        if possible_mode["id"] == int(mode):
            selected_mode = possible_mode

    print("1. Mode personalisé\n2. Mode temps limit\n")
    sub_type = int(input("Selectionnez un sous-mode: "))

    
    if sub_type == 1: selected_mode["user_mode"]()
    elif sub_type == 2: selected_mode["time_limited"]()
    
    