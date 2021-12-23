import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import Home from './Home.vue';
import Recipes from './Recipes.vue';
import { store } from './store.js';

const routes = [
    { path: '/', component: Home },
    { path: '/recipes', component: Recipes },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const app = createApp(App);
app.use(store);
app.use(router);

app.mount('#app');
