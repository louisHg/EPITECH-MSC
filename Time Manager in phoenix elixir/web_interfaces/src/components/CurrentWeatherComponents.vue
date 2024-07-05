<template>
  <div class="search_weather">
    <h1>Où</h1>
    
      <div class="search_bar">
        <input type="text" placeholder="Search.." id="myInput" v-on:keyup="filterFunction()" v-on:click="show()" v-on:blur="hide()" autocomplete="off">
        <div id="myDropdown" class="dropdown-content" v-if="this.open == true">
          <a class="city" id="city" v-for="variant in variants" :key="variant.message" @mousedown="()=>callWaether(variant.id)">
            {{variant.ville}}
          </a>
        </div>
      </div>

  </div>
  
  <div class="meteo">
    <h1>Météo actuelle à {{ variant_tmp.ville }}</h1>
    <p>Température : {{ variant_tmp.temperature }}</p>
    <p>Date : {{ variant_tmp.date }}</p>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';
const moment = require("moment");
const axios =  require("axios");
export default {
  data() {
    return {
      variants: [
        {
          id: 0,
          ville: "Lyon",
          lat : "45.750000",
          lon : "4.850000",
          date: moment(Date.now()).format("DD MMMM YYYY"),
        },
        {
          id: 1,
          ville: "Nice",
          lat : "43.700000",
          lon : "7.250000",
          date: moment(Date.now()).format("DD MMMM YYYY"),
        },
        {
          id: 2,
          ville: "Amiens",
          lat : "49.900000",
          lon : "2.300000",
          date: moment(Date.now()).format("DD MMMM YYYY"),
        },
        {
          id: 3,
          ville: "Lille",
          lat: "50.633333",
          lon: "3.066667",
          date: moment(Date.now()).format("DD MMMM YYYY"),
        },
        {
          id: 4,
          ville: "Paris",
          lat : "48.866667",
          lon : "2.333333",
          date: moment(Date.now()).format("DD MMMM YYYY"),
        },
      ],
      variant_tmp: [],
      open: false,
    };
  },
  mounted() {
    const route = useRoute();
    const profile = route.params.id;
    if (profile != null){
      this.callWaether(profile);
    }
  },
  methods: {
    callWaether(id) {
      this.variant_tmp = this.variants[id];
      this.getWeather(this.variant_tmp.lat, this.variant_tmp.lon);
    },
    getWeather(lat,lon){
      const url = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon="+ lon +"&appid=1e4c34f463af9ea67811daa9329ed1c6"
      axios.get(url)
      .then(response => (
        this.variant_tmp.temperature = (response.data.main.temp-270).toFixed(2)
      ))
    },
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    filterFunction() {
      let input, filter, a, i, div, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toLowerCase();
      div = document.getElementById("myDropdown");
      a = div.getElementsByTagName("a");
      for (i = 0; i < a.length; i++) {
        // Vient verifier grace a include que le ou les caracteres rentrees appartiennent a l'un des elements de la liste
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          a[i].style.display = "";
        } 
        // Si appartient, on affiche
        else {
          a[i].style.display = "none";
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.meteo {
  background-color: lightslategray;
  padding: 50px;
  color: wheat;
}
.search_weather {
  background-color: lightslategray;
  color: wheat;
  padding: 50px;
  margin-bottom: 10px;
}

.select {
  margin-bottom: 10px;
}

.btn-search {
  cursor: pointer;
  outline: 0;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  border: 1px solid transparent;
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 0.25rem;
}

/* The search field */
#myInput {
  box-sizing: border-box;
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

/* The search field when it gets focus/clicked on */
#myInput:focus {outline: 3px solid #ddd;}

/* The container <div> - needed to position the dropdown content */
.search_bar {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: block;
  position: absolute;
  background-color: #f6f6f6;
  min-width: 230px;
  border: 1px solid #ddd;
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: #f1f1f1;
  color: blue;
  cursor: pointer;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display:block;
}
.hide {
  display:none;
}
</style>