// import './assets/main.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue'
import router from "@/router/router.js";
import PrimeVue from 'primevue/config';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'primevue/resources/themes/aura-light-blue/theme.css'

window.Pusher = Pusher;

window.Echo = new Echo({
	authEndpoint : 'http://localhost:8080/broadcasting/auth',
	broadcaster: 'pusher',
	key: "52d84e311b5b5b7c89c9",
	cluster: "mt1",
	forceTLS: true,
	// auth: {
    //     headers: {
    //         Authorization: 'Bearer ' + '9|Bp2BXpCP3WchLvaTheLZ6vUhVsoZMvAqhzgBMMyG8903ade9'
    //     },
    // },
	// encrypted: false
});

// const conectEcho = {
// 	mounted() {

// 		Echo.private(`chats.${orderId}`)
// 			.listen('MessageWasCreated', (e) => {
// 				console.log('qwe');
// 				console.log(e);
// 				// console.log(e.message);
// 				// console.log(e.user);
// 			});
// 	},
// }

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)
pinia.use(({ store }) => {
	store.router = markRaw(router)
})

app.use(PrimeVue);
app.use(VueAxios, axios)
app.use(pinia)
app.use(router)
app.mount('#app')
