<template>
    <div class="arrDep" v-if="status == false">
        <h2 class="title">Click to start the day &#9728;&#65039;</h2>
        <p>You left on : {{currentUserClock_clock}}</p>
        <div class="btn-wt">
            <button v-on:click="startStopClock()" class="save">ARRIVAL</button>
        </div>
    </div>
    <div class="arrDep" v-else>
        <h2 class="title">Click to end the day &#127771;</h2>
        <p>You arrived on : {{currentUserClock_clock}}</p>
        <div class="btn-wt">
            <button v-on:click="startStopClock()" class="save_leftWork">DEPARTURE</button>
        </div>
    </div>
</template>

<script>
const axios =  require("axios");
export default {
	data() {
		return {
			url: null,
            status: false,
            currentUserClock_clock: null,
		};
	},
    methods: {
        async currentUserClock() {			
            const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
            const user_id = sessionObject.SessionData.user_id;
            const userClockURL = "api/clocks/" + user_id;
            await axios
                .get(this.url + userClockURL)
                .then(response => (
                    this.status = response.data.status,
                    this.currentUserClock_clock = (response.data.time.split('T')).join(' at ')
                ))
                .catch(error => console.log(error))
		},
        async startStopClock() {
            const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
            const user_id = sessionObject.SessionData.user_id;
            const userClockURL = "api/clocks/" + user_id;
            await axios
                .post(this.url + userClockURL)
                .then(response => (
                    this.status = response.data.status,
                    this.currentUserClock_clock = (response.data.time.split('T')).join(' at '),
                    document.location.reload()
                ))
                .catch(error => console.log(error))
		},
    },
	mounted() {
		this.url = this.$store.state.url;
        this.currentUserClock();
	}
}
</script>

<style>
.arrDep {
  padding: 20px;
  margin: 0 auto;
  width: 25%;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 5%;
}

.arrDep .title {
  font-weight: 500;
  margin-bottom: 5px;
  text-align: center;
}

.arrDep .btn-wt {
  display: flex;
}

.arrDep .save {
  border-radius: 25px;
  width: 40%;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
}

.arrDep .save_leftWork {
    border-radius: 25px;
    width: 40%;
    background: linear-gradient(269.24deg, #1d667e, #052a35);
    box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
    font-weight: 500;
    text-align: center;
}

@media screen and (max-width: 768px) {
    .arrDep .save, .arrDep .save_leftWork {
        width: 200px;
    }
}
</style>
