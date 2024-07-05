# ApiTimeManager

First time launching the app ?

  * Make sure [`docker`](https://docs.docker.com/engine/install/) && [`docker-compose`](https://docs.docker.com/compose/install/) packages are installed
  * Build with `docker-compose build`

Launch App with docker

  * `docker-compose up` to start
  * Now you can visit [`localhost:8080`](http://localhost:8080) from your browser.
  * Api runs at [`localhost:4000`](http://localhost:4000).
  * `docker-compose down` once you are done
 
Populate database : use `python3 populate_db.py`

API Endpoints:
Only the login and register endpoints are usable without using a JWT Token, the others require an authorization token in the header, otherwise the request will be rejected.

This project contains a script that tests all the endpoints and return the logs inside "./test_results" folder.
It can be started by using the following command in a terminal:

`python3 endpoint_testing.py`

**Authentification endpoints:**

POST /auth/register:

Register the user and create his clock automatically
The body must be a json following this format:
```yaml
{
   "user": {
        "username": "Your Username",
        "email": "user@user.user",
        "last_name": "Your last name",
        "first_name": "Your first name",
        "password": "password"
   }
}
```

The API returns the user information with his id and his automatically attributed "Employee" role

GET /auth/login?email=email&password=password
Login as the user which correspond to the email and password combinaison
The email and password are passed as email=email_address&password=your_password
This endpoint returns the user data and a JWT token linked to the user.


**Users endpoints:**

GET /api/users/:user_id

Return the user data corresponding to the given ID.

GET /api/users?email=email&username=username

Return the user data corresponding to the email and username combinaison

PUT /api/users/:user_id

Update the user corresponding to the given ID with the field given in the json body
```yaml
{
   "user": {
        "username": "Your Username",
        "email": "user@user.user",
        "last_name": "Your last name",
        "first_name": "Your first name",
   }
}
```

DELETE /api/users/:user_id

Delete the user corresponding to the given ID


**Working time endpoints:**

GET /api/workingtimes/:user_id?start=&end=

Returns all working times of the corresponding user in the date range in the parameters
If there is neither start nor end, it will returns everything
If only a start parameter, everything after that date, and if only a end parameter, everything before that date.

The date format must be : "YYYY-MM-DD hh:mm:ss"

GET /api/workingtimes/:user_id/:id

Returns a specific working time corresponding to the user_id and id given.

POST /api/workingtimes/:user_id

Add a working time to the given user
The json body must respect this format:
```yaml
{
    "working_time":{
        "start":"2022-11-04 09:45:00",
        "end":"2022-11-04 17:30:00"
    }
}
```

It returns that working time data.

PUT /api/workingtimes/:id

Update the working time corresponding to the given id
The json body must respect this format:
```yaml
{
    "working_time":{
        "start":"2022-11-04 09:45:00",
        "end":"2022-11-04 17:30:00"
    }
}
```

It returns the updated working time.

DELETE /api/workingtimes/:id

Delete the working time corresponding to the given id

**Clock endpoints:**

GET /api/clocks/:user_id

Return the clock of the given user.

POST /api/clocks/:user_id

Invert the clock status of the given user.

**Admin endpoints:**

GET /api/users/all

Returns the list of all users and their data.

PUT /api/users/:user_id/update-role

Update the role of the user corresponding to the id given.
The role can be either "Employee" or "Manager"
The json body must respect this format:
```yaml
{
    "role": "Manager"
}
```

Returns the updated user data.

**Teams endpoints:**

GET /api/teams/all

Returns all teams

GET /api/teams/:team_id

Returns a team and its team members corresponding to the given team_id.

POST /api/teams

Create a team with the given name.
The json body must respect this format:
```yaml
{
    "team":{
        "name":"Trop poggers la première team"
    }
}
```
Returns the team data.

POST /api/teams/add_user

Add an existing user to an existing team
The json body must respect this format:
```yaml
{
    "user_id":"user_id",
    "team_id":"team_id"
}
```

DELETE /api/teams/remove_user

Remove an user of a team
The json body must respect this format:
```yaml
{
    "user_id":"user_id",
    "team_id":"team_id"
}
```

DELETE /api/teams/:team_id

Delete the team correspondong to the given id.


**Stats endpoints:**

GET /api/stats/user/:user_id?startDate=&endDate=

Returns the presence data of the corresponding user between the date range.
That data contains the average time worked by day in seconds, the total worked and a list of working time inside that date range.

GET /api/stats/team/:team_id?startDate=&endDate=

Returns the presence data of the corresponding team between the date range.
That data contains the average time worked by day in seconds, the total worked and a list of working time inside that date range.

