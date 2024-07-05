import requests
import json
import os

API_ADRESS = "http://localhost:4000"


def save_result(result):
    string = "NAME: " + result["name"] + "\n\n"
    string += "URL = " + result["url"] + "\n"

    if "success" in result:
        string += "Result = SUCCESS\n"
    else:
        string += "Result = FAILED\nStatus Code = " + \
            str(result["status_code"]) + "\n"

    formated_result = json.dumps(result, indent=4, sort_keys=True)

    string += "Response Details = \n" + formated_result

    with open("./test_results/individual_results/"+result["name"]+".txt", "w") as f:
        f.write(string)

def clean_folder():
    test_files = os.listdir("./test_results/individual_results/")
    for file in test_files:
        os.remove("./test_results/individual_results/" + file)
    try:
        os.remove("./test_results/final_results.txt")
    except:
        pass

def format_result(test_name, complete_url,response):
    result = {}

    result["name"] = test_name
    result["url"] = complete_url
    result["status_code"] = response.status_code
    result["details"] = response.json()

    if response.status_code != 200:
        result["error"] = response.status_code
        result["success"] = False
    else:
        result["success"] = True

    save_result(result)

    if result["success"]:
        print(test_name + " = SUCCESSFUL")
    else:
        print(test_name + " = FAILED")

    return result


def register_endpoint(test_name, user_data):
    complete_url = API_ADRESS + "/auth/register"
    response = requests.post(complete_url, json=user_data)

    return format_result(test_name, complete_url, response)

def login_endpoint(test_name, user_data):
    complete_url = API_ADRESS + "/auth/login"
    response = requests.get(complete_url + "?email=" +
                            user_data["email"] + "&password=" + user_data["password"])

    return format_result(test_name, complete_url, response)

def get_user_by_id(test_name, user_id, token_jwt):
    complete_url = API_ADRESS + "/api/users/" + user_id
    response = requests.get(complete_url, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def get_user_by_params(test_name, user, token_jwt):
    complete_url = API_ADRESS + "/api/users?email="+user["email"]+"&username=" + user["username"]
    response = requests.get(complete_url, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def update_user(test_name, user, token_jwt, user_id):
    complete_url = API_ADRESS + "/api/users/" + user_id
    response = requests.put(complete_url, json=user, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def update_user_role(test_name, user, token_jwt, user_id):
    complete_url = API_ADRESS + "/api/users/" + user_id+"/update-role"
    response = requests.put(complete_url, json = user ,headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def delete_user(test_name, user_id, token_jwt):
    complete_url = API_ADRESS + "/api/users/" + user_id
    response = requests.delete(complete_url, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def get_all_user_working_time(test_name, user_id, start_date, end_date, token_jwt):
    complete_url = API_ADRESS + "/api/workingtimes/" + user_id + "?start=" + start_date + "&end=" + end_date
    response = requests.get(complete_url, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def get_working_time_by_id(test_name, user_id, working_time_id, token_jwt):
    complete_url = API_ADRESS + "/api/workingtimes/" + user_id + "/" + working_time_id
    response = requests.get(complete_url, headers={"authorization" : token_jwt})

    return format_result(test_name, complete_url, response)

def add_working_time(test_name, user_id, working_time, jwt_token):
    complete_url = API_ADRESS + "/api/workingtimes/" + user_id
    response = requests.post(complete_url, json= working_time ,headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def update_working_time(test_name, working_time_id, working_time, jwt_token):
    complete_url = API_ADRESS + "/api/workingtimes/" + working_time_id
    response = requests.put(complete_url, json= working_time ,headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def delete_working_time(test_name, working_time_id,  jwt_token):
    complete_url = API_ADRESS + "/api/workingtimes/" + working_time_id
    response = requests.delete(complete_url,headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def get_user_clock(test_name, user_id, jwt_token):
    complete_url = API_ADRESS + "/api/clocks/" + user_id
    response = requests.get(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def update_user_clock(test_name, user_id, jwt_token):
    complete_url = API_ADRESS + "/api/clocks/" + user_id
    response = requests.post(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def get_all_users(test_name, jwt_token):
    complete_url = API_ADRESS + "/api/users/all"
    response = requests.get(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def create_team(test_name, team, jwt_token):
    complete_url = API_ADRESS + "/api/teams/"
    response = requests.post(complete_url, json=team, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def add_user_to_team(test_name, added_member, jwt_token):
    complete_url = API_ADRESS + "/api/teams/add_user"
    response = requests.post(complete_url, json=added_member, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def remove_user_from_team(test_name, removed_member, jwt_token):
    complete_url = API_ADRESS + "/api/teams/remove_user"
    response = requests.delete(complete_url, json=removed_member, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def delete_team(test_name, team_id, jwt_token):
    complete_url = API_ADRESS + "/api/teams/" + team_id
    response = requests.delete(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def get_user_presence(test_name, user_id, start_date, end_date, jwt_token):
    complete_url = API_ADRESS + "/api/stats/user/" + user_id + "?startDate=" + start_date + "&endDate=" + end_date
    response = requests.get(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def get_team_presence(test_name, team_id, start_date, end_date, jwt_token):
    complete_url = API_ADRESS + "/api/stats/team/" + team_id + "?startDate=" + start_date + "&endDate=" + end_date
    response = requests.get(complete_url, headers={"authorization" : jwt_token})

    return format_result(test_name, complete_url, response)

def run_tests():

    clean_folder()

    print("Starting Testing Endpoints:\n")

    admin_user = {
        "email": "maxence.marqui@gmail.com",
        "password": "Test"
    }

    first_user = {
        "user": {
            "username": "Testing User",
            "email": "tester.tester@tester.tester",
            "last_name": "Testing User",
            "first_name": "Testing User",
            "password": "Test"
        }
    }

    team_member_1 = {
        "user": {
            "username": "Team Member 1",
            "email": "tm1.tester@tester.tester",
            "last_name": "Team Member 1",
            "first_name": "Team Member 1",
            "password": "Test"
        }
    }

    team_member_2 = {
        "user": {
            "username": "Team Member 2",
            "email": "tm2.tester@tester.tester",
            "last_name": "Team Member 2",
            "first_name": "Team Member 2",
            "password": "Test"
        }
    }

    team_member_3 = {
        "user": {
            "username": "Team Member 3",
            "email": "tm3.tester@tester.tester",
            "last_name": "Team Member 3",
            "first_name": "Team Member 3",
            "password": "Test"
        }
    }

    results_list = []

    result = register_endpoint("successful_user", first_user)
    results_list.append(result)
    user_id = result["details"]["id"]

    result = register_endpoint("team_member_1", team_member_1)
    team_member_id_1 = result["details"]["id"]
    result = register_endpoint("team_member_2", team_member_2)   
    team_member_id_2 = result["details"]["id"]
    result = register_endpoint("team_member_3", team_member_3)  
    team_member_id_3 = result["details"]["id"] 

    result = login_endpoint("login", admin_user)
    results_list.append(result)
    admin_id, admin_jwt = result["details"]["user"]["id"], result["details"]["jwt"]

    result = get_user_by_id("get_user_by_id",admin_id, admin_jwt)
    results_list.append(result)

    result = get_user_by_params("get_user_by_params", first_user["user"], admin_jwt)
    results_list.append(result)

    modified_first_user = {
        "user":{
            "username": "Modified User",
            "email": "modified.tester@tester.tester",
            "last_name": "Modified User",
            "first_name": "Modified User", 
        }
    }

    new_role = {
        "role": "Manager"
    }

    result = update_user("update_user", modified_first_user, admin_jwt, user_id)
    results_list.append(result)

    result = update_user_role("update_user_role", new_role, admin_jwt, user_id)
    results_list.append(result)

    working_times_1 = {
        "working_time":{
            "start":"2022-11-04 09:45:00",
            "end":"2022-11-04 17:30:00"
        }
    }

    working_times_2 = {
        "working_time":{
            "start":"2022-11-05 09:00:00",
            "end":"2022-11-05 12:30:00"
        }
    }

    working_times_3 = {
        "working_time":{
            "start":"2022-11-06 09:30:00",
            "end":"2022-11-06 17:30:00"
        }
    }

    working_times_4 = {
        "working_time":{
            "start":"2020-11-06 09:30:00",
            "end":"2020-11-06 17:30:00"
        }
    }

    result = add_working_time("add working_time 1", user_id, working_times_1, admin_jwt)
    results_list.append(result)

    result = add_working_time("add working_time 2", user_id, working_times_2, admin_jwt)
    result = add_working_time("add working_time 3", user_id, working_times_3, admin_jwt)
    working_time_id_1 = result["details"]["id"]
    result = add_working_time("add working_time 4", user_id, working_times_4, admin_jwt)
    working_time_id_2 = result["details"]["id"]

    result = get_all_user_working_time("get_all_user_working_time", user_id, "2022-07-01 09:00:00", "2022-11-10 17:30:00", admin_jwt)
    results_list.append(result)

    updated_working_time = {
        "working_time": {
            "end": "2022-11-25T17:30:00",
            "start": "2022-10-25T09:00:00"
        }
    }

    result = update_working_time("update_working_time", working_time_id_1, updated_working_time, admin_jwt)
    results_list.append(result)

    result = delete_working_time("delete_working_time", working_time_id_2, admin_jwt)
    results_list.append(result)

    result = get_user_clock("get_user_clock", user_id, admin_jwt)
    results_list.append(result)

    result = update_user_clock("clock_in", user_id, admin_jwt)
    results_list.append(result)

    result = update_user_clock("clock_out", user_id, admin_jwt)
    results_list.append(result)

    result = get_all_users("get_all_users", admin_jwt)
    results_list.append(result)

    team = {
        "team":{
            "name":"Trop poggers la première team"
        }
    }
    result = create_team("create_team", team, admin_jwt)
    results_list.append(result)

    team_id = result["details"]["team_data"]["id"]

    manager_to_send = {
        "user_id" : user_id,
        "team_id" : team_id
    }
    team_member_to_send_1 = {
        "user_id" : team_member_id_1,
        "team_id" : team_id
    }
    team_member_to_send_2 = {
        "user_id" : team_member_id_1,
        "team_id" : team_id
    }
    team_member_to_send_3 = {
        "user_id" : team_member_id_1,
        "team_id" : team_id
    }

    result = add_user_to_team("add_manager_to_team",manager_to_send, admin_jwt)
    results_list.append(result)

    result = add_user_to_team("add_team_member_1",team_member_to_send_1, admin_jwt)
    result = add_user_to_team("add_team_member_2",team_member_to_send_2, admin_jwt)
    result = add_user_to_team("add_team_member_3",team_member_to_send_3, admin_jwt)

    result = remove_user_from_team("remove_team_member_1", team_member_to_send_3, admin_jwt)
    results_list.append(result)

    result = get_user_presence("get_user_presence", user_id, "2022-07-01 09:00:00", "2022-11-10 17:30:00", admin_jwt)
    results_list.append(result)

    result = get_team_presence("get_team_presence", team_id, "2022-07-01 09:00:00", "2022-11-10 17:30:00", admin_jwt)
    results_list.append(result)

    result = delete_team("delete_team", team_id, admin_jwt)
    results_list.append(result)

    result = delete_user("delete_user", user_id, admin_jwt)
    results_list.append(result)

    result = delete_user("delete_user", team_member_id_1, admin_jwt)
    result = delete_user("delete_user", team_member_id_2, admin_jwt)
    result = delete_user("delete_user", team_member_id_3, admin_jwt)

    result_string = ""
    success_counter = 0

    for single_result in results_list:
        if single_result["success"]:
            success_counter += 1
            result_string += single_result["name"] + " = SUCCESSFUL\n"
        else:
            result_string += single_result["name"] + " = FAILED\n"

    synthesis_string = "\nNumber of tests = " + str(len(results_list)) + "\nNumber of success = " + str(
        success_counter) + "\nNumber of fails = " + str(len(results_list) - success_counter)

    print(synthesis_string)

    final_string = "Results of the tests: \n\n" + result_string + synthesis_string

    with open("./test_results/final_results.txt", "w") as f:
        f.write(final_string)


if __name__ == "__main__":
    run_tests()
