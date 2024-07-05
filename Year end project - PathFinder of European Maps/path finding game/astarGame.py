import pygame
from queue import PriorityQueue

WIDTH = 800
WIN = pygame.display.set_mode((WIDTH, WIDTH))
pygame.display.set_caption("A* Path Finding Algorithm")

RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 255, 0)
YELLOW = (255, 255, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
PURPLE = (128, 0, 128)
ORANGE = (255, 165 ,0)
GREY = (128, 128, 128)
TURQUOISE = (64, 224, 208)

class Spot:
	def __init__(self, row, col, width, total_rows):
		self.row = row
		self.col = col
		# Définit ça position grâce à sa row et col
		self.x = row * width
		self.y = col * width
		self.color = WHITE
		self.neighbors = []
		self.width = width
		self.total_rows = total_rows

	def get_pos(self):
		return self.row, self.col

	def is_closed(self):
		return self.color == RED

	def is_open(self):
		return self.color == GREEN

	def is_barrier(self):
		return self.color == BLACK

	def is_start(self):
		return self.color == ORANGE

	def is_end(self):
		return self.color == TURQUOISE

	def reset(self):
		self.color = WHITE

	def make_start(self):
		self.color = ORANGE

	def make_closed(self):
		self.color = RED

	def make_open(self):
		self.color = GREEN

	def make_barrier(self):
		self.color = BLACK

	def make_end(self):
		self.color = TURQUOISE

	def make_path(self):
		self.color = PURPLE

	def draw(self, win):
		pygame.draw.rect(win, self.color, (self.x, self.y, self.width, self.width))

	# Will load and define each node 
	def update_neighbors(self, grid):
		self.neighbors = []
		# Check and add the spot below if it's not a barrier
		if self.row < self.total_rows - 1 and not grid[self.row + 1][self.col].is_barrier(): # DOWN
			self.neighbors.append(grid[self.row + 1][self.col])

		# Check and add the spot above  if it's not a barrier
		if self.row > 0 and not grid[self.row - 1][self.col].is_barrier(): # UP
			self.neighbors.append(grid[self.row - 1][self.col])

		# Check and add the spot to the right if it's not a barrier
		if self.col < self.total_rows - 1 and not grid[self.row][self.col + 1].is_barrier(): # RIGHT
			self.neighbors.append(grid[self.row][self.col + 1])

		# Check and add the spot to the left if it's not a barrier
		if self.col > 0 and not grid[self.row][self.col - 1].is_barrier(): # LEFT
			self.neighbors.append(grid[self.row][self.col - 1])

	def __lt__(self, other):
		return False


# Définition de la fonction d'heuristique de distance (distance de Manhattan)
def h(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    return abs(x1 - x2) + abs(y1 - y2)

# Fonction pour reconstruire le chemin optimal trouvé par A*
def reconstruct_path(came_from, current, draw):
    while current in came_from:  # Tant que le nœud courant a un parent dans le dictionnaire came_from
        current = came_from[current]  # Remonter au nœud parent
        current.make_path()  # Marquer le nœud comme faisant partie du chemin optimal
        draw()  # Mettre à jour l'affichage


# Définition de la fonction d'algorithme A*
# Definition : f(score) = g(s) + h(s)
# g : Weight from the start node to 1 current node 
# h : Weight from the end node to 1 current node
def algorithm(draw, grid, start, end):
    count = 0
    open_set = PriorityQueue()  # Création d'une file de priorité pour les nœuds à explorer
    open_set.put((0, count, start))  # Ajout du nœud de départ à la file
    came_from = {}  # Dictionnaire pour enregistrer les relations entre les nœuds
    g_score = {spot: float("inf") for row in grid for spot in row}  # Coûts actuels du chemin depuis le départ
    g_score[start] = 0
    f_score = {spot: float("inf") for row in grid for spot in row}  # Estimations du coût total (g + h)
    f_score[start] = h(start.get_pos(), end.get_pos())  # Estimation initiale

    open_set_hash = {start}  # Ensemble pour vérifier rapidement la présence d'un nœud dans la file
    while not open_set.empty():  # Tant que la file n'est pas vide
        for event in pygame.event.get():  # Gestion des événements pygame (peut-être pour quitter le programme)
            if event.type == pygame.QUIT:
                pygame.quit()

        current = open_set.get()[2]  # Récupération du nœud actuel depuis la file
        open_set_hash.remove(current)  # Retrait du nœud de la file

        if current == end:  # Si le nœud actuel est la destination
            reconstruct_path(came_from, end, draw)  # Reconstruire le chemin trouvé
            end.make_end()  # Marquer le nœud de fin visuellement
            return True  # Renvoyer vrai pour indiquer que le chemin a été trouvé

        for neighbor in current.neighbors:  # Parcours des voisins du nœud actuel
            temp_g_score = g_score[current] + 1  # Coût temporaire du chemin depuis le départ

            if temp_g_score < g_score[neighbor]:  # Si le chemin temporaire est meilleur que le chemin actuel
                came_from[neighbor] = current  # Mettre à jour la relation parent-enfant
                g_score[neighbor] = temp_g_score  # Mettre à jour le coût du chemin
                f_score[neighbor] = temp_g_score + h(neighbor.get_pos(), end.get_pos())  # Mettre à jour l'estimation
                if neighbor not in open_set_hash:  # Si le voisin n'est pas déjà dans la file
                    count += 1  # Incrémenter le compteur
                    open_set.put((f_score[neighbor], count, neighbor))  # Ajouter le voisin à la file
                    open_set_hash.add(neighbor)  # Ajouter le voisin à l'ensemble
                    neighbor.make_open()  # Marquer le voisin comme exploré

        draw()  # Mettre à jour l'affichage

        if current != start:
            current.make_closed()  # Marquer le nœud actuel comme exploré

    return False  # Renvoyer faux si aucun chemin n'a été trouvé


# Retourne le quadrillage de la gille
def make_grid(rows, width):
	grid = []
	# On vient diviser l'espace par X row, ainsi chaque row unitérement se voit alouer 1 espace précisement
	gap = width // rows
	for i in range(rows):
		# Une liste vide qui représente la rangée actuel
		grid.append([])
		# Dans cette row, on vient réitérer 50 fois pour marquer en quelques sortes la colonne, 50 par rangée 
		for j in range(rows):
			# Crée un objt spot qui contient ces coordonées (i,j)
			spot = Spot(i, j, gap, rows)
			# Ajoute un élément à la row courante
			grid[i].append(spot)
	return grid

# Vient dessiner la grille sur pygame
def draw_grid(win, rows, width):
	gap = width // rows
	for i in range(rows):
		pygame.draw.line(win, GREY, (0, i * gap), (width, i * gap))
		for j in range(rows):
			pygame.draw.line(win, GREY, (j * gap, 0), (j * gap, width))


# Constructeur de l'interface pygame
def draw(win, grid, rows, width):
	# Vient remplir de blanc l'espace alloué pour pygame
	win.fill(WHITE)
	count = 0
	# grid renseigne les rows (la size = 50)
	for row in grid:
		# Pour chaque rows on la decoupe en 50 colonne et on initilize chaque case (on lui donne une identité)
		for spot in row:
			spot.draw(win)

	# draw le quadrillage
	draw_grid(win, rows, width)
	# Update la vue à la suite des nombreux click si le state de la case evolue etc...
	# L'evol de ces states est gérer depuis spot.draw qui garde l'identité de chaque draw()
	pygame.display.update()

# Vient chercher la pos grâce à sa pos (ou à eu lieu le click) ainsi que le nombre de rows et de width 
def get_clicked_pos(pos, rows, width):
	# Définit chaque zone dans un plan (ici la width => taille de la fenetre)
	# un gap equivaut à une row 
	gap = width // rows

	# On abstrait x et y à partir du click soit pos
	y, x = pos

	# La row et la colonne d'une case se voit chercher grâce au gap et à x et y 
	# Par rapport à sa size dans la fenêtre et sa pos x et y on vient chercher sa row et sa col
	row = y // gap
	col = x // gap

	return row, col


def main(win, width):
	ROWS = 50
	# Ici on vient définir qu'il y a 50 rows et donc 50 colonne sur une surface donnée width 
	grid = make_grid(ROWS, width)

	start = None
	end = None

	run = True
	while run:
		# Vient dessiner à partir de l'espace définit plus haut dans grid
		draw(win, grid, ROWS, width)
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				run = False

			if pygame.mouse.get_pressed()[0]: # LEFT
				# Prend la position du click 
				pos = pygame.mouse.get_pos()
				# Vient chercher la case en question (row, col)
				row, col = get_clicked_pos(pos, ROWS, width)
				# un spot se voit attribué au click et aussi définit un rôle
				spot = grid[row][col]
				if not start and spot != end:
					start = spot
					start.make_start()

				elif not end and spot != start:
					end = spot
					end.make_end()

				elif spot != end and spot != start:
					spot.make_barrier()

			elif pygame.mouse.get_pressed()[2]: # RIGHT
				pos = pygame.mouse.get_pos()
				row, col = get_clicked_pos(pos, ROWS, width)
				spot = grid[row][col]
				spot.reset()
				if spot == start:
					start = None
				elif spot == end:
					end = None

			if event.type == pygame.KEYDOWN:
				if event.key == pygame.K_SPACE and start and end:
					for row in grid:
						for spot in row:
							spot.update_neighbors(grid)

					algorithm(lambda: draw(win, grid, ROWS, width), grid, start, end)

				if event.key == pygame.K_c:
					start = None
					end = None
					grid = make_grid(ROWS, width)

	pygame.quit()

main(WIN, WIDTH)