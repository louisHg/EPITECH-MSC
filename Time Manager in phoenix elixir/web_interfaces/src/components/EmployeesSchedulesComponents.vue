<template>
  <h2>Employees Schedules</h2>
  <div class="selectUser">
    <p> Firstname : </p>
    <input
      id="create team"
      v-model="team_name"
      type="text"
      placeholder="enter team name"
      required
      autofocus
    />
    <button v-on:click="create_team()">Create</button>
    UserList :
    <select id="userTab-select" v-model="selected_role">
      <option
        v-for="user in this.allUsers"
        :key="user"
        :value="user.username"
        @click="add_to_team(user.id)"
      >
        {{ user.username }}
      </option>
    </select>
  </div>
  <p>Click to add this user to the team</p>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      allUsers: [],
      idUser: null,
      team_name: null,
      id_team: null
    };
  },
  methods: {
    async searchAllUsers() {
      const searchAllUsersURL = "api/users/all";
      await axios
        .get(this.url + searchAllUsersURL)
        .then((response) => (this.allUsers = response.data))
        .catch((error) => console.log(error));
    },
    create_team(){
      const obj = {
        "team":{
          "name" : this.team_name
        }
      }
      const create_teamURL = "api/teams"
      axios
        .post(this.url + create_teamURL, obj)
        .then((response) => 
          alert("team " + response.data.team_data.name + " create succesfully",
          this.id_team = response.data.team_data.id
        ))
        .catch((error) => console.log(error));
    },
    add_to_team(id){
      const obj = {
        "user_id": id,
        "team_id": this.id_team
      }
      const create_teamURL = "api/teams/add_user"
      axios
        .post(this.url + create_teamURL, obj)
        .then((response) => 
          alert("added succesfully",
          console.log(response.data)
        ))
        .catch((error) => console.log(error));
    }
  },
  mounted() {
    this.url = this.$store.state.url;
    this.searchAllUsers();
  },
};
</script>

<style>
</style>

