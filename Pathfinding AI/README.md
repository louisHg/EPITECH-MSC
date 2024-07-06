# L'apprentissage par renforcement - Pathfinding AI

## Concept clés :

L'**environnement** est tout ce qui interagit avec l'agent. C'est l'entité dans laquelle l'agent prend des actions et reçoit des états et des récompenses.

Dans notre projet, l'environnement est un labyrinthe avec 4 cases spéciales de couleurs

L'**agent** est l'entité qui prend des actions dans l'environnement. L'objectif de l'agent est de maximiser la récompense cumulative au fil du temps.

Dans notre projet, l'agent est un taxi qui doit maximiser son temps de trajet

L'**action** est une décision prise par l'agent à partir de l'état actuel. Les actions modifient l'état de l'environnement.

Dans notre projet, les actions possibles sont les déplacement haut, bas, gauche et droite, puis prendre passager ou déposer passager

La **récompense** est un retour d'information que l'agent reçoit de l'environnement après avoir pris une action. C'est un signal de rétroaction utilisé pour évaluer l'action entreprise. L'objectif de l'agent est de maximiser la somme des récompenses qu'il reçoit au fil du temps.

Dans notre projet, il y a 3 récompenses possible, -1 par mouvement de case, +20 pour déposer un passager au bon endroit, -10 pour une action prendre ou déposer mauvaise.

L'**état** est une représentation de la situation actuelle de l'environnement. L'agent perçoit l'état à un instant donné pour décider quelle action entreprendre.


![image](https://github.com/EpitechMscProPromo2024/T-AIA-902-LIL_4/assets/24878422/b81d2c82-2731-4750-8f84-3491cda6b011)

## Algorithmes d'apprentissages

### Q-Learning personalisé

Le Q-learning est un algorithme d'apprentissage par renforcement utilisé pour trouver une politique optimale pour un problème donné, en apprenant quelle action entreprendre dans un état particulier pour maximiser une récompense cumulative.

### Brute force

Cet algorithme consiste a essayer toutes les actions possibles dans tout les états possibles.

### Monte Carlo

L'algorithme Monte Carlo est une méthode utilisée en apprentissage par renforcement pour estimer les valeurs des états ou des actions en utilisant des échantillons de résultats obtenus à partir de l'expérience.
