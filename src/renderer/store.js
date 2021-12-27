import { createStore } from 'vuex';
import { ipcRenderer } from '@/electron';

import { dateToTimeString } from './util/date.js';
import { recurEventToEvent } from './util/event.js';
import { nextId } from './util/entity.js';

export const store = createStore({
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
            recipes: [],
            recipeCategories: [],
            ingredientCategories: [],
            ingredientStores: [],
            ingredients: [],
        }
    },
    getters: {
        getIngredientById: (state) => (ingredientId) => {
            return state.ingredients.find(i => i.id === ingredientId);
        },
        getIngredientByIngredient: (state) => (ingredientValue) => {
            return state.ingredients.find(i => i.ingredient === ingredientValue);
        },
        getSortedIngredients (state) {
            return state.ingredients.sort((a, b) => a.ingredient < b.ingredient ? -1 : (b.ingredient < a.ingredient ? 1 : 0));
        },
        getSortedIngredientsByCategory: (state) => (categoryId) => {
            return state.ingredients.filter(i => i.categoryId === categoryId).sort((a, b) => a.ingredient < b.ingredient ? -1 : (b.ingredient < a.ingredient ? 1 : 0));
        },
        getIngredientCategoriesByName: (state) => (categoryName) => {
            return state.ingredientCategories.filter(ic => ic.name === categoryName);
        },
        getSortedIngredientCategories (state) {
            return state.ingredientCategories.sort((a, b) => a.name < b.name ? -1 : (b.name < a.name ? 1 : 0));
        },
        getIngredientStoresByName: (state) => (storeName) => {
            return state.ingredientStores.filter(is => is.name === storeName);
        },
        getSortedIngredientStores (state) {
            return state.ingredientStores.sort((a, b) => a.name < b.name ? -1 : (b.name < a.name ? 1 : 0));
        },
        getEventByStart: (state) => (eventStart) => {
            return state.events.find(event => event.start === eventStart);
        },
        getIngredientEventByStart: (state) => (ingredientEventStart) => {
            return state.events.find(event => event.extendedProps.extra && event.start === ingredientEventStart);
        },
        getIngredientsBySubstring: (state) => (subString) => {
            const subStringLower = subString.toLowerCase();
            return state.ingredients.filter(i => i.ingredient.toLowerCase().indexOf(subStringLower) > -1);
        },
        getRecipeById: (state) => (recipeId) => {
            return state.recipes.find(recipe => recipe.id === recipeId);
        },
        getRecipeByUrl: (state) => (recipeUrl) => {
            return state.recipes.find(recipe => recipe.url === recipeUrl);
        },
        getSortedRecipes: (state) => (recipeCategoryId) => {
            return state.recipes.filter(r => r.recipeCategories.includes(recipeCategoryId)).sort((a, b) => a.ingredient < b.ingredient ? -1 : (b.ingredient < a.ingredient ? 1 : 0));
        },
        getSortedRecipesWithoutCategory (state) {
            return state.recipes.filter(r => r.recipeCategories.length === 0).sort((a, b) => a.name < b.name ? -1 : (b.name < a.name ? 1 : 0));
        },
        getSortedRecipeCategories (state) {
            return state.recipeCategories.sort((a, b) => a.name < b.name ? -1 : (b.name < a.name ? 1 : 0));
        },
        getRecipeCategoryByName: (state) => (recipeCategoryName) => {
            return state.recipeCategories.find(recipeCategory => recipeCategory.name === recipeCategoryName);
        }
    },
    mutations: {
        initStore(state, data) {
            state.recipes = data.recipes;
            state.recipeCategories = data.recipeCategories;
            if (data.events.length > 0) {
                state.events = data.events;
            }
            state.ingredients = data.ingredients;
            state.ingredientCategories = data.ingredientCategories;
            state.ingredientStores = data.ingredientStores;
        },
        storeRecipe(state, recipe) {
            if (!recipe.id) {
                const nextRecipeId = nextId(state.recipes);
                recipe.id = nextRecipeId;
                state.recipes.push(recipe);
            } else {
                const recipeIndex = state.recipes.findIndex(r => r.id === recipe.id);
                state.recipes[recipeIndex] = recipe;
            }
        },
        updateRecipes(state, ingredient) {
            state.recipes.forEach(r => {
                r.ingredients.forEach((ri, index) => {
                    if (ri.id === ingredient.id) {
                        r.ingredients[index] = ingredient;
                    }
                });
            });
        },
        storeRecipeCategory(state, recipeCategoryName) {
            const newRecipeCategoryId = nextId(state.recipeCategories);
            state.recipeCategories.push({name: recipeCategoryName, id: newRecipeCategoryId});
        },
        storeIngredient(state, { ingredientWithoutCategory, ingredientCategoryId, ingredientStoreId }) {
            if (!ingredientWithoutCategory.id) {
                const newIngredientId = nextId(state.ingredients);
                ingredientWithoutCategory.id = newIngredientId;
                ingredientWithoutCategory.categoryId = ingredientCategoryId;
                ingredientWithoutCategory.storeId = ingredientStoreId;
                if (Object.hasOwnProperty(ingredientWithoutCategory, 'amount')) {
                    delete ingredientWithoutCategory.amount;
                }
                state.ingredients.push(ingredientWithoutCategory);
            }
        },
        updateIngredient(state, ingredient) {
            const ingredientIndex = state.ingredients.findIndex(i => i.id === ingredient.id);
            state.ingredients[ingredientIndex] = ingredient;
        },
        storeIngredientCategory(state, ingredientCategoryName) {
            const newIngredientCategoryId = nextId(state.ingredientCategories);
            state.ingredientCategories.push({name: ingredientCategoryName, id: newIngredientCategoryId});
        },
        storeIngredientStore(state, ingredientStoreName) {
            const newIngredientStoreId = nextId(state.ingredientStores);
            state.ingredientStores.push({name: ingredientStoreName, id: newIngredientStoreId});
        },
        storeEvent(state, event) {
            const ingredientsEvent = state.events.find(e => e.extendedProps.extra && e.start === event.start);
            if (ingredientsEvent) {
                ingredientsEvent.extendedProps.ingredients = event.extendedProps.ingredients;
            } else {
                state.events.push(event);
            }
        },
        storeRecipeEvent(state, event) {
            const recipe = state.recipes.find((r) => r.id === event.recipeId);
            if (!recipe)
                return;
            const { eventStart, eventEnd } = event.extendedProps.recur ? 
                recurEventToEvent(event) : [null, null];
            const startISO = eventStart ? eventStart : dateToTimeString(event.start);
            const selEvent = state.events.find((evt) => evt.start === startISO);
            if (!selEvent) {
                state.events.push({title: recipe.name, start: eventStart, end: eventEnd, color: 'red', extendedProps: {recipeId: recipe.id}});
            } else {
                selEvent.title = recipe.name;
                selEvent.extendedProps.recipeId = recipe.id;
            }
        },
        updateRecipeEvents(state, ingredient) {
            state.events.forEach(e => {
                if (e.extendedProps.extra) {
                    e.extendedProps.ingredients.forEach((i, index) => {
                        if (i.id === ingredient.id) {
                            e.extendedProps.ingredients[index] = ingredient;
                        }
                    });
                }
            });
        },
    },
    actions: {
        async loadInitialData({ commit }) {
            commit('initStore', {
                recipes: await ipcRenderer.invoke('readJSON', 'recipes'),
                recipeCategories: await ipcRenderer.invoke('readJSON', 'recipe_categories'),
                events: await ipcRenderer.invoke('readJSON', 'events'),
                ingredients: await ipcRenderer.invoke('readJSON', 'ingredients'),
                ingredientCategories: await ipcRenderer.invoke('readJSON', 'ingredient_categories'),
                ingredientStores: await ipcRenderer.invoke('readJSON', 'ingredient_stores'),
            });
        },
        async storeRecipeEvent({ commit, state }, event) {
            commit('storeRecipeEvent', event);
            await ipcRenderer.invoke('writeJSON', {fileName: 'events', data: JSON.stringify(state.events)});
        },
        async storeEvent({ commit, state }, event) {
            commit('storeEvent', event);
            await ipcRenderer.invoke('writeJSON', {fileName: 'events', data: JSON.stringify(state.events)});
        },
        async storeRecipe({ commit, state }, recipe) {
            commit('storeRecipe', recipe);
            await ipcRenderer.invoke('writeJSON', {fileName: 'recipes', data: JSON.stringify(state.recipes)});
        },
        async storeRecipeCategory({ commit, state }, recipeCategoryName) {
            commit('storeRecipeCategory', recipeCategoryName);
            await ipcRenderer.invoke('writeJSON', {fileName: 'recipe_categories', data: JSON.stringify(state.recipeCategories)});
        },
        async storeIngredient({ commit, state }, { ingredientWithoutCategory, ingredientCategoryId, ingredientStoreId }) {
            commit('storeIngredient', { ingredientWithoutCategory, ingredientCategoryId, ingredientStoreId });
            await ipcRenderer.invoke('writeJSON', {fileName: 'ingredients', data: JSON.stringify(state.ingredients)});
        },
        async updateIngredient({ commit, state }, ingredient) {
            commit('updateIngredient', ingredient);
            await ipcRenderer.invoke('writeJSON', {fileName: 'ingredients', data: JSON.stringify(state.ingredients)});
            commit('updateRecipes', ingredient);
            await ipcRenderer.invoke('writeJSON', {fileName: 'recipes', data: JSON.stringify(state.recipes)});
            commit('updateRecipeEvents', ingredient);
            await ipcRenderer.invoke('writeJSON', {fileName: 'events', data: JSON.stringify(state.events)});
        },
        async storeIngredientCategory({ commit, state }, ingredientCategoryName) {
            commit('storeIngredientCategory', ingredientCategoryName);
            await ipcRenderer.invoke('writeJSON', {fileName: 'ingredient_categories', data: JSON.stringify(state.ingredientCategories)});
        },
        async storeIngredientStore({ commit, state }, ingredientStoreName) {
            commit('storeIngredientStore', ingredientStoreName);
            await ipcRenderer.invoke('writeJSON', {fileName: 'ingredient_stores', data: JSON.stringify(state.ingredientStores)});
        },
    }
});