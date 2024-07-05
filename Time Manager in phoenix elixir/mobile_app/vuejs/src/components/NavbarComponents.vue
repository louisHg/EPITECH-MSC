<template>
    <div id="navbar-animmenu" style="margin-bottom: 25px;">
      <ul class="show-dropdown main-navbar">
            <div v-if="token == null">
                <!-- AJOUTE LOGO SITE + href vers menu "/"-->
            </div>
            <div v-else>
                <div v-for="navbar in navbarElements" :key="navbar.message">
                    <!-- AJOUTE LOGO SITE + href vers menu "/"-->
                    <li v-bind:style="navbar.style" v-if="navbar.role == 0 || navbar.role == role">
                        <a v-on:click="()=>redirection(navbar.action)" ><i class="fas fa-tachometer-alt"></i>{{navbar.name}}</a>
                    </li>
                </div>
            </div>
      </ul>
    </div>
  </template>

<script>
import {mapGetters} from 'vuex';
export default {
    data() {
		return {
			token: null,
            role: null
		};
	},
    methods:{
        redirection(action){
            if (action == "/deconnexion"){
                sessionStorage.removeItem('sessionObject');
                document.location.reload();
            }
            else {
                location.href = action;
            }
        },
        checkSessionObject() {
			const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
			if (sessionObject != null){
				const currentDate = new Date();
				const expirationDate = sessionObject.expiresAt;
                this.token = sessionObject.SessionData.token;
                this.role = sessionObject.SessionData.user;
				if(Date.parse(currentDate) < Date.parse(expirationDate)) {
					//normal application behaviour => session is not expired
					this.token = sessionObject.SessionData.token;
				} else {
					//redirect users to login page 
					sessionStorage.removeItem('sessionObject');
					alert("Session Expired");
				}
			}
		}
    },
    mounted() {
		this.checkSessionObject();
	},
    computed: {
        ...mapGetters({
            navbarElements: "getNavbarElements"
        })
    }
}
</script>

<style>

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

* {
    margin: 0;
    padding: 0;
}
#navbar-animmenu {
    background: #5161ce;
    float: left;
    overflow: hidden;
    position: relative;
    padding: 10px 0px;
    width: 100%;
}
#navbar-animmenu ul{
    padding: 0px;
    margin: 0px;
}

#navbar-animmenu ul li a i{
    margin-right: 10px;
}

#navbar-animmenu li {
    list-style-type: none;
    float: left;
}

#navbar-animmenu ul li a{
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    font-size: 15px;
    line-height: 45px;
    display: block;
    padding: 0px 20px;
    transition-duration:0.6s;
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
}

#navbar-animmenu>ul>li.active>a{
    color: #5161ce;
    background-color: transparent;
    transition: all 0.7s;
}

#navbar-animmenu a:not(:only-child):after {
    position: absolute;
    right: 20px;
    top: 10%;
    font-size: 14px;
    font-family: "Font Awesome 5 Free";
    display: inline-block;
    padding-right: 3px;
    vertical-align: middle;
    font-weight: 900;
    transition: 0.5s;
}

#navbar-animmenu a:hover {
color: red;
cursor: pointer;
}

#navbar-animmenu .active>a:not(:only-child):after {
    transform: rotate(90deg);
}
.hori-selector{
    display:inline-block;
    position:absolute;
    height: 100%;
    top: 10px;
    left: 0px;
    transition-duration:0.6s;
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    background-color: #fff;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}
</style>