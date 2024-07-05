<template>
  <EditComponents
    v-bind:reveleEdit="reveleEdit"
    v-bind:toggleModaleEdit="toggleModaleEdit"
  />
  <h2>Manage Team</h2>
  <button class="createTeam" v-if="teamCreated = false">CREATE TEAM</button>
  <table>
    <thead>
      <tr>
        <th class="headerTab" colspan="1">
          Role :
          <select id="roleTab-select" v-model="selected_role">
            <option
              v-for="role in roles"
              :key="role"
              :value="role.value"
              @click="filterMember(role.value)"
            >
              {{ role.text }}
            </option>
          </select>
        </th>
        <th class="headerTab" colspan="1"></th>
        <th class="headerTab" colspan="1"></th>
        <th class="headerTab" colspan="1"></th>
        <th class="headerTab" colspan="1">
          <input
            id="search"
            v-model="search"
            type="text"
            placeholder="Search the first name"
            autofocus
          />
        </th>
      </tr>
      <tr class="subHeaderTab">
        <th class="subHeaderTab" colspan="1">User</th>
        <th class="subHeaderTab" colspan="1">Work</th>
        <th class="subHeaderTab" colspan="1">Timer clicks</th>
        <th class="subHeaderTab" colspan="1">Date of the last click</th>
        <th class="subHeaderTab" colspan="1">Role</th>
        <th class="subHeaderTab" colspan="1">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, i) in filteredItems" :key="i">
        <td>{{ user.first_name }} {{ user.last_name }}</td>
        <td v-if="user.status == false" class="optCol">&#128564;</td>
        <td v-if="user.status == true" class="optCol">&#128337;</td>
        <td class="optCol">{{ user.currentUserClock_clock }}</td>
        <td class="optCol">{{ user.status }}</td>
        <td class="optCol">{{ user.role }}</td>
        <td class="actions">
          <button class="save" @click="toggleModaleEdit(), setUser(user)">
            EDIT
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import EditComponents from "@/components/EditComponents.vue";
const axios = require("axios");
export default {
  data() {
    return {
      reveleEdit: false,
      teamCreated: true,
      url: null,
      firstday: null,
      lastday: null,
      allUsers: [],
      user_log: null,

      search: "",
      roles: [
        { value: "All", text: "All" },
        { value: "Employee", text: "Employee" },
        { value: "Manager", text: "Manager" },
        { value: "Admin", text: "Admin" },
      ],
      selected_role: null,
      allUsersFilterBySelect: [],
    };
  },
  components: {
    EditComponents,
  },
  methods: {
    toggleModaleEdit: function () {
      this.reveleEdit = !this.reveleEdit;
    },
    setUser(user) {
      var sessionObject = {
        SessionData: {
          email: user.email,
          first_name: user.first_name,
          id: user.id,
          last_name: user.last_name,
          role: user.role,
          username: user.username,
          currentUserClock_clock: user.currentUserClock_clock,
          status: user.status,
        },
      };
      sessionStorage.setItem("user_info", JSON.stringify(sessionObject));
    },
    async getCurrentWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstdayDotErased = new Date(curr.setDate(first))
        .toISOString()
        .split(".")[0];
      const lastdayDotErased = new Date(curr.setDate(last))
        .toISOString()
        .split(".")[0];

      this.firstday = firstdayDotErased.split("T").join(" ");
      this.lastday = lastdayDotErased.split("T").join(" ");
    },
    async getUserPresence(allUsersWithoutWeeklySchedule) {
      this.getCurrentWeek();
      allUsersWithoutWeeklySchedule.map((user) => {
        const user_id = user.id;
        const userObject = {
          email: user.email,
          first_name: user.first_name,
          id: user.id,
          last_name: user.last_name,
          role: user.role,
          username: user.username,
          currentUserClock_clock: null,
          status: null,
        };
        const userClockURL = "api/clocks/" + user_id;
        axios
          .get(this.url + userClockURL)
          .then(
            (response) => (
              (userObject.currentUserClock_clock = response.data.time
                .split("T")
                .join(" at ")),
              (userObject.status = response.data.status),
              this.allUsers.push(userObject)
            )
          )
          .catch((error) => console.log(error));
      });
    },
    // He's used to find all users in db
    async searchAllUsers() {
      const searchAllUsersURL = "api/teams/all";
      await axios
        .get(this.url + searchAllUsersURL)
        .then((response) => this.getUserPresence(response.data))
        .catch((error) => console.log(error));
    },
    async filterMember(role) {
      if (this.allUsersFilterBySelect.length > 0) {
        this.allUsers = this.allUsersFilterBySelect;
      }
      this.allUsersFilterBySelect = this.allUsers;
      const val = role;
      console.log(role);
      if (val == "All") {
        this.allUsers = this.allUsersFilterBySelect;
      } else {
        this.allUsers = this.allUsers.filter(function (e) {
          return e.role == val;
        });
      }
    },
  },
  mounted() {
    this.url = this.$store.state.url;
    this.searchAllUsers();
    const sessionObject = JSON.parse(sessionStorage.getItem("sessionObject"));
    this.user_log = sessionObject.SessionData.user_id;
  },
  computed: {
    filteredItems() {
      return this.allUsers.filter((user) => {
        // Computed is listener
        const employees = user.first_name.toLowerCase();
        const department = user.last_name.toLowerCase();
        const role = user.role.toLowerCase();
        const searchTerm = this.search.toLowerCase();

        return (
          department.includes(searchTerm) ||
          employees.includes(searchTerm) ||
          role.includes(searchTerm)
        );
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
* {
  font-family: "Poppins", sans-serif;
}
table {
  margin: 0 auto;
  margin-top: 20px;
  width: 80%;
  font-family: "Poppins", sans-serif;
  border-collapse: collapse;
  margin-bottom: 3%;
}

tr {
  border-bottom: 1px solid rgb(190, 190, 190);
}

/*HEADER TAB*/
tr .headerTab {
  padding: 5px;
  font-weight: 800;
  font-size: 20px;
}

tr .subHeaderTab {
  font-size: 18px;
  color: black;
  padding: 15px;
}

/*ACTIONS BUTTONS*/
table tbody .actions {
  display: flex;
}

table tbody .actions .save {
  border-radius: 25px;
  width: 25%;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
}

table tbody .actions .deploy {
  display: none;
}

.createTeam {
  border-radius: 25px;
  width: 15%;
  background: linear-gradient(269.24deg, #24c9ff, #15aad9);
  box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
  font-weight: 500;
  text-align: center;
}

/* RESPONSIVE*/
@media screen and (max-width: 768px) {
  table thead {
    display: none;
  }
  table tbody tr .optCol,
  table tbody .actions .save {
    display: none;
  }
  table tbody .actions .deploy {
    width: 20px;
    height: 20px;
    right: 60px;
    position: absolute;
    margin-top: 10px;
  }
  table tbody tr td {
    font-size: 20px;
    text-align: left;
    padding: 10px;
  }
  .createTeam {
    border-radius: 25px;
    width: 40%;
    background: linear-gradient(269.24deg, #24c9ff, #15aad9);
    box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
    font-weight: 500;
    text-align: center;
  }

  table tbody .actions .save {
    border-radius: 25px;
    width: 35%;
    background: linear-gradient(269.24deg, #24c9ff, #15aad9);
    box-shadow: 0 10px 20px rgba(27, 183, 232, 0.3);
    font-weight: 500;
    text-align: center;
  }
}
</style>
