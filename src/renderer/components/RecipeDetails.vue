<template>
    <div>
        <h4>Name:</h4><input type="text" v-model="currentRecipe.name" />    
    </div>
    <div>
        <h4>Genung für:</h4><input type="text" v-model="currentRecipe.serving.value" /><input type="text" v-model="currentRecipe.serving.type" />
    </div>

    <h3>Zutaten:</h3>
    <div v-for="(ingredient, index) in currentRecipe.ingredients" v-bind:key="index">
        <input type="text" v-model="ingredient.amount" />
        <input type="text" v-model="ingredient.ingredient" />
        <button type="button" @click="deleteIngredient(index)">[X]</button>
    </div>
    <div>
        <input type="text" v-model="newIngredient.amount" />
        <input type="text" v-model="newIngredient.ingredient" />
        <button type="button" @click="addIngredient()">[N]</button>
    </div>
    
    <h3>Zubereitung:</h3>
    <textarea class="prepArea" rows="20" v-model="currentRecipe.preparation" />
    <button v-show="currentRecipe.name !== ''" @click="saveRecipe" type="button">Rezept speichern</button>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RecipeDetails',
    setup() {

    },
    props: {
        recipeId: Number, 
        recipeData: Object,
    },
    data() {
      return {
          currentRecipe: this.makeEmptyRecipe(),
          newIngredient: this.makeEmptyIngredient(),
      }
    },
    watch: {
        recipeId(rid) {
            const recipes = this.$store.state.recipes.filter((recipe) => recipe.id === rid);
            if (recipes.length === 0 || recipes.length > 1) {
                return console.warn("Couldn't select recipe.")
            }
            this.currentRecipe = recipes[0];
        },
        recipeData(rdata) {
            this.currentRecipe = rdata;
        }
    },
    methods: {
        addIngredient() {
            this.currentRecipe.ingredients.push(this.newIngredient);
            this.newIngredient = this.makeEmptyIngredient();
        },
        deleteIngredient(index) {
            this.currentRecipe.ingredients.splice(index, 1);
        },
        saveRecipe() {
            this.currentRecipe.ingredients = this.currentRecipe.ingredients.filter((i) => i.amount !== '' && i.ingredient !== '');
            this.$store.dispatch('storeRecipe', this.currentRecipe);
            this.currentRecipe = this.makeEmptyRecipe();
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: ''};
        },
        makeEmptyRecipe() {
            return {name: '', serving: {value: '', type: ''}, ingredients: [], preparation: '', url: ''};
        }
    }
})
</script>

<style scoped>
.prepArea { width: 100%;}
</style>