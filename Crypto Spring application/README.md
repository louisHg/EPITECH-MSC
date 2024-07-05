# Nécessite Gradle 7.3.1 et java 17 pour fonctionner.
## Dans un terminal divisé :
### Sur le premier terminal
#### `cd dashboard`
#### `npm install`
#### `npm start`
### Sur le 2ème terminal
#### `gradle bootrun`

### Fonctionnement de l’api
#### /api/all?user=username 
Récupère les features liées à l’utilisateur en question ainsi que récupère les informations des différentes apis avec les paramètres qu’il a indiqué a la création de son compte.

#### /api/login?user=username&password=password
 Vérifie si les identifiants correspondent à ceux d’un utilisateur dans la base de données. S’il y a un match, récupère les features et les renvoie avec un success : true, sinon renvoie sucess : false
 
#### /api/singleCoin?coin=uuid
Récupère les informations liées à l’id du coin précisé dans l’url 

#### /api/allcoins
Renvoi les informations générales des dernières 24 des 50 plus grandes crypto-monnaies

#### /api/meteo?ville=ville
Récupère les informations liées à la ville.

#### /api/new_user
Récupère une requete POST contenant un un objet JSON qui est alors ajouter à la base donnée utilisateur.

#### /api/reddit ?subreddit=subreddit
Récupère les 25 résultats en haut de la frontpage du reddit précisé dans l’url

#### Ajout de ville pour API Weather :
 <Link to="/weathers/nomDeLaVille" className="link"> permet d'appeler une nouvelle ville de l'API vers le front dans la section Weathers
 
### Cryptocurrentcies:
 #### Crypto_chart service:
 Give informations about the 9 highest marketcap cryptocurrencies and the chosen one such as total marketcap, current price, it's 24h evolution and rank
 
 #### Crypto_graph service:
 Shows a graph with the yearly evolution of the selected cryptocurrency.
 Need a coin uuid (as a string) from coinranking to work.
 
 ### Meteo:
 Give current temperature, humidity and windspeed of the selected town.
Need an existing city (as a string) to work.
 
 ### Reddit:
 #### Reddit_thread:
 Give the 20 first post from the frontpage of the chosen subreddit.
 Need an existing subreddit (as a string) to work.
 
 #### Reddit_sub_data:
 Give the banner / current user / total subscribers of the chosen subreddit.
 Need an existing subreddit (as a string) to work.
 
 ### Youtube:
 #### Youtube_channel:
 Give the 20 last videos of the chosen channel
 Need a channel url to work (with this type of url as a string :"https://www.youtube.com/channel/[channel_id]).
 
##### Youtube_search:
 Give the 20 first result from a youtube query.
 Need a query (as a string) to work.
