<template>
  <div class="selectUser">
    UserList :
    <select id="userTab-select" v-model="selected_role">
      <option
        v-for="user in this.allUsers"
        :key="user"
        :value="user.username"
        @click="getIdUser(user.id)"
      >
        {{ user.username }}
      </option>
    </select>
  </div>
  <div class="arrDep">
    <h2 class="title">Arrival</h2>
    <input
      id="arrival"
      type="datetime-local"
      v-model="arrivalWt"
      placeholder="Arrival"
      required
      autofocus
    />
    <h2 class="title">Departure</h2>
    <input
      id="departure"
      type="datetime-local"
      v-model="departureWt"
      placeholder="Departure"
      required
      autofocus
    />
    <button class="save" @click="addWorkingTime">SAVE</button>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      allUsers: [],
      idUser: null,
      arrivalWt: null,
      status: null,
      departureWt: null,
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
    getIdUser(id) {
      this.idUser = id;
    },
    async addWorkingTime() {
      this.arrivalWt = this.arrivalWt.split("T").join(" ");
      this.departureWt = this.departureWt.split("T").join(" ");
      console.log(this.arrivalWt, this.departureWt);
      const user_id = this.idUser;
      const corps_requete = [
        {
          working_time: {
            start: this.arrivalWt,
            end: this.departureWt,
          },
        },
      ];

      const userClockURL = "api/clocks/" + user_id;
      await axios
        .post(this.url + userClockURL, corps_requete)
        .then(
          (response) => (this.status = response.data.status)
        )
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    this.url = this.$store.state.url;
    this.searchAllUsers();
    const sessionObject = JSON.parse(sessionStorage.getItem("sessionObject"));
    this.user_log = sessionObject.SessionData.user_id;
  },
};
</script>

<style>
.arrDep {
  padding: 5px;
  margin: 0 auto;
  width: 25%;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: f4f4f4;
}

.arrDep .title {
  font-weight: 500;
  margin-bottom: 5px;
}

.arrDep input {
  background: transparent;
  border-bottom: 2px solid #21c3f8;
  border-radius: 0;
  padding: 0px;
}

.arrDep .save {
  border-radius: 25px;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
}
</style>
