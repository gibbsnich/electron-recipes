<template>
    <div class='modal'>
        <div v-for="ingredientCategory in this.$store.state.ingredientCategories" v-bind:key="ingredientCategory.id">
            <div>
                <div style="cursor:pointer;" @click="expandIngredientCategory(ingredientCategory.id)">
                    <span v-show="!this.isExpandedIngredientCategory[ingredientCategory.id]">▼</span>
                    <span v-show="this.isExpandedIngredientCategory[ingredientCategory.id]">▲</span>
                    {{ ingredientCategory.name }}
                </div>
            </div>
            <div v-show="this.isExpandedIngredientCategory[ingredientCategory.id]">
                <div v-for="ingredient in this.$store.state.ingredients.filter((i) => { return i.categoryId === ingredientCategory.id })" v-bind:key="ingredient.id">
                    <span style="cursor:pointer;" @click="addIngredientById(ingredient.id)">{{ ingredient.name }}</span>
                </div>
            </div>
        </div>
        <div v-for="(ingredient, index) in ingredients" v-bind:key="index">
            <input type="text" v-model="ingredient.amount" />
            <input type="text" v-model="ingredient.ingredient" />
            <button type="button" @click="deleteIngredient(index)">[X]</button>
        </div>
        <div>
            <input type="text" v-model="newIngredient.amount" />
            <input type="text" v-model="newIngredient.ingredient" />
            <button type="button" @click="addIngredient()">[N]</button>
        </div>
        <button @click="close">OK</button>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { closeModal } from 'jenesius-vue-modal';

export default defineComponent({
    name: 'RandomIngredientsModal',
    props: ['date'],
    data() {
        return {
            ingredients: [],
            newIngredient: this.makeEmptyIngredient(),
            isExpandedIngredientCategory: {},
        }
    },
    mounted() {
        const ingredientsEvent = this.$store.state.events.filter((e) => e.extendedProps.extra && e.start === this.date + "T14:00");
        if (ingredientsEvent && ingredientsEvent.length === 1) {
            this.ingredients = ingredientsEvent[0].extendedProps.ingredients;
        }
        this.$store.state.ingredientCategories.forEach((cat) => this.isExpandedIngredientCategory[cat.id] = false);
    },
    methods: {
        addIngredient() {
            if (!this.newIngredient.ingredient.categoryId) {
                //todo show 'createOrPickCategory' modal(?)

            }
            this.ingredients.push(this.newIngredient);
            this.newIngredient = this.makeEmptyIngredient();
        },
        deleteIngredient(index) {
            this.ingredients.splice(index, 1);
        },
        close() {
            closeModal();
            this.ingredients.push(this.newIngredient);
            const nonEmptyIngredients = this.ingredients.filter((i) => i.amount !== '' || i.ingredient !== '');
            if (nonEmptyIngredients.length > 0) {
                this.$store.dispatch('storeEvent', {
                    title: 'Zutaten',
                    color: 'black',
                    start: `${this.date}T14:00`,
                    end: `${this.date}T15:00`,
                    extendedProps: {extra: true, ingredients: nonEmptyIngredients},
                });
            }
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: ''};
        },
        expandIngredientCategory(ingredientCategoryId) {
            if (this.isExpandedIngredientCategory[ingredientCategoryId]) {
                this.isExpandedIngredientCategory[ingredientCategoryId] = false;
            } else {
                Object.keys(this.isExpandedIngredientCategory).forEach((catKey) => this.isExpandedIngredientCategory[catKey] = false);
                this.isExpandedIngredientCategory[ingredientCategoryId] = true;
            }
        },
        addIngredientById(ingredientId) {
            const selIngredient = this.$store.state.ingredients.filter((i) => i.id === ingredientId);
            if (selIngredient.length > 0) {
                this.ingredients.push({amount: '', ingredient: selIngredient[0].name, id: selIngredient[0].id, categoryId: selIngredient[0].categoryId});
            }
        },
    }
})
</script>
