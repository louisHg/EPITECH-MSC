<template>
  <div class="popup" v-if="reveleEdit">
    <div class="popup-inner">
      <h2>Edit panel</h2>
      <button class="popup-btn2" @click="getCurrentData()">Current Data</button>
      <div class="editForm">
        <p> Firstname : </p>
        <input
          id="firstnameEdit"
          v-model="name"
          type="text"
          placeholder="Firstname"
          required
          autofocus
        />
        <p> Lastname : </p>
        <input
          id="lastnameEdit"
          v-model="first_name"
          type="text"
          placeholder="Lastname"
          required
          autofocus
        />
        <p> Username : </p>
        <input
          id="lastnameEdit"
          v-model="username"
          type="text"
          placeholder="Username"
          required
          autofocus
        />
        <p> Email : </p>
        <input
          id="mailEdit"
          v-model="email"
          type="text"
          placeholder="Email"
          required
          autofocus
        />
        <p> Role : </p>
        <input
          id="pwdEdit"
          v-model="role"
          type="text"
          placeholder="Role"
          required
          autofocus
        />
      </div>

      <div class="delbtn">
        <button class="popup-btn" @click="toggleModaleEdit(), close()">LEAVE</button>
        <button class="popup-btn" @click="toggleModaleEdit(), modifyUser()">SAVE</button>
      </div>
    </div>
  </div>
</template>

<script>
const axios =  require("axios");
export default {
  data() {
    return {
      url: null,

      name: "",
      first_name: "",
      username: "",
      email: "",
      role: "",
    };
  },
  props: ["reveleEdit", "toggleModaleEdit"],
  methods: {
    async close(){
      sessionStorage.removeItem("user_info");
      document.location.reload();
    },
    async getCurrentData(){
      const sessionUser = JSON.parse(sessionStorage.getItem("user_info"));
      if(sessionUser != null){
        const user= sessionUser.SessionData;
        this.name = user.last_name;
        this.username = user.username;
        this.first_name = user.first_name;
        this.email = user.email,
        this.role = user.role
      }
    },
    async modifyUserRole(role, user_id) {
      if(role != null) {
        const updateUserRole_url = "api/users/" + user_id + "/update-role";
        const modifyUser = {
          "role": role
        }
        await axios
          .put(this.url + updateUserRole_url, modifyUser)
          .then(
            (response) => (
              console.log(response.data)
            )
          )
      }
    },
    async modifyUser() {
      const sessionUser = JSON.parse(sessionStorage.getItem("user_info"));
      const user_id = sessionUser.SessionData.id;
      if (
        this.name.length > 0 ||
        this.first_name.length > 0 ||
        this.username.length > 0 ||
        this.email.length > 0 ||
        this.role.length > 0
      ) {
        const updateUser_url = "api/users/" + user_id;
        const modifyUser = {
          user: {
            username: this.name + "." + this.first_name,
            email: this.email,
            last_name: this.name,
            first_name: this.first_name,
            role: this.role,
          },
        };
        await axios
          .put(this.url + updateUser_url, modifyUser)
          .then(
            (response) => (
              this.modifyUserRole(this.role, user_id),
              alert(
                "The data of " +
                  response.data.first_name +
                  response.data.last_name +
                  " has been succesfully modified ✅"
              ),
              this.close()
            )
          )
          .catch((error) => console.log(error));
      } else {
        this.password = "";
        this.password_confirmation = "";
        return alert("Passwords do not match");
      }
    },
  },
  mounted() {
    this.url = this.$store.state.url;
  }
};
</script>

<style scoped>
/*POPUP*/
.popup {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
}

.popup .popup-inner {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25), 10px 0 20px rgba(0, 0, 0, 0.25);
}

.delbtn {
  display: flex;
}
.popup .popup-inner .popup-btn {
  border-radius: 25px;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
  width: 30%;
}
.popup .popup-inner .popup-btn2 {
  border-radius: 25px;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
  width: 100%;
}
</style>
