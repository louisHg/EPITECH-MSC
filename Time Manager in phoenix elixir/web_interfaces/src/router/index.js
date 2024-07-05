import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurrentWeather from '../views/CurrentWeather.vue'
import NotFound from '../views/NotFound.vue'
import LoginView from '../views/LoginView.vue'
import MyAccount from '../views/MyAccount.vue'
import MySchedule from '../views/MySchedule.vue'
import TimeHandler from '../views/TimeHandler.vue'
import EmployeesSchedules from '../views/EmployeesSchedules.vue'
import ManageTeam from '../views/ManageTeam.vue'
import HandleUsers from '../views/HandleUsers.vue'
import ArrivalDepartureEmployees from '../views/ArrivalDepartureEmployees.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guest: true
    }
  },
  {
    path: '/',
    name: 'default',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  { path: '/currentWeather', 
    name: 'CurrentWeather',
    component: CurrentWeather, 
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  { path: '/currentWeather/:id', 
    name: 'CurrentWeatherById',
    component: CurrentWeather, 
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  { path: '/myAccount', 
    name: 'MyAccountEmployee',
    component: MyAccount, 
    meta: {
      requiresAuth: true,
      is_employee: true,
    }
  },
  { path: '/myAccount', 
    name: 'MyAccountManager',
    component: MyAccount, 
    meta: {
      requiresAuth: true,
      is_manager: true,
    }
  },
  { path: '/mySchedule', 
    name: 'MySchedule',
    component: MySchedule, 
    meta: {
      requiresAuth: true
    }
  },
  { path: '/timeHandler', 
    name: 'TimeHandler',
    component: TimeHandler, 
    meta: {
      requiresAuth: true
    }
  },
  { path: '/createTeams', 
    name: 'EmployeesSchedules',
    component: EmployeesSchedules, 
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  { path: '/manageTeam', 
    name: 'ManageTeam',
    component: ManageTeam, 
    meta: {
      requiresAuth: true,
      is_manager: true,
    }
  },
  { path: '/handleUsers', 
    name: 'HandleUsers',
    component: HandleUsers, 
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  { path: '/arrivalDepartureEmployees', 
    name: 'ArrivalDepartureEmployeesAdmin',
    component: ArrivalDepartureEmployees, 
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  { path: '/arrivalDepartureEmployeesManager', 
    name: 'ArrivalDepartureEmployeesManager',
    component: ArrivalDepartureEmployees, 
    meta: {
      requiresAuth: true,
      is_manager: true,
    }
  },
  { path: '/:pathMatch(.*)*',
    name: 'NotFound', 
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
  // If route has meta tag requiresAuth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if token exist, if not exist -> go to login
    if (sessionObject == null) {
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    } 
    // Acces to the rest of routes 
    else {
      const user = sessionObject.SessionData.user;
      if (to.matched.some(record => record.meta.is_employee)) {
        if (user == 'Employee') {
          next()
        } 
        else {
          next({name: 'home'})
        }
      } 
      if (to.matched.some(record => record.meta.is_manager)) {
        if (user == 'Manager') {
          next()
        } 
        else {
          next({name: 'home'})
        }
      } 
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user == 'Admin') {
          next()
        } 
        else {
          next({name: 'home'})
        }
      } 
      else {
        next()
      }
    }
  } 
  else if (to.matched.some(record => record.meta.guest)) {
    // If no token, stay on login page
    if (sessionObject == null) {
      next()
    } 
    // Go to home
    else {
      next({name: 'home'})
    }
  } 
  // If no meta 
  else {
    next()
  }
})

export default router
