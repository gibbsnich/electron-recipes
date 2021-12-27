import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import App from './App.vue';
import Home from './Home.vue';
import Recipes from './Recipes.vue';
import Ingredients from './Ingredients.vue';
import Categories from './Categories.vue';
import { store } from './store.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSave, faPlusSquare, faMinusSquare);

const routes = [
    { path: '/', component: Home },
    { path: '/recipes', component: Recipes },
    { path: '/ingredients', component: Ingredients },
    { path: '/categories', component: Categories },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store);
app.use(router);

app.mount('#app');
