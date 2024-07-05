<template>
	<LoginRegisterComponents />
</template>

<script>
import LoginRegisterComponents from '@/components/LoginRegisterComponents.vue';

export default {
	data() {
		return {
			token: null,
		};
	},
	components: {
		LoginRegisterComponents
	},
	created() {
		const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
		if (sessionObject != null){
			const currentDate = new Date();
			const expirationDate = sessionObject.expiresAt;
			if(Date.parse(currentDate) < Date.parse(expirationDate)) {
				//normal application behaviour => session is not expired
				this.token = sessionObject.SessionData.token;
			} else {
				//redirect users to login page or whatever logic you have in your app 
				//and remove the sessionStorage because it will be set again by previous logic
				sessionStorage.removeItem('sessionObject');
				alert("&#128337; Session Expired");
			}
		}
	}
}
</script>