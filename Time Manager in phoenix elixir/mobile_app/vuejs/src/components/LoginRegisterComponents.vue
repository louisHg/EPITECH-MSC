<template>
  <div>
    <div class="center">
		<div class="main">
			<input type="checkbox" id="chk" aria-hidden="true">
			<div class="signup">
				<label for="chk" aria-hidden="true">Sign up</label>
				<input id="name" type="text" v-model="name"  placeholder="Name" required autofocus >
				<input id="first-name" type="text" v-model="first_name"  placeholder="First name" required >
				<input id="email" type="email" v-model="email" placeholder="Email" required >
				<input id="password" type="password" v-model="password"  placeholder="Password" required >
				<input id="password-confirm" type="password" v-model="password_confirmation"  placeholder="Password Confirmation" required >
				<button type="submit" v-on:click="register()">Sign up</button>
			</div>

			<div class="login">
				<label for="chk" aria-hidden="true">Login</label>
				<input id="email_login" type="email" v-model="email_login" placeholder="Email" required autofocus >
				<input id="password_login" type="password" v-model="password_login"  placeholder="Password" required >
				<button v-on:click="login()">Login</button>
			</div>
		</div>
    </div>

  </div>
</template>

<script>
const axios =  require("axios");
export default {
	data() {
		return {
			// Submit data
			name: "",
			first_name: "",
			email: "",
			password: "",
			password_confirmation: "",

			// Login data
			email_login: "",
			password_login: "",

			url: null,
		};
	},
    methods: {
        setStorage(token, role){
			// To 1 day var expires = new Date(Date.now()+ 86400*1000)
			var expires = new Date(Date.now()+ 86400*1000);
			var sessionObject = {
				expiresAt: expires,
				SessionData: {
					token: token,
					user: role
				}
			}
			console.log(role);
			sessionStorage.setItem('sessionObject', JSON.stringify(sessionObject));
		},
		login() {			
			if (this.password_login.length > 0) {
				const login_url = "auth/login?email=" + this.email_login + "&password=" + this.password_login
				axios
					.get(this.url + login_url)
					.then(response => (
						this.setStorage(response.data.jwt, response.data.user.role),
						document.location.reload()
						// Check if login allowed 
					))
					.catch(error => console.log(error))
			} else {
				return alert("You forgot your passwords")
			}
		},
		register() {
			if (this.password === this.password_confirmation && this.password.length > 0) {
				const register_url = "auth/register";
				const register = 
				{ 
					"user":{
						"username": this.name + "." + this.first_name ,
						"email": this.email,
						"last_name": this.name,
						"first_name": this.first_name,
						"password": this.password
					}
				};
				axios
					.post(this.url + register_url , register)
					.then(response => (
						alert("Welcome " + response.data.first_name + response.data.last_name + ". You're succesfully registered ✅"),
						this.name = "",
						this.first_name = "",
						this.email = "",
						this.password = "",
						this.password_confirmation = ""
						// Check if email exist 
					))
					.catch(error => console.log(error))
			} else {
				this.password = ""
				this.password_confirmation = ""
				return alert("Passwords do not match")
			}
		},
		checkSessionObject() {
			const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
			if (sessionObject != null){
				const currentDate = new Date();
				const expirationDate = sessionObject.expiresAt;
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
		this.url = this.$store.state.url;
	}
}
</script>

<style>
.center{
  position: relative;
  display: inline-block;
  border-radius: 10px;
  border: solid;
  border-color: #5161ce;
}

.main{
	width: 500px;
	height: 600px;
	background: red;
	overflow: hidden;
	background: linear-gradient(to bottom, #2c3e50, #5161ce, #5161ce);
	border-radius: 10px;
}
#chk{
	display: none;
}
.signup{
	position: relative;
	width:100%;
	height: 100%;
}
label{
	color: #fff;
	font-size: 2.3em;
	justify-content: center;
	display: flex;
	margin: 60px;
	font-weight: bold;
	cursor: pointer;
	transition: .5s ease-in-out;
}
input{
	width: 60%;
	height: 20px;
	background: #e0dede;
	justify-content: center;
	display: flex;
	margin: 20px auto;
	padding: 10px;
	border: none;
	outline: none;
	border-radius: 5px;
}
button{
	width: 60%;
	height: 40px;
	margin: 10px auto;
	justify-content: center;
	display: block;
	color: #fff;
	background: #573b8a;
	font-size: 1em;
	font-weight: bold;
	margin-top: 20px;
	outline: none;
	border: none;
	border-radius: 5px;
	transition: .2s ease-in;
	cursor: pointer;
}
button:hover{
	background: #6d44b8;
}
.login{
	height: 600px;
	background: #eee;
	border-radius: 60% / 10%;
	transform: translateY(-180px);
	transition: .8s ease-in-out;
}
.login label{
	color: #573b8a;
	transform: scale(.6);
}

#chk:checked ~ .login{
	transform: translateY(-600px);
}
#chk:checked ~ .login label{
	transform: scale(1);	
}
#chk:checked ~ .signup label{
	transform: scale(.6);
}
</style>