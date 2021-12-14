import { createApp } from 'vue'
import { createStore } from 'vuex';
import { createRouter, createWebHashHistory } from 'vue-router';
import { ipcRenderer } from '@/electron';

import App from './App.vue';
import Home from './Home.vue';
import Recipes from './Recipes.vue';

function padZero(d) {
    return (d < 10) ? `0${d}` : d;
}

function dateToString(d) {
    return `${d.getYear()+1900}-${padZero(d.getMonth()+1)}-${padZero(d.getDate())}`
}

function dateToTimeString(d) {
    return `${dateToString(d)}T${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
}

const store = createStore({
    state () {
        return {
            events: [{
                title: 'Abendessen',
                color: 'green',
                extendedProps: {
                    recur: true,
                },
                allDay: true,
                startRecur: '1970-01-01'
            }, {
                title: 'Mittagessen',
                color: 'blue',
                extendedProps: {
                    recur: true,
                },
                allDay: true,
                startRecur: '1970-01-01'
            }],
            recipes: null
        }
    },
    mutations: {
        initStore(state, data) {
            state.recipes = data.recipes;
            if (data.events.length > 0) {
                state.events = data.events;
            }
        },
        storeRecipe(state, recipe) {
            if (!recipe.id) {
                const nextId = state.recipes.reduce((r, s) => r.id > s ? r.id : s, 0) + 1;
                recipe.id = nextId;
            }
            state.recipes.push(recipe);
        },
        setEvent(state, event) {
            const recipe = state.recipes.filter((r) => r.id === event.recipeId)[0];
            if (!recipe || recipe.length === 0)
                return;
            
            if (event.extendedProps.recur) {
                let eventDate = dateToString(event.start),
                    eventStart, eventEnd;
                if (event.title === "Mittagessen") {
                    eventStart = `${eventDate}T12:00`;
                    eventEnd = `${eventDate}T13:00`;
                } else {
                    eventStart = `${eventDate}T18:00`;
                    eventEnd = `${eventDate}T19:00`;
                }
                state.events.push({title: recipe.name, start: eventStart, end: eventEnd, color: 'red', extendedProps: {recipeId: recipe.id}});
            } else {
                const startISO = dateToTimeString(event.start);
                const selEvent = state.events.filter((evt) => evt.start === startISO);
                if (selEvent.length === 0) {
                    return;
                }
                selEvent[0].title = recipe.name;
                selEvent[0].extendedProps.recipeId = recipe.id;
            }
        }
    },
    actions: {
        async loadInitialData({ commit }) {
            const recipeData = await ipcRenderer.invoke('readJSON', 'recipes');
            const eventData = await ipcRenderer.invoke('readJSON', 'events');
            commit('initStore', {recipes: recipeData, events: eventData});
        },
        async storeEvent({ commit, state }, event) {
            commit('setEvent', event);
            await ipcRenderer.invoke('writeJSON', {fileName: 'events', data: JSON.stringify(state.events)});
        },
        async storeRecipe({ commit, state }, recipe) {
            commit('storeRecipe', recipe);
            await ipcRenderer.invoke('writeJSON', {fileName: 'recipes', data: JSON.stringify(state.recipes)});
        }
    }
});

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
