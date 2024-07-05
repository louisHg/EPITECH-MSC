Première version du Read me

*** Ce Readme sert de test de modifications pour l'ajout du repo à gitlab 

Explication de ce qu'il y a dans la DB:

Nodes: Toutes les nodes, correspondent a 250m², avec leur position sur la map représentée par x_pos et y_pos, leur élévation et leur zone_id

Chunk_64: Avant il y a avait différentes tailles de chunk, mais en réalité c'était inutile donc j'ai juste gardé la taille la plus grande. Dedans il y a les données mathématiques qui peuvent être utiles sur elle, avec la position du chunk. Pour savoir la range des nodes, c'est simple, tu prend x_pos x 64 and y_pos x 64 et (x_pos x 64) + 64 et (y_pos x 64) + 64

Regions: Ce sont les zone_id qui correspondent a la même zone mais qui ont étaient séparés car étant sur des fichiers différents

Globalement ici il y a la création du docker compose + les scripts pour remplir la DB et faire les images
Vu que les images sont dans un fichier zip (que je mettrais plus bas), j'ai mis en commentaire les parties du code qui les crées
Sur mon PC, ça prend environ 20 minutes a remplir la DB des nodes et régions, je suppose que ça change en fonction des perfs du PC, mais ça devrait rester tolérable, go aller chercher un café ou un truc du genre en attendant.

Vous pouvez remettre la création d'images si vous voulez, mais il faudra créer les dossiers qui vont les recueillir, et en vrai c'est pas très utile vu qu'elles sont déjà générées, a vous de voir si vous avez besoin d'autes copies ou non, bon après s'il y a pas ce que vous voulez dessus, vous pouvez modifier pour les refaire, sachant que ça prend environ 7 ou 8 heures pour tout avoir.
De plus le docker a tendance a crash/corrompres certaines images si elles sont trop lourdes, du coup limite je conseille plus de lancer le script sur le PC host pour cette partie, ça prend quand même du temps mais ça crash moins, et dans ce cas faut juste garder le docker pour postgres +  adminer

Du coup le preprocessing + enregistrement, il ressemble a quoi ?

Dans le dossier back-end/maps, il y a des fichiers .tiff, en gros ce sont des fichiers remplies d'array en 2 dimensions, avec plusieurs couches de data a l'intérieur. Dans ceux là, il y a qu'une seule couche donc il y a juste a la prendre.

Avoir l'intégralité de la map chargée prendrais énormément de mémoire, en plus de créer des problèmes de scaling si on augmente la taille de la map, du coup on prend partie par partie et on fera un traitement après coup pour relier tout ça.

Dans un premier temps on check si la DB est déjà remplie, et si oui, par quoi.
Ce qui est déjà présent sera skip, le reste sera créer et mis dans la liste des taches a effectuer.
Si rien a faire, on skip tout et on lancera l'API (Quand elle sera présente)

Dans un second temps on commence l'itération sur les maps dans l'array de cartes.
En gardant en tête que ce n'est qu'une partie de la map, on calcule un offset de hauteur et largeur + les bords qu'il faudra rechecker a la fin de l'enregistrement des parties de la carte.
On transforme d'abord la map en chunk de 8x8, dont on enregistre les données mathématiques et la position, avant de remettre la map dans sa forme initiale.
En ce qui concerne l'enregistrement de nodes, on créer en premier lieu un masque binaire des valeurs d'array égales a 0, ensuite avec skimage on récupère une liste d'array avec les nodes connectées les unes aux autres par régions. On fait des batches de 500k par 500k pour limiter le nombre de requetes a postgres. Pour cela on transforme les informations en buffer de pseudo fichier CSV, Postgres étant beaucoup beaucoup plus rapide pour les traiter avec une utilisation de mémoire minimale.

Dans un 3ème temps, étant donné que certaines zones sont enregistrées comme différentes bien que dans la réalité elles correspondent au même endroit, on enregistre ces zones en DB en se basant sur les extrếmités qu'on a garder auparavant.
Un index est créer sur les position x et y des nodes pour gagner du temps lors des requetes SELECT

On créer ensuite les images correspondant aux chunks enregistrés + les informations qui vont avec
Et ensuite on enregistre les images en 2d + les reliefs dans différentes tailles.
Pour finir on itère sur les fichiers afin de voir s'il y en a des corrompus, si c'est le cas ils sont alors supprimés.

En bonus on affiche le temps qui a été pris pour l'execution du script.



Pour info, il y a les restes du taff que j'avais fait avant les 3 reworks du preprocessing dans db_helper.py
Y a très très peu de chance que ça soit utilisable tel quel, mais avec l'adaptation du nouveau système y a moyen de le reprendre pour qu'il fonctionne mieux qu'avant. 
