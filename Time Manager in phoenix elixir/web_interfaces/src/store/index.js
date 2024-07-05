import { createStore } from "vuex";

const store = createStore({
    // Allow to debug
    strict: true,
    state: {
        // ROLE
            // 0 -> Tout le monde
        Navbar: [
            {role: 0, name: "Dashboard", action: "/home", style: "margin-right: 10%;"},
            {role: 0, name: "Déconnexion", action: "/deconnexion", style: "float: right;"},
            
            {role: 'Employee', name: "Departure & Arrival time", action: "/timeHandler", style: ""},
            {role: 'Employee', name: "My schedule", action: "/mySchedule", style: ""},
            {role: 'Employee', name: "My account", action: "/myAccount", style: "float: right;"},

            {role: 'Manager', name: "Departure & Arrival time", action: "/timeHandler", style: ""},
            {role: 'Manager', name: "My schedule", action: "/mySchedule", style: ""},
            {role: 'Manager', name: "Manage team", action: "/manageTeam", style: ""},
            {role: 'Manager', name: "Departure & Arrival employees", action: "/arrivalDepartureEmployeesManager", style: ""},
            {role: 'Admin', name: "Create Team", action: "/createTeams", style: ""},
            {role: 'Manager', name: "My account", action: "/myAccount", style: "float: right;"},

            {role: 'Admin', name: "Departure & Arrival time", action: "/timeHandler", style: ""},
            {role: 'Admin', name: "My schedule", action: "/mySchedule", style: ""},
            {role: 'Admin', name: "Departure & Arrival employees", action: "/arrivalDepartureEmployees", style: ""},
            {role: 'Admin', name: "Handle users", action: "/handleUsers", style: ""},
        ],
        url: "http://localhost:4000/",
    },
    mutations: {},
    actions: {},
    getters: {
        getNavbarElements: state => state.Navbar,
    }
})

export default store;