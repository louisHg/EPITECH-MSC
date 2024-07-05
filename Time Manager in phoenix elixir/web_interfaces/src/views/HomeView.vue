<template>
  <div v-if="this.role === 'Employee' || 'Manager' || 'Admin'">
    <ArrivalDepartureComponents />
    <ChartComponents />
  </div>
  <div v-if="this.role === 'Manager'">
    <ManageTeamComponentsVue />
    <EmployeesSchedulesComponents />
  </div>
  <div v-if="this.role === 'Admin'">
    <AllUsersComponents />
  </div>
</template>

<script>
import ArrivalDepartureComponents from "@/components/ArrivalDepartureComponents.vue";
import ChartComponents from "@/components/ChartComponents.vue";
import AllUsersComponents from "@/components/AllUsersComponents.vue";
import ManageTeamComponentsVue from "@/components/ManageTeamComponents.vue";
import EmployeesSchedulesComponents from "@/components/EmployeesSchedulesComponents.vue";

export default {
  components: {
    ArrivalDepartureComponents,
    ChartComponents,
    AllUsersComponents,
    ManageTeamComponentsVue,
    EmployeesSchedulesComponents,
  },
  data() {
    return {
      token: null,
      role: null,
    };
  },
  methods: {
    checkSessionObject() {
      const sessionObject = JSON.parse(sessionStorage.getItem("sessionObject"));
      if (sessionObject != null) {
        const currentDate = new Date();
        const expirationDate = sessionObject.expiresAt;
        this.token = sessionObject.SessionData.token;
        this.role = sessionObject.SessionData.user;
        if (Date.parse(currentDate) < Date.parse(expirationDate)) {
          //normal application behaviour => session is not expired
          this.token = sessionObject.SessionData.token;
        } else {
          //redirect users to login page
          sessionStorage.removeItem("sessionObject");
          alert("Session Expired");
        }
      }
    },
  },
  mounted() {
    this.checkSessionObject();
    // + vérifier par back
  },
};
</script>
