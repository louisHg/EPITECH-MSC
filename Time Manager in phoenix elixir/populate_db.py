import requests
import random
from datetime import date, timedelta

API_ADRESS = "http://localhost:4000"
ADMIN_EMAIL = "admin@admin.com"
ADMIN_PASSWORD = "test"


def login_as_admin(email, password):
    complete_url = API_ADRESS + "/auth/login"
    response = requests.get(complete_url + "?email="+ email +"&password=" + password)

    return response.json()["jwt"]

def register_user(user_data):
    complete_url = API_ADRESS + "/auth/register"
    response = requests.post(complete_url, json=user_data)

    return response.json()["id"]

def add_working_time(user_id, working_time, jwt_token):
    complete_url = API_ADRESS + "/api/workingtimes/" + user_id
    response = requests.post(complete_url, json= working_time ,headers={"authorization" : jwt_token})

def create_team(team, jwt_token):
    complete_url = API_ADRESS + "/api/teams/"
    response = requests.post(complete_url, json=team, headers={"authorization" : jwt_token})

    return response.json()["team_data"]["id"]

def add_user_to_team(added_member, jwt_token):
    complete_url = API_ADRESS + "/api/teams/add_user"
    response = requests.post(complete_url, json=added_member, headers={"authorization" : jwt_token})

def update_user_role(user, token_jwt, user_id):
    complete_url = API_ADRESS + "/api/users/" + user_id+"/update-role"
    response = requests.put(complete_url, json = user ,headers={"authorization" : token_jwt})

def setup_users():

    admin_jwt = login_as_admin(ADMIN_EMAIL, ADMIN_PASSWORD)

    managers = [
        {
            "user": {
                "username": "Manager 1",
                "email": "manager1.manager1@manager1.manager1",
                "last_name": "Manager 1",
                "first_name": "Manager 1",
                "password": "Test"
            }
        },{
            "user": {
                "username": "Manager 2",
                "email": "manager2.manager2@manager2.manager2",
                "last_name": "Manager 2",
                "first_name": "Manager 2",
                "password": "Test"
            }
        },{
            "user": {
                "username": "Manager 3",
                "email": "manager3.manager3@manager3.manager3",
                "last_name": "Manager 3",
                "first_name": "Manager 3",
                "password": "Test"
            }
        },{
            "user": {
                "username": "Manager 4",
                "email": "manager4.manager4@manager4.manager4",
                "last_name": "Manager 4",
                "first_name": "Manager 4",
                "password": "Test"
            }
        },{
            "user": {
                "username": "Manager 5",
                "email": "manager5.manager5@manager5.manager5",
                "last_name": "Manager 5",
                "first_name": "Manager 5",
                "password": "Test"
            }
        },
    ]

    teams = [
        {
            "team":{
                "name":"First Team"
            }
        },{
            "team":{
                "name":"Second Team"
            }
        },{
            "team":{
                "name":"Third Team"
            }
        },{
            "team":{
                "name":"Fourth Team"
            }
        },{
            "team":{
                "name":"Fifth Team"
            }
        },
    ]

    employees = [
        {
            "user": {
                "username": "employee1",
                "email": "employee1.employee1@employee1.employee1",
                "last_name": "employee1",
                "first_name": "employee1",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee2",
                "email": "employee2.employee2@employee2.employee2",
                "last_name": "employee2",
                "first_name": "employee2",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee3",
                "email": "employee3.employee3@employee3.employee3",
                "last_name": "employee3",
                "first_name": "employee3",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee4",
                "email": "employee4.employee4@employee4.employee4",
                "last_name": "employee4",
                "first_name": "employee4",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee5",
                "email": "employee5.employee5@employee5.employee5",
                "last_name": "employee5",
                "first_name": "employee5",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee6",
                "email": "employee6.employee6@employee6.employee6",
                "last_name": "employee6",
                "first_name": "employee6",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee7",
                "email": "employee7.employee7@employee7.employee7",
                "last_name": "employee7",
                "first_name": "employee7",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee8",
                "email": "employee8.employee8@employee8.employee8",
                "last_name": "employee8",
                "first_name": "employee8",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee9",
                "email": "employee9.employee9@employee9.employee9",
                "last_name": "employee9",
                "first_name": "employee9",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee10",
                "email": "employee10.employee10@employee10.employee10",
                "last_name": "employee10",
                "first_name": "employee10",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee11",
                "email": "employee11.employee11@employee11.employee11",
                "last_name": "employee11",
                "first_name": "employee11",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee12",
                "email": "employee12.employee12@employee12.employee12",
                "last_name": "employee12",
                "first_name": "employee12",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee13",
                "email": "employee13.employee13@employee13.employee13",
                "last_name": "employee13",
                "first_name": "employee13",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee14",
                "email": "employee14.employee14@employee14.employee14",
                "last_name": "employee14",
                "first_name": "employee14",
                "password": "Test"
            }
        },{
            "user": {
                "username": "employee15",
                "email": "employee15.employee15@employee15.employee15",
                "last_name": "employee15",
                "first_name": "employee15",
                "password": "Test"
            }
        }
    ]

    managers_id = []
    teams_id = []
    employees_id = []

    for team in teams:
        team_id = create_team(team, admin_jwt)
        teams_id.append(team_id)

    for manager, team_id in zip(managers, teams_id):
        manager_id = register_user(manager)
        managers_id.append(manager_id)
        update_user_role({"role":"Manager"}, admin_jwt, manager_id)
        team_member = {
            "user_id":manager_id,
            "team_id": team_id
        }
        add_user_to_team(team_member, admin_jwt)

    team_index = 0
    team_member_count = 0

    for employee in employees:
        employee_id = register_user(employee)
        employees_id.append(employee_id)
        team_member = {
            "user_id": employee_id,
            "team_id": teams_id[team_index]
        }
        add_user_to_team(team_member, admin_jwt)
        team_member_count += 1

        if team_member_count == 4:
            team_index += 1
            team_member_count = 0
    
    all_user_id = employees_id + managers_id

    for user_id in all_user_id:

        arrival_month = random.randint(1, 12)
        arrival_day = random.randint(1, 27)
        work_days = random.randint(1, 7)

        arrival_date = date(2022, arrival_month, arrival_day)
        today = date.today()

        delta = (today - arrival_date).days
        current_day = arrival_date

        user_working_time = []

        for day in range(delta):
            if random.randint(1,7) < work_days:
                iso_day = current_day.strftime("%Y-%m-%d")
                user_working_time.append({
                    "working_time":{
                        "start": iso_day + " 09:30:00",
                        "end": iso_day+" 17:30:00"
                    }
                })
            current_day += timedelta(days=1)
        
        for working_day in user_working_time:
            add_working_time(user_id, working_day, admin_jwt)

    
if __name__ == "__main__":
    setup_users()
