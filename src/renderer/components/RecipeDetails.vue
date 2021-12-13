<template>
    <div>
        <h4>Name:</h4><input type="text" v-model="currentRecipe.name" />    
    </div>
    <div>
        <h4>Genung für:</h4><input type="text" v-model="currentRecipe.serving.value" /><input type="text" v-model="currentRecipe.serving.type" />
    </div>

    <h3>Zutaten:</h3>
    <div v-for="ingredient in currentRecipe.ingredients" v-bind:key="ingredient">
        <input type="text" v-model="ingredient.amount" />
        <input type="text" v-model="ingredient.ingredient" />
    </div>
    <div>
        <input type="text" v-model="newIngredient.amount" />
        <input type="text" v-model="newIngredient.ingredient" />
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
          newIngredient: {amount: '', ingredient: ''},
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
        saveRecipe() {
            this.$store.commit('storeRecipe', this.currentRecipe);
            this.currentRecipe = this.makeEmptyRecipe();
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