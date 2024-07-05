<template>
	<div v-if="this.role === 'Employee' || 'Manager' || 'Admin' ">
		Departure & Arrival time
		My schedule
		PUT COMPONENTS FOR EACHS
	</div>
	<div v-if="this.role === 'Manager'">
		Manage team
		Employees schedules
	</div>
	<div v-if="this.role === 'Admin'">
		Handle users
	</div>
</template>

<script>

export default {
	data() {
		return {
			token: null,
            role: null
		};
	},
    methods:{
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
		// + vérifier par back
	}
}
</script>