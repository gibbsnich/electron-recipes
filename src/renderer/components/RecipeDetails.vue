<template>
    <h2>{{ this.currentRecipe ? this.currentRecipe.name : '' }}</h2>
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
          currentRecipe: null,
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

        }
    }
})
</script>
