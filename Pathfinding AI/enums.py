


DISPLAY_CHART = True

TRAVELABLE_PATH = {
    #(Column, Line): Down => Up => Right => Left
    (0, 0): [True, False, True, False],
    (1, 0): [True, False, False, True],
    (2, 0): [True, False, True, False],
    (3, 0): [True, False, True, True],
    (4, 0): [True, False, False, True],

    (0, 1): [True, True, True, False],
    (1, 1): [True, True, False, True],
    (2, 1): [True, True, True, False],
    (3, 1): [True, True, True, True],
    (4, 1): [True, True, False, True],

    (0, 2): [True, True, True, False],
    (1, 2): [True, True, True, True],
    (2, 2): [True, True, True, True],
    (3, 2): [True, True, True, True],
    (4, 2): [True, True, False, True],

    (0, 3): [True, True, False, False],
    (1, 3): [True, True, True, False],
    (2, 3): [True, True, False, True],
    (3, 3): [True, True, True, False],
    (4, 3): [True, True, False, True],

    (0, 4): [False, True, False, False],
    (1, 4): [False, True, True, False],
    (2, 4): [False, True, False, True],
    (3, 4): [False, True, True, False],
    (4, 4): [False, True, False, True],
}

#Destinations:
#0: Red
#1: Green
#2: Yellow
#3: Blue
#4: Taxi

SPECIAL_LOCATIONS = {
    0: (0, 0),
    1: (4, 0),
    2: (0, 4),
    3: (3, 4),
    4: "Taxi"
}

REWARD_TABLE = {
    "illegal_move": -10,
    "finishing_move": 20,
    "succesful_pick_up": 10,
    "null": 0,
    "getting_closer": 5,
    "getting_farther": -5
}

PYGAME_FPS = 120