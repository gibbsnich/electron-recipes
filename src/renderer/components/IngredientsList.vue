<template>
<!-- todo: DropDown vorhandener passender Zutaten, wenn mehr als Zeichen eingegeben wurde -->
    <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(ingredient, index) in ingredients" v-bind:key="index">
            <div class="input-group">
                <input type="text"  class="form-control" placeholder="Menge" aria-label="Menge" :value="ingredient.amount">
                <input type="text" :class="['form-control', {unknown: !ingredient.id}]" placeholder="Zutat" aria-label="Zutat" :value="ingredient.ingredient" v-on:change="ingredientChanged(index, $event)">
                <button type="button" class="btn btn-danger btn-sm" aria-label="Close" @click="deleteIngredient(index)">[X]</button>
            </div>
        </li>
        <li class="list-group-item">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Menge" aria-label="Menge" :value="newIngredient.amount">
                <input type="text" :class="['form-control', {unknown: !newIngredient.id}]" placeholder="Zutat" aria-label="Zutat" v-model="newIngredient.ingredient">
                <button type="button" class="btn btn-success btn-sm" aria-label="Close" @click="addIngredient()">[N]</button>
            </div>
        </li>
    </ul>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'IngredientsList',
    props: {
        ingredients: Array, 
    },
    data() {
        return {
            newIngredient: this.makeEmptyIngredient(),
        }
    },
    unounted() {
        this.newIngredient = this.makeEmptyIngredient();
    },
    methods: {
        ingredientChanged(ingredientIndex, event) {
            const oldIngredient = this.ingredients[ingredientIndex];
            const newIngredientValue = event.target.value.trim();
            oldIngredient.ingredient = newIngredientValue;
            this.ingredients[ingredientIndex] = oldIngredient;
            this.checkExistingIngredient(ingredientIndex);
        },
        addIngredient() {
            if (this.newIngredient.ingredient !== '') {
                this.ingredients.push(this.newIngredient);
                this.checkExistingIngredient(this.ingredients.length - 1);
                this.newIngredient = this.makeEmptyIngredient();
            }
        },
        checkExistingIngredient(index) {
            const oldIngredient = this.ingredients[index];
            const existingNewIngredient = this.$store.getters.getIngredientByIngredient(oldIngredient.ingredient);
            if (existingNewIngredient) {
                oldIngredient.id = existingNewIngredient.id;
                oldIngredient.ingredientId = existingNewIngredient.ingredientId;
            } else {
                oldIngredient.id = null;
                oldIngredient.ingredientId = null;
            }
            this.ingredients[index] = oldIngredient;
        },
        deleteIngredient(index) {
            this.ingredients.splice(index, 1);
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: '', id: null};
        },
    },
});
</script>

<style scoped>
    input.unknown { border-color: red;}
</style>