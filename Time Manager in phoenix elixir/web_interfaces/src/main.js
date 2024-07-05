import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import setAuthHeader from './utils/setAuthHeader';

if (sessionStorage.getItem('sessionObject')) {
    const sessionObject = JSON.parse(sessionStorage.getItem('sessionObject'));
    const token = sessionObject.SessionData.token; 
    setAuthHeader(token);
}
else {
    setAuthHeader(false);
}

createApp(App).use(router).use(store).mount('#app')