<template>
    <div class="popup" v-if="reveleDelete">
      <div class="popup-inner">
        <p>Are you sure you want to delete this user?</p>
        <div class="delbtn">
          <button class="popup-btn" @click="toggleModale(), close()">No</button>
          <button class="popup-btn" @click="toggleModale(), deleteUser()">Yes</button>
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
    };
  },
  props: ['reveleDelete', 'toggleModale'],
  methods: {
    async close(){
      sessionStorage.removeItem("user_info");
      document.location.reload();
    },
    async deleteUser(){
      const sessionUser = JSON.parse(sessionStorage.getItem("user_info"));
      if(sessionUser != null){
        const user_id = sessionUser.SessionData.id;
        const userDeleteURL = "api/users/" + user_id;
        axios
          .delete(this.url + userDeleteURL)
          .then(response => (
              alert(response.data)                
          ))
          .catch(error => console.log(error))
      }
      this.close();
    }
  },
  mounted() {
    this.url = this.$store.state.url;
  }
}
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
</style>
